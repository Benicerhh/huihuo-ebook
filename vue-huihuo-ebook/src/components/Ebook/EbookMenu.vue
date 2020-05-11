<template>
  <div class="menu-bar">
    <ebook-set-font></ebook-set-font>
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        v-show="menuVisible"
        :class="{ 'hide-box-shadow': !menuVisible || settingVisible >= 0 }"
      >
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-a" @click="showSetting(0)">A</span>
        </div>
      </div>
    </transition>
    <ebook-set-font-popup></ebook-set-font-popup>
    <ebook-set-theme></ebook-set-theme>
    <ebook-set-progress></ebook-set-progress>
    <ebook-slide></ebook-slide>
  </div>
</template>

<script>
  //import ContentView from "./Content.vue";
  import { ebookMixin } from '../../utils/mixin'
  import EbookSetFont from './EbookSetFont'
  import EbookSetFontPopup from './EbookSetFontPopup'
  import EbookSetTheme from './EbookSetTheme'
  import EbookSetProgress from './EbookSetProgress'
  import EbookSlide from './EbookSlide'

  export default {
    mixins: [ebookMixin],
    components: {
      EbookSetFont,
      EbookSetFontPopup,
      EbookSetTheme,
      EbookSetProgress,
      EbookSlide
    },
    methods: {
      showSetting(tag) {
        this.setSettingVisible(tag)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../assets/styles/global.scss';
  .menu-bar {
    .menu-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 200;
      display: flex;
      width: 100%;
      height: px2rem(48);
      background: white;
      box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
      font-size: px2rem(20);
      &.hide-box-shadow {
        box-shadow: none;
      }
      .icon-wrapper {
        flex: 1;
        @include center;
      }
    }
    .setting-wrapper {
      z-index: 181;
      position: absolute;
      bottom: px2rem(48);
      left: 0;
      width: 100%;
      height: px2rem(60);
      background: white;
      box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
      .setting-font-size {
        display: flex;
        height: 100%;
        .preview {
          flex: 0 0 px2rem(40);
          @include center;
        }
        .select {
          display: flex;
          flex: 1;
          .select-wrapper {
            flex: 1;
            align-items: center;
            display: flex;
            &:first-child {
              .line {
                &:first-child {
                  border-top: none;
                }
              }
            }
            &:last-child {
              .line {
                &:last-child {
                  border-top: none;
                }
              }
            }
            .line {
              flex: 1;
              height: 0;
              border-top: px2rem(1) solid #ccc;
            }
            .point-wrapper {
              flex: 0 0 0;
              position: relative;
              width: 0;
              height: px2rem(7);
              border-left: px2rem(1) solid #ccc;
              .point {
                position: absolute;
                top: px2rem(-8);
                left: px2rem(-8);
                width: px2rem(20);
                height: px2rem(20);
                border-radius: 50%;
                background: white;
                border: px2rem(1) solid #ccc;
                box-shadow: 0 px2rem(2) rgba(0, 0, 0, 0.15);
                @include center;
                .small-point {
                  width: px2rem(5);
                  height: px2rem(5);
                  border-radius: 50%;
                  background: black;
                }
              }
            }
          }
        }
      }
      .setting-theme {
        height: 100%;
        display: flex;
        .setting-theme-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: px2rem(5);
          box-sizing: border-box;
          .preview {
            flex: 1;
            border: px2rem(1) solid #ccc;
            &.no-border {
              border: none;
            }
          }
        }
        .text {
          flex: 0 0 px2rem(30);
          font-size: px2rem(14);
          color: #999;
          @include center;
          &.selected {
            color: #333;
          }
        }
      }
      .setting-progress {
        position: relative;
        width: 100%;
        height: 100%;
        .text-wrapper {
          @include center;
          span {
            font-size: px2rem(12);
            top: 0;
          }
        }
        .progress-wrapper {
          width: 100%;
          height: 100%;
          @include center;
          padding: 0 px2rem(30);
          box-sizing: border-box;
          .progress {
            width: 100%;
            -webkit-appearance: none;
            height: px2rem(2);
            background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
            background-size: 0 100%;
            &:focus {
              outline: none;
            }
            &::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: px2rem(14);
              width: px2rem(14);
              border-radius: 50%;
              background: white;
              box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
            }
          }
        }
      }
    }
    .content-mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 181;
      display: flex;
      width: 100%;
      height: 100%;
      background: rgba(51, 51, 51, 0.8);
    }
  }
</style>
