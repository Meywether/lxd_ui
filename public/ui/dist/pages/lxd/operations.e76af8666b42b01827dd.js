webpackJsonp([10],{AssA:function(t,e,a){var s=a("nBxm");"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);a("rjj0")("1142aecd",s,!1,{sourceMap:!1})},PdaC:function(t,e,a){"use strict";var s=a("Xxa5"),r=a.n(s),n=a("exGp"),i=a.n(n),o=a("Dd8w"),c=a.n(o),l=a("NYxO"),d=(a("4swq"),a("mtWM")),u=a.n(d),p=a("rO6o");e.a={mixins:[p.a],middleware:["authenticated"],components:{},computed:c()({},Object(l.mapGetters)({isAuthenticated:"auth/isAuthenticated",loggedUser:"auth/loggedUser",loggedToken:"auth/loggedToken"})),data:function(){return{valid:!0,error:"",snackbar:!1,snackbarColor:"green",snackbarText:"",snackbarTimeout:5e3,items:[],tableLoading:!0,tableHeaders:[{text:"Id",value:"id"},{text:"Description",value:"description"},{text:"Class",value:"class"},{text:"Cancelable",value:"may_cancel"},{text:"Created",value:"created_at"},{text:"Status",value:"status"},{text:"Actions",value:"id",sortable:!1,align:"right"}],editedIndex:-1,editedItem:{},defaultItem:{},activeTab:"tab-running",pollItem:0}},beforeDestroy:function(){},mounted:function(){var t=i()(r.a.mark(function t(){var e,a=this;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(u.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,this.$storage.isset("lxd")){t.next=15;break}return t.prev=2,t.next=5,u.a.get(this.loggedUser.sub+"/api/lxd");case 5:e=t.sent,this.$storage.set("lxd",e.data.data),this.lxd=e.data,t.next=13;break;case 10:t.prev=10,t.t0=t.catch(2),this.$storage.remove("lxd");case 13:t.next=16;break;case 15:this.lxd=this.$storage.get("lxd");case 16:this.$nextTick(function(){a.initialize()});case 17:case"end":return t.stop()}},t,this,[[2,10]])}));return function(){return t.apply(this,arguments)}}(),watch:{dialog:function(t){t||this.close()}},methods:{initialize:function(){var t=i()(r.a.mark(function t(){var e;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,this.loggedUser||this.$router.replace("/servers"),t.next=4,u.a.get(this.loggedUser.sub+"/api/lxd/operations");case 4:e=t.sent,this.items=e.data.data,t.next=13;break;case 8:t.prev=8,t.t0=t.catch(0),this.items=[],this.tableNoData="No data.",this.error="Could not fetch data from server.";case 13:this.tableLoading=!1;case 14:case"end":return t.stop()}},t,this,[[0,8]])}));return function(){return t.apply(this,arguments)}}(),tableExpand:function(){var t=i()(r.a.mark(function t(e){return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:this.item=[],e.expanded,e.expanded=!e.expanded;case 3:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),cancelOperation:function(){var t=i()(r.a.mark(function t(e){return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,u.a.delete(this.loggedUser.sub+"/api/lxd/operations/"+e.id);case 3:t.sent,this.snackbar=!0,this.snackbarColor="green",this.snackbarText="Operation set to cancelling state.",t.next=12;break;case 9:t.prev=9,t.t0=t.catch(0),this.error="Failed to set operation state.";case 12:case"end":return t.stop()}},t,this,[[0,9]])}));return function(e){return t.apply(this,arguments)}}(),ucfirst:function(t){return String(t).charAt(0).toUpperCase()+String(t).slice(1)}}}},aA1K:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-app",[a("v-snackbar",{attrs:{top:"",timeout:t.snackbarTimeout,color:t.snackbarColor},model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v("\n    "+t._s(t.snackbarText)+"\n    "),a("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(e){t.snackbar=!1}}},[t._v("Close")])],1),a("v-content",[a("v-container",{attrs:{fluid:"",tag:"section",id:"grid"}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:"","order-xs5":""}},[a("v-layout",{attrs:{column:""}},[a("v-flex",{staticClass:"display mb-2",attrs:{tag:"h1"}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"",sm6:""}},[t._v("\n                  LXD - Operations\n                ")]),a("v-flex",{attrs:{xs12:"",sm6:""}})],1)],1),a("v-flex",[a("v-alert",{attrs:{type:"error",value:t.error}},[t._v("\n                "+t._s(t.error)+"\n              ")]),a("v-tabs",{staticClass:"elevation-1",model:{value:t.activeTab,callback:function(e){t.activeTab=e},expression:"activeTab"}},[a("v-tab",{attrs:{ripple:"",href:"#tab-running"}},[t._v("Running")]),a("v-tab",{attrs:{ripple:"",href:"#tab-success"}},[t._v("Success")]),a("v-tab-item",{attrs:{id:"tab-running"}},[a("v-card",[a("v-data-table",{attrs:{headers:t.tableHeaders,items:t.items.running,"hide-actions":"",loading:t.tableLoading},scopedSlots:t._u([{key:"items",fn:function(e){return[a("tr",{on:{click:function(a){a.stopPropagation(),t.tableExpand(e)}}},[a("td",[t._v(t._s(e.item.id))]),a("td",[t._v(t._s(e.item.description))]),a("td",[t._v(t._s(t.ucfirst(e.item.class)))]),a("td",[t._v(t._s(t.ucfirst(e.item.may_cancel)))]),a("td",[t._v(t._s(new Date(e.item.created_at).toLocaleString()))]),a("td",[t._v(t._s(e.item.status))]),a("td",[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{icon:"",disabled:!e.item.may_cancel},on:{click:function(a){a.stopPropagation(),t.cancelOperation(e.item)}}},[a("v-icon",{attrs:{color:"pink"}},[t._v("delete")])],1)],1)])]}},{key:"expand",fn:function(e){return[a("table",{staticClass:"table"},[a("tbody",[a("tr",[a("td",[t._v("Metadata")]),a("td",[a("pre",{staticStyle:{"font-size":"10px"}},[t._v(t._s(e.item.metadata))])])]),a("tr",[a("td",[t._v("Resources")]),a("td",[a("pre",{staticStyle:{"font-size":"10px"}},[t._v(t._s(e.item.resources))])])])])])]}}])},[a("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),a("template",{slot:"no-data"},[t._v("\n                        "+t._s(t.tableLoading?"Fetching data, please wait...":"There are currently no running operations.")+"\n                      ")])],2)],1)],1),a("v-tab-item",{attrs:{id:"tab-success"}},[a("v-card",[a("v-data-table",{attrs:{headers:t.tableHeaders,items:t.items.success,"hide-actions":"",loading:t.tableLoading},scopedSlots:t._u([{key:"items",fn:function(e){return[a("tr",{on:{click:function(a){a.stopPropagation(),t.tableExpand(e)}}},[a("td",[t._v(t._s(e.item.id))]),a("td",[t._v(t._s(e.item.description))]),a("td",[t._v(t._s(t.ucfirst(e.item.class)))]),a("td",[t._v(t._s(t.ucfirst(e.item.may_cancel)))]),a("td",[t._v(t._s(new Date(e.item.created_at).toLocaleString()))]),a("td",[t._v(t._s(e.item.status))]),a("td",[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{icon:"",disabled:!e.item.may_cancel},on:{click:function(a){a.stopPropagation(),t.cancelOperation(e.item)}}},[a("v-icon",{attrs:{color:"pink"}},[t._v("delete")])],1)],1)])]}},{key:"expand",fn:function(e){return[a("table",{staticClass:"table"},[a("tbody",[a("tr",[a("td",[t._v("Metadata")]),a("td",[a("pre",{staticStyle:{"font-size":"10px"}},[t._v(t._s(e.item.metadata))])])]),a("tr",[a("td",[t._v("Resources")]),a("td",[a("pre",{staticStyle:{"font-size":"10px"}},[t._v(t._s(e.item.resources))])])])])])]}}])},[a("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),a("template",{slot:"no-data"},[t._v("\n                        "+t._s(t.tableLoading?"Fetching data, please wait...":"There are currently no success operations.")+"\n                      ")])],2)],1)],1)],1)],1)],1)],1)],1)],1)],1)],1)};s._withStripped=!0;var r={render:s,staticRenderFns:[]};e.a=r},nBxm:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,"",""])},rO6o:function(t,e,a){"use strict";e.a={methods:{formatBytes:function(t,e){if(0===t)return"0 Bytes";var a=e||2,s=Math.floor(Math.log(t)/Math.log(1024));return parseFloat((t/Math.pow(1024,s)).toFixed(a))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][s]},isIP4:function(t){return!!/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(t)},uniqueId:function(t){t||(t=8);for(var e="",a=1;a<t+1;a+=8)e+=Math.random().toString(36).substr(2,10);return e.substr(0,t)},UUID:function(){function t(){return Math.random().toString(16).slice(-4)}return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}}}},uOdU:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("PdaC"),r=a("aA1K"),n=!1;var i=function(t){n||a("AssA")},o=a("VU/8")(s.a,r.a,!1,i,null,null);o.options.__file="pages/lxd/operations.vue",e.default=o.exports}});