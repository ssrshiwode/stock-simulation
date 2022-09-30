import axios from "axios";
import { message } from "antd";

export const initRequest = () => {
  axios.interceptors.response.use(
    (res) => {
      return res.data;
    },
    (err) => {
      message.error("请求出错");
      return Promise.reject(err);
    }
  );
};
