export function initL2d(jsonPath = '@/assets/live2d/lily/lily.model3.json') {
  L2Dwidget.init({
    model: { jsonPath },
  })
}
