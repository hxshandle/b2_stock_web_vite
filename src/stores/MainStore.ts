import { defineStore } from 'pinia'
import axios from "axios"
import { DailyPrice } from '../types';

export const useMainStore = defineStore('main', {
  state: () => ({
    curDate: null as string | null,
    curStock: null as object | null,
    curStockBaseInfo: {
      info: {
        name: ''
      },
      last_price: {
        pct_chg: 0
      }
    },
    stockSymbolQuery: '',
    candlePattern: 'star_hammer',
    stockPrices:[] as DailyPrice[],
    lastStockPrices: [] as DailyPrice[],
    stockList: [] as [],
    engulfStocks: [] as [],
    starHammerStocks:[] as [],
    resultList: [] as [],
    markedStocks: [] as []
  }),
  actions: {
    changeCurStock(stock: any) {
      this.curStock = stock
      this.curStockBaseInfo.info = stock
    },
    async fetchResultList() {
      let response = await axios.get('/api/fetchResultList')
      let data = response.data
      this.resultList = data
    },
    async getDailyResult(date:string) {
      let response = await axios.get(`/api/getDailyResult/${date}`)
      this.stockList = response.data.star_hammer
      this.starHammerStocks = response.data.star_hammer
      this.engulfStocks = response.data.engulf
      this.candlePattern = 'star_hammer',
      this.curDate = date
    },
    async getStockPrices(ts_code:string) {
      let response = await axios.get(`/api/getStockPrices/${ts_code}`)
      this.stockPrices = response.data
      this.curStockBaseInfo.last_price= response.data[response.data.length - 1]
    },
    async queryStockBySymbol(code:string) {
      let response = await axios.get(`/api/getStockPrices_v2/${code}`)
      this.lastStockPrices = this.stockPrices
      this.stockPrices = response.data.prices
      this.curStockBaseInfo.info = response.data.info
      this.curStockBaseInfo.last_price= this.stockPrices[this.stockPrices.length - 1]
    },
    walkStockList(towards: number) {
      if (this.stockList.length == 0) {
        return
      }
      if (this.curStock == null) {
        this.curStock = this.stockList[0]
        this.getStockPrices(this.curStock.ts_code)
        return
      }
      let curIndex = this.stockList.findIndex(x => x.ts_code == this.curStock.ts_code)
      let newIndex = curIndex + towards
      if (newIndex < 0 || newIndex == this.stockList.length) {
        return
      }
      this.changeCurStock(this.stockList[newIndex])
      this.getStockPrices(this.curStock.ts_code)
    }
  },
})
