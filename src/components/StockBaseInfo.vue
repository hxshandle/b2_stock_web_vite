<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue'
import { useMainStore } from '../stores/MainStore'
import { storeToRefs } from 'pinia'

const { proxy } = getCurrentInstance()
const labels = ['L1', 'L2', 'L3', 'L4']
const cmpId = 'cmp_stock_base_info'
const mStore = useMainStore()
onMounted(() => {
  console.log(proxy)
  document
    .querySelectorAll('#cmp_stock_base_info .form-outline')
    .forEach((formOutline) => {
      new mdb.Input(formOutline).init()
    })
})
</script>

<template lang="pug">

.card.mt-4(:id='cmpId')
  .card-body
    .card-title this is stock base info
    .card-text 
      .row
        .card.col.mx-3.bg-danger(v-for='lbl in labels')
          .card-body
            span {{ lbl }}
</template>