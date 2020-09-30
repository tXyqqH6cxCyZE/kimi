import React, { Component, lazy, Suspense } from 'react';
import { Switch, Route, Redirect} from 'react-router-dom'

// 核心企业
const CoreEnterprise = lazy(() => import(/* webpackChunkName: "coreEnterprise" */'./coreEnterprise'))
// 新增核心企业
const AddCore = lazy(() => import(/* webpackChunkName: "addCore" */'./coreEnterprise/addCore'))
// 核心企业详情
const CoreEnterpriseInfo = lazy(() => import(/* webpackChunkName: "coreEnterpriseInfo" */'./coreEnterprise/basicInfo'))
// 资金方管理
const Capital = lazy(() => import(/* webpackChunkName: "capital" */'./capital'))
// 资金方详情
const BasicInfo = lazy(() => import(/* webpackChunkName: "basicInfo" */'./capital/basicInfo'))
// 新增资金方
const AddCapital = lazy(() => import(/* webpackChunkName: "addCapital" */'./capital/addCore'))
// 供应商管理
const Supplier = lazy(() => import(/* webpackChunkName: "supplier" */'./supplier'))
// 供应商基本信息
const BasicInfo1 = lazy(() => import(/* webpackChunkName: "basicInfo1" */'./supplier/basicInfo'))
// 供应商入网审核
const Examine = lazy(() => import(/* webpackChunkName: "examine" */'./supplier/examine'))
// 供应商修改
const Modify = lazy(() => import(/* webpackChunkName: "modify" */'./supplier/modify'))

class CustomerRouter extends Component {
  	render(){
	    return (
	    	<Suspense fallback={<div>加载中...</div>}>
		    	<Switch>
		    		<Route path="/customer/index" render={props => <CoreEnterprise {...props}/>}/>
		    		<Route path="/customer/info/:id" render={props => <BasicInfo {...props}/>}/>  
		    		<Route path="/customer/info1/:id" render={props => <BasicInfo1 {...props}/>}/>    
		    		<Route path="/customer/addcore" render={props => <AddCore {...props}/>}/>      
		    		<Route path="/customer/modify/:id" render={props => <Modify {...props}/>}/>      
		    		<Route path="/customer/capital" render={props => <Capital {...props}/>}/>    
		    		<Route path="/customer/addcapital" render={props => <AddCapital {...props}/>}/>   	    		
		    		<Route path="/customer/supplier" render={props => <Supplier {...props}/>}/>    
		    		<Route path="/customer/examine/:id" render={props => <Examine {...props}/>}/>   
		    		<Route path="/customer/core/:id" render={props => <CoreEnterpriseInfo {...props}/>}/>
		    		<Redirect exact from="/customer" to="/customer/index"/>
	            </Switch>
	        </Suspense>
	    );
	}
}

export default CustomerRouter;