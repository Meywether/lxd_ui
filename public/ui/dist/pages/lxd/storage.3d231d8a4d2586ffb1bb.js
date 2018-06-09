webpackJsonp([8],{JTAs:function(e,t,i){var o=i("KOMR");"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);i("rjj0")("516479e4",o,!1,{sourceMap:!1})},KOMR:function(e,t,i){(e.exports=i("FZ+f")(!1)).push([e.i,"",""])},SzwM:function(e,t,i){"use strict";var o=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-app",[i("v-snackbar",{attrs:{top:"",timeout:e.snackbarTimeout,color:e.snackbarColor},model:{value:e.snackbar,callback:function(t){e.snackbar=t},expression:"snackbar"}},[e._v("\n    "+e._s(e.snackbarText)+"\n    "),i("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(t){e.snackbar=!1}}},[e._v("Close")])],1),i("v-content",[i("v-container",{attrs:{fluid:"",tag:"section",id:"grid"}},[i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{"d-flex":"",xs12:"","order-xs5":""}},[i("v-layout",{attrs:{column:""}},[i("v-flex",{staticClass:"display mb-2",attrs:{tag:"h1"}},[e._v("\n              LXD - Storage\n              "),i("v-btn",{staticStyle:{float:"right"},attrs:{color:"success"},on:{click:function(t){e.dialog.editing=!0}}},[e._v("New Storage Pool")])],1),i("v-flex",[i("v-alert",{attrs:{type:"error",value:e.error.global}},[e._v("\n                "+e._s(e.error.global)+"\n              ")]),i("v-data-table",{staticClass:"elevation-1",attrs:{headers:e.tableHeaders,items:e.items,"hide-actions":"",loading:e.tableLoading},scopedSlots:e._u([{key:"items",fn:function(t){return[i("tr",[i("td",[i("a",{attrs:{href:"javascript:void(0)"},on:{click:function(i){i.stopPropagation(),e.editItem(t.item)}}},[e._v(e._s(t.item.info.name))])]),i("td",[e._v(e._s(t.item.info.description?t.item.info.description:"-"))]),i("td",[e._v(e._s(t.item.info.driver))]),i("td",[i("v-progress-linear",{attrs:{value:e.disk_used(t.item.resources),height:"20",color:"error","background-color":"success"}},[e._v(e._s(t.item.resources.space.used)+" / "+e._s(e.formatBytes(t.item.resources.space.total)))])],1),i("td",[e._v(e._s(t.item.volumes.length))]),i("td",[e._v(e._s(t.item.info.status))]),i("td",[i("v-btn",{staticClass:"mx-0",staticStyle:{float:"right"},attrs:{icon:""},on:{click:function(i){i.stopPropagation(),e.deleteItem(t.item)}}},[i("v-icon",{attrs:{color:"pink"}},[e._v("delete")])],1)],1)])]}}])},[i("v-progress-linear",{attrs:{slot:"progress",color:"blue",indeterminate:""},slot:"progress"}),i("template",{slot:"no-data"},[e._v("\n                  "+e._s(e.tableLoading?"Fetching data, please wait...":"There are currently no storage pools.")+"\n                ")])],2)],1)],1)],1)],1)],1),i("v-dialog",{attrs:{"max-width":"600px",scrollable:""},model:{value:e.dialog.editing,callback:function(t){e.$set(e.dialog,"editing",t)},expression:"dialog.editing"}},[i("v-card",{attrs:{tile:""}},[i("v-toolbar",{attrs:{card:"",dark:"",color:"light-blue darken-3"}},[i("v-btn",{attrs:{icon:"",dark:""},nativeOn:{click:function(t){e.dialog.editing=!1}}},[i("v-icon",[e._v("close")])],1),i("v-toolbar-title",[e._v(e._s(-1===e.editingIndex?"New":"Edit")+" Storage Pool")]),i("v-spacer"),i("v-toolbar-items",[i("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(t){e.save()}}},[e._v("Save")])],1)],1),i("v-card-text",[i("v-alert",{attrs:{type:"error",value:e.error.editing}},[e._v("\n            "+e._s(e.error.editing)+"\n          ")]),i("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[i("h3",[e._v("General")]),i("v-text-field",{attrs:{rules:e.nameRule,label:"Name:",placeholder:"",required:"",hint:"Enter a name for the storage pool."},model:{value:e.editingItem.info.name,callback:function(t){e.$set(e.editingItem.info,"name",t)},expression:"editingItem.info.name"}}),i("v-text-field",{attrs:{label:"Description:",placeholder:"",hint:"Enter a description for the storage pool."},model:{value:e.editingItem.info.description,callback:function(t){e.$set(e.editingItem.info,"description",t)},expression:"editingItem.info.description"}}),i("v-select",{attrs:{items:["dir","btrfs","lvm","zfs","ceph"],label:"Driver:",disabled:-1!==e.editingIndex},model:{value:e.editingItem.info.driver,callback:function(t){e.$set(e.editingItem.info,"driver",t)},expression:"editingItem.info.driver"}}),i("h3",[e._v("Configuration")]),"dir"==e.editingItem.info.driver?i("div",[i("v-text-field",{attrs:{label:"Source:",placeholder:"",hint:"Path to block device or loop file or filesystem entry."},model:{value:e.editingItem.info.config.source,callback:function(t){e.$set(e.editingItem.info.config,"source",t)},expression:"editingItem.info.config.source"}}),i("v-text-field",{attrs:{label:"Size:",placeholder:"",hint:"Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."},model:{value:e.editingItem.info.config.size,callback:function(t){e.$set(e.editingItem.info.config,"size",t)},expression:"editingItem.info.config.size"}})],1):e._e(),"btrfs"==e.editingItem.info.driver?i("div",[i("v-text-field",{attrs:{label:"Source:",placeholder:"",hint:"Path to block device or loop file or filesystem entry."},model:{value:e.editingItem.info.config.source,callback:function(t){e.$set(e.editingItem.info.config,"source",t)},expression:"editingItem.info.config.source"}}),i("v-text-field",{attrs:{label:"Size:",placeholder:"",hint:"Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."},model:{value:e.editingItem.info.config.size,callback:function(t){e.$set(e.editingItem.info.config,"size",t)},expression:"editingItem.info.config.size"}}),i("v-text-field",{attrs:{label:"Mount options:",placeholder:"",hint:"Mount options for block devices."},model:{value:e.editingItem.info.config["btrfs.mount_options"],callback:function(t){e.$set(e.editingItem.info.config,"btrfs.mount_options",t)},expression:"editingItem.info.config['btrfs.mount_options']"}})],1):e._e(),"lvm"==e.editingItem.info.driver?i("div",[i("v-text-field",{attrs:{label:"Source:",placeholder:"",hint:"Path to block device or loop file or filesystem entry."},model:{value:e.editingItem.info.config.source,callback:function(t){e.$set(e.editingItem.info.config,"source",t)},expression:"editingItem.info.config.source"}}),i("v-text-field",{attrs:{label:"Size:",placeholder:"",hint:"Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."},model:{value:e.editingItem.info.config.size,callback:function(t){e.$set(e.editingItem.info.config,"size",t)},expression:"editingItem.info.config.size"}}),i("v-text-field",{attrs:{label:"Thinpool Name:",placeholder:"",hint:"Thin pool where images and containers are created."},model:{value:e.editingItem.info.config["lvm.thinpool_name"],callback:function(t){e.$set(e.editingItem.info.config,"lvm.thinpool_name",t)},expression:"editingItem.info.config['lvm.thinpool_name']"}}),i("h4",[e._v("Use thinpool")]),i("v-switch",{attrs:{label:e.editingItem.info.config["lvm.use_thinpool"]?"Yes":"No",color:"success","persistent-hint":"",hint:"Whether the storage pool uses a thinpool for logical volumes."},model:{value:e.editingItem.info.config["lvm.use_thinpool"],callback:function(t){e.$set(e.editingItem.info.config,"lvm.use_thinpool",t)},expression:"editingItem.info.config['lvm.use_thinpool']"}}),i("v-text-field",{attrs:{label:"VG Name:",placeholder:"",hint:"Name of the volume group to create."},model:{value:e.editingItem.info.config["lvm.vg_name"],callback:function(t){e.$set(e.editingItem.info.config,"lvm.vg_name",t)},expression:"editingItem.info.config['lvm.vg_name']"}})],1):e._e(),"zfs"==e.editingItem.info.driver?i("div",[i("v-text-field",{attrs:{label:"Source:",placeholder:"",hint:"Path to block device or loop file or filesystem entry."},model:{value:e.editingItem.info.config.source,callback:function(t){e.$set(e.editingItem.info.config,"source",t)},expression:"editingItem.info.config.source"}}),i("v-text-field",{attrs:{label:"Size:",placeholder:"",hint:"Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."},model:{value:e.editingItem.info.config.size,callback:function(t){e.$set(e.editingItem.info.config,"size",t)},expression:"editingItem.info.config.size"}}),i("v-text-field",{attrs:{label:"Pool name:",placeholder:"",hint:"Name of the zpool."},model:{value:e.editingItem.info.config["zfs.pool_name"],callback:function(t){e.$set(e.editingItem.info.config,"zfs.pool_name",t)},expression:"editingItem.info.config['zfs.pool_name']"}}),i("v-layout",{staticStyle:{"margin-top":"10px"},attrs:{row:"",wrap:""}},[i("v-flex",{attrs:{xs4:""}},[i("h4",[e._v("Clone Copy:")]),i("v-switch",{attrs:{label:e.editingItem.info.config["zfs.clone_copy"]?"Yes":"No",color:"success","persistent-hint":"",hint:"Whether to use ZFS lightweight clones rather than full dataset copies."},model:{value:e.editingItem.info.config["zfs.clone_copy"],callback:function(t){e.$set(e.editingItem.info.config,"zfs.clone_copy",t)},expression:"editingItem.info.config['zfs.clone_copy']"}})],1),i("v-flex",{attrs:{xs4:""}},[i("h4",[e._v("Use refquota:")]),i("v-switch",{attrs:{label:e.editingItem.info.config["volume.zfs.use_refquota"]?"Yes":"No",color:"success","persistent-hint":"",hint:"Use refquota instead of quota for space."},model:{value:e.editingItem.info.config["volume.zfs.use_refquota"],callback:function(t){e.$set(e.editingItem.info.config,"volume.zfs.use_refquota",t)},expression:"editingItem.info.config['volume.zfs.use_refquota']"}})],1),i("v-flex",{attrs:{xs4:""}},[i("h4",[e._v("Remove snapshots:")]),i("v-switch",{attrs:{label:e.editingItem.info.config["volume.zfs.remove_snapshots"]?"Yes":"No",color:"success","persistent-hint":"",hint:"Remove snapshots as needed."},model:{value:e.editingItem.info.config["volume.zfs.remove_snapshots"],callback:function(t){e.$set(e.editingItem.info.config,"volume.zfs.remove_snapshots",t)},expression:"editingItem.info.config['volume.zfs.remove_snapshots']"}})],1)],1)],1):e._e(),"ceph"==e.editingItem.info.driver?i("div",[i("v-text-field",{attrs:{label:"Source:",placeholder:"",hint:"Path to block device or loop file or filesystem entry."},model:{value:e.editingItem.info.config.source,callback:function(t){e.$set(e.editingItem.info.config,"source",t)},expression:"editingItem.info.config.source"}}),i("v-text-field",{attrs:{label:"Size:",placeholder:"",hint:"Size of the storage pool in bytes (suffixes supported). (Currently valid for loop based pools and zfs)."},model:{value:e.editingItem.info.config.size,callback:function(t){e.$set(e.editingItem.info.config,"size",t)},expression:"editingItem.info.config.size"}}),i("v-text-field",{attrs:{label:"Cluster name:",placeholder:"",hint:"Name of the ceph cluster in which to create new storage pools."},model:{value:e.editingItem.info.config["ceph.cluster_name"],callback:function(t){e.$set(e.editingItem.info.config,"ceph.cluster_name",t)},expression:"editingItem.info.config['ceph.cluster_name']"}}),i("h4",[e._v("OSD force reuse:")]),i("v-switch",{attrs:{label:e.editingItem.info.config["ceph.osd.force_reuse"]?"Yes":"No",color:"success","persistent-hint":"",hint:"Force using an osd storage pool that is already in use by another LXD instance."},model:{value:e.editingItem.info.config["ceph.osd.force_reuse"],callback:function(t){e.$set(e.editingItem.info.config,"ceph.osd.force_reuse",t)},expression:"editingItem.info.config['ceph.osd.force_reuse']"}}),i("v-text-field",{attrs:{label:"OSD placement group num:",placeholder:"",hint:"Number of placement groups for the osd storage pool."},model:{value:e.editingItem.info.config["ceph.osd.pg_num"],callback:function(t){e.$set(e.editingItem.info.config,"ceph.osd.pg_num",t)},expression:"editingItem.info.config['ceph.osd.pg_num']"}}),i("v-text-field",{attrs:{label:"OSD pool name:",placeholder:"",hint:"Name of the osd storage pool."},model:{value:e.editingItem.info.config["ceph.osd.pool_name"],callback:function(t){e.$set(e.editingItem.info.config,"ceph.osd.pool_name",t)},expression:"editingItem.info.config['ceph.osd.pool_name']"}}),i("v-text-field",{attrs:{label:"RBD clone copy:",placeholder:"",hint:"Whether to use RBD lightweight clones rather than full dataset copies."},model:{value:e.editingItem.info.config["ceph.rbd.clone_copy"],callback:function(t){e.$set(e.editingItem.info.config,"ceph.rbd.clone_copy",t)},expression:"editingItem.info.config['ceph.rbd.clone_copy']"}}),i("v-text-field",{attrs:{label:"User name:",placeholder:"",hint:"The ceph user to use when creating storage pools and volumes."},model:{value:e.editingItem.info.config["ceph.user.name"],callback:function(t){e.$set(e.editingItem.info.config,"ceph.user.name",t)},expression:"editingItem.info.config['ceph.user.name']"}})],1):e._e()],1)],1),i("div",{staticStyle:{flex:"1 1 auto"}})],1)],1)],1)],1)};o._withStripped=!0;var n={render:o,staticRenderFns:[]};t.a=n},nOMI:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=i("qNYU"),n=i("SzwM"),s=!1;var a=function(e){s||i("JTAs")},r=i("VU/8")(o.a,n.a,!1,a,null,null);r.options.__file="pages/lxd/storage.vue",t.default=r.exports},qNYU:function(e,t,i){"use strict";var o=i("woOf"),n=i.n(o),s=i("Xxa5"),a=i.n(s),r=i("exGp"),l=i.n(r),c=i("Dd8w"),d=i.n(c),f=i("NYxO"),u=(i("4swq"),i("mtWM")),g=i.n(u),m=i("rO6o");t.a={mixins:[m.a],middleware:["authenticated"],components:{},computed:d()({},Object(f.mapGetters)({isAuthenticated:"auth/isAuthenticated",loggedUser:"auth/loggedUser",loggedToken:"auth/loggedToken"})),data:function(){return{dialog:{editing:!1},valid:!0,error:{global:!1,editing:!1},snackbar:!1,snackbarColor:"green",snackbarText:"",snackbarTimeout:5e3,items:[],tableLoading:!0,tableHeaders:[{text:"Name",value:"name"},{text:"Description",value:"description"},{text:"Driver",value:"driver"},{text:"Usage",value:"space"},{text:"Volumes",value:"volumes"},{text:"Status",value:"status"},{text:"Actions",value:"id",sortable:!1,align:"right"}],editingIndex:-1,editingItem:{info:{config:{},description:"",driver:"dir",locations:[],name:"",status:"",used_by:[]},resources:{inodes:{total:0,used:0},space:{total:0,used:0}},volumes:[]},defaultItem:{info:{config:{},description:"",driver:"dir",locations:[],name:"",status:"",used_by:[]},resources:{inodes:{total:0,used:0},space:{total:0,used:0}},volumes:[]},nameRule:[function(e){return!!e||"Name is required"},function(e){return e&&e.length<=100||"Name must be less than 100 characters"}]}},beforeDestroy:function(){},mounted:function(){var e=this;g.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,this.$nextTick(function(){e.initialize()})},watch:{"dialog.editing":function(e){e||this.close()},"editingItem.info.config":{handler:function(e){for(var t in e)""!==e[t]&&null!==e[t]||delete e[t]},deep:!0}},methods:{initialize:function(){var e=l()(a.a.mark(function e(){var t;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,this.loggedUser||this.$router.replace("/servers"),e.next=4,g.a.get(this.loggedUser.sub+"/api/lxd/storage",{params:{types:["name","info","resources","volumes"]}});case 4:t=e.sent,this.items=t.data.data,e.next=13;break;case 8:e.prev=8,e.t0=e.catch(0),this.items=[],this.tableNoData="No data.",this.error.global="Could not fetch data from server.";case 13:this.tableLoading=!1;case 14:case"end":return e.stop()}},e,this,[[0,8]])}));return function(){return e.apply(this,arguments)}}(),editItem:function(e){this.editingIndex=this.items.indexOf(e),this.editingItem=n()({},this.defaultItem,e),this.dialog.editing=!0},save:function(){var e=l()(a.a.mark(function e(){var t;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.$refs.form.validate()){e.next=20;break}if(e.prev=1,this.loggedUser||this.$router.replace("/servers"),!(this.editingIndex>-1)){e.next=9;break}return e.next=6,g.a.put(this.loggedUser.sub+"/api/lxd/storage/"+this.editingItem.name,{name:this.editingItem.info.name,description:this.editingItem.info.description,driver:this.editingItem.info.driver,config:this.editingItem.info.config});case 6:t=e.sent,e.next=12;break;case 9:return e.next=11,g.a.post(this.loggedUser.sub+"/api/lxd/storage",{name:this.editingItem.info.name,description:this.editingItem.info.description,driver:this.editingItem.info.driver,config:this.editingItem.info.config});case 11:t=e.sent;case 12:422===t.data.code?this.error.editing=t.data.error:(this.editingIndex>-1?n()(this.items[this.editingIndex],this.editingItem):this.items.push(n()({},this.editingItem)),this.snackbar=!0,this.snackbarText="Storage pool successfully saved."),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(1),this.error.global="Could not save storage pool to server.";case 18:this.error.editing||-1!==this.editingIndex||this.close(),this.error.editing||this.initialize();case 20:case"end":return e.stop()}},e,this,[[1,15]])}));return function(){return e.apply(this,arguments)}}(),deleteItem:function(){var e=l()(a.a.mark(function e(t){var i=this;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.$prompt.show({persistent:!0,width:400,toolbar:{color:"red darken-3",closable:!1},title:"Delete storage pool?",text:"Are you sure you want to delete the <b>"+t.name+"</b> storage pool?",buttons:[{title:"Yes",color:"success",handler:function(){var e=l()(a.a.mark(function e(){var o;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return o=i.items.indexOf(t),i.items.splice(o,1),e.prev=2,e.next=5,g.a.delete(i.loggedUser.sub+"/api/lxd/storage/"+t.name);case 5:e.sent,i.snackbar=!0,i.snackbarColor="green",i.snackbarText="Storage pool deleted.",e.next=14;break;case 11:e.prev=11,e.t0=e.catch(2),i.error.global="Failed to delete storage pool.";case 14:case"end":return e.stop()}},e,i,[[2,11]])}));return function(){return e.apply(this,arguments)}}()},{title:"No",color:"error"}]});case 1:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),close:function(){var e=this;this.dialog.editing=!1,setTimeout(function(){e.editingItem=n()({},e.defaultItem),e.editingIndex=-1},300)},disk_used:function(e){return e.space.used/e.space.total*100},formatBytes:function(e,t){if(0==e)return"0 Bytes";var i=t||2,o=Math.floor(Math.log(e)/Math.log(1024));return parseFloat((e/Math.pow(1024,o)).toFixed(i))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][o]}}}},rO6o:function(e,t,i){"use strict";t.a={methods:{formatBytes:function(e,t){if(0===e)return"0 Bytes";var i=t||2,o=Math.floor(Math.log(e)/Math.log(1024));return parseFloat((e/Math.pow(1024,o)).toFixed(i))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][o]},isIP4:function(e){return!!/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(e)},uniqueId:function(e){e||(e=8);for(var t="",i=1;i<e+1;i+=8)t+=Math.random().toString(36).substr(2,10);return t.substr(0,e)},UUID:function(){function e(){return Math.random().toString(16).slice(-4)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}}}}});