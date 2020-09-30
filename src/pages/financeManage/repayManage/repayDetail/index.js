import React, {Component} from 'react';
import RcTable from 'utils/table/index'
import {Row, Col, Button, Card, Form} from 'antd';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import request from 'utils/http'
import {fmtMoney} from 'utils/format'

const FormItem = Form.Item;

class RepayDetail extends React.Component {
	state = {
		basicInfo: {},
		list: []
	}
	componentWillMount() {	
	  	this.props.getInfo()
	}
	componentDidMount() {
		this.getListData();
	}
	getListData = async() => {
		const {id} = this.props.match.params;
		let obj = {};
		await request({url: 'kingmi/financing/detail', method: 'get', params: {financingId: id}}).then(res => {
			if(res.code === 0) {
				let basicInfo = res.data;
				obj['id'] = basicInfo['id']
				obj['dueDate'] = basicInfo['dueDate']
				obj['soaDate'] = basicInfo['soaDate']
				obj['principal'] = basicInfo['principal']
				obj['dueInterest'] = basicInfo['dueInterest']
				obj['actualRepayInterest'] = basicInfo['actualRepayInterest']
				obj['overduePenalty'] = basicInfo['overduePenalty']
				obj['overdueDays'] = basicInfo['overdueDays']
				obj['kingmiVo.note'] = basicInfo['kingmiVo.note']
				this.setState({
					basicInfo,
					list: [...this.state.list, obj]
				})
			}
		})
	}
	
	render() {
		const {basicInfo, list} = this.state;
		const columns = [
            {
                title: '应还款日',
                dataIndex: 'dueDate',
                key: 'dueDate',
                width: 150,
                render: (text, record, index) => {
                    return text && text.substring(0, 10);
                }
            }, {
                title: '实际还款日',
                dataIndex: 'soaDate',
                key: 'soaDate',
                width: 150,
                render: (text, record, index) => {
                    return text && text.substring(0, 10);
                }
            },{
                title: '应还金额（元）',
                dataIndex: 'principal',
                key: 'principal',
                width:150,
                render: (text, record, index) => {
                    return text && fmtMoney(text);
                }
                
            },{
                title: '应还利息（元）',
                dataIndex: 'dueInterest',
                key: 'dueInterest',
                width: 150
            },{
                title: '实际还款金额（元）',
                dataIndex: 'actualRepayInterest',
                key: 'actualRepayInterest',
                width: 150,
                render: (text, record, index) => {
                    return fmtMoney(record.principal + record.actualRepayInterest)
                }
            },{
                title: '逾期罚息（元）',
                dataIndex: 'overduePenalty',
                key: 'overduePenalty',
                width: 150
            },{
                title: '逾期天数（天）',
                dataIndex: 'overdueDays',
                key: 'overdueDays',
                width: 150
            },{
                title: '备注',
                dataIndex: 'kingmiVo.note',
                key: 'kingmiVo.note',
                width: 200
            }
        ];
		return (
        	<Row type="flex" justify="start">	
	    		<Col span={24}>
			        <Card title='还款管理' size="small">
			        	<Col>
			        		<Card title="融资单信息" size="small">
					        	<Form layout="inline">
									<FormItem label="融资单单号">
				                        <span className="ant-form-text">{basicInfo.id}</span>
				                    </FormItem>
				                    <FormItem label="供应商名称">
				                        <span className="ant-form-text">{basicInfo.kingmiVo && basicInfo.kingmiVo.holderEnterpriseName}</span>
				                    </FormItem>
				                    <FormItem label="核心企业名称">
				                        <span className="ant-form-text">{basicInfo.kingmiVo && basicInfo.kingmiVo.openEnterpriseName}</span>
				                    </FormItem>
				                    <FormItem label="放款金额（元）">
				                        <span className="ant-form-text">{basicInfo.approvedAmount && fmtMoney(basicInfo.approvedAmount)}</span>
				                    </FormItem>
				                     <FormItem label="利息（元）">
				                        <span className="ant-form-text">{basicInfo.dueInterest}</span>
				                    </FormItem> 
				                </Form>
					        </Card>
			        	</Col>
			            <Col>
						   <RcTable 
							rowKey={'id'}  					
							dataSource={list}
			            	columns={columns} />									   
					   </Col>					   
					</Card>
			   		<Button className= "btn top" onClick = {() => this.props.history.goBack()}>
			   			返回
			   		</Button>
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
export default withRouter(connect(null, mapDispatchToProps)(RepayDetail))
