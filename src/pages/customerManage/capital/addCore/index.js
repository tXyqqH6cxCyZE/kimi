//资金方入网
import React, { Component } from "react";
import {
  Card,
  Form,
  Button,
  Input,
  message,
  Row,
  Col,
  Select,
  DatePicker,
  Upload,
  Icon,
} from "antd";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import { INTEREST_METHOD, LENDING_ENTERPRISE_TYPE } from "store/actionTypes";
import {
  format,
  getSelectOption,
  beforeUpload,
  file_validator,
} from "utils/format";
import path from "config/pathConfig";
import { withRouter } from "react-router-dom";
import request from "utils/http";

const FormItem = Form.Item;
const relationType = 1;

class Info extends Component {
  state = {
    currentIndex: 0,
    fileList: [],
    province: [],
    city: [],
    bank: [],
    bankId: null,
    cityId: null,
    bankBranch: [],
    bankNo: null,
    enterpriseId: null,
  };
  componentWillMount() {
    this.props.getInfo(window.location.href);
  }
  componentDidMount() {
    this.getCoreName();
  }
  getCoreName = async () => {
    await request({ url: "address/provinces", params: "get" }).then((res) => {
      if (res.code === 0) {
        this.setState({
          province: res.data,
        });
      }
    });
    await request({ url: "bank/opening", params: "get" }).then((res) => {
      if (res.code === 0) {
        this.setState({
          bank: res.data,
        });
      }
    });
  };
  // 委托授权模板下载
  download = () => {
    window.open(path.BASE_URL + "file/attorney/template", "target");
  };
  // 开户银行变更
  onBankChange = (value) => {
    this.setState({
      bankId: value,
    });
  };
  // 城市变化
  onCityChange = function(type, value) {
    this.setState(
      {
        cityId: value,
      },
      async () => {
        this.props.form.setFieldsValue({ [type]: "请选择" });
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
  // 省份变化
  onProvinceChange = async function(type, value) {
    // this.props.form.setFieldsValue({ [type]: "请选择" });
    await request({ url: `address/cities/${value}`, method: "get" }).then(
      (res) => {
        if (res.code === 0) {
          this.setState({
            city: res.data,
          });
        }
      }
    );
  };
  // 开户支行切换
  onBranchChange = async (value) => {
    await request({ url: `bank/bankno/${value}`, method: "get" }).then(
      (res) => {
        if (res.code === 0) {
          this.setState({
            bankNo: res.data,
          });
        }
      }
    );
  };
  // 基本信息提交
  handleBasicSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      request({ url: "register/capital/basic", method: "post", params: values })
        .then((res) => {
          if (res.code === 0) {
            message.success(res.message);
            this.setState({
              enterpriseId: res.data,
            });
            this.next();
          } else {
            message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  //图片证件资料提交
  handlePictureSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        this.next();
      }
    });
  };
  //账户验证
  handleAccountSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let values = {
        ...fieldsValue,
      };
      values["bankAccountType"] = 2;
      values["enterpriseId"] = this.state.enterpriseId;

      request({ url: "register/account", method: "post", params: values })
        .then((res) => {
          let { code, message } = res;
          if (code === 0) {
            message.success("资料提交成功，正在审核中，请耐心等待");
            this.props.history.push("/customer/capital");
          } else {
            message.error(message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  // 上传数量限制
  handleChange = ({ file, fileList }) => {
    fileList.length >= 2 ? fileList.shift() : fileList;
  };
  // 页面切换
  next = () => {
    let currentIndex = this.state.currentIndex;
    this.setState({
      currentIndex: currentIndex + 1,
    });
  };
  prev = () => {
    let currentIndex = this.state.currentIndex;
    this.setState({
      currentIndex: currentIndex - 1,
    });
  };
  //支行模糊查询
  filterBranchOption = (inputValue, option) =>
    option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  render() {
    let component = null;
    const { getFieldDecorator } = this.props.form;
    const { interestList, lendingTypeList } = this.props;

    const {
      province,
      city,
      bank,
      bankBranch,
      bankNo,
      enterpriseId,
    } = this.state;
    // 省份
    const provinceList = getSelectOption(province);
    const cityList = getSelectOption(city);
    const bankList = getSelectOption(bank);
    // 开户支行
    const bankBranchList = getSelectOption(bankBranch);
    // 机构类型
    const lendingType = getSelectOption(lendingTypeList);
    // 计息方式
    let interest = getSelectOption(interestList);

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 6 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 6,
        offset: 10,
      },
    };
    const props = {
      listType: "picture",
      beforeUpload,
      accept: "image/*",
      action: path.BASE_URL + "file/upload",
    };

    if (this.state.currentIndex == 0) {
      component = (
        <Form {...formItemLayout} onSubmit={this.handleBasicSubmit}>
          <FormItem
            label="企业名称"
            extra="需与营业执照上的企业名称完全一致，开户后企业名称不可修改"
          >
            {getFieldDecorator("name", {
              rules: [
                { required: true, message: "请填写企业名称" },
                {
                  pattern: /^(?!(\d+)$)[\u4e00-\u9fffa-zA-Z\d\-_()（）]{1,64}$/,
                  message: "64字符以内，不能为纯数字",
                },
              ],
              initialValue: "",
            })(<Input placeholder="请填写公司名称" />)}
          </FormItem>
          <FormItem label="营业执照号">
            {getFieldDecorator("registerMark", {
              rules: [
                { required: true, message: "请填写营业执照号" },
                {
                  pattern: /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$/,
                  message: "15-18位字符（国税15，地税18）",
                },
              ],
              initialValue: "",
            })(<Input placeholder="请填写营业执照号" />)}
          </FormItem>

          <FormItem label="企业类型">
            {getFieldDecorator("enterpriseType", {
              rules: [{ required: true, message: "请选择公司类型" }],
            })(<Select placeholder="请选择">{lendingType}</Select>)}
          </FormItem>
          <FormItem label="法人姓名">
            {getFieldDecorator("legalPersonName", {
              rules: [
                { required: true, message: "请填写姓名" },
                { pattern: /^[\u4e00-\u9fff]{1,6}$/, message: "1-6汉字" },
              ],
              initialValue: "",
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem label="法人身份证号">
            {getFieldDecorator("legalPersonId", {
              rules: [
                { required: true, message: "请填写身份证号" },
                {
                  pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                  message: "限制15-18位数字（最后一位可为字母X）",
                },
              ],
              initialValue: "",
            })(<Input placeholder="请输入身份证号" />)}
          </FormItem>

          <FormItem label="操作员姓名">
            {getFieldDecorator("operatorName", {
              rules: [
                { required: true, message: "请填写姓名" },
                { pattern: /^[\u4e00-\u9fff]{1,6}$/, message: "1-6汉字" },
              ],
              initialValue: "",
            })(<Input placeholder="请填写负责人名称" />)}
          </FormItem>
          <FormItem label="操作员身份证号">
            {getFieldDecorator("operatorId", {
              rules: [
                { required: true, message: "请填写身份证号" },
                {
                  pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                  message: "限制15-18位数字（最后一位可为字母X）",
                },
              ],
              initialValue: "",
            })(<Input placeholder="请输入身份证号" />)}
          </FormItem>
          <FormItem label="操作员联系方式">
            {getFieldDecorator("operatorTel", {
              rules: [
                { required: true, message: "请填写联系方式" },
                { pattern: /^1[3-9]\d{9}$/, message: "11位数字" },
              ],
              initialValue: "",
            })(<Input placeholder="请输入联系方式" />)}
          </FormItem>
          <FormItem label="Email">
            {getFieldDecorator("email", {
              rules: [
                { required: true, message: "请填写邮箱" },
                {
                  pattern: /^[A-Za-z0-9._-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                  message: "请输入正确的邮箱",
                },
              ],
              initialValue: "",
            })(<Input placeholder="请输入邮箱" />)}
          </FormItem>
          <FormItem
            label="联系地址"
            extra="用于邮寄发票和UKey，请确保真实可用。"
          >
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator("postAddr1", {
                  rules: [{ required: true, message: "请填写联系地址" }],
                })(
                  <Select
                    placeholder="请选择"
                    onChange={this.onProvinceChange.bind(this, "postAddr2")}
                  >
                    {provinceList}
                  </Select>
                )}
              </Col>
              <Col span={12}>
                {getFieldDecorator("postAddr2", {
                  rules: [{ required: true, message: "请填写联系地址" }],
                })(<Select placeholder="请选择">{cityList}</Select>)}
              </Col>
            </Row>
            {getFieldDecorator("postAddr3", {
              rules: [{ required: true, message: "请填写详细地址" }],
              initialValue: "",
            })(<Input placeholder="详细地址" />)}
          </FormItem>
          <Form.Item {...tailFormItemLayout}>
            <Button htmlType="submit" style={{ width: "100%" }}>
              下一步
            </Button>
          </Form.Item>
        </Form>
      );
    } else if (this.state.currentIndex === 1) {
      component = (
        <Form {...formItemLayout} onSubmit={this.handlePictureSubmit}>
          <FormItem label="营业执照">
            <div>
              {getFieldDecorator("businessLicense", {
                rules: [
                  { required: true, message: "请上传营业执照" },
                  {
                    validator: file_validator("营业执照"),
                  },
                ],
              })(
                <Upload
                  {...props}
                  onChange={this.handleChange}
                  data={(file) => ({
                    file,
                    relationId: enterpriseId,
                    relationType,
                    fileType: 1,
                  })}
                >
                  <Button>
                    <Icon type="upload" /> 选择图片
                  </Button>
                </Upload>
              )}
            </div>
          </FormItem>
          <FormItem label="操作员身份证（国徽面）">
            {getFieldDecorator("operatorId1")(
              <Upload
                {...props}
                onChange={this.handleChange}
                data={(file) => ({
                  file,
                  relationId: enterpriseId,
                  relationType,
                  fileType: 25,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="操作员身份证（肖像面）">
            {getFieldDecorator("operatorId2")(
              <Upload
                {...props}
                onChange={this.handleChange}
                data={(file) => ({
                  file,
                  relationId: enterpriseId,
                  relationType,
                  fileType: 24,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="委托授权书">
            {getFieldDecorator("powerOfAttorney", {
              rules: [
                { required: true, message: "请上传委托授权书" },
                {
                  validator: file_validator("营业执照"),
                },
              ],
            })(
              <Upload
                {...props}
                onChange={this.handleChange}
                data={(file) => ({
                  file,
                  relationId: enterpriseId,
                  relationType,
                  fileType: 26,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
            <Button onClick={this.download}>
              <Icon type="download" />
              下载模板
            </Button>
          </FormItem>
          <p className="mly-tip">注：仅支持图片，文件大小上限20M</p>
          <Form.Item {...tailFormItemLayout}>
            <Row gutter={8}>
              <Col span={12}>
                <Button
                  size="large"
                  style={{ width: "100%" }}
                  onClick={this.prev}
                >
                  上一步
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  size="large"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  继续
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      );
    } else {
      component = (
        <Form {...formItemLayout} onSubmit={this.handleAccountSubmit}>
          <FormItem label="开户银行">
            {getFieldDecorator("openBank", {
              rules: [{ required: true, message: "请选择开户行" }],
            })(
              <Select placeholder="请选择" onChange={this.onBankChange}>
                {bankList}
              </Select>
            )}
          </FormItem>
          <FormItem label="开户地区">
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator("openPlaceAddr1", {
                  rules: [
                    { required: true, message: "请选择开户地区" },
                    {
                      validator(rule, value, callback) {
                        if (value === "请选择") {
                          callback("请选择开户地区");
                        }
                        callback();
                      },
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择省"
                    onChange={this.onProvinceChange.bind(
                      this,
                      "openPlaceAddr2"
                    )}
                  >
                    {provinceList}
                  </Select>
                )}
              </Col>
              <Col span={12}>
                {getFieldDecorator("openPlaceAddr2", {
                  rules: [
                    { required: true, message: "请选择开户地区" },
                    {
                      validator(rule, value, callback) {
                        console.log(value);
                        if (value === "请选择") {
                          callback("请选择开户地区");
                        }
                        callback();
                      },
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择市"
                    onChange={this.onCityChange.bind(this, "openSubBranch")}
                  >
                    {cityList}
                  </Select>
                )}
              </Col>
            </Row>
          </FormItem>
          <FormItem label="账户类型">
            {getFieldDecorator("bankAccountType", {
              rules: [{ required: true }],
              initialValue: "对公账户",
            })(<Input disabled={true} />)}
          </FormItem>
          <FormItem label="开户支行">
            {getFieldDecorator("openSubBranch", {
              rules: [
                { required: true, message: "请选择开户支行" },
                {
                  validator(rule, value, callback) {
                    if (value === "请选择") {
                      callback("请选择开户支行");
                    }
                    callback();
                  },
                },
              ],
            })(
              <Select
                showSearch
                placeholder="请选择"
                onChange={this.onBranchChange}
                filterOption={this.filterBranchOption}
              >
                {bankBranchList}
              </Select>
            )}
          </FormItem>
          <FormItem label="开户名称">
            {getFieldDecorator("openName", {
              rules: [
                { required: true, message: "请输入开户名称" },
                {
                  pattern: /^(?!(\d+)$)[\u4e00-\u9fffa-zA-Z\d\-_()（）]{1,64}$/,
                  message: "64字符以内 不能为纯数字",
                },
              ],
              initialValue: "",
            })(<Input placeholder="请输入开户名称" />)}
          </FormItem>
          <FormItem label="账户号码">
            {getFieldDecorator("accountNo", {
              rules: [
                { required: true, message: "请填写正确的账户号码" },
                { pattern: /^[0-9]{1,22}$/, message: "请填写正确的账户号码" },
              ],
              initialValue: "",
            })(<Input placeholder="请输入账户号码" />)}
          </FormItem>
          <Form.Item {...tailFormItemLayout}>
            <Row gutter={8}>
              <Col span={12}>
                <Button
                  size="large"
                  style={{ width: "100%" }}
                  onClick={this.prev}
                >
                  上一步
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  size="large"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  提交
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      );
    }
    return (
      <div>
        <Card title="新增资金方">{component}</Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    interestList: format(state.reducer.get("list").toJS(), INTEREST_METHOD),
    lendingTypeList: format(
      state.reducer.get("list").toJS(),
      LENDING_ENTERPRISE_TYPE
    ),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};
let CustomInfo = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(Info))
);

let AddCore = (props) => <CustomInfo id={props.match.params.id} />;
export default withRouter(AddCore);
