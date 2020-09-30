import React, { Component } from "react";
import CardInfo from "./cardInfo";
import SearchForm from "./searchForm.js";
import { withRouter } from "react-router-dom";
import { Row, Col, Button, Card, Tabs, Modal, message } from "antd";
import RcTable from "utils/table/index";
import Pagination from "utils/pagination/pagination";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import request from "utils/http";
import { fmtMoney } from "utils/format";

const TabPane = Tabs.TabPane;

class RepayManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      list: [],
      total: 0,
      activeKey: "13",
      id: null,
      modalVisible: false,
      info: {},
      tabs: [
        {
          id: "13",
          description: "全部",
        },
        {
          id: "10",
          description: "未完成",
        },
        {
          id: "11",
          description: "已完成",
        },
        {
          id: "12",
          description: "3日待还",
        },
      ],
    };
  }
  componentWillMount() {
    this.props.getInfo();
  }
  componentDidMount() {
    this.getStatic();
    this.getListData();
  }
  getStatic = async () => {
    let info = await request({
      url: "kingmi/financing/statistics",
      method: "get",
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          info: res.data,
        });
      }
    });
  };
  hideModal = () => {
    this.setState({
      modalVisible: false,
    });
  };
  getListData = async (params = {}) => {
    params["pageSize"] = this.state.pageSize;
    params["pageNum"] = this.state.pageNum;
    params["filterType"] = parseInt(this.state.activeKey, 10);
    params = Object.assign(
      {},
      params,
      this.searchForm.props.form.getFieldsValue()
    );
    for (let i in params) {
      if (typeof params[i] === "undefined") {
        delete params[i];
      }
    }
    const rangeValue = this.searchForm.props.form.getFieldsValue();
    if (rangeValue.distrDt != undefined && rangeValue.distrDt.length == 2) {
      params["startDate"] = rangeValue.distrDt[0].format("YYYY-MM-DD");
      params["endDate"] = rangeValue.distrDt[1].format("YYYY-MM-DD");
    }

    delete params.distrDt;
    await request({
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
  repay({ id }) {
    this.setState({
      modalVisible: true,
      id,
    });
  }
  okHandler = () => {
    let params = {};
    params["financingId"] = this.state.id;
    request({
      url: "kingmi/financing/repay",
      method: "get",
      params,
    })
      .then((res) => {
        if (res.code === 0) {
          message.success("扣款成功!");
          this.hideModal();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    const { info, activeKey } = this.state;
    const columns =
      activeKey === "0" || activeKey === "11"
        ? [
            {
              title: "序号",
              dataIndex: "index",
              key: "index",
              width: 150,
              render: (text, record, index) => `${index + 1}`,
            },
            {
              title: "融资单单号",
              dataIndex: "id",
              key: "id",
              width: 150,
            },
            {
              title: "卖方名称",
              dataIndex: "kingmiVo.holderEnterpriseName",
              key: "kingmiVo.holderEnterpriseName",
              width: 150,
            },
            {
              title: "放款日期",
              dataIndex: "lastApproveTime",
              key: "lastApproveTime",
              width: 200,
              render: (text, record, index) => {
                return text && text.substring(0, 10);
              },
            },
            {
              title: "放款金额",
              dataIndex: "amount",
              key: "amount",
              width: 150,
              render: (text, record, index) => {
                return text && fmtMoney(text);
              },
            },
            {
              title: "应还日期",
              dataIndex: "kingmiVo.dueDate",
              key: "kingmiVo.dueDate",
              width: 200,
              render: (text, record, index) => {
                return text && text.substring(0, 10);
              },
            },
            {
              title: "利息(元)",
              dataIndex: "overduePenalty",
              key: "overduePenalty",
              width: 150,
              render: (text) => {
                return text && fmtMoney(text);
              },
            },
            {
              title: "还款状态",
              dataIndex: "currentState",
              key: "currentState",
              width: 150,
              render(text, record, index) {
                if (record.soaDate) {
                  return "已还款";
                } else {
                  if (record.dueDate < new Date()) {
                    return "已逾期";
                  } else {
                    return "待还款";
                  }
                }
              },
            },
            {
              title: "应还合计(元)",
              dataIndex: "total",
              key: "total",
              width: 150,
              render(text, record, index) {
                return fmtMoney(record.amount + record.overduePenalty);
              },
            },
            {
              title: "区块链交易ID尾号",
              dataIndex: "txId",
              key: "txId",
              width: 200,
              render: (text) => (text ? text.slice(-16) : "--"),
            },
            {
              title: "操作",
              dataIndex: "operate",
              key: "operate",
              width: 230,
              className: "formatCenetr",
              render: (text, record, index) => {
                return (
                  <span>
                    <Button
                      size="small"
                      onClick={() =>
                        this.props.history.push(
                          `/financing/detail/${record.id}`
                        )
                      }
                    >
                      详情
                    </Button>
                    {!record.soaDate ? (
                      <span>
                        <span className="ant-divider" />
                        <Button size="small" onClick={() => this.repay(record)}>
                          还款
                        </Button>
                      </span>
                    ) : null}
                  </span>
                );
              },
            },
          ]
        : [
            {
              title: "序号",
              dataIndex: "index",
              key: "index",
              width: 150,
              render: (text, record, index) => `${index + 1}`,
            },
            {
              title: "融资单单号",
              dataIndex: "id",
              key: "id",
              width: 150,
            },
            {
              title: "卖方名称",
              dataIndex: "kingmiVo.holderEnterpriseName",
              key: "kingmiVo.holderEnterpriseName",
              width: 150,
            },
            {
              title: "放款日期",
              dataIndex: "lastApproveTime",
              key: "lastApproveTime",
              width: 200,
              render: (text, record, index) => {
                return text && text.substring(0, 10);
              },
            },
            {
              title: "放款金额",
              dataIndex: "amount",
              key: "amount",
              width: 150,
              render: (text, record, index) => {
                return text && fmtMoney(text);
              },
            },
            {
              title: "应还日期",
              dataIndex: "kingmiVo.dueDate",
              key: "kingmiVo.dueDate",
              width: 200,
              render: (text, record, index) => {
                return text && text.substring(0, 10);
              },
            },
            {
              title: "利息(元)",
              dataIndex: "overduePenalty",
              key: "overduePenalty",
              width: 150,
              render: (text) => {
                return text && fmtMoney(text);
              },
            },
            {
              title: "还款状态",
              dataIndex: "currentState",
              key: "currentState",
              width: 150,
              render(text, record, index) {
                if (record.soaDate) {
                  return "已还款";
                } else {
                  if (record.dueDate < new Date()) {
                    return "已逾期";
                  } else {
                    return "待还款";
                  }
                }
              },
            },
            {
              title: "应还合计(元)",
              dataIndex: "total",
              key: "total",
              width: 150,
              render(text, record, index) {
                return fmtMoney(record.amount + record.overduePenalty);
              },
            },
            {
              title: "操作",
              dataIndex: "operate",
              key: "operate",
              width: 230,
              className: "formatCenetr",
              render: (text, record, index) => {
                return (
                  <span>
                    <Button
                      size="small"
                      onClick={() =>
                        this.props.history.push(
                          `/financing/detail/${record.id}`
                        )
                      }
                    >
                      详情
                    </Button>
                    {!record.soaDate ? (
                      <span>
                        <span className="ant-divider" />
                        <Button size="small" onClick={() => this.repay(record)}>
                          还款
                        </Button>
                      </span>
                    ) : null}
                  </span>
                );
              },
            },
          ];
    return (
      <Row type="flex" justify="start">
        <Col span={24}>
          <Card title="还款管理" size="small">
            <CardInfo info={info} />
            <SearchForm
              wrappedComponentRef={(form) => {
                this.searchForm = form;
              }}
              sta={this.state}
              setState={this.setState.bind(this)}
              getListData={this.getListData.bind(this)}
            />
            <Tabs
              type="card"
              activeKey={this.state.activeKey}
              onChange={this.tabChange}
              style={{
                marginTop: "10px",
              }}
            >
              {this.state.tabs.map((item) => (
                <TabPane tab={item.description} key={item.id}></TabPane>
              ))}
            </Tabs>
            <RcTable
              rowKey={"id"}
              dataSource={this.state.list}
              scrollWidthX={1300}
              columns={columns}
            />
            <Pagination
              current={this.state.pageNum}
              total={this.state.total}
              onChange={(pageNum) => this.onPageNumChange(pageNum)}
            />
            <Modal
              title={"提示"}
              maskClosable={false}
              visible={this.state.modalVisible}
              width={400}
              onOk={this.okHandler}
              onCancel={this.hideModal}
              centered
            >
              <p> 确认要还此笔融资单？ </p>
            </Modal>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};
export default withRouter(connect(null, mapDispatchToProps)(RepayManage));
