<template>
  <div class="container">
    <div class="item" v-for="(item,index) in value" :key="index" >
      <img class="img" :src="imgDomain + item" mode="aspectFill" @click="openImage(value,index)">
      <div class="tips" @click="delImage(index)">
        <img :src="imgDomain + 'static-imageA/ic_pay_date@2x.png'" alt="">
      </div>
    </div>
    <div class="item" v-if="value.length<limit" @click="addImage()">
      <!--<div class="add" @click="addImage()">
        <img class="ic" src="https://qiniu.mctower.runworld.com.cn/static-image/ic_repair_camera.png" mode="widthFix">
        <div>点击添加</div>
        <div class="tex">{{text?text:'最多可添加'+limit+'张'}}</div>
      </div>-->
    </div>
  </div>
</template>

<script>
  import { getQiniu } from '@/api/account'

  export default {
    name: 'ImageUpload',

    data() {
      return {
        token: '',
        valueShow: [],
      };
    },

    created() {
      this.network().getQiniu()
    },

    props: {
      value: {
        type: Array,
        required: true,
      },
      limit: {
        type: Number,
        default: 9,
      },
      text: {
        type: String,
        default: '',
      },
    },

    watch: {
      value(val) {
        console.log('value', val) // 勿删
        const valueShow = []
        val.forEach((item) => { valueShow.push(this.imgDomain + item) })
        this.valueShow = valueShow

        this.$emit('input', this.value)
      },
    },

    computed: {
    },

    methods: {
      addImage() {
        if (this.value.length >= this.limit) {
          return this.$util.Toast(`最多只可以上传${this.limit}张`);
        }
        let one = 0
        if (this.value.length) {
          one = this.limit - this.value.length
        } else {
          one = this.limit
        }
        uni.chooseImage({
          count: one,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            uni.showLoading({
              title: '上传中...', // 提示的内容,
              mask: true, // 显示透明蒙层，防止触摸穿透,
              success: () => {},
            });
            const resFile = res.tempFiles
            console.log(resFile);
            resFile.forEach((item) => {
              const filePath = item.path;
              this.network().uploadOssImg(filePath)
            })
          },
        })
      },

      delImage(index) {
        this.value.splice(index, 1);
      },

      network() {
        return {
          uploadOssImg: async (filePath) => {
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
                if (!data || !data.key) return
                this.value.push(data.key)
                this.$emit('input', [...this.value])
                uni.hideLoading();
              },
              fail(res1) {
                console.log(res1)
                uni.hideLoading();
              },
            })
          },
          getQiniu: async () => {
            const { data } = await getQiniu()
            console.log('获取七牛信息', data);
            this.token = data.token
          },
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .container{
    display: flex;
    text-align: center;
    flex-wrap: wrap;
    .item:nth-child(3n) {
      margin-right: unset!important;
    }
    .item{
      margin-right: 24rpx;
      margin-bottom: 24rpx;
      position: relative;
      width: 218rpx;
      height: 218rpx;
      background: url("https://qiniu.mfgchn.com/static-imageA/ic_add (2).png") no-repeat;
      background-size: 100% 100%;
      .img,.add{
        width: 100%;
        height: 218rpx;
        vertical-align: middle;
      }
      .add{
        color: #ABB2B7;
        .ic{
          width: 70rpx;
          height: 70rpx;
          margin-bottom: 30rpx;
        }
        .tex{
          font-size: 24rpx;
          margin-top: 8rpx;
        }
      }
      .tips {
        padding: 20rpx;
        position: absolute;
        top: -35rpx;
        right: -20rpx;
        width: 54rpx;
        img {
          width: 24rpx;
          height: 24rpx;
        }
      }
    }
  }
</style>
