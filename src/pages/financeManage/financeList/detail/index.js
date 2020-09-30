import React, { Component } from "react";
import { Row, Col, Card, Form, Button, Icon } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import request from "utils/http";
import path from "config/pathConfig";

import {
  fmtMoney,
  showPic,
  formatObj,
  download,
  formatChinese,
  approveRecord,
  formItemLayout,
} from "utils/format";

const FormItem = Form.Item;

class Detail extends Component {
  state = {
    basicInfo: {},
    kingmiVo: {},
  };
  componentWillMount() {
    this.props.getInfo();
  }
  componentDidMount() {
    this.getBasicInfo();
  }
  downloadreceipt = () => {
    const { basicInfo } = this.state;
    const fields = basicInfo.receiptList.map((item) => item.fileId);
    if (fields.length > 1) {
      // 同时下载多个发票
      let multipeDownload = (fields, i) => {
        if (fields.length == i) {
          return false;
        } else {
          // window.location.href = `${path.BASE_URL}/file/download/${fields[i]}`;
          window.open(`${path.BASE_URL}/file/download/${fields[i]}`);
          i++;
          setTimeout(() => multipeDownload(fields, i), 500);
        }
      };
      multipeDownload(fields, 0);
    } else {
      // 1个
      download(fields[0]);
    }
  };
  getBasicInfo = async () => {
    const { id } = this.props.match.params;
    await request({
      url: "kingmi/financing/detail",
      method: "get",
      params: {
        financingId: id,
      },
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          basicInfo: res.data,
          kingmiVo: res.data.kingmiVo,
        });
      }
    });
  };
  formatRole = (num) => (num === 1 ? "供应商" : "核心企业");
  render() {
    let component = null;
    const { basicInfo, kingmiVo } = this.state;
    const applicationSpecFile = formatObj(basicInfo.applicationSpecFile);
    const bizProtocolFile = formatObj(basicInfo.bizProtocolFile);
    // 订单合同
    const orderContract = formatObj(basicInfo.orderContract);
    // 发票
    const receipt =
      basicInfo && basicInfo.receiptList && basicInfo.receiptList.length > 0
        ? basicInfo.receiptList.map((item) => {
            return (
              <li key={item.fileId} className="pic">
                <div className="icon">
                  <Icon type="picture" />
                </div>
                {item.fileName}
              </li>
            );
          })
        : [];
    // 公司章程
    const companyPolicy = formatObj(basicInfo && basicInfo.companyPolicy);
    // 财报
    const financialReport = formatObj(basicInfo && basicInfo.financialReport);

    // 粮票和付款承诺函取kingmiVo;
    const promiseToPay = formatObj(kingmiVo.promiseToPay);
    const kingmiCertificate = formatObj(kingmiVo.kingmiCertificate);

    component = (
      <Card title="粮票融资信息">
        <div className="wrapper">
          <Row gutter={16}>
            <Col span={8}>
              <Card title="粮票信息" size="small">
                <Form {...formItemLayout}>
                  <FormItem label="粮票单号">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.id}
                    </span>
                  </FormItem>
                  <FormItem label="粮票持有企业">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.holderEnterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="粮票开立企业">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.openEnterpriseName}
                    </span>
                  </FormItem>
                  <FormItem label="粮票金额（元）">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.amount && fmtMoney(kingmiVo.amount)}
                    </span>
                  </FormItem>
                  <FormItem label="开立日期">
                    <span className="ant-form-text">
                      {kingmiVo &&
                        kingmiVo.createdDate &&
                        kingmiVo.createdDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="到期日">
                    <span className="ant-form-text">
                      {kingmiVo &&
                        kingmiVo.dueDate &&
                        kingmiVo.dueDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="是否延期">
                    <span className="ant-form-text">
                      {formatChinese(kingmiVo && kingmiVo.ifDelay)}
                    </span>
                  </FormItem>
                  <FormItem label="是否担保">
                    <span className="ant-form-text">
                      {formatChinese(kingmiVo && kingmiVo.ifGuarantee)}
                    </span>
                  </FormItem>
                  <FormItem label="是否转让">
                    <span className="ant-form-text">
                      {formatChinese(kingmiVo && kingmiVo.ifTransfer)}
                    </span>
                  </FormItem>
                  <FormItem label="备注">
                    <span className="ant-form-text">
                      {kingmiVo && kingmiVo.note}
                    </span>
                  </FormItem>
                </Form>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="融资单信息" size="small">
                <Form {...formItemLayout}>
                  <FormItem label="粮票融资金额（元）">
                    <span className="ant-form-text">
                      {basicInfo.amount && fmtMoney(basicInfo.amount)}
                    </span>
                  </FormItem>
                  <FormItem label="粮票融资到期日">
                    <span className="ant-form-text">
                      {kingmiVo &&
                        kingmiVo.dueDate &&
                        kingmiVo.dueDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="粮票融资生效日">
                    <span className="ant-form-text">
                      {basicInfo.kingmiApprovedDate &&
                        basicInfo.kingmiApprovedDate.substring(0, 10)}
                    </span>
                  </FormItem>
                  <FormItem label="是否协议付息">
                    <span className="ant-form-text">
                      {formatChinese(basicInfo.ifProtocolInterest)}
                    </span>
                  </FormItem>
                  <FormItem label="协议付息比例（%）">
                    <span className="ant-form-text">
                      {basicInfo.protocolInterestProportion}
                    </span>
                  </FormItem>
                  <FormItem label="建议审批金额（元）">
                    <span className="ant-form-text">
                      {basicInfo.suggestedAmount &&
                        fmtMoney(basicInfo.suggestedAmount)}
                    </span>
                  </FormItem>
                  <FormItem label="审批金额（元）">
                    <span className="ant-form-text">
                      {basicInfo.approvedAmount &&
                        fmtMoney(basicInfo.approvedAmount)}
                    </span>
                  </FormItem>
                  <FormItem label="融资产品">
                    <span className="product">
                      {basicInfo.financialProductName}
                    </span>
                  </FormItem>
                </Form>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} className="middle">
            <Col span={8}>
              <div className="picture-container">
                <Card title="粮票凭证资料" size="small">
                  <div className="title">
                    <h3> 粮票 </h3>
                    {kingmiCertificate && kingmiCertificate.length > 0 ? (
                      <Button
                        onClick={() =>
                          download(kingmiVo.kingmiCertificateFileId)
                        }
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1">{showPic(kingmiCertificate)}</div>
                  <div className="title">
                    <h3> 付款承诺函 </h3>
                    {promiseToPay && promiseToPay.length > 0 ? (
                      <Button
                        onClick={() => download(kingmiVo.promiseToPayFileId)}
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1"> {showPic(promiseToPay)} </div>
                </Card>
              </div>
            </Col>
            <Col span={8}>
              <div className="picture-container">
                <Card title="证件资料" size="small">
                  <div className="title">
                    <h3> 订单合同 </h3>
                    <Button
                      onClick={() => download(basicInfo.orderContractFileId)}
                    >
                      下载证件
                    </Button>
                  </div>
                  <div className="list text1"> {showPic(orderContract)} </div>
                  <div className="title">
                    <h3> 发票 </h3>
                    {receipt && receipt.length > 0 ? (
                      <Button onClick={this.downloadreceipt}> 下载证件 </Button>
                    ) : null}
                  </div>
                  <div className="list text1"> {receipt} </div>
                  <div className="title">
                    <h3> 财报 </h3>
                    {financialReport && financialReport.length > 0 ? (
                      <Button
                        onClick={() =>
                          download(basicInfo.financialReportFileId)
                        }
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1"> {showPic(financialReport)} </div>
                  <div className="title">
                    <h3> 公司章程 </h3>
                    {companyPolicy && companyPolicy.length > 0 ? (
                      <Button
                        onClick={() => download(basicInfo.companyPolicyFileId)}
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1"> {showPic(companyPolicy)} </div>
                </Card>
              </div>
            </Col>
            <Col span={8}>
              <div className="picture-container">
                <Card title="融资资料" size="small">
                  <div className="title">
                    <h3> 单笔融资申请单 </h3>
                    {applicationSpecFile && applicationSpecFile.length > 0 ? (
                      <Button
                        onClick={() =>
                          download(basicInfo.applicationSpecFileId)
                        }
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1">
                    {showPic(applicationSpecFile)}
                  </div>
                  <div className="title">
                    <h3> 粮票保理协议 </h3>
                    {bizProtocolFile && bizProtocolFile.length > 0 ? (
                      <Button
                        onClick={() => download(basicInfo.bizProtocolFileId)}
                      >
                        下载证件
                      </Button>
                    ) : null}
                  </div>
                  <div className="list text1"> {showPic(bizProtocolFile)} </div>
                </Card>
              </div>
            </Col>
          </Row>
          <Row gutter={16} className="middle">
            <Col span={24}>
              <Card title="审批记录" size="small">
                <Row>
                  <Col span={24}>
                    <ul className="text">
                      {approveRecord(basicInfo.fsmHistoryVoList)}
                    </ul>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Button
            onClick={() => this.props.history.go(-1)}
            style={{
              width: "150px",
            }}
          >
            返回
          </Button>
        </div>
      </Card>
    );
    return <div> {component} </div>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};
export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Detail)
);
