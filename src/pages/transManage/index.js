import React, {Component, lazy, Suspense} from 'react';
import { Switch, Route, Redirect} from 'react-router-dom'

const Blank = lazy(() => import(/* webpackChunkName: "blank" */'./manageList/blank'))
const Empty = lazy(() => import(/* webpackChunkName: "blank" */'component/empty'))
// 金米转让首页
const TransManageList = lazy(() => import(/* webpackChunkName: "transManageList" */'./manageList'))
// 详情
const Detail = lazy(() => import(/* webpackChunkName: "detail" */'./manageList/detail'))
// 转让审核
const BasicInfo = lazy(() => import(/* webpackChunkName: "basicInfo" */'./manageList/basicInfo'))
// 修改
const Modify = lazy(() => import(/* webpackChunkName: "modify" */'./manageList/modify'))

export default class ManageRouter extends Component {
	render(){
	    return (
	    	<Suspense fallback={<div>加载中...</div>}>
		    	<Switch>	    	
		    		<Route path="/transManage/index" render={props => <TransManageList {...props}/>}/> 
		    		<Route path="/transManage/blank" render={props => <Blank {...props}/>}/>
		    		<Route path="/transManage/empty" render={props => <Empty {...props}/>}/>
		    		<Route path="/transManage/detail/:id" render={props => <Detail {...props}/>}/>{/**转让详情 */}
		    		<Route path="/transManage/basicInfo/:id" render={props => <BasicInfo {...props}/>}/>{/*转让审核 */}
		    		<Route path="/transManage/modify/:id" render={props => <Modify {...props}/>}/>
		    		<Redirect exact from="/transManage" to="/transManage/index"/>
	            </Switch>
	        </Suspense>
	    );
	}
}