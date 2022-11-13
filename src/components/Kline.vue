<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMainStore } from '../stores/MainStore'
import StockBaseInfoVue from './StockBaseInfo.vue'
import type { DailyPrice } from '../types'

const mainStore = useMainStore()
let chart: any = null
let lastStockPrices: DailyPrice[] | null = null
const selectedDetailInfo = ref({
  totalCount:'',
  startDate: '',
  endDate: '',
  startClosePrice: 0 as number,
  endClosePrice: 0 as number,
  closeChgPect: 0 as string | number,
  highestPrice: 0 as number,
  lowestPrice: 0 as number
})

const doQuery = () => {
  mainStore.queryStockBySymbol(mainStore.stockSymbolQuery)
}

const resetDetailInfo = () => {
  let d = selectedDetailInfo.value
  d.totalCount = ''
  d.startDate = ''
  d.endDate = ''
  d.startClosePrice = 0
  d.endClosePrice = 0
  d.closeChgPect = 0
  d.highestPrice = 0
  d.lowestPrice = 0
}

const onBrushSelected = (params: any) => {
  let selectedIndex = params.batch[0].selected[0].dataIndex
  let totalCount = selectedIndex.length
  let bars = selectedIndex.map((x: number) => mainStore.stockPrices[x])
  let closePrices = bars.map((x: any) => x.close)
  let highPrices = bars.map((x: any) => x.high)
  let lowPrices = bars.map((x: any) => x.low)
  // 收盘价的涨跌幅度
  if (totalCount == 0) {
    resetDetailInfo()
    return
  }
  let closeChgPect = (
    (100 * (closePrices[totalCount - 1] - closePrices[0])) /
    closePrices[0]
  ).toFixed(2)
  let d = selectedDetailInfo.value
  d.totalCount = totalCount
  d.startDate = mainStore.stockPrices[selectedIndex[0]].trade_date
  d.endDate = mainStore.stockPrices[selectedIndex[totalCount - 1]].trade_date
  d.startClosePrice = mainStore.stockPrices[selectedIndex[0]].close
  d.endClosePrice = mainStore.stockPrices[selectedIndex[totalCount - 1]].close
  d.closeChgPect = closeChgPect
  d.highestPrice = Math.max(...highPrices)
  d.lowestPrice = Math.min(...lowPrices)
}

mainStore.$subscribe((mution, state) => {
  if (lastStockPrices != state.stockPrices) {
    let data = mainStore.stockPrices.map((x: DailyPrice) => {
      return [
        x.trade_date,
        x.open,
        x.close,
        x.low,
        x.high,
        x.vol,
        x.close > x.open ? 1 : -1,
        x.pct_chg.toFixed(2),
      ]
    })
    data.unshift([
      'date',
      'open',
      'close',
      'low',
      'high',
      'vol',
      'vol_indent',
      'pec_chg',
    ])
    let options = {
      dataset: {
        source: data,
      },
      visualMap: {
        show: false,
        seriesIndex: 1,
        dimension: 6,
        pieces: [
          {
            value: 1,
            color: '#eb5454',
          },
          {
            value: -1,
            color: '#47b262',
          },
        ],
      },
      toolbox: {
        feature: {
          brush: {
            type: ['lineX', 'clear'],
            title: {
              lineX: '选择',
              clear: '清除',
            },
          },
        },
      },
      brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        throttleType: 'debounce', //开启选中延迟后调用回调延迟
        throttleDelay: 600, //选中延迟后调用回调延迟时
        // toolbox: ['rect', 'clear'],
        outOfBrush: {
          colorAlpha: 1,
        },
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
        // @ts-ignore
        position: function (pos, params, el, elRect, size) {
          const obj = {
            top: 10,
          }
          // @ts-ignore
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
    // 清空选择框
    chart.dispatchAction({
      type: 'brush',
      areas: [],
    })
    chart.setOption(options)
    chart.on('brushselected', onBrushSelected)
    lastStockPrices = state.stockPrices
  }
})

onMounted(() => {
  // @ts-ignore
  chart = echarts.init(document.getElementById('k-line-chart'))
})
</script>

<template lang="pug">
.row
  .col-8
    .card
      .card-body 
        .form.mb-2
          .input-group
            input#ipt-stock-symbol-query.form-control(
              @keyup.enter='doQuery',
              type='text',
              placeholder='股票代码',
              size='6',
              maxlength='6',
              v-model='mainStore.stockSymbolQuery'
            )
            button#btn-search.btn.btn-primary(type='button', @click="doQuery")
              | 查询
        .card-title {{ mainStore.curStockBaseInfo.info.name }}
          span(
            :class='{ "text-danger": mainStore.curStockBaseInfo.last_price.pct_chg > 0, "text-success": mainStore.curStockBaseInfo.last_price.pct_chg <= 0 }'
          ) &nbsp;&nbsp;&nbsp;&nbsp;{{ mainStore.curStockBaseInfo?.last_price?.pct_chg.toFixed(2) }}%
          .row
            .col-12
              StockBaseInfoVue

            .col-12
              #k-line-chart(style='width: 100%; height: calc(100vh - 216px)')
  .col-4 
    .card
      .card-body
        .row
          .col-12
            p 交易天数：{{ selectedDetailInfo.totalCount }}
          .col-4
            p 开始日期：{{ selectedDetailInfo.startDate }}
          .col-4
            p 结束日期：{{ selectedDetailInfo.endDate }}
        .row
          .col-4
            p 起始收盘价：{{ selectedDetailInfo.startClosePrice }}
          .col-4
            p 结束收盘价：{{ selectedDetailInfo.endClosePrice }}
          .col-4
            p 涨跌幅：{{ selectedDetailInfo.closeChgPect }}%
          .col-4
            p 最高价{{ selectedDetailInfo.highestPrice }}
          .col-4
            p 最低价：{{ selectedDetailInfo.lowestPrice }}
          .col-4
            p 最大回撤：{{ ((100 * (selectedDetailInfo.highestPrice - selectedDetailInfo.lowestPrice)) / selectedDetailInfo.highestPrice).toFixed(2) }}%
</template>
