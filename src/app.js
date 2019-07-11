/* eslint-disable no-new */

new Vue({
  el: '#app',
  data: {
    fields: [],
    quoteData: [],
    visibleQuotes: [],
    selectValue: 'all',
    searchValue: '',
    pageSize: 15,
    currentPage: 0
  },
  created() {
    this.getQuoteData()
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredQuotes.length / this.pageSize)
    },
    selectedQuotes() {
      if (this.selectValue === 'all') {
        return this.quoteData
      } else {
        return this.quoteData.filter(item => item.theme === this.selectValue)
      }
    },
    searchedQuotes() {
      if (this.searchValue === '') {
        return this.quoteData
      } else {
        const searchValue = this.searchValue.toLowerCase()
        return this.quoteData.filter(item => {
          const itemValues = Object.values(item).map(value =>
            value.toString().toLowerCase()
          )
          return itemValues.some(value => value.includes(searchValue))
        })
      }
    },
    filteredQuotes() {
      const selectedQuotesIds = this.selectedQuotes.map(item => item.id)
      return this.searchedQuotes.filter(item =>
        selectedQuotesIds.includes(item.id)
      )
    }
  },
  methods: {
    async getQuoteData() {
      try {
        const { data } = await axios.get(
          'https://gist.githubusercontent.com/benchprep/dffc3bffa9704626aa8832a3b4de5b27/raw/quotes.json'
        )
        this.getFields(data)
        this.quoteData = data.map((item, index) => {
          item.id = index
          return item
        })
        this.paginate()
      } catch (error) {
        this.quoteData = 'An error occurred: ' + error
      }
    },
    getFields(data) {
      this.fields = Object.keys(data[0])
    },
    paginate() {
      const start = this.currentPage * this.pageSize
      const end = start + this.pageSize
      this.visibleQuotes = this.filteredQuotes.slice(start, end)
      if (!this.visibleQuotes.length && !this.currentPage) {
        this.updatePage(this.currentPage - 1)
      }
    },
    updatePage(pageNumber) {
      this.currentPage = pageNumber
      this.paginate()
    },
    showPrevPage() {
      return this.currentPage > 0
    },
    showNextPage() {
      return this.currentPage + 1 < this.totalPages
    }
  }
})
