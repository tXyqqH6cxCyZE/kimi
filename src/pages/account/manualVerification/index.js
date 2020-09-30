import React, { useState } from "react";
import ManualVerification from "./component/ManualVerification";
import { getCheckAPI, auditCheckAPI } from "server";
import { message } from "antd";
import moment from "moment";

function Index(props) {
  const {
    match: {
      params: { id, fileId },
    },
  } = props;
  const [radioVal, setRadioVal] = useState(1);
  const handleRadioChange = (e) => setRadioVal(e.target.value);
  const handleSubmit = (validateFields) => {
    validateFields(async (err, data) => {
      if (err) return;
      const openTime =
        data.openTime && moment(data.openTime).format("YYYY-MM-DD");
      const params = { ...data, openTime, billId: id };
      delete params.search;
      for (const prop in params) {
        if ([null, "", undefined].includes(params[prop])) delete params[prop];
      }
      const { code, message: msg } = await auditCheckAPI(params);
      if (code === 0) {
        message.success("核验通过");
        props.history.push("/account/billManagement");
        return;
      }
      message.error(msg);
    });
  };

  const getCheck = async (params, setFieldsValue) => {
    const { code, message: msg, data } = await getCheckAPI(params);
    if (code === 0) {
      setFieldsValue({
        ...data,
        openTime: moment(data.openTime, "YYYY-MM-DD"),
      });
      return;
    }
    message.info(msg);
  };

  const handleGoBack = () => {
    props.history.goBack();
  };

  const handleBlur = (getFieldsValue, setFieldsValue) => {
    const {
      search: { required, optional },
    } = getFieldsValue();
    for (const prop in required) {
      if (!required[prop]) return;
    }
    const openTime = moment(required.openTime).format("YYYY-MM-DD");
    getCheck({ ...required, ...optional, openTime }, setFieldsValue);
  };

  const handlePreviewFile = () => {
    window.open(`/api/file/query/${fileId}`);
  };

  return (
    <ManualVerification
      {...{
        radioVal,
        handleRadioChange,
        handleSubmit,
        handleGoBack,
        handleBlur,
        handlePreviewFile,
        fileId,
      }}
    />
  );
}

export default Index;
