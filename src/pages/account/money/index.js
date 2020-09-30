import React from 'react'
import {Card,Form,Button,Input,message,Row,Col,Modal} from 'antd'
import path from 'config/pathConfig';
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import request from 'utils/http'
import {withRouter} from 'react-router-dom'
import {fmtMoney} from 'utils/format'

const FormItem = Form.Item;

class Money extends React.Component{
    state = {
		ModelVisible: false,
		info: {},
		values: {},
		random: null
	}   
	componentWillMount() {	
	  	this.props.getInfo()
	}
  	componentDidMount() {
		this.getAccountInfo()
		this.getCaptcha()
	}
	getAccountInfo = async() => {
		await request({url: 'enterprise/account/list', method: 'get'}).then(res => {
			if(res.code === 0) {				
				this.setState({
			    	info: res.data
			    })
			}
		})		    
	}
	getCaptcha = () => {
		let random = Math.random();
		this.setState({
			random
		}, () => {
			this.imgCaptcha.setAttribute("src", path.CAPTCHA + this.state.random)	
		})			
	}
    handleSubmit = ()=>{
	    this.props.form.validateFields((err, values) => {	         	
	      if (!err) {
	        this.setState({
	        	ModelVisible: true,
	        	values
	        })
	      }
	      else {
            message.warn('数据格式有误');
          }
	    });
    }
    okHandler = () => {
    	let params = {}
    	let {values} = this.state;
    	params['amount'] = values['amount']
    	params['verifyCode'] = values['verifyCode']
    	params['trxPassword'] = values['trxPassword']
    	params['sid'] = this.state.random;
    	request({
    		url: 'enterprise/transaction/withdraw', 
    		method: 'post', 
    		params
    	})
		.then(res => {
		 	if(res.code === 0) {
	 			message.success(res.message);	 			
				this.props.history.push('/account/result');
				this.props.form.resetFields()
		 	}
		 	else {
		 		message.error(res.message)
		 		this.getCaptcha()
		 	}
		 	this.hideModelHandler()
		})
		.catch(err => {
			console.log(err)
		})   	   	
    }
    hideModelHandler = () =>{
	    this.setState({
	        ModelVisible: false
	    })
    }
    render(){
       	const { getFieldDecorator } = this.props.form;
       	const {info, ModelVisible, values, defaultType, newType} = this.state;
        const formItemLayout = {
	      labelCol: { span: 10 },
	      wrapperCol: { span: 10 }
	    };
	    const tailFormItemLayout = {
	      wrapperCol: {
	        span: 10,
	        offset: 10
	      },
	    };
        return (	
            <div className="contain-wrapper">           	
		        <Card title="提现">		        	
		            <Row type="flex" justify="center">		            	
            			<Col span = {12}>
		                    <div>  
		                    	<Form {...formItemLayout}>
		                            <FormItem label="提现账户">
			                            <span className="ant-form-text">{info.bankAccountNo}</span>
			                        </FormItem>
			                        <FormItem label="提现账户余额(元)">
			                            <span className="ant-form-text">{info.balance && fmtMoney(info.balance)}</span>
			                        </FormItem>
			                        <FormItem label="绑定银行账户">
			                            <span className="ant-form-text">{info.bankName}</span>
			                        </FormItem>
			                        <FormItem label="提现金额(元)">
			                            {
		                                    getFieldDecorator('amount', {
		                                        rules:[{required: true,message: '请输入金额'}, {pattern: /^\d{1,12}(\.\d{1,2})?$/, message:'纯数字、正数、小数点前最多12位、小数点后最多两位，金额大于0'}],
		                                        initialValue: ''
		                                    })
		                                    (<Input placeholder="请输入提现金额"/>)
		                                }
			                        </FormItem>
			                        <FormItem label="验证码">
			                            <Row gutter={8}>
								            <Col span={15}>
									            {getFieldDecorator('verifyCode', {
				                               	rules:[{required: true,message: '请输入验证码'}]
				                                })
				                                (<Input placeholder="请输入验证码"/>) 
				                            }
								            </Col>
								            <Col span={6}>
								              <img
						                        ref = {captcha => this.imgCaptcha = captcha}
						                        onClick={this.getCaptcha}
						                      />
								            </Col>
								        </Row>
			                        </FormItem>
			                        <FormItem label="输入交易密码">
			                            {getFieldDecorator('trxPassword', {
	                                        rules:[ {required: true,message: '请输入交易密码'},{pattern:/^([A-Za-z0-9!@#$%^&*()-=_+;:'",<>./?\|]{6,18})+$/ , message:`6-18位字节，字母、数字、特殊字符或组合,特殊字符限制:!@#$%^&*()-=_+;:'",<>./?\|`}]
	                                    })
	                                    (<Input.Password placeholder="请输入交易密码" />)
		                                }
			                        </FormItem>
			                        <FormItem {...tailFormItemLayout}>
			                            <Button style = {{'width': '100%'}} onClick= {this.handleSubmit}>
								            提现
								        </Button>
			                        </FormItem>
			                    </Form>
		                    </div>
		            	</Col>
	            	</Row>
	            </Card>
	            <Modal title={'确认提现'}
                       maskClosable={false} visible={ModelVisible} width={500}                        
                       onOk={this.okHandler} onCancel={this.hideModelHandler}
                       centered>
	            		<p>提现账户: {info.bankAccountNo}</p>
	            		<p>提现金额: {values.amount}</p>
	            </Modal>
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
	return {		
		getInfo(url) {
			dispatch(getUserInfo(url))
		}
	}
}
export default withRouter(connect(null, mapDispatchToProps)(Form.create()(Money)))