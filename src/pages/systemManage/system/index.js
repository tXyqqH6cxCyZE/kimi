import React, { Component } from 'react';
import {Row, Col, Button, Card, Modal, message} from 'antd';
import { withRouter } from 'react-router-dom'
import RcTable from 'utils/table/index'
import Pagination from 'utils/pagination/pagination'
import {connect} from 'react-redux'
import {USER_TYPE, ENTERPRISE_EMPLOYEE_ROLE, SETTING_STATUS} from 'store/actionTypes'
import {format, getSelectOption} from 'utils/format'
import {getUserInfo} from 'store/actionCreators'
import request from 'utils/http'


class Info extends Component {
	state = {
		pageSize: 10,
		pageNum: 1,
		list: [],
		total: 0,
		modelVisible: false,
		id: null,
		confrimTips: '',
		status: ''
	}
	componentWillMount() {	
	  	this.props.getInfo(window.location.hash)
	}
	componentDidMount() {
		this.getListData()
	}	
	onPageNumChange(pageNum) {
		this.setState({
			pageNum
		}, () => {
			this.getListData()
		})
	}
	// 查看详情
	detail(record) {
		this.props.history.push(`/system/userDetail/${record.id}`)
	}
	edit(record) {
		this.props.history.push(`/system/userEdit/${record.id}`)
	}
	
	forbidden(e, id, status) {
		let newStatus = status === 1 ? 2 : 1,
            confrimTips = status === 1
                ? '确认禁用该用户吗？' : '确认启用该用户吗？';
                
		this.setState({
			modelVisible: true,
			confrimTips,
			id,
			status: newStatus
		})
		
	}
	okHander =() => {
		const {status, id} = this.state;
		let values = {settingStatus: status}
		request({url: `user/setting/status/${id}`, method: 'put', params: values}).then(res => {
			if(res.code === 0) {
				message.success('变更成功')
				this.hideModel()
				this.getListData()
			}
			else {
				message.error(res.message)
			}			
		})   	
	}
    hideModel = () => {
    	this.setState({
	        modelVisible: false
	    })
    }
	getListData = async(params = {}) => {
		params["pageSize"] = this.state.pageSize;
		params["pageNum"] = this.state.pageNum;
        params = Object.assign({}, params)
		let res = await request({url: 'user/all', method: 'get', params}).then(res => {
			if(res.code === 0) {
				this.setState({
					list: res.data.list,
					total: res.data.total
				})
			}
		})
	}
  	render(){
  		const {userTypeList, userRoleList,userStatusList} = this.props;
  		const {modelVisible, confrimTips} = this.state;
  		const userType = getSelectOption(userTypeList);
	    const userRole = getSelectOption(userRoleList);
	    const userStatus = getSelectOption(userStatusList);
	    
  		const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: 80
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 150,
                render: (text, record, index) => {
	                return text.substring(0,10)
	            } 
            },{
                title: '登录账号',
                dataIndex: 'ucenterAccountNo',
                key: 'ucenterAccountNo',
                width: 150
            },{
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: 350
            },{
                title: '角色类型',
                dataIndex: 'type',
                key: 'type',
                width: 200,
                render: (text, record, index) => {
                    userType && userType.forEach(function (val) {
                        if (val.props.value == text) {
                            text = val.props.children;
                        }
                    });
                    return text;
                }
            },{
                title: '角色名称',
                dataIndex: 'role',
                key: 'role',
                width: 150,
                render: (text, record, index) => {
                    userRole && userRole.forEach(function (val) {
                        if (val.props.value == text) {
                            text = val.props.children;
                        }
                    });
                    return text;
                }
            },{
                title: '手机号',
                dataIndex: 'tel',
                key: 'tel',
                width: 200
            },{
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                width: 200
            },{
                title: '创建人',
                dataIndex: 'creator',
                key: 'creator',
                width: 100
            },{
                title: '状态',
                dataIndex: 'settingStatus',
                key: 'settingStatus',
                width: 100,
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
                width: 300,
                render: (text, record, index) => {  
                    return <span>                      
                        <Button className = "operate" size="small" onClick={this.detail.bind(this, record)}>查看</Button>
                        <Button className = "operate" size="small" onClick={this.edit.bind(this, record)}>编辑</Button>
                        <Button className = "operate" size="small" onClick={(e) => this.forbidden(e, record.id, record.settingStatus)}>{record.settingStatus === 1 ? '禁用': '启用'}</Button>                  
                    </span> ;                  
                }
            }
        ];
	    return (
	    	<div>
		    	<Row>
			      <Col span={24}>
			        <Card title='用户管理' size="small">
			        	<Row>
					      <Button onClick = {() => this.props.history.push("/system/addUser")}>
					      	新增用户
					      </Button>
						</Row>
						<Row>
					      <Col span={24}>				      							    
					      	<RcTable 
	       					rowKey={'id'}
	       					scrollWidthX={1700}
	       					dataSource={this.state.list}
	                    	columns={columns} />
					      	
	                        <Pagination 
			                current={this.state.pageNum}
			                total={this.state.total} 
			                onChange={pageNum => this.onPageNumChange(pageNum)}/>								    
					      </Col>
					    </Row>
					</Card>
				  </Col>
				</Row>
	            <Modal title={'提示'}
                    maskClosable={false} visible={modelVisible} width={400}                                               
                    centered
                    onOk={this.okHander} onCancel={this.hideModel}
					>
					<p>{confrimTips}</p>
	            </Modal>	            
		   	</div>
	    );
	}
}



const mapStateToProps = (state) => {
	return {
		userTypeList: format(state.reducer.get('list').toJS(), USER_TYPE),
		userRoleList: format(state.reducer.get('list').toJS(), ENTERPRISE_EMPLOYEE_ROLE),
		userStatusList: format(state.reducer.get('list').toJS(), SETTING_STATUS)
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

export default class System extends Component {
	render() {
		return (<div>
			<CustomInfo/>
		</div>)
	}
	
}