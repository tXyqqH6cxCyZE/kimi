import React, { PureComponent } from "react";
import Account from "../accountInfo";
import { Row, Col, Card, message, Button, Modal, Checkbox } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import request from "utils/http";
import copy from "copy-to-clipboard";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import KimmyList from "pages/kimmy/kimmyList";
import FinanceList from "pages/financeManage/financeList";
import UserStateMent from "pages/account/agreement/userStateMent";
import UserServiceProtocol from "pages/account/agreement/userServiceProtocol";
import YiLi from "pages/account/agreement/yilianAgreement";

class Info extends PureComponent {
  state = {
    financeInfo: {},
    isGetInfo: true,
    disabled: true, // 协议是否都勾选  控制提交按钮状态
    userStateVisible: false,
    userServiceProtocol: false,
    yiliVisible: false,
    protocolVisible: false, // 协议弹框现实与否
  };
  componentWillMount() {
    this.props.getInfo();
  }
  componentDidMount() {
    this.getInitStatic();
  }
  componentDidUpdate() {
    this.getInitStatic();
  }
  async getAccountInfo() {
    await request({
      url: "kingmi/financing/statistics",
      method: "get",
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          financeInfo: res.data,
        });
      }
    });
  }
  getInitStatic = () => {
    if (this.props.userInfo.id && this.state.isGetInfo) {
      this.getAccountInfo();
      this.setState({
        isGetInfo: false,
      });
    }
  };
  // 阅读协议
  readAgreement = (type) => {
    this.setState({
      [type]: true,
    });
  };
  closeAgreement = (type) => {
    this.setState({
      [type]: false,
    });
  };
  isCheck = (e) => {
    let checked = e.target.checked;
    this.setState({
      disabled: !checked,
    });
  };
  // ajax请求看是否需要 显示弹框
  searchShowProtocol = () => {
    request({
      url: "kingmi/checkProtocol",
      method: "post",
    }).then((res) => {
      if (res.data) {
        // 如果是true返回，表示已经勾选了协议，直接跳转路由
        this.props.history.push(`/account/addGold`);
      } else {
        // 如果为false，则表示没有勾选协议，显示弹框
        this.setState({
          protocolVisible: true,
        });
      }
    });
  };
  hideProtocolModal = () => {
    this.setState({
      protocolVisible: false,
    });
  };
  confirmProtocolModal = () => {
    // 提交ajax
    request({
      url: "kingmi/agreeProtocol",
      method: "post",
    }).then((res) => {
      if (res.data) {
        // 如果是true返回，表示已经勾选了协议，直接跳转路由
        this.setState({
          protocolVisible: false,
        });
        this.props.history.push(`/account/addGold`);
      }
    });
  };
  // 复制链接
  copyContent() {
    copy(this.webSite.innerHTML);
    message.success("已复制好，可贴粘。");
  }
  render() {
    const {
      financeInfo,
      userStateVisible,
      userServiceProtocol,
      yiliVisible,
      disabled,
    } = this.state;
    const { enterpriseId, userInfo, kimmyAuthority } = this.props;
    return (
      <div>
        <Card
          title="账户概览(邀请链接)"
          extra={
            <div>
              <span ref={(webSite) => (this.webSite = webSite)}>
                {financeInfo.enterpriseAccountViewVo &&
                  financeInfo.enterpriseAccountViewVo.inviteLink}
              </span>
              {financeInfo.enterpriseAccountViewVo &&
              financeInfo.enterpriseAccountViewVo.inviteLink ? (
                <span
                  onClick={this.copyContent.bind(this)}
                  style={{
                    marginLeft: "20px",
                    cursor: "pointer",
                  }}
                >
                  复制
                </span>
              ) : null}
            </div>
          }
        >
          <Row type="flex" justify="start">
            <Col span={24}>
              <Account financeInfo={financeInfo} id={enterpriseId} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="contain-wrapper">
                <Row type="flex" justify="start">
                  <Col span={2}>
                    <h1 className="title"> 粮票查询 </h1>
                  </Col>
                  <Col span={22}>
                    <div>
                      {kimmyAuthority.includes("kingmi") ? (
                        // (<NavLink to="/account/addGold" className="add-gold">新增粮票</NavLink>	)
                        <span
                          style={{
                            color: "#1890ff",
                            cursor: "pointer",
                          }}
                          onClick={this.searchShowProtocol.bind(this)}
                          className="add-gold"
                        >
                          新增粮票
                        </span>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                {userInfo.id ? <KimmyList flag={true} /> : null}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="contain-wrapper">
                <Row type="flex" justify="start">
                  <Col span={24}>
                    <h1 className="title"> 粮票融资查询 </h1>
                  </Col>
                </Row>
                {userInfo.id ? <FinanceList /> : null}
              </div>
            </Col>
          </Row>
        </Card>
        <Modal
          title={"确认协议："}
          maskClosable={false}
          visible={this.state.protocolVisible}
          width={1000}
          onCancel={this.hideProtocolModal}
          footer={[
            <Button
              key="close"
              disabled={disabled}
              onClick={this.confirmProtocolModal}
            >
              确认
            </Button>,
          ]}
          centered
        >
          <div>
            <Checkbox
              onChange={this.isCheck}
              style={{
                marginRight: "10px",
              }}
            />
            我已阅读、 理解并同意
            <a onClick={() => this.readAgreement("userStateVisible")}>
              《用户声明》
            </a>
            <a onClick={() => this.readAgreement("userServiceProtocol")}>
              《用户服务协议》
            </a>
            <a onClick={() => this.readAgreement("yiliVisible")}>
              《粮票使用协议》
            </a>
          </div>
        </Modal>
        <UserStateMent
          visible={userStateVisible}
          closeModel={this.closeAgreement}
        />
        <UserServiceProtocol
          visible={userServiceProtocol}
          closeModel={this.closeAgreement}
        />
        <YiLi visible={yiliVisible} closeModel={this.closeAgreement} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.reducer.get("userInfo") ? state.reducer.get("userInfo").toJS() : {},
    enterpriseId: state.reducer.get("companyInfo")
      ? state.reducer.get("companyInfo").toJS().enterpriseId
      : {},
    kimmyAuthority: state.reducer.get("kimmyAuthority"),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};
let Home = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Info)
);

export default () => <Home />;
