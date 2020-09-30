import "url-search-params-polyfill";
import { message } from "antd";

//添加时间戳
function getOwnTimeUrl(url = "") {
  let [beforeSearchUrl, search] = url.split("?");
  const urlSearchParams = new URLSearchParams(search);
  urlSearchParams.append("_t", new Date().getTime());
  return `${beforeSearchUrl}?${urlSearchParams.toString()}`;
}

//fetch拦截器
async function _fetch(url, options) {
  const { method = "GET" } = options;
  if (method.toUpperCase() === "GET") {
    url = getOwnTimeUrl(url);
  }
  const response = await fetch(url, options);
  if (response.status === 472) return window.location.reload();
  if (response.status === 401) return message.error("没有权限访问该接口");
  return response;
}

export default _fetch;
