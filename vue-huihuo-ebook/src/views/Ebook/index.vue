<template>
  <div class="ebook" ref="ebook">
    <ebook-title></ebook-title>
    <ebook-header></ebook-header>
    <ebook-menu></ebook-menu>
    <ebook-reader></ebook-reader>
    <ebook-bookmark></ebook-bookmark>
    <ebook-footer></ebook-footer>
  </div>
</template>
<script>
import EbookReader from "../../components/Ebook/EbookReader";
import EbookTitle from "../../components/Ebook/EbookTitle";
import EbookMenu from "../../components/Ebook/EbookMenu";
import EbookBookmark from "../../components/Ebook/EbookBookmark";
import EbookHeader from "../../components/Ebook/EbookHeader";
import EbookFooter from "../../components/Ebook/EbookFooter";

import { getReadTime, saveReadTime } from "../../utils/localStorage";
import { ebookMixin } from "../../utils/mixin";

export default {
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  mixins: [ebookMixin],
  watch: {
    offsetY(v) {
      if (!this.menuVisible && this.bookAvailable) {
        if (v > 0) {
          this.move(v);
        } else if (v === 0) {
          this.restore();
        }
      }
    }
  },
  methods: {
    restore() {
      this.$refs.ebook.style.top = 0;
      this.$refs.ebook.style.transition = "all .2s linear";
      setTimeout(() => {
        this.$refs.ebook.style.transition = "";
      }, 200);
    },
    move(v) {
      this.$refs.ebook.style.top = v + "px";
    },
    startLoopReadTime() {
      //阅读时间记录
      let readTime = getReadTime(this.fileName);
      if (!readTime) {
        readTime = 0;
      }
      this.task = setInterval(() => {
        readTime++;
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime);
        }
      }, 1000);
    }
  },
  mounted() {
    this.startLoopReadTime();
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.ebook {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
