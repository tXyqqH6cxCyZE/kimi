import React, { Component } from "react";
import { Row, Col, Card, Form, Button, Icon, message } from "antd";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import { LENDING_ENTERPRISE_TYPE, INTEREST_METHOD } from "store/actionTypes";
import {
  format,
  getSelectOption,
  formatType,
  formItemLayout,
} from "utils/format";
import { withRouter } from "react-router-dom";
import path from "config/pathConfig";
import request from "utils/http";

const FormItem = Form.Item;

class Info extends Component {
  state = {
    basicInfo: {},
    accountInfo: {},
    picInfo: [],
  };
  //下载证件函数
  download = () => {
    window.open(
      path.BASE_URL + "file/download/" + 1 + "/" + this.props.id,
      "target"
    );
  };
  componentWillMount() {
    this.props.getInfo(window.location.href);
  }
  componentDidMount() {
    this.getBasicInfo();
  }
  getBasicInfo = async () => {
    const { id } = this.props;
    await request({
      url: "register/enterprise/detail",
      method: "get",
      params: { enterpriseId: id },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({ basicInfo: res.data });
      } else {
        message.error(res.message);
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
      } else {
        message.error(res.message);
      }
    });
    await request({
      url: "file/list",
      method: "get",
      params: { relationId: id, relationType: 1 },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({ picInfo: res.data });
      } else {
        message.error(res.message);
      }
    });
  };
  render() {
    const { basicInfo, accountInfo, picInfo } = this.state;
    const { enterpriseTypeList, interestList } = this.props;
    const enterpriseType = getSelectOption(enterpriseTypeList);
    const interestType = getSelectOption(interestList);
    return (
      <div className="contain-wrapper">
        <Card title="账户资料">
          <div className="wrapper">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="基本信息" size="small">
                  <Form {...formItemLayout}>
                    <FormItem label="企业名称">
                      <span className="ant-form-text">
                        {basicInfo && basicInfo.enterpriseName}
                      </span>
                    </FormItem>
                    <FormItem label="企业类型">
                      <span className="ant-form-text">
                        {basicInfo &&
                          formatType(
                            enterpriseType,
                            basicInfo.lendingEnterpriseType
                          )}
                      </span>
                    </FormItem>
                    <FormItem label="营业执照号">
                      <span className="ant-form-text">
                        {basicInfo && basicInfo.registerMark}
                      </span>
                    </FormItem>
                    <FormItem label="法人姓名">
                      <span className="ant-form-text">
                        {basicInfo && basicInfo.legalPersonName}
                      </span>
                    </FormItem>
                    <FormItem label="法人身份证号">
                      <span className="ant-form-text">
                        {basicInfo && basicInfo.legalPersonId}
                      </span>
                    </FormItem>
                    <FormItem label="联系地址">
                      <span className="ant-form-text">
                        {basicInfo && basicInfo.postAddr}
                      </span>
                    </FormItem>
                  </Form>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="账户资料" size="small">
                  <Form {...formItemLayout}>
                    <FormItem label="开户行">
                      <span className="ant-form-text">
                        {accountInfo && accountInfo.openBankName}
                      </span>
                    </FormItem>
                    <FormItem label="开户地区">
                      <span className="ant-form-text">
                        {accountInfo && accountInfo.provinceName}
                        {accountInfo && accountInfo.cityName}
                      </span>
                    </FormItem>
                    <FormItem label="账户类型">
                      <span className="ant-form-text">
                        {accountInfo && accountInfo.bankAccountType}
                      </span>
                    </FormItem>
                    <FormItem label="开户支行">
                      <span className="ant-form-text">
                        {accountInfo && accountInfo.openSubBankName}
                      </span>
                    </FormItem>
                    <FormItem label="开户名称">
                      <span className="ant-form-text">
                        {accountInfo && accountInfo.openName}
                      </span>
                    </FormItem>
                    <FormItem label="账户号码">
                      <span className="ant-form-text">
                        {accountInfo && accountInfo.accountNo}
                      </span>
                    </FormItem>
                  </Form>
                </Card>
              </Col>
            </Row>
            <Row>
              {picInfo && picInfo.length > 0 ? (
                <Col span={24}>
                  <Card
                    title="证件资料"
                    size="small"
                    extra={<Button onClick={this.download}>下载证件</Button>}
                  >
                    <Row>
                      <Col span={24}>
                        <ul className="text1">
                          {picInfo && picInfo.length > 0
                            ? picInfo.map((item, index) => (
                                <li key={index} className="pic">
                                  <div className="icon">
                                    <Icon type="picture" />
                                  </div>
                                  {item.fileTypeDesc}
                                </li>
                              ))
                            : null}
                        </ul>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ) : null}
            </Row>
          </div>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    enterpriseTypeList: format(
      state.reducer.get("list").toJS(),
      LENDING_ENTERPRISE_TYPE
    ),
    interestList: format(state.reducer.get("list").toJS(), INTEREST_METHOD),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};

let CustomInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(Info);

let BasicInfo = (props) => <CustomInfo id={props.match.params.id} />;
export default withRouter(BasicInfo);
