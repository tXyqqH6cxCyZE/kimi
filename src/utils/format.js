import React from "react";
import { Select, message, Icon } from "antd";
import path from "config/pathConfig";
import moment from "moment";

const { Option } = Select;

function getCurrentDate() {
  let date = new Date();
  let seperator1 = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return year + seperator1 + month + seperator1 + strDate;
}

export const format = (arr, type) =>
  arr.length > 0 ? arr.find((item) => item.enType === type).enumList : null;
//获取下拉框的数据
export const getSelectOption = (arr) =>
  arr && arr.length > 0
    ? arr.map((item) => (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      ))
    : null;

// 类型转换
export const formatType = (arr, num) => {
  let newArr = arr && arr.filter((item) => item.props.value === num);
  if (newArr && newArr.length > 0) {
    return newArr[0].props.children;
  }
};
//限制图片 格式、体积(20M),返回promise
export const beforeUpload = (file) => {
  return new Promise((resolve, reject) => {
    const isJPG = file.type === "image/jpeg";
    const isPNG = file.type === "image/png";
    const isBMP = file.type === "image/bmp";
    const isGIF = file.type === "image/gif";
    const isWEBP = file.type === "image/webp";
    const isPic = isJPG || isPNG || isBMP || isGIF || isWEBP;
    const isLt20M = file.size / 1024 / 1024 < 20;
    //文件名称长度小于128字符，不算上后缀名
    // const fileNameArr = file.name.split(".");
    // const len = fileNameArr.length;
    // const fileName = fileNameArr.slice(0, len - 1).join("");
    // const fileNameLen = fileName.length + (len - 2);
    //文件名称长度小于128字符，算上后缀名
    const fileNameLen = file.name.length;
    if (fileNameLen > 64) {
      message.warn("文件名称不能超过64字符");
      return reject(false);
    }
    if (isPic && isLt20M) {
      return resolve(true);
    } else {
      message.warn("只能上传图片并且体积不能大于20M");
      return reject(false);
    }
  });
};
//限制zip pdf 格式、体积(50M),返回promise
export const beforeUploadPDFZIP_promise = (file) =>
  new Promise((res, rej) => {
    const isPDF = "application/pdf";
    const isZIP = "application/x-zip-compressed";
    if (![isPDF, isZIP].includes(file.type) || file.size > 50 * 1024 * 1024) {
      message.warn("只能上传大小为50M以内，格式为pdf或zip的文件");
      return rej(false);
    }
    res(true);
  });
//限制zip pdf 格式、体积(50M),取消默认上传行为
export const beforeUploadPDFZIP = (file, fileList) => {
  const isPDF = "application/pdf";
  const isZIP = "application/x-zip-compressed";
  const isLt50M = file.size / 1024 / 1024 < 50;
  if ([isPDF, isZIP].includes(file.type) && isLt50M) {
    return false;
  } else {
    message.warn("只能上传大小为50M以内，格式为pdf或zip的文件");
    fileList.pop();
    return false;
  }
};
export const compare = (start) => {
  let arr = start.split("-");
  let startTime = new Date(arr[0], arr[1], arr[2]).getTime();
  let newArr = getCurrentDate().split("-");
  let endTime = new Date(newArr[0], newArr[1], newArr[2]).getTime();
  return startTime >= endTime ? false : true;
};

// 金额转换(保留两位小数，每隔三位加逗号)
export const fmtMoney = (num) => {
  num = parseFloat(num) / 100;
  if (!isNaN(num)) {
    let str = num.toFixed(2) + "";
    let intSum = str
      .substring(0, str.indexOf("."))
      .replace(/\B(?=(?:\d{3})+$)/g, ",");
    let dot = str.substring(str.length, str.indexOf("."));
    return intSum + dot;
  } else {
    return "-";
  }
};
// 六位随机数
export function getMandom(num) {
  let rand = "";
  for (let i = 0; i < num; i++) {
    let r = Math.floor(Math.random() * 10);
    rand += r;
  }
  return rand;
}
export const getCertificate = (arr) =>
  arr && arr.length > 0
    ? arr.map((item, index) => (
        <Option key={index} value={item}>
          {item}
        </Option>
      ))
    : null;

export const formatObj = (obj) => {
  return typeof eval("(" + obj + ")") === "object"
    ? eval("(" + obj + ")")
    : obj;
};

export const showPic = (obj) => {
  if (!obj) {
    return;
  }
  return obj && obj.length > 0
    ? obj.map((item) => (
        <li key={item} className="pic">
          <div className="icon">
            <Icon type="picture" />
          </div>
          {item}
        </li>
      ))
    : obj;
};
export const formatChinese = (num) => (num === 1 ? "是" : "否");

export const download = (id) => {
  window.open(path.BASE_URL + "file/download/" + id, "target");
};

