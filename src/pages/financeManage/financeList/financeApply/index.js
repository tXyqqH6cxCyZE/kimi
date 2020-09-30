import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Input,
  Icon,
  message,
  Select,
  Modal,
  DatePicker,
} from "antd";
import { withRouter } from "react-router-dom";
import path from "config/pathConfig";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import request from "utils/http";
import moment from "moment";
import { showPic, formatObj, download } from "utils/format";

import { getSelectOption } from "utils/format";
import ApplyForm from "./Apply";
// import MForm from "./components/MForm";
import OtherInfo from "./OtherInfo";

const FormItem = Form.Item;
const { Option } = Select;

class FinanceApply extends Component {
  state = {
    // 企业资料
    // enterpriseInfo: {},
    // 粮票凭证资料
    kingmiVoList: {},
    // 增加光大信息弹框
    modelVisible: true, //dev
    bank: [],
    bankBranch: [],
    province: [],
    city: [],
    bankId: null,
    cityId: null,
    // 默认不是光大
    isGD: 0,
    billList: [],
    gdInfo: {},
  };
  options = {
    form: {},
  };
  componentDidMount() {
    this.props.getInfo();
    this.getBasicInfo();
    this.getBillList();
  }
  componentWillUnmount() {
    this.setState = () => {};
  }
  getForm = (form) => {
    this.options.form = form;
  };
  getBasicInfo = async () => {
    const { id } = this.props.match.params;
    const res = await request({
      url: "kingmi/financing/toNew",
      method: "get",
      params: {
        kingmiId: id,
      },
    });
    if (res.code === 0) {
      this.setState({
        kingmiVoList: res.data,
        isGD: res.data.isGD,
      });
    } else {
      message.error(res.message);
    }
  };
  getBillList = async () => {
    const res = await request({
      url: "kingmi/financing/bills",
      method: "get",
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    });
    if (res.code === 0) {
      this.setState({
        billList: res.data.list,
      });
    } else {
      message.error(res.message);
    }
  };
  operateModel = (flag) => {
    // 获取光大实控人，受益人信息
    request({
      url: "kingmi/financing/suppleInfo",
      method: "get",
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          gdInfo: res.data,
        });
      } else {
        message.error(res.message);
      }
    });
    if (flag) {
      // 省份
      request({
        url: "address/provinces",
        method: "get",
      }).then((res) => {
        if (res.code === 0) {
          this.setState({
            province: res.data,
          });
        }
      });
      // 开户银行
      request({
        url: "bank/opening",
        method: "get",
      }).then((res) => {
        if (res.code === 0) {
          this.setState({
            bank: res.data,
          });
        }
      });
    }
    this.setState({
      modelVisible: flag,
    });
  };
  // 银行变化
  onBankChange = (value) => {
    this.setState(
      {
        bankId: value,
      },
      () => {
        this.props.form.resetFields([
          "bankProvinceId",
          "bankCityId",
          "branchBankId",
        ]);
      }
    );
  };
  // 省份变化
  onProvinceChange = async (value) => {
    this.props.form.resetFields(["bankCityId"]);
    await request({
      url: `address/cities/${value}`,
      method: "get",
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          city: res.data,
        });
      }
    });
  };
  // 城市变化
  onCityChange = (value) => {
    this.setState(
      {
        cityId: value,
      },
      async () => {
        this.props.form.resetFields(["branchBankId"]);
        let { bankId, cityId } = this.state;

        if (bankId && cityId) {
          await request({
            url: `bank/branches/${bankId}/${cityId}`,
            method: "get",
          }).then((res) => {
            if (res.code === 0) {
              this.setState({
                bankBranch: res.data,
              });
            }
          });
        }
      }
    );
  };
  download = (id) => {
    window.open(path.BASE_URL + "file/download/" + id, "target");
  };
  showPic = (obj) => {
    if (!obj) {
      return;
    }
    return obj && obj.length > 0
      ? obj.map((item) => (
          <li key={item} className="pic">
            <div className="icon">
              <Icon type="picture" />
            </div>
            {item}
          </li>
        ))
      : obj;
  };

  composeMoment = (originProps) => {
    const momentProps = {};
    for (const prop in originProps) {
      momentProps[prop] = moment(originProps[prop]).format("YYYY-MM-DD");
    }
    return momentProps;
  };
  // 提交光大信息
  submitGdInfo = (e) => {
    e.preventDefault();
    console.log(this.options.form);
    this.options.form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
    });

    // const { gdInfo } = this.state;
    // this.props.form.validateFields((err, fieldsValue) => {
    //   if (err) {
    //     return;
    //   }
    //   const { id } = this.props.match.params;
    //   const {
    //     legalPersonIdExpiryDate,
    //     operatorIdExpiryDate,
    //     controllerIdExpiryDate,
    //     beneficiaryIdExpiryDate,
    //   } = fieldsValue;

    //   let values = {
    //     ...fieldsValue,
    //     financingInfoId: id,
    //     ...this.composeMoment({
    //       legalPersonIdExpiryDate,
    //       operatorIdExpiryDate,
    //       controllerIdExpiryDate,
    //       beneficiaryIdExpiryDate,
    //     }),
    //   };
    //   values["controllerFlag"] = gdInfo.controllerFlag;
    //   values["beneficiaryFlag"] = gdInfo.beneficiaryFlag;
    //   values["operatorName"] = gdInfo.operatorName;
    //   values["operatorId"] = gdInfo.operatorId;
    //   values["legalPersonId"] = gdInfo.legalPersonId;
    //   values["legalPersonName"] = gdInfo.legalPersonName;

    //   request({
    //     url: "kingmi/financing/suppleInfo",
    //     method: "post",
    //     data: values,
    //   }).then((res) => {
    //     if (res.code === 0) {
    //       message.success(res.message);
    //       this.setState({
    //         modelVisible: false,
    //       });
    //     } else {
    //       message.error(res.message);
    //     }
    //   });
    // });
  };

  //支行模糊查询
  filterBranchOption = (inputValue, option) =>
    option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      modelVisible,
      bank,
      province,
      city,
      bankBranch,
      kingmiVoList,
      isGD,
      billList,
      gdInfo,
    } = this.state;
    const { id } = this.props.match.params;
    // 开户银行
    const bankList = getSelectOption(bank);
    // 开户支行
    const bankBranchList = getSelectOption(bankBranch);
    // 省
    const provinceList = getSelectOption(province);
    // 市
    const cityList = getSelectOption(city);

    const kingmiCertificate = formatObj(
      kingmiVoList && kingmiVoList.kingmiCertificate
    );
    const promiseToPay = formatObj(kingmiVoList && kingmiVoList.promiseToPay);
    const controllerNameList =
      gdInfo.controllerList &&
      gdInfo.controllerList.map((item, index) => (
        <Option key={index} value={item}>
          {item}
        </Option>
      ));
    const newBillList = billList.map((item) => (
      <Option key={item.id} value={item.id}>
        {item.businessType}, {item.code} - {item.number}, {item.amount}
      </Option>
    ));
    const gdformItemLayout = {
      labelCol: {
        xs: 24,
        sm: 10,
      },
      wrapperCol: {
        xs: 24,
        sm: 14,
      },
    };
    return (
      <div>
        <Card title="粮票融资信息">
          <div className="wrapper">
            <Row>
              <Col span={10}>
                <div className="picture-container">
                  <Card title="粮票凭证资料" size="small">
                    <div className="title">
                      <h3> 粮票 </h3>
                      {kingmiCertificate && kingmiCertificate.length > 0 ? (
                        <Button
                          onClick={() =>
                            download(kingmiVoList.kingmiCertificateFileId)
                          }
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1">
                      {showPic(kingmiCertificate)}
                    </div>
                    <div className="title">
                      <h3> 付款承诺函 </h3>
                      {promiseToPay && promiseToPay.length > 0 ? (
                        <Button
                          onClick={() =>
                            download(kingmiVoList.promiseToPayFileId)
                          }
                        >
                          下载证件
                        </Button>
                      ) : null}
                    </div>
                    <div className="list text1"> {showPic(promiseToPay)} </div>
                  </Card>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <ApplyForm
                  kingmiVoList={kingmiVoList}
                  billList={newBillList}
                  isGD={isGD}
                  id={id}
                  operateModel={() => this.operateModel(true)}
                />
              </Col>
            </Row>
            <Modal
              title={
                <p>
                  填写其他资料
                  <span
                    style={{
                      color: "#aaa",
                      fontSize: "13px",
                      marginLeft: "50px",
                    }}
                  >
                    补充资料用于银行融资申请，请确保填写的信息真实，有效且完整
                  </span>
                </p>
              }
              maskClosable={false}
              visible={modelVisible}
              width={1200}
              destroyOnClose
              centered
              onOk={this.submitGdInfo}
              onCancel={() => this.operateModel(false)}
            >
              <OtherInfo getForm={this.getForm} />
              {/* <Form {...gdformItemLayout}>
                <Row gutter={16}>
                  <Col span={8}>
                    <FormItem label="法定代表人名称">
                      <span className="ant-form-text">
                        {gdInfo.legalPersonName}
                      </span>
                    </FormItem>
                    <FormItem label="法定代表人电话">
                      {getFieldDecorator("legalPersonPhone", {
                        rules: [
                          {
                            required: true,
                            message: "请输入法定代表人电话",
                          },
                        ],
                      })(<Input placeholder="请输入电话" />)}
                    </FormItem>
                    <FormItem label="操作员名称">
                      <span className="ant-form-text">
                        {gdInfo.operatorName}
                      </span>
                    </FormItem>
                    {gdInfo.controllerFlag == 3 ? (
                      <FormItem label="实控人姓名">
                        {getFieldDecorator("controllerName", {
                          rules: [
                            {
                              required: true,
                              message: "请选择实控人姓名",
                            },
                          ],
                        })(
                          <Select placeholder="请选择实控人姓名">
                            {controllerNameList}
                          </Select>
                        )}
                      </FormItem>
                    ) : null}
                    {gdInfo.beneficiaryFlag == 2 ? (
                      <div>
                        <FormItem label="受益人姓名">
                          {getFieldDecorator("beneficiaryName", {
                            rules: [
                              {
                                required: true,
                                message: "请输入受益人姓名",
                              },
                            ],
                          })(<Input placeholder="请输入受益人姓名" />)}
                        </FormItem>
                        <FormItem label="受益人地址">
                          {getFieldDecorator("beneficiaryAddress", {
                            rules: [
                              {
                                required: true,
                                message: "请输入受益人地址",
                              },
                            ],
                          })(<Input placeholder="请输入受益人地址" />)}
                        </FormItem>
                      </div>
                    ) : null}
                  </Col>
                  <Col span={8}>
                    <FormItem label="法定代表人证件号码">
                      <span className="ant-form-text">
                        {gdInfo.legalPersonId}
                      </span>
                    </FormItem>
                    <FormItem label="法定代表人邮编">
                      {getFieldDecorator("legalPersonPostalCode", {
                        rules: [
                          {
                            required: true,
                            message: "请输入法定代表人邮编",
                          },
                        ],
                      })(<Input placeholder="请输入邮编" />)}
                    </FormItem>
                    <FormItem label="操作员证件号码">
                      <span className="ant-form-text">{gdInfo.operatorId}</span>
                    </FormItem>
                    {gdInfo.controllerFlag == 3 ? (
                      <FormItem label="实控人证件号码">
                        {getFieldDecorator("controllerId", {
                          rules: [
                            {
                              required: true,
                              message: "请输入实控人证件号码",
                            },
                          ],
                        })(<Input placeholder="请输入实控人证件号码" />)}
                      </FormItem>
                    ) : null}
                    {gdInfo.beneficiaryFlag == 2 ? (
                      <FormItem label="受益人证件号码">
                        {getFieldDecorator("beneficiaryId", {
                          rules: [
                            {
                              required: true,
                              message: "请输入受益人证件号码",
                            },
                          ],
                        })(<Input placeholder="请输入受益人证件号码" />)}
                      </FormItem>
                    ) : null}
                  </Col>
                  <Col span={8}>
                    <FormItem label="法定代表人证件有效日期">
                      {getFieldDecorator("legalPersonIdExpiryDate", {
                        rules: [
                          {
                            type: "object",
                            required: true,
                            message: "请选择有效日期",
                          },
                        ],
                      })(<DatePicker />)}
                    </FormItem>
                    <FormItem
                      label="法定代表人地址"
                      style={{
                        marginTop: "36px",
                      }}
                    >
                      {getFieldDecorator("legalPersonAddress", {
                        rules: [
                          {
                            required: true,
                            message: "请输入法定代表人地址",
                          },
                        ],
                      })(<Input placeholder="请输入地址" />)}
                    </FormItem>
                    <FormItem label="操作员证件有效期">
                      {getFieldDecorator("operatorIdExpiryDate", {
                        rules: [
                          {
                            type: "object",
                            required: true,
                            message: "请选择有效日期",
                          },
                        ],
                      })(<DatePicker />)}
                    </FormItem>
                    {gdInfo.controllerFlag == 3 ? (
                      <FormItem label="实控人证件有效期">
                        {getFieldDecorator("controllerIdExpiryDate", {
                          rules: [
                            {
                              type: "object",
                              required: true,
                              message: "请选择有效日期",
                            },
                          ],
                        })(<DatePicker />)}
                      </FormItem>
                    ) : null}
                    {gdInfo.beneficiaryFlag == 2 ? (
                      <FormItem label="受益人证件有效期">
                        {getFieldDecorator("beneficiaryIdExpiryDate", {
                          rules: [
                            {
                              type: "object",
                              required: true,
                              message: "请选择有效日期",
                            },
                          ],
                        })(<DatePicker />)}
                      </FormItem>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="开户银行">
                      {getFieldDecorator("bankId", {
                        rules: [
                          {
                            required: true,
                            message: "请选择开户银行",
                          },
                        ],
                      })(
                        <Select
                          placeholder="请选择"
                          onChange={this.onBankChange}
                        >
                          {bankList}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="开户地区">
                      <Row>
                        <Col span={12}>
                          {getFieldDecorator("bankProvinceId", {
                            rules: [
                              {
                                required: true,
                                message: "请选择",
                              },
                            ],
                          })(
                            <Select
                              placeholder="请选择"
                              onChange={this.onProvinceChange}
                            >
                              {provinceList}
                            </Select>
                          )}
                        </Col>
                        <Col span={12}>
                          {getFieldDecorator("bankCityId", {
                            rules: [
                              {
                                required: true,
                                message: "请选择",
                              },
                            ],
                          })(
                            <Select
                              placeholder="请选择市"
                              onChange={this.onCityChange}
                            >
                              {cityList}
                            </Select>
                          )}
                        </Col>
                      </Row>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="支行名称">
                      {getFieldDecorator("branchBankId", {
                        rules: [
                          {
                            required: true,
                            message: "请选择开户行",
                          },
                        ],
                      })(
                        <Select
                          placeholder="请选择"
                          showSearch
                          filterOption={this.filterBranchOption}
                        >
                          {bankBranchList}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem label="基本存款账号">
                      {getFieldDecorator("bankAccountNo", {
                        rules: [
                          {
                            required: true,
                            message: "请输入基本存款账号",
                          },
                        ],
                      })(<Input placeholder="请输入基本存款账号" />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="中征码">
                      {getFieldDecorator("loanCardNo", {
                        rules: [
                          {
                            required: true,
                            message: "请输入中征码",
                          },
                        ],
                      })(<Input placeholder="请输入中征码" />)}
                    </FormItem>
                  </Col>
                  <Col span={8}> </Col>
                </Row>
              </Form> */}
            </Modal>
          </div>
        </Card>
      </div>
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
export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Form.create()(FinanceApply))
);
