import React, { Component, useState } from "react";
import SearchForm from "./searchForm.js";
import { withRouter } from "react-router-dom";
import RcTable from "utils/table/index";
import request from "utils/http";
import Pagination from "utils/pagination/pagination";
import {
  Row,
  Col,
  Button,
  Card,
  Tabs,
  Modal,
  InputNumber,
  Form,
  message,
  Checkbox,
  Radio,
  Upload,
  Icon,
  Input,
} from "antd";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import { compare, fmtMoney, expiresInThreeDays } from "utils/format";
import UserStateMent from "pages/account/agreement/userStateMent";
import UserServiceProtocol from "pages/account/agreement/userServiceProtocol";
import YiLi from "pages/account/agreement/yilianAgreement";
import { registerKingmiAPI } from "server";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;

const formItemModalLayout = {
  labelCol: { span: 4 },
};

const uploadProps = {
  beforeUpload(file, fileList) {
    const isLt50M = file.size / 1024 / 1024 < 50;
    if (isLt50M) {
      return false;
    } else {
      message.warn("只能上传大小为50M以内，格式为pdf或zip的文件");
      fileList.pop();
      return false;
    }
  },
};

//中登登记弹窗
function NewNakadenModal(props) {
  const [result, setResult] = useState(1);
  const { getFieldDecorator, validateFields } = props.form;
  const { handleNakadenCancel, nakadenVisible, kingmiId } = props;

  const handleChange = (e) => {
    setResult(e.target.value);
  };

  const handleSubmit = () => {
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const formData = new FormData();
      const { file: { file } = {} } = values;
      const params = {
        ...values,
        kingmiId,
        file:
          file instanceof File && file.size / 1024 / 1024 < 50
            ? file
            : undefined,
      };
      for (const prop in params) {
        if (![null, "", undefined].includes(params[prop])) {
          formData.append(prop, params[prop]);
        }
      }
      try {
        const { code, message: msg } = await registerKingmiAPI(formData);
        if (code === 0) {
          message.success(msg);
          setTimeout(() => {
            handleNakadenCancel();
            window.location.reload();
          }, 800);
          return;
        }
        message.error(msg);
      } catch (error) {
        console.log(error);
      }
    });
  };

  //限制上传数量为1
  function handleUploadChange({ file, fileList }) {
    if (file && fileList.length >= 2) {
      fileList.shift();
    }
  }

  return (
    <div>
      <Modal
        destroyOnClose
        visible={nakadenVisible}
        title="中登登记"
        onCancel={() => {
          setResult(1);
          handleNakadenCancel();
        }}
        onOk={handleSubmit}
      >
        <Form {...formItemModalLayout}>
          <FormItem label="登记结果">
            {getFieldDecorator("registerResult", {
              initialValue: result,
            })(
              <RadioGroup onChange={handleChange}>
                <Radio value={1}>成功</Radio>
                <Radio value={0}>失败</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="登记资料">
            {getFieldDecorator("file", {
              rules: [
                {
                  required: result === 1,
                  message: "请填写登记资料",
                },
                {
                  validator: (rule, value, callback) => {
                    if (result === 1 && value) {
                      if (!value.fileList.length) {
                        callback("请填写登记资料");
                      }
                      if (value.file.status === "error") {
                        callback("请重新上传登记资料");
                      }
                    }
                    callback();
                  },
                },
              ],
            })(
              <Upload {...uploadProps} onChange={handleUploadChange}>
                <Button>
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator("registerNote", {
              rules: [
                {
                  required: result === 0,
                  message: "请填写备注",
                },
              ],
            })(<TextArea rows={4} />)}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

const NakadenModal = Form.create()(NewNakadenModal);

class Info extends Component {
  state = {
    pageSize: 10,
    pageNum: 1,
    list: [],
    id: null,
    total: 0,
    activeKey: "0",
    show: true,
    nakadenVisible: false,
    kingmiId: "",
    // 应收账款
    receiveList: [
      "待修改",
      "待复核",
      "待核心企业确认",
      "待核心企业复核",
      "待平台初审",
      "待平台复审",
      "待保理公司初审",
      "待保理公司复审",
    ],
    // 应付账款
    // copeList: ['待修改', '待核心企业复核', '待平台初审', '待平台复审', '待保理公司初审', '待保理公司复审'],
    copeList: ["待修改", "待平台审核", "待供应商审核"],
    disabled: true, // 协议是否都勾选  控制提交按钮状态
    userStateVisible: false,
    userServiceProtocol: false,
    yiliVisible: false,
    protocolVisible: false, // 协议弹框现实与否
  };
  componentWillMount() {
    this.props.getInfo(window.location.hash);
  }
  componentDidMount() {
    this.getListData();
  }
  getListData = async (params = {}) => {
    params["pageSize"] = this.state.pageSize;
    params["pageNum"] = this.state.pageNum;
    params["filterType"] = parseInt(this.state.activeKey, 10);
    params = Object.assign(
      {},
      params,
      this.searchForm && this.searchForm.props.form.getFieldsValue()
    );
    for (let i in params) {
      if (typeof params[i] === "undefined") {
        delete params[i];
      }
    }

    const rangeValue =
      this.searchForm && this.searchForm.props.form.getFieldsValue();
    if (
      rangeValue &&
      rangeValue.distrDt != undefined &&
      rangeValue.distrDt.length == 2
    ) {
      params["startDate"] = rangeValue.distrDt[0].format("YYYY-MM-DD");
      params["endDate"] = rangeValue.distrDt[1].format("YYYY-MM-DD");
    }

    delete params.distrDt;
    await request({
      url: "kingmi/list",
      method: "get",
      params,
    }).then((res) => {
      if (res.code === 0) {
        let { total, list } = res.data;
        this.setState({
          list,
          total,
        });
      }
    });
    if (this.props.isShow) {
      this.setState({
        show: false,
      });
    }
  };

  //tab页面切换
  tabChange = (key) => {
    this.setState(
      {
        activeKey: key,
        pageNum: 1,
        list: [],
      },
      () => {
        this.getListData();
      }
    );
  };
  applyFinace = async ({ id }) => {
    this.props.history.push({
      pathname: `/financing/financeApply/${id}`,
    });
  };
  // 分页切换
  onPageNumChange(pageNum) {
    this.setState(
      {
        pageNum,
      },
      () => {
        this.getListData();
      }
    );
  }
  // 粮票查看详情
  showDetail = () => {
    this.searchShowProtocol();
  };

  showBasicInfo = (record) => {
    this.props.history.push({
      pathname: `/kimmy/basicInfo/${record.id}`,
      query: {
        stateNum: record.currentState,
        credentialType: record.credentialType,
      },
    });
  };
  // 阅读协议
  readAgreement = (type) => {
    this.setState({
      [type]: true,
    });
  };
  closeAgreement = (type) => {
    this.setState({
      [type]: false,
    });
  };
  isCheck = (e) => {
    let checked = e.target.checked;
    this.setState({
      disabled: !checked,
    });
  };

  // ajax请求看是否需要 显示弹框
  searchShowProtocol = () => {
    request({
      url: "kingmi/checkProtocol",
      method: "post",
    }).then((res) => {
      if (res.data) {
        // 如果是true返回，表示已经勾选了协议，直接跳转路由
        this.props.history.push(`/account/addGold`);
      } else {
        // 如果为false，则表示没有勾选协议，显示弹框
        this.setState({
          protocolVisible: true,
        });
      }
    });
  };
  hideProtocolModal = () => {
    this.setState({
      protocolVisible: false,
    });
  };
  confirmProtocolModal = () => {
    // 提交ajax
    request({
      url: "kingmi/agreeProtocol",
      method: "post",
    }).then((res) => {
      if (res.data) {
        // 如果是true返回，表示已经勾选了协议，直接跳转路由
        this.setState({
          protocolVisible: false,
        });
        this.props.history.push(`/account/addGold`);
      }
    });
  };
  handleNakadenCancel = () => {
    this.setState({
      nakadenVisible: false,
    });
  };
  render() {
    const formItemLayout = {
      labelCol: {
        xs: 24,
        sm: 10,
      },
      wrapperCol: {
        xs: 24,
        sm: 14,
      },
    };
    const { userInfo, kimmyTabs, kimmyAuthority } = this.props;
    const {
      activeKey,
      show,
      availableAmount,
      receiveList,
      copeList,
      list,
      pageNum,
      total,
      userStateVisible,
      userServiceProtocol,
      yiliVisible,
      disabled,
      nakadenVisible,
      kingmiId,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
        width: 150,
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: "粮票申请日期",
        dataIndex: "createTime",
        key: "createTime",
        width: 250,
        render: (text, record, index) => text && text.substring(0, 10),
      },
      {
        title: "到期日",
        dataIndex: "dueDate",
        key: "dueDate",
        width: 250,
        render: (text, record, index) => text.substring(0, 10),
      },
      {
        title: "粮票单号",
        dataIndex: "id",
        key: "id",
        width: 200,
      },
      {
        title: "提交角色",
        dataIndex: "credentialType",
        key: "credentialType",
        width: 200,
        render: (text, record, index) =>
          record.credentialType === 1 ? "供应商" : "核心企业",
      },
      {
        title: "粮票持有企业",
        dataIndex: "holderEnterpriseName",
        key: "holderEnterpriseName",
        width: 300,
      },
      {
        title: "开立企业",
        dataIndex: "openEnterpriseName",
        key: "openEnterpriseName",
        width: 200,
      },
      {
        title: "保理公司",
        dataIndex: "factoringEnterpriseName",
        key: "factoringEnterpriseName",
        width: 250,
      },
      {
        title: "粮票金额(元)",
        dataIndex: "amount",
        key: "amount",
        width: 200,
        render: (text, record, index) => text && fmtMoney(text),
      },
      {
        title: "是否转让",
        dataIndex: "ifTransfer",
        key: "ifTransfer",
        width: 200,
        render: (text, record, index) =>
          record.ifTransfer === 1 ? "是" : "否",
      },
      {
        title: "能否延期",
        dataIndex: "ifDelay",
        key: "ifDelay",
        width: 200,
        render: (text, record, index) => (record.ifDelay === 1 ? "是" : "否"),
      },
      {
        title: "是否担保",
        dataIndex: "ifGuarantee",
        key: "ifGuarantee",
        width: 200,
        render: (text, record, index) =>
          record.ifGuarantee === 1 ? "是" : "否",
      },
      {
        title: "状态",
        dataIndex: "currentState",
        key: "currentState",
        width: 250,
        render: (text, record, index) => record.currentStateAlias,
      },
      {
        title: "区块链交易ID尾号",
        dataIndex: "txId",
        key: "txId",
        width: 130,
        render: (text) => (text ? text.slice(-16) : "--"),
      },
      {
        title: "操作",
        dataIndex: "operate",
        key: "operate",
        width: 300,
        render: (text, record, index) => (
          <div className="operate-wrapper">
            {activeKey === "0" ? (
              <Button
                size="small"
                onClick={() =>
                  this.props.history.push(`/kimmy/detail/${record.id}`)
                }
              >
                详情
              </Button>
            ) : activeKey === "1" && record.toRegister !== 1 ? (
              <Button size="small" onClick={() => this.showBasicInfo(record)}>
                审核
              </Button>
            ) : activeKey === "2" ? (
              <Button
                size="small"
                onClick={() =>
                  this.props.history.push(`/kimmy/revised/${record.id}`)
                }
              >
                修改
              </Button>
            ) : record.toRegister === 1 ? (
              <Button
                size="small"
                onClick={() => {
                  this.setState({
                    nakadenVisible: true,
                    kingmiId: record.id,
                  });
                }}
              >
                中登登记
              </Button>
            ) : (
              <div>
                {userInfo.role === 3 ? (
                  <span>
                    {kimmyAuthority.includes("transfer") ? (
                      <Button
                        size="small"
                        onClick={() => {
                          const dayGap = expiresInThreeDays(
                            record.dueDate.substring(0, 10)
                          );
                          if (dayGap > 3) {
                            this.props.history.push(
                              `/kimmy/transfer/${record.id}`
                            );
                          } else {
                            message.info("到期日前三天不可以转让");
                          }
                        }}
                        disabled={compare(record.dueDate)}
                      >
                        转让
                      </Button>
                    ) : null}
                    {kimmyAuthority.includes("financing") ? (
                      <Button
                        size="small"
                        disabled={compare(record.dueDate)}
                        onClick={() => this.applyFinace(record)}
                      >
                        申请融资
                      </Button>
                    ) : null}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        ),
      },
    ];
    return (
      <Row type="flex" justify="start">
        <Col span={24}>
          <Card
            title={show ? "粮票管理" : null}
            size="small"
            extra={
              <div>
                {show && kimmyAuthority.includes("kingmi") ? (
                  <div>
                    {/*<Button style = {{marginRight: '10px'}} onClick = {this.showDetail}>
				        		新增粮票
				        </Button>*/}
                    <Button
                      style={{ marginRight: "10px" }}
                      onClick={this.showDetail}
                    >
                      粮票申请
                    </Button>
                  </div>
                ) : null}
              </div>
            }
          >
            {this.props.history.location.pathname === "/kimmy/index" ? (
              <Col>
                <SearchForm
                  wrappedComponentRef={(form) => {
                    this.searchForm = form;
                  }}
                  sta={this.state}
                  setState={this.setState.bind(this)}
                  getListData={this.getListData.bind(this)}
                />
              </Col>
            ) : null}
            <Col>
              <Tabs
                type="card"
                activeKey={activeKey}
                onChange={this.tabChange}
                // tabBarExtraContent={
                //   show ? (
                //     <div>
                //       <Button
                //         onClick={() =>
                //           this.props.history.push("/kimmy/download")
                //         }
                //       >
                //         导出成功粮票
                //       </Button>
                //     </div>
                //   ) : null
                // }
                style={{ marginTop: "10px" }}
              >
                {kimmyTabs.map((item) => (
                  <TabPane tab={item.name} key={item.id}>
                    <RcTable
                      rowKey={"id"}
                      dataSource={list}
                      scrollWidthX={1600}
                      columns={columns}
                    />
                  </TabPane>
                ))}
              </Tabs>
            </Col>
            <Col>
              <Pagination
                current={pageNum}
                total={total}
                onChange={(pageNum) => this.onPageNumChange(pageNum)}
              />
            </Col>
          </Card>
        </Col>
        <Modal
          title={"确认协议："}
          maskClosable={false}
          visible={this.state.protocolVisible}
          width={1000}
          onCancel={this.hideProtocolModal}
          footer={[
            <Button
              key="close"
              disabled={disabled}
              onClick={this.confirmProtocolModal}
            >
              确认
            </Button>,
          ]}
          centered
        >
          <div>
            <Checkbox onChange={this.isCheck} style={{ marginRight: "10px" }} />
            我已阅读、理解并同意
            <a onClick={() => this.readAgreement("userStateVisible")}>
              《用户声明》
            </a>
            <a onClick={() => this.readAgreement("userServiceProtocol")}>
              《用户服务协议》
            </a>
            <a onClick={() => this.readAgreement("yiliVisible")}>
              《粮票使用协议》
            </a>
          </div>
        </Modal>
        <UserStateMent
          visible={userStateVisible}
          closeModel={this.closeAgreement}
        />
        <UserServiceProtocol
          visible={userServiceProtocol}
          closeModel={this.closeAgreement}
        />
        <YiLi visible={yiliVisible} closeModel={this.closeAgreement} />
        <NakadenModal
          kingmiId={kingmiId}
          nakadenVisible={nakadenVisible}
          handleNakadenCancel={this.handleNakadenCancel}
        />
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.reducer.get("companyInfo") ? state.reducer.get("companyInfo").toJS() : {},
    kimmyTabs: state.reducer.get("kimmyTabs"),
    kimmyAuthority: state.reducer.get("kimmyAuthority"),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};

let CustomAddGold = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(Info))
);
export default (props) => (
  <CustomAddGold isShow={props.flag} userInfoId={props.userInfoId} />
);
