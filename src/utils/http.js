import axios from 'axios'
import path from 'config/pathConfig';
import {message} from 'antd'

const service = axios.create({
    baseURL: path.BASE_URL,
    timeout: 180000
});
// const app = document.querySelector('#app');
// let loading;
// request请求拦截器
service.interceptors.request.use(
    config => {
        config.params = {
            // 清缓存
            _t: Date.parse(new Date())/1000,
            ...config.params
        }
        // loading = app.getElementsByClassName('loading')[0];
        // loading.style.display = 'block'
        return config;
    },
    error => {
        Promise.reject(error);
    }
);
// respone响应拦截器
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            // loading = app.getElementsByClassName('loading')[0];
            // loading.style.display = 'none'
            return response.data;
        }else {
            return Promise.reject(response);
        }
    },
    err => {
        const data = err.response.data;
        const status = err.response.status;
        const frontUrl = window.location.href;
        // loading = app.getElementsByClassName('loading')[0];
        // loading.style.display = 'none'
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
        else if(status == 401){
            window.location.href = `${path.CURRENT_URL}#/noAuth`
        }else {
            window.location.href = `${path.CURRENT_URL}/#/account/index`
        }
        return Promise.reject(err);
    }
);

export default service;


