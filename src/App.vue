<script>
    export default {
        onLaunch: function() {
            console.log('App Launch')
        },
        onShow: function() {
            console.log('App Show')
        },
        onHide: function() {
            console.log('App Hide')
        }
    }
</script>

<style lang="scss">
    @import url("@/components/u-parse/u-parse.css");
    /*@import '~@/assets/styles/mixins.scss';        !*Mixins指令*!*/
    @import '~@/assets/styles/quill.core.min.css'; /*富文本编辑器默认样式*/
    /*@import url("~mpvue-wxparse/src/wxParse.css");*/
    /*@import '~@/assets/font/iconfont.css';         !*图标字体*!*/



</style>
