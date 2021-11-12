(function () {
  const winWidth = document.documentElement.offsetWidth || document.body.offsetWidth
  const oHtml = document.getElementsByTagName('html')[0]
  oHtml.style.fontSize = 100 * winWidth / 375 + 'px'
})()

window.onresize = function () {
  const winWidth = document.documentElement.offsetWidth || document.body.offsetWidth
  const oHtml = document.getElementsByTagName('html')[0]
  oHtml.style.fontSize = 100 * winWidth / 375 + 'px'
}
