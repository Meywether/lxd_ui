webpackJsonp([5],{C9Wf:function(e,t,i){"use strict";var s=i("M6fN"),r=i("b4U7"),a=!1;var n=function(e){a||i("IkaJ")},o=i("VU/8")(s.a,r.a,!1,n,null,null);o.options.__file="components/lxd/ssh-keys.vue",t.a=o.exports},Ee0Q:function(e,t){e.exports={empty:function(){return{architecture:"",config:{"image.architecture":"","image.description":"","image.os":"","image.release":"","image.serial":"","volatile.base_image":"","volatile.eth0.hwaddr":"","volatile.eth0.name":"","volatile.idmap.base":"","volatile.idmap.next":"","volatile.last_state.idmap":"","volatile.last_state.power":"","boot.autostart":!1,"security.privileged":!1,"security.nesting":!1,"limits.cpu":1,"limits.cpu.priority":5,"limits.processes":500,"limits.memory.swap.priority":5,"limits.disk.priority":5,"limits.network.priority":5,"limits.cpu.allowance":50,"limits.memory":1024,"limits.memory.swap":"0","limits.memory.enforce":"soft","user.sshkeys":"","raw.idmap":""},devices:{},ephemeral:!1,privileged:!1,profiles:["default"],stateful:!0,description:"",created_at:"",expanded_config:{},expanded_devices:{},name:"",status:"",status_code:0,last_used_at:"",state:{status:"",status_code:0,disk:{},memory:{usage:0,usage_peak:0,swap_usage:0,swap_usage_peak:0},network:{},pid:0,processes:0,cpu:{usage:0}},snapshots:[]}},infix:function(e){var t=this.empty(),i=t.config;return i["boot.autostart"]=e.config["boot.autostart"],i["security.privileged"]=e.config["security.privileged"],i["security.nesting"]=e.config["security.nesting"],i["limits.cpu"]=e.config["limits.cpu"]?Number(e.config["limits.cpu"]):t.config["limits.cpu"],i["limits.cpu.priority"]=e.config["limits.cpu.priority"]?Number(e.config["limits.cpu.priority"]):t.config["limits.cpu.priority"],i["limits.cpu.allowance"]=e.config["limits.cpu.allowance"]?Number(e.config["limits.cpu.allowance"].substring(0,e.config["limits.cpu.allowance"].indexOf("%"))):t.config["limits.cpu.allowance"],i["limits.processes"]=e.config["limits.processes"]?Number(e.config["limits.processes"]):t.config["limits.processes"],i["limits.disk.priority"]=e.config["limits.disk.priority"]?Number(e.config["limits.disk.priority"]):t.config["limits.disk.priority"],i["limits.network.priority"]=e.config["limits.network.priority"]?Number(e.config["limits.network.priority"]):t.config["limits.network.priority"],i["limits.memory"]=e.config["limits.memory"]?Number(e.config["limits.memory"].substring(0,e.config["limits.memory"].indexOf("MB"))):t.config["limits.memory"],i["limits.memory.swap"]=e.config["limits.memory.swap"]?e.config["limits.memory.swap"]:0,i["limits.memory.enforce"]="hard"===e.config["limits.memory.enforce"]?"hard":"soft",i["limits.memory.swap.priority"]=e.config["limits.memory.swap.priority"]?Number(e.config["limits.memory.swap.priority"]):t.config["limits.memory.swap.priority"],i["image.architecture"]=e.config["image.architecture"]||"",i["image.description"]=e.config["image.description"]||"",i["image.label"]=e.config["image.label"]||"",i["image.os"]=e.config["image.os"]||"",i["image.release"]=e.config["image.release"]||"",i["image.serial"]=e.config["image.serial"]||"",i["image.version"]=e.config["image.version"]||"",i["volatile.base_image"]=e.config["volatile.base_image"]||"",i["volatile.eth0.hwaddr"]=e.config["volatile.eth0.hwaddr"]||"",i["volatile.eth0.name"]=e.config["volatile.eth0.name"]||"",i["volatile.idmap.base"]=e.config["volatile.idmap.base"]||"",i["volatile.idmap.next"]=e.config["volatile.idmap.next"]||"",i["volatile.last_state.idmap"]=e.config["volatile.last_state.idmap"]||"",i["volatile.last_state.power"]=e.config["volatile.last_state.power"]||"",i["raw.idmap"]=e.config["raw.idmap"]||"",i["user.sshkeys"]=e.config["user.sshkeys"]||"",e.config=i,e},outfix:function(e){var t={"boot.autostart":e.config["boot.autostart"],"security.privileged":e.config["security.privileged"],"security.nesting":e.config["security.nesting"],"limits.cpu":String(e.config["limits.cpu"]),"limits.cpu.allowance":String(e.config["limits.cpu.allowance"])+"%","limits.cpu.priority":String(e.config["limits.cpu.priority"]),"limits.processes":String(e.config["limits.processes"]),"limits.memory":String(e.config["limits.memory"])+"MB","limits.memory.swap":String(e.config["limits.memory.swap"]),"limits.memory.swap.priority":String(e.config["limits.memory.swap.priority"]),"limits.memory.enforce":String(e.config["limits.memory.enforce"]),"limits.disk.priority":String(e.config["limits.disk.priority"]),"limits.network.priority":String(e.config["limits.network.priority"])};return t["image.architecture"]=e.config["image.architecture"]||"",t["image.description"]=e.config["image.description"]||"",t["image.label"]=e.config["image.label"]||"",t["image.os"]=e.config["image.os"]||"",t["image.release"]=e.config["image.release"]||"",t["image.serial"]=e.config["image.serial"]||"",t["image.version"]=e.config["image.version"]||"",t["limits.cpu.allowance"]=t["limits.cpu.allowance"].replace("%%","%"),t["limits.memory"]=t["limits.memory"].replace("MBMB","MB"),void 0!==e.config["raw.idmap"]&&(t["raw.idmap"]=e.config["raw.idmap"].trim()),void 0!==e.config["user.sshkeys"]&&(t["user.sshkeys"]=e.config["user.sshkeys"].trim()),e.config=t,void 0!==e.config["limits.memory.enforce"]&&null!==e.config["limits.memory.enforce"]||(e.config["limits.memory.enforce"]="soft"),void 0!==e.config["limits.memory.swap"]&&null!==e.config["limits.memory.swap"]||(e.config["limits.memory.swap"]="0"),e}}},IkaJ:function(e,t,i){var s=i("rPMW");"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);i("rjj0")("12bcd6ec",s,!1,{sourceMap:!1})},Jwlx:function(e,t,i){(e.exports=i("FZ+f")(!1)).push([e.i,"",""])},M6fN:function(e,t,i){"use strict";var s=i("mvHQ"),r=i.n(s),a=i("Xxa5"),n=i.n(a),o=i("woOf"),c=i.n(o),l=i("exGp"),m=i.n(l),d=i("Dd8w"),u=i.n(d),p=i("NYxO"),f=i("mtWM"),g=i.n(f),h=i("Ee0Q");t.a={components:{},props:["linked"],computed:u()({},Object(p.mapGetters)({loggedUser:"auth/loggedUser",loggedToken:"auth/loggedToken"}),{tableHeaders:function(){return this.linked,[{text:"Name",value:"name"},{text:"Fingerprint",value:"fingerprint"},{text:"Actions",value:"name",sortable:!1,align:"center",width:"100px"}]}}),data:function(){return{error:!1,attachError:!1,valid:!0,dialog:!1,tableLoading:!0,items:[],selectedItems:[],editingIndex:-1,editingItem:{id:-1,name:"",key:"",fingerprint:""},defaultItem:{id:-1,name:"",key:"",fingerprint:""},linkedItem:{},nameRule:[function(e){return!!e||"Name is required"},function(e){return e&&e.length<=100||"Name must be less than 100 characters"}],keyRule:[function(e){return!!e||"Public key is required"}]}},beforeDestroy:function(){},mounted:function(){var e=m()(n.a.mark(function e(){var t,i,s=this;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(g.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,this.$storage.isset("lxd")){e.next=15;break}return e.prev=2,e.next=5,g.a.get(this.loggedUser.sub+"/api/lxd");case 5:t=e.sent,this.$storage.set("lxd",t.data),this.lxd=t.data,e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),this.$storage.remove("lxd");case 13:e.next=16;break;case 15:this.lxd=this.$storage.get("lxd");case 16:this.linked&&(this.linkedItem=c()({},this.linked),this.linkedItem.config&&this.linkedItem.config["user.sshkeys"]?(i=this.linkedItem.config["user.sshkeys"],this.selectedItems=i.split("\n")):this.selectedItems=[]),this.$nextTick(function(){s.initialize()});case 18:case"end":return e.stop()}},e,this,[[2,10]])}));return function(){return e.apply(this,arguments)}}(),watch:{dialog:function(e){e||this.close()}},methods:{initialize:function(){var e=m()(n.a.mark(function e(){var t;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,g.a.get(this.loggedUser.sub+"/api/lxd/ssh-keys");case 3:t=e.sent,this.items=t.data.data,e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),this.error="Could not fetch data from server.";case 10:this.tableLoading=!1;case 11:case"end":return e.stop()}},e,this,[[0,7]])}));return function(){return e.apply(this,arguments)}}(),attachItem:function(){var e=m()(n.a.mark(function e(t){var i;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.linkedItem=c()({},h.outfix(this.linkedItem)),this.selectedItems.push(t.id),this.$set(this.linkedItem.config,"user.sshkeys",this.selectedItems.join("\n")),e.next=5,g.a.post(this.loggedUser.sub+"/api/lxd/containers/"+this.linkedItem.name+"/exec",{command:["/bin/bash","-c",'echo "'+t.key+'" >> /root/.ssh/authorized_keys'],environment:{HOME:"/root",TERM:"xterm",USER:"root"},"wait-for-websocket":!1,interactive:!1,"record-output":!0,width:80,height:80});case 5:return i=e.sent,e.next=8,g.a.patch(this.loggedUser.sub+"/api/lxd/containers/"+this.linkedItem.name,{config:this.linkedItem.config});case 8:(i=e.sent).data.error&&(this.attachError=i.data.error);case 10:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),detachItem:function(){var e=m()(n.a.mark(function e(t){var i,s,r,a;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.attachError=!1,this.linkedItem=c()({},h.outfix(this.linkedItem)),i=this.selectedItems.indexOf(t.id),this.selectedItems.splice(i,1),s=t.id,r=new RegExp(s,"g"),this.linkedItem.config["user.sshkeys"]=this.linkedItem.config["user.sshkeys"].replace(r,""),e.next=9,g.a.post(this.loggedUser.sub+"/api/lxd/containers/"+this.linkedItem.name+"/exec",{command:["/bin/bash","-c","sed -i 's|"+t.key+"||g' /root/.ssh/authorized_keys && sed -i '/^s*$/d' /root/.ssh/authorized_keys"],environment:{HOME:"/root",TERM:"xterm",USER:"root"},"wait-for-websocket":!1,interactive:!1,"record-output":!0,width:80,height:80});case 9:return a=e.sent,""===this.linkedItem.config["user.sshkeys"]&&delete this.linkedItem.config["user.sshkeys"],e.next=13,g.a.put(this.loggedUser.sub+"/api/lxd/containers/"+this.linkedItem.name,{config:this.linkedItem.config,devices:this.linkedItem.devices,ephemeral:this.linkedItem.ephemeral,stateful:this.linkedItem.stateful,profiles:this.linkedItem.profiles});case 13:(a=e.sent).data.error&&(this.attachError=a.data.error);case 15:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),editItem:function(e){this.editingIndex=this.items.indexOf(e),this.editingItem=JSON.parse(r()(e)),this.dialog=!0},saveItem:function(){var e=m()(n.a.mark(function e(){var t,i;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(this.error=!1,!this.$refs.form.validate()){e.next=19;break}if(e.prev=2,t={id:this.editingItem.id,name:this.editingItem.name,key:this.editingItem.key},!(this.editingIndex>-1)){e.next=10;break}return e.next=7,g.a.put(this.loggedUser.sub+"/api/lxd/ssh-keys/"+this.editingItem.id,t);case 7:i=e.sent,e.next=13;break;case 10:return e.next=12,g.a.post(this.loggedUser.sub+"/api/lxd/ssh-keys",t);case 12:i=e.sent;case 13:i.data.error?(i.data.error.name&&(this.error=i.data.error.name),i.data.error.key&&(this.error=i.data.error.key)):(this.$emit("snackbar","SSH key successfully saved."),-1===this.editingIndex&&this.close(),this.initialize()),e.next=19;break;case 16:e.prev=16,e.t0=e.catch(2),this.error="Could not save SSH key to server.";case 19:case"end":return e.stop()}},e,this,[[2,16]])}));return function(){return e.apply(this,arguments)}}(),deleteItem:function(){var e=m()(n.a.mark(function e(t){var i=this;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.$prompt.show({persistent:!0,width:400,toolbar:{color:"red darken-3",closable:!1},title:"Delete SSH key?",text:"Are you sure you want to delete the <b>"+t.name+'</b> key?<p class="text-md-center red--text"><br><b>Keys are not removed from containers!</b></p>',buttons:[{title:"Yes",color:"success",handler:function(){var e=m()(n.a.mark(function e(){var s;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return s=i.items.indexOf(t),i.items.splice(s,1),e.prev=2,e.next=5,g.a.delete(i.loggedUser.sub+"/api/lxd/ssh-keys/"+t.id);case 5:e.sent,i.$emit("snackbar","SSH key successfully deleted."),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(2),i.error="Failed to delete SSH key.";case 12:case"end":return e.stop()}},e,i,[[2,9]])}));return function(){return e.apply(this,arguments)}}()},{title:"No",color:"error"}]});case 1:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),openDialog:function(){this.dialog=!0},close:function(){var e=this;this.dialog=!1,setTimeout(function(){e.editingItem=c()({},e.defaultItem),e.editingIndex=-1,e.error=!1},300)},ucfirst:function(e){return String(e).charAt(0).toUpperCase()+String(e).slice(1)}}}},QaXM:function(e,t,i){"use strict";var s=i("C9Wf");t.a={components:{sshKeys:s.a},data:function(){return{error:"",activeTab:"none",snackbar:!1,snackbarColor:"green",snackbarText:"",snackbarTimeout:5e3}},methods:{setSnackbar:function(e){this.snackbar=!0,this.snackbarTimeout=2500,this.snackbarText=e},setError:function(e){this.error=e},openDialog:function(){this.$refs[this.activeTab].openDialog()}}}},"Uz+O":function(e,t,i){var s=i("Jwlx");"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);i("rjj0")("0d612590",s,!1,{sourceMap:!1})},b4U7:function(e,t,i){"use strict";var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("v-alert",{attrs:{type:"error",value:e.attachError}},[e._v("\n    "+e._s(e.attachError)+"\n  ")]),i("v-data-table",{attrs:{headers:e.tableHeaders,items:e.items,"hide-actions":"",loading:e.tableLoading},scopedSlots:e._u([{key:"items",fn:function(t){return[i("tr",[i("td",[e.linkedItem.devices?i("span",[e._v(e._s(t.item.name))]):i("span",[i("a",{attrs:{href:"javascript:void(0)"},on:{click:function(i){i.stopPropagation(),e.editItem(t.item)}}},[e._v(e._s(t.item.name))])])]),i("td",[e._v("\n          "+e._s(t.item.fingerprint)+"\n        ")]),i("td",[e.linkedItem.devices?i("span",[e.selectedItems.includes(t.item.id)?e._e():i("v-btn",{attrs:{depressed:"",small:""},on:{click:function(i){e.attachItem(t.item)}}},[e._v("Add")]),e.selectedItems.includes(t.item.id)?i("v-btn",{attrs:{dark:"",depressed:"",small:"",color:"red"},on:{click:function(i){e.detachItem(t.item)}}},[e._v("Remove")]):e._e()],1):i("v-tooltip",{attrs:{left:""}},[i("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{slot:"activator",icon:""},on:{click:function(i){i.stopPropagation(),e.deleteItem(t.item)}},slot:"activator"},[i("v-icon",{attrs:{color:"pink"}},[e._v("delete")])],1),i("span",[e._v("Delete")])],1)],1)])]}}])},[i("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),i("template",{slot:"no-data"},[e._v("\n      "+e._s(e.tableLoading?"Fetching data, please wait...":"There are currently no SSH keys.")+"\n    ")])],2),i("v-dialog",{attrs:{"max-width":"700px",scrollable:"","hide-overlay":null!==e.linkedItem},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[i("v-card",{attrs:{flat:""}},[i("v-toolbar",{attrs:{card:"",dark:"",color:"light-blue darken-3"}},[i("v-btn",{attrs:{icon:"",dark:""},nativeOn:{click:function(t){e.close()}}},[i("v-icon",[e._v("close")])],1),i("v-toolbar-title",[e._v(e._s(-1===e.editingIndex?"New":"Edit")+" SSH key")]),i("v-spacer"),i("v-toolbar-items",[i("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(t){e.saveItem()}}},[e._v("Save")])],1)],1),i("v-card-text",[i("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[i("v-alert",{attrs:{type:"error",value:e.error}},[e._v("\n            "+e._s(e.error)+"\n          ")]),i("v-text-field",{attrs:{rules:e.nameRule,label:"Name:",placeholder:"",required:"",hint:"The name of the SSH key."},model:{value:e.editingItem.name,callback:function(t){e.$set(e.editingItem,"name",t)},expression:"editingItem.name"}}),i("v-text-field",{attrs:{rules:e.keyRule,label:"Public Key:",placeholder:"","multi-line":"",required:"",hint:"The SSH public key."},model:{value:e.editingItem.key,callback:function(t){e.$set(e.editingItem,"key",t)},expression:"editingItem.key"}})],1)],1),i("div",{staticStyle:{flex:"1 1 auto"}})],1)],1)],1)};s._withStripped=!0;var r={render:s,staticRenderFns:[]};t.a=r},ewnJ:function(e,t,i){"use strict";var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-app",[i("v-snackbar",{attrs:{top:"",timeout:e.snackbarTimeout,color:e.snackbarColor},model:{value:e.snackbar,callback:function(t){e.snackbar=t},expression:"snackbar"}},[e._v("\n    "+e._s(e.snackbarText)+"\n    "),i("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(t){e.snackbar=!1}}},[e._v("Close")])],1),i("v-content",[i("v-container",{attrs:{fluid:"",tag:"section",id:"grid"}},[i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{"d-flex":"",xs12:"","order-xs5":""}},[i("v-layout",{attrs:{column:""}},[i("v-flex",{staticClass:"display mb-2",attrs:{tag:"h1"}},[i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs12:"",sm6:""}},[e._v("\n                  LXD - SSH Keys\n                ")]),i("v-flex",{attrs:{xs12:"",sm6:""}},[i("v-btn",{staticStyle:{float:"right"},attrs:{small:"",color:"success"},on:{click:function(t){e.openDialog()}}},[e._v("New SSH Key")])],1)],1)],1),i("v-flex",[i("p",[e._v("SSH keys allow you to login to the containers using a standard SSH client.")]),i("v-alert",{attrs:{type:"error",value:e.error}},[e._v("\n                "+e._s(e.error)+"\n              ")]),i("v-card",[i("v-card-text",{staticStyle:{padding:"0"}},[i("ssh-keys",{ref:"none",on:{snackbar:e.setSnackbar}})],1)],1)],1)],1)],1)],1)],1)],1)],1)};s._withStripped=!0;var r={render:s,staticRenderFns:[]};t.a=r},g5zm:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i("QaXM"),r=i("ewnJ"),a=!1;var n=function(e){a||i("Uz+O")},o=i("VU/8")(s.a,r.a,!1,n,null,null);o.options.__file="pages/lxd/ssh-keys.vue",t.default=o.exports},rPMW:function(e,t,i){(e.exports=i("FZ+f")(!1)).push([e.i,"",""])}});