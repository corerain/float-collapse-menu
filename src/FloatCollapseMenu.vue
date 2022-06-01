<template>
  <div
    class="float-menu-comp bsizing"
    :style="{
      maxWidth: `${maxWidth}px`
    }"
    @click.stop="focus">
    <div class="float-menu-content flex-c bsizing">
      <span class="float-menu-icon flex-c">
        <img src="./assets/map-pos.svg" alt="" />
      </span>
      <span class="float-menu-text overflow_oneline">
        {{ name }}
      </span>
      <span class="float-menu-arrow-icon"></span>
    </div>

    <div
      v-show="visible"
      :class="[
        'cr-popover cr-float-menu-popover',
        visible ? 'cr-popover-show' : 'cr-popover-hide'
      ]">
      <ul
        :class="[
          'cr-popover-item',
          index === popoverList.length - 1 ? 'cr-popover-item-last' : ''
        ]"
        v-for="(child, index) in popoverList"
        :key="index"
        :style="{
          width: `${popoverItemWidth}px`,
          top: `${child.top}px`,
          left: `${child.left}px`,
          height: `${child.height}px`
        }">
        <li
          v-for="item in child.data"
          :key="item[props.value]"
          :class="[
            'flex-v-c',
            value === item[props.value] ? 'active' : '',
            setNodeHoveBg(hoverFullId, item[props.value] + '') ? 'hover' : ''
          ]"
          @mouseenter="mouseenter($event, item, index)"
          @mouseleave="mouseleave"
          @click.stop="handleSelect(item)">
          <div
            :class="[
              'select-tips-icon',
              value === item[props.value] ? 'active' : ''
            ]">
          </div>
          <div class="select-text overflow_oneline">
            {{ item[props.label] }}
          </div>
          <div
            v-if="item.children && item.children.length"
            class="children-tips-icon flex-c">
            <img class="arrow-right-detail" src="./assets/arrow-right.png" alt="" />
          </div> 
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { addHandle, removeHandle } from '@/util'

