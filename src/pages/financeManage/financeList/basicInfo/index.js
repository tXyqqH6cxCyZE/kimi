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
  Select,
  Modal,
  message,
  Icon,
} from "antd";
import path from "config/pathConfig";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  changeNavStatus,
  changeContentStatus,
  getUserInfo,
} from "store/actionCreators";
import request from "utils/http";
import {
  fmtMoney,
  getMandom,
  getCertificate,
  formatObj,
  cfca,
  showPic,
  formatChinese,
  download,
  formItemLayout,
  approveRecord,
} from "utils/format";
import { service } from "utils/form";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class BasicInfo extends Component {
  state = {
    basicInfo: {},
    kingmiVo: {},
    checked: false,
    stateNum: null,
    modelVisible: false,
    values: {},
    fadadaVisible: false,
    signUrl: null,
    step: null,
  };
  componentDidMount() {
    this.props.getInfo();
    this.getBasicInfo();
  }
  hideFadada = () => {
    const { step } = this.state;
    this.setState({
      fadadaVisible: false,
    });
    this.props.changeNav(true);
    this.props.changeContent(true);
    step === 0
      ? this.sendFadada(1)
      : this.props.history.push("/financing/index");
  };

  getBasicInfo = async () => {
    const { id } = this.props.match.params;
    let stateNum;
    if (!this.props.location.query) {
      this.props.history.push("/financing/index");
      return;
    } else {
      stateNum = this.props.location.query.stateNum;
      this.setState({
        stateNum,
      });
    }
    let basicInfo = await request({
      url: "kingmi/financing/detail",
      method: "get",
      params: {
        financingId: id,
      },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          basicInfo: res.data,
          kingmiVo: res.data.kingmiVo,
        });
      } else {
        message.error(res.message);
      }
    });
  };
  // formatRole = (num) => (num === 1 ? "供应商" : "核心企业");
  RadioGroupChange = (e) => {
    let value = e.target.value;
    if (value === "2") {
      this.setState({
        checked: false,
      });
    } else {
      this.setState({
        checked: true,
      });
    }
  };
  sendFadada = (type) => {
    const { id } = this.props.match.params;
    const { requestNo, basicInfo, values } = this.state;
    let params = {
      financingId: type === 6 ? basicInfo.id : id,
      action: parseInt(values["action"], 10),
    };
    type === 1 ? (params["requestNo"] = requestNo) : null;
    params["returnUrl"] =
      type === 0
        ? `${path.CURRENT_URL}/#/financing/empty`
        : `${path.CURRENT_URL}/#/financing/blank`;
    request({
      url:
        type === 0
          ? "kingmi/financing/signApplication"
          : "kingmi/financing/signProtocol",
      method: "post",
      params,
    })
      .then((res) => {
        if (res.code === 0) {
          type === 0
            ? this.setState({
                requestNo: res.data.requestNo,
                signUrl: res.data.signUrl,
                fadadaVisible: true,
              })
            : this.setState(
                {
                  requestNo: res.data.requestNo,
                  signUrl: res.data.signUrl,
                  fadadaVisible: true,
                  step: null,
                },
                () => {
                  let params = {
                    financingId: type === 6 ? basicInfo.id : id,
                    action: parseInt(values["action"], 10),
                    requestNo:
                      type === 6 ? this.state.requestNo : res.data.requestNo,
                  };
                  type === 6 ? (params["type"] = 1) : null;
                  localStorage.setItem("fadadaParams", JSON.stringify(params));
                }
              );
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onKeyChange = (num) => {
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
            if (num === 0) {
              this.sendFadada(0);
            } else {
              this.sendFadada(6);
            }
            this.hideModel();
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  hideModel = () => {
    this.setState({
      ukeyList: [],
      modelVisible: false,
    });
  };
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
    const { stateNum } = this.state;
    this.props.form.validateFields((err, values) => {
      let { action, note } = values;
      if (!err) {
        // 待核对融资
        if (stateNum === 4 && action === "1") {
          this.getCfcaList("modelVisible", values);
          this.setState({
            step: 0,
          });
          // 待保理复审
        } else if (stateNum === 5 && action === "1") {
          this.getCfcaList("modelVisible", values);
          this.setState({
            step: 1,
          });
        } else {
          const { id } = this.props.match.params;
          let params = {
            financingId: id,
            action: parseInt(action, 10),
            note,
          };
          request({
            url: "kingmi/financing/approve",
            method: "post",
            params,
          })
            .then((res) => {
              if (res.code === 0) {
                message.success(res.message);
                this.props.history.push("/financing/index");
              } else {
                message.error(res.message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
  };
  downloadreceipt = () => {
    const { basicInfo } = this.state;
    const fields = basicInfo.receiptList.map((item) => item.fileId);
    if (fields.length > 1) {
      // 同时下载多个发票
      let multipeDownload = (fields, i) => {
        if (fields.length == i) {
          return false;
        } else {
          window.open(`${path.BASE_URL}/file/download/${fields[i]}`);
          i++;
          setTimeout(() => multipeDownload(fields, i), 500);
        }
      };
      multipeDownload(fields, 0);
    } else {
      // 1个
      download(fields[0]);
    }
  };
  render() {
    let component = null;
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
    const { getFieldDecorator } = this.props.form;
    const {
      basicInfo,
      kingmiVo,
      stateNum,
      modelVisible,
      step,
      ukeyList,
      fadadaVisible,
      signUrl,
    } = this.state;
    // 订单合同
    const orderContract = formatObj(basicInfo.orderContract);
    // 发票
    const receipt =
      basicInfo && basicInfo.receiptList && basicInfo.receiptList.length > 0
        ? basicInfo.receiptList.map((item) => {
            return (
              <li key={item.fileId} className="pic">
                <div className="icon">
                  <Icon type="picture" />
                </div>
                {item.fileName}
              </li>
            );
          })
        : [];
    // 公司章程
    const companyPolicy = formatObj(basicInfo && basicInfo.companyPolicy);
    // 财报
    const financialReport = formatObj(basicInfo && basicInfo.financialReport);

    // 粮票和付款承诺函取kingmiVo;
    const promiseToPay = formatObj(kingmiVo.promiseToPay);
    const kingmiCertificate = formatObj(kingmiVo.kingmiCertificate);
    let currentNum = step === 0 ? 0 : 6;
    component = (
      <Card title="粮票融资信息">
        <div className="wrapper">
          <Row gutter={16}>
            <Col span={8}>
              <Card title="融资单信息" size="small">
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                  <FormItem label="粮票融资金额（元）">
                    <span className="ant-form-text">
                      {basicInfo.amount && fmtMoney(basicInfo.amount)}
                    </span>
                  </FormItem>
                  <FormItem label="粮票融资到期日">
                    <span className="ant-form-text">
                      {kingmiVo &&
                        kingmiVo.dueDate &&
                        kingmiVo.dueDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="粮票融资生效日">
                    <span className="ant-form-text">
                      {basicInfo.kingmiApprovedDate &&
                        basicInfo.kingmiApprovedDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="是否协议付息">
                    <span className="ant-form-text">
                      {formatChinese(basicInfo.ifProtocolInterest)}
                    </span>
                  </FormItem>
                  <FormItem label="协议付息比例（%）">
                    <span className="ant-form-text">
                      {basicInfo.protocolInterestProportion}
                    </span>
                  </FormItem>
                  {stateNum === 3 || stateNum === 4 || stateNum === 5 ? (
                    <FormItem label="建议审批金额（元）">
                      <span className="ant-form-text">
                        {basicInfo.amount && fmtMoney(basicInfo.amount)}
                      </span>
                    </FormItem>
                  ) : null}
                  {stateNum === 4 || stateNum === 5 ? (
                    <div>
                      <FormItem label="审批金额（元）">
                        <span className="ant-form-text">
                          {basicInfo.amount && fmtMoney(basicInfo.amount)}
                        </span>
                      </FormItem>
                      <FormItem label="融资产品">
                        <span className="product">
                          {basicInfo.financialProductName}
                        </span>
                      </FormItem>
                    </div>
                  ) : null}
                </Form>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="粮票信息" size="small">
                <Form {...formItemLayout}>
                  <FormItem label="粮票单号">
                    <span className="ant-form-text"> {kingmiVo.id} </span>
                  </FormItem>
                  {/* <FormItem label="提交角色">
                    <span className="ant-form-text">
                      {this.formatRole(kingmiVo.credentialType)}
                    </span>
                  </FormItem> */}
                  <FormItem label="粮票持有企业">
                    <span className="ant-form-text">
                      {kingmiVo.holderEnterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="粮票开立企业">
                    <span className="ant-form-text">
                      {kingmiVo.openEnterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="粮票金额（元）">
                    <span className="ant-form-text">
                      {kingmiVo.amount && fmtMoney(kingmiVo.amount)}
                    </span>
                  </FormItem>
                  <FormItem label="开立日期">
                    <span className="ant-form-text">
                      {kingmiVo.createdDate &&
                        kingmiVo.createdDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="到期日">
                    <span className="ant-form-text">
                      {kingmiVo.dueDate && kingmiVo.dueDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="是否延期">
                    <span className="ant-form-text">
                      {formatChinese(kingmiVo.ifDelay)}
                    </span>
                  </FormItem>
                  <FormItem label="是否担保">
                    <span className="ant-form-text">
                      {formatChinese(kingmiVo.ifGuarantee)}
                    </span>
                  </FormItem>
                  <FormItem label="是否转让">
                    <span className="ant-form-text">
                      {formatChinese(kingmiVo.ifTransfer)}
                    </span>
                  </FormItem>
                  <FormItem label="备注">
                    <span className="ant-form-text"> {kingmiVo.note} </span>
                  </FormItem>
                </Form>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} className="middle">
            <Col span={8}>
              <div className="picture-container">
                <Card title="粮票凭证资料" size="small">
                  <div className="title">
                    <h3> 粮票 </h3>
                    {kingmiCertificate && kingmiCertificate.length > 0 ? (
                      <Button
                        onClick={() =>
                          download(kingmiVo.kingmiCertificateFileId)
                        }
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1">{showPic(kingmiCertificate)}</div>
                  <div className="title">
                    <h3> 付款承诺函 </h3>
                    {promiseToPay && promiseToPay.length > 0 ? (
                      <Button
                        onClick={() => download(kingmiVo.promiseToPayFileId)}
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1"> {showPic(promiseToPay)} </div>
                </Card>
              </div>
            </Col>
            <Col span={8}>
              <div className="picture-container">
                <Card title="证件资料" size="small">
                  <div className="title">
                    <h3> 订单合同 </h3>
                    <Button
                      onClick={() => download(basicInfo.orderContractFileId)}
                    >
                      下载证件
                    </Button>
                  </div>
                  <div className="list text1"> {showPic(orderContract)} </div>

                  <div className="title">
                    <h3> 发票 </h3>
                    {receipt && receipt.length > 0 ? (
                      <Button onClick={this.downloadreceipt}>下载证件</Button>
                    ) : null}
                  </div>
                  <div className="list text1"> {receipt} </div>
                  <div className="title">
                    <h3> 财报 </h3>
                    {financialReport && financialReport.length > 0 ? (
                      <Button
                        onClick={() =>
                          download(basicInfo.financialReportFileId)
                        }
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1"> {showPic(financialReport)} </div>
                  <div className="title">
                    <h3> 公司章程 </h3>
                    {companyPolicy && companyPolicy.length > 0 ? (
                      <Button
                        onClick={() => download(basicInfo.companyPolicyFileId)}
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1"> {showPic(companyPolicy)} </div>
                </Card>
              </div>
            </Col>
          </Row>
          <Row gutter={16} className="middle">
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
          <Card size="small">
            <Row type="flex" justify="start">
              <Col span={24}>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Item label="审核意见">
                    {getFieldDecorator("action", {
                      rules: [
                        {
                          required: true,
                          message: "请选择审核意见",
                        },
                      ],
                    })(
                      <Radio.Group onChange={this.RadioGroupChange}>
                        <Radio value="1"> 通过 </Radio>
                        <Radio value="2"> 拒绝 </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  {stateNum === 3 ? (
                    <FormItem label="选择金融产品">
                      {getFieldDecorator("financingProduct")(
                        <Select
                          placeholder="请选择"
                          style={{
                            width: "30%",
                          }}
                        >
                          <Option value="xm"> 金融产品一 </Option>
                        </Select>
                      )}
                    </FormItem>
                  ) : null}
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
                      style={{
                        marginRight: "50px",
                        width: "150px",
                      }}
                    >
                      确认
                    </Button>
                    <Button
                      onClick={() => this.props.history.go(-1)}
                      style={{
                        width: "150px",
                      }}
                    >
                      取消
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
          <Modal
            title={"提示"}
            maskClosable={false}
            visible={modelVisible}
            width={500}
            destroyOnClose
            centered
            onCancel={this.hideModel}
            onOk={() => this.onKeyChange(currentNum)}
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
            style={{
              height: "600px",
            }}
            centered
            onCancel={this.hideFadada}
            footer={null}
          >
            <iframe className="iframe" src={signUrl} />
          </Modal>
        </div>
      </Card>
    );
    return <div> {component} </div>;
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
