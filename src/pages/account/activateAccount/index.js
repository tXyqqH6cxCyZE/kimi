import React from 'react'
import {Form, Input, message, Button, Card} from 'antd';
const FormItem = Form.Item;

class ActivateAccount extends React.Component {
    state = {
        currentIndex: 0
    }
    changeLoginPassword = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
            	this.setState({
            		currentIndex: 1
            	})
            } else {
                message.warn('数据格式有误');
            }
        });
    };
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
            	this.props.history.push('/account/index')
            } else {
                message.warn('数据格式有误');
            }
        });
    };
    checkTransPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('transPassword')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    }

    render() {
    	let component = null;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
	      labelCol: { span: 10 },
	      wrapperCol: { span: 6 }
	    };
	    const tailFormItemLayout = {
	      wrapperCol: {
	        span: 6,
	        offset: 10
	      }
	    };
        if(this.state.currentIndex === 0) {
        	component = <Form {...formItemLayout} onSubmit={this.changeLoginPassword}>
                <FormItem label="新密码" hasFeedback>
                    {
                        getFieldDecorator('newPassword', {
                            rules: [{required: true, message: '新密码不能为空'},{pattern:/^([A-Za-z0-9!@#$%^&*()-=_+;:'",<>./?\|]{8,18})+$/ , message:`8-18位字节，字母、数字、特殊字符或组合,特殊字符限制:!@#$%^&*()-=_+;:'",<>./?\|`}],
                            initialValue: ''
                        })
                        (<Input type="password" placeholder="请输入新密码"/>)
                    }
                </FormItem>
                <FormItem label="确认新密码" hasFeedback>
                    {
                        getFieldDecorator('ConfirmPassword', {
                            rules: [{required: true, message: '确认密码不能为空'}, {
                                validator: this.checkPassword
                            }]
                        })
                        (<Input type="password" placeholder="请输入确认密码"/>)
                    }
                </FormItem>
                <Form.Item {...tailFormItemLayout}>
		          <Button htmlType="submit" className ="btn">下一步</Button>		         
		        </Form.Item>
            </Form>
        }
        else {
        	component = <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <FormItem label="交易密码" hasFeedback>
                    {
                        getFieldDecorator('transPassword', {
                            rules: [{required: true, message: '交易密码不能为空'},{pattern:/^([A-Za-z0-9!@#$%^&*()-=_+;:'",<>./?\|]{6,18})+$/ , message:`6-18位字节，字母、数字、特殊字符或组合,特殊字符限制:!@#$%^&*()-=_+;:'",<>./?\|`}],
                            initialValue: ''
                        })
                        (<Input type="password" placeholder="请输入交易密码"/>)
                    }
                </FormItem>
                <FormItem label="确认交易密码" hasFeedback>
                    {
                        getFieldDecorator('ConfirmTransPassword', {
                            rules: [{required: true, message: '确认密码不能为空'}, {
                                validator: this.checkTransPassword
                            }]
                        })
                        (<Input type="password" placeholder="请输入确认密码"/>)
                    }
                </FormItem>
                <Form.Item {...tailFormItemLayout}>
		          <Button htmlType="submit" className ="btn">提交</Button>		         
		        </Form.Item>
            </Form>
        }
        return (
           <Card title="激活账号">		        	
            {component} 					
           </Card>             
        );
    }
}
export default Form.create()(ActivateAccount);