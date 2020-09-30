import React from "react";
import { Card, Form, Input, Button, Select, Table } from "antd";
import SearchPanel from "utils/searchPanel/index";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";

const { Option } = Select;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

const actionDetail = (props, id, fileId) => {
  props.history.push(`/account/detail/${id}/${fileId}`);
};

const actionPer = (props, id, fileId) => {
  props.history.push(`/account/manualVerification/${id}/${fileId}`);
};

const actions = {
  系统核验中: [
    {
      id: 0,
      name: "详情",
      action: actionDetail,
    },
  ],
  人工核验中: [
    {
      id: 0,

      name: "详情",
      action: actionDetail,
    },
  ],
  未使用: [
    {
      id: 0,

      name: "详情",
      action: actionDetail,
    },
    // {
    //   name: "删除",
    //   action: () => {
    //     console.log("shanchu");
    //   },
    // },
  ],
  已开立: [
    {
      id: 0,

      name: "详情",
      action: actionDetail,
    },
    // {
    //   name: "删除",
    //   action: () => {
    //     console.log("shanchu");
    //   },
    // },
  ],
  已融资: [
    {
      id: 0,

      name: "详情",
      action: actionDetail,
    },
    // {
    //   name: "删除",
    //   action: () => {
    //     console.log("shanchu");
    //   },
    // },
  ],
  核验失败: [
    {
      id: 0,
      name: "详情",
      action: actionDetail,
    },
    // {
    //   name: "删除",
    //   action: () => {
    //     console.log("shanchu");
    //   },
    // },
  ],
};

const getColumns = (props) => [
  {
    title: "序号",
    dataIndex: "idx",
    width: "5%",
  },
  {
    title: "业务类型",
    dataIndex: "businessType",
    width: "8%",
  },
  {
    title: "购买方",
    dataIndex: "buyer",
    width: "11%",
  },
  {
    title: "销售方",
    dataIndex: "seller",
    width: "11%",
  },
  {
    title: "发票代码",
    dataIndex: "code",
    width: "9%",
  },
  {
    title: "发票号码",
    dataIndex: "number",
    width: "8%",
  },
  {
    title: "合计金额（元）",
    dataIndex: "amount",
    width: "8%",
  },
  {
    title: "上传企业",
    dataIndex: "upLoadCompany",
    width: "11%",
  },
  {
    title: "上传时间",
    dataIndex: "createTime",
    width: "9%",
  },
  {
    title: "状态",
    dataIndex: "status",
    width: "8%",
  },
  {
    title: "操作",
    dataIndex: "actions",
    render(text, { status, id, fileId }) {
      return (
        <React.Fragment>
          {actions[status].map((item) => (
            <Button
              key={item.id}
              onClick={() => {
                item.action(props, id, fileId);
              }}
            >
              {item.name}
            </Button>
          ))}
          {props.userInfo.category === 4 && status === "人工核验中" && (
            <Button
              onClick={() => {
                actionPer(props, id, fileId);
              }}
            >
              人工核验
            </Button>
          )}
        </React.Fragment>
      );
    },
  },
];

const statusOption = [
  { id: 0, value: null, label: "全部" },
  { id: 1, value: 0, label: "系统核验中" },
  { id: 2, value: 1, label: "人工核验中" },
  { id: 3, value: 2, label: "未使用" },
  { id: 4, value: 3, label: "已开立" },
  { id: 5, value: 4, label: "已融资" },
  { id: 6, value: 5, label: "核验失败" },
];

function BillManagement(props) {
  const { handleAddBill, handleSearchSubmit, tableData, handleTableChange, total, current, userInfo } = props;
  const { getFieldDecorator, validateFields } = props.form;
  return (
    <div>
      <Card title="票据管理">
        <Form {...formItemLayout}>
          <SearchPanel colNum={3} rowNum={2}>
            {[
              [
                <FormItem label="购买方" key={1}>
                  {getFieldDecorator("buyer")(<Input />)}
                </FormItem>,
                <FormItem label="销售方" key={2}>
                  {getFieldDecorator("seller")(<Input />)}
                </FormItem>,
                <FormItem label="发票代码" key={3}>
                  {getFieldDecorator("code")(<Input />)}
                </FormItem>,
                <FormItem label="发票号码" key={4}>
                  {getFieldDecorator("number")(<Input />)}
                </FormItem>,
                <FormItem label="状态" key={5}>
                  {getFieldDecorator("status", {
                    initialValue: null,
                  })(
                    <Select>
                      {statusOption.map((item) => {
                        return (
                          <Option value={item.value} key={item.id}>
                            {item.label}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>,
              ],
              [
                <FormItem key={0} style={{ float: "right" }}>
                  <Button
                    type="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSearchSubmit(validateFields);
                    }}
                  >
                    查询
                  </Button>
                </FormItem>,
              ],
            ]}
          </SearchPanel>
        </Form>
        <div>
          {userInfo.category !== 4 && <Button onClick={handleAddBill}>添加票据</Button>}

          {/* <Button>批量添加</Button> */}
          <Table
            // tableLayout="fixed"
            width="20px"
            pagination={{
              total,
              current,
            }}
            columns={getColumns(props)}
            dataSource={tableData}
            onChange={handleTableChange}
            rowKey={(r) => r.id}
          />
        </div>
      </Card>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.reducer.get("companyInfo").toJS(),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(BillManagement));
