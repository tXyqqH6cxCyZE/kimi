import React, { Component } from "react";
import { Row, Col, Card, Tabs, Button } from "antd";
import { withRouter } from "react-router-dom";
import Pagination from "utils/pagination/pagination";
import SearchForm from "./searchForm.js";
import RcTable from "utils/table/index";
import request from "utils/http";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import { compare, fmtMoney } from "utils/format";

const TabPane = Tabs.TabPane;

class TransManageList extends Component {
  state = {
    pageSize: 10,
    pageNum: 1,
    list: [],
    total: 0,
    activeKey: "2",
    tabs: [
      { id: "2", description: "全部" },
      { id: "3", description: "待处理" },
    ],
    statusList: [
      "待修改",
      "待复核",
      "待平台初审",
      "待平台复审",
      "待接收方初审",
      "待接收方复审",
    ],
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
      url: "kingmi/transfer/list",
      method: "get",
      params: params,
    })
      .then((res) => {
        if (res.code === 0) {
          let { total, list } = res.data;
          this.setState({
            list,
            total,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 转让审核
  showDetail = (record) => {
    this.props.history.push({
      pathname: `/transManage/basicInfo/${record.primaryKingmiId}`,
      query: {
        splitId: record.id,
        stateNum: record.currentState,
      },
    });
  };
  // 转让修改
  showmodify = (record) => {
    this.props.history.push({
      pathname: `/transManage/modify/${record.primaryKingmiId}`,
      query: {
        originId: record.id,
      },
    });
  };
  // 详情
  showBasicInfo = (record) => {
    this.props.history.push({
      pathname: `/transManage/detail/${record.primaryKingmiId}`,
      query: {
        originId: record.id,
        stateNum: record.currentState,
      },
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
  toNewTransfer = (record) => {
    this.props.history.push({
      pathname: `/kimmy/toNewTransfer/${record.id}`,
      query: {
        originKingmiId: record.originKingmiId,
        originId: record.id,
      },
    });
  };
  render() {
    const { activeKey, statusList } = this.state;
    const { userInfo, kimmyAuthority } = this.props;
    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
        width: 100,
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: "转让日期",
        dataIndex: "createTime",
        key: "createTime",
        width: 200,
        render: (text, record, index) => text && text.substring(0, 10),
      },
      {
        title: "粮票单号",
        //              dataIndex: 'originKingmiId',
        //              key: 'originKingmiId',
        dataIndex: "primaryKingmiId",
        key: "primaryKingmiId",
        width: 200,
      },
      {
        title: "转让单单号",
        dataIndex: "id",
        key: "id",
        width: 200,
      },
      {
        title: "受让方",
        dataIndex: "holderEnterpriseName",
        key: "holderEnterpriseName",
        width: 200,
      },
      {
        title: "转让方",
        dataIndex: "primaryEnterpriseName",
        key: "primaryEnterpriseName",
        width: 200,
      },
      {
        title: "粮票转让金额(元)",
        dataIndex: "amount",
        key: "amount",
        width: 200,
        render: (text, record, index) => text && fmtMoney(text),
      },
      {
        title: "粮票转让到期日",
        dataIndex: "dueDate",
        key: "dueDate",
        width: 200,
        render: (text, record, index) => text.substring(0, 10),
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
          if (activeKey === "2") {
            if (
              record.holderEnterpriseId === userInfo.enterpriseId &&
              record.ifPassed === 1 &&
              record.ifFinancing === false &&
              !compare(record.dueDate)
            ) {
              return (
                <span>
                  <Button
                    size="small"
                    onClick={() => this.showBasicInfo(record)}
                  >
                    详情
                  </Button>
                  {kimmyAuthority.includes("transfer") ? (
                    <span>
                      <span className="ant-divider" />
                      <Button
                        size="small"
                        onClick={() => this.toNewTransfer(record)}
                      >
                        转让
                      </Button>
                    </span>
                  ) : null}
                </span>
              );
            } else {
              return (
                <Button size="small" onClick={() => this.showBasicInfo(record)}>
                  详情
                </Button>
              );
            }
          } else if (activeKey === "3") {
            if (record.currentState === 1) {
              return (
                <Button size="small" onClick={() => this.showmodify(record)}>
                  修改
                </Button>
              );
            } else {
              return (
                <Button size="small" onClick={() => this.showDetail(record)}>
                  审核
                </Button>
              );
            }
          }
        },
      },
    ];
    return (
      <Row type="flex" justify="start">
        <Col span={24}>
          <Card title="粮票管理" size="small">
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
            <Col>
              <Tabs
                type="card"
                activeKey={this.state.activeKey}
                onChange={this.tabChange}
                style={{ marginTop: "10px" }}
              >
                {this.state.tabs.map((item) => (
                  <TabPane tab={item.description} key={item.id}>
                    <RcTable
                      rowKey={"id"}
                      dataSource={this.state.list}
                      scrollHeightY={this.props.scrolHeight * 0.6}
                      scrollWidthX={1600}
                      columns={columns}
                    />
                  </TabPane>
                ))}
              </Tabs>
            </Col>
            <Col>
              <Pagination
                current={this.state.pageNum}
                total={this.state.total}
                onChange={(pageNum) => this.onPageNumChange(pageNum)}
              />
            </Col>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.reducer.get("companyInfo").toJS(),
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransManageList)
);
