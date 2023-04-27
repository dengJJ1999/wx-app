<template>
  <div class="container">
    <div class="header">
      <div class="item">
        <div class="title">报备项目：{{info.project_name || '-'}}</div>
        <div class="text">
          报备记录将同步给招商顾问<span>【{{info.report_to_admin_name || '-'}}】</span>，进行确认。
        </div>
      </div>
    </div>
    <div class="form">
      <div class="form-item">
        <div class="label require">
          客户姓名
        </div>
        <div class="input">
          <input v-model="postData.name" type="text" placeholder="请输入">
        </div>
      </div>
      <div class="form-item">
        <div class="label require">
          联系方式
        </div>
        <div class="input">
          <input v-model="phone" type="number" placeholder="请输入">
        </div>
        <div class="action" @click="changePhone">
          {{isChange ? '全号' : '隐号'}}
        </div>
      </div>
      <div class="form-item">
        <div class="label require">
          看房时间
        </div>
        <div class="input">
          <picker mode="date" :value="postData.visit_time"  @change="visitDateChange">
            <span :class="{'on': !postData.visit_time}">{{ postData.visit_time || '请选择'}}</span>
          </picker>
        </div>
        <div class="arrow">
          <img :src="imgDomain + 'static-imageA/ic_arrow_2.png'" alt="">
        </div>
      </div>
      <div class="form-item" @click="navigateTo(`/pages/reporting/checkselect?name=${postData.need}`)">
        <div class="label require">
          需求区间
        </div>
        <div class="input" :class="{'on' : !postData.need}">
          {{postData.need || '请选择'}}
        </div>
        <div class="arrow">
          <img :src="imgDomain + 'static-imageA/ic_arrow_2.png'" alt="">
        </div>
      </div>
      <div class="form-item" @click="navigateTo(`/pages/reporting/select?keyword=industry`)">
        <div class="label">
          客户行业
        </div>
        <div class="input" :class="{'on' : !postData.industry}">
          {{postData.industry || '请选择'}}
        </div>
        <div class="arrow">
          <img :src="imgDomain + 'static-imageA/ic_arrow_2.png'" alt="">
        </div>
      </div>
      <div class="form-item">
        <div class="item">
          <div class="label">
            备注
          </div>
          <textarea maxlength="500" v-model="postData.remark" placeholder="请填写" class="text"/>
          <div class="count">
            {{postData.remark.length}}/500
          </div>
        </div>
      </div>
    </div>
    <div class="tip" @click="onSubmit">
      <div class="btn">确认报备</div>
      <div class="bottom-nav"/>
    </div>
    <dankalModal v-model="isShow" :isMask="isMask"  borderRadius="16rpx">
      <template slot="content">
        <div class="modal">
          <div class="text">
            您需完善个人信息后才可报备客户
          </div>
          <button @click="jumpInfo" class="finish">
            去完善
          </button>
        </div>
      </template>
    </dankalModal>
    <dankalModal v-model="isShow2" :isMask="isMask" borderRadius="16rpx">
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
  import {getRegister, getMessageTarget, getUserInfo, onReport} from "@/api/account";
  import dayjs from "dayjs";

  export default {
    name: "submit",
    data() {
      return {
        isShow: false,
        isShow2: false,
        isMask: false,
        phone: '',
        userInfo: {
          avatar_url: '',
          js_code: '',
          nick_name: ''
        },
        showPhone: '',
        isChange: false,
        postData: {
          industry: '', //行业
          is_real_phone: 0,
          name: '',
          need: '',
          phone: '',
          remark: '',
          report_to_admin_uuid: '',
          project_uuid_list: [],
          visit_time: dayjs().format('YYYY-MM-DD')
        },
        info: {},
        scene_id: '',
      }
    },
    watch: {
      phone() {
        console.info('.', this.phone)
        if (this.phone === '' || !this.phone) {
          this.isChange = false;
        }
      }
    },
    onLoad(e) {
      console.log("e", e)
      console.log("$route.query", this.$route.query)
      console.log("$route.query.scene", this.$route.query.scene)
      console.log("查看", decodeURIComponent(this.$route.query.scene).split('&jt=')[0])
      this.scene_id = this.$route.query.scene ?? (this.$route.query.scene || '')
      uni.$on('want',(data) => { // 意向需求
        console.log('监听 意向需求 返回',data);
        this.postData.need = data
      })
      uni.$on('industry',(data) => { // 行业类型
        console.log('监听 行业类型 返回',data);
        this.postData.industry = data
      })
    },
    onShow() {
      this.network().getUserInfo();
      this.network().getMessageTarget()
    },
    onUnload() {
      uni.$off('industry') // 行业类型
      uni.$off('want') // 意向需求
    },
    methods: {
      onSubmit() {
        if (!this.globalData.throttle()) return
        this.postData.phone = this.phone
        if (!this.postData.name || this.postData.name === '') return this.$util.Toast('请输入姓名')
        if(this.postData.phone === '' || !this.postData.phone || !this.isPhone(this.isChange ? this.showPhone : this.phone)) return this.$util.Toast('请输入正确的手机号')
        if (!this.postData.visit_time) return this.$util.Toast('请选择看房时间')
        if (!this.postData.need) return this.$util.Toast('请选择需求区间')
        this.postData.project_uuid_list.push(this.info.project_uuid_list[0])
        this.postData.report_to_admin_uuid = this.info.report_to_admin_uuid
        this.postData.is_real_phone = this.isChange ? 1 : 0
        this.network().onReport();
      },
      jumpInfo(){
        this.isShow = false
        this.navigateTo('/pages/reporting/user-info')
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
      changePhone() {
        if(this.phone === '' || !this.phone || !this.isPhone(this.isChange ? this.showPhone : this.phone)) return this.$util.Toast('请输入正确的手机号')
        if (!this.isChange) {
          this.showPhone = this.phone;
          this.phone = this.phone.slice(0,3)+'0000'+this.phone.slice(7,11)
        } else {
          this.phone = this.showPhone;
        }
        this.isChange = !this.isChange;
      },
      visitDateChange(e) {
        console.info(e)
        this.postData.visit_time = e.detail.value;
      },
      network() {
        return {
          getRegister: async () => {
            const { data } = await getRegister(this.userInfo);
            uni.setStorageSync('access_token', data.access_token)
            uni.setStorageSync('userInfo', data)
            if(!data.is_bind_phone || !data.name || !data.phone || !data.company ) {
              this.isShow = true;
              // this.navigateTo('/pages/reporting/user-info')
            }
            console.info('123', data)
            this.isShow2 = false;
          },
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
          getMessageTarget: async () => {
            let id = this.scene_id || this.$route.query.uuid
            console.log('接口请求', id)
            const { data } = await getMessageTarget(id);
            this.info = data;
            uni.setStorageSync('region_uuid', this.info.region_uuid || '')
          },
          onReport: async () => {
            const { status } = await onReport(this.postData)
            if (status === 200) {
              this.$util.Toast('报备成功')
              setTimeout(() => {
                this.redirectTo('/pages/reporting/mine-report')
              }, 500)
            }
          },
          getUserInfo: async () => {
            await getUserInfo().catch((err) => {
              this.isShow2 = true
            }).then((res) => {
              if (res) {
                uni.setStorageSync('userInfo', res.data)
                let info = res.data;
                if (!info.company || !info.phone || !info.name) {
                  this.isShow = true
                }
              }
            })
          },
        }
      }
    }
  }
</script>

<style scoped lang="scss">
.container {
  .header {
    .item {
      padding: 24rpx;
      .title {
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        margin-bottom: 16rpx;
      }
      .text {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        span {
          color: #333333;
          font-weight: 600;
        }
      }
    }
  }
  .form {
    padding-bottom: 32rpx;
    background: white;
    .form-item:nth-child(5) {
      .label {
        margin-right: 40rpx;
      }
    }
    .form-item:last-child {
      padding-bottom: 8rpx;
    }
    .form-item {
      display: flex;
      align-items: center;
      padding: 32rpx 0;
      margin: 0 24rpx;
      border-bottom: 1px solid #EEEEEE;
      .label {
        margin-right: 16rpx;
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
      }
      .on {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
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
        height: 26rpx;
        img {
          width: 16rpx;
          height: 26rpx;
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
