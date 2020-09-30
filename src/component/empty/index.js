import React, {Component} from 'react'
import {connect} from 'react-redux'
import {changeNavStatus, changeContentStatus} from 'store/actionCreators'

class Empty extends Component {
	componentDidMount() {
		this.props.changeNav(false)	
		this.props.changeContent(false)
	}	
	componentWillUnmount() {
        this.props.changeNav(true)
        this.props.changeContent(true)
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
export default connect(null, mapDispatchToProps)(Empty)
 