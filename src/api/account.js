/* eslint-disable */
import fly from '@/jslibs/dk-flyio'

// 静默登陆
export const getRegister = data => fly.post('asset/report/reporter/register', data)
// 报备人完善信息
export const addUserInfo = data => fly.post('asset/report/reporter/info', data)
// 授权手机号
export const onBindPhone = data => fly.post('asset/report/reporter/mini-phone', data)
// 获取七牛云信息
export const getQiniu = () => fly.get('common/qiniu')
// 报备项目信息
export const getMessageTarget = data => fly.get(`asset/report/message-target/${data}`)
// 获取用户信息
export const getUserInfo = () => fly.get('asset/report/my-data')
// 客户报备
export const onReport = data => fly.post('asset/report', data)
// 我的报备
export const getReportList = data => fly.get('asset/report/list', data)
