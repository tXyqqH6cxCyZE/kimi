import React, { Component } from 'react';
import {Row, Col, Button, Card, Form, Select, Input, Modal, message, Checkbox } from 'antd';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import {USER_TYPE, ENTERPRISE_EMPLOYEE_ROLE} from 'store/actionTypes'
import {format, getSelectOption} from 'utils/format'
import request from 'utils/http'

const FormItem = Form.Item;

class Info extends Component {
	state = {
		ModelVisible: false,
		enterprise: []
	}
	componentWillMount() {	
	  	this.props.getInfo(window.location.hash)
	}
	handleSubmit = (e) => {		
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
		    if (err) {
		      return;
		    }
		    values['cusType'] = 1;
		    values['idType'] = 1;
		    values['registerFdd'] = values['registerFdd'] ? true : false
		    request({url: 'user/add', method: 'post', params: values}).then(res => {
		    	if(res.code === 0) {	        			
					message.success('添加成功');
					this.props.history.push('/system/index');	
				}
				else {
					message.error(res.message)
				}
		    }).catch(err => {
		    	console.log(err)
		    })
		})
  	}
	okHandler = () => {
		this.setState({
	      	ModelVisible: false
	    }, () => {
	    	this.props.history.push('/system/index');	
	    })
	}
	// 用户类型改变 请求所属企业
	onTypeChange = async(type, value) => {
		this.props.form.setFieldsValue({[type]: '请选择'})
		await request({url: `user/affiliated/${value}`, method: 'get'}).then(res => {
			if(res.code === 0) {
				this.setState({
					enterprise: res.data
				})
			}
		});		
	}
  	render(){ 
  		const { getFieldDecorator } = this.props.form;  
  		const {userTypeList, userRoleList} = this.props;
  		const {enterprise} = this.state;
	    const userType = getSelectOption(userTypeList);
	    const userRole = getSelectOption(userRoleList);
	     // 企业
      const enterpriseList = getSelectOption(enterprise);
    	const formItemLayout = {
      	labelCol: { span: 10 },
      	wrapperCol: { span: 6 }
	    };
	    const tailFormItemLayout = {
	      wrapperCol: {
	        span: 6,
	        offset: 10
	      },
	    };	    
	    return (
	    	<div>
		    	<Row>
			      <Col span={24}>
			        <Card title='新增用户' size="small">
			        	<Form {...formItemLayout} onSubmit={this.handleSubmit}>
			                <FormItem label="用户名">
			                    {
			                        getFieldDecorator('name', {
			                            rules:[{required: true,message: '请输入正确的姓名'}, {pattern: /^[\u4e00-\u9fff]{1,25}$/, message:'限制25字符以内，限制为纯文字'}],
			                            initialValue: ''
			                        })
			                        (<Input placeholder="请输入用户真实姓名"/>)
			                    }
			                </FormItem> 
			                <FormItem label="手机号码">
			                    {
			                        getFieldDecorator('tel', {
			                            rules:[{required: true,message: '请输入正确的手机号'}, {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message:'请输入正确的手机号'}],
			                            initialValue: ''
			                        })
			                        (<Input placeholder="请输入手机号"/>)
			                    }
			                </FormItem>
			                <FormItem label="电子邮箱">
			                    {
			                        getFieldDecorator('email', {
			                            rules:[{required: true,message: '请输入正确的电子邮箱'}, {pattern: /^[A-Za-z0-9._-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message:'请输入正确的电子邮箱'}],
			                            initialValue: ''
			                        })
			                        (<Input placeholder="请输入电子邮箱"/>)
			                    }
			                </FormItem>
			                
			                <FormItem label="用户类型">
			                    {
			                        getFieldDecorator('type', {
			                            rules:[{required: true,message: '请选择用户类型'}]
			                        })
			                        (
							            <Select placeholder="请选择" onChange={this.onTypeChange.bind(this, 'enterpriseId')}>
							              {userType}
							            </Select>
							        )
			                    }
			                </FormItem>	
			                <FormItem label="所属企业">
			                    {
			                        getFieldDecorator('enterpriseId', {
			                            rules:[{required: true,message: '请输入所属企业'}]
			                        })
			                        (<Select														        					        
								        placeholder='请选择'									        
								      >
								        {enterpriseList}
								    </Select>)
			                    }
			                </FormItem>
			                <FormItem label="绑定角色">
			                    {
			                        getFieldDecorator('role', {
			                            rules:[{required: true,message: '请选择绑定角色'}]
			                        })
			                       (
							            <Select placeholder="请选择">
							              {userRole}
							            </Select>
							        )
			                    }
			                </FormItem>	
			                <FormItem label="证件类型">
		                		{getFieldDecorator('idType', {
		                            rules:[{required: true,message: '请选择绑定角色'}],
		                            initialValue: '身份证'
		                        })
		                        (
						            (<Input disabled/>)
						        )}
		                       
			                </FormItem> 
			                <FormItem label="证件号码">
			                    {
			                        getFieldDecorator('idNo', {
			                            rules:[{required: true,message: '证件号码格式不正确'},{pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message:'限制15-18位数字（最后一位可为字母X）'}],
			                            initialValue: ''
			                        })
			                        (<Input placeholder="请填写证件号码"/>)
			                    }
			                </FormItem>
			                <FormItem label="客户类型">
			                    {getFieldDecorator('cusType', {
		                            rules:[{required: true,message: '请选择绑定角色'}],
		                            initialValue: '个人'
		                        })
		                        (
						            (<Input disabled/>)
						        )}		
			                </FormItem> 
			                <FormItem label="是否注册法大大">
			                    {getFieldDecorator('registerFdd', {
						            valuePropName: 'checked'
						        })
		                        (
						            (<Checkbox>
						              	注册
						            </Checkbox>)
						        )}		
			                </FormItem>
			                <Form.Item {...tailFormItemLayout}>
					            <Button htmlType="submit" className ="btn" style = {{marginRight: '35px'}}>确认</Button>
					            <Button className ="btn" onClick = {() => this.props.history.push("/system/index")}>
					          	  取消
					            </Button>
						    </Form.Item>
			            </Form>							
					</Card>
				</Col>
			</Row>	
			<Modal title={'提示'}
        maskClosable={false} visible={this.state.ModelVisible} width={500}                                               
        centered
				footer={[			            
            <Button key="submit" type="primary" onClick={this.okHandler}>
              	确认
            </Button>,
  			]} >
				<p>账号已开通</p>
        	<p>用户账号和密码会通过短信和邮件的形式发送，请注意查收！</p>
        </Modal>
		</div>
	    );
	}
}


const mapStateToProps = (state) => {
	return {
		userTypeList: format(state.reducer.get('list').toJS(), USER_TYPE),
		userRoleList: format(state.reducer.get('list').toJS(), ENTERPRISE_EMPLOYEE_ROLE)
	}	
};
const mapDispatchToProps = (dispatch) => {
	return {		
		getInfo(url) {
			dispatch(getUserInfo(url))
		}
	}
}
let CustomInfo = withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(Info)));
export default () => <CustomInfo/>