<script setup lang="ts">
import { onMounted, ref } from 'vue'
import StockBaseInfoVue from './StockBaseInfo.vue'
import StockListVue from './StockList.vue'
import KlineVue from './Kline.vue'
import { useMainStore } from '../stores/MainStore'

const mainStore = useMainStore()

onMounted(() => {
  mainStore.fetchResultList()
})
const onResultClick = (date:string) => {
  mainStore.getDailyResult(date)
}


</script>

<template lang="pug">
.container-fluid.py-4

  
  .row
    .col-lg-3
      .card 
        .card-body
          .card-title 结果日期
          .col
            .btn-group
              button.btn.btn-primary.btn-sm(v-for="d in mainStore.resultList" @click="onResultClick(d)" :class="{active: mainStore.curDate == d}") {{d}}
      StockListVue.mt-2
    .col-lg-9
      KlineVue
      
</template>