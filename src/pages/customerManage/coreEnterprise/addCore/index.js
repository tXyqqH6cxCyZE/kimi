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
  InputNumber,
  DatePicker,
  Upload,
  Icon,
} from "antd";
import { connect } from "react-redux";
import { getUserInfo } from "store/actionCreators";
import { ENTERPRISE_TYPE } from "store/actionTypes";
import {
  format,
  getSelectOption,
  beforeUpload,
  file_validator,
} from "utils/format";
import path from "config/pathConfig";
import moment from "moment";
import { withRouter } from "react-router-dom";
import request from "utils/http";

const FormItem = Form.Item;
const relationType = 1;

class Info extends Component {
  state = {
    currentIndex: 0, // 切换tab页
    province: [],
    city: [],
    bank: [],
    bankId: null,
    cityId: null,
    bankBranch: [],
    bankNo: null,
    enterpriseId: null,
    // 提交按钮状态
    disabled: true,
    // 基本信息
    basicInfo: {},
    // 资料证件
    fileInfo: [],
    disabledCore: false,
    disabledCore1: false,
    disabledCore2: false,
    disabledCore3: false,
  };
  componentWillMount() {
    this.props.getInfo(window.location.href);
  }
  componentDidMount() {
    this.getCoreName();
    this.handleSelectChange("no1", "core1", "disabledCore1");
    this.handleSelectChange("no2", "core2", "disabledCore2");
    this.handleSelectChange("no3", "core3", "disabledCore3");
    this.handleSelectChange("no", "core", "disabledCore");
  }
  componentWillUnmount() {
    localStorage.clear();
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
  // 只能选择当前时间之前
  disabledDate = (current) => current && current > moment().endOf("day");
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
  // 基本信息提交
  handleBasicSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        // established: moment(fieldsValue["established"]).format("YYYY-MM-DD"),
        registerType: 1,
      };
      if (this.state.enterpriseId) {
        values["id"] = this.state.enterpriseId;
      }
      // 发送请求
      request({ url: "register/basic", method: "post", params: values }).then(
        (res) => {
          let { code, data } = res;
          if (code === 0) {
            message.success(res.message);
            this.next();
            localStorage.setItem("basicCoreInfo", JSON.stringify(values));
            this.setState({
              enterpriseId: data,
            });
          } else {
            message.error(res.message);
          }
        }
      );
    });
  };
  prev = () => {
    let { currentIndex, enterpriseId } = this.state;
    this.setState(
      {
        currentIndex: currentIndex - 1,
      },
      async () => {
        if (this.state.currentIndex === 0 && enterpriseId) {
          let basicInfo = JSON.parse(localStorage.getItem("basicCoreInfo"));
          this.onProvinceChange("", basicInfo.bizAddr1);
          this.onProvinceChange("", basicInfo.postAddr1);
          this.setState({ basicInfo });
        }
        if (this.state.currentIndex === 1 && enterpriseId) {
          await request({
            url: "file/list",
            method: "get",
            params: { relationId: enterpriseId, relationType: 1 },
          }).then((res) => {
            if (res.code === 0) {
              this.setState({ fileInfo: res.data });
            }
          });
        }
      }
    );
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

      request({ url: "register/account", method: "post", params: values }).then(
        (res) => {
          let { code, message } = res;
          if (code === 0) {
            message.success("资料提交成功，正在审核中，请耐心等待");
            this.props.history.push("/customer/index");
          } else {
            message.error(message);
          }
        }
      );
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
  handleSelectChange = (value, enterprise, type) => {
    if (value == "no" || value == "no1" || value == "no2" || value == "no3") {
      this.setState({
        [type]: true,
      });
    } else {
      this.setState({
        [type]: false,
      });
    }
  };
  // 委托授权模板下载
  download = () => {
    window.open(path.BASE_URL + "file/attorney/template", "target");
  };
  //支行模糊查询
  filterBranchOption = (inputValue, option) =>
    option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  render() {
    let component = null;
    const { getFieldDecorator } = this.props.form;
    let { companyTypeList } = this.props;
    const {
      province,
      city,
      bank,
      bankBranch,
      bankNo,
      basicInfo,
      fileInfo,
      disabled,
      enterpriseId,
      disabledCore,
      disabledCore1,
      disabledCore2,
      disabledCore3,
    } = this.state;
    // 省份
    const provinceList = getSelectOption(province);
    const cityList = getSelectOption(city);
    const bankList = getSelectOption(bank);
    // 开户支行
    const bankBranchList = getSelectOption(bankBranch);
    const companyType = getSelectOption(companyTypeList);
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
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
                  message: "限制64字符以内，不能为纯数字",
                },
              ],
              initialValue: basicInfo ? basicInfo.name : null,
            })(<Input placeholder="请填写公司名称" />)}
          </FormItem>
          <FormItem label="公司税号">
            {getFieldDecorator("taxId", {
              rules: [
                { required: true, message: "请填写公司税号" },
                {
                  pattern: /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$/,
                  message: "15-18位字符",
                },
              ],
              initialValue: basicInfo ? basicInfo.taxId : null,
            })(<Input placeholder="请填写公司税号" />)}
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
              initialValue: basicInfo ? basicInfo.registerMark : null,
            })(<Input placeholder="请填写营业执照号" />)}
          </FormItem>
          <FormItem label="法人姓名">
            {getFieldDecorator("legalPersonName", {
              rules: [
                { required: true, message: "请填写姓名" },
                { pattern: /^[\u4e00-\u9fff]{1,6}$/, message: "1-6汉字" },
              ],
              initialValue: basicInfo ? basicInfo.legalPersonName : null,
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
              initialValue: basicInfo ? basicInfo.legalPersonId : null,
            })(<Input placeholder="请输入身份证号" />)}
          </FormItem>
          <FormItem label="操作员姓名">
            {getFieldDecorator("operatorName", {
              rules: [
                { required: true, message: "请填写姓名" },
                { pattern: /^[\u4e00-\u9fff]{1,6}$/, message: "1-6汉字" },
              ],
              initialValue: basicInfo ? basicInfo.financeMgr : null,
            })(<Input placeholder="请填写财务负责人名称" />)}
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
              initialValue: basicInfo ? basicInfo.legalPersonId : null,
            })(<Input placeholder="请输入身份证号" />)}
          </FormItem>
          <FormItem label="操作员联系方式">
            {getFieldDecorator("operatorTel", {
              rules: [
                { required: true, message: "请填写联系方式" },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: "手机号格式为：11位数字",
                },
              ],
              initialValue: basicInfo ? basicInfo.legalPersonTel : null,
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
                  initialValue: basicInfo ? basicInfo.postAddr1 : null,
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
                  initialValue: basicInfo ? basicInfo.postAddr2 : null,
                })(<Select placeholder="请选择">{cityList}</Select>)}
              </Col>
            </Row>
            {getFieldDecorator("postAddr3", {
              rules: [{ required: true, message: "请填写详细地址" }],
              initialValue: basicInfo ? basicInfo.postAddr3 : null,
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
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[0].fileName : null}
            </div>
          </FormItem>

          <FormItem label="开户许可证">
            {getFieldDecorator("openingPermit", {
              rules: [
                { required: true, message: "请上传开户许可证" },
                {
                  validator: file_validator("开户许可证"),
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
                  fileType: 2,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[2].fileName : null}
            </div>
          </FormItem>
          <FormItem label="法人代表身份证（国徽面）">
            {getFieldDecorator("legalController", {
              rules: [
                { required: true, message: "请上传法人代表身份证（国徽面）" },
                {
                  validator: file_validator("法人代表身份证（国徽面）"),
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
                  fileType: 8,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[0].fileName : null}
            </div>
          </FormItem>
          <FormItem label="法人代表身份证（肖像面）">
            {getFieldDecorator("legalControllerFace", {
              rules: [
                { required: true, message: "请上传法人代表身份证（肖像面）" },
                {
                  validator: file_validator("法人代表身份证（肖像面）"),
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
                  fileType: 7,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[5].fileName : null}
            </div>
          </FormItem>
          <FormItem label="操作员身份证（国徽面）">
            {getFieldDecorator("operatorController", {
              rules: [
                { required: true, message: "请上传操作员身份证（国徽面）" },
                {
                  validator: file_validator("操作员身份证（国徽面）"),
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
                  fileType: 25,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[0].fileName : null}
            </div>
          </FormItem>
          <FormItem label="操作员身份证（肖像面）">
            {getFieldDecorator("operatorControllerFace", {
              rules: [
                { required: true, message: "请上传操作员身份证（肖像面）" },
                {
                  validator: file_validator("操作员身份证（肖像面）"),
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
                  fileType: 24,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[5].fileName : null}
            </div>
          </FormItem>
          <FormItem label="委托授权书">
            {getFieldDecorator("powerOfAttorney", {
              rules: [
                { required: true, message: "请上传委托授权书" },
                {
                  validator: file_validator("委托授权书"),
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
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[2].fileName : null}
            </div>
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
                  rules: [{ required: true, message: "请选择省" }],
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
                  rules: [{ required: true, message: "请选择市" }],
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
            <span className="ant-form-text">对公账户</span>
          </FormItem>
          <FormItem label="开户支行">
            {getFieldDecorator("openSubBranch", {
              rules: [{ required: true, message: "请选择开户行" }],
            })(
              <Select
                placeholder="请选择"
                showSearch
                filterOption={this.filterBranchOption}
                onChange={this.onBranchChange}
              >
                {bankBranchList}
              </Select>
            )}
          </FormItem>
          <FormItem label="开户名称">
            {getFieldDecorator("openName", {
              rules: [
                { required: true, message: "请填写正确的开户名称" },
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
                { pattern: /^[0-9]{1,22}$/, message: "23位数字之内" },
              ],
              initialValue: "",
            })(<Input placeholder="请输入账户号码" />)}
          </FormItem>
          <FormItem label="授信额度(元)">
            {getFieldDecorator("credit", {
              rules: [
                { required: true, message: "请填写正确的授信额度" },
                {
                  pattern: /^\d{1,11}(\.\d{1,2})?$/,
                  message:
                    "纯数字、正数、小数点前最多11位、小数点后最多两位，填写金额大于0",
                },
              ],
              initialValue: "",
            })(<Input placeholder="请输入授信额度" />)}
          </FormItem>
          <FormItem label="配置融资分润">
            <Row gutter={12}>
              <Col span={8}>核心企业：</Col>
              <Col span={8}>
                <Select
                  style={{ width: 60 }}
                  defaultValue="no"
                  onChange={(value) =>
                    this.handleSelectChange(value, "core", "disabledCore")
                  }
                >
                  <Option value="yes">是</Option>
                  <Option value="no">否</Option>
                </Select>
              </Col>
              <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                <Input disabled={disabledCore} />
                <span style={{ marginLeft: "5px" }}>%</span>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>一级供应商：</Col>
              <Col span={8}>
                <Select
                  style={{ width: 60 }}
                  defaultValue="no1"
                  onChange={(value) =>
                    this.handleSelectChange(value, "core1", "disabledCore1")
                  }
                >
                  <Option value="yes1">是</Option>
                  <Option value="no1">否</Option>
                </Select>
              </Col>
              <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                <Input disabled={disabledCore1} />
                <span style={{ marginLeft: "5px" }}>%</span>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>二级供应商：</Col>
              <Col span={8}>
                <Select
                  style={{ width: 60 }}
                  defaultValue="no2"
                  onChange={(value) =>
                    this.handleSelectChange(value, "core2", "disabledCore2")
                  }
                >
                  <Option value="yes2">是</Option>
                  <Option value="no2">否</Option>
                </Select>
              </Col>
              <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                <Input disabled={disabledCore2} />
                <span style={{ marginLeft: "5px" }}>%</span>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>三级供应商：</Col>
              <Col span={8}>
                <Select
                  style={{ width: 60 }}
                  defaultValue="no3"
                  onChange={(value) =>
                    this.handleSelectChange(value, "core3", "disabledCore3")
                  }
                >
                  <Option value="yes3">是</Option>
                  <Option value="no3">否</Option>
                </Select>
              </Col>
              <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                <Input disabled={disabledCore3} />
                <span style={{ marginLeft: "5px" }}>%</span>
              </Col>
            </Row>
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
        <Card title="新增核心企业">{component}</Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    companyTypeList: format(state.reducer.get("list").toJS(), ENTERPRISE_TYPE),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getInfo(url) {
      dispatch(getUserInfo(url));
    },
  };
};

const CustomInfo = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(Info))
);

let AddCore = (props) => <CustomInfo id={props.match.params.id} />;
export default withRouter(AddCore);
