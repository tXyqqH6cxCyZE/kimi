import React, { Component } from "react";
import { Col, Row, Button } from "antd";
import { withRouter } from "react-router-dom";
import { fmtMoney } from "utils/format";

class Account extends Component {
  getMoney = () => {
    this.props.history.push("/account/money");
  };
  render() {
    const { financeInfo } = this.props;
    return (
      <div className="contain-wrapper">
        <Row gutter={16} className="contain">
          <Col span={7}>
            <div className="box">
              <div className="header"> 余额账户 </div>
              <div className="content1">
                <div className="operate1">
                  <div
                    className={
                      financeInfo.enterpriseAccountViewVo &&
                      financeInfo.enterpriseAccountViewVo
                        .accountVerifyStatus === 2
                        ? "num1"
                        : "num"
                    }
                  >
                    {financeInfo.enterpriseAccountViewVo &&
                      financeInfo.enterpriseAccountViewVo.balance &&
                      fmtMoney(financeInfo.enterpriseAccountViewVo.balance)}
                  </div>
                  {financeInfo.enterpriseAccountViewVo &&
                  financeInfo.enterpriseAccountViewVo.accountVerifyStatus ===
                    1 ? (
                    <Button
                      style={{
                        width: "70%",
                        color: "red",
                      }}
                    >
                      审核中
                    </Button>
                  ) : financeInfo.enterpriseAccountViewVo &&
                    financeInfo.enterpriseAccountViewVo.accountVerifyStatus ===
                      2 ? (
                    <div className="center">
                      <Button
                        style={{
                          width: "70%",
                        }}
                        onClick={this.getMoney}
                      >
                        提现
                      </Button>
                      <Button
                        style={{
                          marginTop: 0,
                          width: "70%",
                        }}
                        onClick={() =>
                          this.props.history.push("/account/transRecord")
                        }
                      >
                        查看交易记录
                      </Button>
                    </div>
                  ) : (
                    <div className="button">
                      <Button
                        style={{
                          width: "100%",
                          color: "red",
                        }}
                        onClick={() =>
                          this.props.history.push(
                            `/account/modifyInfo/${this.props.id}`
                          )
                        }
                      >
                        验证失败, 去修改信息
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
          <Col span={7}>
            <div className="box credit">
              <div className="header"> 授信账户 </div>
              <div className="content1">
                <div className="operate">
                  <div className="creditline">
                    <p className="num">
                      {financeInfo.enterpriseAccountViewVo &&
                      financeInfo.enterpriseAccountViewVo.totalCredit
                        ? fmtMoney(
                            financeInfo.enterpriseAccountViewVo.totalCredit
                          )
                        : 0}
                    </p>
                    <span> 授信额度(元) </span>
                  </div>
                  <div className="available">
                    <p className="num">
                      {financeInfo.enterpriseAccountViewVo &&
                      financeInfo.enterpriseAccountViewVo.totalAvailCredit
                        ? fmtMoney(
                            financeInfo.enterpriseAccountViewVo.totalAvailCredit
                          )
                        : 0}
                    </p>
                    <span> 可用额度(元) </span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col span={10}>
            <div className="box credit return">
              <div className="header"> 待还信息 </div>
              <div className="content1">
                <div className="operate">
                  <div className="creditline">
                    <p className="num">
                      {financeInfo.unsettledCount
                        ? financeInfo.unsettledCount
                        : 0}
                    </p>
                    <span> 待还融资单(笔) </span>
                  </div>
                  <div className="creditline">
                    <p className="num">
                      {financeInfo.unsettledAmount
                        ? fmtMoney(financeInfo.unsettledAmount)
                        : 0}
                    </p>
                    <span> 待还本金(元) </span>
                  </div>
                  <div className="available">
                    <p className="num">
                      {financeInfo.unsettledInterest
                        ? fmtMoney(financeInfo.unsettledInterest)
                        : 0}
                    </p>
                    <span> 待还利息(元) </span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(Account);
