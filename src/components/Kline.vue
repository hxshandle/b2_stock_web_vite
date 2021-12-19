<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMainStore } from '../stores/MainStore'

const mainStore = useMainStore()
let chart = null
let lastStockPrices: [] | null = null

mainStore.$subscribe((mution, state) => {
  if (lastStockPrices != state.stockPrices) {
    let data = mainStore.stockPrices.map((x) => {
      return [x.trade_date, x.open, x.close, x.low, x.high]
    })
    let options = {
      dataset: {
        source: data,
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 80,
          end: 100,
        },
        {
          show: true,
          type: 'slider',
          top: '90%',
          start: 50,
          end: 100,
        },
      ],
      xAxis: { type: 'category' },
      yAxis: {
        type:'value',
        scale: true
      },
      series: [
        {
          type: 'candlestick',
        },
      ],
    }
    chart.setOption(options)
    lastStockPrices = state.stockPrices
  }
})

onMounted(() => {
  chart = echarts.init(document.getElementById('k-line-chart'))
})
</script>

<template lang="pug">
.card
  .card-body 
    .card-title {{ mainStore.curStock?.name }}
      .row
        .col-12
          #k-line-chart(style='width: 100%; height: 600px')
</template>


