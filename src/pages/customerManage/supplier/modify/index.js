//平台审核
import React, { Component } from 'react';
import {Row, Col, Card, Form, Button, Radio,Input, Select, InputNumber, Icon, message} from 'antd';
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import {format} from 'utils/format'
import request from 'utils/http'
import {BANK_ACCOUNT_STATUS, FAIL} from 'store/actionTypes'
import path from 'config/pathConfig';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class Modify extends Component {
	constructor(props) {
		super(props)
		this.state = {
			checked: false,
			mount: false,
			// 基本信息
			basicInfo: {},
			// 法人信息
			guaranteeInfo: {},
			// 账户信息
			accountInfo: {},
			stateNum: null,
			fileInfo: {},
			historyInfo: {}
		}
	}
	componentWillMount() {	
	  	this.props.getInfo(window.location.href)
	}
	// 获取详情信息
	componentDidMount() {
		this.getBasicInfo()			
	}
	//下载证件函数
	download = () => {
		//window.location.href = path.BASE_URL + "file/download/" + 1 + "/" + this.props.match.params.id;
		window.open(path.BASE_URL + "file/download/" + 1 + "/" + this.props.match.params.id, 'target');
	}
	getBasicInfo = async() => {
		const {id} = this.props.match.params;
		let stateNum;
		if(!this.props.location.query) {
			this.props.history.push('/customer/supplier')
			return 
		}		
		else {
			stateNum = this.props.location.query.stateNum;
			this.setState({
				stateNum
			})
		}
		// 获取基本信息
		await request({url: 'register/basic', method: 'get', params: {enterpriseId: id}}).then(res => {
			if(res.code === 0) {
				this.setState({basicInfo: res.data})
			}
		})
		// 获取法人/担保人信息
		await request({url: 'register/supply/legal', method: 'get', params: {enterpriseId: id}}).then(res => {
			if(res.code === 0) {
				this.setState({guaranteeInfo: res.data})
			}
		})
		// 账户信息
		await request({url: 'register/account/view', method: 'get', params: {enterpriseId: id}}).then(res => {
			if(res.code === 0) {
				this.setState({accountInfo: res.data})
			}
		})		
		await request({url: 'file/list', method: 'get', params: {
			relationId: id,
			relationType: 1
		}}).then(res => {
			if(res.code === 0) {
				this.setState({fileInfo: res.data})
			}
		})
		await request({url: 'register/supplier/toAudit', method: 'get', params: {supplierId: id}}).then(res => {
			if(res.code === 0) {
				this.setState({historyInfo: res.data})
			}
			else {
				message.error(res.message)
			}
		})	
		
		
	}
	
	// 表单提交
	handleSubmit = (e) => {
      e.preventDefault();
      const {idUp, idDown} = this.state.historyInfo.relation
      this.props.form.validateFields((err, values) => {
        if (!err) {
        	let params = {};
        	if(values['action']) {
        		params['action'] = parseInt(values['action'], 10)
        	}	
        	params['applyEnterprise'] = idDown
        	params['upEnterprise'] = idUp
        	if(values['suggestedCredit']) {
        		params['suggestedCredit'] = parseFloat(values['suggestedCredit'], 10)
        	}
        	if(values['interestMethod']) {
        		params['interestMethod'] = parseFloat(values['interestMethod'], 10)
        	}
        	if(values['financingRatio']) {
        		params['financingRatio'] = parseFloat(values['financingRatio'], 10)
        	}
        	if(values['note']) {
        		params['note'] = values['note']
        	}
          	request({url: 'register/supplier/audit', method: 'post', params})
    		.then(res => {
			 	if(res.code === 0) {
		 			message.success(res.message);
		 			this.props.history.push('/customer/supplier')
			 	}
			 	else {
			 		message.error(res.message)
			 	}
			})
    		.catch(err => {
				console.log(err)
			})   
        }
      });
    }
	showPic = (obj) => {
		if(!obj) { return }
		return obj && obj.length > 0 
			? obj.map(item =>
				<li key = {item.fileId} className="pic">
					<div className="icon">
						<Icon type="picture" />
					</div>
					{item.fileName}						
				</li>) 
			: obj
	}
  	render(){
  		let component = null;
  		const formItemLayout = {
            labelCol:{
                xs:24,
                sm:9
            },
            wrapperCol:{
                xs:24,
                sm:15
            }
        }  
        const { getFieldDecorator } = this.props.form;
        const {bankAccountStatus, id} = this.props;
        
        const {basicInfo, guaranteeInfo, accountInfo, fileInfo, stateNum, historyInfo} = this.state
        
        let currentStatus = bankAccountStatus && bankAccountStatus.filter(item => item.id == accountInfo.accountVerification)
	    component = <Card title="审核">		        	
            <div className="wrapper">
			    <Row gutter={16}>
			      <Col span={8}>
			        <Card title="基本信息" size="small">
			        	<Form {...formItemLayout}>
	                        <FormItem label="公司名称">
	                            <span className="ant-form-text">{basicInfo.name}</span>
	                        </FormItem>
	                        <FormItem label="营业执照注册号">
	                            <span className="ant-form-text">{basicInfo.registerMark}</span>
	                        </FormItem>
	                        <FormItem label="公司类型">
	                            <span className="ant-form-text">{basicInfo.type}</span>
	                        </FormItem>
	                        <FormItem label="公司税号">
	                            <span className="ant-form-text">{basicInfo.taxId}</span>
	                        </FormItem>	                        
	                        <FormItem label="财务负责人">
	                            <span className="ant-form-text">{basicInfo.financeMgr}</span>
	                        </FormItem>
	                        <FormItem label="财务联系方式">
	                            <span className="ant-form-text">{basicInfo.financeTel}</span>
	                        </FormItem>	                       
	                        <FormItem label="成立时间">
	                            <span className="ant-form-text">{basicInfo.established}</span>
	                        </FormItem>
	                        <FormItem label="注册资本（元）">
	                            <span className="ant-form-text">{basicInfo.registerCapital}</span>
	                        </FormItem>
	                        <FormItem label="经营场所地址">
	                            <span className="ant-form-text">{basicInfo.bizAddr}</span>
	                        </FormItem>
	                        <FormItem label="发票邮寄地址">
	                            <span className="ant-form-text">{basicInfo.postAddr}</span>
	                        </FormItem> 
	                    </Form>
			        </Card>
			      </Col>
			      <Col span={8}>			      	
			        <Card title="法人信息" size="small">
			        	<Form {...formItemLayout}>
							<FormItem label="法人代表姓名">
	                            <span className="ant-form-text">{guaranteeInfo.legalPersonName}</span>
	                        </FormItem>
	                        <FormItem label="法人代表身份证号">
	                            <span className="ant-form-text">{guaranteeInfo.legalPersonId}</span>
	                        </FormItem>
	                        <FormItem label="法人代表联系方式">
	                            <span className="ant-form-text">{guaranteeInfo.legalPersonTel}</span>
	                        </FormItem>
	                        <FormItem label="法人代表家庭地址">
	                            <span className="ant-form-text">{guaranteeInfo.legalPersonAddr}</span>
	                        </FormItem>
	                        <FormItem label="担保人姓名">
	                            <span className="ant-form-text">{guaranteeInfo.guaranteeName}</span>
	                        </FormItem>
	                         <FormItem label="担保人份证号码">
	                            <span className="ant-form-text">{guaranteeInfo.guaranteeId}</span>
	                        </FormItem>
	                        <FormItem label="担保人联系方式">
	                            <span className="ant-form-text">{guaranteeInfo.guaranteeTel}</span>
	                        </FormItem>
	                        <FormItem label="实际控制人姓名">
	                            <span className="ant-form-text">{guaranteeInfo.controllerName}</span>
	                        </FormItem>
	                        <FormItem label="实际控制人份证号码">
	                            <span className="ant-form-text">{guaranteeInfo.controllerId}</span>
	                        </FormItem>
	                        <FormItem label="实际控制人联系方式">
	                            <span className="ant-form-text">{guaranteeInfo.controllerTel}</span>
	                        </FormItem>
	                    </Form>
			        </Card>
			      </Col>
			      <Col span={8}>			      	
			        {/*<Card title="银行账户" extra={currentStatus && currentStatus.length > 0 
			        			? currentStatus[0].id == FAIL
			        				? <Button>
				              			<NavLink to={`/account/modifyInfo/${id}`} style = {{'color': 'red'}}>{currentStatus[0].name}</NavLink>
				            		  </Button> 
				            		: <Button>{currentStatus[0].name}</Button> 
				            : null} size="small">*/}
				    <Card title="银行账户" size="small">
			        	<Form {...formItemLayout}>
							<FormItem label="开户行">
	                            <span className="ant-form-text">{accountInfo.openBankName}</span>
	                        </FormItem>
	                        <FormItem label="开户地区">
	                            <span className="ant-form-text">{accountInfo.provinceName}{accountInfo.cityName}</span>
	                        </FormItem>
	                        <FormItem label="卡类型">
	                            <span className="ant-form-text">{accountInfo.bankAccountType}</span>
	                        </FormItem>
	                        <FormItem label="开户支行">
	                            <span className="ant-form-text">{accountInfo.openSubBankName}</span>
	                        </FormItem>
	                         <FormItem label="开户名称">
	                            <span className="ant-form-text">{accountInfo.openName}</span>
	                        </FormItem>
	                        <FormItem label="账户号码">
	                            <span className="ant-form-text">{accountInfo.accountNo}</span>
	                        </FormItem>	
	                    </Form>
			        </Card>
			      </Col>	
			    </Row>
		    	<Row gutter={16} className= "middle">
		    		<Col span={8}>
				        <Card title="所属企业信息" size="small">
				        	<Form {...formItemLayout}>
		                        <FormItem label="公司名称">
		                            <span className="ant-form-text">小米金服</span>
		                        </FormItem>
		                        <FormItem label="授信额度(元)">
		                            <span className="ant-form-text">金融公司</span>
		                        </FormItem>
		                        <FormItem label="可用授信额度(元)">
		                            <span className="ant-form-text">金融公司</span>
		                        </FormItem>	                        
		                    </Form>
				        </Card>
				    </Col>     
			    </Row>		    			    
			    <Row gutter={16} className= "middle" type="flex" justify="space-between">
			      <Col span={24}>
			        <div className="picture-container">
				        <Card title="证件资料" size="small" extra={<Button onClick={this.download}>
				              	下载证件
				            </Button>}>
	                        <div className="list text1">
	                        	{
		                        	fileInfo && fileInfo.length > 0 ? this.showPic(fileInfo) : null			                        	
		                        }
	                        </div>                  
				        </Card>
				    </div>
			      </Col>				      
			    </Row>
			    <Row gutter={16} className= "middle" type="flex" justify="space-between">
			      <Col span={24}>
			        <Card title="审批记录" size="small">					  
			        		<Row >
			        			<Col span = {24}>
			        				<ul className = "text">
			        					{
			        						historyInfo.historyVos && historyInfo.historyVos.length > 0 ? historyInfo.historyVos.map((item, index) => 
			        							<li key = {index}>
			        								{item.time.substring(0, 10)}
			        								<span>{item.newStateAlias}</span>
			        							</li>) : null
			        					}
			        				</ul>
			        			</Col>
	                        </Row>
			        </Card>
			      </Col>				      
			    </Row>	
		        <Card size="small">					  
	        		<Row type="flex" justify="start">
	        			<Col span = {24}>
	        				<Form onSubmit={this.handleSubmit}>
						        {
						        	stateNum === true ? <Form.Item
							          label="审核意见"
							        >
							          {getFieldDecorator('action', {rules: [{
										    required: true, message: '请选择审核意见',
								        }]		                                    
		                                })(
							            <Radio.Group>
							              <Radio value="1">通过</Radio>
							              <Radio value="2">拒绝</Radio>							             
							            </Radio.Group>
							          )}
							        </Form.Item>
							        : null
						        }						        
						        <Form.Item
						          	label="授信额度（元）">
							        {
							         	getFieldDecorator('suggestedCredit', {
		                                    rules:[{required: true, message: '请输入授信额度'}, {pattern: /^\d{1,11}(\.\d{1,2})?$/, message:'纯数字、正数、小数点前最多11位、小数点后最多两位，金额大于0'}],
		                            		initialValue: historyInfo && historyInfo.relation ? historyInfo.relation.appliedCredit : ''
		                                })
	                                	(<InputNumber placeholder="请输入授信额度" className="remark"/>)
	                               }
                                
						        </Form.Item>
						        <Form.Item
						          label="选择利率"
						        >
						        {getFieldDecorator('interestMethod', {
						        	rules: [{required: true, message: '请选择利率'}],
						        	initialValue: historyInfo && historyInfo.relation ? historyInfo.relation.interestMethod + '' : ''				        		
						        })(
						            <Select className="remark" placeholder="请选择">
						            	<Option value="1">日利率</Option>
						              	<Option value="2">月利率</Option>
						            </Select>
						        )}
						        </Form.Item>
						        <Form.Item
						          label="融资比例（%）"
						        >
						          {getFieldDecorator('financingRatio', {
	                                    rules:[{required: true, message: '请输入融资比例'},{pattern: /^\d+$/, message:'请输入纯数字'}],
	                                    initialValue: historyInfo && historyInfo.relation ? historyInfo.relation.financingRatio : ''	                                    
	                                })(
						            <Input className="remark" placeholder="请输入融资比例"/>
						          )}
						        </Form.Item>
						        
					        	<FormItem label="备注">
		                            {
		                                getFieldDecorator('note', {
						        			initialValue: historyInfo && historyInfo.relation && !stateNum ? historyInfo.historyVos[historyInfo.historyVos.length-1].newStateAlias : ""					        			
		                                })
		                                (<TextArea className="textarea"/>)
		                            }
		                        </FormItem> 
		                        <Form.Item>
						          <Button htmlType="submit" className="btn" style = {{marginRight: '50px'}}>确认</Button>
						          <Button className="btn">
						          	<NavLink to="/customer/supplier">取消</NavLink>
						          </Button>
						        </Form.Item>
	        				</Form>	        				
	        			</Col>
                    </Row>
		        </Card>
			</div>			
        </Card>	
	    return (
	    	<div>{component}</div>
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
export default withRouter(connect(null, mapDispatchToProps)(Form.create()(Modify)))