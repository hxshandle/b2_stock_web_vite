<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMainStore } from '../stores/MainStore'
import StockBaseInfoVue from './StockBaseInfo.vue'

const mainStore = useMainStore()
let chart = null
let lastStockPrices: [] | null = null

mainStore.$subscribe((mution, state) => {
  if (lastStockPrices != state.stockPrices) {
    let data = mainStore.stockPrices.map((x) => {
      return [
        x.trade_date,
        x.open,
        x.close,
        x.low,
        x.high,
        x.vol,
        x.close > x.open ? 1 : -1,
        x.pct_chg.toFixed(2)
      ]
    })
    data.unshift(['date', 'open', 'close', 'low', 'high', 'vol','vol_indent', 'pec_chg'])
    let options = {
      dataset: {
        source: data,
      },
       visualMap: {
         show:false,
        seriesIndex: 1,
        dimension:6,
        pieces: [
          {
            value: 1,
            color: '#eb5454'
          },
          {
            value: -1,
            color: '#47b262'
          }
        ]
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000',
        },
        position: function (pos, params, el, elRect, size) {
          const obj = {
            top: 10,
          }
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
          return obj
        },
        // extraCssText: 'width: 170px'
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all',
          },
        ],
        label: {
          backgroundColor: '#777',
        },
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          height: '50%',
        },
        {
          left: '10%',
          right: '8%',
          top: '63%',
          height: '16%',
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 80,
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          top: '85%',
          start: 80,
          end: 100,
        },
      ],
      xAxis: [{ type: 'category' }, { type: 'category', gridIndex: 1 }],
      yAxis: [
        {
          type: 'value',
          scale: true,
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          type: 'candlestick',
          encode: {
            tooltip: [1, 2, 3, 4, 7],
            x: 0,
            y: [1, 2, 3, 4],
          },
        },
        {
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          encode: {
            tooltip: [5],
            x: 0,
            y: [5, 6],
          },
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
      span(:class='{"text-danger": mainStore.curStockBaseInfo.last_price.pct_chg > 0, "text-success": mainStore.curStockBaseInfo.last_price.pct_chg <= 0}') &nbsp;&nbsp;&nbsp;&nbsp;{{ mainStore.curStockBaseInfo?.last_price?.pct_chg.toFixed(2)}}%
      .row
        .col-12
          StockBaseInfoVue
          
        .col-12
          #k-line-chart(style='width: 100%; height: calc(100vh - 216px)')
</template>


