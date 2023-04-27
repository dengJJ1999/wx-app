import { imgDomain } from '@/configs/env'
import dayjs from "dayjs";

export default {
  data() {
    return {
      imgDomain,
      statusBarHeight: 0,
      navBarHeigth: 0,
    };
  },
  created() {
    //获取设备信息
    const info = uni.getSystemInfoSync();
    // 状态栏高
    this.statusBarHeight = info.statusBarHeight;
    // #ifdef MP
    // 获取胶囊位置
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    // 获取导航栏高度
    // (胶囊底部位置 - 状态栏高度) + (胶囊顶部位置 - 状态栏高度) = 导航栏高度
    this.navBarHeigth = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info
      .statusBarHeight);
    // #endif
  },
  filters: {
    imgMapper(item) {
      if (item) {
        if (item.indexOf('http') !== 0) {
          return 'https://qiniu.mfgchn.com/' + item;
        }
      }
      return item;
    },
    formatterDate(item) {
      // 未超过1分钟显示刚刚 未超过1小时 显示59分钟前 超过1小时候显示 xx/xx xx:xx
      // 当前时间毫秒数
      let currentTime = dayjs(new Date(item.replace(/-/g,'/'))).valueOf();
      // 当前时间大于1分钟
      let localTime = dayjs().valueOf()
      // 小于一分钟
      if ((localTime - currentTime) < 60000) return '刚刚'
      // 大于一分钟且小于59分钟
      if ((localTime - currentTime) > 60000 && (localTime - currentTime) < 3540000) {
        let minute = dayjs().valueOf() - currentTime;
        return `${dayjs(minute).format('mm')}分钟前`
      }
      return dayjs(new Date(item.replace(/-/g,'/'))).format('MM-DD HH:mm:ss')
    }
  },
  methods: {
    /*
     * 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 uni.navigateBack 可以返回到原页面。小程序中页面栈最多十层
     * @param url 跳转链接
    */
    navigateTo(url) {
      uni.navigateTo({ url })
    },

    /*
     * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
     * @param url 跳转链接
    */
    redirectTo(url) {
      uni.redirectTo({ url })
    },

    /*
     * 关闭所有页面，打开到应用内的某个页面
     * @param url 跳转链接
    */
    reLaunch(url) {
      uni.reLaunch({ url })
    },

    /*
     * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
     * @param url 跳转链接
    */
    switchTab(url) {
      uni.switchTab({ url })
    },

    /*
     * 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层
     * @param delta 返回的页面数
    */
    navigateBack(delta) {
      uni.navigateBack({ delta })
    },

    /*
     * 放大图片
     * @param list 图片列表（没有包含七牛域名的图片链接自动加上）
     * @param index 当前显示图片索引
    */
    openImage(list, index = 0) {
      const listNew = []
      list.forEach((item) => {
        listNew.push(item.indexOf(imgDomain) >= 0 ? item : (imgDomain + item))
      })

      uni.previewImage({
        current: listNew[index], // 当前显示图片的http链接
        urls: listNew, // 需要预览的图片http链接列表
      })
    },

    /*
     * 拨打电话
     * @param phoneNumber 电话号码
    */
    makePhoneCall(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber,
      })
    },

    /*
     * 获取时间戳
     * @param date 日期
    */
    getTimestamp(date) {
      const timestamp = new Date(date.replace(/-/g, '/')).getTime();
      // const timestampNow = new Date().getTime();
      // console.log(`timestampNow:${timestampNow}`, `timestamp:${timestamp}`)
      return timestamp
    },

    /*
     * 单位数转两位数
     * @param num 单位数
    */
    getTwoDigits(num) {
      return Number(num) < 10 ? `0${num}` : num
    },

    /*
     * 节流处理（点击提交按钮可用）
     * @param time 毫秒
    */
    throttleAction(time = 1000) {
      const nowTime = new Date().getTime()
      const lastTime = this.lastTimestamp
      console.log(`lastTime:${lastTime}`, `nowTime:${nowTime}`)
      this.lastTimestamp = nowTime
      if (nowTime - lastTime > time) return true
      return false
    },

    /*
     * 截取链接参数（扫描二维码时可用）
     * @param name 参数名称
     * @param url1 链接地址
    */
    getQueryString(name, url) {
      //  正则筛选地址链接中的参数
      const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
      // 匹配目标参数
      const result = `&${url.split('?')[1]}`.substr(1).match(reg);
      // 返回参数值
      return result ? decodeURIComponent(result[2]) : null;
    },

    // 判断字符串是否为空|或者仅为空格
    isEmptyString(val) {
      if (!val) return true;
      const nullReg = '^[ ]+$';
      const re = new RegExp(nullReg);
      return re.test(val);
    },

    // 判断对象是否为空
    isEmptyObject(val) {
      return JSON.stringify(val) === '{}'
    },

    // 判断手机号码是否合法
    isPhone(val) {
      const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      return phoneReg.test(val)
    },

    // 判断身份证号码是否合法
    isIdcard(val) {
      const idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      return idcardReg.test(val)
    },

    // 判断邮箱是否合法
    isEmail(val) {
      const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      return emailReg.test(val)
    },

    /*
    * 判断有没有含有http
    * data 接受的参数
    * type 为1返回的字符串，为2返回数组
    */
    isImgdomain(data, type) {
      console.log('域名', this.imgDomain)
      const domain = this.imgDomain
      if (data.indexOf('http') !== -1) {
        return type === 1 ? data : [data]
      }
      if (data.indexOf('http') === -1) {
        return type === 1 ? `${domain + data}` : [`${domain + data}`]
      }
    },

    // 格式化日期（不含时间）
    formatDate(date){
      var datetime = date.getFullYear()
      + "-"// "年"
      + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
      + (date.getMonth() + 1))
      + "-"// "月"
      + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
      return datetime;
    },

    // 本月的结束时间
    getMonthDay(year,month) {
      let dateObj = new Date(year,month+1,0);  //注意：这里传入月份取值范围是0-11
      let theMonthDay = dateObj.getDate();
      return theMonthDay
    },

    /**
       *  JS获取本周、上周、本月、上月的开端日期、停止日期
       * type: 1今日 2本周，3上周，4本月，5上月
       */
    getStartEndTime(type){
      var now = new Date(); //当前日期
      var nowDayOfWeek = now.getDay(); //今天本周的第几天
      var nowDay = now.getDate(); //当前日
      var nowMonth = now.getMonth(); //当前月
      var nowYear = now.getYear(); //当前年
      nowYear += (nowYear < 2000) ? 1900 : 0; //
      var nowDate = new Date(nowYear, nowMonth, nowDay);
      //上月日期
      var lastMonthDate = new Date();
      lastMonthDate.setDate(1);
      lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
      var lastMonth = lastMonthDate.getMonth();
      // console.log('ssss', this.formatDate(nowDate));
      let startDate = '' // 开端日期
      let endDate = '' // 停止日期
      switch (type) {
        case 1:
          //获得今日的日期
          startDate = this.formatDate(nowDate);
          endDate = this.formatDate(nowDate);
          break;
        case 2:
          //获得本周的开端日期
          var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
          startDate = this.formatDate(weekStartDate);
          //获得本周的停止日期
          var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek) + 1);
          endDate = this.formatDate(weekEndDate);
          break;
        case 3:
          //获得上周的开端日期
          var lastWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1 - 7);
          startDate = this.formatDate(lastWeekStartDate);
          //获得上周的停止日期
          var lastWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek) + 1 - 7);
          endDate = this.formatDate(lastWeekEndDate);
          break;
        case 4:
           //获得本月的开端日期
          var monthStartDate = new Date(nowYear, nowMonth, 1);
          startDate = this.formatDate(monthStartDate);
          //获得本月的停止日期
          var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDay(nowYear,nowMonth));
          endDate = this.formatDate(monthEndDate);
          break;
        case 5:
          //获得上月开端时候
          var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
          startDate = this.formatDate(lastMonthStartDate);
          //获得上月停止时候
          var lastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDay(nowYear,lastMonth));
          endDate = this.formatDate(lastMonthEndDate);
          break;
        default:
          break;
      }
      return [startDate, endDate]
    },

    // 空白事件冒泡阻止
    touchmoveHandler(){},
  },
}
