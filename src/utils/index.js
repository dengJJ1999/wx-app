function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();

  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join('/');
  const t2 = [hour, minute, second].map(formatNumber).join(':');

  return `${t1} ${t2}`;
}
export function Toast(title) {
  uni.showToast({
    title,
    icon: 'none',
    duration: 1000, // 延迟时间,
    mask: true, // 显示透明蒙层，防止触摸穿透,
  })
}
// 下拉刷新
// eslint-disable-next-line consistent-return
export async function onfetch(api, info) {
  uni.stopPullDownRefresh();
  const { data } = await api(info)
  if (!data.error) {
    console.info('进来', data)
    return data
  }
}
// 上拉加载
// eslint-disable-next-line consistent-return
export async function onbottom(api, info, total) {
  // eslint-disable-next-line no-unused-expressions,no-mixed-operators
  const page = Math.ceil((total * 1 + info.page_index - 1) / info.page_size);
  console.info(info.page_index, total, page, '几页')
  if (info.page_index > page) {
    console.info('没有了')
    Toast('没有更多数据')
    return '';
  }
  const { data } = await api(info)
  if (!data.error) {
    // eslint-disable-next-line consistent-return
    return data
  }
}

export default {
  formatNumber,
  formatTime,
  Toast,
  onfetch,
  onbottom,
};
