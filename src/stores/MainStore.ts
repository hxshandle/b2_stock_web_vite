import { defineStore } from 'pinia'
import axios from "axios"

export const useMainStore = defineStore('main', {
  state: () => ({
    curDate: null as string | null,
    curStock: null as object | null,
    stockPrices:[],
    stockList: [],
    resultList: []
  }),
  actions: {
    async fetchResultList() {
      let response = await axios.get('/api/fetchResultList')
      let data = response.data
      this.resultList = data
    },
    async getDailyResult(date:string) {
      let response = await axios.get(`/api/getDailyResult/${date}`)
      this.stockList = response.data
      this.curDate = date
    },
    async getStockPrices(ts_code:string) {
      let response = await axios.get(`/api/getStockPrices/${ts_code}`)
      this.stockPrices = response.data
    }
  },
})
