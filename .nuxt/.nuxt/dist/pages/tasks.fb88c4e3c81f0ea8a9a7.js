webpackJsonp([3],{JUFQ:function(e,t,a){"use strict";var s=a("Xxa5"),r=a.n(s),n=a("woOf"),i=a.n(n),o=a("exGp"),c=a.n(o),l=a("Dd8w"),d=a.n(l),u=a("NYxO"),p=(a("4swq"),a("mtWM")),h=a.n(p);t.a={middleware:["authenticated"],components:{},computed:d()({},Object(u.mapGetters)({isAuthenticated:"auth/isAuthenticated",loggedUser:"auth/loggedUser",loggedToken:"auth/loggedToken"})),data:function(){return{system_tasks:["nginx.build","nginx.auto_update","nginx.reconcile","nginx.reload","nginx.setup","tasks.auto_update","VACUUM;"],error:"",snackbar:!1,snackbarColor:"green",snackbarText:"",snackbarTimeout:5e3,cmOption:{smartIndent:!1,indentWithTabs:!0,tabSize:4,indentUnit:4,foldGutter:!0,styleActiveLine:!0,lineNumbers:!0,line:!0,keyMap:"sublime",mode:"text/x-php"},items:[],item:[],sleep:0,tableLoading:!0,tableNoData:"You have not added any tasks.",tableHeaders:[{text:"Name",value:"name"},{text:"Description",value:"description"},{text:"Source Type",value:"type"},{text:"Actions",value:"name",sortable:!1,align:"right"}],expandedTableHeaders:[{text:"Repeats",value:"repeats"},{text:"Sleep",value:"sleep"},{text:"Last Run",value:"run_last"},{text:"Next Run",value:"run_next"},{text:"Completed",value:"completed"},{text:"Run Count",value:"run_count"},{text:"Actions",value:"name",sortable:!1,align:"right"}],itemActions:[{title:"Start"},{title:"Stop"},{title:"Delete"}],dialog:!1,editingIndex:-1,editingItem:{id:-1,name:"",source:"",checksum:"",type:"PHP",description:"",params:"",updated:"",created:""},defaultItem:{id:-1,name:"",source:"",checksum:"",type:"PHP",description:"",params:"",updated:"",created:""},valid:!0,nameRule:[function(e){return!!e||"Name is required"},function(e){return e&&e.length<=100||"Name must be less than 100 characters"}],sleepRule:[function(e){return!!e||"Sleep is required"},function(e){return e&&!isNaN(e)||"Sleep must be a number"}],pollItem:0}},mounted:function(){this.initialize()},beforeDestroy:function(){clearInterval(this.pollId)},watch:{dialog:function(e){e||this.close()}},methods:{initialize:function(){var e=c()(r.a.mark(function e(){var t;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,this.loggedUser||this.$router.replace("/servers"),h.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=5,h.a.get(this.loggedUser.sub+"/api/tasks");case 5:t=e.sent,this.items=i()([],this.items,t.data.data),this.$set(this.items,t.data.data),e.next=14;break;case 10:e.prev=10,e.t0=e.catch(0),this.tableNoData="No data.",this.error="Could not fetch data from server.";case 14:this.tableLoading=!1;case 15:case"end":return e.stop()}},e,this,[[0,10]])}));return function(){return e.apply(this,arguments)}}(),taskItem:function(){var e=c()(r.a.mark(function e(t){var a;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,this.loggedUser||this.$router.replace("/servers"),h.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=5,h.a.get(this.loggedUser.sub+"/api/tasks/"+t.id);case 5:a=e.sent,this.item=a.data.data,e.next=13;break;case 9:e.prev=9,e.t0=e.catch(0),this.tableNoData="No data.",this.error="Could not fetch data from server.";case 13:case"end":return e.stop()}},e,this,[[0,9]])}));return function(t){return e.apply(this,arguments)}}(),tableExpand:function(){var e=c()(r.a.mark(function e(t){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.item=[],clearInterval(this.pollId),t.expanded||(this.taskItem(t.item),this.pollId=setInterval(function(){this.taskItem(t.item)}.bind(this),2500)),t.expanded=!t.expanded;case 4:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),saveInstance:function(){var e=c()(r.a.mark(function e(t,a){var s,n;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return s=this.item.indexOf(t),e.prev=1,this.loggedUser||this.$router.replace("/servers"),t.sleep=a||0,h.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=7,h.a.post(this.loggedUser.sub+"/api/tasks/"+t.id,t);case 7:n=e.sent,this.item[s]=i()(this.item[s],n.data.data),422===n.data.code?(this.snackbar=!0,this.snackbarColor="red",this.snackbarText=n.data.error):(this.snackbar=!0,this.snackbarColor="green",this.snackbarText="Task instance updated."),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(1),this.error="Could not update task instance.";case 15:case"end":return e.stop()}},e,this,[[1,12]])}));return function(t,a){return e.apply(this,arguments)}}(),deleteInstance:function(){var e=c()(r.a.mark(function e(t){var a,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=this.item.indexOf(t),e.prev=1,this.loggedUser||this.$router.replace("/servers"),this.item.splice(a,1),h.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=7,h.a.delete(this.loggedUser.sub+"/api/tasks/"+t.id);case 7:422===(s=e.sent).data.code?(this.snackbar=!0,this.snackbarColor="red",this.snackbarText=s.data.error):(this.snackbar=!0,this.snackbarColor="green",this.snackbarText="Task instance deleted."),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(1),this.error="Could not deleted task instance.";case 14:case"end":return e.stop()}},e,this,[[1,11]])}));return function(t){return e.apply(this,arguments)}}(),reloadInstance:function(){var e=c()(r.a.mark(function e(t){var a,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=this.item.indexOf(t),e.prev=1,this.loggedUser||this.$router.replace("/servers"),h.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=6,h.a.put(this.loggedUser.sub+"/api/tasks/"+t.id,t);case 6:s=e.sent,this.item[a]=i()(this.item[a],s.data.data),422===s.data.code?(this.snackbar=!0,this.snackbarColor="red",this.snackbarText=s.data.error):(this.snackbar=!0,this.snackbarColor="green",this.snackbarText="Task instance reloaded."),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(1),this.error="Could not reloaded task instance.";case 14:case"end":return e.stop()}},e,this,[[1,11]])}));return function(t){return e.apply(this,arguments)}}(),runTask:function(){var e=c()(r.a.mark(function e(t){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,this.loggedUser||this.$router.replace("/servers"),h.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=5,h.a.put(this.loggedUser.sub+"/api/tasks",t);case 5:e.sent,this.snackbar=!0,this.snackbarColor="green",this.snackbarText="Task run instance executed.",this.initialize(),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(0),this.error="Could not add task instance.";case 15:case"end":return e.stop()}},e,this,[[0,12]])}));return function(t){return e.apply(this,arguments)}}(),is_system_task:function(e){return!!e.name&&this.system_tasks.includes(e.name)},editItem:function(e){this.editingIndex=this.items.indexOf(e),this.editingItem=i()({},e),this.editingItem.type=this.editingItem.type.toUpperCase(),this.dialog=!0},deleteItem:function(){var e=c()(r.a.mark(function e(t){var a;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=this.items.indexOf(t),this.items.splice(a,1),e.prev=2,this.loggedUser||this.$router.replace("/servers"),h.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=7,h.a.delete(this.loggedUser.sub+"/api/tasks",{data:t});case 7:e.sent,this.snackbar=!0,this.snackbarText="Task successfully deleted.",e.next=15;break;case 12:e.prev=12,e.t0=e.catch(2),this.error="Could not delete task from server.";case 15:case"end":return e.stop()}},e,this,[[2,12]])}));return function(t){return e.apply(this,arguments)}}(),save:function(){var e=c()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.$refs.form.validate()){e.next=23;break}if(!(this.editingIndex>-1)){e.next=5;break}i()(this.items[this.editingIndex],this.editingItem),e.next=8;break;case 5:if(!this.is_system_task(this.editingItem)){e.next=7;break}return e.abrupt("return",!1);case 7:this.items.push(i()({},this.editingItem));case 8:return e.prev=8,this.loggedUser||this.$router.replace("/servers"),h.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=13,h.a.post(this.loggedUser.sub+"/api/tasks",this.editingItem);case 13:e.sent,this.snackbar=!0,this.snackbarText="Task successfully saved.",e.next=21;break;case 18:e.prev=18,e.t0=e.catch(8),this.error="Could not save task to server.";case 21:this.initialize(),this.close();case 23:case"end":return e.stop()}},e,this,[[8,18]])}));return function(){return e.apply(this,arguments)}}(),close:function(){var e=this;this.dialog=!1,setTimeout(function(){e.editingItem=i()({},e.defaultItem),e.editingIndex=-1},300)}}}},KsuG:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("JUFQ"),r=a("uquA"),n=!1;var i=function(e){n||a("fZSU")},o=a("VU/8")(s.a,r.a,!1,i,null,null);o.options.__file="pages/tasks.vue",t.default=o.exports},PuUD:function(e,t,a){(e.exports=a("FZ+f")(!1)).push([e.i,".CodeMirror{border:1px solid #eee;height:auto;font-family:Ubuntu Mono,Menlo,Consolas,monospace;font-size:13px;line-height:1.1em}.CodeMirror,.CodeMirror-scroll{min-height:calc(100vh - 270px)}.CodeMirror-gutters{left:0!important}",""])},fZSU:function(e,t,a){var s=a("PuUD");"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);a("rjj0")("0d691c05",s,!1,{sourceMap:!1})},uquA:function(e,t,a){"use strict";var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app",[a("v-snackbar",{attrs:{top:"",timeout:e.snackbarTimeout,color:e.snackbarColor},model:{value:e.snackbar,callback:function(t){e.snackbar=t},expression:"snackbar"}},[e._v("\n    "+e._s(e.snackbarText)+"\n    "),a("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(t){e.snackbar=!1}}},[e._v("Close")])],1),a("v-content",[a("v-container",{attrs:{fluid:"",tag:"section",id:"grid"}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:"","order-xs5":""}},[a("v-layout",{attrs:{column:""}},[a("v-flex",{staticClass:"display mb-2",attrs:{tag:"h1"}},[e._v("\n              Tasks\n              "),a("v-btn",{staticStyle:{float:"right"},attrs:{color:"success"},on:{click:function(t){e.dialog=!0}}},[e._v("New Task")])],1),a("v-flex",[a("v-alert",{attrs:{type:"error",value:e.error}},[e._v("\n                "+e._s(e.error)+"\n              ")]),a("p",[e._v("Tasks allow you to run custom or predefined system tasks on the server.")]),a("v-data-table",{staticClass:"elevation-1",attrs:{headers:e.tableHeaders,items:e.items,"hide-actions":"",loading:e.tableLoading},scopedSlots:e._u([{key:"items",fn:function(t){return[a("tr",{on:{click:function(a){a.stopPropagation(),e.tableExpand(t)}}},[a("td",[a("a",{attrs:{href:"javascript:void(0)"},on:{click:function(a){a.stopPropagation(),e.editItem(t.item)}}},[e._v(e._s(t.item.name.trim()))])]),a("td",[e._v(e._s(t.item.description.trim()))]),a("td",[e._v(e._s(t.item.type.toUpperCase()))]),a("td",[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{icon:"",disabled:e.is_system_task(t.item)},on:{click:function(a){a.stopPropagation(),e.deleteItem(t.item)}}},[a("v-icon",{attrs:{color:"pink"}},[e._v("delete")])],1),a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{icon:""},on:{click:function(a){a.stopPropagation(),e.runTask(t.item)}}},[a("v-icon",{attrs:{color:"green"}},[e._v("play_arrow")])],1)],1)])]}},{key:"expand",fn:function(t){return[a("v-data-table",{attrs:{headers:e.expandedTableHeaders,items:e.item,"hide-actions":"",loading:e.tableLoading},scopedSlots:e._u([{key:"items",fn:function(t){return[a("tr",{on:{click:function(e){e.stopPropagation(),t.expanded=!t.expanded}}},[a("td",[e._v(e._s(1==t.item.repeats?"Yes":"No"))]),a("td",[a("v-edit-dialog",{attrs:{"return-value":t.item.sleep,lazy:""},on:{"update:returnValue":function(a){e.$set(t.item,"sleep",a)}}},[e._v(e._s(t.item.sleep)+"\n                            "),a("v-text-field",{attrs:{slot:"input",rules:e.sleepRule,label:"Sleep time between iterations.","single-line":""},on:{focus:function(a){e.sleep=t.item.sleep},change:function(a){e.saveInstance(t.item,e.sleep)}},slot:"input",model:{value:e.sleep,callback:function(t){e.sleep=t},expression:"sleep"}})],1)],1),a("td",[e._v(e._s(new Date(t.item.run_last).toLocaleString()))]),a("td",[e._v(e._s(new Date(t.item.run_next).toLocaleString()))]),a("td",[e._v(e._s(0!=t.item.completed?new Date(t.item.completed).toLocaleString():"-"))]),a("td",[e._v(e._s(t.item.run_count))]),a("td",[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{icon:""},on:{click:function(a){a.stopPropagation(),e.deleteInstance(t.item)}}},[a("v-icon",{attrs:{color:"pink"}},[e._v("delete")])],1),0!=t.item.completed?a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{icon:""},on:{click:function(a){a.stopPropagation(),e.reloadInstance(t.item)}}},[a("v-icon",{attrs:{color:"blue"}},[e._v("replay")])],1):e._e()],1)])]}},{key:"expand",fn:function(t){return[a("v-card",{attrs:{flat:""}},[a("v-card-text",{domProps:{innerHTML:e._s(t.item.result?"<pre>"+t.item.result+"</pre>":"Task ("+t.item.name+") has no result value.")}})],1)]}}])},[a("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),a("template",{slot:"no-data"},[e._v("\n                      "+e._s(e.tableLoading?"Fetching data, please wait...":"Task ("+t.item.name+") has no instances.")+"\n                    ")])],2)]}}])},[a("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),a("template",{slot:"no-data"},[e._v("\n                  "+e._s(e.tableLoading?"Fetching data, please wait...":e.tableNoData)+"\n                ")])],2)],1)],1)],1)],1)],1),a("v-dialog",{attrs:{fullscreen:"","hide-overlay":"",scrollable:""},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[a("v-card",{attrs:{tile:""}},[a("v-toolbar",{attrs:{card:"",dark:"",color:"light-blue darken-3"}},[a("v-btn",{attrs:{icon:"",dark:""},nativeOn:{click:function(t){e.dialog=!1}}},[a("v-icon",[e._v("close")])],1),a("v-toolbar-title",[e._v(e._s(-1===e.editingIndex?"New":"Edit")+" Task")]),a("v-spacer"),a("v-toolbar-items",[a("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(t){e.save()}}},[e._v("Save")])],1),a("v-menu",{attrs:{bottom:"",right:"","offset-y":""}},[a("v-btn",{attrs:{slot:"activator",dark:"",icon:""},slot:"activator"},[a("v-icon",[e._v("more_vert")])],1)],1)],1),a("v-card-text",{staticStyle:{padding:"0px"}},[a("v-card",{attrs:{flat:""}},[a("v-card-text",[-1!==e.editingItem.id&&e.is_system_task(e.editingItem)?a("v-alert",{attrs:{value:!0,outline:"",color:"error",icon:"warning"}},[e._v("\n               Changes to system tasks should be done with caution!\n              ")]):e._e(),-1===e.editingItem.id&&e.is_system_task(e.editingItem)?a("v-alert",{attrs:{value:!0,outline:"",color:"error",icon:"warning"}},[a("strong",[e._v("Error:")]),e._v(" Name is reserved for the system task!\n              ")]):e._e(),a("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{rules:e.nameRule,label:"Name:",placeholder:"",disabled:-1!==e.editingItem.id&&e.is_system_task(e.editingItem),required:"",hint:"Enter the name of the task."},model:{value:e.editingItem.name,callback:function(t){e.$set(e.editingItem,"name",t)},expression:"editingItem.name"}})],1),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Description:",placeholder:"",required:"",hint:"Enter the tasks description."},model:{value:e.editingItem.description,callback:function(t){e.$set(e.editingItem,"description",t)},expression:"editingItem.description"}})],1)],1),a("v-select",{attrs:{items:["PHP","BASH"],label:"Task Source Type:",hint:"Select the type of code the task is written in."},model:{value:e.editingItem.type,callback:function(t){e.$set(e.editingItem,"type",t)},expression:"editingItem.type"}}),a("h3",[e._v("Source ("+e._s(e.editingItem.type)+")")]),a("no-ssr",{attrs:{placeholder:"Loading..."}},[a("codemirror",{attrs:{options:e.cmOption},model:{value:e.editingItem.source,callback:function(t){e.$set(e.editingItem,"source",t)},expression:"editingItem.source"}})],1)],1)],1)],1)],1),a("div",{staticStyle:{flex:"1 1 auto"}})],1)],1)],1)],1)};s._withStripped=!0;var r={render:s,staticRenderFns:[]};t.a=r}});