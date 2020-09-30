import React, { PureComponent } from 'react';
import {Row, Col, Button, Card, DatePicker} from 'antd';
import RcTable from 'utils/table/index'
import ExportJsonExcel from "js-export-excel"; 
import moment from 'moment'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'
import request from 'utils/http'

const {MonthPicker} = DatePicker;

class Download extends PureComponent {
	state = {
		list: [],
		month: null
	}	
	componentWillMount() {	
	  	this.props.getInfo()
	}
	componentDidMount() {
		this.getListData();
	}
    onPageNumChange(pageNum){		
       this.setState({
          pageNum
        }, () => {
            this.getListData();
        }) 
    }
	getListData = async () => {
		const {month} = this.state;
		let params = {}
		if(month) {
			params['targetMonth'] = month;
		}
        await request({url: 'kingmi/export', method: 'get', params}).then(res => {
        	if(res.code === 0) {
        		let fileList = [];
		        for(let i in res.data) {
		        	let obj = {}
		        	obj['month'] = i;
		        	obj['fileName'] = res.data[i]
		        	fileList.push(obj)
		        }
		        this.setState({
		        	list: fileList
		        })
        	}
        });
        
    }
	search = () => {
		this.setState({
        	list: []
        })
		const {month} = this.state;
		let params = {}
		if(month) {
			params['targetMonth'] = month;
		}
		request({url: 'kingmi/export', method: 'get', params}).then(res => {	
			if(res.code === 0 && Object.keys(res.data).length > 0) {
				let list = []
				for(let i in res.data) {
		        	let obj = {}
		        	obj['month'] = i;
		        	obj['fileName'] = res.data[i]
		        	list.push(obj)
		       }
				this.setState({
		        	list		        	
		        })
			}			
		})
	}
	downloadExcel = ({id}) => {
	    const { list } = this.state;
	    let option={};
	    let dataTable = [];
	    let currentList = []
	    list.forEach(item => {
    		for(let key in item) {
    			currentList = item[key]
    		}
    	})
	    if(currentList.length > 0) {
	    	currentList.forEach((item, index) => {
	    		let obj = {
	          		'序号': index + 1,
		            '粮票申请日期': item.createdDate.substring(0, 10),
		            '应付账款日期': item.dueDate.substring(0, 10),
		            '粮票号': item.id,
		            '供应商名称': item.holderEnterpriseName,
		            '粮票金额（元）': item.amount / 100
	          	}
	    		dataTable.push(obj);
	    	})
	    	
	    }
	    option.fileName = '粮票对账单'
	    option.datas=[
	      {
	        sheetData:dataTable,
	        sheetName:'sheet',	       
	        sheetHeader:['序号', '粮票申请日期', '应付账款日期', '粮票号', '供应商名称', '粮票金额（元）'],
	        columnWidths: ['3', '6', '6', '3', '7', '6']
	      }
	    ];
	
	    let toExcel = new ExportJsonExcel(option);
	    toExcel.saveExcel();
	 }
	onChange = date => {
		if(date) {
			let month = moment(date).format('YYYY-MM-DD');
			this.setState({month})
		}		
	}
  	render(){
  		const {list} = this.state;
  		let everyMonth;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                width: 200,
                render: (text, record, index) => `${index + 1}`
            }, {
                title: '月份',
                dataIndex: 'month',
                key: 'month',
                width: 200,
                render: text => text
            },{
                title: '文件名称',
                dataIndex: 'fileName',
                key: 'fileName',
                width: 200,
                render: (text, record, index) => record.month + '.xlsx'
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                width: 200,
                className: 'formatCenetr',
                render: (text, record, index) => {   
					return (<span>                                     	                		
                		<Button size="small" onClick={() => this.downloadExcel(record)}>下载</Button>
                    </span>)   
                }
            }
        ];
	    return (
	    	<div>
	    	 	<Card title="粮票对账单下载">
	            	<div className="wrapper">
	            		<Row>
	            			<Col span = {5} style={{marginRight: '1%'}}>
	            				<MonthPicker onChange={this.onChange} placeholder="请选择月份" />
	            			</Col>
	            			<Col span = {5}>
	            				<Button onClick = {this.search}>
						           	搜索
						        </Button>
	            			</Col>
	            		</Row>
					    <Row className="middle">				      
					      <Col span={24}>
					      	<RcTable 
	       					rowKey={'month'}
	       					dataSource={list}
	                    	columns={columns} />		                    		                       
	                       </Col>
				        </Row>
				    </div>  
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
export default connect(null, mapDispatchToProps)(Download)