// 读取cfca
export const cfca = () => {
  let ukeyList = [];
  try {
    let eDiv = document.createElement("div");
    if (
      navigator.appName.indexOf("Internet") >= 0 ||
      navigator.appVersion.indexOf("Trident") >= 0
    ) {
      if (
        window.navigator.cpuClass == "x86" ||
        window.navigator.cpuClass == "win32"
      ) {
        eDiv.innerHTML =
          '<object id="CryptoAgent" codebase="CryptoKit.xiaomiJRKJ.x86.cab" classid="clsid:63929B7D-32AF-44ED-BE6A-54F7654AFDF3" ></object>';
      } else {
        eDiv.innerHTML =
          '<object id="CryptoAgent" codebase="CryptoKit.xiaomiJRKJ.x64.cab" classid="clsid:EC22E99F-01A5-430C-AE70-CA5659F4056A" ></object>';
      }
    } else {
      eDiv.innerHTML =
        '<embed id="CryptoAgent" type="application/npCryptoKit.xiaomiJRKJ.x86" style="height: 0px; width: 0px">';
    }
    document.body.appendChild(eDiv);
    var CryptoAgent = document.getElementById("CryptoAgent");
    // 先去判断有没有证书
    var bSelectCertResult = CryptoAgent.SelectCertificate("", "", "");
    // Opera浏览器，NPAPI函数执行结果为false时，不能触发异常，需要自己判断返回值。
    if (!bSelectCertResult) {
      var errorDesc1 = CryptoAgent.GetLastErrorDesc();
      alert(errorDesc1);
      return;
    }
    console.log("选择证书结果", bSelectCertResult);
    // 再获取证书信息
    var InfoContent = CryptoAgent.GetSignCertInfo("SubjectDN");
    alert(InfoContent);

    // Opera浏览器，NPAPI函数执行结果为false时，不能触发异常，需要自己判断返回值。
    if (!InfoContent) {
      var errorDesc2 = CryptoAgent.GetLastErrorDesc();
      alert(errorDesc2);
      return;
    }
    ukeyList.push(InfoContent);
    return ukeyList;
  } catch (e) {
    var CryptoAgent = document.getElementById("CryptoAgent");
    var errorDesc3 = CryptoAgent.GetLastErrorDesc();
    alert(errorDesc3);
    return;
  }
};
export const formItemLayout = {
  labelCol: {
    xs: 24,
    sm: 10,
  },
  wrapperCol: {
    xs: 24,
    sm: 14,
  },
};
// 审批记录
export const approveRecord = (arr) => {
  return arr && arr.length > 0
    ? arr.map((item, index) => (
        <li key={index}>
          {item.time.substring(0, 10)} <span> {item.newStateAlias} </span>
        </li>
      ))
    : null;
};
// 选择刘个月的时间段
export const disabledDate = (current) =>
  (current && current > moment().endOf("day")) ||
  current < moment().subtract(6, "months");

// 默认选择时间为最近6个月
export const defaultSelectDate = {
  startDate: moment()
    .startOf("day")
    .subtract(6, "months"),
  endDate: moment().endOf("day"),
};
//渲染发票列表
export const renderReceipt = (list) => {
  return (
    list &&
    list.length > 0 &&
    list.map((item) => (
      <li key={item.fileId} className="pic">
        <div className="icon">
          <Icon type="picture" />
        </div>
        {item.fileName}
      </li>
    ))
  );
};

// export const receiptListDownLoad = (list) => {
//   if (list && list.length > 0) {
//     let index = 0;
//     let timer = null;
//     let win = null;
//     function deal() {
//       clearInterval(timer);
//       if (index >= list.length) return;
//       win = window.open(
//         `${path.BASE_URL}file/download/${list[index].fileId}`,
//         "target"
//       );
//       index++;
//       timer = setInterval(() => {
//         if (win.closed) {
//           deal();
//         }
//       }, 1000 / 60);
//     }
//     deal();
//   }
// };

export const receiptListDownLoad = (list) => {
  if (list && list.length > 0) {
    let index = 0;
    const timer = setInterval(() => {
      if (index >= list.length) {
        clearInterval(timer);
        return;
      }
      window.open(`${path.BASE_URL}file/download/${list[index].fileId}`);
      index++;
    }, 500);
  }
};

//过期前三天不允许转让和融资
export const expiresInThreeDays = (expiresDate) => {
  expiresDate = new Date(expiresDate).getTime();
  const currentDate = new Date().getTime();
  const timeGap = expiresDate - currentDate;
  return timeGap / 1000 / 60 / 60 / 24;
};

//文件删除或上传失败也要校验，extend为扩展函数
export const file_validator = (name, extend) => (rule, value, callback) => {
  if (value) {
    if (!value.fileList.length) {
      callback(`请上传${name}`);
    }
    if (value.file.status === "error") {
      callback(`请重新上传${name}`);
    }
    typeof extend === "function" && extend(rule, value, callback);
  }
  callback();
};
