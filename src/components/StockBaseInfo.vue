<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue'
import { useMainStore } from '../stores/MainStore'
import { storeToRefs } from 'pinia'

const { proxy } = getCurrentInstance()

const cmpId = 'cmp_stock_base_info'
const mainStore = useMainStore()
onMounted(() => {
})
</script>

<template lang="pug">
.row
  .col-12
    hr

</template>