import Vue from 'vue'

Vue.filter('numberPrecision2', number => {
  if (number) return (Math.round(number * 100) / 100).toFixed(2).toString()
  return '0.00'
})
