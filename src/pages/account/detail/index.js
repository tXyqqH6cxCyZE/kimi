import React, { useEffect, useState } from "react";
import Detail from "./component/Detail";
import { message } from "antd";
import { getDetailAPI } from "server";

function Index(props) {
  const {
    match: {
      params: { id, fileId },
    },
  } = props;
  const [detailData, setDetailData] = useState({});
  useEffect(() => {
    (async function() {
      try {
        const { code, message: msg, data } = await getDetailAPI(id);
        if (code === 0) {
          setDetailData(data);
          return;
        }
        message.error(msg);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  function handleGoBack() {
    props.history.goBack();
  }

  function handlePreviewFile() {
    window.open(`/api/file/query/${fileId}`);
  }

  return (
    <div>
      <Detail {...{ handleGoBack, detailData, handlePreviewFile, fileId }} />
    </div>
  );
}

export default Index;
