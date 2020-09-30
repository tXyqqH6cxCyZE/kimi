import React, { Component, lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// 基本信息
const BasicInfo = lazy(() =>
  import(/* webpackChunkName: "basicInfo" */ "./basicInfo")
);
// 新增供应商/回填修改
const ModifyInfo = lazy(() =>
  import(/* webpackChunkName: "modifyInfo" */ "./modifyInfo")
);
// 提现
const Money = lazy(() => import(/* webpackChunkName: "money" */ "./money"));
// 新增金米
const AddGold = lazy(() =>
  import(/* webpackChunkName: "addGold" */ "./addGold")
);
// 交易记录
const TransRecord = lazy(() =>
  import(/* webpackChunkName: "transRecord" */ "./transRecord")
);
// 提现结果页
const Result = lazy(() => import(/* webpackChunkName: "result" */ "./result"));
// 账户首页
const Home = lazy(() => import(/* webpackChunkName: "zhanghu" */ "./zhanghu"));
const BasicInfoMore = lazy(() =>
  import(/* webpackChunkName: "basicInfoMore" */ "./basicInfoMore")
);
// 激活账号
const ActivateAccount = lazy(() =>
  import(/* webpackChunkName: "activateAccount" */ "./activateAccount")
);
// 审核组件
const Examine = lazy(() =>
  import(/* webpackChunkName: "examine" */ "./examine")
);
// 核心企业授信认证
const CoreCompany = lazy(() =>
  import(/* webpackChunkName: "coreCompany" */ "./coreCompany")
);
//票据管理
const BillManagement = lazy(() => import("./billManagement"));
//票据管理人工核验
const ManualVerification = lazy(() => import("./manualVerification"));
//票据管理详情页面
const Detail = lazy(() => import("./detail"));

class AccountRouter extends Component {
  render() {
    return (
      <Suspense fallback={<div> 加载中... </div>}>
        <Switch>
          <Route
            path="/account/index"
            render={(props) => <Home {...props} />}
          />
          <Route
            path="/account/money"
            render={(props) => <Money {...props} />}
          />
          <Route
            path="/account/activateAccount"
            render={(props) => <ActivateAccount {...props} />}
          />
          <Route
            path="/account/modifyInfo/:id?"
            render={(props) => <ModifyInfo {...props} />}
          />
          <Route
            path="/account/transRecord"
            render={(props) => <TransRecord {...props} />}
          />
          <Route
            path="/account/result"
            render={(props) => <Result {...props} />}
          />
          <Route
            path="/account/addGold/:id?"
            render={(props) => <AddGold {...props} />}
          />
          {/*供应商粮票开立*/}
          <Route
            path="/account/info"
            render={(props) => <BasicInfo {...props} />}
          />
          <Route
            path="/account/billManagement"
            render={(props) => <BillManagement {...props} />}
          />
          <Route
            path="/account/manualVerification/:id/:fileId"
            render={(props) => <ManualVerification {...props} />}
          />
          <Route
            path="/account/detail/:id/:fileId"
            render={(props) => <Detail {...props} />}
          />
          <Route
            path="/account/more/:id?"
            render={(props) => <BasicInfoMore {...props} />}
          />
          <Route
            path="/account/examine/:id"
            render={(props) => <Examine {...props} />}
          />
          <Route
            path="/account/coreCompany"
            render={(props) => <CoreCompany {...props} />}
          />
          <Redirect exact from="/account" to="/account/index" />
        </Switch>
      </Suspense>
    );
  }
}
export default () => <AccountRouter />;
