import React, {Component} from 'react'
import SearchForm from './searchForm.js';
import {withRouter} from 'react-router-dom'
import request from 'utils/http'
import RcTable from 'utils/table/index'
import Pagination from 'utils/pagination/pagination'
import {Row, Col, Button, Card, Tabs, message} from 'antd';
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import {fmtMoney} from 'utils/format'

const TabPane = Tabs.TabPane;

class Supplier extends Component {
	state = {
		pageSize: 10,
		pageNum: 1,
		list: [],
		total: 0,		
		id: 0,
		status: '-100',
		activeKey: '1',
		statusList: ['待修改', '待初审', '待复审', '待平台初审', '待平台复审'],
		tabs: []
	}	
	componentWillMount() {	
	  	this.props.getInfo(window.location.hash)
	}
	componentDidMount() {	
		this.getTabs()
		this.getListData();		
	}
	getTabs = async() => {
		await request({url: 'register/supplier/toList', method: 'get'}).then(res => {
			if(res.code === 0) {
				this.setState({
					tabs: res.data
				})
			}
		})	
	}
	getListData = async (params = {}) => {   
		const {pageSize, pageNum, tabs, activeKey} = this.state
        params["pageSize"] = pageSize;
		params["pageNum"] = pageNum;
		params["tab"] = activeKey;
        params = Object.assign({},params, this.searchForm.props.form.getFieldsValue());
        for(let i in params) {
        	if(typeof params[i] === 'undefined') {
        		delete params[i]
        	}
        }
        const rangeValue = this.searchForm.props.form.getFieldsValue();
        if(rangeValue.distrDt != undefined && rangeValue.distrDt.length == 2) {
            params["startDate"] =rangeValue.distrDt[0].format('YYYY-MM-DD');
            params["endDate"] = rangeValue.distrDt[1].format('YYYY-MM-DD');
        } 
        params['enterpriseCategory'] = 2;
        
        delete params.distrDt;
        await request({url: 'register/supplier/list', method: 'get', params}).then(res => {
        	if(res.code === 0) {
        		let {total, list} = res.data;
	        	this.setState({
	      			list,
	      			total
	        	})
        	}
        });
    }
	//更改状态
    onDeleteDict(id, status) {
    	this.setState({
			modalVisible: true,
			id, 
			status
		})
    }
    //tab页面切换
	tabChange = (key) => {	
		this.setState({
			activeKey: key,
			pageNum: 1,
			list: []
		}, () => {
			this.getListData();
		})		
	}
    // 分页切换
    onPageNumChange(pageNum){		
       this.setState({
          pageNum
        }, () => {
            this.getListData();
        }) 
    }
    //更改状态
    onDeleteDict(id, status) {  
    	let _this = this;
		this.setState({
			modelVisible: true,
			id,
			status
		},() => {
			let values = {
				enterpriseId: this.state.id,
				toStatus: this.state.status
			}
			request({url: 'register/status', method: 'put', params: values}).then(res => {
				if(res.code === 0) {
					message.success('变更成功')
					this.getListData()
				}
				else {
					message.error(res.message)
				}				
			})
		})		
    }
    showDetail = (record) => {
		this.props.history.push({
			pathname:`/customer/examine/${record.enterpriseId}`,
			query: { 
				stateNum: record.currentState   //根据这个修改供应商入网审核的流程
			}
		})
	}
    showModify = (record, flag) => {
		this.props.history.push({
			pathname:`/customer/modify/${record.enterpriseId}`,
			query: { 
				stateNum: flag
			}
		})
	}
    
