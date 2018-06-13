<template>
  <div>
    <v-layout row wrap>
      <v-flex xs3>
        <v-navigation-drawer stateless value="true">
          <v-list>
            <v-list-tile @click="setPath('/')">
              <v-list-tile-action>
                <v-icon>home</v-icon>
              </v-list-tile-action>
              <v-list-tile-title style="cursor: pointer;margin-left:-25px">/</v-list-tile-title>
            </v-list-tile>
            <v-list-tile style="height: 30px;margin-top:10px">
              <v-list-tile-title style="margin-left:5px;height: 30px;line-height: 30px;" @click="setPath(displayPath.substr(0, displayPath.lastIndexOf('/')+1).replace(/\/+$/, ''))">{{ displayPath }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-for="(item, i) in items" :key="i" style="height: 30px;" :class="{ list__tile__active: active[i] }">
              <v-list-tile-title style="margin-left:10px;height: 30px;line-height: 30px;" v-text="item" @click="setPath(currentPath+(currentPath === '/' ? '' : '/')+item, i)"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
      </v-flex>
      <v-flex xs9>
        <v-layout row wrap style="margin-bottom: -27px;">
          <v-flex xs8>
            <div style="padding:8px;margin-top: -7px;">
              <v-text-field label="Path" v-model="filename" :prefix="`${displayPath !== '/' ? displayPath : ''}/`" :disabled="type !== 'listing'"></v-text-field>
            </div>
          </v-flex>
          <v-flex xs4 style="padding-top:13px">
            <div style="display:flex;margin-left:-12px">
              <v-btn :dark="source !== ''" depressed small @click="saveItem()" style="float:right;margin-right:0px" color="green" :disabled="source === ''">Save</v-btn>
              <v-btn :dark="type !== 'listing'" depressed small @click="deleteItem()" style="float:right" color="red" :disabled="type === 'listing'">Delete</v-btn>
            </div>
          </v-flex>
        </v-layout>
        <no-ssr placeholder="Loading...">
          <codemirror v-model="source" :options="cmOption" ref="cmInstance"></codemirror>
        </no-ssr>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'

  export default {
    components: {},
    props: [
      'linked'
    ],
    computed: {
      ...mapGetters({
        loggedUser: 'auth/loggedUser',
        loggedToken: 'auth/loggedToken'
      })
    },
    data: () => ({
      error: false,

      // container/profile
      linkedItem: {},
      
      active: [],
      
      // listing items & working variables
      items: [],
      type: 'listing',
      source: '',
      filename: '',
      displayPath: '/',
      currentPath: '/',
      currentFilePath: '',
      
      // code mirror options
      cmOption: {
        smartIndent: false,
        indentWithTabs: true,
        tabSize: 4,
        indentUnit:4,
        foldGutter: true,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        keyMap: "sublime",
        mode: 'text/x-php'
      }
    }),
    beforeDestroy: function() {},
    mounted: async function () {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.loggedToken
      
      // get LXD server info
      if (!this.$storage.isset('lxd')) {
        try {
          const response = await axios.get(this.loggedUser.sub + '/api/lxd')
          this.$storage.set('lxd', response.data)
          this.lxd = response.data
        } catch (error) {
          this.$storage.remove('lxd')
        }
      } else {
        this.lxd = this.$storage.get('lxd')
      }

      this.linkedItem = Object.assign({}, this.linked)

      this.$nextTick(() => {
        this.initialize()
      })
    },
    methods: {
      async initialize (filename = 'new-file', resetSource = true) {
        try {
          //
          const response = await axios.get(this.loggedUser.sub + '/api/lxd/containers/'+this.linkedItem.name+'/files?path='+this.currentPath)
          
          // check listing or file
          if (response.data.data.type === 'listing') {
            this.items = response.data.data.data
            this.displayPath = this.currentPath
            if (resetSource) {
              this.source = '';
            }
          } else {
            // reset path to previous
            this.currentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/'));
            this.source = response.data.data.data;
          }
          this.type = response.data.data.type;
          this.filename = this.type === 'listing' ? filename : this.currentFilePath.substr(this.currentFilePath.lastIndexOf('/') + 1)
        } catch (error) {
          this.error = 'Could not fetch data from server.';
        }
      },

      async setPath (path, activeMenu = 0) {
        if (path === '') {
          path = '/'
        }
        this.currentPath = path
        this.currentFilePath = path
        await this.initialize()
        this.setActiveMenu(activeMenu)
      },
      
      async saveItem () {
        try {
          //
          const response = await axios.post(this.loggedUser.sub + '/api/lxd/containers/'+this.linkedItem.name+'/files?path='+this.currentPath.replace(/\/+$/, '')+'/'+this.filename, {
            source: this.source
          })

          // place current path as folder name
          this.currentPath = this.currentPath.replace(/\/+$/, '')
          if (this.currentPath === '') {
            this.currentPath = '/'
          }
          
          // set current file path with new file name
          this.currentFilePath = this.currentPath.replace(/\/+$/, '')+'/'+this.filename
          
          // initialize the items, changing file model to the new file, dont reset source
          await this.initialize(this.filename, false)
          
          // as initialize would of got directory listing, set state back to file
          this.type = 'file';
          
          this.$emit('snackbar', 'File saved.')

        } catch (error) {
          this.error = 'Could not save file.';
        }
      },
      
      async deleteItem () {
        this.$prompt.show({
          persistent: true,
          width: 400,
          toolbar: {
            color: 'red darken-3',
            closable: false,
          },
          title: 'Delete file?',
          text: 'Are you sure you want to delete <b>'+this.currentPath.replace(/\/+$/, '')+'/'+this.filename+'</b>?<p class="text-md-center red--text"><br><b>This action cannot be undone!</b></p>',
          buttons: [
            {
              title: 'Yes',
              color: 'success',
              handler: async () => {
                try {
                  //
                  const response = await axios.delete(this.loggedUser.sub + '/api/lxd/containers/'+this.linkedItem.name+'/files?path='+this.currentPath.replace(/\/+$/, '')+'/'+this.filename)
        
                  this.setPath(this.currentPath.replace(/\/+$/, ''))
                  
                  this.$emit('snackbar', 'File deleted.')
                } catch (error) {
                  this.error = 'Could not delete file.';
                }
              }
            },
            {
              title: 'No',
              color: 'error'
            }
          ]
        })
      },
      
      setActiveMenu(activeMenu) {
        this.active = [];
        if (this.type === 'file') {
          this.active[activeMenu] = !this.active[activeMenu]
        }
      }
    }
  }
</script>

<style>
  .list__tile {
    height:30px;
  }
  
  .list__tile:hover, .list__tile:active, .list__tile:focus, .list__tile__active { 
    background-color: #ECEFF1;
  }

  .CodeMirror {
    border: 0px solid #eee;
    min-height:calc(100vh - 275px);
    height: auto;
    font-family: Ubuntu Mono, Menlo, Consolas, monospace;
    font-size: 13px;
    line-height:1.1em;
  }
  
  .CodeMirror-scroll {
    min-height:calc(100vh - 275px);
  }

  .CodeMirror-gutters {
    left: 0px !important;
  }
</style>
