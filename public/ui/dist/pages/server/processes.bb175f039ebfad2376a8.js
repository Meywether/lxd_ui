webpackJsonp([12],{Lol0:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-content",[a("v-container",{attrs:{fluid:"",tag:"section",id:"grid"}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"d-flex":"",xs12:"","order-xs5":""}},[a("v-layout",{attrs:{column:""}},[a("v-flex",{staticClass:"display mb-2",attrs:{tag:"h1"}},[t._v("\n            Server - Processes\n          ")]),a("v-flex",[a("v-alert",{attrs:{type:"error",value:t.error}},[t._v("\n              "+t._s(t.error)+"\n            ")]),a("v-card",[a("v-card-title",[a("v-layout",{staticStyle:{"margin-top":"-15px"},attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs8:""}}),a("v-flex",{attrs:{xs4:""}},[a("v-text-field",{attrs:{"append-icon":"search",label:"Search...","single-line":"","hide-details":""},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1)],1)],1),a("v-data-table",{attrs:{headers:t.tableHeaders,items:t.items,"hide-actions":"",search:t.search,loading:t.tableLoading},scopedSlots:t._u([{key:"items",fn:function(e){return[a("td",[t._v(t._s(e.item.PID))]),a("td",[t._v(t._s(e.item.USER))]),a("td",[t._v(t._s(e.item.PR))]),a("td",[t._v(t._s(e.item.NI))]),a("td",[t._v(t._s(e.item.VIRT))]),a("td",[t._v(t._s(e.item.RES))]),a("td",[t._v(t._s(e.item.SHR))]),a("td",[t._v(t._s(e.item.S))]),a("td",[t._v(t._s(e.item["%CPU"]))]),a("td",[t._v(t._s(e.item["%MEM"]))]),a("td",[t._v(t._s(e.item["TIME+"]))]),a("td",[t._v(t._s(e.item.COMMAND))])]}}])},[a("template",{slot:"no-data"}),a("template",{attrs:{value:!0,color:"error",icon:"warning"},slot:"no-results"},[t._v('\n                  No processes found matching "'+t._s(t.search)+'".\n                ')])],2)],1)],1)],1)],1)],1)],1)],1)};s._withStripped=!0;var r={render:s,staticRenderFns:[]};e.a=r},Od5r:function(t,e,a){"use strict";var s=a("Xxa5"),r=a.n(s),n=a("exGp"),i=a.n(n),o=a("Dd8w"),l=a.n(o),d=a("NYxO"),c=a("mtWM"),u=a.n(c);e.a={middleware:["authenticated"],components:{},computed:l()({},Object(d.mapGetters)({isAuthenticated:"auth/isAuthenticated",loggedUser:"auth/loggedUser",loggedToken:"auth/loggedToken"})),data:function(){return{error:"",tableLoading:!0,tableHeaders:[{text:"PID",value:"PID"},{text:"USER",value:"USER"},{text:"PR",value:"PR"},{text:"NI",value:"NI"},{text:"VIRT",value:"VIRT"},{text:"RES",value:"RES"},{text:"SHR",value:"SHR"},{text:"S",value:"S"},{text:"%CPU",value:"%CPU"},{text:"%MEM",value:"%MEM"},{text:"TIME+",value:"TIME+"},{text:"COMMAND",value:"COMMAND"}],items:[],search:"",pollItem:0}},beforeDestroy:function(){clearInterval(this.pollId)},mounted:function(){this.initialize(),clearInterval(this.pollId),this.pollId=setInterval(function(){this.initialize()}.bind(this),5e3)},methods:{initialize:function(){var t=i()(r.a.mark(function t(){var e;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return u.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,t.next=3,u.a.get(this.loggedUser.sub+"/api/server/information/top");case 3:e=t.sent,this.items=e.data.data,this.tableLoading=!1;case 6:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}()}}},fTXk:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,"",""])},"gVS/":function(t,e,a){var s=a("fTXk");"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);a("rjj0")("4da372a3",s,!1,{sourceMap:!1})},sGx3:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("Od5r"),r=a("Lol0"),n=!1;var i=function(t){n||a("gVS/")},o=a("VU/8")(s.a,r.a,!1,i,null,null);o.options.__file="pages/server/processes.vue",e.default=o.exports}});