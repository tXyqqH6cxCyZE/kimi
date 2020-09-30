import React, { Component } from "react";
import { Row, Col, Card, Form, Button, Input, Icon } from "antd";
import { withRouter } from "react-router-dom";
import path from "config/pathConfig";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import request from "utils/http";
import { fmtMoney } from "utils/format";

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: 24,
    sm: 10,
  },
  wrapperCol: {
    xs: 24,
    sm: 14,
  },
};

class Detail extends Component {
  state = {
    // 原始粮票信息
    basicInfo: {},
    // 转让粮票
    splitKingmiVoList: [],
    stateNum: null,
    originId: null,
  };
  componentWillMount() {
    this.props.getInfo();
  }
  componentDidMount() {
    this.getBasicInfo();
  }
  back = () => {
    this.props.history.go(-1);
  };
  getBasicInfo = async () => {
    const { id } = this.props.match.params;
    let stateNum;
    let originId;
    if (!this.props.location.query) {
      this.props.history.push("/transManage/index");
      return;
    } else {
      originId = this.props.location.query.originId;
      stateNum = this.props.location.query.stateNum;
    }
    await request({
      url: "kingmi/transfer/detail",
      method: "get",
      params: {
        primaryKingmiId: id,
      },
    }).then((res) => {
      if (res.code === 0) {
        let { primaryKingmiVo, splitKingmiVoList } = res.data;
        this.setState({
          basicInfo: primaryKingmiVo,
          splitKingmiVoList,
          originId,
          stateNum,
        });
      }
    });
  };

