webpackJsonp([8],{WT47:function(e,t,i){"use strict";var n=i("bOdI"),s=i.n(n),a=i("woOf"),r=i.n(a),o=i("Xxa5"),d=i.n(o),l=i("exGp"),c=i.n(l),g=i("Dd8w"),f=i.n(g),p=i("NYxO"),u=(i("4swq"),i("mtWM")),v=i.n(u),m=i("rO6o");t.a={mixins:[m.a],middleware:["authenticated"],components:{},computed:f()({},Object(p.mapGetters)({isAuthenticated:"auth/isAuthenticated",loggedUser:"auth/loggedUser",loggedToken:"auth/loggedToken"}),{networks:function(){return this.show_unmanaged?this.items:this.items.filter(function(e){return!0===e.managed})}}),data:function(){return{dialog:!1,valid:!0,error:{global:!1,editing:!1},snackbar:!1,snackbarColor:"green",snackbarText:"",snackbarTimeout:5e3,items:[],resources:{cpu:{total:0},memory:{total:0}},tableLoading:!0,tableHeaders:[{text:"Name",value:"name"},{text:"Description",value:"description"},{text:"IPv4 Address",value:"ipv4"},{text:"IPv6 Address",value:"ipv6"},{text:"Type",value:"type"},{text:"Used By",value:"used_by"},{text:"Managed",value:"managed"},{text:"Actions",value:"action",sortable:!1,align:"right"}],restart_on_save:!0,show_unmanaged:!1,state:{ip4:!0,ip6:!0,dhcp:!1,bridge:!1,dns:!1,fan:!1,raw:!1,tunnel:!1},editingIndex:-1,editingItem:{config:{"bridge.driver":"native","bridge.external_interfaces":"","bridge.mode":"standard","bridge.mtu":"","ipv4.address":"","ipv4.nat":"","ipv6.address":"","ipv6.nat":""},description:"",locations:[],managed:!0,name:"",status:"",type:"",used_by:[]},defaultItem:{config:{"bridge.driver":"native","bridge.external_interfaces":"","bridge.mode":"standard","bridge.mtu":"","ipv4.address":"","ipv4.nat":"","ipv6.address":"","ipv6.nat":""},description:"",locations:[],managed:!0,name:"",status:"",type:"",used_by:[]},nameRule:[function(e){return!!e||"Name is required"},function(e){return e&&e.length<=15||"Name is too long (maximum 15 characters)"}]}},beforeDestroy:function(){},mounted:function(){var e=c()(d.a.mark(function e(){var t,i=this;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(v.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,this.$storage.isset("lxd")){e.next=15;break}return e.prev=2,e.next=5,v.a.get(this.loggedUser.sub+"/api/lxd");case 5:t=e.sent,this.$storage.set("lxd",t.data.data),this.lxd=t.data,e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),this.$storage.remove("lxd");case 13:e.next=16;break;case 15:this.lxd=this.$storage.get("lxd");case 16:this.$nextTick(function(){i.initialize()});case 17:case"end":return e.stop()}},e,this,[[2,10]])}));return function(){return e.apply(this,arguments)}}(),watch:{dialog:function(e){e||this.close()}},methods:{initialize:function(){var e=c()(d.a.mark(function e(){var t;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,this.loggedUser||this.$router.replace("/servers"),e.next=4,v.a.get(this.loggedUser.sub+"/api/lxd/networks");case 4:t=e.sent,this.items=t.data.data,e.next=13;break;case 8:e.prev=8,e.t0=e.catch(0),this.items=[],this.tableNoData="No data.",this.error.global="Could not fetch data from server.";case 13:this.tableLoading=!1;case 14:case"end":return e.stop()}},e,this,[[0,8]])}));return function(){return e.apply(this,arguments)}}(),editItem:function(e){this.editingIndex=this.items.indexOf(e),this.editingItem=r()({},this.defaultItem,e),this.state.ip4=this.editingItem.config["ipv4.address"]&&"none"!==this.editingItem.config["ipv4.address"],this.state.ip6=this.editingItem.config["ipv6.address"]&&"none"!==this.editingItem.config["ipv6.address"],this.editingItem.config["bridge.mode"]||(this.editingItem.config=r()({},this.editingItem.config,{"bridge.driver":"native","bridge.external_interfaces":"","bridge.mode":"standard","bridge.mtu":""})),this.editingItem.config["ipv4.address"]&&"none"===this.editingItem.config["ipv4.address"]&&(this.editingItem.config["ipv4.address"]="",this.editingItem.config["ipv4.nat"]="false",this.editingItem.config["ipv4.routes"]="",this.editingItem.config["ipv4.firewall"]="false",this.editingItem.config["ipv4.routing"]="false",this.editingItem.config["ipv4.dhcp"]="false",this.editingItem.config["ipv4.dhcp.expiry"]="",this.editingItem.config["ipv4.dhcp.gateway"]="",this.editingItem.config["ipv4.dhcp.ranges"]=""),this.editingItem.config["ipv6.address"]&&"none"===this.editingItem.config["ipv6.address"]&&(this.editingItem.config["ipv6.address"]="",this.editingItem.config["ipv6.nat"]="false",this.editingItem.config["ipv6.routes"]="",this.editingItem.config["ipv6.firewall"]="false",this.editingItem.config["ipv6.routing"]="false",this.editingItem.config["ipv6.dhcp"]="false",this.editingItem.config["ipv6.dhcp.expiry"]="",this.editingItem.config["ipv6.dhcp.stateful"]="false",this.editingItem.config["ipv6.dhcp.ranges"]=""),this.dialog=!0},save:function(){var e=c()(d.a.mark(function e(){var t,i,n=this;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.$refs.form.validate()){e.next=28;break}if(e.prev=1,this.loggedUser||this.$router.replace("/servers"),this.state.ip4||(this.editingItem.config["ipv4.address"]="none",this.editingItem.config["ipv4.nat"]="false"),this.state.ip6||(this.editingItem.config["ipv6.address"]="none",this.editingItem.config["ipv6.nat"]="false"),""===this.editingItem.config["bridge.mtu"]&&this.$delete(this.editingItem.config,"bridge.mtu"),""===this.editingItem.config["ipv4.routes"]&&this.$delete(this.editingItem.config,"ipv4.routes"),""===this.editingItem.config["ipv4.dhcp.ranges"]&&this.$delete(this.editingItem.config,"ipv4.dhcp.ranges"),""===this.editingItem.config["ipv6.routes"]&&this.$delete(this.editingItem.config,"ipv6.routes"),""===this.editingItem.config["ipv6.dhcp.ranges"]&&this.$delete(this.editingItem.config,"ipv6.dhcp.ranges"),"fan"===this.editingItem.config["bridge.mode"]?(this.$delete(this.editingItem.config,"ipv4.address"),this.$delete(this.editingItem.config,"ipv4.nat"),this.$delete(this.editingItem.config,"ipv4.routes"),this.$delete(this.editingItem.config,"ipv4.firewall"),this.$delete(this.editingItem.config,"ipv4.routing"),this.$delete(this.editingItem.config,"ipv4.dhcp"),this.$delete(this.editingItem.config,"ipv4.dhcp.expiry"),this.$delete(this.editingItem.config,"ipv4.dhcp.stateful"),this.$delete(this.editingItem.config,"ipv4.dhcp.ranges"),this.$delete(this.editingItem.config,"ipv6.address"),this.$delete(this.editingItem.config,"ipv6.nat"),this.$delete(this.editingItem.config,"ipv6.routes"),this.$delete(this.editingItem.config,"ipv6.firewall"),this.$delete(this.editingItem.config,"ipv6.routing"),this.$delete(this.editingItem.config,"ipv6.dhcp"),this.$delete(this.editingItem.config,"ipv6.dhcp.expiry"),this.$delete(this.editingItem.config,"ipv6.dhcp.stateful"),this.$delete(this.editingItem.config,"ipv6.dhcp.ranges")):"standard"===this.editingItem.config["bridge.mode"]&&(this.$delete(this.editingItem.config,"fan.overlay_subnet"),this.$delete(this.editingItem.config,"fan.underlay_subnet"),this.$delete(this.editingItem.config,"fan.type")),!(this.editingIndex>-1)){e.next=17;break}return e.next=14,v.a.put(this.loggedUser.sub+"/api/lxd/networks/"+this.editingItem.name,{config:this.editingItem.config,description:this.editingItem.description,name:this.editingItem.name,type:this.editingItem.type});case 14:t=e.sent,e.next=20;break;case 17:return e.next=19,v.a.post(this.loggedUser.sub+"/api/lxd/networks",(i={name:this.editingItem.name,config:this.editingItem.config,description:this.editingItem.description},s()(i,"name",this.editingItem.name),s()(i,"type",this.editingItem.type),i));case 19:t=e.sent;case 20:422===t.data.code?this.error.editing=t.data.error:(this.error.editing=!1,this.editingIndex>-1?r()(this.items[this.editingIndex],this.editingItem):this.items.push(r()({},this.editingItem)),this.snackbar=!0,this.snackbarText="Network successfully saved.",this.restart_on_save&&setTimeout(function(){n.editingItem.used_by.forEach(function(e){var t=e.substr(e.lastIndexOf("/")+1);v.a.put(n.loggedUser.sub+"/api/lxd/containers/"+t+"/state",{action:"restart",timeout:30,force:!0,stateful:!1})})},1e3)),e.next=26;break;case 23:e.prev=23,e.t0=e.catch(1),this.error.global="Could not save network to server.";case 26:this.error.editing||-1!==this.editingIndex||this.close(),this.error.editing||this.initialize();case 28:case"end":return e.stop()}},e,this,[[1,23]])}));return function(){return e.apply(this,arguments)}}(),deleteItem:function(){var e=c()(d.a.mark(function e(t){var i=this;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.$prompt.show({persistent:!0,width:400,toolbar:{color:"red darken-3",closable:!1},title:"Delete network?",text:"Are you sure you want to delete the <b>"+t.name+"</b> network?",buttons:[{title:"Yes",color:"success",handler:function(){var e=c()(d.a.mark(function e(){var n;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=i.items.indexOf(t),i.items.splice(n,1),e.prev=2,e.next=5,v.a.delete(i.loggedUser.sub+"/api/lxd/networks/"+t.name);case 5:e.sent,i.snackbar=!0,i.snackbarColor="green",i.snackbarText="Network deleted.",e.next=14;break;case 11:e.prev=11,e.t0=e.catch(2),i.error.global="Failed to delete network.";case 14:case"end":return e.stop()}},e,i,[[2,11]])}));return function(){return e.apply(this,arguments)}}()},{title:"No",color:"error"}]});case 1:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),close:function(){var e=this;this.dialog=!1,setTimeout(function(){e.editingItem=r()({},e.defaultItem),e.editingIndex=-1,e.error.editing=!1},300)},ucfirst:function(e){return String(e).charAt(0).toUpperCase()+String(e).slice(1)}}}},bOdI:function(e,t,i){"use strict";t.__esModule=!0;var n,s=i("C4MV"),a=(n=s)&&n.__esModule?n:{default:n};t.default=function(e,t,i){return t in e?(0,a.default)(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}},lStM:function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-app",[i("v-snackbar",{attrs:{top:"",timeout:e.snackbarTimeout,color:e.snackbarColor},model:{value:e.snackbar,callback:function(t){e.snackbar=t},expression:"snackbar"}},[e._v("\n    "+e._s(e.snackbarText)+"\n    "),i("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(t){e.snackbar=!1}}},[e._v("Close")])],1),i("v-content",[i("v-container",{attrs:{fluid:"",tag:"section",id:"grid"}},[i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{"d-flex":"",xs12:"","order-xs5":""}},[i("v-layout",{attrs:{column:""}},[i("v-flex",{staticClass:"display mb-2",attrs:{tag:"h1"}},[i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs12:"",sm6:""}},[e._v("\n                  LXD - Networks\n                ")]),i("v-flex",{attrs:{xs12:"",sm6:""}},[i("v-btn",{staticStyle:{float:"right"},attrs:{small:"",color:"success"},on:{click:function(t){e.dialog=!0}}},[e._v("New Network")]),i("v-btn",{staticStyle:{float:"right"},attrs:{small:""},on:{click:function(t){e.show_unmanaged=!e.show_unmanaged}}},[e._v(e._s(e.show_unmanaged?"Hide":"Show")+" Unmanaged")])],1)],1)],1),i("v-flex",[i("v-alert",{attrs:{type:"error",value:e.error.global}},[e._v("\n                "+e._s(e.error.global)+"\n              ")]),i("v-data-table",{staticClass:"elevation-1",attrs:{headers:e.tableHeaders,items:e.networks,"hide-actions":"",loading:e.tableLoading},scopedSlots:e._u([{key:"items",fn:function(t){return[i("tr",[i("td",[t.item.managed?i("span",[i("a",{attrs:{href:"javascript:void(0)"},on:{click:function(i){i.stopPropagation(),e.editItem(t.item)}}},[e._v(e._s(t.item.name))])]):i("span",[e._v(e._s(t.item.name))])]),i("td",[e._v(e._s(t.item.description?e.ucfirst(t.item.description):"-"))]),i("td",[t.item.config["ipv4.address"]&&"none"!==t.item.config["ipv4.address"]?i("span",[e._v(e._s(t.item.config["ipv4.address"]))]):i("span",[e._v("-")])]),i("td",[t.item.config["ipv6.address"]&&"none"!==t.item.config["ipv6.address"]?i("span",[e._v(e._s(t.item.config["ipv6.address"]))]):i("span",[e._v("-")])]),i("td",[e._v(e._s(t.item.type?e.ucfirst(t.item.type):"-"))]),i("td",[e._v(e._s(t.item.used_by?t.item.used_by.length:"0"))]),i("td",[e._v(e._s(t.item.managed?"Yes":"No"))]),i("td",[i("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{icon:"",disabled:!t.item.managed},on:{click:function(i){i.stopPropagation(),e.deleteItem(t.item)}}},[i("v-icon",{attrs:{color:"pink"}},[e._v("delete")])],1)],1)])]}}])},[i("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),i("template",{slot:"no-data"},[e._v("\n                  "+e._s(e.tableLoading?"Fetching data, please wait...":"There are currently no networks.")+"\n                ")])],2)],1)],1)],1)],1)],1),i("v-dialog",{attrs:{"max-width":"650px",scrollable:""},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[i("v-card",{attrs:{tile:""}},[i("v-toolbar",{attrs:{card:"",dark:"",color:"light-blue darken-3"}},[i("v-btn",{attrs:{icon:"",dark:""},nativeOn:{click:function(t){e.dialog=!1}}},[i("v-icon",[e._v("close")])],1),i("v-toolbar-title",[e._v(e._s(-1===e.editingIndex?"New":"Edit")+" Network")]),i("v-spacer"),i("v-toolbar-items",[i("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(t){e.save()}}},[e._v("Save")])],1)],1),i("v-card-text",{staticStyle:{padding:"0px"}},[i("v-card",{attrs:{flat:""}},[i("v-card-text",[i("v-alert",{attrs:{type:"error",value:e.error.editing}},[e._v("\n                "+e._s(e.error.editing)+"\n              ")]),i("v-alert",{attrs:{type:"info",value:e.editingItem.used_by.length>0,outline:"",color:"info",icon:"priority_high"}},[e._v("\n                This network is used by "+e._s(e.editingItem.used_by.length)+" container"+e._s(e.editingItem.used_by.length>1?"s":"")+".\n              ")]),i("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[i("v-text-field",{attrs:{rules:e.nameRule,label:"Name:",placeholder:"",required:"",hint:"Enter a name for the network."},model:{value:e.editingItem.name,callback:function(t){e.$set(e.editingItem,"name",t)},expression:"editingItem.name"}}),i("v-text-field",{attrs:{label:"Description:",placeholder:"",hint:"Enter a description for the network."},model:{value:e.editingItem.description,callback:function(t){e.$set(e.editingItem,"description",t)},expression:"editingItem.description"}}),e.editingItem.used_by.length>0?i("v-checkbox",{attrs:{label:"Restart container"+(e.editingItem.used_by.length>1?"s":"")+" on save."},model:{value:e.restart_on_save,callback:function(t){e.restart_on_save=t},expression:"restart_on_save"}}):e._e(),i("h2",[e._v("Bridge")]),i("v-select",{attrs:{items:["native","openvswitch"],label:"Driver:"},model:{value:e.editingItem.config["bridge.driver"],callback:function(t){e.$set(e.editingItem.config,"bridge.driver",t)},expression:"editingItem.config['bridge.driver']"}}),i("v-text-field",{attrs:{label:"External Interfaces:",placeholder:"",hint:"Comma separate list of unconfigured network interfaces to include in the bridge."},model:{value:e.editingItem.config["bridge.external_interfaces"],callback:function(t){e.$set(e.editingItem.config,"bridge.external_interfaces",t)},expression:"editingItem.config['bridge.external_interfaces']"}}),i("v-select",{attrs:{items:["standard","fan"],label:"Mode:"},model:{value:e.editingItem.config["bridge.mode"],callback:function(t){e.$set(e.editingItem.config,"bridge.mode",t)},expression:"editingItem.config['bridge.mode']"}}),i("v-text-field",{attrs:{label:"MTU:",placeholder:"",hint:"Bridge MTU (default varies if tunnel or fan setup)"},model:{value:e.editingItem.config["bridge.mtu"],callback:function(t){e.$set(e.editingItem.config,"bridge.mtu",t)},expression:"editingItem.config['bridge.mtu']"}}),i("div",{directives:[{name:"show",rawName:"v-show",value:"standard"==e.editingItem.config["bridge.mode"],expression:"editingItem.config['bridge.mode'] == 'standard'"}]},[i("h2",[e._v("IPv4 "),i("v-switch",{staticStyle:{"margin-left":"60px","margin-right":"-60px","margin-top":"-30px",width:"50%"},attrs:{color:"success"},model:{value:e.state.ip4,callback:function(t){e.$set(e.state,"ip4",t)},expression:"state.ip4"}})],1),e.state.ip4?i("div",{staticStyle:{"margin-top":"-20px"}},[i("v-text-field",{attrs:{label:"IPv4 address:",required:"",placeholder:"",hint:'IPv4 address for the bridge (CIDR notation). Enter "auto" to generate a new one.'},model:{value:e.editingItem.config["ipv4.address"],callback:function(t){e.$set(e.editingItem.config,"ipv4.address",t)},expression:"editingItem.config['ipv4.address']"}}),i("v-text-field",{attrs:{label:"IPv4 routes:",placeholder:"",hint:"Comma separated list of additional IPv4 CIDR subnets to route to the bridge."},model:{value:e.editingItem.config["ipv4.routes"],callback:function(t){e.$set(e.editingItem.config,"ipv4.routes",t)},expression:"editingItem.config['ipv4.routes']"}}),i("v-layout",{staticStyle:{"margin-top":"10px"},attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs4:""}},[i("h4",[e._v("NAT")]),i("v-switch",{attrs:{label:"true"===e.editingItem.config["ipv4.nat"]?"Yes":"No","true-value":"true","false-value":"false",color:"success","persistent-hint":"",hint:"Whether to NAT."},model:{value:e.editingItem.config["ipv4.nat"],callback:function(t){e.$set(e.editingItem.config,"ipv4.nat",t)},expression:"editingItem.config['ipv4.nat']"}})],1),i("v-flex",{attrs:{xs4:""}},[i("h4",[e._v("Firewall")]),i("v-switch",{attrs:{label:"true"===e.editingItem.config["ipv4.firewall"]?"Yes":"No","true-value":"true","false-value":"false",color:"success","persistent-hint":"",hint:"Generate filtering firewall rules."},model:{value:e.editingItem.config["ipv4.firewall"],callback:function(t){e.$set(e.editingItem.config,"ipv4.firewall",t)},expression:"editingItem.config['ipv4.firewall']"}})],1),i("v-flex",{attrs:{xs4:""}},[i("h4",[e._v("Routing")]),i("v-switch",{attrs:{label:"true"===e.editingItem.config["ipv4.routing"]?"Yes":"No","true-value":"true","false-value":"false",color:"success","persistent-hint":"",hint:"Route traffic in and out of the bridge."},model:{value:e.editingItem.config["ipv4.routing"],callback:function(t){e.$set(e.editingItem.config,"ipv4.routing",t)},expression:"editingItem.config['ipv4.routing']"}})],1)],1),i("h3",{staticStyle:{"margin-top":"20px"}},[e._v("IPv4 DHCP "),i("v-switch",{staticStyle:{"margin-left":"100px","margin-right":"-60px","margin-top":"-28px",width:"50%"},attrs:{color:"success","true-value":"true","false-value":"false"},model:{value:e.editingItem.config["ipv4.dhcp"],callback:function(t){e.$set(e.editingItem.config,"ipv4.dhcp",t)},expression:"editingItem.config['ipv4.dhcp']"}})],1),"true"===e.editingItem.config["ipv4.dhcp"]?i("div",{staticStyle:{"margin-top":"-20px"}},[i("v-text-field",{attrs:{label:"IPv4 DHCP expiry:",placeholder:"",hint:"When to expire DHCP leases."},model:{value:e.editingItem.config["ipv4.dhcp.expiry"],callback:function(t){e.$set(e.editingItem.config,"ipv4.dhcp.expiry",t)},expression:"editingItem.config['ipv4.dhcp.expiry']"}}),i("v-text-field",{attrs:{label:"IPv4 gateway address:",placeholder:"",hint:"Address of the gateway for the subnet."},model:{value:e.editingItem.config["ipv4.dhcp.gateway"],callback:function(t){e.$set(e.editingItem.config,"ipv4.dhcp.gateway",t)},expression:"editingItem.config['ipv4.dhcp.gateway']"}}),i("v-text-field",{attrs:{label:"IPv4 DHCP ranges:",placeholder:"",hint:"Comma separated list of IP ranges to use for DHCP (e.g: "+e.editingItem.config["ipv4.address"].substring(0,e.editingItem.config["ipv4.address"].lastIndexOf(".")+2)+".2-"+e.editingItem.config["ipv4.address"].substring(0,e.editingItem.config["ipv4.address"].lastIndexOf(".")+2)+".255)"},model:{value:e.editingItem.config["ipv4.dhcp.ranges"],callback:function(t){e.$set(e.editingItem.config,"ipv4.dhcp.ranges",t)},expression:"editingItem.config['ipv4.dhcp.ranges']"}})],1):e._e()],1):e._e(),i("h2",[e._v("IPv6 "),i("v-switch",{staticStyle:{"margin-left":"60px","margin-right":"-60px","margin-top":"-30px",width:"50%"},attrs:{color:"success"},model:{value:e.state.ip6,callback:function(t){e.$set(e.state,"ip6",t)},expression:"state.ip6"}})],1),e.state.ip6?i("div",{staticStyle:{"margin-top":"-20px"}},[i("v-text-field",{attrs:{label:"IPv6 address:",required:"",placeholder:"",hint:'IPv6 address for the bridge (CIDR notation). Enter "auto" to generate a new one.'},model:{value:e.editingItem.config["ipv6.address"],callback:function(t){e.$set(e.editingItem.config,"ipv6.address",t)},expression:"editingItem.config['ipv6.address']"}}),i("v-text-field",{attrs:{label:"IPv6 routes:",placeholder:"",hint:"Comma separated list of additional IPv6 CIDR subnets to route to the bridge."},model:{value:e.editingItem.config["ipv6.routes"],callback:function(t){e.$set(e.editingItem.config,"ipv6.routes",t)},expression:"editingItem.config['ipv6.routes']"}}),i("v-layout",{staticStyle:{"margin-top":"10px"},attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs4:""}},[i("h4",[e._v("NAT")]),i("v-switch",{attrs:{label:"true"===e.editingItem.config["ipv6.nat"]?"Yes":"No","true-value":"true","false-value":"false",color:"success","persistent-hint":"",hint:"Whether to NAT."},model:{value:e.editingItem.config["ipv6.nat"],callback:function(t){e.$set(e.editingItem.config,"ipv6.nat",t)},expression:"editingItem.config['ipv6.nat']"}})],1),i("v-flex",{attrs:{xs4:""}},[i("h4",[e._v("Firewall")]),i("v-switch",{attrs:{label:"true"===e.editingItem.config["ipv6.firewall"]?"Yes":"No","true-value":"true","false-value":"false",color:"success","persistent-hint":"",hint:"Generate filtering firewall rules."},model:{value:e.editingItem.config["ipv6.firewall"],callback:function(t){e.$set(e.editingItem.config,"ipv6.firewall",t)},expression:"editingItem.config['ipv6.firewall']"}})],1),i("v-flex",{attrs:{xs4:""}},[i("h4",[e._v("Routing")]),i("v-switch",{attrs:{label:"true"===e.editingItem.config["ipv6.routing"]?"Yes":"No","true-value":"true","false-value":"false",color:"success","persistent-hint":"",hint:"Route traffic in and out of the bridge."},model:{value:e.editingItem.config["ipv6.routing"],callback:function(t){e.$set(e.editingItem.config,"ipv6.routing",t)},expression:"editingItem.config['ipv6.routing']"}})],1)],1),i("h3",{staticStyle:{"margin-top":"20px"}},[e._v("IPv6 DHCP "),i("v-switch",{staticStyle:{"margin-left":"100px","margin-right":"-60px","margin-top":"-28px",width:"50%"},attrs:{color:"success","true-value":"true","false-value":"false"},model:{value:e.editingItem.config["ipv6.dhcp"],callback:function(t){e.$set(e.editingItem.config,"ipv6.dhcp",t)},expression:"editingItem.config['ipv6.dhcp']"}})],1),"true"===e.editingItem.config["ipv6.dhcp"]?i("div",{staticStyle:{"margin-top":"-20px"}},[i("v-text-field",{attrs:{label:"IPv6 DHCP expiry:",placeholder:"",hint:"When to expire DHCP leases."},model:{value:e.editingItem.config["ipv6.dhcp.expiry"],callback:function(t){e.$set(e.editingItem.config,"ipv6.dhcp.expiry",t)},expression:"editingItem.config['ipv6.dhcp.expiry']"}}),i("h4",[e._v("Stateful")]),i("v-switch",{attrs:{label:"true"===e.editingItem.config["ipv6.dhcp.stateful"]?"Yes":"No","true-value":"true","false-value":"false",color:"success","persistent-hint":"",hint:"Whether to allocate addresses using DHCP."},model:{value:e.editingItem.config["ipv6.dhcp.stateful"],callback:function(t){e.$set(e.editingItem.config,"ipv6.dhcp.stateful",t)},expression:"editingItem.config['ipv6.dhcp.stateful']"}}),i("v-text-field",{staticStyle:{"margin-top":"10px"},attrs:{label:"IPv6 DHCP ranges:",placeholder:"",hint:"Comma separated list of IP ranges to use for DHCP (e.g: "+e.editingItem.config["ipv6.address"].substring(0,e.editingItem.config["ipv6.address"].lastIndexOf(":")+1)+"2-"+e.editingItem.config["ipv6.address"].substring(0,e.editingItem.config["ipv6.address"].lastIndexOf(":")+1)+"255)"},model:{value:e.editingItem.config["ipv6.dhcp.ranges"],callback:function(t){e.$set(e.editingItem.config,"ipv6.dhcp.ranges",t)},expression:"editingItem.config['ipv6.dhcp.ranges']"}})],1):e._e()],1):e._e()]),i("div",{directives:[{name:"show",rawName:"v-show",value:"fan"==e.editingItem.config["bridge.mode"],expression:"editingItem.config['bridge.mode'] == 'fan'"}]},[i("h2",[e._v("Fan")]),i("v-text-field",{attrs:{label:"Overlay Subnet:",placeholder:"",hint:"Subnet to use as the overlay for the FAN (CIDR notation)."},model:{value:e.editingItem.config["fan.overlay_subnet"],callback:function(t){e.$set(e.editingItem.config,"fan.overlay_subnet",t)},expression:"editingItem.config['fan.overlay_subnet']"}}),i("v-text-field",{attrs:{label:"Underlay Subnet:",placeholder:"",hint:"Subnet to use as the underlay for the FAN (CIDR notation)."},model:{value:e.editingItem.config["fan.underlay_subnet"],callback:function(t){e.$set(e.editingItem.config,"fan.underlay_subnet",t)},expression:"editingItem.config['fan.underlay_subnet']"}}),i("v-select",{attrs:{items:["vxlan","ipip"],label:"Type:"},model:{value:e.editingItem.config["fan.type"],callback:function(t){e.$set(e.editingItem.config,"fan.type",t)},expression:"editingItem.config['fan.type']"}})],1)],1)],1)],1)],1),i("div",{staticStyle:{flex:"1 1 auto"}})],1)],1)],1)],1)};n._withStripped=!0;var s={render:n,staticRenderFns:[]};t.a=s},pLqx:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("WT47"),s=i("lStM"),a=!1;var r=function(e){a||i("pQHc")},o=i("VU/8")(n.a,s.a,!1,r,null,null);o.options.__file="pages/lxd/networks.vue",t.default=o.exports},pQHc:function(e,t,i){var n=i("zV65");"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);i("rjj0")("2dee13ef",n,!1,{sourceMap:!1})},rO6o:function(e,t,i){"use strict";t.a={methods:{formatBytes:function(e,t){if(0===e)return"0 Bytes";var i=t||2,n=Math.floor(Math.log(e)/Math.log(1024));return parseFloat((e/Math.pow(1024,n)).toFixed(i))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][n]},isIP4:function(e){return!!/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(e)},uniqueId:function(e){e||(e=8);for(var t="",i=1;i<e+1;i+=8)t+=Math.random().toString(36).substr(2,10);return t.substr(0,e)},UUID:function(){function e(){return Math.random().toString(16).slice(-4)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}}}},zV65:function(e,t,i){(e.exports=i("FZ+f")(!1)).push([e.i,"",""])}});