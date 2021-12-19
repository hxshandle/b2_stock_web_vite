<script setup lang="ts">
import { useMainStore } from '../stores/MainStore';
import { ref, onMounted } from 'vue'

const mainStore = useMainStore()

const onStockClick= (stock:any) => {
  mainStore.curStock = stock
  mainStore.getStockPrices(stock.ts_code)
}

onMounted(()=>{
  document.addEventListener('keydown', (event)=>{
    if (event.key =='j') {
      mainStore.walkStockList(1)
    }
    if (event.key == 'k') {
      mainStore.walkStockList(-1)
    }
  });
})

</script>

<template lang="pug">
.card
  .card-body
    .card-title 股票列表 ({{mainStore.stockList.length}}) 
      span.text-info {{mainStore.curDate}}

    .row
      .col-lg-6(v-for="stock in mainStore.stockList")
        a(@click="onStockClick(stock)" href="javascript:void(0)" :class="{ 'text-danger': stock.ts_code == mainStore.curStock?.ts_code }") {{stock.name}} | {{stock.symbol}} | {{stock.industry}}



</template>

