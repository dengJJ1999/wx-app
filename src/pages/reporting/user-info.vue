<template>
  <div class="container">
    <div class="form">
      <div class="form-item">
        <div class="label">
          头像
        </div>
        <div class="input"/>
        <div class="arrow" @click="onUploadImage">
          <div class="avatar">
            <img :src="postData.avatar_url | imgMapper" alt="" mode="aspectFill">
          </div>
          <img :src="imgDomain + 'static-imageA/ic_arrow_2.png'" alt="">
        </div>
      </div>
      <div class="form-item">
        <div class="label require">
          姓名
        </div>
        <div class="input">
          <input v-model="postData.name" type="text" placeholder="请输入">
        </div>
      </div>
      <div class="form-item">
        <div class="label require">
          手机号
        </div>
        <div class="input">
          <input v-model="postData.phone" type="text" disabled placeholder="请授权">
        </div>
        <div class="arrow">
          <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumberWx">
            {{postData.phone ? '授权修改':'授权'}}
          </button>
        </div>
      </div>
      <div class="form-item">
        <div class="label require">
          所属公司
        </div>
        <div class="input">
          <input v-model="postData.company" type="text" placeholder="请输入您的公司名称">
        </div>
      </div>
    </div>
    <div class="tip" @click="onSave">
      <div class="btn">保存</div>
      <div class="bottom-nav"/>
    </div>
    <dankalModal v-model="isShow" :isMask="isMask" borderRadius="16rpx">
      <template slot="content">
        <div class="modal">
          <div class="text">
            您还未登录
          </div>
          <button @click="getUserProfile" class="finish">
            去登录
          </button>
        </div>
      </template>
    </dankalModal>
  </div>
</template>

<script>
  import {getQiniu, addUserInfo, onBindPhone, getUserInfo} from "@/api/account";

  export default {
    name: "user-info",
    data() {
      return {
        token: '',
        postData: {
          avatar_url: '',
          company: '',
          name: '',
          nick_name: '',
          phone: '',
          region_uuid: ''
        },
        info: {},
        isShow: false,
        isMask: false,
      }
    },
    onShow() {
      this.postData = uni.getStorageSync('userInfo')
      this.postData.region_uuid = uni.getStorageSync('region_uuid') || ''
    },
    onLoad() {
      this.network().getQiniu();
      // this.network().getUserInfo();
    },
    methods: {
      onSave() {
        if (!this.postData.name || this.postData.name === '') return this.$util.Toast('请输入姓名')
        if(this.postData.phone === '' || !this.postData.phone || !this.isPhone(this.postData.phone)) return this.$util.Toast('请输入正确的手机号')
        if (!this.postData.company || this.postData.company === '') return this.$util.Toast('请输入公司名称')
        this.network().addUserInfo();
      },
      getPhoneNumberWx(e) {
        console.log('获取手机号', e)
        const { detail } = e.mp
        if (detail.encryptedData) {
          const { iv, encryptedData } = detail
          console.info(iv, '======>>>>>', encryptedData)
          this.network().onBindPhone(iv, encryptedData, this.postData.user_uuid)
        }
      },
      onUploadImage() {
        uni.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const filePath = res.tempFiles[0].path;
            const filename = filePath.substr(filePath.lastIndexOf('/') + 1);
            uni.showLoading({ title: 'Loading...', mask: true });
            uni.uploadFile({
              filePath,
              url: 'https://upload-z2.qiniup.com',
              name: 'file',
              header: { 'Content-Type': 'multipart/form-data' },
              formData: {
                token: this.token,
                file: filename,
              },
              success: (res1) => {
                console.log('图片上传到七牛', res1)
                const data = JSON.parse(res1.data)
                this.postData.avatar_url = data.key
                uni.hideLoading();
              },
              fail(res1) {
                console.log(res1)
                uni.hideLoading();
              },
            })
          },
        })
      },
      getUserProfile() {
        if (!this.globalData.throttle()) return
        uni.getUserProfile({
          desc: '获取你的昵称、头像、地区及性别',
          success: (res) => {
            console.log('getUserProfile', res)
            this.userInfo.encrypted_data = res.encryptedData
            this.userInfo.iv = res.iv
            this.userInfo.nick_name = res.userInfo.nickName
            this.userInfo.avatar_url = res.userInfo.avatarUrl
            this.network().wxLogin()
          },
          fail: (res) => {
            console.log('getUserProfile fail', res)
          },
        })
      },
      network() {
        return {
          onBindPhone: async (iv, encryptedData, uuid) => {
            const { data } = await onBindPhone({iv, encrypted_data:encryptedData, uuid})
            this.postData.phone = data.phone;
            uni.setStorageSync('userInfo', data)
            this.$forceUpdate();
          },
          addUserInfo: async () => {
            const { status } = await addUserInfo(this.postData);
            if (status === 200) {
              this.network().getUserInfo();
            }
          },
          getQiniu: async () => {
            const { data } = await getQiniu()
            console.log('获取七牛信息', data);
            this.token = data.token
          },
          getUserInfo: async () => {
            const { data } = await getUserInfo()
            uni.setStorageSync('userInfo', data)
            this.$util.Toast('保存成功')
            setTimeout(() => {
              this.navigateBack(1)
            }, 500)
          },
          // getUserInfo: async () => {
          //   await getUserInfo().catch((err) => {
          //     this.isShow = true
          //   }).then((res) => {
          //     if (res) {
          //       uni.setStorageSync('userInfo', res.data)
          //       this.$util.Toast('保存成功')
          //       setTimeout(() => {
          //         this.navigateBack(1)
          //       }, 500)
          //     }
          //   })
          // },
          wxLogin: async () => {
            await uni.login({
              success: (res) => {
                if (res.code) {
                  this.userInfo.js_code = res.code
                  console.log('rescode',res,  this.userInfo)
                  this.network().getRegister();
                } else {
                  console.log(`登录失败！${res.errMsg}`)
                }
              },
            })
          },
          getRegister: async () => {
            const { data } = await getRegister(this.userInfo);
            uni.setStorageSync('access_token', data.access_token)
            uni.setStorageSync('userInfo', data)
            this.isShow = false;
          },
        }
      }
    }
  }
