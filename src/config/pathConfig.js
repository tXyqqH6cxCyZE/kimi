let path = {};
let NODE_ENV = process.env.NODE_ENV;
//本地开发
if (NODE_ENV === "development") {
  path.CURRENT_URL = "http://kingmi.staging.crdsjzx.com";
  path.USER_CENTER = "http://oauth2.staging.crdsjzx.com/oauth2/authorize?response_type=";
}
// 南京生产
else if (NODE_ENV === "prodNJ") {
  path.CURRENT_URL = "http://kingmi.szjr.yzig.com.cn";
  path.USER_CENTER = "http://oauth2.szjr.yzig.com.cn/oauth2/authorize?response_type=";
}
// dev
else if (NODE_ENV === "dev") {
  path.CURRENT_URL = "http://120.131.9.128:8300";
  path.USER_CENTER = "http://120.131.9.128:8666/oauth2/authorize?response_type=";
}
// 南京devTest
else if (NODE_ENV === "production") {
  path.CURRENT_URL = "http://kingmi.staging.crdsjzx.com";
  path.USER_CENTER = "http://oauth2.staging.crdsjzx.com/oauth2/authorize?response_type=";
}
// 重庆口岸测试环境
else if (NODE_ENV === "cqkast") {
  path.CURRENT_URL = "http://kingmi.staging.crdsjzx.com";
  path.USER_CENTER = "http://oauth2.staging.crdsjzx.com/oauth2/authorize?response_type=";
}
// 重庆口岸生产环境
else if (NODE_ENV === "cqkaprod") {
  path.CURRENT_URL = "http://kingmi.crdsjzx.com";
  path.USER_CENTER = "http://oauth2.crdsjzx.com/oauth2/authorize?response_type=";
}
// 重庆口岸uat环境
else if (NODE_ENV === "cqkauat") {
  path.CURRENT_URL = "http://kingmi.uat.crdsjzx.com";
  path.USER_CENTER = "http://oauth2.uat.crdsjzx.com/oauth2/authorize?response_type=";
}
//
else if (NODE_ENV === "staging") {
  path.CURRENT_URL = "http://staging.kingmi.fintech.pt.xiaomi.com";
  path.USER_CENTER = "http://staging.ucenter.oauth2.fintech.pt.xiaomi.com/oauth2/authorize?response_type=";
}
// 小米uat环境
else if (NODE_ENV === "preview-c4") {
  path.CURRENT_URL = "http://liangpiao.uat.otc.mi.com";
  path.USER_CENTER = "http://oauth2.uat.otc.mi.com/oauth2/authorize?response_type=";
}
// staging测试环境
else {
  // path.CURRENT_URL = "http://staging.kingmi.fintech.pt.xiaomi.com"
  // path.USER_CENTER= "http://staging.ucenter.oauth2.fintech.pt.xiaomi.com/oauth2/authorize?response_type="
  path.CURRENT_URL = "http://118.24.227.54:8300";
  path.USER_CENTER = "http://oauth2.staging.crdsjzx.com/oauth2/authorize?response_type=";
  // path.HOST= 'staging.kingmi.fintech.pt.xiaomi.com';
}

path.BASE_URL = `${path.CURRENT_URL}/api/`;
// 提现验证码
path.CAPTCHA = `${path.CURRENT_URL}/api/captcha?sid=`;
//登录检查
path.LOGIN_CHECK_URL = "user/current";
//登出
path.LOGOUT_URL = "oauth2/logout";

export default path;