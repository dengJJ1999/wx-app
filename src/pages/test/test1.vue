<!--
 * @Author: dengjianjie 1042261508@qq.om
 * @Date: 2023-04-25 17:28:40
 * @LastEditors: dengjianjie 1042261508@qq.om
 * @LastEditTime: 2023-04-25 18:06:38
 * @FilePath: \wxapp-upgrade-mfg-report\src\pages\test\test1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="container">设备信息： {{ info.uuid }}</div>
</template>

<script>
export default {
  name: "mine-report",
  data() {
    return {
      info: {
        uuid: "",
      },
    };
  },
  watch: {},
  async onLoad() {
    await this.init();
    await this.getInfo1();
    await this.getInfo2();
  },
  onShow() {},
  methods: {
    init() {
      return new Promise((resolve, reject) => {
        uni.openBluetoothAdapter({
          mode: "central",
          success: (res) => {
            console.log("初始化成功:", res);
            resolve(res);
          },
          fail: (res) => {
            console.log("初始化失败:", res);
            reject(res);
          },
        });
      });
    },
    getInfo1() {
      console.log("进入11");
      return new Promise((resolve, reject) => {
        uni.getBluetoothAdapterState({
          success: (res) => {
            console.log("本机蓝牙模块信息:", res);
            // 获取UUID
            var uuid = res.uuid;
            console.log("本机蓝牙模块UUID：", uuid);
            this.info = res;
            resolve(res);
          },
          fail: (res) => {
            console.log("fail:", res);
            reject(res);
          },
        });
      });
    },
    getInfo2() {
      console.log("进入22");
      return new Promise((resolve, reject) => {
        uni.getBluetoothDevices({
          success: (res) => {
            console.log("获取在蓝牙模块生效期间所有搜索到的蓝牙设备:", res);
            resolve(res);
          },
          fail: (res) => {
            console.log("fail:", res);
            reject(res);
          },
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  padding-top: 40rpx;
  padding-bottom: 24rpx;
  background: white;
  position: relative;
  .input {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60rpx;
    margin-bottom: 16rpx;
    span {
      width: 240rpx;
    }
    input {
      flex-shrink: 0;
      margin-left: 16rpx;
      background: #eee;
    }
  }
  .btn {
    button {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 220rpx;
      height: 96rpx;
      margin: 24rpx 0;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 48rpx;
      background: #333333;
      border-radius: 48rpx;
    }
  }
  .listText {
    font-size: 32rpx;
    ul {
      li {
        margin-bottom: 16rpx;
      }
    }
  }
}
</style>
