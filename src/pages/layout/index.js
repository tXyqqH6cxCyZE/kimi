import React, { Component } from "react";
import { Row, Col, Icon, Layout } from "antd";
import Nav from "component/nav";
import "statics/style/common.less";
import MyHeader from "component/header";
import { connect } from "react-redux";
import {
  getListData,
  getUserInfo,
  getUserCompanyInfo,
} from "store/actionCreators";
import { withRouter } from "react-router-dom";

const { Header, Content, Sider } = Layout;
let flag = true;

class Build extends Component {
  //ie兼容性处理
  checkIe = () => {
    if (
      "-ms-scroll-limit" in document.documentElement.style &&
      "-ms-ime-align" in document.documentElement.style
    ) {
      window.addEventListener(
        "hashchange",
        () => {
          let currentPath = window.location.hash.slice(1);
          if (this.props.location.pathname !== currentPath) {
            this.props.history.push(currentPath);
          }
        },
        false
      );
    }
  };
  componentDidMount() {
    this.checkIe();
    this.props.getInfo(window.location.hash);
  }
  componentDidUpdate() {
    let { userInfo, getCompanyInfo, getAsyncData, showNav } = this.props;
    if (userInfo.id && flag) {
      getCompanyInfo();
      getAsyncData();
      flag = false;
    }
  }
  render() {
    const { showNav } = this.props;
    return (
      <Layout className="container">
        <div
          className="loading"
          style={{ display: "none" }}
          ref={(loading) => (this.loading = loading)}
        >
          <div className="loading-spinner">
            <Icon type="loading" className="loading-icon" />
            <p className="loading-text">拼命加载中...</p>
          </div>
        </div>
        <Sider
          style={{
            height: "100vh",
            position: "fixed",
            left: 0,
            zIndex: 20,
            color: "#ffffff",
            background: "#404040",
            overflow: "auto",
            display: showNav ? "block" : "none",
          }}
        >
          <Nav />
        </Sider>
        <Layout
          style={{ marginLeft: showNav ? 200 : 0 }}
          className="layoutLayout"
        >
          {showNav ? <MyHeader /> : null}
          <Content className="content">{this.props.children}</Content>
        </Layout>
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.reducer.get("userInfo").toJS(),
    showNav: state.reducer.get("isShowNav"),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAsyncData() {
      dispatch(getListData());
    },
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
    getCompanyInfo() {
      dispatch(getUserCompanyInfo());
    },
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Build)
);
