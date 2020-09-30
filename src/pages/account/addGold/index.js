//粮票开立页面（核心企业）
import React from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Upload,
  Button,
  Icon,
  message,
  Modal,
} from "antd";
import { connect } from "react-redux";
import { KINGMI_CERT_TYPE, BOOL_TYPE } from "store/actionTypes";
import path from "config/pathConfig";
import {
  format,
  getSelectOption,
  getCertificate,
  cfca,
  getMandom,
  beforeUploadPDFZIP,
} from "utils/format";
import { withRouter } from "react-router-dom";
import moment from "moment";
import request from "utils/http";
import { service } from "utils/form";
import { getBillsAPI } from "server";
import {
  getUserInfo,
  changeNavStatus,
  changeContentStatus,
} from "store/actionCreators";
const uKey = {
  labelCol: {
    xs: 24,
    sm: 4,
  },
  wrapperCol: {
    xs: 24,
    sm: 20,
  },
};
const FormItem = Form.Item;
const { TextArea } = Input;

const props = {
  beforeUpload: beforeUploadPDFZIP,
  accept: ".zip,.pdf",
};

class Info extends React.Component {
  state = {
    record: [],
    // 凭证类型
    type: 1,
    // 下游企业
    downList: [],
    // 上游企业
    upList: [],
    // 代理机构
    factoringEnterprises: [],
    amount: 0,
    // 回填信息
    basicInfo: {},
    // 订单合同列表
    orderContractList: [],
    // 发票
    receiptList: [],
    // 付款承诺函
    promiseToPayList: [],
    //其他单据
    otherFileList: [],
    orderContract: {},
    receipt: {},
    promiseToPay: {},
    otherFile: {},
    isSubmit: false,
    isCore: false,
    billList: [],
    modelVisible: false,
    fadadaVisible: false,
    ukeyList: [],
    signUrl: "",
    totalStep: 0,
    currentStep: 0,
    // isEverbrightBank: false,
    requestNo: null,
    kingmiId: null,
  };
  componentWillUnmount() {
    clearTimeout(this._timer);
  }
  getBills = async () => {
    try {
      const {
        code,
        message: msg,
        data: { list },
      } = await getBillsAPI();
      if (code === 0) {
        this.setState({
          billList: list,
        });
        return;
      }
      message.error(msg);
    } catch (error) {
      console.log(error);
    }
  };
  async componentDidMount() {
    this.getBills();
    this.props.getInfo();
    let { companyInfo, id } = this.props;
    if (companyInfo.enterpriseId) {
      await request({
        url: "kingmi/toNew",
        method: "get",
        params: { enterpriseId: companyInfo.enterpriseId },
      }).then((res) => {
        if (res.code === 0) {
          let { downList, upList, factoringEnterprises, isCore } = res.data;
          if (isCore == true) {
            this.onTypeChange(2);
          }
          this.setState({
            downList,
            upList,
            factoringEnterprises,
            isCore,
          });
        }
      });
    }
    if (id) {
      await request({
        url: "kingmi/toEdit",
        method: "get",
        params: { kingmiId: id },
      }).then((res) => {
        if (res.code === 0) {
          let basicInfo = res.data;
          this.getAmount(basicInfo.openEnterpriseId);
          let orderContract = JSON.parse(basicInfo.orderContract);
          let promiseToPay = JSON.parse(basicInfo.promiseToPay);
          let receipt = JSON.parse(basicInfo.receipt);
          let otherFile = JSON.parse(basicInfo.otherFile);
          let orderContractList = this.showPic(orderContract);
          let promiseToPayList = this.showPic(promiseToPay);
          let receiptList = this.showPic(receipt);
          let otherFileList = this.showPic(otherFile);
          this.setState({
            basicInfo,
            orderContractList,
            receiptList,
            promiseToPayList,
            otherFileList,
          });
        }
      });
    }
  }
  showPic = (arr) =>
    arr && arr.length > 0
      ? arr.map((item) => {
          return {
            uid: Math.random(),
            name: item,
          };
        })
      : [];

