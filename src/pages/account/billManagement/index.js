import React, { useEffect, useState } from "react";
import BillModal from "./component/BillModal";
import BillManagement from "./component/BillManagement";
import { message } from "antd";
import { getBillListAPI, addBillAPI, addBillUpload } from "server";

async function getTable(params) {
  const dataList = await getBillListAPI(params);
  const { data, code, message: msg } = dataList;
  if (code === 0) {
    return data;
  } else {
    message.error(msg);
  }
}

function Index(props) {
  const [total, setTotal] = useState(0);
  const [searchPar, setSearchPar] = useState({ pageNum: 1, pageSize: 10 });
  const [tableData, setTableData] = useState([]);
  const [visibled, setVisibled] = useState(false);
  const [fileId, setFileId] = useState(undefined);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    (async function() {
      try {
        const { list, total } = await getTable(searchPar);
        setTableData(list);
        setTotal(total);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function customRequest({ file, onSuccess, onError }) {
    const formData = new FormData();
    const params = {
      file,
      relationId: 1,
      relationType: 1,
      fileType: 15,
    };
    for (const prop in params) {
      formData.append(prop, params[prop]);
    }
    try {
      const { data, code, message: msg } = await addBillUpload(formData);
      if (code === 0) {
        setFileId(data);
        onSuccess(data, file);
        return;
      }
      message.error(msg);
      onError(msg);
    } catch (error) {
      console.log(error);
      onError(error);
    }
  }

  function beforeUpload(file) {
    return new Promise((res, rej) => {
      if (
        !["image/jpeg", "image/jpg", "image/png"].includes(file.type) ||
        file.size > 5 * 1024 * 1024
      ) {
        message.error("只能上传PNG、JPG、JPEG格式，且文件 小于5M");
        return rej(false);
      }
      res(true);
    });
  }

  //上传数量限制
  function handleChange({ file, fileList }) {
    if (file && fileList.length >= 2) {
      fileList.shift();
    }
  }

  function handleRemove() {
    setFileId(undefined);
  }

  function handleSearchSubmit(validateFields) {
    validateFields(async (err, data) => {
      const { status } = data;
      const srhPar = {
        ...data,
        status: status === null ? undefined : Number(status),
        pageNum: 1,
        pageSize: 10,
      };
      for (const prop in srhPar) {
        if ([null, "", undefined].includes(srhPar[prop])) delete srhPar[prop];
      }
      try {
        const { list, total } = await getTable(srhPar);
        setSearchPar(srhPar);
        setTableData(list);
        setTotal(total);
        setCurrent(1);
      } catch (error) {
        console.log(error);
      }
    });
  }

  function handleAddBill() {
    setVisibled(true);
  }

  function handleCancel() {
    setVisibled(false);
    setFileId(undefined);
  }

  function handleOk(validateFields) {
    validateFields(async (err, data) => {
      if (err) return;
      const params = {
        ...data,
        fileId,
      };
      try {
        const { code, message: msg } = await addBillAPI(params);
        if (code === 0) {
          message.success("添加成功");
          const { list, total } = await getTable(searchPar);
          handleCancel();
          setTableData(list);
          setTotal(total);
          setCurrent(searchPar.pageNum);
          return;
        }
        message.error(msg);
      } catch (error) {
        console.log(error);
      }
    });
  }

  async function handleTableChange(data) {
    const { current } = data;
    const srhPar = { ...searchPar, pageNum: Number(current) };
    try {
      const { list } = await getTable(srhPar);
      setSearchPar(srhPar);
      setTableData(list);
      setCurrent(current);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <BillManagement
        {...props}
        {...{
          tableData,
          total,
          handleAddBill,
          handleSearchSubmit,
          handleTableChange,
          current,
        }}
      />
      <BillModal
        {...{
          visibled,
          handleCancel,
          handleOk,
          handleChange,
          handleRemove,
          customRequest,
          beforeUpload,
        }}
      />
    </div>
  );
}

export default Index;
