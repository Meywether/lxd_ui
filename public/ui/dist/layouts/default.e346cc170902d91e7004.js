webpackJsonp([5],{"46RV":function(e,t,o){"use strict";var r=o("Dd8w"),s=o.n(r),i=o("NYxO");t.a={middleware:[],computed:s()({},Object(i.mapGetters)({isAuthenticated:"auth/isAuthenticated",loggedUser:"auth/loggedUser",loggedToken:"auth/loggedToken"}),{items:function(){var e=[],t=[{icon:"chevron_right",text:"My Servers",route:"/servers"}];return this.loggedUser&&this.loggedUser.sub?(this.loggedUser.mod.server.constructor===Array&&(e.push({icon:"chevron_right",text:"Overview",route:"/"}),this.loggedUser.mod.server.includes("network-connections")&&e.push({icon:"chevron_right",text:"Network Connections",route:"/server/network-connections"}),this.loggedUser.mod.server.includes("processes")&&e.push({icon:"chevron_right",text:"Processes",route:"/server/processes"}),this.loggedUser.mod.server.includes("logins")&&e.push({icon:"chevron_right",text:"Logins",route:"/server/logins"}),t.push({icon:"keyboard_arrow_up","icon-alt":"keyboard_arrow_down",text:"Server",model:!1,children:e}),e=[]),this.loggedUser.mod.api.constructor===Array&&(this.loggedUser.mod.api.includes("data")&&e.push({icon:"chevron_right",text:"Data",route:"/api/data"}),this.loggedUser.mod.api.includes("email")&&e.push({icon:"chevron_right",text:"Email",route:"/api/email"}),t.push({icon:"keyboard_arrow_up","icon-alt":"keyboard_arrow_down",text:"API",model:!1,children:e}),e=[]),this.loggedUser.mod.lxd.constructor===Array&&(this.loggedUser.mod.lxd.includes("containers")&&e.push({icon:"chevron_right",text:"Containers",route:"/lxd/containers"}),this.loggedUser.mod.lxd.includes("images")&&e.push({icon:"chevron_right",text:"Images",route:"/lxd/images"}),this.loggedUser.mod.lxd.includes("profiles")&&e.push({icon:"chevron_right",text:"Profiles",route:"/lxd/profiles"}),this.loggedUser.mod.lxd.includes("networks")&&e.push({icon:"chevron_right",text:"Networks",route:"/lxd/networks"}),this.loggedUser.mod.lxd.includes("devices")&&e.push({icon:"chevron_right",text:"Devices",route:"/lxd/devices"}),this.loggedUser.mod.lxd.includes("files")&&e.push({icon:"chevron_right",text:"Files",route:"/lxd/files"}),this.loggedUser.mod.lxd.includes("logs")&&e.push({icon:"chevron_right",text:"Logs",route:"/lxd/logs"}),this.loggedUser.mod.lxd.includes("metadata")&&e.push({icon:"chevron_right",text:"Metadata",route:"/lxd/metadata"}),this.loggedUser.mod.lxd.includes("certificates")&&e.push({icon:"chevron_right",text:"Certificates",route:"/lxd/certificates"}),this.loggedUser.mod.lxd.includes("operations")&&e.push({icon:"chevron_right",text:"Operations",route:"/lxd/operations"}),this.loggedUser.mod.lxd.includes("storage")&&e.push({icon:"chevron_right",text:"Storage",route:"/lxd/storage"}),this.loggedUser.mod.lxd.includes("backups")&&e.push({icon:"chevron_right",text:"Backups",route:"/lxd/backups"}),this.loggedUser.mod.lxd.includes("cluster")&&e.push({icon:"chevron_right",text:"Cluster",route:"/lxd/cluster"}),t.push({icon:"keyboard_arrow_up","icon-alt":"keyboard_arrow_down",text:"LXD",model:!1,children:e}),e=[]),this.loggedUser.mod.routes.constructor===Array&&(this.loggedUser.mod.routes.includes("web")&&e.push({icon:"chevron_right",text:"Web Forwards",route:"/routes/web-forwards"}),this.loggedUser.mod.routes.includes("port")&&e.push({icon:"chevron_right",text:"Port Forwards",route:"/routes/port-forwards"}),t.push({icon:"keyboard_arrow_up","icon-alt":"keyboard_arrow_down",text:"Routes",model:!1,children:e}),e=[]),this.loggedUser.mod.tasks.constructor===Array&&t.push({icon:"chevron_right",text:"Tasks",route:"/tasks"}),t.push({icon:"exit_to_app",text:"Sign Out",route:"/auth/sign-out"}),t):t}}),components:{},data:function(){return{drawer:null}},methods:{navigate:function(e){this.$router.push(e)}}}},"7HgC":function(e,t,o){(e.exports=o("FZ+f")(!1)).push([e.i,"",""])},DLCH:function(e,t,o){"use strict";var r=function(){var e=this.$createElement,t=this._self._c||e;return t("v-app",[t("main-nav"),t("nuxt"),t("prompt")],1)};r._withStripped=!0;var s={render:r,staticRenderFns:[]};t.a=s},LBAU:function(e,t,o){var r=o("tAK7");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);o("rjj0")("4a5ea10a",r,!1,{sourceMap:!1})},Ma2J:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=o("fc6y"),s=o("DLCH"),i=!1;var n=function(e){i||o("LBAU")},l=o("VU/8")(r.a,s.a,!1,n,null,null);l.options.__file="layouts/default.vue",t.default=l.exports},SiY1:function(e,t,o){"use strict";var r=o("46RV"),s=o("ngks"),i=!1;var n=function(e){i||o("o8gX")},l=o("VU/8")(r.a,s.a,!1,n,null,null);l.options.__file="components/MainNav.vue",t.a=l.exports},fc6y:function(e,t,o){"use strict";var r=o("SiY1");t.a={components:{MainNav:r.a}}},ngks:function(e,t,o){"use strict";var r=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("v-navigation-drawer",{attrs:{dark:"",fixed:"",clipped:e.$vuetify.breakpoint.lgAndUp,app:""},model:{value:e.drawer,callback:function(t){e.drawer=t},expression:"drawer"}},[o("v-list",{attrs:{dense:""}},[e._l(e.items,function(t){return[t.children?o("v-list-group",{key:t.text,attrs:{"prepend-icon":t.model?t.icon:t["icon-alt"],"append-icon":""},model:{value:t.model,callback:function(o){e.$set(t,"model",o)},expression:"item.model"}},[o("v-list-tile",{attrs:{slot:"activator"},slot:"activator"},[o("v-list-tile-content",[o("v-list-tile-title",[e._v("\n                "+e._s(t.text)+"\n              ")])],1)],1),e._l(t.children,function(t,r){return o("v-list-tile",{key:r,on:{click:function(o){e.navigate(t.route)}}},[t.icon?o("v-list-tile-action",[o("v-icon",[e._v(e._s(t.icon))])],1):e._e(),o("v-list-tile-content",[o("v-list-tile-title",[e._v("\n                "+e._s(t.text)+"\n              ")])],1)],1)})],2):o("v-list-tile",{key:t.text,on:{click:function(o){e.navigate(t.route)}}},[o("v-list-tile-action",[o("v-icon",[e._v(e._s(t.icon))])],1),o("v-list-tile-content",[o("v-list-tile-title",[e._v("\n              "+e._s(t.text)+"\n            ")])],1)],1)]})],2)],1),o("v-toolbar",{attrs:{color:"light-blue darken-4",dark:"",app:"","clipped-left":e.$vuetify.breakpoint.lgAndUp,fixed:""}},[o("v-toolbar-title",{staticClass:"ml-0 pl-3",staticStyle:{width:"300px"}},[o("v-toolbar-side-icon",{on:{click:function(t){t.stopPropagation(),e.drawer=!e.drawer}}}),o("span",{staticClass:"hidden-sm-and-down"},[e._v(e._s(e.loggedUser&&e.loggedUser.lab?e.loggedUser.lab:"Conext"))])],1),o("v-spacer"),o("span",{staticClass:"mr-3"},[e._v(e._s(e.loggedUser&&e.loggedUser.sub))])],1)],1)};r._withStripped=!0;var s={render:r,staticRenderFns:[]};t.a=s},o8gX:function(e,t,o){var r=o("7HgC");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);o("rjj0")("96ad87c4",r,!1,{sourceMap:!1})},tAK7:function(e,t,o){(e.exports=o("FZ+f")(!1)).push([e.i,"",""])}});