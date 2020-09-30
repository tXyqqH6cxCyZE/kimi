import React, {Component} from 'react'
import {Row, Col, Card, Form, Button, Input, InputNumber, Radio, message} from 'antd';
import request from 'utils/http'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import {fmtMoney} from 'utils/format'

const FormItem = Form.Item;
const { TextArea } = Input;

class Examine extends Component {
	state = {
		currentIndex: 0,
		category: null,
		basicInfo: {}
	}
	componentWillMount() {	
	  	this.props.getInfo()
	}
	componentDidMount() {
		this.getListData()
	}
	getListData = async() => {
		if(!this.props.location.query) {
			this.props.history.push('/account/more')
			return 
		}	
		else {
			let {upId, downId} = this.props.location.query.record;
			let category = this.props.location.query.category;
			await request({url: 'credit/toAudit', method: 'get', params: {
				upId,
				downId
			}}).then(res => {
				if(res.code === 0) {					
					this.setState({
						basicInfo: res.data,
						category
					})
				}
			});
			
		}
	}	
	handleSubmit = (e) => {
    	e.preventDefault();
    	let {upId, downId} = this.props.location.query.record;
    	this.props.form.validateFields((err, values) => {
	      if (!err) {
	      	let params = {}
	      	params['upEnterprise'] = upId;
	      	params['applyEnterprise'] = downId;
	      	params['note'] = values['note'];
	      	params['action'] = parseInt(values['action'], 10);
	      	if(values['suggestedCredit']) {
	      		params['suggestedCredit'] = values['suggestedCredit'];
	      	}
	      	if(values['note']) {
	      		params['note'] = values['note'];
	      	}
	        request({url: 'credit/audit', method: 'post', params: params}).then(res => {
				if(res.code === 0) {
					message.success(res.message)
					this.back()
				}
				else {
					message.error(res.message)
				}						
		    })
	      }      	  
	      
		})
    }	
	back = () => {
		this.props.history.go(-1)
	}
	render() {
		const formItemLayout = {
	      labelCol: { span: 3},
	      wrapperCol: { span: 10}
	    };
	    const { getFieldDecorator } = this.props.form;    
	    const {category, basicInfo} = this.state
	    const fsmState = this.props.location.query && this.props.location.query.fsmState;
		return (<div>
			<Row>
		      <Col span={24}>
		        <Card title='供应商授信审核' size="small">
		        	<Row>
		        		<Col>
					     	<Form {...formItemLayout}>				       
				                <FormItem label="授信企业" style = {{'marginBottom': 0}}>
		                            <span className="ant-form-text">{basicInfo.enterpriseName}</span>
		                        </FormItem>
		                        <FormItem label="授信申请额度(元)" style = {{'marginBottom': 0}}>
		                            <span className="ant-form-text">{basicInfo.appliedCredit && fmtMoney(basicInfo.appliedCredit)}</span>
		                        </FormItem>
		                        <FormItem label="其他" style = {{'marginBottom': 0}}>
		                            <span className="ant-form-text">{basicInfo.note}</span>
		                        </FormItem>			                                      
			               </Form>
			            </Col>
					</Row>		
					<Row gutter={16} className="middle">
				      <Col span={24}>
				        <Card title="审批记录" size="small">					  
			        		<Row >
			        			<Col span = {24}>
			        				<ul className = "text">
			        					{	
			        						basicInfo.historyList && basicInfo.historyList.length > 0 ? basicInfo.historyList.map((item, index) => 
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
			    	{
			    		category === 2 ? <Button onClick={this.back}  style = {{width: '150px'}}>返回</Button> : null
			    	}
			    	{
			    		(category === 1 || category === 3) ? <Row type="flex" justify="start">
	        			<Col span = {24}>
	        				<Form onSubmit={this.handleSubmit}>
	        					<Form.Item
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
						        {
						        	category === 3 && fsmState === 4 ?
							        	<FormItem label="建议授信额度（元）">
								            {getFieldDecorator('suggestedCredit', {
								            	initialValue: basicInfo.suggestedCredit})(
								              <InputNumber placeholder="请输入建议授信额度" className="remark"/>
								            )}
				                        </FormItem> 
			                        : null
						        }
				        		<FormItem label="备注">
		                            {
		                                getFieldDecorator('note')
		                                (<TextArea className="textarea"/>)
		                            }
		                        </FormItem>					        					                        					        	   
		                        <Form.Item>
						          <Button htmlType="submit" className ="btn" style = {{marginRight: '50px'}}>确认</Button>
						          <Button className ="btn" onClick={this.back}>取消</Button>
						        </Form.Item>
	        				</Form>	        				
	        			</Col>
	                </Row> : null
			    	}
				</Card>
			  </Col>
			</Row>
		</div>)
	}
}
const mapDispatchToProps = (dispatch) => {
	return {		
		getInfo(url) {
			dispatch(getUserInfo(url))
		}
	}
} 	
export default withRouter(connect(null, mapDispatchToProps)(Form.create()(Examine)))
						        