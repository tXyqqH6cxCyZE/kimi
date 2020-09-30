import React, {Component, lazy, Suspense} from 'react';
import { Switch, Route, Redirect} from 'react-router-dom'

// 金米列表
const KimmyList = lazy(() => import(/* webpackChunkName: "kimmyList" */'./kimmyList'))
const Blank = lazy(() => import(/* webpackChunkName: "blank" */'./kimmyList/blank'))
const Empty = lazy(() => import(/* webpackChunkName: "blank" */'component/empty'))
// 金米申请
const AddGold = lazy(() => import(/* webpackChunkName: "addGold" */'../account/addGold'))
// 金米开立审核
const BasicInfo = lazy(() => import(/* webpackChunkName: "basicInfo" */'./kimmyList/kimmyInfo'))
// 金米转让
const Transfer = lazy(() => import(/* webpackChunkName: "transfer" */'./kimmyList/transfer'))
// 金新增转让入口
const NewTransfer = lazy(() => import(/* webpackChunkName: "newTransfer" */'./kimmyList/newTransfer'))
// 金米开立详情
const Detail = lazy(() => import(/* webpackChunkName: "detail" */'./kimmyList/detail'))
// 金米对账单下载
const Download = lazy(() => import(/* webpackChunkName: "download" */'./kimmyList/download'))
// 金米结算
const SettlementList = lazy(() => import(/* webpackChunkName: "settlementList" */'./settlementList'))
// 结算详情
const SettledDetail = lazy(() => import(/* webpackChunkName: "settledDetail" */'./settlementList/detail'))

export default class KimmyRouter extends Component {
	render(){
	    return (
	    	<Suspense fallback={<div>加载中...</div>}>
		    	<Switch>	    	
		    		<Route path="/kimmy/index" render={props => <KimmyList {...props}/>}/>
		    		<Route path="/kimmy/blank" render={props => <Blank {...props}/>}/>
		    		<Route path="/kimmy/empty" render={props => <Empty {...props}/>}/>
		    		<Route path="/kimmy/addGold/:id?" render={props => <AddGold {...props}/>}/>{/**粮票开立 */}
		    		<Route path="/kimmy/download" render={props => <Download {...props}/>}/>  		
		    		<Route path="/kimmy/basicInfo/:id" render={props => <BasicInfo {...props}/>}/>{/*供应商粮票开立审核 */}
		    		<Route path="/kimmy/transfer/:id" render={props => <Transfer {...props}/>}/>   {/* 转让申请 */}
		    		<Route path="/kimmy/toNewTransfer/:id" render={props => <NewTransfer {...props}/>}/>{/* 转让申请 */}
		    		<Route path="/kimmy/revised/:id" render={props => <AddGold {...props}/>}/>    
		    		<Route path="/kimmy/detail/:id" render={props => <Detail {...props}/>}/>   {/*转让单详情 */} 		    		
		    		<Route path="/kimmy/settlement" render={props => <SettlementList {...props}/>}/>    
		    		<Route path="/kimmy/settled/detail/:id" render={props => <SettledDetail {...props}/>}/>
		    		<Redirect exact from="/kimmy" to="/kimmy/index"/>
	        </Switch>
	      </Suspense>
	    );
	}
}