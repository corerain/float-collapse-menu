/*
 * @Descripttion: 
 * @version: 
 * @Author: Jianyong Wang
 * @Date: 2020-06-04 15:19:36
 * @LastEditors: Jianyong Wang
 * @LastEditTime: 2022-05-12 16:12:24
 */
const merge = function(def, opt) {
  for(let key in opt) {
    // eslint-disable-next-line no-prototype-builtins
    if (opt.hasOwnProperty(key)) {
      def[key] = opt[key]
    }
  }

  return def
}

//  事件绑定兼容
const addHandle = (dom, type, fn) => {
  if (!dom) {
    return
  }

  if (document.addEventListener) {
    dom.addEventListener(type, fn, false)
  } else if (document.attachEvent) {
    dom.attachEvent('on' + type, fn)
  } else {
    let oldDomFun = dom['on' + type]
    dom['on' + type] = function() {
      oldDomFun()
      fn && fn()
    }
  }
}

//  事件解绑
const removeHandle = (dom, type, fn) => {
  if (!dom) {
    return
  }
  
  if (document.removeEventListener) {
    dom.removeEventListener(type, fn)
  } else if (document.detachEvent) {
    dom.detachEvent('on' + type, fn)
  } else {
    dom['on' + type] = null
  }
}


export {
  merge,
  addHandle,
  removeHandle
}