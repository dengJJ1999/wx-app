import Vue from 'vue';
import App from '@/App';
import store from '@/store'; // 状态管理
import util from '@/utils/index'
import common from '@/mixin/common' // 全局函数
import topHeader from '@/components/top-header'
import searchBox from '@/components/dankal-search-box'
import mpHtml from '@/components/mp-html/mp-html'
import dankalModal from '@/components/dankal-modal'
import dankalImageUpload from '@/components/dankal-image-upload'
import globalData from '@/utils/global-data';
import MpvueRouterPatch from './static/index'; // 路由拦截

Vue.use(MpvueRouterPatch);

Vue.component('topHeader',topHeader)
Vue.component('dankalModal', dankalModal)
Vue.component('mpHtml', mpHtml)
Vue.component('searchBox', searchBox)
Vue.component('dankalImageUpload', dankalImageUpload)

Vue.config.productionTip = false;

Vue.mixin(common)
Vue.prototype.$util = util;
Vue.prototype.globalData = globalData


const app = new Vue({
  mpType: 'app',
  store,
  ...App,
});
app.$mount();
