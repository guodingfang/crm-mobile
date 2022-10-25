export default {
  preventReClick: {
    inserted: function (el, binding, vNode, oldVnode) {
      el.addEventListener('click', () => {
        if (!el.disabled) {
          el.disabled = true
          // el.style.backgroundColor = '#ccc'
          setTimeout(() => {
            el.disabled = false
            // el.style.backgroundColor = '#1890ff'
          }, binding.value || 1000)
        }
      })
    }
  }
}
