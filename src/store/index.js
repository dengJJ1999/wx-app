// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    houseUuid: [], // 带看房源uuid
  },
  mutations: {
    increment: (state) => {
      const obj = state;
      obj.count += 1;
    },
    decrement: (state) => {
      const obj = state;
      obj.count -= 1;
    },
    selectHouse: (state,res) => {
      // console.log('res',res)
      const obj = state;
      obj.houseUuid = res
    },
  },
});

export default store;
