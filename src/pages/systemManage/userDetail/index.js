import React, { Component } from 'react';
import {Row, Col, Button, Card, Form, Select, Input} from 'antd';
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import {withRouter} from 'react-router-dom'
import {USER_TYPE, ENTERPRISE_EMPLOYEE_ROLE, ID_TYPE, CUS_TYPE} from 'store/actionTypes'
import {format, getSelectOption, formatType} from 'utils/format'
import request from 'utils/http'

const FormItem = Form.Item;

class Info extends Component {
	state = {
		useInfo: {}			
	}
	componentWillMount() {	
	  	this.props.getInfo(window.location.hash)
	}
	async componentDidMount() {
		if(this.props.id) {
			let useInfo = await request({url: `user/info/${this.props.id}`, method: 'get'}).then(res => {
				if(res.code === 0) {
					this.setState({
						useInfo: res.data
					})
				}
			})
		}
	}		
	// 取消操作
	back =() => {
		this.props.history.go(-1);
	}
	
  	render(){ 
  		const { getFieldDecorator } = this.props.form; 
  		const {useInfo} = this.state;
  		const {userTypeList, userRoleList, idTypeList, cusTypeList} = this.props;
  		const userType = getSelectOption(userTypeList);
	    const userRole = getSelectOption(userRoleList);
	    const idType = getSelectOption(idTypeList);
	    const cusType = getSelectOption(cusTypeList);
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
			        <Card title='用户详情' size="small">
			        	<Form {...formItemLayout}>
	                        <FormItem label="用户名">
	                            {
	                                getFieldDecorator('name', {	                                    
	                                    initialValue: useInfo.name
	                                })
	                                (<Input disabled = {true}/>)
	                            }
	                        </FormItem> 
	                        <FormItem label="手机号码">
	                            {
	                                getFieldDecorator('tel', {	                                    
	                                    initialValue: useInfo.tel
	                                })
	                                (<Input disabled = {true}/>)
	                            }
	                        </FormItem>
	                        <FormItem label="电子邮箱">
	                            {
	                                getFieldDecorator('email', {	                                    
	                                    initialValue: useInfo.email
	                                })
	                                (<Input disabled = {true}/>)
	                            }
	                        </FormItem>
	                        <FormItem label="用户类型">
	                            {
	                                getFieldDecorator('type', {
	                                    rules:[{required: true,message: '请选择用户类型'}],
	                                    initialValue: formatType(userType, useInfo.type)
	                                })
	                                (<Input disabled = {true}/>)
	                            }
	                        </FormItem>	
	                        <FormItem label="所属企业">
	                            {
	                                getFieldDecorator('enterpriseName', {
	                                    rules:[{required: true,message: '请输入所属企业'}],
	                                    initialValue: useInfo.enterpriseName
	                                })
	                                (<Input disabled = {true}/>)
	                            }
	                        </FormItem>
	                        <FormItem label="绑定角色">
	                            {
	                                getFieldDecorator('role', {
	                                    rules:[{required: true,message: '请选择绑定角色'}],
	                                    initialValue: formatType(userRole, useInfo.role)
	                                })
	                                (<Input disabled = {true}/>)
	                            }
	                        </FormItem>	
	                        <FormItem label="证件类型">
		                		{getFieldDecorator('idType', {
		                            rules:[{required: true,message: '请选择绑定角色'}],
		                            initialValue: formatType(idType, useInfo.idType)
		                        })
		                        (
						            (<Input disabled/>)
						        )}
		                       
			                </FormItem> 
	                        <FormItem label="证件号码">
	                            {
	                                getFieldDecorator('idNo', {	                                   
	                                    initialValue: useInfo.idNo
	                                })
	                                (<Input disabled = {true}/>)
	                            }
	                        </FormItem>	  
	                        <FormItem label="客户类型">
	                            {
	                                getFieldDecorator('cusType', {	                                   
	                                    initialValue: formatType(cusType, useInfo.cusType)
	                                })
	                                (<Input disabled = {true}/>)
	                            }
	                        </FormItem>
	                        <FormItem label="用户设置">
	                            {
	                                getFieldDecorator('userSetting', {	                                   
	                                    initialValue: '正常'
	                                })
	                                (<Input disabled = {true}/>)
	                            }
	                        </FormItem>
	                        <Form.Item {...tailFormItemLayout}>					         
					          <Button className ="btn" onClick={this.back}>返回</Button>
					        </Form.Item>
	                    </Form>							
					</Card>
				  </Col>
				</Row>					
		   	</div>
	    );
	}
}


const mapStateToProps = (state) => {
	return {
		userTypeList: format(state.reducer.get('list').toJS(), USER_TYPE),
		userRoleList: format(state.reducer.get('list').toJS(), ENTERPRISE_EMPLOYEE_ROLE),
		idTypeList: format(state.reducer.get('list').toJS(), ID_TYPE),
		cusTypeList: format(state.reducer.get('list').toJS(), CUS_TYPE)
	}	
};
const mapDispatchToProps = (dispatch) => {
	return {		
		getInfo(url) {
			dispatch(getUserInfo(url))
		}
	}
}
let CustomInfo = withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(Info)))

let UserDetail = (props) => <CustomInfo id = {props.match.params.id}/>
export default withRouter(UserDetail)