	render() {   
		const {statusList, activeKey, tabs, list} = this.state;
		const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                width: 250,
                render: (text, record, index) => {
                    return index + 1
                }
            }, {
                title: '机构编号',
                dataIndex: 'enterpriseId',
                key: 'enterpriseId',
                width: 250
            },{
                title: '机构名称',
                dataIndex: 'enterpriseName',
                key: 'enterpriseName',
                width: 250
            },{
                title: '营业执照号',
                dataIndex: 'registerMark',
                key: 'registerMark',
                width: 250
            },{
                title: '入网日期',
                dataIndex: 'date',
                key: 'date',
                width: 250,
                render:(text) => { 
                	return text.substring(0, 10)
                }
            },{
                title: '授信额度（元）',
                dataIndex: 'approvedCredit',
                key: 'approvedCredit',
                width: 250,
                render: (text) => {
                	return text && fmtMoney(text)
                }
            },{
                title: '状态',
                dataIndex: 'currentState',
                key: 'currentState',
                width: 250,
                render: (text, record, index) => {
            		if(text === 100) {
                		return '审核通过'
                	}else if (text === 99) {
                		return '申请被拒绝'
                	}
                	else {
                		return statusList[text - 1]
                	}
                }             
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                width: 300,
                render: (text, record, index) => {   
					return (<div>                      
                        	{activeKey === '1' 
                        		? (record.status === 4 ? <Button size="small" onClick = {() => this.showModify(record, true)}>
                        			修改
                        		  </Button>
                        		  : <Button size="small" onClick = {() => this.showDetail(record)}>
                        			审核
                        		  </Button>)
                        		: activeKey === '2' 
                    		  ? <Button size="small" onClick = {() => this.props.history.push(`/customer/info1/${record.enterpriseId}`)}>
				                 	详情
				                </Button>
			                  : <div className="operate-wrapper">
		                        	{record.status === 1 ? 
		                        		(<div>
			                        		<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 2)}>
				                        		设为异常
				                        	</Button>
				                        	<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 3)}>
				                        		设为关注
				                        	</Button>
				                        	<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 4)}>
				                        		设为终止
				                        	</Button>
				                        	<Button size="small" onClick = {() => this.showModify(record, false)}>
			                        			修改
			                        		</Button>
			                        	</div>)
		                        	: record.status === 2
		                        		? (<div>
			                        		<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 1)}>
				                        		设为正常
				                        	</Button>
				                        	<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 3)}>
				                        		设为关注
				                        	</Button>
				                        	<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 4)}>
				                        		设为终止
				                        	</Button>
				                        </div>)
		                        		: record.status === 3
		                        		  ? (<div>
			                        		<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 1)}>
				                        		设为正常
				                        	</Button>
				                        	<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 2)}>
				                        		设为异常
				                        	</Button>
				                        	<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 4)}>
				                        		设为终止
				                        	</Button>
				                       	</div>)
		                        		  : (<div>
			                        		<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 1)}>
				                        		设为正常
				                        	</Button>
				                        	<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 2)}>
				                        		设为异常
				                        	</Button>
				                        	<Button size="small" onClick = {() => this.onDeleteDict(record.enterpriseId, 3)}>
				                        		设为关注
				                        	</Button>
				                       	</div>)
		                        	}                        
		                        </div> 
				           }
                    </div>) ;  
                }

            }
        ];
		return (
	    	<Row type="flex" justify="start">		
	    	 	<Col span={24}>
		        	<Card title='供应商管理' size="small">		           
					   <SearchForm wrappedComponentRef={form=>{this.searchForm = form}} sta= {this.state} setState={this.setState.bind(this)} getListData={this.getListData}/> 				    
					   <Tabs type="card" activeKey={activeKey} onChange = {this.tabChange} style = {{marginTop: '10px'}}>
					      {tabs.map(item =>
					      	<TabPane tab={item.name} key={item.id}>	
					      		<RcTable
                                    scrollWidthX={1200}
									rowKey={'enterpriseId'}  					
									dataSource={list}
					        		columns={columns} 
					        	/>	
					      	</TabPane>)					      
					      }
					    </Tabs>										   				   
				   		{
				   			tabs.length > 0 ? <Pagination
			                current={this.state.pageNum}
			                total={this.state.total} 
			                onChange={pageNum => this.onPageNumChange(pageNum)}/> : null
				   		}
					</Card>	
				</Col>
			</Row>				         
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

export default withRouter(connect(null, mapDispatchToProps)(Supplier));
