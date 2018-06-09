webpackJsonp([7],{"/DPP":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("KSZ5"),r=i("UJAC"),n=!1;var o=function(t){n||i("BfPm")},a=i("VU/8")(s.a,r.a,!1,o,null,null);a.options.__file="pages/lxd/profiles.vue",e.default=a.exports},"0PNI":function(t,e,i){(t.exports=i("FZ+f")(!1)).push([t.i,"",""])},BfPm:function(t,e,i){var s=i("0PNI");"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);i("rjj0")("55cd7064",s,!1,{sourceMap:!1})},KSZ5:function(t,e,i){"use strict";var s=i("woOf"),r=i.n(s),n=i("Xxa5"),o=i.n(n),a=i("exGp"),c=i.n(a),l=i("Dd8w"),m=i.n(l),d=i("NYxO"),u=(i("4swq"),i("mtWM")),g=i.n(u),f=i("rO6o"),p=i("e1fb");e.a={mixins:[f.a],middleware:["authenticated"],components:{},computed:m()({},Object(d.mapGetters)({isAuthenticated:"auth/isAuthenticated",loggedUser:"auth/loggedUser",loggedToken:"auth/loggedToken"}),{empty_profile:function(){return p.empty()},max_memory:function(){return this.resources.memory.total/1e3/1e3},max_cpu:function(){return Number(this.resources.cpu.total)}}),data:function(){return{dialog:!1,valid:!0,error:"",snackbar:!1,snackbarColor:"green",snackbarText:"",snackbarTimeout:5e3,items:[],resources:{cpu:{total:0},memory:{total:0}},tableLoading:!0,tableHeaders:[{text:"Name",value:"name"},{text:"Description",value:"description"},{text:"Actions",value:"id",sortable:!1,align:"right"}],editingIndex:-1,editingItem:p.empty(),defaultItem:p.empty(),nameRule:[function(t){return!!t||"Name is required"},function(t){return t&&t.length<=100||"Name must be less than 100 characters"}]}},beforeDestroy:function(){},mounted:function(){var t=c()(o.a.mark(function t(){var e,i=this;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(g.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,this.$storage.isset("lxd")){t.next=15;break}return t.prev=2,t.next=5,g.a.get(this.loggedUser.sub+"/api/lxd");case 5:e=t.sent,this.$storage.set("lxd",e.data),this.lxd=e.data,t.next=13;break;case 10:t.prev=10,t.t0=t.catch(2),this.$storage.remove("lxd");case 13:t.next=16;break;case 15:this.lxd=this.$storage.get("lxd");case 16:this.$nextTick(function(){i.initialize(),i.getResources()});case 17:case"end":return t.stop()}},t,this,[[2,10]])}));return function(){return t.apply(this,arguments)}}(),watch:{dialog:function(t){t||this.close()}},methods:{initialize:function(){var t=c()(o.a.mark(function t(){var e;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,this.loggedUser||this.$router.replace("/servers"),t.next=4,g.a.get(this.loggedUser.sub+"/api/lxd/profiles");case 4:e=t.sent,this.items=e.data.data,t.next=13;break;case 8:t.prev=8,t.t0=t.catch(0),this.items=[],this.tableNoData="No data.",this.error="Could not fetch data from server.";case 13:this.tableLoading=!1;case 14:case"end":return t.stop()}},t,this,[[0,8]])}));return function(){return t.apply(this,arguments)}}(),getResources:function(){var t=c()(o.a.mark(function t(){var e;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,this.loggedUser||this.$router.replace("/servers"),t.next=4,g.a.get(this.loggedUser.sub+"/api/lxd/resources");case 4:e=t.sent,this.resources=e.data.data,t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0),this.resources={};case 11:case"end":return t.stop()}},t,this,[[0,8]])}));return function(){return t.apply(this,arguments)}}(),editItem:function(t){this.editingIndex=this.items.indexOf(t),this.editingItem=r()({},this.empty_profile,t),this.editingItem.devices=r()({},this.empty_profile.devices,t.devices),this.editingItem.config=r()({},this.empty_profile.config,t.config),this.editingItem=p.infix(this.editingItem),this.dialog=!0},save:function(){var t=c()(o.a.mark(function t(){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.$refs.form.validate()){t.next=24;break}if(this.editingIndex>-1?r()(this.items[this.editingIndex],this.editingItem):this.items.push(r()({},this.editingItem)),t.prev=2,this.loggedUser||this.$router.replace("/servers"),this.editingItem=p.outfix(this.editingItem),!(this.editingIndex>-1)){t.next=11;break}return t.next=8,g.a.post(this.loggedUser.sub+"/api/lxd/profiles/"+this.editingItem.name,{config:this.editingItem.config,description:this.editingItem.description,devices:this.editingItem.deviced});case 8:t.sent,t.next=14;break;case 11:return t.next=13,g.a.post(this.loggedUser.sub+"/api/lxd/profiles",{config:this.editingItem.config,description:this.editingItem.description,devices:this.editingItem.deviced,name:this.editingItem.name});case 13:t.sent;case 14:this.editingItem=p.infix(this.editingItem),this.snackbar=!0,this.snackbarText="Profile successfully saved.",t.next=22;break;case 19:t.prev=19,t.t0=t.catch(2),this.error="Could not save profile to server.";case 22:-1===this.editingIndex&&this.close(),this.initialize();case 24:case"end":return t.stop()}},t,this,[[2,19]])}));return function(){return t.apply(this,arguments)}}(),deleteItem:function(){var t=c()(o.a.mark(function t(e){var i=this;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:this.$prompt.show({persistent:!0,width:400,toolbar:{color:"red darken-3",closable:!1},title:"Delete profile?",text:"Are you sure you want to delete the <b>"+e.name+"</b> profile?",buttons:[{title:"Yes",color:"success",handler:function(){var t=c()(o.a.mark(function t(){var s;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return s=i.items.indexOf(e),i.items.splice(s,1),t.prev=2,t.next=5,g.a.delete(i.loggedUser.sub+"/api/lxd/profiles/"+e.name);case 5:t.sent,i.snackbar=!0,i.snackbarColor="green",i.snackbarText="Profile deleted.",t.next=14;break;case 11:t.prev=11,t.t0=t.catch(2),i.error="Failed to delete profile.";case 14:case"end":return t.stop()}},t,i,[[2,11]])}));return function(){return t.apply(this,arguments)}}()},{title:"No",color:"error"}]});case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),close:function(){var t=this;this.dialog=!1,setTimeout(function(){t.editingItem=r()({},t.defaultItem),t.editingIndex=-1},300)}}}},UJAC:function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-app",[i("v-snackbar",{attrs:{top:"",timeout:t.snackbarTimeout,color:t.snackbarColor},model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v("\n    "+t._s(t.snackbarText)+"\n    "),i("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(e){t.snackbar=!1}}},[t._v("Close")])],1),i("v-content",[i("v-container",{attrs:{fluid:"",tag:"section",id:"grid"}},[i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{"d-flex":"",xs12:"","order-xs5":""}},[i("v-layout",{attrs:{column:""}},[i("v-flex",{staticClass:"display mb-2",attrs:{tag:"h1"}},[i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs12:"",sm6:""}},[t._v("\n                  LXD - Profiles\n                ")]),i("v-flex",{attrs:{xs12:"",sm6:""}},[i("v-btn",{staticStyle:{float:"right"},attrs:{small:"",color:"success"},on:{click:function(e){t.dialog=!0}}},[t._v("New Profile")])],1)],1)],1),i("v-flex",[i("v-alert",{attrs:{type:"error",value:t.error}},[t._v("\n                "+t._s(t.error)+"\n              ")]),i("v-data-table",{staticClass:"elevation-1",attrs:{headers:t.tableHeaders,items:t.items,"hide-actions":"",loading:t.tableLoading},scopedSlots:t._u([{key:"items",fn:function(e){return[i("tr",[i("td",[i("a",{attrs:{href:"javascript:void(0)"},on:{click:function(i){i.stopPropagation(),t.editItem(e.item)}}},[t._v(t._s(e.item.name))])]),i("td",[t._v(t._s(e.item.description))]),i("td",[i("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{icon:""},on:{click:function(i){i.stopPropagation(),t.deleteItem(e.item)}}},[i("v-icon",{attrs:{color:"pink"}},[t._v("delete")])],1)],1)])]}}])},[i("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),i("template",{slot:"no-data"},[t._v("\n                  "+t._s(t.tableLoading?"Fetching data, please wait...":"There are currently no profiles.")+"\n                ")])],2)],1)],1)],1)],1)],1),i("v-dialog",{attrs:{"max-width":"600px",scrollable:""},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[i("v-card",{attrs:{tile:""}},[i("v-toolbar",{attrs:{card:"",dark:"",color:"light-blue darken-3"}},[i("v-btn",{attrs:{icon:"",dark:""},nativeOn:{click:function(e){t.dialog=!1}}},[i("v-icon",[t._v("close")])],1),i("v-toolbar-title",[t._v(t._s(-1===t.editingIndex?"New":"Edit")+" Profile")]),i("v-spacer"),i("v-toolbar-items",[i("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(e){t.save()}}},[t._v("Save")])],1)],1),i("v-card-text",{staticStyle:{padding:"0px"}},[i("v-card",{attrs:{flat:""}},[i("v-card-text",[i("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[i("h2",[t._v("General")]),i("v-layout",{staticStyle:{"margin-top":"-20px"},attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs6:""}},[i("v-card-text",{staticClass:"px-1"},[i("v-text-field",{attrs:{rules:t.nameRule,label:"Name:",placeholder:"",required:"",hint:"Enter a name for the profile."},model:{value:t.editingItem.name,callback:function(e){t.$set(t.editingItem,"name",e)},expression:"editingItem.name"}}),i("v-text-field",{attrs:{label:"Description:",placeholder:"",hint:"Enter a description for the profile."},model:{value:t.editingItem.description,callback:function(e){t.$set(t.editingItem,"description",e)},expression:"editingItem.description"}})],1)],1),i("v-flex",{attrs:{xs6:""}},[i("v-card-text",{staticClass:"px-4"},[i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs12:""}},[i("h4",[t._v("Auto Start")]),i("v-switch",{attrs:{label:"1"===t.editingItem.config["boot.autostart"]?"Yes":"No","true-value":"1","false-value":"0",color:"success"},model:{value:t.editingItem.config["boot.autostart"],callback:function(e){t.$set(t.editingItem.config,"boot.autostart",e)},expression:"editingItem.config['boot.autostart']"}})],1)],1),i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs6:""}},[i("h4",[t._v("Privileged")]),i("v-switch",{attrs:{label:"1"===t.editingItem.config["security.privileged"]?"Yes":"No","true-value":"1","false-value":"0",color:"success"},model:{value:t.editingItem.config["security.privileged"],callback:function(e){t.$set(t.editingItem.config,"security.privileged",e)},expression:"editingItem.config['security.privileged']"}})],1),i("v-flex",{attrs:{xs6:""}},[i("h4",[t._v("Nesting")]),i("v-switch",{attrs:{label:"1"===t.editingItem.config["security.nesting"]?"Yes":"No","true-value":"1","false-value":"0",color:"success"},model:{value:t.editingItem.config["security.nesting"],callback:function(e){t.$set(t.editingItem.config,"security.nesting",e)},expression:"editingItem.config['security.nesting']"}})],1)],1)],1)],1)],1),i("h2",{staticStyle:{"margin-top":"-15px"}},[t._v("CPU")]),i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs6:""}},[i("v-card-text",{staticClass:"px-1"},[i("h4",{staticStyle:{"margin-bottom":"-20px"}},[t._v("CPU Cores ("+t._s(t.editingItem.config["limits.cpu"])+")")]),i("v-slider",{attrs:{"thumb-label":"",max:t.max_cpu,ticks:""},model:{value:t.editingItem.config["limits.cpu"],callback:function(e){t.$set(t.editingItem.config,"limits.cpu",e)},expression:"editingItem.config['limits.cpu']"}}),i("h4",{staticStyle:{"margin-bottom":"-20px"}},[t._v("Max Processes ("+t._s(t.editingItem.config["limits.processes"])+")")]),i("v-slider",{attrs:{"thumb-label":"",max:"20000",step:"100",ticks:""},model:{value:t.editingItem.config["limits.processes"],callback:function(e){t.$set(t.editingItem.config,"limits.processes",e)},expression:"editingItem.config['limits.processes']"}})],1)],1),i("v-flex",{attrs:{xs6:""}},[i("v-card-text",{staticClass:"px-1"},[i("h4",{staticStyle:{"margin-bottom":"-20px"}},[t._v("CPU Allowance ("+t._s(t.editingItem.config["limits.cpu.allowance"])+"%)")]),i("v-slider",{attrs:{"thumb-label":"",max:"100",step:"1",ticks:""},model:{value:t.editingItem.config["limits.cpu.allowance"],callback:function(e){t.$set(t.editingItem.config,"limits.cpu.allowance",e)},expression:"editingItem.config['limits.cpu.allowance']"}}),i("h4",{staticStyle:{"margin-bottom":"-20px"}},[t._v("CPU Priority ("+t._s(t.editingItem.config["limits.cpu.priority"])+"/10)")]),i("v-slider",{attrs:{"thumb-label":"",max:"10",step:"1",ticks:""},model:{value:t.editingItem.config["limits.cpu.priority"],callback:function(e){t.$set(t.editingItem.config,"limits.cpu.priority",e)},expression:"editingItem.config['limits.cpu.priority']"}})],1)],1)],1),i("h2",{staticStyle:{"margin-top":"-15px"}},[t._v("Memory")]),i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs6:""}},[i("v-card-text",{staticClass:"px-1"},[i("h4",{staticStyle:{"margin-bottom":"-20px"}},[t._v("Memory ("+t._s(t.editingItem.config["limits.memory"])+"MB)")]),i("v-slider",{attrs:{max:t.max_memory,"thumb-label":"",step:"64",ticks:""},model:{value:t.editingItem.config["limits.memory"],callback:function(e){t.$set(t.editingItem.config,"limits.memory",e)},expression:"editingItem.config['limits.memory']"}}),i("h4",{staticStyle:{"margin-bottom":"-20px"}},[t._v("Swap Priority ("+t._s(t.editingItem.config["limits.memory.swap.priority"])+"/10)")]),i("v-slider",{attrs:{"thumb-label":"",max:"10",step:"1",ticks:""},model:{value:t.editingItem.config["limits.memory.swap.priority"],callback:function(e){t.$set(t.editingItem.config,"limits.memory.swap.priority",e)},expression:"editingItem.config['limits.memory.swap.priority']"}})],1)],1),i("v-flex",{attrs:{xs6:""}},[i("v-card-text",{staticClass:"px-1"},[i("h4",[t._v("Enforce")]),i("v-switch",{attrs:{label:"hard"===t.editingItem.config["limits.memory.enforce"]?"Hard":"Soft","true-value":"hard","false-value":"soft",color:"success"},model:{value:t.editingItem.config["limits.memory.enforce"],callback:function(e){t.$set(t.editingItem.config,"limits.memory.enforce",e)},expression:"editingItem.config['limits.memory.enforce']"}}),i("h4",[t._v("Swap")]),i("v-switch",{attrs:{label:"1"===t.editingItem.config["limits.memory.swap"]?"Yes":"No","true-value":"1","false-value":"0",color:"success"},model:{value:t.editingItem.config["limits.memory.swap"],callback:function(e){t.$set(t.editingItem.config,"limits.memory.swap",e)},expression:"editingItem.config['limits.memory.swap']"}})],1)],1)],1),i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs6:""}},[i("h2",[t._v("Disk")])]),i("v-flex",{attrs:{xs6:""}},[i("h2",[t._v("Network")])])],1),i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs6:""}},[i("v-card-text",{staticClass:"px-1"},[i("h4",{staticStyle:{"margin-bottom":"-20px"}},[t._v("Priority ("+t._s(t.editingItem.config["limits.disk.priority"])+"/10)")]),i("v-slider",{attrs:{"thumb-label":"",max:"10",step:"1",ticks:""},model:{value:t.editingItem.config["limits.disk.priority"],callback:function(e){t.$set(t.editingItem.config,"limits.disk.priority",e)},expression:"editingItem.config['limits.disk.priority']"}})],1)],1),i("v-flex",{attrs:{xs6:""}},[i("v-card-text",{staticClass:"px-1"},[i("h4",{staticStyle:{"margin-bottom":"-20px"}},[t._v("Priority ("+t._s(t.editingItem.config["limits.network.priority"])+"/10)")]),i("v-slider",{attrs:{"thumb-label":"",max:"10",step:"1",ticks:""},model:{value:t.editingItem.config["limits.network.priority"],callback:function(e){t.$set(t.editingItem.config,"limits.network.priority",e)},expression:"editingItem.config['limits.network.priority']"}})],1)],1)],1)],1)],1)],1)],1),i("div",{staticStyle:{flex:"1 1 auto"}})],1)],1)],1)],1)};s._withStripped=!0;var r={render:s,staticRenderFns:[]};e.a=r},e1fb:function(t,e){t.exports={empty:function(){return{config:{"limits.cpu":1,"limits.processes":500,"limits.cpu.allowance":50,"limits.cpu.priority":5,"limits.memory":1024,"limits.memory.swap.priority":5,"limits.disk.priority":5,"limits.network.priority":5,"boot.autostart":"0","security.nesting":"0","security.privileged":"0","limits.memory.swap":"0","limits.memory.enforce":"soft"},description:"",devices:{},name:"",used_by:[]}},infix:function(t){return void 0!==t.config["limits.memory"]&&isNaN(t.config["limits.memory"])&&(t.config["limits.memory"]=Number(t.config["limits.memory"].substring(0,t.config["limits.memory"].indexOf("MB")))),void 0!==t.config["limits.cpu.allowance"]&&isNaN(t.config["limits.cpu.allowance"])&&(t.config["limits.cpu.allowance"]=Number(t.config["limits.cpu.allowance"].substring(0,t.config["limits.cpu.allowance"].indexOf("%")))),t.config["limits.cpu"]=Number(t.config["limits.cpu"]),t.config["limits.cpu.priority"]=Number(t.config["limits.cpu.priority"]),t.config["limits.processes"]=Number(t.config["limits.processes"]),t.config["limits.memory.swap.priority"]=Number(t.config["limits.memory.swap.priority"]),t.config["limits.disk.priority"]=Number(t.config["limits.disk.priority"]),t.config["limits.network.priority"]=Number(t.config["limits.network.priority"]),t},outfix:function(t){return t.config["limits.cpu"]=String(t.config["limits.cpu"]),t.config["limits.processes"]=String(t.config["limits.processes"]),t.config["limits.cpu.allowance"]=String(t.config["limits.cpu.allowance"])+"%",t.config["limits.cpu.priority"]=String(t.config["limits.cpu.priority"]),t.config["limits.memory"]=String(t.config["limits.memory"])+"MB",t.config["limits.memory.swap.priority"]=String(t.config["limits.memory.swap.priority"]),t.config["limits.disk.priority"]=String(t.config["limits.disk.priority"]),t.config["limits.network.priority"]=String(t.config["limits.network.priority"]),t.config["limits.memory.swap"]=String(t.config["limits.memory.swap"]),t.config["limits.memory.enforce"]=String(t.config["limits.memory.enforce"]),t}}},rO6o:function(t,e,i){"use strict";e.a={methods:{formatBytes:function(t,e){if(0===t)return"0 Bytes";var i=e||2,s=Math.floor(Math.log(t)/Math.log(1024));return parseFloat((t/Math.pow(1024,s)).toFixed(i))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][s]},isIP4:function(t){return!!/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(t)},uniqueId:function(t){t||(t=8);for(var e="",i=1;i<t+1;i+=8)e+=Math.random().toString(36).substr(2,10);return e.substr(0,t)},UUID:function(){function t(){return Math.random().toString(16).slice(-4)}return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}}}}});