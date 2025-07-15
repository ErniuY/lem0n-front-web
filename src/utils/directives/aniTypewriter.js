const defaultConfig = {
  fontSize: '84px',
  // fontFamily: '"Splatoon2", sans-serif',
  letterSpacing: '2px',
  animationDuration: '5s',
  steps: 30,
  blinkSpeed: '0.75s',
}
export default {
  mounted(el, binding) {
    let config = defaultConfig
    console.log('binding', binding.value)

    // if (binding.value && typeof binding.value === 'string') {
    //   // 类名
    //   const tempEl = document.createElement('div')
    //   tempEl.classList.add(binding.value)
    //   document.body.appendChild(tempEl)
    //   const style = window.getComputedStyle(tempEl)
    //   // config = Object.assign(defaultConfig, style)
    //   console.log({ fontSize: style.fontSize })
    //   config = {
    //     ...defaultConfig,
    //     fontSize: style.fontSize || defaultConfig.fontSize,
    //     fontFamily: style.fontFamily || defaultConfig.fontFamily,
    //     fontWeight: style.fontWeight || defaultConfig.fontWeight,
    //     fontStyle: style.fontStyle || defaultConfig.fontStyle,
    //     letterSpacing: style.letterSpacing || defaultConfig.letterSpacing,
    //   }
    //   document.body.removeChild(tempEl)
    // } else
    if (binding.value && typeof binding.value === 'object') {
      config = Object.assign(defaultConfig, binding.value)
    }
    console.log({ config }, document.fonts)

    // 等待字体加载完成后再继续执行
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        _applyTypewriter(el, config)
      })
    } else {
      // 不支持 fonts API 的浏览器降级处理
      _applyTypewriter(el, config)
    }
  },
  unmounted(el) {
    if (el._aniTypewriter?.observer) {
      el._aniTypewriter.observer.disconnect()
    }
    delete el._aniTypewriter
  },
}

// 注入 typewriter 样式
function applyTypewriterStyles(el, config) {
  Object.assign(el.style, {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    position: 'relative',
    fontSize: config.fontSize,
    fontFamily: config.fontFamily,
    fontWeight: config.fontWeight,
    fontStyle: config.fontStyle,
    letterSpacing: config.letterSpacing,
    borderRight: '1px solid currentColor',
    animation: `
      typing ${config.animationDuration} steps(${config.steps}, end) forwards,
      blink-caret ${config.blinkSpeed} step-end infinite
    `,
  })
}

// 计算文本实际宽度
function calculateTextWidth(el, config) {
  const text = el.textContent || el.innerText

  const tempEl = document.createElement('span')
  tempEl.textContent = text

  const style = window.getComputedStyle(el)

  Object.assign(tempEl.style, {
    position: 'absolute',
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    letterSpacing: style.letterSpacing,
    wordSpacing: style.wordSpacing,
  })

  document.body.appendChild(tempEl)
  const width = tempEl.offsetWidth
  document.body.removeChild(tempEl)

  return width
}
function _applyTypewriter(el, config) {
  console.log('_applyTypewriter')
  applyTypewriterStyles(el, config)

  const computedWidth = calculateTextWidth(el, config)
  el.style.width = `${computedWidth}px`

  const observer = new MutationObserver(() => {
    const newWidth = calculateTextWidth(el, config)
    el.style.width = `${newWidth}px`
  })

  observer.observe(el, {
    childList: true,
    subtree: true,
    characterData: true,
  })

  el._aniTypewriter = { observer }
}
