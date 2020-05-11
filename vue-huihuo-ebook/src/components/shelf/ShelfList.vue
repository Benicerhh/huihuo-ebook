<template>
  <div class="shelf-list" :style="{top:shelfListTop}">
    <transition-group name="list" tag="div" id="shelf-list">
      <div class="shelf-list-item" v-for="item in data" :key="item.id">
        <shelf-item :data="item" :style="{height:itemHeight}"></shelf-item>
        <div class="shelf-list-item-title">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItem from './ShelfItem'
  import { realPx, px2rem } from '../../utils/utils'
  export default {
    mixins: [storeShelfMixin],
    props: {
      top: {
        type: Number,
        default: 94
      },
      data: {
        type: Array
      }
    },
    components: {
      ShelfItem
    },
    computed: {
      itemHeight() {
        //动态计算高度 宽高比5:7
        return ((window.innerWidth - realPx(120)) / 3 / 5) * 7 + 'px'
      },
      shelfListTop() {
        return px2rem(this.top) + 'rem'
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../assets/styles/global.scss';
  .shelf-list {
    position: absolute;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    #shelf-list {
      display: flex;
      flex-flow: row wrap;
      padding: 0 px2rem(15);
      box-sizing: border-box;
    }
    .shelf-list-item {
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: px2rem(15);
      box-sizing: border-box;
      &.list-leave-active {
        display: none;
      }
      &.list-move {
        transition: transform 0.5s;
      }
      .shelf-list-item-title {
        margin-top: px2rem(10);
      }
    }
  }
</style>