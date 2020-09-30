import React, { Component } from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import request from "utils/http";
import { connect } from "react-redux";
import imgURL from "statics/images/chongqinglogo.png";
import { getKimmyTabs, getKimmyAuthority } from "store/actionCreators";

const SubMenu = Menu.SubMenu;
const initialArr = [
  { name: "账户管理", url: "/account" },
  { name: "账户概览", url: "/account/index" },
  { name: "基本信息", url: "/account/info" },
  { name: "票据管理", url: "/account/billManagement" },
  { name: "粮票管理", url: "/kimmy" },
  { name: "粮票列表", url: "/kimmy/index" },
  { name: "结算列表", url: "/kimmy/settlement" },
  { name: "粮票转让管理", url: "/transManage" },
  { name: "粮票转让列表", url: "/transManage/index" },
  { name: "粮票融资管理", url: "/financing" },
  { name: "粮票融资列表", url: "/financing/index" },
  { name: "还款列表", url: "/financing/repay" },
  { name: "系统管理", url: "/system" },
  { name: "用户列表", url: "/system/index" },
  { name: "合同管理", url: "/system/contractManagement" },
  { name: "客户管理", url: "/customer" },
  { name: "核心企业管理", url: "/customer/index" },
  { name: "资金方管理", url: "/customer/capital" },
  { name: "供应商管理", url: "/customer/supplier" },
];

class Info extends Component {
  state = {
    menuList: [],
    isGetInfo: true,
  };
  componentDidMount() {
    this.getInitStatic();
  }
  componentDidUpdate() {
    this.getInitStatic();
  }
  getInitStatic = () => {
    if (this.props.userInfo.id && this.state.isGetInfo) {
      this.getMenuList();
      this.setState({ isGetInfo: false });
    }
  };
  setUrl(menuList) {
    if (!menuList) {
      return;
    }
    menuList.forEach((list) => {
      initialArr.forEach((item) => {
        if (item.name === list.name) {
          list.url = item.url;
        }
      });
      if ("subItems" in list) {
        let children = list.subItems;
        list.children = this.setUrl(children);
      }
    });

    return menuList;
  }
  getMenuList = async () => {
    await request({ url: "privilege/my", method: "get" }).then((res) => {
      if (res.code === 0) {
        let { buttons, kingmi, mainMenu } = res.data;
        let buttonAuthority = buttons.map((item) => item.name);
        let menuList = this.setUrl(mainMenu);
        this.setState({ menuList: menuList });
        this.props.getTabs(kingmi);
        this.props.getAuthority(buttonAuthority);
      }
    });
  };
  // 菜单渲染
  renderMenu = (data) => {
    return data.map((item) => {
      if (item.subItems) {
        return (
          <SubMenu title={item.name} key={Math.random()}>
            {this.renderMenu(item.subItems)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item title={item.name} key={Math.random()}>
          <NavLink to={`${item.url}`}>{item.name}</NavLink>
        </Menu.Item>
      );
    });
  };

  render() {
    const { menuList } = this.state;
    return (
      <div>
        <div className="logo">
          <img src={imgURL} />
          <span className="paltform">粮票平台</span>
        </div>
        <Menu theme="dark">{this.renderMenu(menuList)}</Menu>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.reducer.get("userInfo").toJS(),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getTabs(tabs) {
      dispatch(getKimmyTabs(tabs));
    },
    getAuthority(buttons) {
      dispatch(getKimmyAuthority(buttons));
    },
  };
};
let Navigation = connect(
  mapStateToProps,
  mapDispatchToProps
)(Info);

export default () => <Navigation />;
