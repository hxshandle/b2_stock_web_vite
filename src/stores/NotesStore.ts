import { defineStore } from 'pinia'
export const useMainStore = defineStore('notes', {
  state: () => ({
    noteList: [],
    curNote: {},
  }),
  actions: {},
})
