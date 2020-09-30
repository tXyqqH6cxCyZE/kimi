import React, { Component, lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// 用户管理
const System = lazy(() => import(/* webpackChunkName: "system" */ "./system"));
// 新增用户
const AddUser = lazy(() => import(/* webpackChunkName: "addUser" */ "./addUser"));
// 用户详情
const UserDetail = lazy(() => import(/* webpackChunkName: "userDetail" */ "./userDetail"));
// 编辑用户
const UserEdit = lazy(() => import(/* webpackChunkName: "userEdit" */ "./userEdit"));
// 合同管理
const ContractManagement = lazy(() => import(/* webpackChunkName: "userEdit" */ "./contractManagement"));

export default class SystemRouter extends Component {
  render() {
    return (
      <Suspense fallback={<div>加载中...</div>}>
        <Switch>
          <Route path="/system/index" render={(props) => <System {...props} />} />
          <Route path="/system/addUser" render={(props) => <AddUser {...props} />} />
          <Route path="/system/userDetail/:id" render={(props) => <UserDetail {...props} />} />
          <Route path="/system/userEdit/:id" render={(props) => <UserEdit {...props} />} />
          <Route path="/system/contractManagement" render={(props) => <ContractManagement {...props} />} />
          <Redirect exact from="/system" to="/system/index" />
        </Switch>
      </Suspense>
    );
  }
}
