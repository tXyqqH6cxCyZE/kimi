import React, { Component } from "react";
import { Row, Col, Card, Button, message } from "antd";
import { withRouter, NavLink } from "react-router-dom";
import RcTable from "utils/table/index";
import Pagination from "utils/pagination/pagination";
import { connect } from "react-redux";
import { CREDIT_RESULT } from "store/actionTypes";
import { format, getSelectOption, fmtMoney } from "utils/format";
import { getUserInfo } from "store/actionCreators";
import { getRelationDownAPI } from "server";

class Info extends Component {
  state = {
    total: 0,
    enterPriseList: [],
    pageSize: 10,
    pageNum: 1,
    totalEnterpriseCount: 0,
    totalCredit: 0,
    totalAvailableCredit: 0,
    statusList: ["待修改", "待初审", "待复审", "待平台初审", "待平台复审"],
  };
  componentDidMount() {
    this.props.getInfo();
    this.getListData();
  }
  getListData = async () => {
    const { enterpriseId } = this.props.companyInfo;
    try {
      const {
        code,
        message: msg,
        data: { count, totalCredit, totalAvailableCredit, list } = {},
      } = await getRelationDownAPI(enterpriseId);
      if (code === 0) {
        this.setState({
          totalCredit,
          totalAvailableCredit,
          totalEnterpriseCount: count,
          enterPriseList: list,
        });
        return;
      }
      message.error(msg);
    } catch (error) {
      console.log(error);
    }
  };
  // 详情
  showDetail(record, category) {
    this.props.history.push({
      pathname: `/account/examine/${record.relatedId}`,
      query: {
        record,
        category,
        fsmState: record.fsmState,
      },
    });
  }

  // 分页切换
  onPageNumChange(pageNum) {
    this.setState({ pageNum }, () => {
      this.getListData();
    });
  }
  render() {
    const { creditList, companyInfo } = this.props;
    const { id } = this.props.match.params;
    const {
      totalEnterpriseCount,
      totalCredit,
      totalAvailableCredit,
      statusList,
    } = this.state;
    const creditType = getSelectOption(creditList);
    let columns = !id
      ? [
          {
            title: "序号",
            dataIndex: "index",
            key: "index",
            width: 100,
            render: (text, record, index) => `${index + 1}`,
          },
          {
            title: "公司名称",
            dataIndex: "enterpriseName",
            key: "enterpriseName",
            width: 200,
          },
          {
            title: "授信额度（元）",
            dataIndex: "totalCredit",
            key: "totalCredit",
            width: 180,
            render: (text, record, index) => text && fmtMoney(text),
          },
          {
            title: "可用授信额度（元）",
            dataIndex: "totalAvailableCredit",
            key: "totalAvailableCredit",
            width: 200,
            render: (text, record, index) => text && fmtMoney(text),
          },
          // {
          //   title: "状态",
          //   dataIndex: "fsmState",
          //   key: "fsmState",
          //   width: 200,
          //   render: (text, record, index) => {
          //     //                  creditType && creditType.forEach(function (val) {
          //     //                      if (val.props.value == text) {
          //     //                          text = val.props.children;
          //     //                      }
          //     //                  });
          //     //                  return text;
          //     if (text === 100) {
          //       return "已生效";
          //     } else if (text === 99) {
          //       return "已失效";
          //     } else {
          //       return statusList[text - 1];
          //     }
          //   },
          // },
          // {
          //   title: "操作",
          //   dataIndex: "operate",
          //   key: "operate",
          //   width: 200,
          //   render: (text, record, index) => {
          //     return (
          //       <div>
          //         {companyInfo.category === 2 ? (
          //           <Button
          //             size="small"
          //             onClick={() => this.showDetail(record, 2)}
          //           >
          //             详情
          //           </Button>
          //         ) : companyInfo.category === 1 && record.fsmState === 100 ? (
          //           <div>
          //             <Button
          //               size="small"
          //               onClick={() => this.showDetail(record, 2)}
          //             >
          //               详情
          //             </Button>
          //           </div>
          //         ) : (
          //           <Button
          //             size="small"
          //             onClick={() => this.showDetail(record, 1)}
          //           >
          //             审核
          //           </Button>
          //         )}
          //       </div>
          //     );
          //   },
          // },
        ]
      : [
          {
            title: "编号",
            dataIndex: "index",
            key: "index",
            width: 100,
            render: (text, record, index) => `${index + 1}`,
          },
          {
            title: "授信企业",
            dataIndex: "upName",
            key: "upName",
            width: 200,
          },
          {
            title: "被授信企业",
            dataIndex: "downName",
            key: "downName",
            width: 180,
          },
          {
            title: "授信额度（元）",
            dataIndex: "totalCredit",
            key: "totalCredit",
            width: 200,
            render: (text, record, index) => text && fmtMoney(text),
          },
          // {
          //   title: "状态",
          //   dataIndex: "fsmState",
          //   key: "fsmState",
          //   width: 200,
          //   render: (text, record, index) => {
          //     if (text === 100) {
          //       return "已生效";
          //     } else if (text === 99) {
          //       return "已失效";
          //     } else {
          //       return statusList[text - 1];
          //     }
          //   },
          // },
          // {
          //   title: "操作",
          //   dataIndex: "operate",
          //   key: "operate",
          //   width: 200,
          //   render: (text, record, index) => {
          //     return (
          //       <div>
          //         {companyInfo.category === 3 &&
          //         (record.fsmState === 4 || record.fsmState === 5) &&
          //         (companyInfo.role === 1 || companyInfo.role === 4) ? (
          //           <Button
          //             size="small"
          //             onClick={() => this.showDetail(record, 3)}
          //           >
          //             审核
          //           </Button>
          //         ) : (
          //           <Button
          //             size="small"
          //             onClick={() => this.showDetail(record, 2)}
          //           >
          //             详情
          //           </Button>
          //         )}
          //       </div>
          //     );
          //   },
          // },
        ];
    return (
      <div>
        <Row>
          <Col span={24}>
            <Card title="账户资料 企业授信详情" size="small">
              <Row className="info">
                {companyInfo.category === 2 ? (
                  <Col span={6}>
                    <Button>
                      <NavLink to="/account/coreCompany">
                        核心企业授信认证
                      </NavLink>
                    </Button>
                  </Col>
                ) : null}
                {id ? (
                  ""
                ) : (
                  <Col span={18} className="right">
                    <span>总授信企业: {totalEnterpriseCount} 家 </span>
                    <span>总授信额度: {fmtMoney(totalCredit)} 元</span>
                    <span>
                      {" "}
                      总可用授信额度: {fmtMoney(totalAvailableCredit)} 元{" "}
                    </span>
                  </Col>
                )}
              </Row>
              <Row>
                <Col span={24}>
                  <RcTable
                    rowKey="id"
                    dataSource={this.state.enterPriseList}
                    columns={columns}
                  />
                  {/* <Pagination
                    current={this.state.pageNum}
                    total={this.state.total}
                    onChange={(pageNum) => this.onPageNumChange(pageNum)}
                  /> */}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  creditList: format(state.reducer.get("list").toJS(), CREDIT_RESULT),
  companyInfo: state.reducer.get("companyInfo").toJS(),
});
const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};
let CustomExamine = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Info)
);

export default () => <CustomExamine />;
