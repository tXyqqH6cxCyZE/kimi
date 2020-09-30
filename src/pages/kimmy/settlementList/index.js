import React, {Component} from 'react'
import {Row, Col, Card, Tabs, Button} from 'antd';
import {withRouter} from 'react-router-dom'
import SearchForm from './searchForm.js';
import Pagination from 'utils/pagination/pagination'
import RcTable from 'utils/table/index'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import request from 'utils/http'
import {fmtMoney} from 'utils/format'


const TabPane = Tabs.TabPane;

class SettlementList extends Component {
	constructor(props) {
		super(props)
		this.state = {	
			pageNum: 1,
			pageSize: 10,
			list: [],
			total: 0,		
			activeKey: '10',
			tabs: [{id: '10', description: "未结算"},{id: '11', description: "已结算"},{id: '12', description: "已过期"}]
		}
	}
	componentWillMount() {	
	  	this.props.getInfo()
	}
	componentDidMount() {
		this.getListData();
	}
	getListData = async (params = {}) => {       
        params["pageSize"] = this.state.pageSize;
		params["pageNum"] = this.state.pageNum;
		params["filterType"] = parseInt(this.state.activeKey, 10);
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
        
        delete params.distrDt;
        let response = await request({url: 'kingmi/list', method: 'get', params}).then(res => {
        	if(res.code === 0) {
        		let {total, list} = res.data;
	        	this.setState({
	      			list,
	      			total
	        	})
        	}
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
    showDetail(record) {
    	this.props.history.push({
			pathname:`/kimmy/settled/detail/${record.id}`,
			query: { 
				status: record.soaDate 
					? '已结算' 
					: this.state.activeKey ==='12'
						? '已过期'
                		: '未结算'
			}
		})
    }
    
	render() {  
		const {activeKey, pageNum, tabs, list, total} = this.state;
		const columns = activeKey === '11' ? [
			
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                width: 80,
                render: (text, record, index) => `${index + 1}`                                    
            }, {
                title: '结算日期',
                dataIndex: 'soaDate',
                key: 'soaDate',
                width: 150,
                render: (text, record, index) => {
                    return text && text.substring(0, 10);
                }
            },{
                title: '到期日',
                dataIndex: 'dueDate',
                key: 'dueDate',
                width: 150,
                render: (text, record, index) => {
                    return text && text.substring(0, 10);
                }
                
            },{
                title: '粮票单号',
                dataIndex: 'id',
                key: 'id',
                width: 150
            },{
                title: '结算金额(元)',
                dataIndex: 'businessNumber',
                key: 'businessNumber',
                width: 200,
                render: (text, record, index) => {
                    return record.overduePenalty ? fmtMoney(record.amount + record.overduePenalty) : fmtMoney(record.amount);
                }
            },{
                title: '粮票金额(元)',
                dataIndex: 'amount',
                key: 'amount',
                width: 250,
                render: text => text && fmtMoney(text)
            },{
                title: '粮票持有企业',
                dataIndex: 'holderEnterpriseName',
                key: 'holderEnterpriseName',
                width: 200
            },{
                title: '开立企业',
                dataIndex: 'openEnterpriseName',
                key: 'openEnterpriseName',
                width: 200
            },{
                title: '状态',
                dataIndex: 'currentState',
                key: 'currentState',
                width: 150,
                render: (text, record, index) => {
                	if(record.soaDate) {
                		return '已结算'
                	}else if(activeKey ==='12'){
                		return '已过期'
                	}   
                	else {
                		return '未结算'
                	}
                }
            },
            {
                title: '区块链交易ID尾号',
                dataIndex: 'txId',
                key: 'txId',
                width: 130,
                render: text => text ? text.slice(-16) : "--"
           	},
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                width:230,
                className: 'formatCenetr',
                render: (text, record, index) => {   
					return (<span>                                     	                		
                		 <Button size="small" onClick = {() => this.showDetail(record)}>
                			详情
                		 </Button>
                    </span>)   
                }
            }
        ] : [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                width: 80,
                render: (text, record, index) => `${index + 1}`                                    
            }, {
                title: '结算日期',
                dataIndex: 'soaDate',
                key: 'soaDate',
                width: 150,
                render: (text, record, index) => {
                    return text && text.substring(0, 10);
                }
            },{
                title: '到期日',
                dataIndex: 'dueDate',
                key: 'dueDate',
                width: 150,
                render: (text, record, index) => {
                    return text && text.substring(0, 10);
                }
                
            },{
                title: '粮票单号',
                dataIndex: 'id',
                key: 'id',
                width: 150
            },{
                title: '结算金额(元)',
                dataIndex: 'businessNumber',
                key: 'businessNumber',
                width: 200,
                render: (text, record, index) => {
                    return record.overduePenalty ? fmtMoney(record.amount + record.overduePenalty) : fmtMoney(record.amount);
                }
            },{
                title: '粮票金额(元)',
                dataIndex: 'amount',
                key: 'amount',
                width: 250,
                render: text => text && fmtMoney(text)
            },{
                title: '粮票持有企业',
                dataIndex: 'holderEnterpriseName',
                key: 'holderEnterpriseName',
                width: 200
            },{
                title: '开立企业',
                dataIndex: 'openEnterpriseName',
                key: 'openEnterpriseName',
                width: 200
            },{
                title: '状态',
                dataIndex: 'currentState',
                key: 'currentState',
                width: 150,
                render: (text, record, index) => {
                	if(record.soaDate) {
                		return '已结算'
                	}else if(activeKey ==='12'){
                		return '已过期'
                	}   
                	else {
                		return '未结算'
                	}
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                width:230,
                className: 'formatCenetr',
                render: (text, record, index) => {   
					return (<span>                                     	                		
                		 <Button size="small" onClick = {() => this.showDetail(record)}>
                			详情
                		 </Button>
                    </span>)   
                }
            }
        ];
		return (
	    	<Row type="flex" justify="start">	
	    	<Col span={24}>
		        <Card title='粮票结算' size="small">
		            <Col>
					   <SearchForm wrappedComponentRef={form=>{this.searchForm = form}} sta= {this.state} setState={this.setState.bind(this)}getListData={this.getListData.bind(this)}/> 
				    </Col>
				    <Col>
					   <Tabs type="card" activeKey={activeKey} onChange = {this.tabChange} style = {{marginTop: '10px'}}>
					      {tabs.map(item =>
					      	<TabPane tab={item.description} key={item.id}>	
					      		<RcTable 
								rowKey={'id'}  					
								dataSource={list}
	            				columns={columns} />		
					      	</TabPane>)					      
					      }
					    </Tabs>										   
				   </Col>
				   <Col>
				   		<Pagination 
	                    current={pageNum}
	                    total={total} 
	                    onChange={pageNum => this.onPageNumChange(pageNum)}/>
				   </Col>
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
export default withRouter(connect(null, mapDispatchToProps)(SettlementList));
