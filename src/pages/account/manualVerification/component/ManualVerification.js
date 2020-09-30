import React from "react";
import { Form, Input, Button, Row, Col, Radio, Select, DatePicker } from "antd";
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;

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

const colLayout = {
  offset: 2,
  span: 7,
};

const renderDataHeader = [
  {
    id: 0,
    label: "合计金额（元）",
    name: "search[optional]amount",
    extra: "*不含税金额，专票时必填",
  },

  {
    id: 1,
    label: "校验码（后六位）",
    name: "search[optional]verifyCode",
    extra: "*普票、电子发票时 必填",
  },
  {
    id: 2,
    label: "开票日期",
    name: "search[required]openTime",
    render(props) {
      const { searchRequiredOpenTime } = props;
      return <DatePicker {...searchRequiredOpenTime} />;
    },
  },
  {
    id: 3,
    label: "发票代码",
    name: "search[required]code",
  },
  {
    id: 4,
    label: "发票号码",
    name: "search[required]number",
  },
];

const renderDataMain = [
  {
    id: 0,
    label: "开票日期",
    name: "openTime",
    render() {
      return <DatePicker />;
    },
  },
  {
    id: 1,
    label: "校验码",
    name: "verifyCode",
  },
  {
    id: 2,
    label: "发票代码",
    name: "code",
  },
  {
    id: 3,
    label: "发票号码",
    name: "number",
  },
  {
    id: 4,
    label: "发票类型",
    name: "type",
    render() {
      return (
        <Select>
          <Option value={1}>专票</Option>
          <Option value={2}>普票</Option>
          <Option value={3}>电子发票</Option>
        </Select>
      );
    },
  },
  {
    id: 5,
    label: "发票状态",
    name: "billStatus",
    render() {
      return (
        <Select>
          <Option value={0}>正常</Option>
          <Option value={2}>作废</Option>
          <Option value={3}>红冲</Option>
        </Select>
      );
    },
  },
  {
    id: 6,
    label: "合计税额",
    name: "tax",
  },
  {
    id: 7,
    label: "合计金额",
    name: "amount",
  },
];

function ManualVerification(props) {
  const {
    radioVal,
    handleRadioChange,
    handleSubmit,
    handleGoBack,
    handleBlur,
    handlePreviewFile,
    fileId,
  } = props;
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  } = props.form;
  return (
    <div>
      <Form {...formItemLayout}>
        <Row>
          <Col {...colLayout}>
            {renderDataHeader.map((item) => (
              <FormItem key={item.id} label={item.label} extra={item.extra}>
                {getFieldDecorator(item.name)(
                  item.render ? (
                    item.render({
                      searchRequiredOpenTime: {
                        onBlur: () => {
                          handleBlur(getFieldsValue, setFieldsValue);
                        },
                      },
                    })
                  ) : (
                    <Input
                      onBlur={() => {
                        handleBlur(getFieldsValue, setFieldsValue);
                      }}
                    />
                  )
                )}
              </FormItem>
            ))}
          </Col>
          <Col span={6} offset={2} onClick={handlePreviewFile}>
            <img
              src={`api/file/query/${fileId}`}
              alt="发票图片"
              style={{ width: "20vw", cursor: "pointer" }}
            />
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          {renderDataMain.map((item) => (
            <Col key={item.id} {...colLayout}>
              <FormItem label={item.label}>
                {getFieldDecorator(item.name, {
                  rules: [
                    {
                      required: radioVal === 1 ? true : false,
                      message: `请填写${item.label}`,
                    },
                  ],
                })(item.render ? item.render() : <Input />)}
              </FormItem>
            </Col>
          ))}
        </Row>
        <br />
        <br />
        <Row>
          <Col offset={1}>
            <p>选择核验结果</p>
          </Col>
          <Col offset={2} span={6}>
            <FormItem>
              {getFieldDecorator("auditStatus", {
                initialValue: radioVal,
              })(
                <Radio.Group onChange={handleRadioChange}>
                  <Radio value={1}>核验通过</Radio>
                  <Radio value={2}>核验失败</Radio>
                  <p className="mly-tip">*核验失败，必须填写备注信息</p>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem label="备注" labelCol={{ span: 5 }}>
              {getFieldDecorator("remark", {
                rules: [
                  {
                    required: radioVal === 2 ? true : false,
                    message: "请填写备注",
                  },
                ],
              })(<TextArea className="textarea" />)}
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Row>
            <Col offset={5} span={3}>
              <Button
                type="primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(validateFields);
                }}
              >
                提交
              </Button>
            </Col>
            <Col offset={1} span={3}>
              <Button type="primary" onClick={handleGoBack}>
                返回
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>
  );
}

export default Form.create()(ManualVerification);
