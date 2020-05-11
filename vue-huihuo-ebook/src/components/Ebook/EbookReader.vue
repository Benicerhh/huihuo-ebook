<template>
  <div class="ebook-reader">
    <div
      class="ebook-reader-mask"
      @touchmove="move"
      @touchend="moveEnd"
      @mousedown.left="onMouseEnter"
      @mousemove.left="onMouseMove"
      @mouseup.left="onMouseEnd"
      @click="onMaskClick"
    ></div>
    <div id="read" @click="toggleTitleAndMenu"></div>
  </div>
</template>
<script>
import Epub from "epubjs";
import { ebookMixin } from "../../utils/mixin";
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation
} from "../../utils/localStorage";
import { getLocalForage } from "../../utils/localForage";
global.ePub = Epub;
export default {
  mixins: [ebookMixin],
  methods: {
    move(e) {
      let offsetY = 0;
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
        this.setOffsetY(offsetY);
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY;
      }
      e.preventDefault();
      e.stopPropagation();
    },
    moveEnd(e) {
      this.setOffsetY(0);
      this.firstOffsetY = 0;
    },
    onMouseEnter(e) {
      this.mouseMove = 1;
      this.mouseStartTime = e.timeStamp;
      e.preventDefault();
      e.stopPropagation();
    },
    onMouseMove(e) {
      if (this.mouseMove === 1) {
        this.mouseMove = 2;
      } else if (this.mouseMove === 2) {
        let offsetY = 0;
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY;
          this.setOffsetY(offsetY);
        } else {
          this.firstOffsetY = e.clientY;
        }
      }
      e.preventDefault();
      e.stopPropagation();
    },
    onMouseEnd(e) {
      if (this.mouseMove === 2) {
        this.setOffsetY(0);
        this.firstOffsetY = 0;
        this.mouseMove = 3;
      }
      this.mouseEndTime = e.timeStamp;
      const time = this.mouseEndTime - this.mouseStartTime;
      if (time < 200) {
        this.mouseMove = 1;
      }
      e.preventDefault();
      e.stopPropagation();
    },
    onMaskClick(e) {
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage();
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage();
      } else {
        this.toggleTitleAndMenu();
      }
    },
    prevPage() {
      //调用Rendition的prev方法返回上一页
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
        });
      }
      this.hideTitleAndMenu();
    },
    nextPage() {
      //调用Rendition的next方法返回上一页
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        });
      }
      this.hideTitleAndMenu();
    },
    toggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1);
        this.setFontFamilyVisible(false);
      }
      this.setMenuVisible(!this.menuVisible);
    },

    initFontSize() {
      //读取localStorage中的FontSize
      let fontSize = getFontSize(this.fileName);
      if (fontSize) {
        this.rendition.themes.fontSize(fontSize);
        this.setDefaultFontSize(fontSize);
      } else {
        saveFontSize(this.fileName, this.defaultFontSize);
      }
    },
    initFontFamily() {
      //读取localStorage中的Font
      let font = getFontFamily(this.fileName);
      if (font) {
        this.rendition.themes.font(font);
        this.setDefaultFontFamily(font);
      } else {
        saveFontFamily(this.fileName, this.defaultFontFamily);
      }
    },
    initTheme() {
      //初始化主题
      let defaultTheme = getTheme(this.fileName);
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name;
        saveTheme(this.fileName, defaultTheme);
      }
      this.setDefaultTheme(defaultTheme);
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style);
      });
      this.rendition.themes.select(defaultTheme);
    },
    initGesture() {
      this.rendition.on("touchstart", event => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on("touchend", event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX;
        const time = event.timeStamp - this.touchStartTime;
        //根据手势事件实现翻页功能
        if (time < 500 && offsetX > 40) {
          this.prevPage();
        } else if (time < 500 && offsetX < -40) {
          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
        //组织默认事件和冒泡
        event.preventDefault();
        event.stopPropagation();
      });
    },
    initRendition() {
      //生成Rendition对象
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight,
        method: "default"
      });
      //通过Rendition对象的display方法渲染电子书
      const location = getLocation(this.fileName);
      this.display(location, () => {
        this.initFontSize();
        this.initFontFamily();
        this.initTheme();
        this.initGlobalStyle();
      });
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          )
        ]).then(() => {});
      });
    },
    parseBook() {
      //解析电子书的封面
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url);
        });
      });
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata);
      });
      this.book.loaded.navigation.then(nav => {
        //console.log(nav)
        //获取电子书的目录
        const navItem = (function flatten(arr) {
          return [].concat(...arr.map(v => [v, ...flatten(v.subitems)]));
        })(nav.toc);
        //将树状目录结构转化为一维数组
        function find(item, v = 0) {
          const parent = navItem.filter(it => it.id === item.parent)[0];
          return !item.parent ? v : parent ? find(parent, ++v) : v;
        }

        navItem.forEach(item => {
          item.level = find(item);
          item.total = 0;
          item.pagelist = [];
          if (item.href.match(/^(.*)\.html$/)) {
            item.idhref = item.href.match(/^(.*)\.html$/)[1];
          } else if (item.href.match(/^(.*)\.xhtml$/)) {
            item.idhref = item.href.match(/^(.*)\.xhtml$/)[1];
          }
        });
        this.setNavigation(navItem);
      });
    },
    initEpub(url) {
      //const url =process.env.VUE_APP_RES_URL + "/epub/" + this.fileName + ".epub";
      //电子书的解析和渲染
      //生成Ebook对象
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.initRendition();
      this.initGesture();
      this.parseBook();
      this.book.ready
        .then(() => {
          //分页
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          );
        })
        .then(locations => {
          //console.log(locations);
          this.setBookAvailable(true);
          this.refreshLocation();
        });
    }
  },
  mounted() {
    const books = this.$route.params.fileName.split("|");
    const fileName = books[1];
    //读取离线缓存
    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        //电子书有离线缓存
        //console.log("找到离线资源");
        this.setfileName(books.join("/")).then(() => {
          this.initEpub(blob);
        });
      } else {
        //获取在线静态资源的路径
        this.setfileName(books.join("/")).then(() => {
          const url =
            process.env.VUE_APP_EPUB_URL + "/" + this.fileName + ".epub";
          this.initEpub(url);
        });
      }
    });
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
