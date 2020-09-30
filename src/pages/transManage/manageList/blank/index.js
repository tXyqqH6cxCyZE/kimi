import React, {Component} from 'react'
import {connect} from 'react-redux'
import {changeNavStatus, changeContentStatus} from 'store/actionCreators'
import request from 'utils/http'
import {message} from 'antd'

class Blank extends Component {
	componentDidMount() {
		this.props.changeNav(false)	
		this.props.changeContent(false)
		this.okHanderSign()
	}
    componentWillUnmount() {
        this.props.changeNav(true)
        this.props.changeContent(true)
    }
	okHanderSign = () => {
		console.log('调用signResult成功')
		let fadadaParams = JSON.parse(localStorage.getItem('fadadaTransParams'))
		delete fadadaParams['names']
	    request({url: 'kingmi/transfer/signResult', method: 'post', params: fadadaParams}).then(res => {
			if(res.code === 0) {
				message.success(res.message)
				localStorage.clear()
			}
			else {
				message.error(res.message)
			}
		}) 
	}
	render() {
		return (<div>签章完成，请关闭窗口!</div>)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {			
		changeNav(flag) {
            dispatch(changeNavStatus(flag))
       	},
       	changeContent(flag) {
            dispatch(changeContentStatus(flag))
       	}
	}
}
export default connect(null, mapDispatchToProps)(Blank)
 