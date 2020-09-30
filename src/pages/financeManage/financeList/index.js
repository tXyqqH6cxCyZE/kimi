import React, { Component } from "react";
import SearchForm from "./searchForm.js";
import RcTable from "utils/table/index";
import Pagination from "utils/pagination/pagination";
import { withRouter } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Tabs,
  Button,
  Modal,
  message,
  Form,
  Select,
} from "antd";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import request from "utils/http";
import { fmtMoney, cfca, getMandom, getCertificate } from "utils/format";
import { service } from "utils/form";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class FinanceList extends Component {
  state = {
    pageSize: 10,
    pageNum: 1,
    list: [],
    total: 0,
    activeKey: "0",
    modelVisible: false,
    applyId: null,
    type: null,
    text: null,
    agreeApplyVisible: false,
    cfcaModal: false,
    ukeyList: [],
    approvedAmount: null,
    tabs: [
      {
        id: "0",
        description: "全部",
      },
      {
        id: "1",
        description: "待处理",
      },
    ],
    // statusList: [
    //   "待修改",
    //   "待复核",
    //   "待平台初审",
    //   "待平台复审",
    //   "待机构初审",
    //   "待机构复审",
    //   "待确认融资",
    //   "待核对融资",
    //   "待申请放款",
    //   "待放款",
    // ],
    statusList: [
      "待修改",
      "待平台审核", // 2
      "待保理初审", // 3
      "待核对融资", // 4
      "待保理复审", // 5
      "待放款",
    ],
  };
  componentDidMount() {
    this.props.getInfo();
    this.getListData();
  }
  getListData = async (params = {}) => {
    const { pageSize, pageNum, activeKey } = this.state;
    params["pageSize"] = pageSize;
    params["pageNum"] = pageNum;
    params["filterType"] = parseInt(activeKey, 10);
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
    let response = await request({
      url: "kingmi/financing/list",
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
  okHander = () => {
    const { applyId, type } = this.state;
    let params = {
      financingId: applyId,
      action: type,
    };
    request({
      url: "kingmi/financing/approve",
      method: "post",
      params,
    })
      .then((res) => {
        if (res.code === 0) {
          message.success(res.message);
          this.getListData();
          this.hideModel("modelVisible");
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  hideModel = (type) => {
    this.setState({
      [type]: false,
    });
  };
  showBasicInfo = (record) => {
    this.props.history.push({
      pathname: `/financing/basicInfo/${record.id}`,
      query: {
        stateNum: record.currentState,
      },
    });
  };
  // 拒绝申请
  refuseApply = (record, type, text) => {
    const { id } = record;
    this.setState({
      modelVisible: true,
      applyId: id,
      type,
      text,
    });
  };
  // 确认放款
  agreeApply = (record) => {
    const { approvedAmount, id } = record;
    this.setState(
      {
        approvedAmount,
        applyId: id,
      },
      () => {
        let ukeyList = cfca();
        if (ukeyList.length > 0) {
          this.setState({
            ukeyList,
            cfcaModal: true,
          });
        }
      }
    );
  };

  onKeyChange = () => {
    var CryptoAgent = document.getElementById("CryptoAgent");
    var selectedAlg = "SHA-1";
    const signSourceData = getMandom(6);
    let signedData = CryptoAgent.SignMsgPKCS7(
      signSourceData,
      selectedAlg,
      true
    );
    const bResult = CryptoAgent.VerifyMsgSignaturePKCS7Attached(
      signedData,
      "RSA"
    );
    let data = {
      enterpriseId: this.props.companyInfo.enterpriseId,
      signSourceData: signSourceData,
      signedData: signedData,
    };
    if (bResult) {
      service("cfca/verify", data)
        .then((res) => {
          if (res.data.code === 0) {
            this.hideModel("cfcaModal");
            this.props.form.resetFields();
            this.setState({
              agreeApplyVisible: true,
            });
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // 同意放款
  confirmApply = () => {
    const { applyId } = this.state;
    let params = {
      financingId: applyId,
      action: 1,
    };
    request({
      url: "kingmi/financing/approve",
      method: "post",
      params,
    })
      .then((res) => {
        if (res.code === 0) {
          message.success("放款成功!");
          this.getListData();
          this.hideModel("agreeApplyVisible");
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  showmodify = (record) => {
    this.props.history.push(`/financing/modify/${record.id}`);
  };
  render() {
    const uKey = {
      labelCol: {
        xs: 24,
        sm: 4,
      },
      wrapperCol: {
        xs: 24,
        sm: 20,
      },
    };
    const { getFieldDecorator } = this.props.form;
    const {
      activeKey,
      tabs,
      list,
      statusList,
      text,
      pageNum,
      total,
      cfcaModal,
      ukeyList,
      modelVisible,
      agreeApplyVisible,
      approvedAmount,
    } = this.state;

    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
        width: 100,
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: "融资申请日期",
        dataIndex: "createTime",
        key: "createTime",
        width: 200,
        render: (text, record, index) => text.substring(0, 10),
      },
      {
        title: "粮票单号",
        dataIndex: "kingmiId",
        key: "kingmiId",
        width: 200,
      },
      {
        title: "融资单单号",
        dataIndex: "id",
        key: "id",
        width: 200,
      },
      {
        title: "粮票持有企业",
        dataIndex: "kingmiVo.holderEnterpriseName",
        key: "kingmiVo.holderEnterpriseName",
        width: 200,
      },
      {
        title: "开立企业",
        dataIndex: "kingmiVo.openEnterpriseName",
        key: "kingmiVo.openEnterpriseName",
        width: 200,
      },
      {
        title: "粮票融资金额(元)",
        dataIndex: "amount",
        key: "amount",
        width: 200,
        render: (text, record, index) => text && fmtMoney(text),
      },
      {
        title: "粮票融资到期日",
        dataIndex: "kingmiVo.dueDate",
        key: "kingmiVo.dueDate",
        width: 200,
        render: (text, record, index) => (text ? text.substring(0, 10) : null),
      },
      {
        title: "状态",
        dataIndex: "currentState",
        key: "currentState",
        width: 150,
        render: (text, record, index) => {
          if (text === 100) {
            return "审核通过";
          } else if (text === 99) {
            return "申请被拒绝";
          } else {
            return statusList[text - 1];
          }
        },
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
        width: 200,
        render: (text, record, index) => {
          return (
            <div>
              {activeKey === "0" ? (
                <Button
                  size="small"
                  onClick={() =>
                    this.props.history.push(
                      `/financing/detailDown/${record.id}`
                    )
                  }
                >
                  详情
                </Button>
              ) : record.currentState === 9 ? (
                <div className="operate-wrapper">
                  <Button
                    size="small"
                    onClick={() =>
                      this.refuseApply(record, 2, "确认拒绝本次放款申请?")
                    }
                  >
                    拒绝申请
                  </Button>
                  <Button
                    size="small"
                    onClick={() =>
                      this.refuseApply(record, 1, "确认要申请放款?")
                    }
                  >
                    申请放款
                  </Button>
                  <Button
                    size="small"
                    onClick={() =>
                      this.props.history.push(
                        `/financing/detailDown/${record.id}`
                      )
                    }
                  >
                    详情
                  </Button>
                </div>
              ) : record.currentState === 10 ? (
                <div className="operate-wrapper">
                  <Button
                    size="small"
                    onClick={() =>
                      this.refuseApply(record, 2, "确认拒绝本次放款?")
                    }
                  >
                    拒绝放款
                  </Button>
                  <Button size="small" onClick={() => this.agreeApply(record)}>
                    放款
                  </Button>
                  <Button
                    size="small"
                    onClick={() =>
                      this.props.history.push(
                        `/financing/detailDown/${record.id}`
                      )
                    }
                  >
                    详情
                  </Button>
                </div>
              ) : record.currentState === 1 ? (
                <Button size="small" onClick={() => this.showmodify(record)}>
                  修改
                </Button>
              ) : (
                <Button size="small" onClick={() => this.showBasicInfo(record)}>
                  审核
                </Button>
              )}
            </div>
          );
        },
      },
    ];
    return (
      <Row type="flex" justify="start">
        <Col span={24}>
          <Card
            title={
              this.props.history.location.pathname === "/financing/index"
                ? "粮票融资管理"
                : null
            }
            size="small"
          >
            {this.props.history.location.pathname === "/financing/index" ? (
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
                style={{
                  marginTop: "10px",
                }}
              >
                {tabs.map((item) => (
                  <TabPane tab={item.description} key={item.id}>
                    <RcTable
                      rowKey={"id"}
                      dataSource={list}
                      scrollHeightY={this.props.scrolHeight * 0.6}
                      scrollWidthX={1500}
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
          <Modal
            title={"提示"}
            maskClosable={false}
            visible={modelVisible}
            width={400}
            centered
            onOk={this.okHander}
            onCancel={() => this.hideModel("modelVisible")}
          >
            <p> {text} </p>
          </Modal>
          <Modal
            title={"确认放款"}
            maskClosable={false}
            visible={agreeApplyVisible}
            width={400}
            centered
            onOk={this.confirmApply}
            onCancel={() => this.hideModel("agreeApplyVisible")}
          >
            <p> 本次放款金额为： {approvedAmount / 100}（ 元） </p>
          </Modal>
          <Modal
            title={"提示"}
            maskClosable={false}
            visible={cfcaModal}
            width={500}
            destroyOnClose
            centered
            onOk={this.onKeyChange}
            onCancel={() => this.hideModel("cfcaModal")}
          >
            <Form>
              <FormItem label={"可用证书"} {...uKey}>
                {getFieldDecorator("certificate")(
                  <Select placeholder="请选择">
                    {getCertificate(ukeyList)}
                  </Select>
                )}
              </FormItem>
            </Form>
          </Modal>
        </Col>
      </Row>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    companyInfo: state.reducer.get("companyInfo")
      ? state.reducer.get("companyInfo").toJS()
      : {},
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(FinanceList))
);
