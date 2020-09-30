import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "core-js/es6/map";
import "core-js/es6/set";
// import "proxy-polyfill/proxy.min.js";
import React from "react";
import ReactDOM from "react-dom";
import Router from "./router";
import { ConfigProvider } from "antd";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from "antd/lib/locale-provider/zh_CN";
import { Provider } from "react-redux";
import store, { persistor } from "store";
import { PersistGate } from "redux-persist/integration/react";

import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router />
      </PersistGate>
    </Provider>
  </ConfigProvider>,
  document.querySelector("#app")
);
