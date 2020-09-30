import React, { Component } from "react";
import { Row, Col, Card, Form, Button, Icon } from "antd";
import copy from "copy-to-clipboard";
import request from "utils/http";
import { BANK_ACCOUNT_STATUS, FAIL, LENDING_ENTERPRISE_TYPE, INTEREST_METHOD } from "store/actionTypes";
import { connect } from "react-redux";
import { format, fmtMoney } from "utils/format";
import { NavLink } from "react-router-dom";
import path from "config/pathConfig";
import { getUserInfo } from "store/actionCreators";

const FormItem = Form.Item;

const role = {
  "0": "supplier",
  "1": "business",
  "2": "factoring",
};
//基本信息
const basicInfoHash = {
  //供应商
  supplier: [
    { label: "邀请企业名称", value: "upEnterpriseName" },
    { label: "企业名称", value: "enterpriseName" },
    { label: "公司税号", value: "taxId" },
    { label: "营业执照号", value: "registerMark" },
    { label: "法人姓名", value: "legalPersonName" },
    { label: "法人身份证号", value: "legalPersonId" },
    { label: "联系地址", value: "postAddr" },
  ],
  //核心企业
  business: [
    { label: "企业名称", value: "enterpriseName" },
    { label: "公司税号", value: "taxId" },
    { label: "营业执照号", value: "registerMark" },
    { label: "法人姓名", value: "legalPersonName" },
    { label: "法人身份证号", value: "legalPersonId" },
    { label: "联系地址", value: "postAddr" },
  ],
  //保理商
  factoring: [
    { label: "企业名称", value: "enterpriseName" },
    { label: "企业类型", value: "lendingEnterpriseType" },
    { label: "营业执照号", value: "registerMark" },
    { label: "法人姓名", value: "legalPersonName" },
    { label: "法人身份证号", value: "legalPersonId" },
    { label: "联系地址", value: "postAddr" },
  ],
};
//账户资料
const accountInfoHash = {
  //供应商
  supplier: [
    { label: "开户行", value: "openBankName" },
    { label: "开户地区", value: "area" },
    { label: "账户类型", value: "bankAccountType" },
    { label: "开户支行", value: "openSubBankName" },
    { label: "开户名称", value: "openName" },
    { label: "账户号码", value: "accountNo" },
  ],
  //核心企业
  business: [
    { label: "开户行", value: "openBankName" },
    { label: "开户地区", value: "area" },
    { label: "账户类型", value: "bankAccountType" },
    { label: "开户支行", value: "openSubBankName" },
    { label: "开户名称", value: "openName" },
    { label: "账户号码", value: "accountNo" },
  ],
  //保理商
  factoring: [
    { label: "开户行", value: "openBankName" },
    { label: "开户地区", value: "area" },
    { label: "账户类型", value: "bankAccountType" },
    { label: "开户支行", value: "openSubBankName" },
    { label: "开户名称", value: "openName" },
    { label: "账户号码", value: "accountNo" },
  ],
};

