<script setup lang="ts">
import { useMainStore } from '../stores/MainStore';
import { ref } from 'vue'

const mainStore = useMainStore()

const onStockClick= (stock:any) => {
  mainStore.curStock = stock
  mainStore.getStockPrices(stock.ts_code)
}
</script>

<template lang="pug">
.card
  .card-body
    .card-title 股票列表 
      span.text-info {{mainStore.curDate}}

    .row
      .col-lg-6(v-for="stock in mainStore.stockList")
        a(@click="onStockClick(stock)" href="javascript:void(0)")
          .card.bg-secondary.mb-2
            .card-body
              .card-title {{stock.name}} | {{stock.symbol}} | {{stock.industry}}
              .row 
                .col-lg-6 
                  h6.small 开盘价: {{stock.open}}
                .col-lg-6 
                  h6.small 收盘价: {{stock.close}}
                .col-lg-6 
                  h6 {{stock.zlkp_desc}}


</template>