  formatChinese = (num) => (num === 1 ? "是" : "否");
  download = (id) => {
    window.open(path.BASE_URL + "file/download/" + id, "target");
  };
  getList = (arr) => {
    const { getFieldDecorator } = this.props.form;
    const { originId, stateNum } = this.state;
    return arr && arr.length > 0
      ? arr.map((item, index) => {
          return (
            <Col
              span={8}
              key={item.id}
              style={{
                marginTop: "20px",
              }}
            >
              <Card
                title={`转让单${index + 1}信息`}
                size="small"
                extra={
                  item.id === originId ? (
                    <span
                      style={{
                        color: "red",
                      }}
                    >
                      当前转让单
                    </span>
                  ) : (
                    ""
                  )
                }
              >
                <Form {...formItemLayout}>
                  <FormItem label="转让单单号">
                    {getFieldDecorator(`names[${index}]kingmiHolder`, {
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
                  {/* <FormItem label="审批记录">
                                <span className="ant-form-text">
                                  <ul className="record">
                                    {item.fsmHistoryVoList.length > 0
                                      ? item.fsmHistoryVoList.map((list, index) => (
                                          <li key={index}>
                                            {list.time.substring(0, 10)}
                                            <span>{list.newStateAlias}</span>
                                          </li>
                                        ))
                                      : null}
                                  </ul>
                                </span>
                              </FormItem> */}
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
  format = (obj) => {
    return typeof eval("(" + obj + ")") === "object"
      ? eval("(" + obj + ")")
      : obj;
  };
  showPic = (obj) => {
    if (!obj) {
      return;
    }
    return obj && obj.length > 0
      ? obj.map((item) => (
          <li key={item} className="pic">
            <div className="icon">
              <Icon type="picture" />
            </div>
            {item}
          </li>
        ))
      : obj;
  };
  render() {
    const formItemLayout = {
      labelCol: {
        xs: 24,
        sm: 10,
      },
      wrapperCol: {
        xs: 24,
        sm: 14,
      },
    };
    const { basicInfo, splitKingmiVoList, originId, stateNum } = this.state;
    const { getFieldDecorator } = this.props.form;
    const orderContract = this.format(basicInfo.orderContract);
    const receipt = this.format(basicInfo.receipt);
    const promiseToPay = this.format(basicInfo.promiseToPay);

    const currentList = splitKingmiVoList.filter(
      (item) => item.id === originId
    );
    const kingmiProtocol =
      currentList.length > 0 && currentList[0].kingmiProtocol
        ? this.format(currentList[0].kingmiProtocol)
        : [];
    const kingmiCertificate =
      currentList.length > 0 && currentList[0].kingmiCertificate
        ? this.format(currentList[0].kingmiCertificate)
        : [];
    return (
      <div>
        <Card title="粮票转让信息">
          <div className="wrapper">
            <Row gutter={16}>
              {/* {stateNum === 2 || stateNum === 3 || stateNum === 4 ? ( */}
              <Col span={8}>
                <Card title="粮票信息" size="small">
                  <Form {...formItemLayout}>
                    <FormItem label="粮票单号">
                      <span className="ant-form-text"> {basicInfo.id} </span>
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
                        否 {/* {this.formatChinese(basicInfo.ifDelay)} */}
                      </span>
                    </FormItem>
                    <FormItem label="是否担保">
                      <span className="ant-form-text">
                        否 {/* {this.formatChinese(basicInfo.ifGuarantee)} */}
                      </span>
                    </FormItem>
                    <FormItem label="是否转让">
                      <span className="ant-form-text">
                        是 {/* {this.formatChinese(basicInfo.ifTransfer)} */}
                      </span>
                    </FormItem>
                    <FormItem label="备注">
                      <span className="ant-form-text"> {basicInfo.note} </span>
                    </FormItem>
                  </Form>
                </Card>
              </Col>
              {/* ) : null} */}
              {/* <Col span={8}>
                <div className="picture-container">
                  <Card title="证件资料" size="small">
                    <div className="title">
                      <h3> 订单合同 </h3>
                      {orderContract && orderContract.length > 0 ? (
                        <Button
                          onClick={() =>
                            this.download(basicInfo.orderContractFileId)
                          }
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">
                      {orderContract && orderContract.length > 0
                        ? this.showPic(orderContract)
                        : null}
                    </div>
                    <div className="title">
                      <h3> 发票 </h3>
                      {receipt && receipt.length > 0 ? (
                        <Button
                          onClick={() =>
                            this.download(currentList[0].receiptFileId)
                          }
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">
                      {receipt && receipt.length > 0
                        ? this.showPic(receipt)
                        : null}
                    </div>
                  </Card>
                </div>
              </Col> */}
              {/* {stateNum === 100 ? ( */}
              <Col span={8}>
                <div className="picture-container">
                  <Card
                    title="粮票凭证资料"
                    size="small"
                    // extra={
                    //   <Button
                    //     onClick={() =>
                    //       this.download(
                    //         currentList[0].kingmiCertificateFileId
                    //       )
                    //     }
                    //   >
                    //     下载证件
                    //   </Button>
                    // }
                  >
                    <div className="title">
                      <h3>粮票</h3>
                      {kingmiCertificate && kingmiCertificate.length > 0 ? (
                        <Button
                          onClick={() =>
                            this.download(
                              currentList[0].kingmiCertificateFileId
                            )
                          }
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">
                      {kingmiCertificate && kingmiCertificate.length > 0
                        ? this.showPic(kingmiCertificate)
                        : null}
                    </div>
                    <div className="title">
                      <h3>粮票转让协议</h3>
                      {kingmiProtocol && kingmiProtocol.length > 0 ? (
                        <Button
                          onClick={() =>
                            this.download(currentList[0].kingmiProtocolFileId)
                          }
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">
                      {kingmiProtocol && kingmiProtocol.length > 0
                        ? this.showPic(kingmiProtocol)
                        : null}
                    </div>
                    <div className="title">
                      <h3>付款承诺函</h3>
                      {promiseToPay && promiseToPay.length > 0 ? (
                        <Button
                          onClick={() =>
                            this.download(basicInfo.promiseToPayFileId)
                          }
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">
                      {promiseToPay && promiseToPay.length > 0
                        ? this.showPic(promiseToPay)
                        : null}
                    </div>
                  </Card>
                </div>
              </Col>
              {/* ) : null} */}
              {/* <Col span={8}>
                        <div className="picture-container">
                          <Card title="证件资料" size="small">
                            <div className="title">
                              <h3>粮票转让协议</h3>
                              {kingmiProtocol && kingmiProtocol.length > 0 ? (
                                <Button
                                  onClick={() =>
                                    this.download(currentList[0].kingmiProtocolFileId)
                                  }
                                >
                                  下载证件
                                </Button>
                              ) : null}
                            </div>
                            <div className="list text1">
                              {kingmiProtocol && kingmiProtocol.length > 0
                                ? this.showPic(kingmiProtocol)
                                : null}
                            </div>
                          </Card>
                        </div>
                      </Col> */}
            </Row>
            <Row gutter={16} className="middle">
              {/* {stateNum === 2 ||
              stateNum === 3 ||
              stateNum === 4 ||
              stateNum === 99
                ? this.getList(splitKingmiVoList)
                : this.getList(currentList)} */}
              {this.getList(currentList)}
            </Row>
            <Button
              onClick={this.back}
              style={{
                width: "150px",
              }}
            >
              返回
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}

//export default withRouter(Form.create()(Detail))

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
  )(Form.create()(Detail))
);
