import React, {Component} from 'react'
import {Card, Row, Col} from 'antd'
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'
import {getUserInfo} from 'store/actionCreators'

class Result extends Component {   
	componentWillMount() {	
	  	this.props.getInfo()
	}
    render() {
    	return (
	        <div>           	  
	        	<Card title="提现">
		         	<Row type="flex" justify="center">		            	
	        			<Col span = {12}>
				            <div className="result">
				            	<div className="leftWrap">
				            		<img src={require('statics/images/logo.png')} className="success"/>
				            	</div>
				            	<div className="rightWrap">
				            		<h2>提现成功! 提现资金预计1个工作日后到账</h2>
				            		<div className="operate">
				            			<NavLink to="/account/money" className = "loop">继续提现</NavLink>
				            			<NavLink to="/account/transRecord" className = "history">查看提现记录</NavLink>
				            		</div>
				            	</div>
				            </div>
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
export default connect(null, mapDispatchToProps)(Result)