export default {
  props: {
    // 原始数据列表
    list: {
      type: Array,
      default: () => []
    },
    // listItem 每条数据对应的字段
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
        children: 'children'
      })
    },
    // 双向绑定数据值
    value: [String, Number],
    // 选中显示框最大长度
    maxWidth: {
      type: Number,
      default: 304
    },
    // 选中显示框最小长度
    minWidth: {
      type: Number,
      default: 180
    },
    // 悬浮菜单item宽度
    popoverItemWidth: {
      type: Number,
      default: 224
    },
    // 边框宽度
    borderWidth: {
      type: Number,
      default: 1.5
    },
    // 页面滚动元素
    scrollEl: {
      type: String,
      default: 'body'
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      popoverList: [],  // 悬浮菜单集合
      visible: false,
      name: '',
      fullId: '',
      symbol: ' / ',
      viewWidth: 0,
      viewHeight: 0,
      margin: 8,
      lineHeight: 40,
      posStr: '',
      hoverFullId: '',
      percent: 0.8, // 悬浮菜单可以滚动的最大百分比高度
      hasInitWidth: false,
      popoverEl: null,
      placement: 'bottom-right'
    }
  },
  created() {
    this.combineData(this.list) 
    this.posStr = this.placement
  },
  mounted() {
    const documentElement = document.documentElement
    this.viewWidth = documentElement.clientWidth
    this.viewHeight = documentElement.clientHeight

    const popoverEl = this.$el.querySelector('.cr-popover')
    const body = document.querySelector('body')
    this.popoverEl = popoverEl

    if (body.append) {
      body.append(popoverEl);
    } else {
      body.appendChild(popoverEl);
    }

    addHandle(document, 'click', this.blur)
    addHandle(window, 'resize', this.blur)

    // 监听滚动 关闭悬浮菜单
    const el = document.querySelector(this.scrollEl)
    addHandle(el, 'scroll', this.scrollSetPos)
  },
  methods: {
    // 初始化组合数据  设置每级的父元素名称、id
    combineData(list, parent) {
      const props = this.props
      const symbol = this.symbol

      list.forEach(item => {
        const name = item[props.label]
        const id = item[props.value]
        const children = item[props.children]

        if (parent) {
          item.fullId = parent.fullId + symbol + id
          item.fullName = parent.fullName + symbol + name
        } else {
          item.fullId = id + ''
          item.fullName = name
        }

        if (children && children.length) {
          this.combineData(children, item)
        }

        if (this.value === id) {
          this.setShowNameSlice(item.fullName)
          this.fullId = item.fullId.includes(symbol) ? item.fullId.split(symbol) : [item.fullId]
        }
      })
    },
    // 更新下拉框列表数据
    updatePopoverList(data) {
      const item = {
        top: 0,
        left: 0,
        height: 0,
        data
      }

      this.popoverList.push(item)
    },
    mouseenter(e, node, parentIndex) {
      this.hoverFullId = node.fullId
      const target = e.target
      this.popoverList = this.popoverList.slice(0, parentIndex + 1)

      const children = node.children
      if (!children || !children.length) {
        return
      }

      this.updatePopoverList(children)
      const cur = this.popoverList[this.popoverList.length - 1]
      const parent = this.popoverList[this.popoverList.length - 2]
      this.setNodePos(target, cur, parent)
    },
    setNodeHoveBg(hoverFullId, nodeId) {
      const symbol = this.symbol

      if (hoverFullId.includes(symbol)) {
        const arr = hoverFullId.split(symbol)

        return arr.includes(nodeId + '')
      }

      return [hoverFullId].includes(nodeId + '')
    },
    mouseleave() {
      // this.popoverList = []
    },
    focus() {
      console.log('float menu focus')
      this.visible = !this.visible
      this.popoverList = []
      
      if (this.list.length) {
        this.updatePopoverList(this.list)
        const firstNode = this.popoverList[0]
        this.setRootPos(firstNode)
      }
    },
    blur() {
      this.visible = false
      this.popoverList = []
      this.posStr = this.placement
      this.hoverFullId = ''
    },
    // 设置根节点元素位置
    setRootPos(node) {
      const popoverItemWidth = this.popoverItemWidth
      const viewWidth = this.viewWidth
      const viewHeight = this.viewHeight
      let top = 0
      let left = 0
      let height = 0
      const el = this.$el
      const box = el.getBoundingClientRect()
      const boxLeft = box.left
      const boxRight = box.right
      const boxBottom = box.bottom
      const boxTop = box.top
      const margin = this.margin
      const percent = this.percent
      const borderPadding = (this.borderWidth + margin) * 2

      // 设置元素相关位置
      const setNodeSizePos = (node, top, left, height) => {
        node.top = top
        node.left = left
        node.height = height
      }

      // 左侧展示 计算右侧剩余空间
      let space = viewWidth - box.left

      // 右侧空间充足
      if (space >= popoverItemWidth) {
        left = boxLeft
      }
      // 右侧空间不足 右侧对齐
      else {
        left = boxRight - popoverItemWidth
      }

      // 底部展示 计算底部空间是否充足
      space = viewHeight - boxBottom
      const nodeHeight = node.data.length * this.lineHeight
      const contentHeight = nodeHeight + borderPadding

      // 底部显示（底部空间充足）
      if (space >= contentHeight + margin) {
        top = boxBottom + margin
        height = contentHeight
        setNodeSizePos(node, top, left, height)
        
        return
      }

      // 底部显示（底部空间不足） 底部空间 >= 上面空间
      if (space < contentHeight + margin && space >= boxTop) {
        top = boxBottom + margin
        height = (space - margin) * percent
        setNodeSizePos(node, top, left, height)
        
        return
      }

      // 上面显示（上面空间充足）
      space = boxTop - margin
      if (space >= contentHeight) {
        top = space - contentHeight
        height = contentHeight
        setNodeSizePos(node, top, left, height)
        
        return
      }

      // 上面显示（上面空间空间不足）上面空间 >= 下面空间
      if (space < contentHeight && boxTop >= viewHeight - boxBottom) {
        top = space * (1 - percent)
        height = space * percent
        setNodeSizePos(node, top, left, height)
      }
    },
    // 设置节点位置
    setNodePos(el, node, parent) {
      const popoverItemWidth = this.popoverItemWidth
      const viewWidth = this.viewWidth
      const viewHeight = this.viewHeight
      let top = 0
      let left = 0
      let height = 0
      const box = el.getBoundingClientRect()
      const boxLeft = box.left
      const boxRight = box.right
      const boxBottom = box.bottom
      const boxTop = box.top
      const margin = this.margin
      const symbol = '-'
      const percent = this.percent
      const borderPadding = (this.borderWidth + margin) * 2
      const nodeHeight = node.data.length * this.lineHeight
      const contentHeight = nodeHeight + borderPadding

      // 左侧显示
      const leftShow = () => {
        const space = boxLeft
        const arr = this.posStr.split(symbol)
        let pos = 'left'

        if (space >= popoverItemWidth) {
          left = boxLeft - popoverItemWidth
        } else {
          left = boxRight
          pos = 'right'
        }

         this.posStr = `${arr[0]}${symbol}${pos}`
      }

      // 右侧显示
      const rightShow = () => {
        const space = viewWidth - boxRight
        const arr = this.posStr.split(symbol)
        let pos = 'right'

        // 右侧空间充足 右侧显示
        if (space >= popoverItemWidth) {
          left = boxRight
        }
        // 右侧空间不足 左侧显示
        else {
          left = boxLeft - popoverItemWidth
          pos = 'left'
        }

        this.posStr = `${arr[0]}${symbol}${pos}`
      }

      // 底部显示
      const bottomShow = () => {
        // 底部展示 计算底部空间
        const space = viewHeight - boxTop
        const arr = this.posStr.split(symbol)
        let pos = 'bottom'

        // 底部空间充足 底部展示
        if (space >= contentHeight) {
          top = boxTop
          height = contentHeight
          this.posStr = `${pos}${symbol}${arr[1]}`

          return
        }

        // 底部空间不足  底部空间大于上部空间 底部展示并且滚动
        if (space < contentHeight && space >= boxBottom) {
          top = boxTop
          height = space * percent
          this.posStr = `${pos}${symbol}${arr[1]}`
          
          return
        }

        // 上面空间充足 上面显示
        if (boxBottom >= contentHeight) {
          top = boxBottom - contentHeight
          pos = 'top'
          height = contentHeight
          this.posStr = `${pos}${symbol}${arr[1]}`
          
          return
        }

        // 上面空间不足 上面空间大于下面空间 上面显示
        if (boxBottom < contentHeight && boxBottom > space) {
          top = boxBottom * (1 - percent)
          pos = 'top'
          height = boxBottom * percent
          this.posStr = `${pos}${symbol}${arr[1]}`
        }
      }

      // 上面显示
      const topShow = () => {
        // 底部展示 计算底部空间
        const space = viewHeight - boxTop
        const arr = this.posStr.split(symbol)
        let pos = 'bottom'

        // 上面空间充足 上面显示
        if (boxBottom >= contentHeight) {
          top = boxBottom - contentHeight
          pos = 'top'
          height = contentHeight
          this.posStr = `${pos}${symbol}${arr[1]}`

          return
        }

        // 上面空间不足 上面空间大于下面空间 上面显示
        if (boxBottom < contentHeight && boxBottom > space) {
          top = boxBottom * (1 - percent)
          pos = 'top'
          height = boxBottom * percent
          this.posStr = `${pos}${symbol}${arr[1]}`

          return
        }

        // 底部空间充足 底部展示
        if (space >= contentHeight) {
          top = boxTop
          height = contentHeight
          this.posStr = `${pos}${symbol}${arr[1]}`

          return
        }

        // 底部空间不足  底部空间大于上部空间 底部展示并且滚动
        if (space < contentHeight && space >= boxBottom) {
          top = boxTop
          height = space * percent
          this.posStr = `${pos}${symbol}${arr[1]}`

          return
        }
      }

      const setPos = (type) => {
        switch(type) {
          case 'left':
            leftShow()
            break

          case 'right':
            rightShow()
            break

          case 'bottom':
            bottomShow()
            break

          case 'top':
            topShow()
            break

          default:
            break
        }
      }

      this.posStr = parent.childPos || this.placement
      const arr = this.posStr.split(symbol)

      for (const key of arr) {
        setPos(key)
      }

      parent.childPos = this.posStr
      node.childPos = this.posStr

      node.top = top
      node.left = left
      node.height = height
    },
    // 选择节点
    handleSelect(node) {
      this.setShowNameSlice(node.fullName)
      this.fullId = node.fullId
      const id = node[this.props.value]

      if (!this.hasInitWidth) {
        this.hasInitWidth = true
        this.$el.style.width = 'auto'
      }
      
      // 双向绑定-选择节点
      // @arg 参数为当前节点 id
      this.$emit('change', id)
      // 选中节点
      // @arg 参数为当前节点 node
      this.$emit('select', node)
      this.blur()
    },
    // name 截取
    setShowNameSlice(name) {
      const fontSize = 18
      const total = name.length
      const fontWidth = name.length * fontSize
      const space = this.maxWidth - 28 - 20 - 16 - 2 - 3 * 18


      if (fontWidth > space) {
        const num = Math.ceil(space / fontSize)
        this.name = `...${name.slice(total - num - 1)}`
      } else {
        this.name = name
      }
    },
    // 页面滚动设置位置
    scrollSetPos() {
      if (!this.visible) {
        return
      }
      
      this.blur()
    },
    // 销毁
    dispose() {
      this.blur()
      const popoverEl = this.popoverEl
      popoverEl.parentNode.removeChild(popoverEl)
      this.popoverEl = null
      
      removeHandle(document, 'click', this.blur)
      removeHandle(window, 'resize', this.blur)
      // 监听滚动 关闭悬浮菜单
      const el = document.querySelector(this.scrollEl)
      removeHandle(el, 'scroll', this.scrollSetPos)
    }
  },
  beforeDestroy() {
    this.dispose()
  }
}
</script>

