import { Button } from 'antd';
import React from 'react'
import path from 'config/pathConfig';
import request from 'utils/http'
import {
    withRouter
} from 'react-router-dom'

function NoAuth (props){
    const logOut = () => {
        request({url: path.LOGOUT_URL, method: 'get'}).then(res => {
            localStorage.clear()
            location.reload(true);
        }) .catch(error => console.log(error));
    }
    const goHome = () => {
        props.history.push(`${path.CURRENT_URL}/#/account/index`)
    }
    return (
        <div>
            <p>暂无权限</p>
            {/*<Button onClick = {goHome}>回到首页</Button>*/}
            <Button onClick = {logOut}>登出</Button>
        </div>
    );
}
export default withRouter(NoAuth);