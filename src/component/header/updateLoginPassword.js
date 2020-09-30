import React from 'react'
import {Modal, Form, Input, message, Row, Col, Button} from 'antd';
import request from 'utils/http'

const FormItem = Form.Item;

class UpdateLoginPassword extends React.Component {
    hideModelHandler = ()=> {
        this.props.setState({
            LoginPassword: false
        })
        this.props.form.resetFields();
    };

    okHandler() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
            	delete values['confirmPassword']            	
            	// 修改登陆密码发送请求
                this.props.sta.title === 'login' ? request({url: "user/modifyPwd", method: 'put', params: values}).then(res => {
                    if (res.code === 0) {
                        message.success('修改成功');                        
                        this.hideModelHandler();
                    } else {
                        message.error(res.message);
                    }
                })
                // 修改交易密码发送请求
                : this.props.sta.title === 'transfer' ? request({url: "user/modifyTxPwd", method: 'put', params: values}).then(res => {
                    if (res.code === 0) {
                        message.success('修改成功');                        
                        this.hideModelHandler();
                    } else {
                        message.error(res.message);
                    }
                })
                : this.hideModelHandler();
            } else {
                message.warn('数据格式有误');
            }
        });
    };

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {userInfo} = this.props;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        return (
            <span>
                <Modal title={this.props.sta.title === 'login' 
                   ? '修改登录密码' 
                   : this.props.sta.title === 'transfer'
                   		? '修改交易密码' 
                   		: '用户信息'
                	}
                   maskClosable={false} visible={this.props.sta.LoginPassword} width={400}
                   centered
                   onOk={this.okHandler.bind(this)} onCancel={this.hideModelHandler}
                   >
                 {
                	this.props.sta.title === 'login' 
                		? (<Form {...formItemLayout}>
	                        <FormItem label="原密码">
	                            {
	                                getFieldDecorator('oldPassword', {
	                                    rules: [{required: true, message: '原密码不能为空'},{pattern:/^([A-Za-z0-9!@#$%^&*()-=_+;:'",<>./?\|]{8,18})+$/ , message:`8-18位字节，字母、数字、特殊字符或组合,特殊字符限制:!@#$%^&*()-=_+;:'",<>./?\|`}],
	                                })
	                                (<Input type="password" placeholder="请输入原密码"/>)
	                            }
	                        </FormItem>
	                        <FormItem label="新密码">
	                            {
	                                getFieldDecorator('password', {
	                                    rules: [{required: true, message: '新密码不能为空'},{pattern:/^([A-Za-z0-9!@#$%^&*()-=_+;:'",<>./?\|]{8,18})+$/ , message:`8-18位字节，字母、数字、特殊字符或组合,特殊字符限制:!@#$%^&*()-=_+;:'",<>./?\|`}],
	                                })
	                                (<Input type="password" placeholder="请输入新密码"/>)
	                            }
	                        </FormItem>
	                        <FormItem label="确认密码">
	                            {
	                                getFieldDecorator('confirmPassword', {
	                                    rules: [{required: true, message: '确认密码不能为空'}, {
	                                        validator: this.checkPassword
	                                    }]
	                                })
	                                (<Input type="password" placeholder="请输入确认密码"/>)
	                            }
	                        </FormItem>
	                    </Form>)
                	: this.props.sta.title === 'transfer'  
                		? (<Form {...formItemLayout}>
	                        <FormItem label="原密码">
	                            {
	                                getFieldDecorator('oldPassword', {
	                                    rules: [{required: true, message: '原密码不能为空'},{pattern:/^([A-Za-z0-9!@#$%^&*()-=_+;:'",<>./?\|]{6,18})+$/ , message:`6-18位字节，字母、数字、特殊字符或组合,特殊字符限制:!@#$%^&*()-=_+;:'",<>./?\|`}],
	                                })
	                                (<Input type="password" placeholder="请输入原密码"/>)
	                            }
	                        </FormItem>
	                        <FormItem label="新密码">
	                            {
	                                getFieldDecorator('password', {
	                                    rules: [{required: true, message: '新密码不能为空'},{pattern:/^([A-Za-z0-9!@#$%^&*()-=_+;:'",<>./?\|]{6,18})+$/ , message:`6-18位字节，字母、数字、特殊字符或组合,特殊字符限制:!@#$%^&*()-=_+;:'",<>./?\|`}],
	                                })
	                                (<Input type="password" placeholder="请输入新密码"/>)
	                            }
	                        </FormItem>
	                        <FormItem label="确认密码">
	                            {
	                                getFieldDecorator('confirmPassword', {
	                                    rules: [{required: true, message: '确认密码不能为空'}, {
	                                        validator: this.checkPassword
	                                    }]
	                                })
	                                (<Input type="password" placeholder="请输入确认密码"/>)
	                            }
	                        </FormItem>
	                    </Form>)
                		: (<Form {...formItemLayout} className="person">
	                        <Form.Item label="用户名">
					          <span className="ant-form-text">{userInfo.realName}</span>
					        </Form.Item>
	                        <Form.Item label="手机号码">
					          <span className="ant-form-text">{userInfo.phone}</span>
					        </Form.Item>
	                        <Form.Item label="电子邮箱">
					          <span className="ant-form-text">{userInfo.email}</span>
					        </Form.Item>
	                    </Form>)
                 }                   
                </Modal>
            </span>
        );
    }
}
export default Form.create()(UpdateLoginPassword);