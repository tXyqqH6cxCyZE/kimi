import React from "react";
import { Row, Col, Form, Input, Button } from "antd";

const FormItem = Form.Item;

const colLayout = {
  offset: 1,
  span: 8,
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const renderData1 = [
  {
    id: 1,
    label: "核验状态",
    name: "status",
  },
  {
    id: 2,
    label: "备注",
    name: "remark",
  },
  {
    id: 3,
    label: "购买方",
    name: "buyer",
  },
  {
    id: 4,
    label: "销售方",
    name: "seller",
  },
  {
    id: 5,
    label: "开票日期",
    name: "openTime",
  },
  {
    id: 6,
    label: "发票类型",
    name: "type",
  },
  {
    id: 7,
    label: "发票状态",
    name: "billStatus",
  },
];

const renderData2 = [
  {
    id: 1,
    label: "发票代码",
    name: "code",
  },
  {
    id: 2,
    label: "发票号码",
    name: "number",
  },
  {
    id: 3,
    label: "合计金额（元）",
    name: "amount",
  },
  {
    id: 4,
    label: "合计税额（元）",
    name: "tax",
  },
  {
    id: 5,
    label: "校验码",
    name: "verifyCode",
  },
];

function Detail(props) {
  const { handleGoBack, fileId, detailData, handlePreviewFile } = props;
  return (
    <div>
      <Form {...formItemLayout}>
        <Row>
          {renderData1.map((item) => (
            <Col key={item.id} {...colLayout}>
              <FormItem label={item.label}>
                {item.render ? (
                  item.render()
                ) : (
                  <Input
                    disabled
                    value={detailData[item.name]}
                    title={detailData[item.name]}
                  />
                )}
              </FormItem>
            </Col>
          ))}
        </Row>
        <br />
        <br />
        <Row>
          <Col {...colLayout}>
            {renderData2.map((item) => (
              <FormItem label={item.label} key={item.id}>
                <Input disabled value={detailData[item.name]} />
              </FormItem>
            ))}
          </Col>
          <Col span={8} offset={2} onClick={handlePreviewFile}>
            <img
              src={`api/file/query/${fileId}`}
              alt="发票图片"
              style={{ width: "25vw", cursor: "pointer" }}
            />
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col offset={2} span={3}>
            <Button type="primary" onClick={handleGoBack}>
              返回
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Detail;
