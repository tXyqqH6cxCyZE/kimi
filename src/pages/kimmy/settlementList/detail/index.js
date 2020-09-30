import React, { Component } from 'react';
import {Row, Col, Card, Button, Form} from 'antd';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import request from 'utils/http'
import {fmtMoney, formItemLayout, download, formatChinese, showPic, formatObj} from 'utils/format'

const FormItem = Form.Item;

class SettledDetail extends Component {
	state = {
		basicInfo: {},
		status: null
	}
	componentWillMount() {	
	  	this.props.getInfo()
	}
	componentDidMount() {
		this.getBasicInfo()	
	}
	getBasicInfo = async() => {
		const {id} = this.props.match.params;
		let status;
		if(!this.props.location.query) {
			this.props.history.push('/kimmy/settlement')
			return 
		}		
		else {
			status = this.props.location.query.status;
			this.setState({
				status
			})
		}
		await request({url: 'kingmi/detail', method: 'get', params: {kingmiId: id}}).then(res => {
			if(res.code === 0) {
				this.setState({
					basicInfo: res.data
				})	
			}
		})		
	}
	// 返回
	back =() => {
		this.props.history.go(-1);
	}
  	render(){
  		let component = null; 		
  		let {basicInfo, status} = this.state;
        let orderContract = formatObj(basicInfo.orderContract)
        let receipt = formatObj(basicInfo.receipt)
        let kingmiCertificate = formatObj(basicInfo.kingmiCertificate)
        let promiseToPay = formatObj(basicInfo.promiseToPay)
	    component = <Card title="粮票信息">
            <div className="wrapper">
			    <Row gutter={16}>			     
			      <Col span={8}>			      	
			        <Card title="粮票信息" size="small">
			        	<Form {...formItemLayout}>
							<FormItem label="粮票单号">
		                        <span className="ant-form-text">{basicInfo.id}</span>
		                    </FormItem>
		                    <FormItem label="提交角色">
		                        <span className="ant-form-text">业务岗</span>
		                    </FormItem>
		                    <FormItem label="粮票持有企业">
		                        <span className="ant-form-text">{basicInfo.holderEnterpriseName}</span>
		                    </FormItem>
		                    <FormItem label="粮票开立企业">
		                        <span className="ant-form-text">{basicInfo.openEnterpriseName}</span>
		                    </FormItem>
		                    <FormItem label="粮票金额（元）">
		                        <span className="ant-form-text">{basicInfo.amount && fmtMoney(basicInfo.amount)}</span>
		                    </FormItem>  
		                    <FormItem label="开立日期">
		                        <span className="ant-form-text">{basicInfo.createdDate && basicInfo.createdDate.substring(0, 10)}</span>
		                    </FormItem>
		                    <FormItem label="到期日">
		                        <span className="ant-form-text">{basicInfo.dueDate && basicInfo.dueDate.substring(0, 10)}</span>
		                    </FormItem>
		                    <FormItem label="是否延期">
		                        <span className="ant-form-text">{formatChinese(basicInfo.ifDelay)}</span>
		                    </FormItem>
		                    <FormItem label="是否担保">
		                        <span className="ant-form-text">{formatChinese(basicInfo.ifGuarantee)}</span>
		                    </FormItem>
		                     <FormItem label="是否转让">
		                        <span className="ant-form-text">{formatChinese(basicInfo.ifTransfer)}</span>
		                    </FormItem>  
		                    <FormItem label="备注">
		                        <span className="ant-form-text">{basicInfo.note}</span>
		                    </FormItem>  
		                </Form>
			        </Card>
			      </Col>	
			      <Col span={8}>			      	
			        <Card title="粮票结算信息" size="small">
			        	<Form {...formItemLayout}>
							<FormItem label="结算状态">
		                        <span className="ant-form-text">{status}</span>
		                    </FormItem>
		                    <FormItem label="结算金额(元)">
		                        <span className="ant-form-text">{basicInfo.overduePenalty ? (basicInfo.amount + basicInfo.overduePenalty) / 100 : basicInfo.amount / 100}</span>
		                    </FormItem>
		                    <FormItem label="应付账款日期">
		                        <span className="ant-form-text">{basicInfo.dueDate && basicInfo.dueDate.substring(0, 10)}</span>
		                    </FormItem>		                    
		                </Form>
			        </Card>
			      </Col>	
			      
			    </Row>
			    <Row gutter={16} className= "middle">
			      <Col span={8}>
					        <div className="picture-container">
						        <Card title="证件资料" size="small">
									<div className="title">
										<h3>订单合同</h3>
							            <Button onClick={() => download(basicInfo.orderContractFileId)}>
							              	下载证件
							            </Button>
			                        </div> 	
			                        <div className="list text1">		                        
				                        {				                        					                        	
			        						showPic(orderContract)
				                        }
			                        </div>
			                        <div className="title">
			                        	<h3>付款承诺函</h3>
			                            {
			                            	promiseToPay && promiseToPay.length > 0 ? <Button onClick={() => download(basicInfo.promiseToPayFileId)}>
												              	下载证件
												            </Button> :null
			                            }						        
			                        </div> 
			                        <div className="list text1">
				                        {
				                        	showPic(promiseToPay)				                        	
				                        }
		                            </div>
		                            <div className="title">
		                            	<h3>发票</h3>							            
							            {
		                            		receipt && receipt.length > 0 ? <Button onClick={() => download(basicInfo.receiptFileId)}>
								              	下载证件
								            </Button>
								            : null
		                            	}
			                        </div> 
			                        <div className="list text1">
				                        {
				                        	showPic(receipt)						                        	
				                        }
			                        </div>
		                            
						        </Card>
						    </div>
					      </Col>	
			      <Col span={8}>
			      	<div className="picture-container">
				        <Card title="粮票凭证资料" size="small" extra={
				        	kingmiCertificate && kingmiCertificate.length > 0 ? <Button onClick={() => download(basicInfo.kingmiCertificateFileId)}>
				              	下载证件
				            </Button> 
				            : null}>
				        	<div className="list text1">
	                        	{
		                        	showPic(kingmiCertificate)				                        	
		                        }
	                        </div>                  
				        </Card>
				    </div>
			      </Col>      
			    </Row>	
			    <Row gutter={16} className= "middle">
			    	<Col span ={8}>
		        		<Button style = {{width: '150px'}} onClick = {this.back}>返回</Button>
		        	</Col>
		        </Row>
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
export default withRouter(connect(null, mapDispatchToProps)(Form.create()(SettledDetail)))