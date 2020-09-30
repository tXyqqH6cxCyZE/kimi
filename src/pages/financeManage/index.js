import React, { Component, lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// 融资列表首页
const FinanceList = lazy(() =>
  import(/* webpackChunkName: "financeList" */ "./financeList")
);
const Blank = lazy(() =>
  import(/* webpackChunkName: "blank" */ "./financeList/blank")
);
const Empty = lazy(() =>
  import(/* webpackChunkName: "blank" */ "component/empty")
);
// 详情
const Detail = lazy(() =>
  import(/* webpackChunkName: "detail" */ "./financeList/detail")
);
// 审核
const BasicInfo = lazy(() =>
  import(/* webpackChunkName: "basicInfo" */ "./financeList/basicInfo")
);
// 修改
const Modify = lazy(() =>
  import(/* webpackChunkName: "modify" */ "./financeList/modify")
);
// 还款管理首页
const RepayManage = lazy(() =>
  import(/* webpackChunkName: "repayManage" */ "./repayManage")
);
// 还款详情
const RepayDetail = lazy(() =>
  import(/* webpackChunkName: "repayDetail" */ "./repayManage/repayDetail")
);
//融资申请
const FinanceApply = lazy(() => import("./financeList/financeApply"));

export default class FinanceRouter extends Component {
  render() {
    return (
      <Suspense fallback={<div> 加载中... </div>}>
        <Switch>
          <Route
            path="/financing/index"
            render={(props) => <FinanceList {...props} />}
          />
          <Route
            path="/financing/blank"
            render={(props) => <Blank {...props} />}
          />
          <Route
            path="/financing/empty"
            render={(props) => <Empty {...props} />}
          />
          <Route
            path="/financing/detailDown/:id"
            render={(props) => <Detail {...props} />}
          />
          <Route
            path="/financing/basicInfo/:id"
            render={(props) => <BasicInfo {...props} />}
          />
          <Route
            path="/financing/modify/:id"
            render={(props) => <Modify {...props} />}
          />
          <Route
            path="/financing/repay"
            render={(props) => <RepayManage {...props} />}
          />
          <Route
            path="/financing/detail/:id"
            render={(props) => <RepayDetail {...props} />}
          />
          <Route
            path="/financing/financeApply/:id"
            render={(props) => <FinanceApply {...props} />}
          />
          <Redirect exact from="/financing" to="/financing/index" />
        </Switch>
      </Suspense>
    );
  }
}
