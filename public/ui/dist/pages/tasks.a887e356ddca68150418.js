webpackJsonp([10],{JUFQ:function(t,e,a){"use strict";var s=a("Xxa5"),r=a.n(s),n=a("woOf"),i=a.n(n),o=a("exGp"),l=a.n(o),c=a("Dd8w"),d=a.n(c),u=a("NYxO"),p=(a("4swq"),a("mtWM")),m=a.n(p);e.a={middleware:["authenticated"],components:{},computed:d()({},Object(u.mapGetters)({isAuthenticated:"auth/isAuthenticated",loggedUser:"auth/loggedUser",loggedToken:"auth/loggedToken"}),{codemirror:function(){return this.$refs.cmInstance.codemirror}}),data:function(){return{error:"",snackbar:!1,snackbarColor:"green",snackbarText:"",snackbarTimeout:5e3,cmOption:{smartIndent:!1,indentWithTabs:!0,tabSize:4,indentUnit:4,foldGutter:!0,styleActiveLine:!0,lineNumbers:!0,line:!0,keyMap:"sublime",mode:"text/x-php"},search:"",activeType:"user",system_tasks:[],items:{system:[],user:[]},item:[],sleep:0,tableLoading:!0,tableNoData:"You have not added any tasks.",tableHeaders:[{text:"Name",value:"name"},{text:"Description",value:"description"},{text:"Source Type",value:"type"},{text:"Actions",value:"name",sortable:!1,align:"right"}],expandedTableHeaders:[{text:"Repeats",value:"repeats"},{text:"Sleep",value:"sleep"},{text:"Last Run",value:"run_last"},{text:"Next Run",value:"run_next"},{text:"Completed",value:"completed"},{text:"Run Count",value:"run_count"},{text:"Actions",value:"name",sortable:!1,align:"right"}],dialog:!1,editingIndex:-1,editingItem:{id:-1,name:"",source:"",checksum:"",type:"PHP",description:"",params:"",updated:"",created:""},defaultItem:{id:-1,name:"",source:"",checksum:"",type:"PHP",description:"",params:"",updated:"",created:""},valid:!0,nameRule:[function(t){return!!t||"Name is required"},function(t){return t&&t.length<=100||"Name must be less than 100 characters"}],sleepRule:[function(t){return!!t||"Sleep is required"},function(t){return t&&!isNaN(t)||"Sleep must be a number"}],pollItem:0}},mounted:function(){var t=this;m.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,this.$nextTick(function(){t.initialize()})},beforeDestroy:function(){clearInterval(this.pollId)},watch:{dialog:function(t){t||this.close()}},methods:{initialize:function(){var t=l()(r.a.mark(function t(){var e;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,this.loggedUser||this.$router.replace("/servers"),t.next=4,m.a.get(this.loggedUser.sub+"/api/tasks");case 4:e=t.sent,this.items=i()({system:[],user:[]},this.items,e.data.data.tasks),this.system_tasks=i()([],this.items,e.data.data.system_tasks),t.next=13;break;case 9:t.prev=9,t.t0=t.catch(0),this.tableNoData="No data.",this.error="Could not fetch data from server.";case 13:this.tableLoading=!1;case 14:case"end":return t.stop()}},t,this,[[0,9]])}));return function(){return t.apply(this,arguments)}}(),taskItem:function(){var t=l()(r.a.mark(function t(e){var a;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,this.loggedUser||this.$router.replace("/servers"),t.next=4,m.a.get(this.loggedUser.sub+"/api/tasks/"+e.id);case 4:a=t.sent,this.item=a.data.data,t.next=12;break;case 8:t.prev=8,t.t0=t.catch(0),this.tableNoData="No data.",this.error="Could not fetch data from server.";case 12:case"end":return t.stop()}},t,this,[[0,8]])}));return function(e){return t.apply(this,arguments)}}(),tableExpand:function(){var t=l()(r.a.mark(function t(e){return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:this.item=[],clearInterval(this.pollId),e.expanded||(this.taskItem(e.item),this.pollId=setInterval(function(){this.taskItem(e.item)}.bind(this),5e3)),e.expanded=!e.expanded;case 4:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),saveInstance:function(){var t=l()(r.a.mark(function t(e,a){var s,n;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return s=this.item.indexOf(e),t.prev=1,this.loggedUser||this.$router.replace("/servers"),e.sleep=a||0,t.next=6,m.a.post(this.loggedUser.sub+"/api/tasks/"+e.id,e);case 6:n=t.sent,this.item[s]=i()(this.item[s],n.data.data),422===n.data.code?(this.snackbar=!0,this.snackbarColor="red",this.snackbarText=n.data.error):(this.snackbar=!0,this.snackbarColor="green",this.snackbarText="Task instance updated."),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(1),this.error="Could not update task instance.";case 14:case"end":return t.stop()}},t,this,[[1,11]])}));return function(e,a){return t.apply(this,arguments)}}(),deleteInstance:function(t){var e=this;this.$prompt.show({persistent:!0,width:400,toolbar:{color:"red darken-3",closable:!1},title:"Delete task instance?",text:"Are you sure you want to delete the <b>"+t.name+"</b> task instance?",buttons:[{title:"Yes",color:"success",handler:function(){var a=l()(r.a.mark(function a(){var s,n;return r.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return s=e.item.indexOf(t),a.prev=1,e.loggedUser||e.$router.replace("/servers"),e.item.splice(s,1),a.next=6,m.a.delete(e.loggedUser.sub+"/api/tasks/"+t.id);case 6:422===(n=a.sent).data.code?(e.snackbar=!0,e.snackbarColor="red",e.snackbarText=n.data.error):(e.snackbar=!0,e.snackbarColor="green",e.snackbarText="Task instance deleted."),a.next=13;break;case 10:a.prev=10,a.t0=a.catch(1),e.error="Could not deleted task instance.";case 13:case"end":return a.stop()}},a,e,[[1,10]])}));return function(){return a.apply(this,arguments)}}()},{title:"No",color:"error"}]})},reloadInstance:function(){var t=l()(r.a.mark(function t(e){var a,s;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a=this.item.indexOf(e),t.prev=1,this.loggedUser||this.$router.replace("/servers"),t.next=5,m.a.put(this.loggedUser.sub+"/api/tasks/"+e.id,e);case 5:s=t.sent,this.item[a]=i()(this.item[a],s.data.data),422===s.data.code?(this.snackbar=!0,this.snackbarColor="red",this.snackbarText=s.data.error):(this.snackbar=!0,this.snackbarColor="green",this.snackbarText="Task instance reloaded."),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(1),this.error="Could not reloaded task instance.";case 13:case"end":return t.stop()}},t,this,[[1,10]])}));return function(e){return t.apply(this,arguments)}}(),stopInstance:function(){var t=l()(r.a.mark(function t(e){var a,s;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a=this.item.indexOf(e),t.prev=1,this.loggedUser||this.$router.replace("/servers"),e.sleep=0,t.next=6,m.a.put(this.loggedUser.sub+"/api/tasks/"+e.id,e);case 6:s=t.sent,this.item[a]=i()(this.item[a],s.data.data),422===s.data.code?(this.snackbar=!0,this.snackbarColor="red",this.snackbarText=s.data.error):(this.snackbar=!0,this.snackbarColor="green",this.snackbarText="Task instance stopped."),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(1),this.error="Could not stopped task instance.";case 14:case"end":return t.stop()}},t,this,[[1,11]])}));return function(e){return t.apply(this,arguments)}}(),runTask:function(){var t=l()(r.a.mark(function t(e){return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,this.loggedUser||this.$router.replace("/servers"),t.next=4,m.a.put(this.loggedUser.sub+"/api/tasks",e);case 4:t.sent,this.snackbar=!0,this.snackbarColor="green",this.snackbarText="Task run instance executed.",this.initialize(),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(0),this.error="Could not add task instance.";case 14:case"end":return t.stop()}},t,this,[[0,11]])}));return function(e){return t.apply(this,arguments)}}(),is_system_task:function(t){return!!t.name&&(this.system_tasks.includes(t.name)||"1"===t.system)},editItem:function(t,e){this.editingIndex=this.items[t].indexOf(e),this.editingItem=i()({},e),this.editingItem.type=this.editingItem.type.toUpperCase(),this.dialog=!0},deleteItem:function(t,e){var a=this;this.$prompt.show({persistent:!0,width:400,toolbar:{color:"red darken-3",closable:!1},title:"Delete task?",text:"Are you sure you want to delete the <b>"+e.name+"</b> task?",buttons:[{title:"Yes",color:"success",handler:function(){var s=l()(r.a.mark(function s(){var n;return r.a.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return n=a.items[t].indexOf(e),a.items[t].splice(n,1),s.prev=2,a.loggedUser||a.$router.replace("/servers"),s.next=6,m.a.delete(a.loggedUser.sub+"/api/tasks",{data:e});case 6:s.sent,a.snackbar=!0,a.snackbarText="Task successfully deleted.",s.next=14;break;case 11:s.prev=11,s.t0=s.catch(2),a.error="Could not delete task from server.";case 14:case"end":return s.stop()}},s,a,[[2,11]])}));return function(){return s.apply(this,arguments)}}()},{title:"No",color:"error"}]})},save:function(){var t=l()(r.a.mark(function t(e){return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.$refs.form.validate()){t.next=22;break}if(!(this.editingIndex>-1)){t.next=5;break}i()(this.items[e][this.editingIndex],this.editingItem),t.next=8;break;case 5:if(!this.is_system_task(this.editingItem)){t.next=7;break}return t.abrupt("return",!1);case 7:this.items[e].push(i()({},this.editingItem));case 8:return t.prev=8,this.loggedUser||this.$router.replace("/servers"),t.next=12,m.a.post(this.loggedUser.sub+"/api/tasks",this.editingItem);case 12:t.sent,this.snackbar=!0,this.snackbarText="Task successfully saved.",t.next=20;break;case 17:t.prev=17,t.t0=t.catch(8),this.error="Could not save task to server.";case 20:this.initialize(),-1===this.editingIndex&&this.close();case 22:case"end":return t.stop()}},t,this,[[8,17]])}));return function(e){return t.apply(this,arguments)}}(),close:function(){var t=this;this.dialog=!1,setTimeout(function(){t.editingItem=i()({},t.defaultItem),t.editingIndex=-1},300)}}}},KsuG:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("JUFQ"),r=a("uquA"),n=!1;var i=function(t){n||a("fZSU")},o=a("VU/8")(s.a,r.a,!1,i,null,null);o.options.__file="pages/tasks.vue",e.default=o.exports},PuUD:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,".CodeMirror{border:1px solid #eee;height:auto;font-family:Ubuntu Mono,Menlo,Consolas,monospace;font-size:13px;line-height:1.1em}.CodeMirror,.CodeMirror-scroll{min-height:calc(100vh - 350px)}.CodeMirror-gutters{left:0!important}",""])},fZSU:function(t,e,a){var s=a("PuUD");"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);a("rjj0")("0d691c05",s,!1,{sourceMap:!1})},uquA:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-app",[a("v-snackbar",{attrs:{top:"",timeout:t.snackbarTimeout,color:t.snackbarColor},model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v("\n    "+t._s(t.snackbarText)+"\n    "),a("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(e){t.snackbar=!1}}},[t._v("Close")])],1),a("v-content",[a("v-container",{attrs:{fluid:"",tag:"section",id:"grid"}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:"","order-xs5":""}},[a("v-layout",{attrs:{column:""}},[a("v-flex",{staticClass:"display mb-2",attrs:{tag:"h1"}},[t._v("\n              Tasks\n              "),a("v-btn",{staticStyle:{float:"right"},attrs:{color:"success"},on:{click:function(e){t.dialog=!0}}},[t._v("New Task")])],1),a("v-flex",[a("v-alert",{attrs:{type:"error",value:t.error}},[t._v("\n                "+t._s(t.error)+"\n              ")]),a("p",[t._v("Tasks allow you to run custom or predefined system tasks on the server.")]),a("v-tabs",{staticClass:"elevation-1",model:{value:t.activeType,callback:function(e){t.activeType=e},expression:"activeType"}},[t.loggedUser.mod.tasks.includes("user")?a("v-tab",{attrs:{ripple:"",href:"#user"}},[t._v("User")]):t._e(),t.loggedUser.mod.tasks.includes("system")?a("v-tab",{attrs:{ripple:"",href:"#system"}},[t._v("System")]):t._e(),a("v-tab-item",{attrs:{id:"user"}},[a("v-data-table",{staticClass:"elevation-1",attrs:{"hide-actions":"",search:t.search,headers:t.tableHeaders,items:t.items.user,loading:t.tableLoading},scopedSlots:t._u([{key:"items",fn:function(e){return[a("tr",{on:{click:function(a){a.stopPropagation(),t.tableExpand(e)}}},[a("td",[a("a",{attrs:{href:"javascript:void(0)"},on:{click:function(a){a.stopPropagation(),t.editItem("user",e.item)}}},[t._v(t._s(e.item.name.trim()))])]),a("td",[t._v(t._s(e.item.description.trim()))]),a("td",[t._v(t._s(e.item.type.toUpperCase()))]),a("td",[a("v-tooltip",{attrs:{left:""}},[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{slot:"activator",icon:"",disabled:t.is_system_task(e.item)},on:{click:function(a){a.stopPropagation(),t.deleteItem("user",e.item)}},slot:"activator"},[a("v-icon",{attrs:{color:"pink"}},[t._v("delete")])],1),a("span",[t._v("Delete")])],1),a("v-tooltip",{attrs:{left:""}},[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{slot:"activator",icon:""},on:{click:function(a){a.stopPropagation(),t.runTask(e.item)}},slot:"activator"},[a("v-icon",{attrs:{color:"green"}},[t._v("play_arrow")])],1),a("span",[t._v("Run")])],1)],1)])]}},{key:"expand",fn:function(e){return[a("v-data-table",{attrs:{headers:t.expandedTableHeaders,items:t.item,"hide-actions":"",loading:t.tableLoading},scopedSlots:t._u([{key:"items",fn:function(e){return[a("tr",{on:{click:function(t){t.stopPropagation(),e.expanded=!e.expanded}}},[a("td",[t._v(t._s(1==e.item.repeats?"Yes":"No"))]),a("td",[a("v-edit-dialog",{attrs:{"return-value":e.item.sleep,lazy:""},on:{"update:returnValue":function(a){t.$set(e.item,"sleep",a)}}},[t._v(t._s(e.item.sleep)+"\n                                "),a("v-text-field",{attrs:{slot:"input",rules:t.sleepRule,label:"Sleep time between iterations.","single-line":""},on:{focus:function(a){t.sleep=e.item.sleep},change:function(a){t.saveInstance(e.item,t.sleep)}},slot:"input",model:{value:t.sleep,callback:function(e){t.sleep=e},expression:"sleep"}})],1)],1),a("td",[t._v(t._s(e.item.run_last?new Date(e.item.run_last).toLocaleString():"-"))]),a("td",[t._v(t._s(e.item.run_next?new Date(e.item.run_next).toLocaleString():"-"))]),a("td",[t._v(t._s(0!=e.item.completed?new Date(e.item.completed).toLocaleString():"-"))]),a("td",[t._v(t._s(e.item.run_count))]),a("td",[a("v-tooltip",{attrs:{left:""}},[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{slot:"activator",icon:""},on:{click:function(a){a.stopPropagation(),t.deleteInstance(e.item)}},slot:"activator"},[a("v-icon",{attrs:{color:"pink"}},[t._v("delete")])],1),a("span",[t._v("Delete")])],1),0!=e.item.completed?a("v-tooltip",{attrs:{left:""}},[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{slot:"activator",icon:""},on:{click:function(a){a.stopPropagation(),t.reloadInstance(e.item)}},slot:"activator"},[a("v-icon",{attrs:{color:"blue"}},[t._v("replay")])],1),a("span",[t._v("Restart")])],1):t._e(),0==e.item.completed?a("v-tooltip",{attrs:{left:""}},[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{slot:"activator",icon:""},on:{click:function(a){a.stopPropagation(),t.stopInstance(e.item)}},slot:"activator"},[a("v-icon",{attrs:{color:"red"}},[t._v("stop")])],1),a("span",[t._v("Stop")])],1):t._e()],1)])]}},{key:"expand",fn:function(e){return[a("v-card",{attrs:{flat:""}},[a("v-card-text",{domProps:{innerHTML:t._s(e.item.result?"<pre style='font-size:10px'>"+e.item.result+"</pre>":"Task has no output.")}})],1)]}}])},[a("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),a("template",{slot:"no-data"},[t._v("\n                          "+t._s(t.tableLoading?"Fetching data, please wait...":"Task has no instances.")+"\n                        ")])],2)]}}])},[a("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),a("template",{attrs:{value:!0,color:"error",icon:"warning"},slot:"no-results"},[t._v('\n                      No items found matching "'+t._s(t.search)+'".\n                    ')]),a("template",{slot:"no-data"},[t._v("\n                      "+t._s(t.tableLoading?"Fetching data, please wait...":t.tableNoData)+"\n                    ")])],2)],1),a("v-tab-item",{attrs:{id:"system"}},[a("v-data-table",{staticClass:"elevation-1",attrs:{"hide-actions":"",search:t.search,headers:t.tableHeaders,items:t.items.system,loading:t.tableLoading},scopedSlots:t._u([{key:"items",fn:function(e){return[a("tr",{on:{click:function(a){a.stopPropagation(),t.tableExpand(e)}}},[a("td",[a("a",{attrs:{href:"javascript:void(0)"},on:{click:function(a){a.stopPropagation(),t.editItem("system",e.item)}}},[t._v(t._s(e.item.name.trim()))])]),a("td",[t._v(t._s(e.item.description.trim()))]),a("td",[t._v(t._s(e.item.type.toUpperCase()))]),a("td",[a("v-tooltip",{attrs:{left:""}},[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{slot:"activator",icon:""},on:{click:function(a){a.stopPropagation(),t.runTask(e.item)}},slot:"activator"},[a("v-icon",{attrs:{color:"green"}},[t._v("play_arrow")])],1),a("span",[t._v("Run")])],1)],1)])]}},{key:"expand",fn:function(e){return[a("v-data-table",{attrs:{headers:t.expandedTableHeaders,items:t.item,"hide-actions":"",loading:t.tableLoading},scopedSlots:t._u([{key:"items",fn:function(e){return[a("tr",{on:{click:function(t){t.stopPropagation(),e.expanded=!e.expanded}}},[a("td",[t._v(t._s(1==e.item.repeats?"Yes":"No"))]),a("td",[a("v-edit-dialog",{attrs:{"return-value":e.item.sleep,lazy:""},on:{"update:returnValue":function(a){t.$set(e.item,"sleep",a)}}},[t._v(t._s(e.item.sleep)+"\n                                "),a("v-text-field",{attrs:{slot:"input",rules:t.sleepRule,label:"Sleep time between iterations.","single-line":""},on:{focus:function(a){t.sleep=e.item.sleep},change:function(a){t.saveInstance(e.item,t.sleep)}},slot:"input",model:{value:t.sleep,callback:function(e){t.sleep=e},expression:"sleep"}})],1)],1),a("td",[t._v(t._s(e.item.run_last?new Date(e.item.run_last).toLocaleString():"-"))]),a("td",[t._v(t._s(e.item.run_next?new Date(e.item.run_next).toLocaleString():"-"))]),a("td",[t._v(t._s(0!=e.item.completed?new Date(e.item.completed).toLocaleString():"-"))]),a("td",[t._v(t._s(e.item.run_count))]),a("td",[a("v-tooltip",{attrs:{left:""}},[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{slot:"activator",icon:""},on:{click:function(a){a.stopPropagation(),t.deleteInstance(e.item)}},slot:"activator"},[a("v-icon",{attrs:{color:"pink"}},[t._v("delete")])],1),a("span",[t._v("Delete")])],1),0!=e.item.completed?a("v-tooltip",{attrs:{left:""}},[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{slot:"activator",icon:""},on:{click:function(a){a.stopPropagation(),t.reloadInstance(e.item)}},slot:"activator"},[a("v-icon",{attrs:{color:"blue"}},[t._v("replay")])],1),a("span",[t._v("Restart")])],1):t._e(),0==e.item.completed?a("v-tooltip",{attrs:{left:""}},[a("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{slot:"activator",icon:""},on:{click:function(a){a.stopPropagation(),t.stopInstance(e.item)}},slot:"activator"},[a("v-icon",{attrs:{color:"red"}},[t._v("stop")])],1),a("span",[t._v("Stop")])],1):t._e()],1)])]}},{key:"expand",fn:function(e){return[a("v-card",{attrs:{flat:""}},[a("v-card-text",{domProps:{innerHTML:t._s(e.item.result?"<pre style='font-size:10px'>"+e.item.result+"</pre>":"Task has no output.")}})],1)]}}])},[a("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),a("template",{slot:"no-data"},[t._v("\n                          "+t._s(t.tableLoading?"Fetching data, please wait...":"Task has no instances.")+"\n                        ")])],2)]}}])},[a("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),a("template",{attrs:{value:!0,color:"error",icon:"warning"},slot:"no-results"},[t._v('\n                      No items found matching "'+t._s(t.search)+'".\n                    ')]),a("template",{slot:"no-data"},[t._v("\n                      "+t._s(t.tableLoading?"Fetching data, please wait...":t.tableNoData)+"\n                    ")])],2)],1)],1)],1)],1)],1)],1)],1),a("v-dialog",{attrs:{fullscreen:"","hide-overlay":"",transition:"dialog-bottom-transition",scrollable:""},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",{attrs:{tile:""}},[a("v-toolbar",{attrs:{card:"",dark:"",color:"light-blue darken-3"}},[a("v-btn",{attrs:{icon:"",dark:""},nativeOn:{click:function(e){t.dialog=!1}}},[a("v-icon",[t._v("close")])],1),a("v-toolbar-title",[t._v(t._s(-1===t.editingIndex?"New":"Edit")+" Task")]),a("v-spacer"),a("v-toolbar-items",[a("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(e){t.save("1"===t.editingItem.system?"system":"user")}}},[t._v("Save")])],1)],1),a("v-card-text",[-1!==t.editingItem.id&&t.is_system_task(t.editingItem)?a("v-alert",{attrs:{value:!0,outline:"",color:"error",icon:"warning"}},[t._v("\n           Changes to system tasks should be done with caution!\n          ")]):t._e(),-1===t.editingItem.id&&t.is_system_task(t.editingItem)?a("v-alert",{attrs:{value:!0,outline:"",color:"error",icon:"warning"}},[a("strong",[t._v("Error:")]),t._v(" Name is reserved for the system task!\n          ")]):t._e(),a("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{rules:t.nameRule,label:"Name:",placeholder:"",disabled:-1!==t.editingItem.id&&t.is_system_task(t.editingItem),required:"",hint:"Enter the name of the task."},model:{value:t.editingItem.name,callback:function(e){t.$set(t.editingItem,"name",e)},expression:"editingItem.name"}})],1),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Description:",placeholder:"",required:"",hint:"Enter the tasks description."},model:{value:t.editingItem.description,callback:function(e){t.$set(t.editingItem,"description",e)},expression:"editingItem.description"}})],1)],1),a("v-select",{attrs:{items:["PHP","BASH"],label:"Task Source Type:",hint:"Select the type of code the task is written in."},model:{value:t.editingItem.type,callback:function(e){t.$set(t.editingItem,"type",e)},expression:"editingItem.type"}}),a("h3",[t._v("Source ("+t._s(t.editingItem.type)+")")]),a("no-ssr",{attrs:{placeholder:"Loading..."}},[a("codemirror",{ref:"cmInstance",attrs:{options:t.cmOption},model:{value:t.editingItem.source,callback:function(e){t.$set(t.editingItem,"source",e)},expression:"editingItem.source"}})],1)],1)],1),a("div",{staticStyle:{flex:"1 1 auto"}})],1)],1)],1)],1)};s._withStripped=!0;var r={render:s,staticRenderFns:[]};e.a=r}});