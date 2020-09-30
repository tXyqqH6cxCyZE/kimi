import React, {Component} from 'react';
import {Row, Col, Card, message,Form, Input, Button} from 'antd'
import request from 'utils/http'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'

const FormItem = Form.Item;
const { TextArea } = Input;
let timeout;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  function fake() {
    request({url: `invitation/superior/${value}`, method: 'get'})
      .then(res =>{     	
      	if(res.code === 0) {
		  	callback(res.data)
		}
      	else {
      		message.error('未找到此邀请码')
      		callback(res)
      	}
    })
  }

  timeout = setTimeout(fake, 1000);
}

class CoreCompany extends Component {
	state = {
		companyInfo: {}
	}
	componentWillMount() {	
	  	this.props.getInfo()
	}
	// 企业申请认证
	handleBasicSubmit = (e) => {
    	e.preventDefault();
    	const {id} = this.state.companyInfo;
    	this.props.form.validateFields((err, values) => {
	      	if (!err) {
	      		let params = {}
		    	params['upEnterprise'] = id;
		    	params['appliedCredit'] = values['appliedCredit']
		    	if(values['note']) {
		    		params['note'] = values['note']
		    	}
	    		request({url: 'credit/apply', method: 'post', params: params})
		    		.then(res => {
					 	if(res.code === 0) {
				 			message.success(res.message);
				 			this.props.history.push('/account/more')
					 	}
					 	else {
					 		message.error(res.message)
					 	}
					})
		    		.catch(err => {
						console.log(err)
					})   	
	      	}      	  
		})
    }
	handleSearch = e => {
		let value = e.target.value;
	    fetch(value, data => this.setState({ companyInfo: data }));
	  };
	render() {
		const formItemLayout = {
	      labelCol: { span: 10 },
	      wrapperCol: { span: 6 }
	    };
	    const { getFieldDecorator } = this.props.form;  
	    const {companyInfo} = this.state;
		return (
			<Row>
		      <Col span={24}>
		        <Card title='账户资料 企业授信申请' size="small">		        	
				    <Form {...formItemLayout} onSubmit={this.handleBasicSubmit}>
				        <FormItem label="邀请码">
		                    {
		                        getFieldDecorator('invitationCode', {
		                            rules:[{required: true, message: '请输入邀请码'}]
		                        })
		                        (<Input onChange={this.handleSearch}/>)
		                    }
		                    <span className="ant-form-text">{companyInfo.name}</span>
		                </FormItem>
		                <FormItem label="申请额度(元)">
		                    {
		                        getFieldDecorator('appliedCredit', {
		                            rules:[{required: true, message: '请输入正确的金额'}, {pattern: /^\d{1,12}(\.\d{1,2})?$/, message:'纯数字、正数、小数点前最多12位、小数点后最多两位，金额大于0'}],
		                            initialValue: ''
		                        })
		                        (<Input placeholder="请填写金额"/>)
		                    }
		                </FormItem>
		                <FormItem label="备注">
                            {
                                getFieldDecorator('note')
                                (<TextArea className="textarea"/>)
                            }
                        </FormItem>
                        <Form.Item wrapperCol={{ span: 6, offset: 10 }}>
				          <Button className="btn" htmlType="submit">认证申请</Button>
				        </Form.Item>
		            </Form>
				</Card>
			  </Col>
			</Row>
		)
	}
}
const mapDispatchToProps = (dispatch) => {
	return {		
		getInfo(url) {
			dispatch(getUserInfo(url))
		}
	}
} 
export default withRouter(connect(null, mapDispatchToProps)(Form.create()(CoreCompany)))
