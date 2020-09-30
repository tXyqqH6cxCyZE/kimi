import React, { useState } from "react";
import ContractManagement from "./component/ContractManagement";
import { message } from "antd";
import { download } from "utils/format";
import { getProtocolAPI, replaceProtocolAPI } from "server";

function Index() {
  const [contractList, setContractList] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});
  const [contractOptions, setContractOptions] = useState([]);

  const renderData = async (searchInfo) => {
    try {
      const query = new URLSearchParams(searchInfo).toString();
      const { code, message: msg, data } = await getProtocolAPI(query);
      if (code === 0) {
        setContractList([data]);
        return;
      }
      message.error(msg);
    } catch (error) {
      console.log(error);
    }
  };

  const customRequest = async ({ file, onSuccess, onError }, { kingmiId, kingmiTypeId, fileTypeId }) => {
    const formData = new FormData();
    const params = {
      file,
      kingmiId,
      kingmiType: kingmiTypeId,
      fileType: fileTypeId,
    };
    for (const prop in params) {
      formData.append(prop, params[prop]);
    }
    try {
      const { code, message: msg } = await replaceProtocolAPI(formData);
      if (code === 0) {
        message.success("替换成功");
        renderData(searchInfo);
        onSuccess();
        return;
      }
      message.error(msg);
      onError(msg);
    } catch (error) {
      console.log(error);
      onError(error);
    }
  };

  const handleSubmit = (validateFields) => {
    validateFields(async (err, searchInfo) => {
      if (err) return;
      setSearchInfo(searchInfo);
      renderData(searchInfo);
    });
  };

  const handleDownload = (fileId) => {
    download(fileId);
  };

  const handleKingmiTypeChange = ({ value, resetFields, contractTypeOptions } = {}) => {
    resetFields("fileType");
    setContractOptions(contractTypeOptions[value]);
  };

  return (
    <div>
      <ContractManagement
        {...{
          contractOptions,
          contractList,
          customRequest,
          handleDownload,
          handleSubmit,
          handleKingmiTypeChange,
        }}
      />
    </div>
  );
}

export default Index;
