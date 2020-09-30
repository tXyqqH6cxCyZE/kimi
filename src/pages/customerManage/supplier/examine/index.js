//供应商入网审核页面
import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Radio,
  Input,
  Select,
  InputNumber,
  Icon,
  message,
} from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import { format, formItemLayout, approveRecord } from "utils/format";
import request from "utils/http";
import { BANK_ACCOUNT_STATUS, FAIL } from "store/actionTypes";
import path from "config/pathConfig";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class Examine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      mount: false,
      // 基本信息
      basicInfo: {},
      // 法人信息
      guaranteeInfo: {},
      // 账户信息
      accountInfo: {},
      stateNum: null,
      fileInfo: {},
      historyInfo: {},
    };
  }
  // 获取详情信息
  componentDidMount() {
    this.props.getInfo(window.location.href);
    this.getBasicInfo();
  }
  //下载证件函数
  download = () => {
    window.open(
      path.BASE_URL + "file/download/" + 1 + "/" + this.props.match.params.id,
      "target"
    );
  };
  getBasicInfo = async () => {
    const { id } = this.props.match.params;
    let stateNum;
    if (!this.props.location.query) {
      this.props.history.push("/customer/supplier");
      return;
    } else {
      stateNum = this.props.location.query.stateNum;
      this.setState({
        stateNum,
      });
    }

    // 获取基本信息
    await request({
      url: "register/basic",
      method: "get",
      params: { enterpriseId: id },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({ basicInfo: res.data });
      }
    });
    // 获取法人/担保人信息
    await request({
      url: "register/supply/legal",
      method: "get",
      params: { enterpriseId: id },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({ guaranteeInfo: res.data });
      }
    });
    // 账户信息
    await request({
      url: "register/account/view",
      method: "get",
      params: { enterpriseId: id },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({ accountInfo: res.data });
      }
    });
    await request({
      url: "file/list",
      method: "get",
      params: {
        relationId: id,
        relationType: 1,
      },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({ fileInfo: res.data });
      }
    });
    await request({
      url: "register/supplier/toAudit",
      method: "get",
      params: { supplierId: id },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          historyInfo: res.data,
        });
      } else {
        message.error(res.message);
      }
    });
  };

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { idUp, idDown } = this.state.historyInfo.relation;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {};
        params["action"] = Number(values["action"]);
        params["applyEnterprise"] = idDown;
        params["upEnterprise"] = idUp;
        if (values["suggestedCredit"]) {
          params["suggestedCredit"] = parseFloat(values["suggestedCredit"], 10);
        }
        if (values["interestMethod"]) {
          params["interestMethod"] = parseFloat(values["interestMethod"], 10);
        }
        if (values["financingRatio"]) {
          params["financingRatio"] = parseFloat(values["financingRatio"], 10);
        }
        if (values["note"]) {
          params["note"] = values["note"];
        }
        request({ url: "register/supplier/audit", method: "post", params })
          .then((res) => {
            if (res.code === 0) {
              message.success(res.message);
              this.props.history.push("/customer/supplier");
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
  showPic = (obj) => {
    if (!obj) {
      return;
    }
    return obj && obj.length > 0
      ? obj.map((item) => (
          <li key={item.fileId} className="pic">
            <div className="icon">
              <Icon type="picture" />
            </div>
            {item.fileTypeDesc}
          </li>
        ))
      : obj;
  };
  render() {
    let component = null;
    const { getFieldDecorator } = this.props.form;
    const { bankAccountStatus, id } = this.props;

    const {
      basicInfo,
      guaranteeInfo,
      accountInfo,
      fileInfo,
      stateNum,
      historyInfo,
    } = this.state;

    let currentStatus =
      bankAccountStatus &&
      bankAccountStatus.filter(
        (item) => item.id == accountInfo.accountVerification
      );
    component = (
      <Card title="审核">
        <div className="wrapper">
          <Row gutter={16}>
            <Col span={8}>
              <Card title="基本信息" size="small">
                <Form {...formItemLayout}>
                  <FormItem label="邀请企业名称">
                    <span className="ant-form-text">
                      {basicInfo.upEnterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="企业名称">
                    <span className="ant-form-text">
                      {basicInfo.enterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="公司税号">
                    <span className="ant-form-text">{basicInfo.taxId}</span>
                  </FormItem>
                  <FormItem label="营业执照号">
                    <span className="ant-form-text">
                      {basicInfo.registerMark}
                    </span>
                  </FormItem>
                  <FormItem label="法人姓名">
                    <span className="ant-form-text">
                      {guaranteeInfo.legalPersonName}
                    </span>
                  </FormItem>
                  <FormItem label="法人身份证号">
                    <span className="ant-form-text">
                      {guaranteeInfo.legalPersonId}
                    </span>
                  </FormItem>
                  <FormItem label="联系地址">
                    <span className="ant-form-text">{basicInfo.postAddr}</span>
                  </FormItem>
                </Form>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="账户资料" size="small">
                <Form {...formItemLayout}>
                  <FormItem label="开户行">
                    <span className="ant-form-text">
                      {accountInfo.openBankName}
                    </span>
                  </FormItem>
                  <FormItem label="开户地区">
                    <span className="ant-form-text">
                      {accountInfo.provinceName}
                      {accountInfo.cityName}
                    </span>
                  </FormItem>
                  <FormItem label="账户类型">
                    <span className="ant-form-text">
                      {accountInfo.bankAccountType}
                    </span>
                  </FormItem>
                  <FormItem label="开户支行">
                    <span className="ant-form-text">
                      {accountInfo.openSubBankName}
                    </span>
                  </FormItem>
                  <FormItem label="开户名称">
                    <span className="ant-form-text">
                      {accountInfo.openName}
                    </span>
                  </FormItem>
                  <FormItem label="账户号码">
                    <span className="ant-form-text">
                      {accountInfo.accountNo}
                    </span>
                  </FormItem>
                </Form>
              </Card>
            </Col>
          </Row>
          {/* <Row gutter={16} className="middle">
            {stateNum === 4 ? (
              <Col span={8}>
                <Card title="所属企业信息" size="small">
                  <Form {...formItemLayout}>
                    <FormItem label="公司名称">
                      <span className="ant-form-text">小米金服</span>
                    </FormItem>
                    <FormItem label="授信额度(元)">
                      <span className="ant-form-text">金融公司</span>
                    </FormItem>
                    <FormItem label="可用授信额度(元)">
                      <span className="ant-form-text">金融公司</span>
                    </FormItem>
                  </Form>
                </Card>
              </Col>
            ) : null} */}
          {/* {stateNum === 6 ? (
              <Col span={8}>
                <Card title="授信信息" size="small">
                  <Form {...formItemLayout}>
                    <FormItem label="授信额度(元)">
                      <span className="ant-form-text">小米金服</span>
                    </FormItem>
                    <FormItem label="融资比例">
                      <span className="ant-form-text">金融公司</span>
                    </FormItem>
                    <FormItem label="利率">
                      <span className="ant-form-text">金融公司</span>
                    </FormItem>
                  </Form>
                </Card>
              </Col>
            ) : null}
          </Row> */}
          {fileInfo && fileInfo.length > 0 ? (
            <Row
              gutter={16}
              className="middle"
              type="flex"
              justify="space-between"
            >
              <Col span={24}>
                <div className="picture-container">
                  <Card
                    title="证件资料"
                    size="small"
                    extra={<Button onClick={this.download}>下载证件</Button>}
                  >
                    <div className="list text1">
                      {fileInfo && fileInfo.length > 0
                        ? this.showPic(fileInfo)
                        : null}
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>
          ) : null}
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
                      {approveRecord(historyInfo.historyVos)}
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
                      initialValue: "1",
                    })(
                      <Radio.Group>
                        <Radio value="1">通过</Radio>
                        <Radio value="2">拒绝</Radio>
                        {/* {stateNum === 5 ? (
                          <Radio value="3">驳回上一步</Radio>
                        ) : null} */}
                      </Radio.Group>
                    )}
                  </Form.Item>
                  {stateNum === 3 ? (
                    <div>
                      <Form.Item label="授信额度（元）">
                        {getFieldDecorator("suggestedCredit", {
                          rules: [
                            { required: true, message: "请输入授信额度" },
                            {
                              pattern: /^\d{1,11}(\.\d{1,2})?$/,
                              message:
                                "纯数字、正数、小数点前最多11位、小数点后最多两位，金额大于0",
                            },
                          ],
                          initialValue:
                            stateNum === 3
                              ? historyInfo &&
                                historyInfo.relation &&
                                historyInfo.relation.suggestedCredit
                                ? historyInfo.relation.suggestedCredit / 100
                                : null
                              : "",
                        })(
                          <InputNumber
                            // disabled={stateNum === 5 ? true : false}
                            placeholder="请输入授信额度"
                            className="remark"
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="选择利率">
                        {/* {alert(
                          stateNum === 3
                            ? historyInfo &&
                              historyInfo.relation &&
                              historyInfo.relation.interestMethod
                              ? historyInfo.relation.interestMethod + ""
                              : ""
                            : null
                        )} */}
                        {getFieldDecorator("interestMethod", {
                          rules: [{ required: true, message: "请选择利率" }],
                          initialValue:
                            stateNum === 3
                              ? historyInfo &&
                                historyInfo.relation &&
                                historyInfo.relation.interestMethod
                                ? historyInfo.relation.interestMethod + ""
                                : ""
                              : null,
                        })(
                          <Select
                            className="remark"
                            placeholder="请选择"
                            // disabled={stateNum === 5 ? true : false}
                          >
                            <Option value="1">日利率</Option>
                            <Option value="2">月利率</Option>
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item label="融资比例（%）">
                        {getFieldDecorator("financingRatio", {
                          rules: [
                            { required: true, message: "请输入融资比例" },
                            { pattern: /^\d+$/, message: "请输入纯数字" },
                          ],
                          initialValue:
                            stateNum === 3
                              ? historyInfo &&
                                historyInfo.relation &&
                                historyInfo.relation.financingRatio
                                ? historyInfo.relation.financingRatio
                                : null
                              : null,
                        })(
                          <Input
                            className="remark"
                            placeholder="请输入融资比例"
                            // disabled={stateNum === 5 ? true : false}
                          />
                        )}
                      </Form.Item>
                    </div>
                  ) : null}
                  <FormItem label="备注">
                    {getFieldDecorator("note", {
                      initialValue: "",
                    })(<TextArea className="textarea" />)}
                  </FormItem>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      className="btn"
                      style={{ marginRight: "50px" }}
                    >
                      确认
                    </Button>
                    <Button
                      className="btn"
                      onClick={() =>
                        this.props.history.push("/customer/supplier")
                      }
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
  )(Form.create()(Examine))
);
