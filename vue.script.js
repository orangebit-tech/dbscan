var app = new Vue({
	el: "#app",
  watch: {
    async searchQuery(n, o){
      var start = new Date().getTime()
      if(n.length > 2){
        if(this.wait == false){
          setTimeout(async () => {
            this.fetchResults();
            this.wait = false
          }, 300)
        }
        this.wait = true;
      }
      if(n.length == 0 && o && o.length > 0){
        setTimeout(async () => {
          await this.fetchResults();
          this.wait = false
        }, 200)
      }
    },
    async searchInColumns(n, o){
      if(!this.wait){
        if(n == true){
          this.showColumns = n    
        }
        setTimeout(async () => {
          this.fetchResults();
          this.wait = false
        }, 300)
      }
      this.wait = true;
    },
    async showColumns(n, o){
      if(!this.wait){
        if(n == false){
          this.keysOnly = n
        }
        setTimeout(async () => {
          this.fetchResults();
          this.wait = false
        }, 200)
       }
       this.wait = true;
    },
    async keysOnly(n, o){
      if(!this.wait){
        if(n == true){
          this.showColumns = n      
        }
        setTimeout(async () => {
          this.fetchResults();
          this.wait = false
        }, 200)  
      }
      this.wait = true;
    },
    async keySelected(n, o){
      if(!this.wait){
        setTimeout(async () => {
          this.fetchResults();
          this.wait = false
        }, 200)
      }
      this.wait = true;
    },
  },
	data: {
    searchInColumns:        false,
    limit:                  20,
    keySelectedTable:       '',
    keySelectedDB:          '',
    keySelected:            '',
    pageLoaded:             false,
    wait:                   false,
    searchQuery:            '',
    showColumns:            true,
    keysOnly:               false,
    databases:              ['All'],
    selectedDB:             'All'
	},
  'store': new Vuex.Store({
    state: {
      source:               {},
      searchResults:        {},
    },
    getters: {
      getSource:            state => state.source,
      getResultsOnly:       state => state.searchResults
    },
    actions: {
      async go ({commit, state}, {query, source, db, tables_checked, columns_checked, show_columns, keys_checked, key_selected, key_selected_table, key_selected_db, limit}){
        var db_count = 0
        var col_count = 0
        var results = {}
        var sourceLocal = source
        var startTotal = new Date().getTime()
        var start = new Date().getTime()
        if(source && typeof(source) == 'object'){
          // IF DB NOT SELECTED
          if(db && db == 'All') {
            var start = 0
            for(var k = 0; k<Object.keys(source).length; k++){
              var database = Object.keys(source)[k]
              if(source[database]){
                var tables = Object.keys(source[database])
                if(k == 0){
                  var start = new Date().getTime()
                }
                for(var i = 0; i< tables.length; i++){
                  var tableName = tables[i]
                  var table = state.source[database][tableName]
                  if(table && typeof(table) == 'object'){
                    if(!results[database]){
                      results[database] = {}
                    }
                    // IF NOT SEARCHING IN COLUMNS
                    if(columns_checked == false){
                      if(query !== ''){
                        if(tableName.toLowerCase().includes(query.split(' ').join('').toLowerCase())){
                          var tablCols = Object.keys(table)
                          if(keys_checked == true){
                            for(var l = 0; l < tablCols.length; l ++){
                              var column = tablCols[l]
                              if((column[0] == 'P' && column[1] == 'K') || (column[0] == 'F' && column[1] == 'K')){
                                if(!results[database][tableName]){
                                  results[database][tableName] = []
                                }
                                results[database][tableName].push(column)
                              }
                            }
                          }
                          else {
                            results[database][tableName] = tablCols
                          }
                        }
                      }
                      else {
                        if(show_columns == true){
                          var tablCols = Object.keys(table)
                          if(keys_checked == true){
                              for(var l = 0; l < tablCols.length; l ++){
                                var column = tablCols[l]
                                if((column[0] == 'P' && column[1] == 'K') || (column[0] == 'F' && column[1] == 'K')){
                                  if(!results[database][tableName]){
                                    results[database][tableName] = []
                                  }
                                  results[database][tableName].push(column)
                                }
                              }
                          }
                          else {
                            results[database][tableName] = tablCols
                          }
                        }
                        else {
                           results[database][tableName] = []
                        }
                      }
                    }
                    //  IF SEARCHING IN COLUMNS
                    var tableCols = Object.keys(table)
                    if(columns_checked == true || keys_checked == true){
                      for(var j = 0; j < tableCols.length; j ++){
                        var column = tableCols[j]
                        var selectedKey = key_selected
                        // IF KEY SELECTED
                        if(selectedKey !== '') {
                          var keyType = selectedKey[0]+selectedKey[1]
                          if((column[0] !==key_selected[0] 
                            ||  (
                                  tableName == key_selected_table 
                                  && database == key_selected_db
                                )
                              ) &&
                              column.substring(2).toLowerCase() == key_selected.substring(2).toLowerCase()
                            ){
                              if(!results[database][tableName]){
                                results[database][tableName] = []
                              }
                              results[database][tableName].push(column)
                          }
                        }
                        else {
                          // IF KEYS ONLY
                          if(keys_checked == true 
                              && (      
                                (column[0] == 'P' && column[1] == 'K') ||
                                (column[0] == 'F' && column[1] == 'K')
                              ) &&
                              column.toLowerCase().includes(query.split(' ').join('').toLowerCase())
                            ){
                            if(columns_checked == true){
                              if(!results[database][tableName]){
                                results[database][tableName] = []
                              }
                              results[database][tableName].push(column)
                            }
                          }
                          // IF NOT KEYS ONLY
                          if(columns_checked == true 
                            && keys_checked == false 
                            && ( 
                              column.toLowerCase().includes(query.split(' ').join('').toLowerCase()) 
                              || query.length <3
                              )
                          ){
                              if(!results[database][tableName]){
                                results[database][tableName] = []
                              }
                              results[database][tableName].push(column)
                          } 
                        }
                      }
                    }
                  }
                }
              }
              if(k == Object.keys(source).length-1){
                console.log('loop speed ', new Date().getTime() - start, 'ms')
              }
            }
          }
          console.log("Search COMPLETED IN ", new Date().getTime() - startTotal, 'ms')
          commit('UPDATE_SEARCH_RESULTS', results)
        }
      },
      setSource({commit}, databases){
        commit('SET_SOURCE', databases)
      },
      clearAll({commit}){
        commit('CLEAR_ALL')
      }
    },
    mutations: {
      SET_SOURCE(state, databases){
        var dbs = Object.keys(databases)
        dbs.map(db => {
          // INIT DB
          if(!state.searchResults[db]){
            state.source[db] = {}
            state.searchResults[db] = {}
          }
          if(!state.source[db]){
            state.source[db] = {}
          }
          if(databases[db].length > 0){
            databases[db].map(col => {
              // INIT TABLE
              var tableName = col.TABLE_NAME
              if(!state.searchResults[db][tableName]){
                state.searchResults[db][tableName] = []
              }
              if(!state.source[db][tableName]){
                state.source[db][tableName] = {}
              }
              // INIT COLUMNS
              if(!state.source[db][tableName][col.COLUMN_NAME]){
                state.source[db][tableName][col.COLUMN_NAME] = {}
              }
                state.searchResults[db][tableName].push(col.COLUMN_NAME)
                state.source[db][tableName][col.COLUMN_NAME] = col
            })
          }
        })
        console.log('SET_SOURCE completed ', state.searchResults)
      },
      UPDATE_SEARCH_RESULTS (state, results) {
        console.log('updating search results with ', results)
        state.searchResults = JSON.parse(JSON.stringify(results))
      },
      CLEAR_ALL(state){
        state.source =               {}
        state.searchResults =        {}
      }
    }
  }),
  'computed': {
    DBs(){
      return Object.keys(this.$store.getters.getSource)
    }
  },
  'methods': {
    fetchHeader             (url, wch) {
      try {
          var req=new XMLHttpRequest();
          req.open("HEAD", url, false);
          req.send(null);
          if(req.status== 200){
              return req.getResponseHeader(wch);
          }
          else return false;
      } catch(er) {
          return er.message;
      }
    },
    loadMoreResults         (all){
      if(all){
        this.limit = 1000
      }
      else {
        this.limit = this.limit + 50
      }
    },
    async initSource        (databases){
      await this.$store.dispatch('setSource', databases)
    },
    highlight               (text) {
      var result = text
      if(!this.searchQuery) {
        return result;
      }
      return result
    },
    selectKey               (col,table, db){
      if(this.searchInColumns == false){
        this.searchInColumns   = true
      }
      this.keySelected            = col
      this.keySelectedTable       = table
      this.keySelectedDB          = db
    },
    async fetchResults      (){
      var start = new Date().getTime()
      await this.$store.dispatch('go', {
        query: this.searchQuery.length > 2 ? this.searchQuery : '', 
        source: this.$store.getters.getSource,  
        db: this.selectedDB, 
        tables_checked: true, 
        show_columns: this.showColumns,
        columns_checked:  this.searchInColumns,
        keys_checked: this.keysOnly,
        key_selected: this.keySelected,
        key_selected_table: this.keySelectedTable,
        key_selected_db: this.keySelectedDB,
        limit: this.limit
      })
      console.log('fetchResults completed in ', new Date().getTime() - start, 'ms')
    },
    selectDB                (db){
      this.selectedDB = db
    },
  },
  beforeMount(){
    this.initSource({IMWeb: [...imweb], IMDataCenter: [...imdc]})
  },
  created(){
    this.pageLoaded         = true
    this.fetchResults();
  },
  destroyed(){
    this.$store.dispatch('clearAll')
  }
})