//供应商入网页面
import React, { Component } from "react";
import {
  Card,
  Form,
  Button,
  Input,
  message,
  Row,
  InputNumber,
  Col,
  Select,
  DatePicker,
  Upload,
  Table,
  Icon,
  Checkbox,
} from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ENTERPRISE_TYPE, BANK_ACCOUNT_STATUS } from "store/actionTypes";
import { changeNavStatus, getListData } from "store/actionCreators";
import {
  format,
  getSelectOption,
  beforeUpload,
  file_validator,
} from "utils/format";
import moment from "moment";
import request from "utils/http";
import path from "config/pathConfig";
import UserStateMent from "../agreement/userStateMent";
import UserServiceProtocol from "../agreement/userServiceProtocol";
import YiLi from "../agreement/yilianAgreement";

const FormItem = Form.Item;
const relationType = 1;

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      name: "",
      id: null,
      province: [],
      city: [],
      bank: [],
      bankBranch: [],
      bankId: null,
      cityId: null,
      bankNo: null,
      // 企业id
      enterpriseId: null,
      // 提交按钮状态
      disabled: true,
      // 账户信息
      accountInfo: {},
      // 用户协议
      userStateVisible: false,
      userServiceProtocol: false,
      yiliVisible: false,
      // 基本信息
      basicInfo: {},
      // 供应商法人&担保人信息
      legalInfo: {},
      // 资料证件
      fileInfo: [],
      // 邀请码
      invitatCode: null,
      isRepated: false,
    };
  }
  componentDidMount() {
    this.getCoreName();
    //有id的时候，表示是编辑功能，需要表单回填
    if (this.props.id && /^\d+$/g.test(this.props.id)) {
      //this.props.changeStatus(true)
      if (this.props.userInfo.id) {
        this.setState(
          {
            currentIndex: 2,
          },
          () => {
            this.getAccountInfo();
          }
        );
      } else {
        this.props.history.push("/account/index");
      }
    } else {
      this.props.changeStatus(false);
    }
    this.props.getAsyncData();
  }
  componentWillUnmount() {
    this.props.changeStatus(true);
    localStorage.clear();
  }
  // 只能选择当前时间之前
  disabledDate = (current) => current && current > moment().endOf("day");
  // 账户信息回填
  getAccountInfo = async () => {
    await request({
      url: "register/account",
      method: "get",
      params: { enterpriseId: this.props.id },
    }).then((res) => {
      if (res.code === 0) {
        this.setState(
          {
            accountInfo: res.data,
            bankId: res.data.openBank,
            bankNo: res.data.bankNo,
            enterpriseId: this.props.id,
          },
          () => {
            this.onProvinceChange("", res.data.openPlaceAddr1);
            this.onCityChange("", res.data.openPlaceAddr2);
          }
        );
      }
    });
  };
  // 阅读协议
  readAgreement = (type) => {
    this.setState({
      [type]: true,
    });
  };
  closeAgreement = (type) => {
    this.setState({
      [type]: false,
    });
  };
  // 委托授权模板下载
  download = () => {
    window.open(path.BASE_URL + "file/attorney/template", "target");
  };
  getCoreName = async () => {
    let arr = window.location.href.split("#")[1].split("/");
    let invitatCode = arr[arr.length - 1];
    this.setState({ invitatCode });
    await request({ url: "address/provinces", method: "get" }).then((res) => {
      if (res.code === 0) {
        this.setState({
          province: res.data,
        });
      }
    });
    await request({ url: "bank/opening", method: "get" }).then((res) => {
      if (res.code === 0) {
        this.setState({
          bank: res.data,
        });
      }
    });
    await request({
      url: `invitation/superior/${invitatCode}`,
      method: "get",
    }).then((res) => {
      if (res.code === 0) {
        let { id, name } = res.data;
        this.setState({
          name,
          id,
        });
      }
    });
  };
  isCheck = (e) => {
    let checked = e.target.checked;
    this.setState({
      disabled: !checked,
    });
  };
  // 基本信息提交
  handleBasicSubmit = (e) => {
    e.preventDefault();
    const { invitatCode } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let values = {
        ...fieldsValue,
        coreEnterpriseId: this.state.id,
        registerType: 2,
        invitationCode: invitatCode,
      };
      if (this.state.enterpriseId) {
        values["id"] = this.state.enterpriseId;
      }
      request({
        url: "register/supply/basic",
        method: "post",
        params: values,
      }).then((res) => {
        let { code, message, data } = res;
        if (code === 0) {
          message.success(message);
          this.next();
          localStorage.setItem("basicInfo", JSON.stringify(values));
          this.setState({
            enterpriseId: data,
          });
        } else {
          message.error(message);
        }
      });
    });
  };
  // 页面切换
  next = () => {
    let { currentIndex } = this.state;
    this.setState({
      currentIndex: currentIndex + 1,
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
          let basicInfo = JSON.parse(localStorage.getItem("basicInfo"));
          this.onProvinceChange("", basicInfo.bizAddr1);
          this.onProvinceChange("", basicInfo.postAddr1);
          this.setState({ basicInfo });
        }
        if (this.state.currentIndex === 1 && enterpriseId) {
          let legalInfo = JSON.parse(localStorage.getItem("legalInfo"));
          this.onProvinceChange("", legalInfo.legalPersonAddr1);
          this.setState({ legalInfo });
        }
        if (this.state.currentIndex === 2 && enterpriseId) {
          await request({
            url: "file/list",
            method: "get",
            params: { relationId: enterpriseId, relationType: 1 },
          }).then((res) => {
            if (res.code === 0) {
              this.setState({ fileInfo: res.data });
              this.backfill(res.data);
            }
          });
        }
      }
    );
  };

  backfill = (fileInfo) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      commercialInstruments: fileInfo[6].fileName,
      acctOpeningPermit: fileInfo[5].fileName,
      corporationIdEmblem: fileInfo[4].fileName,
      corporationIdPortrait: fileInfo[3].fileName,
      controllerIdEmblem: fileInfo[2].fileName,
      controllerIdPortrait: fileInfo[1].fileName,
      attorneyLetter: fileInfo[0].fileName,
    });
  };
  //   handleCorporateSubmit = (e) => {
  //     e.preventDefault();
  //     this.props.form.validateFields((err, fieldsValue) => {
  //       if (err) {
  //         return;
  //       }
  //       let values = {
  //         ...fieldsValue,
  //       };
  //       values["enterpriseId"] = this.state.enterpriseId;
  //       values["invitationCode"] = this.state.invitatCode;
  //       request({
  //         url: "register/supply/legal",
  //         method: "post",
  //         params: values,
  //       }).then((res) => {
  //         if (res.code === 0) {
  //           message.success(res.message);
  //           localStorage.setItem("legalInfo", JSON.stringify(values));
  //           this.next();
  //         } else {
  //           message.error(res.message);
  //         }
  //       });
  //     });
  //   };

  //图片提交
  handlePictureSubmit = (e) => {
    e.preventDefault();
    let arr = [];
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // for (const i in fieldsValue) {
      //   let num = fieldsValue[i] && fieldsValue[i].lastIndexOf(".");
      //   if (num) {
      //     let end = fieldsValue[i].substring(num + 1, fieldsValue[i].length);
      //     arr.push(end);
      //   }
      // }
      // let isAllPic = arr.every(
      //   (item) =>
      //     item.toLowerCase() === "jpg" ||
      //     item.toLowerCase() === "png" ||
      //     item.toLowerCase() === "gif"
      // );
      // if (isAllPic) {
      this.next();
      // }
    });
  };
  //账户验证
  handleAccountSubmit = (e) => {
    e.preventDefault();
    const { invitatCode, enterpriseId } = this.state;
    const { companyInfo } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      let flag = this.props.id && /^\d+$/g.test(this.props.id);
      if (err) {
        return;
      }
      let values = {
        ...fieldsValue,
      };
      values["bankAccountType"] = 2;
      values["enterpriseId"] = flag ? companyInfo.enterpriseId : enterpriseId;
      values["invitationCode"] = invitatCode;
      request({
        url: flag ? "register/account" : "register/supply/account",
        method: flag ? "put" : "post",
        params: values,
      }).then((res) => {
        let { code, message } = res;
        if (code === 0) {
          message.success("资料提交成功，正在审核中，请耐心等待");
          this.setState({ disabled: true, isRepated: true });
        } else {
          message.error(message);
        }
      });
    });
  };
  // 上传数量限制
  handleChange = ({ file, fileList }) => {
    file && fileList.length >= 2 ? fileList.shift() : fileList;
  };

  // 省份变化
  onProvinceChange = async function(type, value) {
    this.props.form.setFieldsValue({ [type]: "请选择" });
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
  onBankChange = (value) => {
    this.setState(
      {
        bankId: value,
      },
      () => {
        this.props.form.setFieldsValue({ openPlaceAddr1: "请选择" });
        this.props.form.setFieldsValue({ openPlaceAddr2: "请选择" });
        this.props.form.setFieldsValue({ openSubBranch: "请选择" });
      }
    );
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

  //支行模糊查询
  filterBranchOption = (inputValue, option) =>
    option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  handleRemove = (name) => {
    this.props.form.setFieldsValue({
      [name]: undefined,
    });
  };
  render() {
    let component = null;
    // 公司类型
    const { companyTypeList } = this.props;
    const companyType = getSelectOption(companyTypeList);
    const {
      province,
      enterpriseId,
      invitatCode,
      city,
      bank,
      basicInfo,
      legalInfo,
      fileInfo,
      yiliVisible,
      userServiceProtocol,
      userStateVisible,
      bankBranch,
      bankNo,
      accountInfo,
      disabled,
      isRepated,
      currentIndex,
    } = this.state;
    // 省份
    const provinceList = getSelectOption(province);
    // 城市
    const cityList = getSelectOption(city);
    // 开户银行
    const bankList = getSelectOption(bank);
    // 开户支行
    const bankBranchList = getSelectOption(bankBranch);

    const { getFieldDecorator } = this.props.form;
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
      accept: "image/*",
      beforeUpload,
      action: path.BASE_URL + "file/supply/upload",
    };
    if (currentIndex === 0) {
      component = (
        <Form {...formItemLayout} onSubmit={this.handleBasicSubmit}>
          <FormItem label="邀请企业名称">
            {getFieldDecorator("coreEnterpriseId", {
              rules: [{ required: true }],
              initialValue: this.state.name || "阿斯弗",
            })(<Input disabled={true} />)}
          </FormItem>
          <FormItem
            label="企业名称"
            extra="需与营业执照上的企业名称完全一致，开户后企业名称不可修改"
          >
            {getFieldDecorator("name", {
              rules: [
                { required: true, message: "请输入正确的企业名称" },
                {
                  pattern: /^(?!(\d+)$)[\u4e00-\u9fffa-zA-Z\d\-_()（）]{1,64}$/,
                  message: "限制64字符以内，不能为纯数字",
                },
              ],
              initialValue: basicInfo ? basicInfo.name : null,
            })(<Input placeholder="请填写企业名称" />)}
          </FormItem>
          <FormItem label="公司税号">
            {getFieldDecorator("taxId", {
              rules: [
                { required: true, message: "请输入正确的公司税号" },
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
                { required: true, message: "请输入正确的营业执照号" },
                {
                  pattern: /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$/,
                  message: "15-18位字符（国税15，地税18）",
                },
              ],
              initialValue: basicInfo ? basicInfo.registerMark : null,
            })(<Input placeholder="请填写营业营业执照号" />)}
          </FormItem>
          <FormItem label="法人姓名">
            {getFieldDecorator("legalPersonName", {
              rules: [
                { required: true, message: "请输入正确的姓名" },
                { pattern: /^[\u4e00-\u9fff]{1,6}$/, message: "1-6汉字" },
              ],
              initialValue: legalInfo ? legalInfo.legalPersonName : null,
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem label="法人身份证号">
            {getFieldDecorator("legalPersonId", {
              rules: [
                { required: true, message: "请输入正确的身份证号" },
                {
                  pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                  message: "限制15-18位数字（最后一位可为字母X）",
                },
              ],
              initialValue: legalInfo ? legalInfo.legalPersonId : null,
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
    } else if (currentIndex === 1) {
      component = (
        <Form {...formItemLayout} onSubmit={this.handlePictureSubmit}>
          <FormItem label="营业执照">
            {getFieldDecorator("commercialInstruments", {
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
                  invitationCode: invitatCode,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[6].fileName : null}
            </div>
          </FormItem>
          <FormItem label="开户许可证">
            {getFieldDecorator("acctOpeningPermit", {
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
                  invitationCode: invitatCode,
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
          <FormItem label="法人代表身份证（国徽面）">
            {getFieldDecorator("corporationIdEmblem", {
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
                  invitationCode: invitatCode,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[4].fileName : null}
            </div>
          </FormItem>
          <FormItem label="法人代表身份证（肖像面）">
            {getFieldDecorator("corporationIdPortrait", {
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
                  invitationCode: invitatCode,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[3].fileName : null}
            </div>
          </FormItem>
          <FormItem label="操作员身份证（国徽面）">
            {getFieldDecorator("controllerIdEmblem", {
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
                  invitationCode: invitatCode,
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
          <FormItem label="操作员身份证（肖像面）">
            {getFieldDecorator("controllerIdPortrait", {
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
                  invitationCode: invitatCode,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
              </Upload>
            )}
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[1].fileName : null}
            </div>
          </FormItem>
          <FormItem label="授权委托书">
            {getFieldDecorator("attorneyLetter", {
              rules: [
                { required: true, message: "请上传授权委托书" },
                {
                  validator: file_validator("授权委托书"),
                },
              ],
            })(
              <Upload
                {...props}
                onChange={this.handleChange}
                data={(file) => ({
                  file,
                  relationId: enterpriseId || 17,
                  relationType,
                  fileType: 26,
                  invitationCode: invitatCode,
                })}
              >
                <Button>
                  <Icon type="upload" /> 选择图片
                </Button>
                <Button onClick={this.download}>
                  <Icon type="download" />
                  下载模板
                </Button>
              </Upload>
            )}
            <div className="list text1">
              {fileInfo.length > 0 ? fileInfo[0].fileName : null}
            </div>
          </FormItem>
          <p className="mly-tip">注：仅支持图片，文件大小上限20M</p>
          <Form.Item {...tailFormItemLayout}>
            <Row gutter={8}>
              <Col span={8}>
                <Button
                  size="large"
                  style={{ width: "100%" }}
                  onClick={this.prev}
                >
                  上一步
                </Button>
              </Col>
              <Col span={8}>
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
        <div>
          <Form {...formItemLayout} onSubmit={this.handleAccountSubmit}>
            <FormItem label="开户银行">
              {getFieldDecorator("openBank", {
                rules: [{ required: true, message: "请选择开户行" }],
                initialValue: accountInfo ? accountInfo.openBank : "",
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
                    rules: [{ required: true, message: "请填写发票邮件地址" }],
                    initialValue: accountInfo ? accountInfo.openPlaceAddr1 : "",
                  })(
                    <Select
                      placeholder="请选择"
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
                    initialValue: accountInfo ? accountInfo.openPlaceAddr2 : "",
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
                rules: [{ required: true, message: "请选择开户行" }],
                initialValue: accountInfo ? accountInfo.openSubBranch : "",
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
                initialValue: accountInfo ? accountInfo.openName : "",
              })(<Input placeholder="请输入开户名称" />)}
            </FormItem>
            <FormItem label="账户号码">
              {getFieldDecorator("accountNo", {
                rules: [
                  { required: true, message: "请填写正确的账户号码" },
                  { pattern: /^[0-9]{1,22}$/, message: "23位数字之内" },
                ],
                initialValue: accountInfo ? accountInfo.accountNo : "",
              })(
                <Input style={{ width: "100%" }} placeholder="请输入账户号码" />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Checkbox
                onChange={this.isCheck}
                style={{ marginRight: "10px" }}
              />
              我已阅读、理解并同意
              <a onClick={() => this.readAgreement("userStateVisible")}>
                《用户声明》
              </a>
              <a onClick={() => this.readAgreement("userServiceProtocol")}>
                《用户服务协议》
              </a>
              <a onClick={() => this.readAgreement("yiliVisible")}>
                《粮票使用协议》
              </a>
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
                    disabled={disabled}
                  >
                    提交
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
          <UserStateMent
            visible={userStateVisible}
            closeModel={this.closeAgreement}
          />
          <UserServiceProtocol
            visible={userServiceProtocol}
            closeModel={this.closeAgreement}
          />
          <YiLi visible={yiliVisible} closeModel={this.closeAgreement} />
        </div>
      );
    }

    return (
      <div>
        <Card title="服务须知：我们的审核时限为24小时(工作日)，遇法定节假日顺延。">
          {component}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.reducer.get("userInfo").toJS(),
  companyTypeList: format(state.reducer.get("list").toJS(), ENTERPRISE_TYPE),
  companyInfo: state.reducer.get("companyInfo").toJS(),
});
const mapDispatchToProps = (dispatch) => {
  return {
    changeStatus(flag) {
      dispatch(changeNavStatus(flag));
    },
    getAsyncData() {
      dispatch(getListData());
    },
  };
};
let CustomModifyInfo = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(Info))
);

let ModifyInfo = (props) => <CustomModifyInfo id={props.match.params.id} />;
export default ModifyInfo;
