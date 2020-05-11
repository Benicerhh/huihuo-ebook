<template>
  <div class="popup" v-if="popupVisible">
    <transition name="fade">
      <div
        class="popup-bg"
        v-show="popupVisible"
        @click.stop.prevent="hide"
      ></div>
    </transition>
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-show="visible">
        <div class="popup-title" v-if="title && title.length > 0">
          {{ title }}
        </div>
        <div
          class="popup-btn"
          :class="{ danger: item.type === 'danger' }"
          v-for="(item, index) in btn"
          :key="index"
          @click="item.click"
        >
          {{ item.text }}
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "popup",
  data() {
    return {
      popupVisible: false,
      visible: false
    };
  },
  props: {
    title: String,
    btn: Array
  },
  methods: {
    show() {
      this.popupVisible = true;
      setTimeout(() => {
        this.visible = true;
      });
    },
    hide() {
      this.visible = false;
      setTimeout(() => {
        //延迟隐藏，以体现过渡动画效果
        this.popupVisible = false;
      }, 200);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  .popup-bg {
    width: 100%;
    height: 100%;
    z-index: 1100;
  }
  .popup-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
    width: 100%;
    background: white;
    .popup-title {
      width: 100%;
      height: px2rem(44);
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(12);
      line-height: px2rem(14);
      padding: px2rem(15);
      box-sizing: border-box;
      @include center;
      color: #999;
    }
    .popup-btn {
      width: 100%;
      height: px2rem(60);
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(16);
      color: #666;
      font-weight: bold;
      @include center;
      &.danger {
        color: $color-pink;
      }
    }
  }
}
</style>
