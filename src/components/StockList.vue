<script setup lang="ts">
import { useMainStore } from '../stores/MainStore'
import { ref, onMounted } from 'vue'
import type { Stock } from '../types'

const mainStore = useMainStore()

const onStockClick = (stock: any) => {
  mainStore.changeCurStock(stock)
  mainStore.getStockPrices(stock.ts_code)
}

const switchCandlePartten = (candlePattern: string) => {
  mainStore.candlePattern = candlePattern
  let stockList: Stock[] = []
  switch (candlePattern) {
    case 'engulf':
      stockList = mainStore.engulfStocks
      break
    default:
      stockList = mainStore.starHammerStocks
      break
  }
  mainStore.stockList = stockList
}

onMounted(() => {
  // @ts-ignore
  new PerfectScrollbar('.perfect-scrollbar')
  document.addEventListener('keydown', (event) => {
    if (event.key == 'j') {
      mainStore.walkStockList(1)
    }
    if (event.key == 'k') {
      mainStore.walkStockList(-1)
    }

    if (event.key == 'm' && mainStore.curStock != null) {
      if (mainStore.markedStocks.includes(mainStore.curStock.ts_code)) {
        mainStore.markedStocks.splice(
          mainStore.markedStocks.indexOf(mainStore.curStock.ts_code),
          1
        )
      } else {
        mainStore.markedStocks.push(mainStore.curStock.ts_code)
      }
    }
  })
})
</script>

<template lang="pug">
.card
  .card-body
    .card-title 股票列表 ({{ mainStore.stockList?.length }})
      span.text-info {{ mainStore.curDate }}
    .row
      .clo
        .btn-group
          button.btn.btn-primary.btn-sm(
            @click='switchCandlePartten("star_hammer")',
            :class='{ active: mainStore.candlePattern == "star_hammer" }'
          ) 锤子
          button.btn.btn-primary.btn-sm(
            @click='switchCandlePartten("engulf")',
            :class='{ active: mainStore.candlePattern == "engulf" }'
          ) 吞没
    .perfect-scrollbar(style='height: calc(100vh - 360px); position: relative')
      .row
        .col-lg-6(v-for='stock in mainStore.stockList')
          a.px-1.small(
            @click='onStockClick(stock)',
            href='javascript:void(0)',
            :class='{ "bg-light": mainStore.markedStocks.includes(stock.ts_code), "text-danger": stock.ts_code == mainStore.curStock?.ts_code }'
          ) {{ stock.name }} | {{ stock.symbol }} | {{ stock.industry }}
</template>