</script>

<style scoped lang="scss">
.container {
  position: relative;
  min-height: 100vh;
  .form {
    background: white;
    .form-item:nth-child(4n) {
      border: unset;
    }
    .form-item {
      display: flex;
      align-items: center;
      padding: 32rpx 0;
      margin: 0 24rpx;
      border-bottom: 1px solid #EEEEEE;
      .label {
        width: 160rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      .require {
        &:after {
          margin-left: 10rpx;
          display: inline-block;
          content: '*';
          color: #D62222;
          font-size: 28rpx;
        }
      }
      .input {
        flex: 1;
        .on {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
      .item {
        width: 100%;
      }
      textarea {
        margin-top: 32rpx;
        width: 100%;
        height: 100rpx;
      }
      .count {
        width: 100%;
        text-align: right;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
      .action {
        text-align: center;
        width: 88rpx;
        height: 48rpx;
        line-height: 48rpx;
        border-radius: 24rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #488DED;
        border: 1px solid #488DED;
      }
      .arrow {
        display: flex;
        align-items: center;
        img {
          width: 16rpx;
          height: 26rpx;
        }
        .avatar {
          margin-right: 16rpx;
          img {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
          }
        }
        button {
          height: 56rpx;
          font-size: 28rpx;
          font-weight: 400;
          color: #488DED;
        }
      }
    }
  }
  .tip {
    position: fixed;
    bottom: 24rpx;
    left: 0;
    width: 100vw;
    .btn {
      margin: auto;
      text-align: center;
      width: 686rpx;
      height: 92rpx;
      line-height: 92rpx;
      background: linear-gradient(314deg, #737BA8 0%, #3F456F 100%);
      border-radius: 8rpx;
      font-size: 34rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
    }
  }
  .modal {
    width: 562rpx;
    height: 282rpx;
    box-shadow: 4rpx 6rpx 20rpx 0rpx rgba(0, 0, 0, 0.12);
    .text {
      padding: 70rpx 32rpx;
      text-align: center;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
    .finish {
      border-top: 1px solid #F5F5F5;
      box-shadow: 4rpx 6rpx 20rpx 0rpx rgba(0, 0, 0, 0.12);
      height: 96rpx;
      line-height: 96rpx;
      text-align: center;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #488DED;
    }
  }
}
</style>
