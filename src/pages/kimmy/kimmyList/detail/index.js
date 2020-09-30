import React, { Component } from "react";
import { Row, Col, Card, Form, Button, Icon } from "antd";
import request from "utils/http";
import {
  fmtMoney,
  approveRecord,
  formatObj,
  formItemLayout,
  showPic,
  formatChinese,
  download,
  renderReceipt,
  receiptListDownLoad,
} from "utils/format";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";

const FormItem = Form.Item;

class Detail extends Component {
  state = {
    basicInfo: {},
  };
  componentWillMount() {
    this.props.getInfo();
  }
  componentDidMount() {
    this.getBasicInfo();
  }
  getBasicInfo = async () => {
    const { id } = this.props.match.params;
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

  render() {
    let { basicInfo } = this.state;
    let orderContract = formatObj(basicInfo.orderContract);
    // let receipt = formatObj(basicInfo.receipt);
    // let receiptList = formatObj(JSON.stringify(basicInfo.receiptList));
    let promiseToPay = formatObj(basicInfo.promiseToPay);
    let otherFileName = formatObj(basicInfo.otherFileName);
    let kingmiCertificate = formatObj(basicInfo.kingmiCertificate);
    let kingmiProtocol = formatObj(basicInfo.kingmiProtocol);
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
                        <h3>登记资料</h3>
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
            <Button
              style={{ width: "150px" }}
              onClick={() => this.props.history.go(-1)}
            >
              返回
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Detail)
);
