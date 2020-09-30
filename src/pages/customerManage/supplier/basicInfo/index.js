import React, { Component } from "react";
import { Row, Col, Card, Button, Icon, Form, message } from "antd";
import request from "utils/http";
import path from "config/pathConfig";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import { fmtMoney } from "utils/format";

const FormItem = Form.Item;

class BasicInfo1 extends Component {
  state = {
    checked: false,
    mount: false,
    // 基本信息
    basicInfo: {},
    // 法人信息
    guaranteeInfo: {},
    // 账户信息
    accountInfo: {},
    fileInfo: {},
    historyInfo: {},
    //企业关联信息
    // enterPriseInfo: [],
  };
  componentWillMount() {
    this.props.getInfo(window.location.href);
  }
  // 获取详情信息
  componentDidMount() {
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
    // 企业关联信息
    // await request({
    //   url: "credit/relations",
    //   method: "get",
    //   params: {
    //     pageNum: 1,
    //     pageSize: 1,
    //     enterpriseId: id,
    //   },
    // }).then((res) => {
    //   if (res.code === 0) {
    //     let { pageInfo } = res.data;
    //     this.setState({
    //       enterPriseInfo: pageInfo && pageInfo.list,
    //     });
    //   }
    // });

    // 获取基本信息
    await request({
      url: "register/enterprise/detail",
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
        this.setState({ historyInfo: res.data });
      } else {
        message.error(res.message);
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
  back = () => {
    this.props.history.go(-1);
  };
  render() {
    let component = null;
    const formItemLayout = {
      labelCol: {
        xs: 24,
        sm: 9,
      },
      wrapperCol: {
        xs: 24,
        sm: 15,
      },
    };
    const {
      basicInfo,
      guaranteeInfo,
      accountInfo,
      fileInfo,
      historyInfo,
    } = this.state;
    component = (
      <Card title="企业资料">
        <div className="wrapper">
          <Row gutter={16}>
            <Col span={8}>
              <Card title="基本信息" size="small">
                <Form {...formItemLayout}>
                  <FormItem label="邀请企业名称">
                    <span className="ant-form-text">
                      {basicInfo && basicInfo.upEnterpriseName}
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
                </Form>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} className="middle">
            <Col span={8}>
              <Card title="所属企业信息" size="small">
                <Row>
                  {basicInfo.supplierAmountInfo && (
                    <Col className="item">
                      <Form {...formItemLayout}>
                        <FormItem label="公司名称">
                          <span className="ant-form-text">
                            {basicInfo.supplierAmountInfo.enterpriseName}
                          </span>
                        </FormItem>
                        <FormItem label="授信额度（元）">
                          <span className="ant-form-text">
                            {fmtMoney(basicInfo.supplierAmountInfo.totalCredit)}
                          </span>
                        </FormItem>
                        <FormItem label="可用授信额度（元）">
                          <span className="ant-form-text">
                            {fmtMoney(
                              basicInfo.supplierAmountInfo.totalAvailableCredit
                            )}
                          </span>
                        </FormItem>
                      </Form>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
            {/* <Col span={8}>
              <Card title="供应商融资转让详情" size="small">
                <Row>
                  {basicInfo.transFinaInfo && (
                    <Col>
                      <Form {...formItemLayout}>
                        <FormItem label="供应商已融资金额（元）">
                          <span className="ant-form-text">{basicInfo.transFinaInfo.financingAmount}</span>
                        </FormItem>
                        <FormItem label="供应商已转让金额（元）">
                          <span className="ant-form-text">{basicInfo.transFinaInfo.transferAmount}</span>
                        </FormItem>
                        <FormItem label="供应商持有金额（元）">
                          <span className="ant-form-text">{basicInfo.transFinaInfo.holdAmount}</span>
                        </FormItem>
                      </Form>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col> */}
          </Row>
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
                      {historyInfo &&
                      historyInfo.historyVos &&
                      historyInfo.historyVos.length > 0
                        ? historyInfo.historyVos.map((item, index) => (
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
          <Button onClick={this.back} className="btn">
            返回
          </Button>
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
  )(BasicInfo1)
);
