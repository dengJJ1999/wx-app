<template>
  <div class="tab-control">
    <div
      class="item"
      v-for="(item,index) in options"
      :key="index"
      :class="{'on':value==index}"
      @click="getIndex(index)">
        {{ item }}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  mounted() {
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getIndex(index) {
      this.$emit('input', index)
    },
    navigateTo(path) {
      this.$router.push(path);
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
.tab-control{
  border-bottom: 1px solid #efefef;
  display: flex;
  min-height: 92rpx;
  height: 92rpx;
  background: #FFFFFF;
  .item{
    height: 92rpx;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #999999;
    border-bottom: 2rpx solid transparent;
    &.on{
      color: #686C71;
      border-bottom: 2rpx solid #6FC3FF;
    }
  }
}
</style>
