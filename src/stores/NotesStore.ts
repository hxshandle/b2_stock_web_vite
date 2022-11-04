import { defineStore } from 'pinia'
import axios from 'axios'
export const useMainStore = defineStore('notes', {
  state: () => ({
    noteList: [],
    curNote: {},
  }),
  actions: {},
})
