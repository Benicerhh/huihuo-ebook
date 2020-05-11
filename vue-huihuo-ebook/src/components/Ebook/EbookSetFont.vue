<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 0">
      <div class="setting-font-size">
        <div
          class="preview"
          :style="{ fontSize: fontSizeList[0].fontSize + 'px' }"
        >
          A
        </div>
        <div class="select">
          <div
            class="select-wrapper"
            v-for="(item, index) in fontSizeList"
            :key="index"
            @click="setFontSize(item.fontSize)"
          >
            <div class="line"></div>
            <div class="point-wrapper">
              <div class="point" v-show="defaultFontSize === item.fontSize">
                <div class="small-point"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div
          class="preview"
          :style="{
            fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'
          }"
        >
          A
        </div>
      </div>
      <div class="set-font-family" @click="showFontFamilyPopup">
        <div class="set-font-family-text-erapper">
          <span class="setting-font-family-text">{{ defaultFontFamily }}</span>
        </div>
        <div class="set-font-family-icon-erapper">
          <span class="icon-forward"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import { FONT_SIZE_LIST } from "../../utils/book";
import { clearLocalStorage, saveFontSize } from "../../utils/localStorage";
export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontSizeList: FONT_SIZE_LIST
    };
  },
  methods: {
    setFontSize(fontSize) {
      this.setDefaultFontSize(fontSize);
      this.currentBook.rendition.themes.fontSize(fontSize + "px");
      saveFontSize(this.fileName, fontSize);
    },
    showFontFamilyPopup() {
      this.setFontFamilyVisible(true);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.setting-wrapper {
  z-index: 190;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  width: 100%;
  height: px2rem(90);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  .setting-font-size {
    display: flex;
    flex: 2;
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
  .set-font-family {
    flex: 1;
    font-size: px2rem(14);
    @include center;
    .setting-font-family-text-wrapper {
      @include center;
      .setting-font-family-text {
        font-size: px2rem(16);
      }
    }
    .setting-font-family-icon-wrapper {
      .icon-forward {
        padding: 0;
      }
    }
  }
}
.content-mask {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 101;
  display: flex;
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.8);
}
</style>
