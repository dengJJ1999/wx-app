/* eslint-disable no-unused-vars */
// const devDomain = 'http://192.168.0.198:8080/v1/mini/'
/**
 * 中介小程序
 * 招商跳转中介版本一致(如招商体验版版跳中介体验版；招商线上版跳中介线上版)
 * 两个小程序在不同版本的环境需要保持一致，改域名发非开发版需要确认是否与招商小程序一致
 */
// const devDomain = 'https://napi.mfg.dankal.cn/v1/mini/' // 测试环境域名
const devDomain = 'https://mfg.pre.dankal.cn/v1/mini/' // 预发布域名
const proDomain = 'https://api.npro.mfgchn.com/v1/mini/' // 正式域名
const apiDomain = ''
const testDomain = 'https://api-staging.officeasy.dankal.cn/v1/'
const imgDomain = 'https://qiniu.mfgchn.com/' // 七牛云

module.exports = {
  // apiDomain: devDomain,
  apiDomain: proDomain,
  imgDomain,
};
