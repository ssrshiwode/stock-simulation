import React from "react";
import ReactDOM from "react-dom/client";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import moment from "moment";
import reportWebVitals from "./reportWebVitals";
import Chart from "./components/chart";
import Form from "./components/form";
import { initRequest } from "./utils/request";
import RootContextProvider from "./utils/store";

import "moment/locale/zh-cn";
import "antd/dist/antd.css";
import "./index.less";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RootContextProvider>
      <ConfigProvider locale={zhCN}>
        <div className="app">
          <Form />
          <Chart />
        </div>
      </ConfigProvider>
    </RootContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

initRequest();

moment.locale("zh-cn");
