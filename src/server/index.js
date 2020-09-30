import _fetch from "./interceptor";

export const getDetailAPI = async (id) =>
  (await _fetch(`/api/bill/query/${id}`, {
    method: "GET",
  })).json();

export const addBillUpload = async (body) =>
  (await _fetch("/api/file/upload/pic", {
    method: "POST",
    body,
  })).json();

export const getBillsAPI = async () =>
  (await _fetch("/api/kingmi/bills", {
    method: "GET",
  })).json();

export const getBillListAPI = async (params) =>
  (await _fetch("/api/bill/query/list", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(params),
  })).json();

export const addBillAPI = async (params) =>
  (await _fetch("/api/bill/add", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(params),
  })).json();

export const getCheckAPI = async (params) =>
  (await _fetch("/api/bill/check", {
    method: "POSt",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(params),
  })).json();

export const auditCheckAPI = async (params) =>
  (await _fetch("/api/bill/audit", {
    method: "POSt",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(params),
  })).json();

export const getRouterAPI = async (id) =>
  (await _fetch(`/api/kingmi/getRouter?kingmiId=${id}`, {
    method: "GET",
  })).json();

export const registerKingmiAPI = async (body) =>
  (await _fetch("/api/kingmi/registerKingmi", {
    method: "POST",
    body,
  })).json();

export const getProtocolAPI = async (query) =>
  (await _fetch(`/api/file/query/protocol?${query}`, {
    method: "GET",
  })).json();

//获取下级企业信息
export const getRelationDownAPI = async (enterpriseId) =>
  (await _fetch(`/api/enterprise/relation/down?enterpriseId=${enterpriseId}`, {
    method: "GET",
  })).json();

//协议替换
export const replaceProtocolAPI = async (body) =>
  (await _fetch(`/api/file/replace/protocol`, {
    method: "POST",
    body,
  })).json();
