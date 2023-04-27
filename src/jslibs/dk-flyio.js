/* eslint-disable new-cap,import/no-mutable-exports */
import { apiDomain } from '@/configs/env';

let fly = require('flyio/dist/npm/wx');

fly = new fly();
fly.config.baseURL = apiDomain;
// 添加请求拦截器
let timer = null
fly.interceptors.request.use((request) => {
  // 给所有请求添加自定义header
  // request.headers['X-Access-Token'] = 'token';
  request.headers['X-Access-Token'] = uni.getStorageSync('access_token');
  // request.headers['X-Access-Token'] = '91296a1da919d81cc77868a31490f527'
  // 打印出请求体
  console.log('打印出请求体', request);
  // 终止请求
  // var err=new Error("xxx")
  // err.request=request
  // return Promise.reject(new Error(""))

  if (!timer) timer = setTimeout(() => {
    uni.showLoading({ title: '加载中', mask: true })
  }, 1000);

  // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request;
});

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
      if (timer) {
        clearTimeout(timer)
        timer = null
        uni.hideLoading()
      }

      // console.log(response, 'response');
      const { data } = response;
      if (data.error) {
        uni.showToast({ title: data.error.message, icon: 'none', duration: 2000 })
        return Promise.resolve(data);
      }
      return response
    },
    (error) => {
      if (timer) {
        clearTimeout(timer)
        timer = null
        uni.hideLoading()
      }


      if (!error.response) {
        uni.showToast({ title: '请检查网络设备', icon: 'none', duration: 2000 })
        return
      }

      // 发生网络错误后会走到这里
      // console.log(error, 'error');
      const { status, data } = error.response;

      switch (status) {
        case 401:
        case 412:
          // uni.setStorageSync('token', '')
          // uni.navigateTo({ url: '/pagesA/login/index' })
          break;
        default:
          uni.showToast({ title: data.error.message, icon: 'none', duration: 2000 })
          Promise.resolve(data);
      }
    },
);
export default fly;
