import React, { Component } from "react";
import { Row, Col, Card, Form, Button, Icon, message } from "antd";
import { withRouter } from "react-router-dom";
import request from "utils/http";
import copy from "copy-to-clipboard";
import path from "config/pathConfig";
import { fmtMoney, formItemLayout } from "utils/format";

const FormItem = Form.Item;

class CoreEnterpriseInfo extends Component {
  state = {
    // 基本信息
    basicInfo: {},
    // 账户信息
    accountInfo: {},
    picInfo: [],
  };
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
  //下载证件函数
  download = () => {
    window.open(
      path.BASE_URL + "file/download/" + 1 + "/" + this.props.id,
      "target"
    );
  };
  // 复制链接
  copyContent() {
    copy(this.webSite.innerHTML);
    message.success("已复制好，可贴粘。");
  }
  render() {
    const { basicInfo, accountInfo, picInfo } = this.state;
    return (
      <div>
        <Card title="企业资料">
          <div className="wrapper">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="基本信息" size="small">
                  <Form {...formItemLayout}>
                    <FormItem label="邀请链接">
                      <span className="ant-form-text">
                        <span className="link">
                          <span
                            ref={(webSite) => (this.webSite = webSite)}
                            // className="site"//打点
                            style={{
                              width: "90%",
                              overflowX: "scroll",
                            }}
                          >
                            {basicInfo && basicInfo.inviteLink}
                          </span>
                          <span
                            className="copy"
                            onClick={this.copyContent.bind(this)}
                          >
                            复制
                          </span>
                        </span>
                      </span>
                    </FormItem>
                    <FormItem label="企业名称">
                      <span className="ant-form-text">
                        {basicInfo && basicInfo.enterpriseName}
                      </span>
                    </FormItem>
                    <FormItem label="公司税号">
                      <span className="ant-form-text">
                        {basicInfo && basicInfo.taxId}
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
                <Card title="银行账户" size="small">
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
                    {/* <FormItem label="授信额度(元)">
                      <span className="ant-form-text">
                        {accountInfo &&
                          accountInfo.totalCredit &&
                          fmtMoney(accountInfo.totalCredit)}
                      </span>
                    </FormItem>
                    <FormItem label="可用授信额度(元)">
                      <span className="ant-form-text">
                        {accountInfo &&
                          accountInfo.totalAvailableCredit &&
                          fmtMoney(accountInfo.totalAvailableCredit)}
                      </span>
                    </FormItem> */}
                  </Form>
                </Card>
              </Col>
            </Row>
            <Row>
              {picInfo && picInfo.length > 0 ? (
                <Col span={24}>
                  <Card
                    title="资料证件"
                    size="small"
                    extra={<Button onClick={this.download}>下载证件</Button>}
                  >
                    <Row>
                      <Col span={24}>
                        <ul className="text1">
                          {picInfo && picInfo.length > 0
                            ? picInfo.map((item) => (
                                <li key={item.fileId} className="pic">
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

let BasicInfo = (props) => <CoreEnterpriseInfo id={props.match.params.id} />;

export default withRouter(BasicInfo);
