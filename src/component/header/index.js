import {Row, Col, Icon, Dropdown, Menu} from "antd"
import React from 'react'
import UpdateLoginPassword from './updateLoginPassword.js';
import path from 'config/pathConfig';
import request from 'utils/http'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'

class MyHeader extends React.Component{
    state={
    	LoginPassword: false, //修改登陆密码弹框
    	title: null
    }
    updateLoginPassword(title) {
    	this.setState({
	      LoginPassword: true,
	      title
	    });
    }
    logOut = () => {
    	request({url: path.LOGOUT_URL, method: 'get'}).then(res => {
  			localStorage.clear()
	        this.props.getInfo()
    	}) .catch(error => console.log(error));
	  }
    render(){
    	const menu = (
		  <Menu className="menu">
		    <Menu.Item>
		      <a onClick={() => this.updateLoginPassword('person')}>
		       	 我的信息
		      </a>
		    </Menu.Item>
		    <Menu.Item>
		      <a onClick={() => this.updateLoginPassword('login')}>
		        修改登录密码
		      </a>
		    </Menu.Item>
		    <Menu.Item>
		      <a onClick={() => this.updateLoginPassword('transfer')}>
		       修改交易密码
		      </a>
		    </Menu.Item>
		  </Menu>
		);
		const {userInfo} = this.props
        return (
            <div className="header">
                <Row className="header-top" gutter = {16}>
                	<Col span={20}></Col>
                    <Col span={2} style = {{padding: 0}}>
                    	<div className="operate-wrapper">                    		                  	                        
	                        <Dropdown overlay={menu} className="person">
							    <a className="ant-dropdown-link">
							     <Icon type="user" style = {{marginRight: '8px'}}/>
		                       		{userInfo.realName}	 
							    </a>
							</Dropdown>
                    	</div>                                               
                    </Col>
                    <Col span={2}>                    	
	                   <a onClick={this.logOut}>
	                   	<Icon type="logout" style = {{marginRight: '8px'}}/>
	                   		退出
	                   	</a>
                    </Col>
                </Row>  
                <UpdateLoginPassword sta={this.state} setState={this.setState.bind(this)} userInfo = {this.props.userInfo}/>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
	return {
		userInfo: state.reducer.get('userInfo').toJS()
	}	
};
const mapDispatchToProps = (dispatch) => {
	return {
		getInfo() {
			dispatch(getUserInfo())
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(MyHeader);