//分润配置
const marginAllo = [
  { label: "核心企业", key: "coreEnterpriseDivideValue" },
  { label: "一级供应商", key: "oneSupplierDivideValue" },
  { label: "二级供应商", key: "twoSupplierDivideValue" },
  { label: "三级供应商", key: "threeSupplierDivideValue" },
];

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: null, // 0:供应商 1:核心企业 2:保理公司 3:供应商验证信息未通过
      basicInfo: {},
      // 法人信息
      guaranteeInfo: {},
      // 账户信息
      accountInfo: {},
      // 企业信息
      enterPriseInfo: [],
      fileInfo: {},
    };
  }
  //下载证件函数
  download = () => {
    window.open(path.BASE_URL + "file/download/" + 1 + "/" + this.props.companyInfo.enterpriseId, "target");
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
  changeType = (arr, num) => {
    if (arr && arr.length > 0 && num) {
      return arr.filter((item) => item.id === num)[0].name;
    }
  };
  componentWillMount() {
    this.props.getInfo();
  }
  getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };
  setLocalStorage = (options) => {
    for (const prop in options) {
      localStorage.setItem(prop, JSON.stringify(options[prop]));
    }
  };
  componentDidMount() {
    let { category, enterpriseId } = this.props.companyInfo;

    if (enterpriseId === undefined || category === undefined) {
      enterpriseId = this.getLocalStorage("enterpriseId");
      category = this.getLocalStorage("category");
    } else {
      this.setLocalStorage({ enterpriseId, category });
    }
    if (category === 1) {
      //核心企业
      this.getEnterPriseInfo(enterpriseId);
      this.setState({
        currentIndex: 1,
      });
    } else if (category === 2) {
      //供应商
      this.getBasicInfo(enterpriseId);
      this.setState({
        currentIndex: 0,
      });
    } else {
      this.getBasicInfo1(enterpriseId);
      this.setState({
        currentIndex: 2,
      });
    }
  }
  getEnterPriseInfo = async (enterpriseId) => {
    await request({
      url: "register/enterprise/detail",
      method: "get",
      params: { enterpriseId },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          basicInfo: res.data,
        });
      }
    });
    // 账户信息
    await request({
      url: "register/account/view",
      method: "get",
      params: { enterpriseId },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          accountInfo: res.data,
        });
      }
    });
    await request({
      url: "file/list",
      method: "get",
      params: {
        relationId: enterpriseId,
        relationType: 1,
      },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          fileInfo: res.data,
        });
      }
    });
    // await request({
    //   url: "credit/relations",
    //   method: "get",
    //   params: {
    //     pageNum: 1,
    //     pageSize: 4,
    //   },
    // }).then((res) => {
    //   if (res.code === 0) {
    //     this.setState({
    //       enterPriseInfo: res.data.pageInfo.list,
    //     });
    //   }
    // });
  };
  getBasicInfo = async (enterpriseId) => {
    await request({
      url: "register/enterprise/detail",
      method: "get",
      params: { enterpriseId },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          basicInfo: res.data,
        });
      }
    });
    // 获取法人/担保人信息
    await request({
      url: "register/supply/legal",
      method: "get",
      params: { enterpriseId },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          guaranteeInfo: res.data,
        });
      }
    });
    // 账户信息
    await request({
      url: "register/account/view",
      method: "get",
      params: { enterpriseId },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          accountInfo: res.data,
        });
      }
    });
    // 企业信息
    await request({
      url: "credit/relations",
      method: "get",
      params: {
        pageNum: 1,
        pageSize: 2,
      },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          enterPriseInfo: res.data,
        });
      }
    });
    await request({
      url: "file/list",
      method: "get",
      params: {
        relationId: enterpriseId,
        relationType: 1,
      },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          fileInfo: res.data,
        });
      }
    });
  };
  getBasicInfo1 = async (enterpriseId) => {
    const { enterpriseType } = this.props;
    await request({
      url: "register/enterprise/detail",
      method: "get",
      params: { enterpriseId },
    }).then((res) => {
      if (res.code === 0) {
        const { data } = res;
        this.setState({
          basicInfo: {
            ...data,
            lendingEnterpriseType: this.changeType(enterpriseType, data.lendingEnterpriseType),
          },
        });
      }
    });
    // 账户信息
    await request({
      url: "register/account/view",
      method: "get",
      params: { enterpriseId },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          accountInfo: res.data,
        });
      }
    });
    await request({
      url: "file/list",
      method: "get",
      params: {
        relationId: enterpriseId,
        relationType: 1,
      },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          fileInfo: res.data,
        });
      }
    });
  };
  // 复制链接
  copyContent() {
    copy(this.webSite.innerHTML);
    alert("已复制好，可贴粘。");
  }
  infoDeal = ({ basicInfo, accountInfo, role }) => {
    accountInfo.area = accountInfo.provinceName + accountInfo.cityName;
    const basicInfos = basicInfoHash[role].map((item) => {
      const key = item.value;
      return { ...item, value: basicInfo[key] ? basicInfo[key] : "" };
    });
    const accountInfos = accountInfoHash[role].map((item) => {
      const key = item.value;
      return { ...item, value: accountInfo[key] ? accountInfo[key] : "" };
    });
    return {
      basicInfos,
      accountInfos,
    };
  };
  handleGoBack = () => {
    window.history.back();
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
    const { basicInfo, currentIndex, guaranteeInfo, accountInfo, enterPriseInfo, fileInfo } = this.state;
    const { bankAccountStatus, enterpriseType, interestMethod } = this.props;
    const { enterpriseId } = this.props.companyInfo;
    let currentStatus =
      bankAccountStatus && bankAccountStatus.filter((item) => item.id === accountInfo && accountInfo.accountVerification);

    const { basicInfos, accountInfos } = this.infoDeal({
      basicInfo,
      accountInfo,
      role: role[currentIndex] || role[2],
    });
    if (currentIndex === 0) {
      // 供应商基本信息
      component = (
        <Card title="企业资料">
          <div className="wrapper">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="基本信息" size="small">
                  <Form {...formItemLayout}>
                    {basicInfos.map((item, index) => (
                      <FormItem label={item.label} key={index}>
                        <span className="ant-form-text">{item.value}</span>
                      </FormItem>
                    ))}
                  </Form>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="账户资料" size="small">
                  <Form {...formItemLayout}>
                    {accountInfos.map((item, index) => (
                      <FormItem label={item.label} key={index}>
                        <span className="ant-form-text">{item.value}</span>
                      </FormItem>
                    ))}
                  </Form>
                </Card>
              </Col>
            </Row>
            <Row gutter={16} className="middle" type="flex" justify="space-between">
              <Col span={16}>
                <Card title="所属企业信息" extra={<NavLink to="/account/more">查看更多{">>"}</NavLink>} size="small">
                  <Row>
                    {basicInfo.supplierAmountInfo && (
                      <Col span={12} className="item">
                        <Form {...formItemLayout}>
                          <FormItem label="公司名称">
                            <span className="ant-form-text">{basicInfo.supplierAmountInfo.enterpriseName}</span>
                          </FormItem>
                          <FormItem label="授信额度（元）">
                            <span className="ant-form-text">{fmtMoney(basicInfo.supplierAmountInfo.totalCredit)}</span>
                          </FormItem>
                          <FormItem label="可用授信额度（元）">
                            <span className="ant-form-text">{fmtMoney(basicInfo.supplierAmountInfo.totalAvailableCredit)}</span>
                          </FormItem>
                        </Form>
                      </Col>
                    )}
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card title="资料证件" size="small" extra={<Button onClick={this.download}>下载证件</Button>}>
                  <div className="list text1">{fileInfo && fileInfo.length > 0 ? this.showPic(fileInfo) : null}</div>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      );
    } else if (currentIndex === 1) {
      // 核心企业基本信息
      component = (
        <Card title="企业资料">
          <div className="wrapper">
            <Row gutter={16}>
              <Col span={6}>
                <Card title="基本信息" size="small">
                  <Form {...formItemLayout}>
                    <FormItem label="邀请链接">
                      <span className="ant-form-text">
                        <span className="link" style={{ overflowX: "auto" }}>
                          <NavLink to="/account/modifyInfo" target="_blank">
                            <span ref={(webSite) => (this.webSite = webSite)}>{basicInfo && basicInfo.inviteLink}</span>
                          </NavLink>
                          <span className="copy" onClick={this.copyContent.bind(this)}>
                            复制
                          </span>
                        </span>
                      </span>
                    </FormItem>
                    {basicInfos.map((item, index) => (
                      <FormItem label={item.label} key={index}>
                        <span className="ant-form-text">{item.value}</span>
                      </FormItem>
                    ))}
                  </Form>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="账户资料" size="small">
                  <Form {...formItemLayout}>
                    {accountInfos.map((item, index) => (
                      <FormItem label={item.label} key={index}>
                        <span className="ant-form-text">{item.value}</span>
                      </FormItem>
                    ))}
                  </Form>
                </Card>
              </Col>
              {basicInfo.divideRule ? (
                <Col span={6}>
                  <Card title="分润配置" size="small">
                    <Form {...formItemLayout}>
                      {marginAllo.map((item, index) => (
                        <FormItem label={item.label} key={index}>
                          <span className="ant-form-text">{basicInfo.divideRule[item.key]}%</span>
                        </FormItem>
                      ))}
                    </Form>
                  </Card>
                </Col>
              ) : null}
              <Col span={6}>
                <Card title="向下企业信息" extra={<NavLink to="/account/more">查看更多{">>"}</NavLink>} size="small">
                  {/* 只展示前两个 */}
                  {basicInfo.downEnterprise && basicInfo.downEnterprise.length > 0
                    ? basicInfo.downEnterprise.slice(0, 2).map((item, index) => {
                        return (
                          <Row key={index}>
                            <Col span={24} className="item">
                              <Form {...formItemLayout}>
                                <FormItem label="公司名称">
                                  <span className="ant-form-text">{item.enterpriseName}</span>
                                </FormItem>
                                <FormItem label="授信额度（元）">
                                  <span className="ant-form-text">{fmtMoney(item.totalCredit)}</span>
                                </FormItem>
                                <FormItem label="可用授信额度（元）">
                                  <span className="ant-form-text">{fmtMoney(item.totalAvailableCredit)}</span>
                                </FormItem>
                              </Form>
                            </Col>
                          </Row>
                        );
                      })
                    : null}
                </Card>
              </Col>
            </Row>
            <Row className="middle">
              <Col span={24}>
                <Card title="资料证件" size="small" extra={<Button onClick={this.download}>下载附件</Button>}>
                  <div className="list text1">{fileInfo && fileInfo.length > 0 ? this.showPic(fileInfo) : null}</div>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      );
    } else if (currentIndex === 2) {
      // 资金方基本信息
      component = (
        <Card title="账户资料">
          <div className="wrapper">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="基本信息" size="small">
                  <Form {...formItemLayout}>
                    {basicInfos.map((itemInfo, index) => (
                      <FormItem label={itemInfo.label} key={index}>
                        <span className="ant-form-text">{itemInfo.value}</span>
                      </FormItem>
                    ))}
                  </Form>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="账户资料" size="small">
                  <Form {...formItemLayout}>
                    {accountInfos.map((item, index) => {
                      return (
                        <FormItem label={item.label} key={index}>
                          <span className="ant-form-text">{item.value}</span>
                        </FormItem>
                      );
                    })}
                  </Form>
                </Card>
              </Col>
              <Col span={8}>
                <Card extra={<NavLink to="/account/more/3">授信额度审批{">>"}</NavLink>} size="small" />
              </Col>
            </Row>
            <Row className="middle">
              <Col span={24}>
                <Card title="资料证件" size="small" extra={<Button onClick={this.download}>下载证件</Button>}>
                  <div className="list text1">{fileInfo && fileInfo.length > 0 ? this.showPic(fileInfo) : null}</div>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      );
    }
    return (
      <div className="contain-wrapper">
        {component}
        <Button onClick={this.handleGoBack}>返回</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  bankAccountStatus: format(state.reducer.get("list").toJS(), BANK_ACCOUNT_STATUS),
  companyInfo: state.reducer.get("companyInfo").toJS(),
  enterpriseType: format(state.reducer.get("list").toJS(), LENDING_ENTERPRISE_TYPE),
  interestMethod: format(state.reducer.get("list").toJS(), INTEREST_METHOD),
});
const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};
let CustomExamine = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(Info));

export default class BasicInfo extends Component {
  render() {
    return (
      <div>
        <CustomExamine />
      </div>
    );
  }
}
