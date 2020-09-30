import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Radio,
  Input,
  message,
  Select,
} from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import request from "utils/http";
import {
  fmtMoney,
  formatObj,
  showPic,
  download,
  formItemLayout,
  approveRecord,
} from "utils/format";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class Modify extends Component {
  state = {
    basicInfo: {},
    kingmiVo: {},
    checked: false,
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
      url: "kingmi/financing/detail",
      method: "get",
      params: { financingId: id },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          basicInfo: res.data,
          kingmiVo: res.data.kingmiVo,
        });
      }
    });
  };

  // 单选框切换
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

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { id } = this.props.match.params;
        let params = {
          financingId: id,
          action: parseInt(values.action, 10),
          note: values.note,
          suggestedAmount: parseFloat(values.suggestedAmount, 10),
        };
        request({ url: "kingmi/financing/approve", method: "post", params })
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
    });
  };

  render() {
    let component = null;
    const { getFieldDecorator } = this.props.form;
    const { basicInfo, kingmiVo } = this.state;
    const orderContract = formatObj(kingmiVo.orderContract);
    const receipt = formatObj(kingmiVo.receipt);
    const promiseToPay = formatObj(basicInfo.promiseToPay);
    const kingmiCertificate = formatObj(kingmiVo.kingmiCertificate);

    component = (
      <Card title="粮票融资信息">
        <div className="wrapper">
          <Row gutter={16}>
            <Col span={8}>
              <Card title="融资单信息" size="small">
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                  <FormItem label="粮票融资金额（元）">
                    <span className="ant-form-text">
                      {basicInfo &&
                        basicInfo.amount &&
                        fmtMoney(basicInfo.amount)}
                    </span>
                  </FormItem>
                  <FormItem label="粮票融资到期日">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.dueDate}
                    </span>
                  </FormItem>
                  <FormItem label="粮票生效日期">
                    <span className="ant-form-text">
                      {basicInfo && basicInfo.kingmiApprovedDate}
                    </span>
                  </FormItem>
                  <FormItem label="是否协议付息">
                    <span className="ant-form-text">
                      {basicInfo && basicInfo.ifProtocolInterest}
                    </span>
                  </FormItem>
                  <FormItem label="协议付息比例（%）">
                    <span className="ant-form-text">
                      {basicInfo && basicInfo.protocolInterestProportion}
                    </span>
                  </FormItem>
                </Form>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="粮票信息" size="small">
                <Form {...formItemLayout}>
                  <FormItem label="粮票单号">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.id}
                    </span>
                  </FormItem>
                  <FormItem label="提交角色">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.credentialType}
                    </span>
                  </FormItem>
                  <FormItem label="粮票持有企业">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.holderEnterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="粮票开立企业">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.openEnterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="粮票金额（元）">
                    <span className="ant-form-text">
                      {kingmiVo && fmtMoney(kingmiVo.amount)}
                    </span>
                  </FormItem>
                  <FormItem label="开立日期">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.createdDate}
                    </span>
                  </FormItem>
                  <FormItem label="到期日">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.dueDate}
                    </span>
                  </FormItem>
                  <FormItem label="是否延期">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.ifDelay}
                    </span>
                  </FormItem>
                  <FormItem label="是否担保">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.ifGuarantee}
                    </span>
                  </FormItem>
                  <FormItem label="是否转让">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.ifTransfer}
                    </span>
                  </FormItem>
                  <FormItem label="备注">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.note}
                    </span>
                  </FormItem>
                </Form>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} className="middle">
            <Col span={8}>
              <div className="picture-container">
                <Card title="证件资料" size="small">
                  <div className="title">
                    <h3>订单合同</h3>
                    <Button
                      onClick={() => download(basicInfo.orderContractFileId)}
                    >
                      下载证件
                    </Button>
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
                  <div className="list text1">{showPic(receipt)}</div>
                  <div className="title">
                    <h3>其他单据</h3>
                    {promiseToPay && promiseToPay.length > 0 ? (
                      <Button
                        onClick={() => download(basicInfo.promiseToPayFileId)}
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
                <Card
                  title="粮票凭证资料"
                  size="small"
                  extra={
                    kingmiVo.kingmiCertificateFileId > 0 ? (
                      <Button
                        onClick={() =>
                          download(kingmiVo.kingmiCertificateFileId)
                        }
                      >
                        下载证件
                      </Button>
                    ) : null
                  }
                >
                  <div className="list text1">
                    {kingmiVo.kingmiCertificateFileId > 0
                      ? showPic(kingmiCertificate)
                      : null}
                  </div>
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
                        <Radio value="1">通过</Radio>
                        <Radio value="2">拒绝</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  <Form.Item label="建议审批金额（元）">
                    {getFieldDecorator("suggestedAmount", {
                      rules: [
                        {
                          pattern: /^\d{1,11}(\.\d{1,2})?$/,
                          message:
                            "纯数字、正数、小数点前最多11位、小数点后最多两位，金额大于0",
                        },
                      ],
                      initialValue:
                        basicInfo && basicInfo.suggestedAmount / 100,
                    })(
                      <Input
                        placeholder="请输入金额"
                        style={{ width: "30%" }}
                      />
                    )}
                  </Form.Item>
                  <FormItem label="选择金融产品">
                    {getFieldDecorator("financingProduct")(
                      <Select placeholder="请选择" style={{ width: "30%" }}>
                        <Option value="xm">金融产品一</Option>
                      </Select>
                    )}
                  </FormItem>
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
    );
    return <div>{component}</div>;
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
  )(Form.create()(Modify))
);
