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
  Upload,
  Modal,
} from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  format,
  getSelectOption,
  fmtMoney,
  formItemLayout,
  formatObj,
  showPic,
  download,
  beforeUpload,
  formatChinese,
  beforeUploadPDFZIP,
  getCertificate,
} from "utils/format";
import moment from "moment";
import {
  getUserInfo,
  changeNavStatus,
  changeContentStatus,
} from "store/actionCreators";
import request from "utils/http";

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
const tempOptions = [
  <Option
    key="1"
    value="china"
    label="China"
    style={{
      overflow: "visible",
      wordBreak: "break-all",
      whiteSpace: "normal",
      textOverflow: "clip",
    }}
  >
    <span role="img" aria-label="China">
      🇨🇳
    </span>
    ashfkjashflhaslkfhsalkhfsalkhfalskhsalkhsalkhsalkhsalkhsalkhsalashlksfahlkashsalkhaslkhfaslkh
  </Option>,
  <Option
    key="1"
    value="china1"
    label="China"
    style={{
      overflow: "visible",
      wordBreak: "break-all",
      whiteSpace: "normal",
      textOverflow: "clip",
    }}
  >
    <span role="img" aria-label="China">
      🇨🇳
    </span>
    ashfkjashflhaslkfhsalkhfsalkhfalskhsalkhsalkhsalkhsalkhsalkhsalashlksfahlkashsalkhaslkhfaslkh
  </Option>,
  <Option
    key="1"
    value="china2"
    label="China11111111111111111111111111"
    style={{
      overflow: "visible",
      wordBreak: "break-all",
      whiteSpace: "normal",
      textOverflow: "clip",
    }}
  >
    <span role="img" aria-label="China">
      🇨🇳
    </span>
    ashfkjashflhaslkfhsalkhfsalkhfalskhsalkhsalkhsalkhsalkhsalkhsalashlksfahlkashsalkhaslkhfaslkh
  </Option>,
  <Option
    value="usa"
    label="USA"
    style={{
      overflow: "visible",
      wordBreak: "break-all",
      whiteSpace: "normal",
      textOverflow: "clip",
    }}
  >
    <span role="img" aria-label="USA">
      🇨🇳
    </span>
    Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa
    (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa
    (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa
    (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa (美国)Usa
    (美国)Usa (美国)
  </Option>,
];

const FormItem = Form.Item;
const { TextArea } = Input;
class Info extends Component {
  state = {
    // 粮票信息
    kingmiInfo: {},
    enterpriseList: [],
    splitKingmiVoList: [],
    id: 0,
    originId: null,
    currentStep: 0,
    totalStep: 0,
    modelVisible: false,
    fadadaVisible: false,
    ukeyList: [],
    signUrl: "",
  };
  componentDidMount() {
    this.props.getInfo();
    this.getTransInfo();
  }
  getTransInfo = () => {
    let { id } = this.props.match.params;
    let { companyInfo } = this.props;
    const originKingmiId =
      this.props.location.query && this.props.location.query.originKingmiId;
    const originId =
      this.props.location.query && this.props.location.query.originId;
    request({
      url: "kingmi/transfer/toNew",
      method: "get",
      params: { kingmiId: originKingmiId },
    })
      .then((res) => {
        if (res.code === 0) {
          let {
            primaryKingmiVo,
            downEnterpriseList,
            splitKingmiVoList,
          } = res.data;
          this.setState({
            kingmiInfo: primaryKingmiVo,
            originId,
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
          splitKingmiVoList = splitKingmiVoList.filter(
            (item) =>
              item.holderEnterpriseId === companyInfo.enterpriseId ||
              item.primaryEnterpriseId === companyInfo.enterpriseId
          );
          this.setState({
            enterpriseList,
            splitKingmiVoList,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
  //   add = () => {
  //     const { form } = this.props;
  //     const keys = form.getFieldValue("keys");
  //     let nextKeys = keys.concat(this.state.id++);
  //     form.setFieldsValue({
  //       keys: nextKeys,
  //     });
  //   };
  // 删除
  //   remove = (k) => {
  //     const { form } = this.props;
  //     const keys = form.getFieldValue("keys");
  //     form.setFieldsValue({
  //       keys: keys.filter((key) => key !== k),
  //     });
  //     this.setState({
  //       id: 0,
  //     });
  //   };

  changeType = (arr, num) => {
    if (arr && arr.length > 0 && num) {
      return arr.filter((item) => item.id === num)[0].name;
    }
  };
  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        let { id } = this.props.match.params;
        let transfer = Array.isArray(names)
          ? names.map((item) => {
              let json = {};
              json.transferDate = moment(item.transferDate).format(
                "YYYY-MM-DD"
              );
              json.dueDate = moment(item.dueDate).format("YYYY-MM-DD");
              json.amount = parseFloat(`${item.amount}`, 10);
              json.transferee = parseFloat(`${item.transferee}`, 10);
              json.note = `${item.note}`;
              return json;
            })
          : names;

        let user = {};
        (user["kingmiId"] = parseInt(id, 10)),
          transfer.forEach((item, index) => {
            user["transfer[" + index + "].kingmiId"] = -1;
            user["transfer[" + index + "].transferDate"] = item.transferDate;
            user["transfer[" + index + "].dueDate"] = item.dueDate;
            user["transfer[" + index + "].amount"] = item.amount.toString();
            user["transfer[" + index + "].transferee"] = item.transferee;
            user["transfer[" + index + "].note"] = item.note;
          });
        request({ url: "kingmi/transfer/new", method: "post", params: user })
          .then((res) => {
            let { code, message } = res;
            if (code === 0) {
              message.success("转让成功");
              this.props.form.resetFields();
              this.getCfcaList("modelVisible");
              // this.props.history.push("/kimmy/index");
            } else {
              message.error(message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  getCfcaList = (type) => {
    let ukeyList = cfca();
    if (ukeyList.length > 0) {
      this.setState({
        ukeyList,
        [type]: true,
        currentStep: 1,
        totalStep: 2, //1是光大，0不是
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
    const { basicInfo, currentStep, requestNo, totalStep } = this.state;
    let params = {
      action: 1,
      kingmiId: basicInfo.id,
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
    } = this.state;
    const { companyInfo, boolType } = this.props;
    const list = getSelectOption(enterpriseList);
    const promiseToPay = formatObj(kingmiInfo.promiseToPay);

    // getFieldDecorator("keys", { initialValue: [] });
    // const keys = getFieldValue("keys");
    // const formItems = keys.map((k) => (
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
                <Card
                  title="证件资料"
                  size="small"
                  extra={
                    <Button
                      onClick={() => download(kingmiInfo.promiseToPayFileId)}
                    >
                      下载证件
                    </Button>
                  }
                >
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
            <Col span={8}>
              <Form.Item>
                <Card
                  title="粮票转单信息"
                  size="small"
                  style={{ marginTop: "20px" }}
                >
                  <Form {...formItemLayout}>
                    {/* <FormItem label="粮票可用余额">
                      {getFieldDecorator(`names[]kingmiHolder1`, {
                        initialValue: companyInfo
                          ? companyInfo.enterpriseName
                          : "",
                      })(<Input disabled />)}
                    </FormItem> */}
                    <FormItem label="持单企业">
                      {getFieldDecorator(`nameskingmiHolder`, {
                        initialValue: companyInfo
                          ? companyInfo.enterpriseName
                          : "",
                      })(<Input disabled />)}
                    </FormItem>
                    <FormItem label="被转让方企业">
                      {getFieldDecorator(`namestransferee`)(
                        <Select placeholder="请选择">{list}</Select>
                      )}
                    </FormItem>
                    <FormItem label="粮票转让金额（元）">
                      {getFieldDecorator(`namesamount`, {
                        initialValue: "",
                      })(
                        <InputNumber
                          style={{ width: "100%", fontSize: "12px" }}
                          placeholder="请填写转让金额"
                        />
                      )}
                    </FormItem>
                    <FormItem label="粮票转让日期">
                      {getFieldDecorator(`transferDate`, {
                        rules: [{ type: "object" }],
                        initialValue: moment(),
                      })(<DatePicker />)}
                    </FormItem>
                    <FormItem label="粮票到期日">
                      {getFieldDecorator(`namesdueDate`, {
                        rules: [{ type: "object" }],
                        initialValue: moment(),
                      })(<DatePicker />)}
                    </FormItem>
                    <FormItem label="备注">
                      {getFieldDecorator(`namesnote`, {
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
          </Row>
          {/* <Row gutter={16}>
            <Col span={8}>
              <FormItem label="资料上传">
                <span className="ant-form-text">
                  （文件大小为20M以内，格式为pdf或zip）
                </span>
              </FormItem>
              <FormItem label="订单合同" className="order">
                {getFieldDecorator("orderContract", {})(
                  <Upload {...props}>
                    <Button>
                      <Icon type="upload" /> 选择文件
                    </Button>
                  </Upload>
                )}
              </FormItem>
              <FormItem label="发票" className="order">
                {getFieldDecorator("receipt")(
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="请选择发票"
                    optionLabelProp="label"
                  >
                    {tempOptions.map((item) => {
                      return item;
                    })}
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
let NewCustomAddGold = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(Info))
);

export default () => <NewCustomAddGold />;
