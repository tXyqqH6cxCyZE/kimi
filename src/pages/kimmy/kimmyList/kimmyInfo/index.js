//粮票开立审核
import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Radio,
  Checkbox,
  Input,
  Modal,
  message,
  Upload,
  DatePicker,
  Select,
} from "antd";
import path from "config/pathConfig";
import { withRouter } from "react-router-dom";
import moment from "moment";
import request from "utils/http";
import { connect } from "react-redux";
import {
  fmtMoney,
  getMandom,
  getCertificate,
  cfca,
  formatObj,
  showPic,
  formatChinese,
  download,
  formItemLayout,
  approveRecord,
  renderReceipt,
  receiptListDownLoad,
} from "utils/format";
import { service } from "utils/form";
import {
  getUserInfo,
  changeNavStatus,
  changeContentStatus,
} from "store/actionCreators";
import { getRouterAPI } from "server";

const FormItem = Form.Item;
const { TextArea } = Input;
class BasicInfo extends Component {
  state = {
    basicInfo: {},
    checked: true,
    modelVisible: false,
    values: {},
    stateNum: null,
    credentialType: null,
    warehouseEntry: [],
    receipt: [],
    rece: {},
    ware: {},
    requestNo: null,
    fadadaVisible: false,
    signUrl: null,
    ukeyList: [],
    // step: null,
    bank: 0, // 0：普通业务  1：光大银行
  };
  componentDidMount() {
    this.props.getInfo(window.location.href);
    this.getBasicInfo();
    this.getRouter();
  }
  getRouter = async () => {
    const { id } = this.props.match.params;
    try {
      const { code, message: msg, data } = await getRouterAPI(id);
      if (code === 0) {
        this.setState({ bank: data });
        return;
      }
      message.error(msg);
    } catch (error) {
      console.log(error);
    }
  };
  // 关闭法大大展示框
  hideFadada = () => {
    this.setState({ fadadaVisible: false });
    this.props.changeNav(true);
    this.props.changeContent(true);
    this.props.history.push("/kimmy/index");
  };
  //关闭uKey弹框
  hideModel = () => {
    this.setState({
      ukeyList: [],
      modelVisible: false,
    });
  };
  getBasicInfo = async () => {
    const { id } = this.props.match.params;
    let stateNum;
    let credentialType;
    if (!this.props.location.query) {
      this.props.history.push("/kimmy/index");
      return;
    } else {
      // stateNum = 6;
      // credentialType = 1;
      stateNum = this.props.location.query.stateNum;
      credentialType = this.props.location.query.credentialType;
      this.setState({
        stateNum,
        credentialType,
      });
    }
    await request({
      url: "kingmi/detail",
      method: "get",
      params: { kingmiId: id },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          basicInfo: res.data,
        });
      }
    });
  };
  RadioGroupChange = (e) => {
    let value = e.target.value;
    if (value !== "1") {
      this.setState({
        checked: false,
      });
    } else {
      this.setState({
        checked: true,
      });
    }
  };
  // 读取uKey 展示证书
  getCfcaList = (type, values) => {
    let ukeyList = cfca();
    if (ukeyList.length > 0) {
      this.setState({
        ukeyList,
        [type]: true,
        values,
      });
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      stateNum,
      basicInfo,
      credentialType,
      rece,
      ware,
      bank,
    } = this.state;
    this.props.form.validateFields((err, values) => {
      let { action } = values;
      if (!err) {
        // 应付 (供应商审核)
        if (
          (bank === 0 &&
            credentialType === 2 &&
            stateNum === 3 &&
            action === "1") ||
          (bank === 1 &&
            credentialType === 2 &&
            stateNum === 4 &&
            action === "1")
        ) {
          this.getCfcaList("modelVisible", values);
          // this.setState({ step: 1 });
        }
        // 应收|应付(核心企业财务岗复核)
        // else if (
        //   (credentialType === 1 && stateNum === 4 && action === "1") ||
        //   (credentialType === 2 && stateNum === 2 && action === "1")
        // ) {
        //   this.getCfcaList("modelVisible", values);
        //   this.setState({ step: 0 });
        // }
        //应收|应付（待保理公司风控复审）
        // else if (
        //   (credentialType === 1 && stateNum === 8 && action === "1") ||
        //   (credentialType === 2 && stateNum === 6 && action === "1")
        // ) {
        //   this.getCfcaList("modelVisible", values);
        //   this.setState({ step: 8 });
        // }
        else {
          // let params = Object.assign({}, this.state.values, values);
          // params["kingmiId"] = basicInfo.id;
          // if (stateNum === 3)
          //   params["dueDate"] = moment(params["dueDate"]).format("YYYY-MM-DD");
          // if (stateNum === 5 && rece) params["warehouseEntry"] = rece;
          // if (stateNum === 5 && ware) params["receipt"] = ware;
          //   stateNum === 3
          //     ? (params["dueDate"] = moment(params["dueDate"]).format(
          //         "YYYY-MM-DD"
          //       ))
          //     : null;
          //   stateNum === 5 && rece ? (params["warehouseEntry"] = rece) : null;
          //   stateNum === 5 && ware ? (params["receipt"] = ware) : null;
          // params["action"] = parseInt(params["action"]);
          const params = {
            ...this.state.values,
            ...values,
            kingmiId: basicInfo.id,
            action: parseInt(action),
          };
          delete params["transactionPassword"];
          request({ url: "kingmi/approve", method: "post", params }).then(
            (res) => {
              if (res.code === 0) {
                message.success("变更成功");
                this.props.history.push("/kimmy/index");
              } else {
                message.error(res.message);
              }
              this.props.form.resetFields();
            }
          );
        }
      }
    });
  };
  sendFadada = () => {
    const { basicInfo, values, requestNo } = this.state;
    let params = {
      kingmiId: basicInfo.id,
      action: parseInt(values.action, 10),
      returnUrl: `${path.CURRENT_URL}/#/kimmy/blank`,
      requestNo,
    };
    // params["kingmiId"] = basicInfo.id;
    // params["returnUrl"] =
    //   num === 0
    //     ? `${path.CURRENT_URL}/#/kimmy/empty`
    //     : `${path.CURRENT_URL}/#/kimmy/blank`;
    // params["action"] = parseInt(values["action"], 10);
    // num === 2 ? (params["requestNo"] = requestNo) : null;

    // 盖章请求
    request({
      // url:
      //   num === 1 || num === 2 ? "kingmi/signApprove" : "kingmi/signProtocol",
      url: "kingmi/signApprove",
      method: "post",
      params,
    }).then((res) => {
      if (res.code === 0) {
        // num === 0
        //   ? this.setState({
        //       requestNo: res.data.requestNo,
        //       signUrl: res.data.signUrl,
        //       fadadaVisible: true,
        //     })
        //   :
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
      signSourceData: signSourceData,
      signedData: signedData,
    };
    if (bResult) {
      service("cfca/verify", data)
        .then((res) => {
          if (res.data.code === 0) {
            this.hideModel();
            this.sendFadada();
            // num === 0 && this.sendFadada(0);
            // num === 1 && this.sendFadada(1);
            // num === 8 && this.sendFadada(8);
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handleChange = (listType, type, info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    this.setState({ [listType]: fileList, [type]: info.file });
  };
  render() {
    const props = {
      beforeUpload: (file) => {
        return false;
      },
      accept: ".zip",
    };
    const { getFieldDecorator } = this.props.form;
    const dateFormat = "YYYY-MM-DD";
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
    let {
      basicInfo,
      stateNum,
      modelVisible,
      signUrl,
      requestNo,
      ukeyList,
      fadadaVisible,
      credentialType,
      // step,
    } = this.state;
    let orderContract = formatObj(basicInfo.orderContract);
    // let receipt = formatObj(basicInfo.receipt);
    let promiseToPay = formatObj(basicInfo.promiseToPay);
    let otherFileName = formatObj(basicInfo.otherFileName);
    let kingmiCertificate = formatObj(basicInfo.kingmiCertificate);
    let kingmiProtocol = formatObj(basicInfo.kingmiProtocol);

    // let currentNum = step === 1 ? 1 : step === 0 ? 0 : 8;
    return (
      <div>
        <Card title="粮票信息">
          <div className="wrapper">
            <Row gutter={16}>
              <Col span={6}>
                <Card title="粮票信息" size="small">
                  <Form {...formItemLayout}>
                    <FormItem label="粮票单号">
                      <span className="ant-form-text">{basicInfo.id}</span>
                    </FormItem>

                    <FormItem label="粮票持有企业">
                      <span className="ant-form-text">
                        {basicInfo.holderEnterpriseName}
                      </span>
                    </FormItem>
                    <FormItem label="粮票开立企业">
                      <span className="ant-form-text">
                        {basicInfo.openEnterpriseName}
                      </span>
                    </FormItem>
                    <FormItem label="粮票金额（元）">
                      <span className="ant-form-text">
                        {basicInfo.amount && fmtMoney(basicInfo.amount)}
                      </span>
                    </FormItem>
                    <FormItem label="开立日期">
                      <span className="ant-form-text">
                        {basicInfo.createdDate &&
                          basicInfo.createdDate.substring(0, 10)}
                      </span>
                    </FormItem>
                    <FormItem label="到期日">
                      <span className="ant-form-text">
                        {basicInfo.dueDate &&
                          basicInfo.dueDate.substring(0, 10)}
                      </span>
                    </FormItem>
                    <FormItem label="是否延期">
                      <span className="ant-form-text">
                        否{/* {formatChinese(basicInfo.ifDelay)} */}
                      </span>
                    </FormItem>
                    <FormItem label="是否担保">
                      <span className="ant-form-text">
                        否{/* {formatChinese(basicInfo.ifGuarantee)} */}
                      </span>
                    </FormItem>
                    <FormItem label="是否转让">
                      <span className="ant-form-text">
                        是{/* {formatChinese(basicInfo.ifTransfer)} */}
                      </span>
                    </FormItem>
                    <FormItem label="备注">
                      <span className="ant-form-text">{basicInfo.note}</span>
                    </FormItem>
                  </Form>
                </Card>
              </Col>
              <Col span={6}>
                <div className="picture-container">
                  <Card title="证件资料" size="small">
                    <div className="title">
                      <h3>订单合同</h3>
                      {orderContract && orderContract.length > 0 ? (
                        <Button
                          onClick={() =>
                            download(basicInfo.orderContractFileId)
                          }
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">{showPic(orderContract)}</div>

                    <div className="title">
                      <h3>发票</h3>
                      {basicInfo.receiptList &&
                      basicInfo.receiptList.length > 0 ? (
                        <Button
                          onClick={() =>
                            receiptListDownLoad(basicInfo.receiptList)
                          }
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">
                      {renderReceipt(basicInfo.receiptList)}
                    </div>

                    {/* <div className="title">
                      <h3>发票</h3>
                      {receipt && receipt.length > 0 ? (
                        <Button
                          onClick={() => download(basicInfo.receiptFileId)}
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">{showPic(receipt)}</div> */}
                    <div className="title">
                      <h3>付款承诺函</h3>
                      {promiseToPay && promiseToPay.length > 0 ? (
                        <Button
                          onClick={() => download(basicInfo.promiseToPayFileId)}
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">{showPic(promiseToPay)}</div>
                    <div className="title">
                      <h3>其他单据</h3>
                      {otherFileName && otherFileName.length > 0 ? (
                        <Button onClick={() => download(basicInfo.otherFileId)}>
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">{showPic(otherFileName)}</div>
                  </Card>
                </div>
              </Col>
              <Col span={6}>
                <div className="picture-container">
                  <Card title="粮票凭证资料" size="small">
                    <div className="title">
                      <h3>粮票</h3>
                      {kingmiCertificate && kingmiCertificate.length > 0 ? (
                        <Button
                          onClick={() =>
                            download(basicInfo.kingmiCertificateFileId)
                          }
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">
                      {showPic(kingmiCertificate)}
                    </div>
                    {kingmiProtocol && kingmiProtocol.length > 0 ? (
                      <React.Fragment>
                        <div className="title">
                          <h3>粮票开立协议</h3>

                          <Button
                            onClick={() =>
                              download(basicInfo.kingmiProtocolFileId)
                            }
                          >
                            下载证件
                          </Button>
                        </div>
                        <div className="list text1">
                          {showPic(kingmiProtocol)}
                        </div>
                      </React.Fragment>
                    ) : null}
                  </Card>
                </div>
              </Col>
              {basicInfo.registerFileName ? (
                <Col span={6}>
                  <div className="picture-container">
                    <Card title="登记资料" size="small">
                      <div className="title">
                        <h3>粮票</h3>
                        {basicInfo.registerFileName ? (
                          <Button
                            onClick={() => download(basicInfo.registerFileId)}
                          >
                            下载证件
                          </Button>
                        ) : null}
                      </div>
                      <div className="list text1">
                        <li className="pic">
                          <div className="icon">
                            <Icon type="picture" />
                          </div>
                          {basicInfo.registerFileName}
                        </li>
                      </div>
                    </Card>
                  </div>
                </Col>
              ) : null}
            </Row>
            <Row
              gutter={16}
              className="middle"
              type="flex"
              justify="space-between"
            >
              <Col span={24}>
                <Card title="审批记录" size="small">
                  <Row>
                    <Col span={24}>
                      <ul className="text">
                        {approveRecord(basicInfo.fsmHistoryVoList)}
                      </ul>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
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
                  {getFieldDecorator("certificate")(
                    <Select placeholder="请选择">
                      {getCertificate(ukeyList)}
                    </Select>
                  )}
                </FormItem>
              </Form>
            </Modal>

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
            <Card size="small">
              <Row type="flex" justify="start">
                <Col span={24}>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Item label="审核意见">
                      {getFieldDecorator("action", {
                        rules: [
                          {
                            required: true,
                            message: "请选择",
                          },
                        ],
                        initialValue: "1",
                      })(
                        <Radio.Group onChange={this.RadioGroupChange}>
                          <Radio value="1">通过</Radio>
                          <Radio value="2">拒绝</Radio>
                          {/* {stateNum === 6 || stateNum === 8 ? (
                            <Radio value="3">驳回上一步</Radio>
                          ) : null} */}
                          {/* {(credentialType === 1 && stateNum === 2) ||
                          (credentialType === 2 && stateNum === 2) ? (
                            <Radio value="4">打回修改</Radio>
                          ) : null} */}
                        </Radio.Group>
                      )}
                    </Form.Item>
                    {/* {stateNum === 4 ? (
                      <Form.Item>
                        <Checkbox checked={!this.state.checked}>
                          粮票开具协议
                        </Checkbox>
                      </Form.Item>
                    ) : null} */}
                    {/* {stateNum === 3 ? (
                      <FormItem label="粮票到期日" style={{ width: "300px" }}>
                        {getFieldDecorator("dueDate", {
                          initialValue:
                            basicInfo && basicInfo.dueDate
                              ? moment(basicInfo.dueDate, "YYYY-MM-DD")
                              : null,
                        })(<DatePicker disabled />)}
                      </FormItem>
                    ) : null} */}
                    <FormItem label="备注">
                      {getFieldDecorator("note", {
                        rules: [
                          {
                            required: !this.state.checked,
                            message: "请填写备注",
                          },
                        ],
                      })(<TextArea className="textarea" />)}
                    </FormItem>
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        style={{ marginRight: "50px", width: "150px" }}
                      >
                        确认
                      </Button>
                      <Button
                        onClick={() => this.props.history.go(-1)}
                        style={{ width: "150px" }}
                      >
                        取消
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Card>
          </div>
        </Card>
      </div>
    );
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
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(BasicInfo))
);
