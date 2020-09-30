import React, { Component } from 'react';
import { Col, Row, Card } from 'antd';
import RcTable from 'utils/table/index'
import Pagination from 'utils/pagination/pagination'
import request from 'utils/http'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import {fmtMoney} from 'utils/format'

class TransRecord extends Component {
	state = {
		list: [],
		total: 0,
		pageSize: 10,
		pageNum: 1
	}
	componentWillMount() {	
	  	this.props.getInfo()
	}
	componentDidMount() {
		this.getListData()
	}	
	getListData = async(params = {}) => {
		params["pageSize"] = this.state.pageSize;
		params["pageNum"] = this.state.pageNum;
		let response = await request({
			url: 'enterprise/transaction/history',
			method: 'get',
			params
		}).then(res => {
			if(res.code === 0) {
				let {total, list} = res.data;
				this.setState({	        	
		        	list,
		        	total
		        })
			}
		});
	}
	// 分页切换
    onPageNumChange(pageNum){		
       this.setState({
          pageNum
        }, () => {
            this.getListData();
        }) 
    }
  	render(){ 	
  		const {pageNum, total} = this.state;
  		const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                width: 100,
                render: (text, record, index) => `${index + 1}`                                    
            },{
                title: '交易时间',
                dataIndex: 'transactionDate',
                key: 'transactionDate',
                width: 200,
                render: (text, record, index) => text.substring(0, 10)
            }, {
                title: '交易流水号',
                dataIndex: 'transactionSerialNo',
                key: 'transactionSerialNo',
                width: 200
            }, {
                title: '付款方',
                dataIndex: 'payer',
                key: 'payer',
                width: 200
            },
            {
                title: '收款方',
                dataIndex: 'payee',
                key: 'payee',
                width: 200
            },
            {
                title: '交易金额（元）',
                dataIndex: 'amount',
                key: 'amount',
                width: 200,
                render: (text, record, index) => {                 
                    return text && fmtMoney(text)
                }
            },
            {
                title: '交易类型',
                dataIndex: 'typeAlias',
                key: 'typeAlias',
                width: 150
            },
            {
                title: '订单状态',
                dataIndex: 'statusAlias',
                key: 'statusAlias',
                width: 150
            },
            {
                title: '备注',
                dataIndex: 'note',
                key: 'note',
                width: 200
            }
        ];
	    return (<div className="contain-wrapper">           	
		        <Card title="交易记录">		        	
		            <Row type="flex" justify="center">		            	
            			<Col span = {24}>		                    
					      	<RcTable ref="rcTable" 
		       					rowKey={'id'}	
		       					dataSource={this.state.list}
		                    	columns={columns} 
		                    />
					      	
	                        <Pagination 
			                    current={pageNum}
			                    total={total} 
			                    onChange={pageNum => this.onPageNumChange(pageNum)}
		                    />
		            	</Col>
	            	</Row>
	            </Card>	            
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
export default connect(null, mapDispatchToProps)(TransRecord)