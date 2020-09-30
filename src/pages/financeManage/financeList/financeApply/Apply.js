import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Input,
  Upload,
  Select,
  Icon,
  message,
} from "antd";
import { withRouter } from "react-router-dom";
import { service } from "utils/form";
import { beforeUploadPDFZIP } from "utils/format";

const FormItem = Form.Item;

class Apply extends Component {
  state = {
    // 订单合同
    orderContract: {},
    orderContractList: [],
    // 公司章程
    companyPolicy: {},
    companyPolicyList: [],
    // 财报
    financialReport: {},
    financialReportList: [],
  };
  handleChange = (listType, type, info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    this.setState({
      [listType]: fileList,
      [type]: info.file,
    });
  };
  back = () => {
    this.props.history.go(-1);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      orderContract,
      companyPolicy,
      financialReportList,
      financialReport,
    } = this.state;
    const { id } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let payLoad = {
        orderContract,
        dueDate: fieldsValue["dueDate"],
        kingmiId: id,
        amount: fieldsValue.amount,
        invoiceIds: fieldsValue.receipt,
        companyPolicy,
      };

      financialReportList.length > 0
        ? (payLoad["financialReport"] = financialReport)
        : delete payLoad["financialReport"];
      service("kingmi/financing/new", payLoad)
        .then((res) => {
          if (res.status === 200) {
            let { code, message: tip } = res.data;
            if (code === 0) {
              message.success(tip);
              this.props.form.resetFields();
              this.props.history.push("/financing/index");
            } else {
              message.error(tip);
            }
          }
        })
        .catch((err) => {
          if (err.response.status === 413) {
            message.error("上传文件体积太大,请重新选择上传文件");
          } else {
            message.error(err.message);
          }
        });
    });
  };
  checkAmount = (rule, value, callback) => {
    const { kingmiVoList } = this.props;
    if (value && value > kingmiVoList.financingLimit / 100) {
      callback("填写金额大于融资可用余额!");
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { kingmiVoList, billList, isGD, operateModel } = this.props;
    const {
      orderContractList,
      companyPolicyList,
      financialReportList,
    } = this.state;
    const uploadProps = {
      beforeUpload: beforeUploadPDFZIP,
      accept: ".zip,.pdf",
    };
    const formItemLayout = {
      labelCol: {
        xs: 24,
        sm: 6,
      },
      wrapperCol: {
        xs: 24,
        sm: 18,
      },
    };
    return (
      <div>
        <Row>
          <Col>
            <Card
              title="融资单信息"
              size="small"
              style={{
                marginTop: "20px",
              }}
            >
              <Form {...formItemLayout}>
                <FormItem label="粮票融资金额（元）">
                  {getFieldDecorator("amount", {
                    rules: [
                      {
                        required: true,
                        message: "融资金额不能为空",
                      },
                      {
                        pattern: /^([1-9]\d{0,11}(\.\d{1,2})?|0\.\d{1,2})$/,
                        message:
                          "纯数字、正数、小数点前最多12位、小数点后最多两位，金额大于0",
                      },
                      {
                        validator: this.checkAmount,
                      },
                    ],
                  })(
                    <Input
                      style={{
                        width: "100%",
                        fontSize: "12px",
                      }}
                      placeholder="请填写融资金额"
                    />
                  )}
                </FormItem>
                <FormItem label="粮票融资到期日">
                  {getFieldDecorator("dueDate", {
                    initialValue: kingmiVoList.duedate,
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="资料上传">
                  <span className="ant-form-text">
                    （文件大小为50M以内， 格式为pdf或zip）
                  </span>
                </FormItem>
                <FormItem label="订单合同">
                  {getFieldDecorator("orderContract", {
                    rules: [
                      {
                        required: orderContractList.length > 0 ? false : true,
                        message: "请上传订单合同",
                      },
                      {
                        validator: (rule, value, callback) => {
                          if (value) {
                            if (!value.fileList.length) {
                              callback("请上传订单合同");
                            }
                          }
                          callback();
                        },
                      },
                    ],
                  })(
                    <Upload
                      {...uploadProps}
                      fileList={
                        orderContractList.length > 0 ? orderContractList : false
                      }
                      onChange={this.handleChange.bind(
                        this,
                        "orderContractList",
                        "orderContract"
                      )}
                    >
                      <Button>
                        <Icon type="upload" /> 选择文件
                      </Button>
                    </Upload>
                  )}
                </FormItem>
                <FormItem label="发票">
                  {getFieldDecorator("receipt", {
                    rules: [
                      {
                        required: true,
                        message: "请上传发票",
                      },
                    ],
                  })(
                    <Select mode="multiple" placeholder="请选择发票">
                      {billList}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="公司章程">
                  {getFieldDecorator("companyPolicy", {
                    rules: [
                      {
                        required: companyPolicyList.length > 0 ? false : true,
                        message: "请上传公司章程",
                      },
                      {
                        validator: (rule, value, callback) => {
                          if (value) {
                            if (!value.fileList.length) {
                              callback("请上传公司章程");
                            }
                          }
                          callback();
                        },
                      },
                    ],
                  })(
                    <Upload
                      {...uploadProps}
                      fileList={
                        companyPolicyList.length > 0 ? companyPolicyList : false
                      }
                      onChange={this.handleChange.bind(
                        this,
                        "companyPolicyList",
                        "companyPolicy"
                      )}
                    >
                      <Button>
                        <Icon type="upload" /> 选择文件
                      </Button>
                    </Upload>
                  )}
                </FormItem>
                <FormItem label="财报">
                  {getFieldDecorator("financialReport")(
                    <Upload
                      {...uploadProps}
                      fileList={
                        financialReportList.length > 0
                          ? financialReportList
                          : false
                      }
                      onChange={this.handleChange.bind(
                        this,
                        "financialReportList",
                        "financialReport"
                      )}
                    >
                      <Button>
                        <Icon type="upload" /> 选择文件
                      </Button>
                    </Upload>
                  )}
                </FormItem>
                {isGD ? (
                  <p className="addInfo" onClick={operateModel}>
                    补充融资资料
                  </p>
                ) : null}
              </Form>
            </Card>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: "20px",
          }}
        >
          <Col>
            <Button
              onClick={this.handleSubmit}
              style={{
                marginRight: "50px",
                width: "150px",
              }}
            >
              提交
            </Button>
            <Button
              onClick={this.back}
              style={{
                width: "150px",
              }}
            >
              返回
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
export default withRouter(Form.create()(Apply));
