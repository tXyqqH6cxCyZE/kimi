import React, { useMemo } from "react";
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  Table,
  Upload,
} from "antd";
import moment from "moment";
import { beforeUploadPDFZIP_promise } from "utils/format";

const FormItem = Form.Item;
const Option = Select.Option;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const colLayout = {
  offset: 1,
  span: 6,
};

const transactionTypeOptions = [
  {
    id: 1,
    key: "开立",
    value: 1,
  },
  {
    id: 2,
    key: "转让",
    value: 2,
  },
  {
    id: 3,
    key: "融资",
    value: 3,
  },
];

const contractTypeOptions = {
  1: [
    {
      id: 0,
      key: "付款承诺函",
      value: 1,
    },
    {
      id: 1,
      key: "开立凭证",
      value: 2,
    },

    {
      id: 6,
      key: "开立协议（光大）",
      value: 7,
    },
  ],
  2: [
    {
      id: 2,
      key: "转让协议",
      value: 3,
    },
    {
      id: 3,
      key: "转让凭证",
      value: 4,
    },
  ],
  3: [
    {
      id: 4,
      key: "融资申请单",
      value: 5,
    },
    {
      id: 5,
      key: "融资协议",
      value: 6,
    },
    {
      id: 7,
      key: "授权书（光大）",
      value: 8,
    },
    {
      id: 8,
      key: "融资协议（光大）",
      value: 9,
    },
  ],
};
const getColumns = ({ customRequest, handleDownload }) => [
  {
    title: "序号",
    dataIndex: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "粮票单号",
    dataIndex: "kingmiId",
  },
  {
    title: "交易类型",
    dataIndex: "kingmiType",
  },
  {
    title: "合同类型",
    dataIndex: "fileTypeName",
  },
  {
    title: "签署状态",
    dataIndex: "statesAlias",
  },
  {
    title: "签署人",
    dataIndex: "person",
  },
  {
    title: "签约时间",
    dataIndex: "signedTime",
    render: (text) => moment(text).format("YYYY-MM-DD"),
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    render: (text) => moment(text).format("YYYY-MM-DD"),
  },
  {
    title: "操作",
    dataIndex: "actions",
    render: (text, record, index) => (
      <React.Fragment>
        <Button
          onClick={() => {
            handleDownload(record.fileId);
          }}
        >
          预览
        </Button>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <Upload
          accept=".zip,.pdf"
          showUploadList={false}
          customRequest={(props) => customRequest(props, record)}
          beforeUpload={beforeUploadPDFZIP_promise}
        >
          <Button>替换</Button>
        </Upload>
      </React.Fragment>
    ),
  },
];

function ContractManagement(props) {
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    contractList,
    contractOptions,
    customRequest,
    handleDownload,
    handleSubmit,
    handleKingmiTypeChange,
  } = props;
  const renderData = useMemo(
    () => [
      {
        id: 0,
        label: "粮票单号",
        name: "kingmiId",
        rules: [
          {
            pattern: /^\d+$/,
            message: "粮票单号只能是数字",
          },
        ],
      },
      {
        id: 1,
        label: "交易类型",
        name: "kingmiType",
        render() {
          return (
            <Select
              onChange={(value) => {
                handleKingmiTypeChange({
                  value,
                  resetFields,
                  contractTypeOptions,
                });
              }}
            >
              {transactionTypeOptions.map((item) => (
                <Option key={item.id} value={item.value}>
                  {item.key}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 2,
        label: "合同类型",
        name: "fileType",
        render() {
          return (
            <Select>
              {contractOptions.map((item) => (
                <Option key={item.id} value={item.value}>
                  {item.key}
                </Option>
              ))}
            </Select>
          );
        },
      },
    ],
    [contractOptions, transactionTypeOptions]
  );
  return (
    <div>
      <Card title="合同管理">
        <Form
          {...formLayout}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(validateFields);
          }}
        >
          <Row>
            {renderData.map((item) => (
              <Col key={item.id} {...colLayout}>
                <FormItem label={item.label}>
                  {getFieldDecorator(item.name, {
                    rules: [
                      {
                        required: true,
                        message: `${item.label}不能为空`,
                      },
                      ...(item.rules || []),
                    ],
                  })(item.render ? item.render() : <Input />)}
                </FormItem>
              </Col>
            ))}
          </Row>
          <Row type="flex" justify="end">
            <Col pull={1}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Col>
          </Row>
        </Form>
        <br />
        <br />
        <div>
          <Table
            dataSource={contractList}
            columns={getColumns({ customRequest, handleDownload })}
            rowKey="kingmiId"
          />
        </div>
      </Card>
    </div>
  );
}

export default Form.create()(ContractManagement);
