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
  Select,
} from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getUserInfo,
  changeNavStatus,
  changeContentStatus,
} from "store/actionCreators";
import request from "utils/http";
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
} from "utils/format";
import path from "config/pathConfig";
import { service } from "utils/form";

const FormItem = Form.Item;
const { TextArea } = Input;

class Detail extends Component {
  state = {
    splitKingmiVoList: [],
    basicInfo: {},
    splitId: null,
    stateNum: null,
    checked: true,
    values: {},
    requestNo: null,
    signUrl: null,
    ukeyList: [],
    fadadaVisible: false,
    // step: null,
    currentStep: 0,
    totalStep: 0,
  };
  hideFadada = () => {
    const { currentStep, totalStep } = this.state;
    this.props.changeNav(true);
    this.props.changeContent(true);
    this.setState(
      { fadadaVisible: false, currentStep: currentStep + 1 },
      () => {
        currentStep >= totalStep
          ? this.props.history.push("/transManage/index")
          : this.sendFadada();
      }
    );
  };
  componentDidMount() {
    this.props.getInfo();
    this.getBasicInfo();
  }
  getBasicInfo = async () => {
    const { id } = this.props.match.params;
    let splitId;
    let stateNum;
    if (!this.props.location.query) {
      this.props.history.push("/transManage/index");
      return;
    } else {
      splitId = this.props.location.query.splitId;
      stateNum = this.props.location.query.stateNum;
    }
    await request({
      url: "kingmi/transfer/detail",
      method: "get",
      params: { primaryKingmiId: id },
    }).then((res) => {
      if (res.code === 0) {
        let { primaryKingmiVo, splitKingmiVoList } = res.data;
        this.setState({
          basicInfo: primaryKingmiVo,
          splitKingmiVoList,
          splitId,
          stateNum,
        });
      }
    });
  };
  RadioGroupChange = (e) => {
    let value = e.target.value;
    if (value === "2" || value === "4") {
      this.setState({
        checked: false,
      });
    } else {
      this.setState({
        checked: true,
      });
    }
  };
  getCfcaList = (type, values) => {
    let ukeyList = cfca();
    if (ukeyList.length > 0) {
      this.setState({
        ukeyList,
        [type]: true,
        values,
        currentStep: 1,
        totalStep: 2,
      });
    }
  };
  // 表单提交
  handleSubmit = (e) => {
    // const { stateNum } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const { action } = values;
      if (action === "1") {
        this.getCfcaList("modelVisible", values);
      } else {
        const { names, action, note } = values;
        let currentList = names.filter(
          (item) => item.kingmiId == this.state.splitId
        );
        let params = {
          splitKingmiList: currentList[0].kingmiId,
          action: parseInt(action),
          note,
        };
        request({ url: "kingmi/transfer/approve", method: "post", params })
          .then((res) => {
            if (res.code === 0) {
              message.success(res.message);
              this.props.history.push("/transManage/index");
            } else {
              message.error(res.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      // if (!err) {
      //   if (
      //     stateNum === 2 &&
      //     action === "1"
      //     // || (stateNum === 6 && action === "1")
      //   ) {
      //     this.getCfcaList("modelVisible", values);
      //   } else {
      //     const { names } = values;
      //     let currentList = names.filter(
      //       (item) => item.kingmiId == this.state.splitId
      //     );
      //     let params = {
      //       splitKingmiList: currentList[0].kingmiId,
      //       action: parseInt(action, 10),
      //       note,
      //     };
      //     stateNum === 3
      //       ? (params["amountList"] = parseFloat(currentList[0].amount, 10))
      //       : null;
      //     request({ url: "kingmi/transfer/approve", method: "post", params })
      //       .then((res) => {
      //         if (res.code === 0) {
      //           message.success(res.message);
      //           this.props.history.push("/transManage/index");
      //         } else {
      //           message.error(res.message);
      //         }
      //       })
      //       .catch((err) => {
      //         console.log(err);
      //       });
      //   }
      // }
    });
  };
  sendFadada = () => {
    // this.setState({ step: num });
    const { names, action } = this.state.values;
    const { requestNo, splitId, currentStep, totalStep } = this.state;
    let currentList = names.filter((item) => item.kingmiId == splitId);

    // let params = {
    //   splitKingmiList: currentList[0].kingmiId,
    //   action: parseInt(action, 10),
    // };
    // params["returnUrl"] =
    //   num === 0
    //     ? `${path.CURRENT_URL}/#/transManage/empty`
    //     : `${path.CURRENT_URL}/#/transManage/blank`;
    // num === 1 ? (params["requestNo"] = requestNo) : null;

    const params = {
      action: parseInt(action),
      splitKingmiList: currentList[0].kingmiId,
      returnUrl:
        currentStep === totalStep
          ? `${path.CURRENT_URL}/#/transManage/blank`
          : `${path.CURRENT_URL}/#/transManage/empty`,
      requestNo,
    };
    request({
      url:
        currentStep === totalStep
          ? "kingmi/transfer/signApprove"
          : "kingmi/transfer/signProtocol",
      method: "post",
      params,
    })
      .then((res) => {
        if (res.code === 0) {
          this.setState(
            {
              requestNo: res.data.requestNo,
              signUrl: res.data.signUrl,
              fadadaVisible: true,
            },
            () => {
              let fadadaParams = {
                action,
                requestNo: res.data.requestNo,
                amountList: parseFloat(currentList[0].amount),
                splitKingmiList: parseFloat(currentList[0].kingmiId),
              };
              localStorage.setItem(
                "fadadaTransParams",
                JSON.stringify(fadadaParams)
              );
            }
          );
        } else {
          message.error(res.message);
          this.hideModel();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  hideModel = () => {
    this.setState({
      ukeyList: [],
      modelVisible: false,
    });
  };
  // 删除
  remove = (id) => {
    let { splitKingmiVoList } = this.state;
    let restList = splitKingmiVoList.filter((item) => item.id !== id);
    this.setState({
      splitKingmiVoList: restList,
    });
  };
  getList = (arr) => {
    const { getFieldDecorator } = this.props.form;
    const { splitId, stateNum } = this.state;
    return arr && arr.length > 0
      ? arr.map((item, index) => {
          return (
            <Col span={8} key={item.id} style={{ marginTop: "20px" }}>
              <Card
                title={`转让单${index + 1}信息`}
                size="small"
                extra={
                  item.id === splitId ? (
                    <span style={{ color: "red" }}>当前转让单</span>
                  ) : (
                    ""
                  )
                }
              >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                  <FormItem label="转让单单号">
                    {getFieldDecorator(`names[${index}]kingmiId`, {
                      initialValue: item.id,
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem label="被转让方企业">
                    {getFieldDecorator(`names[${index}]transferee`, {
                      initialValue: item.holderEnterpriseName,
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem label="粮票转让金额（元）">
                    {getFieldDecorator(`names[${index}]amount`, {
                      initialValue: item.amount / 100,
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem label="粮票转让日期">
                    {getFieldDecorator(`names[${index}]transferDate`, {
                      initialValue: item.createdDate.substring(0, 10),
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem label="到期日">
                    {getFieldDecorator(`names[${index}]dueDate`, {
                      initialValue: item.dueDate.substring(0, 10),
                    })(<Input disabled />)}
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
                    {getFieldDecorator(`names[${index}]note`, {
                      initialValue: item.note,
                    })(<TextArea disabled />)}
                  </FormItem>
                </Form>
              </Card>
            </Col>
          );
        })
      : null;
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
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
      modelVisible,
      splitKingmiVoList,
      splitId,
      stateNum,
      signUrl,
      requestNo,
      ukeyList,
      fadadaVisible,
    } = this.state;
    let [currentList] = splitKingmiVoList.filter((item) => item.id === splitId);
    const promiseToPay = formatObj(basicInfo.promiseToPay);
    const orderContract = formatObj(basicInfo.orderContract);
    const receipt = formatObj(basicInfo.receipt);
    const kingmiProtocol = currentList && formatObj(currentList.kingmiProtocol);
    const kingmiCertificate =
      currentList && formatObj(currentList.kingmiCertificate);
    component = (
      <Card title="粮票转让信息">
        <div className="wrapper">
          {/* {stateNum === 2 || stateNum === 3 || stateNum === 4 ? (
            <Row gutter={16}>
              <Col span={8}>
                <Card title="粮票信息" size="small">
                  <Form {...formItemLayout}>
                    <FormItem label="粮票单号">
                      <span className="ant-form-text">{basicInfo.id}</span>
                    </FormItem>
                    <FormItem label="提交角色">
                      <span className="ant-form-text">业务岗</span>
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
                        {formatChinese(basicInfo.ifDelay)}
                      </span>
                    </FormItem>
                    <FormItem label="是否担保">
                      <span className="ant-form-text">
                        {formatChinese(basicInfo.ifGuarantee)}
                      </span>
                    </FormItem>
                    <FormItem label="是否转让">
                      <span className="ant-form-text">
                        {formatChinese(basicInfo.ifTransfer)}
                      </span>
                    </FormItem>
                    <FormItem label="备注">
                      <span className="ant-form-text">{basicInfo.note}</span>
                    </FormItem>
                  </Form>
                </Card>
              </Col>
            </Row>
          ) : null} */}
          <Row gutter={16} className="middle">
            <Col span={8}>
              <div className="picture-container">
                <Card title="证件资料" size="small">
                  {/* <div className="title">
                    <h3>订单合同</h3>
                    {orderContract && orderContract.length > 0 ? (
                      <Button
                        onClick={() => download(basicInfo.orderContractFileId)}
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1">{showPic(orderContract)}</div>
                  <div className="title">
                    <h3>发票</h3>
                    {receipt && receipt.length > 0 ? (
                      <Button onClick={() => download(basicInfo.receiptFileId)}>
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1">{showPic(receipt)}</div> */}
                  <div className="title">
                    <h3>付款承诺函</h3>
                    {promiseToPay && promiseToPay.length > 0 ? (
                      <Button
                        onClick={() => download(currentList.promiseToPayFileId)}
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1">{showPic(promiseToPay)}</div>
                </Card>
              </div>
            </Col>
            <Col span={8}>
              <div className="picture-container">
                <Card title="粮票凭证资料" size="small">
                  <div className="title">
                    <h3>粮票</h3>
                    {kingmiCertificate && kingmiCertificate.length > 0 ? (
                      <Button
                        onClick={() =>
                          download(currentList.kingmiCertificateFileId)
                        }
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1">{showPic(kingmiCertificate)}</div>
                  <div className="title">
                    <h3>粮票转让协议</h3>
                    {kingmiProtocol && kingmiProtocol.length > 0 ? (
                      <Button
                        onClick={() =>
                          download(currentList.kingmiProtocolFileId)
                        }
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1">{showPic(kingmiProtocol)}</div>
                </Card>
              </div>
            </Col>
          </Row>
          <Row gutter={16} className="middle">
            {/* {stateNum === 2 || stateNum === 3 || stateNum === 4
     
            {/* {this.getList(splitKingmiVoList)} */}
            {/* {this.getList(currentList)} */}
            {currentList && (
              <Col span={8} style={{ marginTop: "20px" }}>
                <Card title={`转让单1信息`} size="small">
                  <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <FormItem label="转让单单号">
                      {getFieldDecorator(`names[0]kingmiId`, {
                        initialValue: currentList.id,
                      })(<Input disabled />)}
                    </FormItem>
                    <FormItem label="被转让方企业">
                      {getFieldDecorator(`names[0]transferee`, {
                        initialValue: currentList.holderEnterpriseName,
                      })(<Input disabled />)}
                    </FormItem>
                    <FormItem label="粮票转让金额（元）">
                      {getFieldDecorator(`names[0]amount`, {
                        initialValue: currentList.amount / 100,
                      })(<Input disabled />)}
                    </FormItem>
                    <FormItem label="粮票转让日期">
                      {getFieldDecorator(`names[0]transferDate`, {
                        initialValue: currentList.createdDate.substring(0, 10),
                      })(<Input disabled />)}
                    </FormItem>
                    <FormItem label="到期日">
                      {getFieldDecorator(`names[0]dueDate`, {
                        initialValue: currentList.dueDate.substring(0, 10),
                      })(<Input disabled />)}
                    </FormItem>
                    {/* <FormItem label="审批记录">
                      <span className="ant-form-text">
                        <ul className="record">
                          {currentList.fsmHistoryVoList.map((list, index) => (
                            <li key={index}>
                              {list.time.substring(0, 10)}
                              <span>{list.newStateAlias}</span>
                            </li>
                          ))}
                        </ul>
                      </span>
                    </FormItem> */}
                    <FormItem label="备注">
                      {getFieldDecorator(`names[0]note`, {
                        initialValue: currentList.note,
                      })(<TextArea disabled />)}
                    </FormItem>
                  </Form>
                </Card>
              </Col>
            )}
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
                      {currentList && currentList.fsmHistoryVoList.length > 0
                        ? currentList.fsmHistoryVoList.map((item, index) => (
                            <li key={index}>
                              {item.time.substring(0, 10)}
                              <span>{item.newStateAlias}</span>
                            </li>
                          ))
                        : null}
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
                      required: true,
                      initialValue: "1",
                    })(
                      <Radio.Group onChange={this.RadioGroupChange}>
                        <Radio value="1">通过</Radio>
                        <Radio value="2">拒绝</Radio>
                        {/* {stateNum === 2 || stateNum === 4 ? (
                          <Radio value="4">打回修改</Radio>
                        ) : null} */}
                      </Radio.Group>
                    )}
                  </Form.Item>
                  {/* {stateNum === 2 || stateNum === 6 ? (
                    <Form.Item>
                      <Checkbox checked={this.state.checked}>
                        转让申请书
                      </Checkbox>
                    </Form.Item>
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
          <Modal
            title={"提示"}
            maskClosable={false}
            visible={modelVisible}
            width={500}
            destroyOnClose
            centered
            onCancel={this.hideModel}
            onOk={this.onKeyChange}
          >
            <Form>
              <FormItem label="可用证书" {...uKey}>
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
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(Detail))
);
