import React, { Component } from 'react';
import {Row, Col, Card, Form, Button,Input, message, DatePicker, Icon} from 'antd';
import moment from 'moment'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import request from 'utils/http'
import {fmtMoney, formItemLayout, formatChinese} from 'utils/format'

const FormItem = Form.Item;
const { TextArea } = Input;

class Modify extends Component {
	state = {	
		splitKingmiVoList: [],
		basicInfo: {},
		originId: null,
		values: {},
		deleteId: null
	}
	componentWillMount() {	
	  	this.props.getInfo()
	}
	componentDidMount() {
		this.getBasicInfo()	
	}
	getBasicInfo = async() => {
		const {id} = this.props.match.params
		let originId;
		if(!this.props.location.query) {
			this.props.history.push('/transManage/index')
			return 
		}		
		else {
			originId = this.props.location.query.originId;
		}
		await request({url: 'kingmi/transfer/detail', method: 'get', params: {primaryKingmiId: id}}).then(res => {
			if(res.code === 0){
				let {primaryKingmiVo, splitKingmiVoList} = res.data;
				this.setState({
					basicInfo: primaryKingmiVo,
					splitKingmiVoList,
					originId
				})
			}
		})		
	}
	// 删除
	remove = (id) => {
		let {splitKingmiVoList} = this.state
	    let restList = splitKingmiVoList.filter(item => item.id !== id)
	    this.setState({
	    	splitKingmiVoList: restList,
	    	deleteId: id
	    })
	}
	submit = (user) => {
		request({url: 'kingmi/transfer/edit', method: 'post', params: user}).then(res => {
	 		if(res.code === 0) {
	 			message.success('修改成功');
	 			this.props.history.push('/transManage/index')
	 			this.props.form.resetFields()
	 		}else {
	 			message.error(res.message)
	 		}
		}).catch(err => {
			console.log(err)
		}) 
	}
	// 表单提交
	handleSubmit = (e) => {
      	e.preventDefault();
      	const {splitKingmiVoList,originId, deleteId} = this.state;
      	let list = splitKingmiVoList && splitKingmiVoList.filter(item => item.id === originId)
      	let enterpriseId = list && list.length > 0 ? list[0].holderEnterpriseId : deleteId;
      	if(deleteId) {
      		let {id} = this.props.match.params
      		let user = {}
      		user["kingmiId"] = parseInt(id, 10)
      		user['transfer[0].transferDate'] = '2019-01-01'
			user['transfer[0].kingmiId'] = parseInt(this.state.originId, 10);
			user['transfer[0].dueDate'] = '2019-01-01'
			user['transfer[0].amount'] = 0
			user['transfer[0].transferee'] = enterpriseId
			user['transfer[0].note'] = ''
			this.submit(user)
			return
      	}
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	      	const { names } = values;
	      	let {id} = this.props.match.params
			let transfer = names.map(item=>{
	            let json={}
	            json.transferDate = moment(item.transferDate).format('YYYY-MM-DD')
	            json.dueDate = moment(item.dueDate).format('YYYY-MM-DD')
	            json.transferId = parseInt(this.state.originId, 10);
	          	json.amount = parseFloat(`${item.amount}`, 10)
	          	json.transferee = parseInt(enterpriseId, 10)
	          	json.note = `${item.note}`
	            return json;
	      	});
			let user = {}
			user["kingmiId"] = parseInt(id, 10),
			transfer.forEach((item, index) => {	
				user['transfer['+ index +'].transferDate'] = item.transferDate
				user['transfer['+ index +'].kingmiId'] = item.transferId
				user['transfer['+ index +'].dueDate'] = item.dueDate
				user['transfer['+ index +'].amount'] = item.amount
				user['transfer['+ index +'].transferee'] = item.transferee
				user['transfer['+ index +'].note'] = item.note
			})
			this.submit(user)  
	      }
	   });
   	}
	
    
    getList = (arr) => {
    	const { getFieldDecorator } = this.props.form;
    	const {originId} = this.state;
    	return arr && arr.length > 0 ? arr.map((item, index) =>{
			return <Col span = {8} key ={item.id} style= {{marginTop: '20px'}}>
				<Card title={`转让单${index + 1}信息`} size="small">	
    				<Form {...formItemLayout}>
						<FormItem label="转让单单号">
	                        {
		                        getFieldDecorator(`names[${index}]kingmiHolder`, {			                           
		                            initialValue: item.id
		                        })
		                        (<Input disabled/>)
		                    }
	                    </FormItem>							                    
	                    <FormItem label="被转让方企业">
	                    	{
		                        getFieldDecorator(`names[${index}]transferee`, {			                           
		                            initialValue: item.holderEnterpriseName
		                        })
		                        (<Input disabled/>)
		                    }						                      
	                    </FormItem>
	                    <FormItem label="粮票转让金额（元）">
	                    	{
		                        getFieldDecorator(`names[${index}]amount`, {			                           
		                            initialValue: item.amount / 100
		                        })
		                        (<Input/>)
		                    }								                        
	                    </FormItem>
	                    <FormItem label="粮票转让日期">
	                   		{
		                        getFieldDecorator(`names[${index}]transferDate`, {			                           
		                            initialValue: item.createdDate.substring(0, 10)
		                        })
		                        (<Input disabled/>)
		                    }								                       
	                    </FormItem>
	                    <FormItem label="到期日">
	                        {
		                        getFieldDecorator(`names[${index}]dueDate`, {			                           
		                            initialValue: moment(item.dueDate, 'YYYY-MM-DD')
		                        })
		                        (<DatePicker />)
		                    }	
	                    </FormItem> 
	                    <FormItem label="审批记录">
	                        <span className="ant-form-text">
	                        	<ul className = "record">
		        					{	
		        						 item.fsmHistoryVoList.map((list, index) => 
		        							<li key = {index}>
		        								{list.time.substring(0, 10)}
		        								<span>{list.newStateAlias}</span>
		        							</li>)
		        					}
		        				</ul>
	                        </span>
	                    </FormItem>  	
	                    <FormItem label="备注">
	                        {
                                getFieldDecorator(`names[${index}]note`, {		                                    
                                    initialValue: item.note
                                })
                                (<TextArea/>)
                            }
	                    </FormItem> 
	                    
	                </Form>
	            </Card>
	            {
	            	item.id === originId ? <Icon
			            className="dynamic-delete-button"
			            type="minus-circle-o"
			            onClick={() => this.remove(item.id)}
			          />
			        : null
	            }
			</Col>  
		}) : null
    }
  	render(){
  		let component = null; 		
        const { getFieldDecorator } = this.props.form;
        const {basicInfo, splitKingmiVoList,originId} = this.state;
        let currentList = splitKingmiVoList.filter(item => item.id === originId)
	    component = <Card title="粮票转让信息">
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
		                        <span className="ant-form-text">是</span>
		                    </FormItem>
		                    <FormItem label="是否担保">
		                        <span className="ant-form-text">是</span>
		                    </FormItem>
		                     <FormItem label="是否转让">
		                        <span className="ant-form-text">是</span>
		                    </FormItem>  
		                    <FormItem label="备注">
		                        <span className="ant-form-text">{basicInfo.note}</span>
		                    </FormItem>  
		                </Form>
			        </Card>
			      </Col>				      
			    </Row>		  
        		<Row gutter={16} className= "middle">
        			{this.getList(currentList)}					        			
                </Row>	
                <Row>
                	<Button onClick = {this.handleSubmit} style = {{marginRight: '50px', width: '150px'}}>确认</Button>
			        <Button onClick={() => this.props.history.go(-1)}  style = {{width: '150px'}}>取消</Button>
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
export default withRouter(connect(null, mapDispatchToProps)(Form.create()(Modify)));