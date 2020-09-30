import * as constants from './actionTypes.js'
import {message} from 'antd'
import { fromJS } from 'immutable';
import path from 'config/pathConfig';
import request from 'utils/http'

// fromJS把普通js对象转化为immutable不可变对象
const getSyncDataAction = data => ({
	type: constants.GET_ASYNC_DATA,
	data: fromJS(data)
})

const getUserAction = data => ({
	type: constants.GET_USER_INFO,
	data: fromJS(data)
})

const getCompanyAction = data => ({
	type: constants.GET_COMPANY_INFO,
	data: fromJS(data)
})

export const changeNavStatus = data => ({
	type: constants.CHANGE_NAV_STATUS,
	data
})
export const changeContentStatus = data => ({
	type: constants.CHANGE_CONTENT_STATUS,
	data
})

export const getKimmyTabs = data => ({	
	type: constants.GET_KIMMY_TABS,
	data	
})

export const getKimmyAuthority = data => ({	
	type: constants.GET_KIMMY_AUTHORITY,
	data	
})

//使用react-thunk中间件之后可以返回函数
export const getUserCompanyInfo = () => {
	return async (dispatch) => {
		await request({url: 'user/login/info'}).then(res => {
			if(res.code === 0) {
				const action = getCompanyAction(res.data);
				dispatch(action)
			}
		});				
	}
}

export const getListData = () => {
	return async (dispatch) => {
		await request({
			url: 'enums/all',
			method: 'get'
		}).then(res => {
			if(res.code === 0) {
				const action = getSyncDataAction(res.data);
				dispatch(action)
			}
		})		
	}
}

export const getUserInfo = (url) => {
	return (dispatch) => {
		let arr = url && url.split('/');
		if(arr && arr.length > 0 && arr.includes('modifyInfo')) {
			return;
		}
		else {				
			request({url: `${path.BASE_URL}${path.LOGIN_CHECK_URL}`, method: 'get'}).then(res => {	
				if(res.code === 0) {   				
					dispatch(getUserAction(res.data))
				}
			}).catch(err => {
				if(err.status === 401) {
					request({url: "oauth2/logout", method: 'get'}).then(res => {
						location.reload()
			   		})		
				}
				dispatch(getUserAction({}))
				let data = err.response.data;
				const frontUrl = window.location.href;
				if(frontUrl === `${path.CURRENT_URL}/#/account/index` && data) {
					let user_center = path.USER_CENTER
					+ data.responseType 
					+ '&redirect_uri=' 
					+ data.redirectUri 
					+ '&client_id=' 
					+ data.clientId 
					+ '&sid=' 
					+ data.systemSid 
					+ '&front_url=' + frontUrl;  
					window.location.href = user_center;
				}
				else {
					window.location.href = `${path.CURRENT_URL}#/noAuth`
					// message.info('暂无登录权限!')
				}
			})
		}		
	}	
}