  onTypeChange = (value) => {
    let { companyInfo } = this.props;
    if (value === 1) {
      this.props.form.setFieldsValue({
        downEnterpriseId: companyInfo.enterpriseName,
      });
      this.props.form.setFieldsValue({ openEnterpriseId: "请选择" });
    } else {
      this.props.form.setFieldsValue({
        openEnterpriseId: companyInfo.enterpriseName,
      });
      this.props.form.setFieldsValue({ downEnterpriseId: "请选择" });
    }
    // 1 应收账款 2 应付账款
    this.setState({ type: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      orderContract,
      promiseToPay,
      receipt,
      basicInfo,
      otherFile,
      type,
    } = this.state;
    const { companyInfo } = this.props;
    this.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }
      if (fieldsValue["amount"] !== fieldsValue["receiptAmount"]) {
        message.error("开立金额和发票金额不一致，请修改");
        return;
      }
      this.setState({ isSubmit: true });
      // 应收账款
      if (type === 1) {
        fieldsValue["downEnterpriseId"] = companyInfo.enterpriseId;
        fieldsValue["openEnterpriseId"] = fieldsValue["openEnterpriseId"];
      } else {
        fieldsValue["openEnterpriseId"] = companyInfo.enterpriseId;
        fieldsValue["downEnterpriseId"] = fieldsValue["downEnterpriseId"];
      }
      let values = { ...fieldsValue };
      delete values.modal;
      Object.keys(orderContract).length > 0
        ? (values["orderContract"] = orderContract)
        : delete values["orderContract"];
      Object.keys(promiseToPay).length > 0
        ? (values["promiseToPay"] = promiseToPay)
        : delete values["promiseToPay"];
      // Object.keys(receipt).length > 0
      //   ? (values["receipt"] = receipt)
      //   : delete values["receipt"];
      Object.keys(otherFile).length > 0
        ? (values["otherFile"] = otherFile)
        : delete values["otherFile"];

      values["createdDate"] = moment(fieldsValue["createdDate"]).format(
        "YYYY-MM-DD"
      );
      values["dueDate"] = moment(fieldsValue["dueDate"]).format("YYYY-MM-DD");
      values["description"] = values["description"]
        ? values["description"]
        : "";
      values["note"] = values["note"] ? values["note"] : "";
      Object.keys(basicInfo).length > 0
        ? (values["id"] = this.props.id)
        : delete values["id"];

      if (this.state.kingmiId === null) {
        service(this.props.id ? "kingmi/edit" : "kingmi/new", values)
          .then((res) => {
            if (res.status === 200) {
              let {
                code,
                message: msg,
                data: { routeType, kingmiId } = {},
              } = res.data;
              if (code === 0) {
                this.setState({
                  kingmiId,
                  isSubmit: false,
                  currentStep: 1,
                  totalStep: routeType === 1 ? 2 : 1, //1是光大，0不是
                });
                this.getCfcaList("modelVisible");
              } else {
                this.setState({ isSubmit: false });
                message.error(msg);
              }
            }
          })
          .catch((err) => {
            console.log(err);
            this.setState({ isSubmit: false });
            if (err.response && err.response.status === 413) {
              message.error("上传文件体积太大,请重新选择上传文件");
            }
          });
      } else {
        this.setState({ isSubmit: false });
        this.getCfcaList("modelVisible");
      }
    });
  };
  handleChange = (listType, type, info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);
    this.setState({
      [listType]: fileList,
      [type]: info.file,
    });
  };
  getAmount = async () => {
    let { type } = this.state;
    let { companyInfo } = this.props;
    let { getFieldsValue } = this.props.form;
    this._timer = setTimeout(() => {
      const par = getFieldsValue([
        "factoringEnterpriseId",
        "credentialType",
        "downEnterpriseId",
      ]);
      for (const prop in par) {
        if (!par[prop]) return;
      }
      request({
        url: "credit/available",
        method: "get",
        params:
          type === 1
            ? {
                upId: par.downEnterpriseId,
                downId: companyInfo.enterpriseId,
                factoringId: par.factoringEnterpriseId,
                createKingmiType: par.credentialType,
              }
            : {
                upId: companyInfo.enterpriseId,
                downId: par.downEnterpriseId,
                factoringId: par.factoringEnterpriseId,
                createKingmiType: par.credentialType,
              },
      }).then((res) => {
        if (res.code === 0) {
          this.setState({ amount: res.data });
        }
      });
    });
  };
  getCfcaList = (type) => {
    let ukeyList = cfca();
    if (ukeyList.length > 0) {
      this.setState({
        ukeyList,
        [type]: true,
      });
    }
  };
  onKeyChange = () => {
    const CryptoAgent = document.getElementById("CryptoAgent");
    const selectedAlg = "SHA-1";
    const signSourceData = getMandom(6);
    let signedData = CryptoAgent.SignMsgPKCS7(
      signSourceData,
      selectedAlg,
      true
    );
    const bResult = CryptoAgent.VerifyMsgSignaturePKCS7Attached(
      signedData,
      "RSA"
    );
    let data = {
      enterpriseId: this.props.companyInfo.enterpriseId,
      signSourceData,
      signedData,
    };
    if (bResult) {
      service("cfca/verify", data)
        .then((res) => {
          if (res.data.code === 0) {
            this.hideModel();
            this.sendFadada();
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  sendFadada = () => {
    const { currentStep, requestNo, totalStep, kingmiId } = this.state;
    let params = {
      action: 1,
      kingmiId,
      returnUrl:
        currentStep === totalStep
          ? `${path.CURRENT_URL}/#/kimmy/blank`
          : `${path.CURRENT_URL}/#/kimmy/empty`,
      requestNo,
    };
    // let fadadaParams = {
    //   kingmiId: params["kingmiId"],
    //   action: params["action"],
    // };
    // localStorage.setItem("fadadaParams", JSON.stringify(fadadaParams));
    // num === 2 ? (params["requestNo"] = requestNo) : null;
    // 盖章请求
    request({
      url:
        currentStep === totalStep
          ? "kingmi/signApprove"
          : "kingmi/signProtocol",
      method: "post",
      params,
    }).then((res) => {
      if (res.code === 0) {
        this.setState(
          {
            requestNo: res.data.requestNo,
            signUrl: res.data.signUrl,
            fadadaVisible: true,
          },
          () => {
            let fadadaParams = {
              kingmiId: params["kingmiId"],
              action: params["action"],
              requestNo: res.data.requestNo,
            };
            localStorage.setItem("fadadaParams", JSON.stringify(fadadaParams));
          }
        );
      } else {
        message.error(res.message);
        this.hideModel();
      }
    });
  };
  // 关闭法大大展示框
  hideFadada = () => {
    const { currentStep, totalStep } = this.state;
    this.props.changeNav(true);
    this.props.changeContent(true);
    this.setState(
      { fadadaVisible: false, currentStep: currentStep + 1 },
      () => {
        currentStep >= totalStep
          ? this.props.history.push("/kimmy/index")
          : this.sendFadada();
      }
    );
  };
  //关闭uKey弹框
  hideModel = () => {
    this.setState({
      ukeyList: [],
      modelVisible: false,
    });
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { certType, boolType, companyInfo } = this.props;
    const {
      type,
      downList,
      factoringEnterprises,
      isSubmit,
      upList,
      amount,
      basicInfo,
      orderContractList,
      receiptList,
      promiseToPayList,
      otherFileList,
      isCore,
      billList,
      modelVisible,
      fadadaVisible,
      ukeyList,
      signUrl,
    } = this.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 6,
        offset: 10,
      },
    };

    // const cert = getSelectOption(certType);
    const cert = getSelectOption([
      // { id: 1, name: "应收帐款" },
      { id: 2, name: "应付帐款" },
    ]);
    const bool = getSelectOption(boolType);
    const upListType = getSelectOption(upList);
    const downListType = getSelectOption(downList);
    const factoryType = getSelectOption(factoringEnterprises);
    return (
      <div>
        <Modal
          title={"签章"}
          maskClosable={false}
          visible={fadadaVisible}
          width={1200}
          destroyOnClose
          style={{ height: "600px" }}
          centered
          onCancel={this.hideFadada}
          footer={null}
        >
          <iframe className="iframe" src={signUrl} />
        </Modal>
        <Modal
          title={"提示"}
          maskClosable={false}
          visible={modelVisible}
          width={500}
          destroyOnClose
          centered
          onOk={this.onKeyChange}
          onCancel={this.hideModel}
        >
          <Form>
            <FormItem label={"可用证书"} {...uKey}>
              {getFieldDecorator("modal[]certificate")(
                <Select placeholder="请选择">{getCertificate(ukeyList)}</Select>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Card title="粮票申请">
          <Form {...formItemLayout}>
            <Form.Item label="开立企业">
              <span className="ant-form-text">
                {companyInfo.enterpriseName}
              </span>
            </Form.Item>
            <FormItem label="凭证类型">
              {getFieldDecorator("credentialType", {
                rules: [{ required: true, message: "请选择凭证类型" }],
                initialValue: isCore
                  ? 2
                  : basicInfo
                  ? basicInfo.credentialType
                  : null,
              })(
                <Select
                  placeholder="请选择"
                  onChange={this.onTypeChange}
                  disabled={isCore == true}
                >
                  {cert}
                </Select>
              )}
            </FormItem>
            {/* {type ===1 ? (<div><FormItem label="开立企业">
                            {
                                getFieldDecorator('openEnterpriseId', {
                                    rules:[{required: true,message: '请选择开立企业'}],
                            		initialValue: basicInfo ? basicInfo.openEnterpriseId : ''
                                })
						        (   <Select placeholder="请选择" onChange= {this.getAmount}>
						              {upListType}					              
						            </Select>
						        )
                            }
                        </FormItem>	
                        <FormItem label="收款企业">
                            {
                                getFieldDecorator('downEnterpriseId', {
                                    rules:[{required: true,message: '请选择收款企业'}],
                                    initialValue: companyInfo.enterpriseName
                                    
                                })
                                (
						            <Input disabled />
						        )
                            }
                        </FormItem>
                       </div>) : (<div><FormItem label="开立企业">
                            {
                                getFieldDecorator('openEnterpriseId', {
                                    rules:[{required: true,message: '请选择开立企业'}]
                                })
						        (   <Input disabled />
						        )
                            }
                        </FormItem>
                        <FormItem label="收款企业">
                            {
                                getFieldDecorator('downEnterpriseId', {
                                    rules:[{required: true,message: '请选择收款企业'}],
                            		initialValue: basicInfo ? basicInfo.openEnterpriseId : ''
                                })
                                (
						            <Select placeholder="请选择" onChange= {this.getAmount}>
						              {downListType}				              
						            </Select>
						        )
                            }
                        </FormItem></div>)} */}
            <FormItem label="收款企业">
              {getFieldDecorator("downEnterpriseId", {
                rules: [{ required: true, message: "请选择收款企业" }],
                initialValue: basicInfo ? basicInfo.openEnterpriseId : "",
              })(
                <Select placeholder="请选择" onChange={this.getAmount}>
                  {downListType}
                </Select>
              )}
            </FormItem>
            <FormItem label="保理公司">
              {getFieldDecorator("factoringEnterpriseId", {
                rules: [{ required: true, message: "请选择保理公司" }],
                initialValue: basicInfo ? basicInfo.factoringEnterpriseId : "",
              })(
                <Select placeholder="请选择" onChange={this.getAmount}>
                  {factoryType}
                </Select>
              )}
            </FormItem>
            <Form.Item label="可用额度(￥)">
              <span className="ant-form-text">
                {isNaN(amount) ? "暂无可用额度" : amount / 100}
              </span>
            </Form.Item>
            <FormItem label="粮票金额(元)">
              {getFieldDecorator("amount", {
                rules: [
                  { required: true, message: "请输入正确的金额" },
                  {
                    pattern: /^([1-9]\d{0,11}(\.\d{1,2})?|0\.\d{1,2})$/,
                    message:
                      "纯数字、正数、小数点前最多12位、小数点后最多两位，金额大于0",
                  },
                ],
                initialValue:
                  basicInfo && basicInfo.amount ? basicInfo.amount / 100 : "",
              })(
                <Input
                  style={{ width: "100%", fontSize: "12px" }}
                  placeholder="请输入粮票金额"
                />
              )}
            </FormItem>
            <FormItem label="粮票开立日期">
              {getFieldDecorator("createdDate", {
                rules: [
                  { type: "object", required: true, message: "请选择开立日期" },
                ],
                initialValue:
                  basicInfo && basicInfo.createdDate
                    ? moment(basicInfo.createdDate, "YYYY-MM-DD")
                    : null,
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="粮票到期日">
              {getFieldDecorator("dueDate", {
                rules: [
                  { type: "object", required: true, message: "请选择到期日期" },
                ],
                initialValue:
                  basicInfo && basicInfo.dueDate
                    ? moment(basicInfo.dueDate, "YYYY-MM-DD")
                    : null,
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="是否担保">
              {getFieldDecorator("ifGuarantee", {
                rules: [
                  {
                    required: true,
                    message: "请填写是否担保",
                  },
                ],
                initialValue: 0,
              })(
                <Select disabled>
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="是否转让">
              {getFieldDecorator("ifTransfer", {
                rules: [
                  {
                    required: true,
                    message: "请填写是否转让",
                  },
                ],
                initialValue: 1,
              })(
                <Select disabled>
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="是否延期">
              {getFieldDecorator("ifDelay", {
                rules: [
                  {
                    required: true,
                    message: "请填写是否延期",
                  },
                ],
                initialValue: 0,
              })(
                <Select disabled>
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="资料上传">
              <span className="ant-form-text">
                （文件大小为50M以内，格式为pdf或zip）
              </span>
            </FormItem>
            <FormItem label="订单合同" className="order">
              {getFieldDecorator("orderContract", {
                rules: [
                  {
                    required: orderContractList.length < 1 ? true : false,
                    message: "请上传订单合同",
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (value) {
                        if (!value.fileList.length) {
                          callback("请上传订单合同");
                        }
                        if (value.file.status === "error") {
                          callback("请重新上传订单合同");
                        }
                      }
                      callback();
                    },
                  },
                ],
              })(
                <Upload
                  {...props}
                  fileList={
                    orderContractList.length > 0 ? orderContractList : false
                  }
                  onChange={this.handleChange.bind(
                    this,
                    "orderContractList",
                    "orderContract"
                  )}
                >
                  <Button>
                    <Icon type="upload" /> 选择文件
                  </Button>
                </Upload>
              )}
            </FormItem>
            <FormItem label="发票" className="order">
              {getFieldDecorator("invoiceIds", {
                rules: [
                  {
                    required: receiptList.length < 1 ? true : false,
                    message: "请上传发票",
                  },
                ],
                initialValue: basicInfo ? basicInfo.invoiceIds : "",
              })(
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="请选择发票"
                  optionLabelProp="label"
                >
                  {billList.map((item) => (
                    <Option
                      key={item.id}
                      value={item.id}
                      label={`${item.code}-${item.number}`}
                      style={{
                        overflow: "visible",
                        wordBreak: "break-all",
                        whiteSpace: "normal",
                        textOverflow: "clip",
                      }}
                    >
                      {item.buyer}，{item.code}-{item.number}，{item.amount}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="付款承诺函" className="order">
              {getFieldDecorator("promiseToPay", {
                rules: [
                  {
                    required: promiseToPayList.length < 1 ? true : false,
                    message: "请上传付款承诺函",
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (value) {
                        if (!value.fileList.length) {
                          callback("请上传付款承诺函");
                        }
                        if (value.file.status === "error") {
                          callback("请重新上传付款承诺函");
                        }
                      }
                      callback();
                    },
                  },
                ],
              })(
                <Upload
                  {...props}
                  fileList={
                    promiseToPayList.length > 0 ? promiseToPayList : false
                  }
                  onChange={this.handleChange.bind(
                    this,
                    "promiseToPayList",
                    "promiseToPay"
                  )}
                >
                  <Button>
                    <Icon type="upload" /> 选择文件
                  </Button>
                </Upload>
              )}
            </FormItem>

            <FormItem label="其他单据" className="order">
              {getFieldDecorator("otherFile")(
                <Upload
                  {...props}
                  fileList={otherFileList.length > 0 ? otherFileList : false}
                  onChange={this.handleChange.bind(
                    this,
                    "otherFileList",
                    "otherFile"
                  )}
                >
                  <Button>
                    <Icon type="upload" /> 选择文件
                  </Button>
                </Upload>
              )}
            </FormItem>
            <FormItem label="发票总金额(元)">
              {getFieldDecorator("receiptAmount", {
                rules: [
                  { required: true, message: "请输入正确的金额" },
                  {
                    pattern: /^([1-9]\d{0,11}(\.\d{1,2})?|0\.\d{1,2})$/,
                    message:
                      "纯数字、正数、小数点前最多12位、小数点后最多两位，金额大于0",
                  },
                ],
                initialValue:
                  basicInfo && basicInfo.receiptAmount
                    ? basicInfo.receiptAmount / 100
                    : "",
              })(
                <Input
                  style={{ width: "100%", fontSize: "12px" }}
                  placeholder="请输入发票金额"
                />
              )}
            </FormItem>
            <FormItem label="粮票信息描述">
              {getFieldDecorator("description", {
                initialValue: basicInfo ? basicInfo.description : "",
              })(<TextArea className="textarea" maxLength="300" />)}
            </FormItem>
            <FormItem label="备注">
              {getFieldDecorator("note", {
                initialValue: basicInfo ? basicInfo.note : "",
              })(<TextArea className="textarea" maxLength="300" />)}
            </FormItem>
            {basicInfo.fsmHistoryVoList &&
            basicInfo.fsmHistoryVoList.length > 0 ? (
              <FormItem label="审批记录">
                <ul>
                  {basicInfo.fsmHistoryVoList.map((item, index) => (
                    <li key={index}>
                      {item.time.substring(0, 10)}
                      <span>{item.newStateAlias}</span>
                    </li>
                  ))}
                </ul>
              </FormItem>
            ) : null}

            <Form.Item {...tailFormItemLayout}>
              <Button style={{ width: "50%" }} onClick={this.handleGoBack}>
                返回
              </Button>
              <Button
                disabled={isSubmit ? true : false}
                onClick={this.handleSubmit}
                style={{ width: "50%" }}
              >
                {!isSubmit ? "提交" : "数据提交中,请稍候..."}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    certType: format(state.reducer.get("list").toJS(), KINGMI_CERT_TYPE),
    boolType: format(state.reducer.get("list").toJS(), BOOL_TYPE),
    companyInfo: state.reducer.get("companyInfo").toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
    changeNav(flag) {
      dispatch(changeNavStatus(flag));
    },
    changeContent(flag) {
      dispatch(changeContentStatus(flag));
    },
  };
};
let CustomAddGold = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(Info))
);

let AddGold = (props) => <CustomAddGold id={props.match.params.id} />;
export default withRouter(AddGold);
