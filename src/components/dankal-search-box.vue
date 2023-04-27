<template>
  <div class="searchTop">
    <div class="searchInp">
      <img
              class="search-img"
              :src="imgDomain + 'static-imageA/icon_search_light.png'">
      <input
              type="text"
              :placeholder="placeHolder"
              class="search-inp"
              @confirm="getSearchVal"
              v-model="searchVal">
      <img
              class="search-del"
              v-if="searchVal"
              @click="clearSearchVal"
              src="https://cdn.tuanhaoke.cn/assets/images/ic_home_search_close.png">
    </div>
    <span
        v-if="isShowBtn"
            class="searchText"
            @click="getSearchVal">搜索</span>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        searchVal: '',
      };
    },
    props: {
      value: {
        type: String,
        default: '',
      },
      isShowBtn: {
        type: Boolean,
        default: true,
      },
      placeHolder: {
        type: String,
        default: '请输入搜索关键词',
      },
    },
    watch: {
      value(val){
        this.searchVal = val
      },
    },
    methods: {
      clearSearchVal() {
        this.searchVal = ''
        this.$emit('input', this.searchVal)
        this.$emit('change', this.searchVal)
      },
      getSearchVal() {
        if (!this.searchVal) {
          wx.showToast({
            title: '请输入搜索关键字',
            icon: 'none',
            duration: 2000,
          })
          return
        }
        this.$emit('input', this.searchVal)
        this.$emit('change', this.searchVal)
      },
      network() {
        return {
          example: async () => {
            console.log('network');
          },
        };
      },
      handler() {
        return {
          example: () => {
            console.log('handle');
          },
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .searchTop{
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    box-sizing: border-box;
    justify-content: space-between;
    // box-shadow:0px 1px 0px 0px rgba(229,229,229,1);
    .searchInp{
      background-color: #fff;
      flex: 1;
      height: 64rpx;
      border-radius: 34rpx;
      display: flex;
      align-items: center;
      padding:0 26rpx;
      .search-img{
        width: 28rpx;
        height: 28rpx;
        margin-right: 10rpx;
      }
      .search-inp{
        flex: 1;
        background: none;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
      .search-del{
        width: 40rpx;
        height: 40rpx;
        opacity: 0.8;
        border-radius: 100%;
      }
    }
    .searchText{
      color:#141414;
      font-size: 28rpx;
    }
  }
</style>
