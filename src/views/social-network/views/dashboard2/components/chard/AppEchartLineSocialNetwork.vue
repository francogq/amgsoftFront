<template>
  <e-charts
      ref="line"
      autoresize
      :options="line"
      theme="theme-color"
      auto-resize
  />
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/line'
import theme from './theme.json'

ECharts.registerTheme('theme-color', theme)

export default {
  components: {
    ECharts,
  },
  props: {
    optionData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {

      line: {
        // Make gradient line here
        visualMap: [{
          show: true,
          type: 'continuous',
          min: 0,

          max: 400,
        }],
        grid: {
          width: '95%',
          left: '40px',
          right: '4%',
          containLabel: false,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: [{
          boundaryGap: false,
          data: this.optionData.xAxisData,
        }],
        yAxis: {
          type: 'value',
          splitLine: { show: false },
        },

        // series: {
        //   type: 'line',
        //   name: this.optionData.series.name,
        //   showSymbol: false,
        //   data: this.optionData.series.data,
        //
        // },
        legend: {

          bottom: '5',
          fontWeight: 600,
          fontSize: '30px',
        },
        series: this.optionData.series,
      },
    }
  },

}
</script>

<style>
.echarts {
  width: 100% !important;
}
</style>
