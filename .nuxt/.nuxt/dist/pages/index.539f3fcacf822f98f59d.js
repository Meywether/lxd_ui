webpackJsonp([16],{"+ptz":function(e,t,r){"use strict";var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-app",[r("v-content",[r("v-container",{attrs:{fluid:"",tag:"section",id:"grid"}},[r("v-layout",{attrs:{row:"",wrap:""}},[r("v-flex",{staticClass:"display-1 mb-3",attrs:{tag:"h1"}},[e._v("\n              Server - Memory\n        ")]),r("v-flex",[r("v-alert",{attrs:{type:"error",value:e.error}},[e._v("\n            "+e._s(e.error)+"\n          ")]),r("pre",[e._v("app rendered "+e._s(e.rendered)+" side")]),r("pre",[e._v(e._s(e.loggedUser))]),r("pre",[e._v(e._s(e.loggedToken))]),r("pre",[e._v("isAuthenticated = "+e._s(e.isAuthenticated))]),r("pre",[e._v(e._s(e.result))])],1)],1)],1)],1)],1)};n._withStripped=!0;var a={render:n,staticRenderFns:[]};t.a=a},"/TYz":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r("upq3"),a=r("+ptz"),s=!1;var o=function(e){s||r("0Lh6")},i=r("VU/8")(n.a,a.a,!1,o,null,null);i.options.__file="pages/index.vue",t.default=i.exports},"0Lh6":function(e,t,r){var n=r("gqG/");"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);r("rjj0")("25f10ab2",n,!1,{sourceMap:!1})},"gqG/":function(e,t,r){(e.exports=r("FZ+f")(!1)).push([e.i,"",""])},upq3:function(e,t,r){"use strict";var n=r("Xxa5"),a=r.n(n),s=r("exGp"),o=r.n(s),i=r("Dd8w"),u=r.n(i),c=r("NYxO"),d=r("mtWM"),l=r.n(d);t.a={middleware:"authenticated",computed:u()({},Object(c.mapGetters)({isAuthenticated:"auth/isAuthenticated",loggedUser:"auth/loggedUser",loggedToken:"auth/loggedToken"})),components:{},mounted:function(){this.initialize(),this.getApi()},asyncData:function(){return{rendered:"static"}},data:function(){return{error:"",result:[]}},methods:{initialize:function(){var e=o()(a.a.mark(function e(){var t;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.$storage.set("xxx",{foo:"bar"}),console.log(this.$storage.get("xxx")),console.log(this.$storage.isset("xxx")),this.$storage.remove("xxx"),this.$storage.clear(),l.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=8,l.a.get(this.loggedUser.sub+"/api/server/information/memory");case 8:t=e.sent,this.items=t.data.data;case 10:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),getApi:function(){var e=o()(a.a.mark(function e(){var t;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return l.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=3,l.a.get(this.loggedUser.sub+"/api");case 3:t=e.sent,this.result=t.data.data;case 5:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),remove:function(){var e=o()(a.a.mark(function e(t){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return l.a.defaults.headers.common.Authorization="Bearer "+this.loggedToken,e.next=3,l.a.delete("https://fatfree-base-rest-cloned-lcherone.c9users.io/servers/"+t);case 3:e.sent,this.getServers();case 5:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()}}}});