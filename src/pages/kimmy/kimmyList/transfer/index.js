import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  DatePicker,
  Input,
  Icon,
  Select,
  InputNumber,
  message,
  Modal,
  Upload,
} from "antd";
import { withRouter } from "react-router-dom";
import request from "utils/http";
import { connect } from "react-redux";
import {
  format,
  getSelectOption,
  fmtMoney,
  formItemLayout,
  formatObj,
  showPic,
  download,
  formatChinese,
  getCertificate,
  beforeUploadPDFZIP,
  cfca,
  getMandom,
} from "utils/format";
import moment from "moment";
import path from "config/pathConfig";
import {
  getUserInfo,
  changeNavStatus,
  changeContentStatus,
} from "store/actionCreators";
import { getBillsAPI } from "server";
import { service } from "utils/form";

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

const props = {
  beforeUpload: beforeUploadPDFZIP,
  accept: ".zip,.pdf",
};

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
class Info extends Component {
  state = {
    kingmiInfo: {},
    enterpriseList: [],
    id: 0,
    splitKingmiVoList: [],
    currentStep: 0,
    totalStep: 0,
    modelVisible: false,
    fadadaVisible: false,
    ukeyList: [],
    signUrl: "",
    billList: [],
    kingmiId: null,
    amount: 0,
  };
  componentDidMount() {
    this.props.getInfo();
    this.getTransInfo();
    this.getBills();
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
  getTransInfo = async () => {
    let { id } = this.props.match.params;
    let { companyInfo } = this.props;

    await request({
      url: "kingmi/transfer/toNew",
      method: "get",
      params: { kingmiId: id },
    }).then((res) => {
      if (res.code === 0) {
        let {
          primaryKingmiVo,
          downEnterpriseList,
          splitKingmiVoList,
        } = res.data;
        this.setState({
          kingmiInfo: primaryKingmiVo,
        });
        let list = Object.assign({}, downEnterpriseList);
        let enterpriseList = [];
        for (let key in list) {
          if (key) {
            enterpriseList.push({
              id: key,
              name: list[key],
            });
          }
        }
        // splitKingmiVoList = splitKingmiVoList.filter(
        //   (item) =>
        //     item.holderEnterpriseId === companyInfo.enterpriseId ||
        //     item.primaryEnterpriseId === companyInfo.enterpriseId
        // );
        this.setState({
          enterpriseList,
          splitKingmiVoList,
        });
      }
    });
  };
  // add = () => {
  //   const { form } = this.props;
  //   const keys = form.getFieldValue("keys");
  //   let nextKeys = keys.concat(this.state.id++);
  //   form.setFieldsValue({
  //     keys: nextKeys,
  //   });
  // };
  // // 删除
  // remove = (k) => {
  //   const { form } = this.props;
  //   const keys = form.getFieldValue("keys");
  //   form.setFieldsValue({
  //     keys: keys.filter((key) => key !== k),
  //   });
  //   this.setState({
  //     id: 0,
  //   });
  // };
  // 提交
  getList = (arr) => {
    const { getFieldDecorator } = this.props.form;
    const { originId } = this.state;
    return arr && arr.length > 0
      ? arr.map((item, index) => {
          return (
            <Col span={8} key={item.id} style={{ marginTop: "20px" }}>
              <Card
                title={`转让单${index + 1}信息`}
                size="small"
                extra={
                  item.id === originId ? (
                    <span style={{ color: "red" }}>当前转让单</span>
                  ) : (
                    ""
                  )
                }
              >
                <Form {...formItemLayout}>
                  <FormItem label="转让单单号">
                    <span className="ant-form-text">{item.id}</span>
                  </FormItem>
                  <FormItem label="被转让方企业">
                    <span className="ant-form-text">
                      {item.holderEnterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="粮票转让金额（元）">
                    <span className="ant-form-text">{item.amount / 100}</span>
                  </FormItem>
                  <FormItem label="粮票转让日期">
                    <span className="ant-form-text">
                      {item.createdDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="到期日">
                    <span className="ant-form-text">
                      {item.dueDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="审批记录">
                    <span className="ant-form-text">
                      <ul className="record">
                        {item.fsmHistoryVoList.map((list, index) => (
                          <li key={index}>
                            {list.time.substring(0, 10)}
                            <span>{list.newStateAlias}</span>
                          </li>
                        ))}
                      </ul>
                    </span>
                  </FormItem>
                  <FormItem label="备注">
                    <span className="ant-form-text">{item.note}</span>
                  </FormItem>
                </Form>
              </Card>
            </Col>
          );
        })
      : null;
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { names } = values;
        let { id } = this.props.match.params;
        // let transfer = names.map((item) => {
        //   let json = {};
        //   json.transferDate = moment(item.transferDate).format("YYYY-MM-DD");
        //   json.dueDate = moment(item.dueDate).format("YYYY-MM-DD");
        //   json.amount = item.amount.toString();
        //   json.transferee = parseFloat(`${item.transferee}`, 10);
        //   json.note = item.note;
        //   return json;
        // });
        // let user = {};
        // (user["kingmiId"] = parseInt(id, 10)),
        //   transfer.forEach((item, index) => {
        //     user["transfer[" + index + "].kingmiId"] = -1;
        //     user["transfer[" + index + "].transferDate"] = item.transferDate;
        //     user["transfer[" + index + "].dueDate"] = item.dueDate;
        //     user["transfer[" + index + "].amount"] = item.amount;
        //     user["transfer[" + index + "].transferee"] = item.transferee;
        //     user["transfer[" + index + "].note"] = item.note;
        //   });
        const params = {
          kingmiId: Number(id),
        };
        names.forEach((item, index) => {
          params[`transfer[${index}].kingmiId`] = -1;
          params[`transfer[${index}].transferDate`] = moment(
            item.transferDate
          ).format("YYYY-MM-DD");
          params[`transfer[${index}].dueDate`] = moment(item.dueDate).format(
            "YYYY-MM-DD"
          );
          params[`transfer[${index}].amount`] = String(item.amount);
          params[`transfer[${index}].transferee`] = parseFloat(item.transferee);
          params[`transfer[${index}].note`] = item.note;
        });

        if (this.state.kingmiId === null) {
          request({
            url: "kingmi/transfer/new",
            method: "post",
            params,
          })
            .then((res) => {
              let { code, message, data: [kingmiId] = [] } = res;
              if (code === 0) {
                this.setState({
                  kingmiId,
                  amount: names[0].amount,
                  currentStep: 1,
                  totalStep: 2,
                });
                this.getCfcaList("modelVisible");
              } else {
                message.error(message);
              }
            })
            .catch((err) => {
              console.log(err, "err");
            });
        } else {
          this.getCfcaList("modelVisible");
        }
      }
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
  hideModel = () => {
    this.setState({
      ukeyList: [],
      modelVisible: false,
    });
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
    const { currentStep, requestNo, totalStep, kingmiId, amount } = this.state;
    const params = {
      action: 1,
      splitKingmiList: kingmiId,
      returnUrl:
        currentStep === totalStep
          ? `${path.CURRENT_URL}/#/transManage/blank`
          : `${path.CURRENT_URL}/#/transManage/empty`,
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
          ? "kingmi/transfer/signApprove"
          : "kingmi/transfer/signProtocol",
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
              action: 1,
              requestNo: res.data.requestNo,
              amountList: parseFloat(amount),
              splitKingmiList: parseFloat(kingmiId),
            };
            localStorage.setItem(
              "fadadaTransParams",
              JSON.stringify(fadadaParams)
            );
            // let fadadaParams = {
            //   kingmiId: params["kingmiId"],
            //   action: params["action"],
            //   requestNo: res.data.requestNo,
            // };
            // localStorage.setItem("fadadaParams", JSON.stringify(fadadaParams));
          }
        );
      } else {
        message.error(res.message);
        this.hideModel();
      }
    });
  };
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

  //限制上传文件数量为1
  handleUploadChange = (file, fileList) => {
    // fileList.shift();
  };

  render() {
    let component = null;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      kingmiInfo,
      enterpriseList,
      splitKingmiVoList,
      modelVisible,
      fadadaVisible,
      ukeyList,
      signUrl,
      billList,
    } = this.state;
    const { companyInfo } = this.props;
    const list = getSelectOption(enterpriseList);
    const promiseToPay = formatObj(kingmiInfo.promiseToPay);
    const kingmiCertificate = formatObj(kingmiInfo.kingmiCertificate);
    // getFieldDecorator("keys", { initialValue: [] });
    // const keys = getFieldValue("keys");
    // const formItems = keys.map((k) => (
    //   <Col span={8} key={k}>
    //     <Form.Item>
    //       <Card title="粮票转单信息" size="small" style={{ marginTop: "20px" }}>
    //         <Form {...formItemLayout}>
    //           <FormItem label="持单企业">
    //             {getFieldDecorator(`names[${k}]kingmiHolder`, {
    //               initialValue: companyInfo ? companyInfo.enterpriseName : "",
    //             })(<Input disabled />)}
    //           </FormItem>
    //           <FormItem label="被转让方企业">
    //             {getFieldDecorator(`names[${k}]transferee`)(
    //               <Select placeholder="请选择">{list}</Select>
    //             )}
    //           </FormItem>
    //           <FormItem label="粮票转让金额（元）">
    //             {getFieldDecorator(`names[${k}]amount`, {
    //               initialValue: "",
    //             })(
    //               <InputNumber
    //                 style={{ width: "100%", fontSize: "12px" }}
    //                 placeholder="请填写转让金额"
    //               />
    //             )}
    //           </FormItem>
    //           <FormItem label="粮票转让日期">
    //             {getFieldDecorator(`names[${k}]transferDate`, {
    //               rules: [{ type: "object" }],
    //             })(<DatePicker />)}
    //           </FormItem>
    //           <FormItem label="粮票到期日">
    //             {getFieldDecorator(`names[${k}]dueDate`, {
    //               rules: [{ type: "object" }],
    //             })(<DatePicker />)}
    //           </FormItem>
    //           <FormItem label="备注">
    //             {getFieldDecorator(`names[${k}]note`, {
    //               initialValue: "",
    //             })(<TextArea />)}
    //           </FormItem>
    //         </Form>
    //       </Card>
    //       <Icon
    //         className="dynamic-delete-button"
    //         type="minus-circle-o"
    //         onClick={() => this.remove(k)}
    //       />
    //     </Form.Item>
    //   </Col>
    // ));
    component = (
      <Card title="粮票转让信息">
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
          onOk={() => this.onKeyChange()}
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
        <div className="wrapper">
          <Row gutter={16}>
            <Col span={8}>
              <Card title="粮票信息" size="small">
                <Form {...formItemLayout}>
                  <FormItem label="粮票单号">
                    <span className="ant-form-text">{kingmiInfo.id}</span>
                  </FormItem>
                  <FormItem label="粮票持有企业">
                    <span className="ant-form-text">
                      {kingmiInfo.holderEnterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="粮票开立企业">
                    <span className="ant-form-text">
                      {kingmiInfo.openEnterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="粮票金额（元）">
                    <span className="ant-form-text">
                      {kingmiInfo.amount && fmtMoney(kingmiInfo.amount)}
                    </span>
                  </FormItem>
                  <FormItem label="开立日期">
                    <span className="ant-form-text">
                      {kingmiInfo.createdDate &&
                        kingmiInfo.createdDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="到期日">
                    <span className="ant-form-text">
                      {kingmiInfo.dueDate &&
                        kingmiInfo.dueDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="是否延期">
                    <span className="ant-form-text">
                      否{/* {formatChinese(kingmiInfo.ifDelay)} */}
                    </span>
                  </FormItem>
                  <FormItem label="是否担保">
                    <span className="ant-form-text">
                      否{/* {formatChinese(kingmiInfo.ifGuarantee)} */}
                    </span>
                  </FormItem>
                  <FormItem label="是否转让">
                    <span className="ant-form-text">
                      是{/* {formatChinese(kingmiInfo.ifTransfer)} */}
                    </span>
                  </FormItem>
                  <FormItem label="交易合同编号">
                    <span className="ant-form-text">{kingmiInfo.encode}</span>
                  </FormItem>
                  <FormItem label="备注">
                    <span className="ant-form-text">{kingmiInfo.note}</span>
                  </FormItem>
                </Form>
              </Card>
            </Col>
            <Col span={8}>
              <div className="picture-container">
                <Card title="粮票凭证资料" size="small">
                  <div className="title">
                    <h3>粮票凭证</h3>
                    {kingmiCertificate && kingmiCertificate.length > 0 ? (
                      <Button
                        onClick={() =>
                          download(kingmiInfo.kingmiCertificateFileId)
                        }
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1">{showPic(kingmiCertificate)}</div>
                  <div className="title">
                    <h3>付款承诺函</h3>
                    {promiseToPay && promiseToPay.length > 0 ? (
                      <Button
                        onClick={() => download(kingmiInfo.promiseToPayFileId)}
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1">{showPic(promiseToPay)}</div>
                </Card>
              </div>
            </Col>
          </Row>
          <Row gutter={16} className="middle" type="flex" justify="start">
            {/* {formItems} */}
            {/* <Col span={8}>
              {keys.length <= 0 ? (
                <Button
                  type="dashed"
                  style={{ width: "60%" }}
                  onClick={this.add}
                >
                  <Icon type="plus" />
                </Button>
              ) : null}
            </Col> */}
            <Col span={8}>
              <Form.Item>
                <Card
                  title="粮票转单信息"
                  size="small"
                  style={{ marginTop: "20px" }}
                >
                  <Form {...formItemLayout}>
                    {/* <FormItem label="粮票可用余额">
                      <Input disabled value={kingmiInfo.amount / 100} />
                    </FormItem> */}
                    <FormItem label="持单企业">
                      {getFieldDecorator(`names[0]kingmiHolder`, {
                        initialValue: companyInfo
                          ? companyInfo.enterpriseId
                          : "",
                      })(
                        <Select disabled>
                          <Option value={companyInfo.enterpriseId}>
                            {companyInfo ? companyInfo.enterpriseName : ""}
                          </Option>
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="被转让方企业">
                      {getFieldDecorator(`names[0]transferee`)(
                        <Select placeholder="请选择">{list}</Select>
                      )}
                    </FormItem>
                    <FormItem label="粮票转让金额（元）">
                      {getFieldDecorator(`names[0]amount`, {
                        initialValue: "",
                      })(
                        <InputNumber
                          style={{ width: "100%", fontSize: "12px" }}
                          placeholder="请填写转让金额"
                        />
                      )}
                    </FormItem>
                    <FormItem label="粮票转让日期">
                      {getFieldDecorator(`names[0]transferDate`, {
                        rules: [{ type: "object" }],
                        initialValue: moment(),
                      })(<DatePicker disabled />)}
                    </FormItem>
                    <FormItem label="粮票到期日">
                      {getFieldDecorator(`names[0]dueDate`, {
                        rules: [{ type: "object" }],
                        initialValue: moment(kingmiInfo.dueDate),
                      })(<DatePicker disabled />)}
                    </FormItem>
                    <FormItem label="备注">
                      {getFieldDecorator(`names[0]note`, {
                        initialValue: "",
                      })(<TextArea />)}
                    </FormItem>
                  </Form>
                </Card>
                {/* <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                /> */}
              </Form.Item>
            </Col>
            {splitKingmiVoList && this.getList(splitKingmiVoList)}
          </Row>

          {/* <Row gutter={16}>
            <Col span={8}>
              <FormItem label="资料上传">
                <span className="ant-form-text">
                  （文件大小为20M以内，格式为pdf或zip）
                </span>
              </FormItem>
              <FormItem label="订单合同" className="order">
                {getFieldDecorator("upload[]orderContract")(
                  <Upload {...props} onChange={this.handleUploadChange}>
                    <Button>
                      <Icon type="upload" /> 选择文件
                    </Button>
                  </Upload>
                )}
              </FormItem>
              <FormItem label="发票" className="order">
                {getFieldDecorator("upload[]receipt")(
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="请选择发票"
                    optionLabelProp="label"
                  >
                    {billList.map((item) => (
                      <Option
                        key="1"
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
            </Col>
          </Row> */}

          <Form.Item wrapperCol={{ span: 10, offset: 3 }}>
            <Button
              className="btn"
              onClick={this.handleSubmit}
              style={{ marginRight: "50px" }}
            >
              提交
            </Button>
            <Button className="btn" onClick={() => this.props.history.goBack()}>
              返回
            </Button>
          </Form.Item>
        </div>
      </Card>
    );
    return <div>{component}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
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

export default (props) => <CustomAddGold />;
