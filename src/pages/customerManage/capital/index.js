import React, {Component} from 'react'
import SearchForm from '../supplier/searchForm';
import RcTable from 'utils/table/index'
import Pagination from 'utils/pagination/pagination'
import {withRouter} from 'react-router-dom'
import {Row, Col, Button, Card, message} from 'antd';
import {connect} from 'react-redux'
import request from 'utils/http'
import {getUserInfo} from 'store/actionCreators'
import {ENTERPRISE_STATUS} from 'store/actionTypes'
import {format, getSelectOption} from 'utils/format'

class Info extends Component {
	state = {
		pageSize: 10,
		pageNum: 1,
		list: [],
		total: 0,
		id: 0,
		status: 0		
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
        params['enterpriseCategory'] = 3;
        
        delete params.distrDt;
        await request({url: 'register/list', method: 'get', params}).then(res => {
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
    // 粮票查看详情
	showDetail(record) {
		this.props.history.push(`/customer/info/${record.enterpriseId}`)
	}
	// 分页切换
    onPageNumChange(pageNum){		
       this.setState({
          pageNum
        }, () => {
            this.getListData();
        }) 
    }
	render() {
		const {userStatusList} = this.props;
	    const userStatus = getSelectOption(userStatusList);
		const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                width: 150,
                render: (text, record, index) => {
                    return index + 1
                }
            }, {
                title: '机构编号',
                dataIndex: 'enterpriseId',
                key: 'enterpriseId',
                width: 200
            },{
                title: '机构名称',
                dataIndex: 'enterpriseName',
                key: 'enterpriseName',
                width: 200
            },{
                title: '营业执照号',
                dataIndex: 'registerMark',
                key: 'registerMark',
                width: 150
            },{
                title: '入网日期',
                dataIndex: 'date',
                key: 'date',
                width: 200,
                render:(text) => { 
                	return text.substring(0, 10)
                }
            },{
                title: '授信额度（元）',
                dataIndex: 'credit',
                key: 'credit',
                width: 200
            },{
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 200,
                render: (text, record, index) => {
                    userStatus && userStatus.forEach(function (val) {
                        if (val.props.value == text) {
                            text = val.props.children;
                        }
                    });
                    return text;
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                width: 550,
                render: (text, record, index) => {                  	
					return (
                        <div className="operate-wrapper">
                        	<Button className = "operate" size="small" onClick={this.showDetail.bind(this, record)}>详情</Button> 
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
                   )
                }
            }
        ];
		return (
	    	<Row type="flex" justify="start">
		       <Col span={24}>
		         <Card title='资金方管理' size="small">
				   <SearchForm wrappedComponentRef={form=>{this.searchForm = form}} sta= {this.state} setState={this.setState.bind(this)} getListData={this.getListData}/>   
				   <Button style = {{marginTop: '10px', marginBottom: '10px'}} onClick = {() => this.props.history.push('/customer/addcapital')}>
				   		新增资金方
				   	</Button>
				   <RcTable 
   					rowKey={'enterpriseId'}  					
   					dataSource={this.state.list}
                	columns={columns} />
				   
				   <Pagination 
	                current={this.state.pageNum}
	                total={this.state.total} 
	                onChange={pageNum => this.onPageNumChange(pageNum)}/>	
				 </Card>
			  </Col>			    
			</Row>				         
	    );
	}
}

const mapStateToProps = (state) => {
	return {
		userStatusList: format(state.reducer.get('list').toJS(), ENTERPRISE_STATUS)
	}	
};
const mapDispatchToProps = (dispatch) => {
	return {		
		getInfo(url) {
			dispatch(getUserInfo(url))
		}
	}
}
let CustomInfo = withRouter(connect(mapStateToProps, mapDispatchToProps)(Info))

export default () => <CustomInfo/>
