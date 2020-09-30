import React, {Component, lazy, Suspense} from 'react'
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import Build from 'pages/layout'

// 账户概览
const AccountRouter = lazy(() => import(/* webpackChunkName: "AccountRouter" */'pages/account'))
// 系统管理
const SystemRouter = lazy(() => import(/* webpackChunkName: "SystemRouter" */'pages/systemManage'))
// 金米管理
const KimmyRouter = lazy(() => import(/* webpackChunkName: "KimmyRouter" */'pages/kimmy'))
// 金米客户管理
const CustomerRouter = lazy(() => import(/* webpackChunkName: "CustomerRouter" */'pages/customerManage'))
// 金米转让管理
const ManageRouter = lazy(() => import(/* webpackChunkName: "ManageRouter" */'pages/transManage'))
// 金米融资管理
const FinanceRouter = lazy(() => import(/* webpackChunkName: "FinanceRouter" */'pages/financeManage'))
// 401
const NoAuth = lazy(() => import(/* webpackChunkName: "NoAuth" */'pages/noAuth'))

export default class ERouter extends Component{
    render(){
    	const LayoutRouter = (
    		<Build>
    			<Suspense fallback={<div>加载中...</div>}>
		            <Switch> 
		                <Route path='/account' render={props => <AccountRouter {...props} />}/> 
		                <Route path='/system' render={props => <SystemRouter {...props} />}/> 
		                <Route path='/kimmy' render={props => <KimmyRouter {...props} />}/> 
		                <Route path='/customer' render={props => <CustomerRouter {...props} />} /> 
		                <Route path='/transManage' render={props => <ManageRouter {...props} />}/> 
		                <Route path='/financing' render={props => <FinanceRouter {...props} />}/>
						<Route path='/noAuth' render={props => <NoAuth {...props} />}/>
		                <Redirect exact form="/" to="/account"/>
		            </Switch>
		        </Suspense>
	        </Build>  
	    )
        return (
            <Router>
        		<Switch>       			
                    <Route path="/" render={ props => LayoutRouter}/>
                </Switch>
            </Router>
        );
    }
}