<style lang="scss" scoped>
.float-menu-comp {
  display: inline-block;
  padding: 0 10px;
  height: 32px;
  background: rgba(217, 227, 242, 0.1) url('./assets/bg.png') 0 0 no-repeat;
  background-size: cover;
  border-left: 1px solid #d9e3f2;
  border-right: 1px solid #d9e3f2;
  cursor: pointer;
}

.cr-popover-hide {
  z-index: -1;
}


.float-menu-icon {
  width: 16px;
  height: 16px;
  color: #60759F;
}

.arrow-right-detail {
  width: 16px;
  height: 16px;
}

svg, img {
  width: 100%;
  height: 100%;
}

.float-menu-arrow-icon {
  width: 12px;
  height: 12px;
  background: url('./assets/area-arrow.png') no-repeat;
  background-size: 12px;
}

.float-menu-content {
  width: 100%;
  height: 100%;
  color: #CCDDFF;
}

.float-menu-text {
  flex: 1;
  margin: 0 8px;
  font-weight: Bold;
  font-size: 18px;
  color: #CCDDFF;
}

.cr-float-menu-popover {
  display: flex;
  cursor: pointer;

  .cr-popover-item {
    overflow: auto;
    padding: 8px;
    background: #1D2330;
    border: 1px solid #435270;
    position: fixed;
    left: 0;

    &.cr-popover-item-last {
      border-bottom: 2px solid #6699ff;
    }

    &::-webkit-scrollbar-thumb {
      background: #7F90B3;
      border-radius: 5px;
    }
  }

  li {
    height: 40px;

    &.hover {
      background: #262E40;
    }
  }

  .select-tips-icon {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    background: url('./assets/check-def.png') 0 0 no-repeat;
    background-size: 100% 100%;

    &.active {
      background: url('./assets/checked.png') 0 0 no-repeat;
      background-size: 100% 100%;
    }
  }

  .select-text {
    margin: 0 8px;
    color: #D9E3F2;
    letter-spacing: 0;
    flex: 1;
    font-size: 14px;
    color: #D9E3F2;
  }

  .children-tips-icon {
    width: 12px;
    height: 12px;
    margin-right: 8px;

    i {
      width: 100%;
      height: 100%;
      color: #fff;
    }
  }
}
</style>