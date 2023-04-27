<template>
  <div
    class="masking" @touchmove.stop="touchmoveHandler"
    @catchtouchmove="touchmoveHandler"
    v-if="up">
    <div class="position">
      <div class="new-people">
        <img class="bck" mode='aspectFill' src="https://qiniu.runworld.com.cn/assets/images/up.png" alt="">
        <img class="close-icon" @click.stop="onSure" src="https://qiniu.runworld.com.cn/assets/images/ic_popup_close.png" alt="">
        <div class="footer">
          <p class="black">恭喜升级<span>{{ value.member_grade_vo.next_name }}</span></p>
          <p class="gray">您的积分已到达{{ value.member_grade_vo.score }}升级身份</p>
          <div class="btn-green" @click="onSure">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'modal',
    props: {
      value: Object,
      default: {},
    },
    data() {
      return {
        up: this.value.member_grade_vo,
      }
    },
    methods: {
      onSure() {
        this.up = false;
        this.$emit('on-sure', true);
      },
    },
  }
</script>

<style lang='scss' scoped>
  .masking{
    width: 100vw;
    height: 100vh;
    background:rgba(0,0,0,.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    .position{
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      top: 45%;
      .new-people{
        height: 9rem;
        width: 5.92rem;
        /*background: url('https://qiniu.runworld.com.cn/assets/images/pic_popup1.png') center no-repeat;*/
        /*background-size: contain;*/
        text-align: center;
        position: relative;
        box-sizing: border-box;
        .bck{
          height: 9rem;
          width: 5.92rem;
          border-radius: 0.25rem;
          img{
            height: 9rem;
            width: 5.92rem;
            border-radius: 0.25rem;
          }
        }
        .close-icon{
          width: 0.24rem;
          height: 0.24rem;
          position: absolute;
          top: 2.5rem;
          right: 0.12rem;
          padding: 0.2rem;
        }
        .footer{
          position: absolute;
          bottom: 0.4rem;
          left: 1.1rem;
          .black{
            font-size:0.38rem;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height: 0.9rem;
            span{
              color:#FBB11B;
            }
          }
          .gray{
            font-size:0.3rem;
            font-weight:400;
            color:rgba(153,153,153,1);
          }
          .btn-green{
            width:2.72rem;
            height:0.8rem;
            background:linear-gradient(115deg,rgba(122,232,231,1) 0%,rgba(34,164,163,1) 100%);
            border-radius:0.4rem;
            color: #FFFFFF;
            font-size: 0.32rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0.3rem auto auto auto;
          }
        }
      }
    }
  }
</style>
