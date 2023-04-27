/* eslint-disable */
import fly from '@/jslibs/dk-flyio'

// 自定义管理-列表（选择页）
export const getCustomList = params => fly.get('asset/opportunities/custom-tags', params)
