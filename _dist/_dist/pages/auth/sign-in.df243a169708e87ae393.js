webpackJsonp([5],{"/CKQ":function(t,s,a){(t.exports=a("FZ+f")(!1)).push([t.i,"",""])},"6Rin":function(t,s,a){var e=a("y8Tr");"string"==typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);a("rjj0")("b84bfed2",e,!1,{sourceMap:!1})},"6a6x":function(t,s,a){"use strict";var e=a("mvHQ"),i=a.n(e),r=a("NYxO"),n=a("4swq"),l=a("mtWM"),o=a.n(l),c=a("umFH"),v=a("flgw");s.a={layout:"admin",middleware:"anonymous",computed:Object(r.mapGetters)(["auth/isAuthenticated","auth/loggedUser"]),components:{TopNav:c.a,SideNav:v.a},mounted:function(){this.loadServers()},data:function(){return{isEditServersActive:!1,add:{server:"",secret:""},form:{error:{global:"",username:"",password:""},servers:[],server:"",secret:"",username:"",password:""}}},methods:{addServer:function(){this.form.servers=JSON.parse(window.localStorage.getItem("servers")),this.form.servers.push({host:this.add.server,secret:this.add.secret}),window.localStorage.setItem("servers",i()(this.form.servers)),this.loadServers()},deleteServer:function(t){this.form.servers=JSON.parse(window.localStorage.getItem("servers")),this.form.servers.splice(t,1),window.localStorage.setItem("servers",i()(this.form.servers)),this.loadServers()},editServers:function(){this.isEditServersActive=!0},checkDatalist:function(t){var s=this,a=t.target.value;this.form.servers.forEach(function(t){t.host===a&&(s.form.secret=t.secret)})},loadServers:function(){this.form.servers=JSON.parse(window.localStorage.getItem("servers"))},signIn:function(){var t=this;if(""!==this.form.server&&""!==this.form.secret){var s=(window.location.protocol,window.location.hostname);s=this.form.server,o.a.post(s+"/auth",{server:this.form.server,secret:this.form.secret}).then(function(s){Object(n.c)(s.data.token),t.$router.replace("/")}).catch(function(s){console.log(s),s.response?401===s.response.status?t.form.error.global="Invalid secret!":t.form.error.global="Unknown error whilst signing in!":s.request?t.form.error.global=s.request:t.form.error.global=s.message})}else this.form.error.global="Enter your sever and secret!"},open:function(t){this.$electron.shell.openExternal(t)}}}},JKzh:function(t,s,a){var e=a("/CKQ");"string"==typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);a("rjj0")("71cf9fba",e,!1,{sourceMap:!1})},MURi:function(t,s,a){"use strict";var e=function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("nav",{staticClass:"navbar"},[a("div",{staticClass:"navbar-brand"},[t._m(0),t._m(1),t._m(2),a("div",{staticClass:"navbar-burger burger is-hidden-tablet",class:{"is-active":t.showNav},on:{click:function(s){t.showNav=!t.showNav}}},[a("span"),a("span"),a("span")])]),a("div",{directives:[{name:"show",rawName:"v-show",value:t.showNav,expression:"showNav"}],staticClass:"nav-right nav-menu is-hidden-tablet"},[t._m(3)]),t._m(4)])};e._withStripped=!0;var i={render:e,staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("a",{staticClass:"navbar-item",attrs:{href:"http://bulma.io"}},[s("img",{attrs:{src:"http://bulma.io/images/bulma-logo.png",alt:"Bulma: a modern CSS framework based on Flexbox",width:"112",height:"28"}})])},function(){var t=this.$createElement,s=this._self._c||t;return s("a",{staticClass:"navbar-item is-hidden-desktop",attrs:{href:"https://github.com/jgthms/bulma",target:"_blank"}},[s("span",{staticClass:"icon",staticStyle:{color:"#333"}},[s("i",{staticClass:"fa fa-github"})])])},function(){var t=this.$createElement,s=this._self._c||t;return s("a",{staticClass:"navbar-item is-hidden-desktop",attrs:{href:"https://twitter.com/jgthms",target:"_blank"}},[s("span",{staticClass:"icon",staticStyle:{color:"#55acee"}},[s("i",{staticClass:"fa fa-twitter"})])])},function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("aside",{staticClass:"menu is-burger-menu"},[a("p",{staticClass:"menu-label"},[t._v("\n        General\n      ")]),a("ul",{staticClass:"menu-list"},[a("li",[a("a",[t._v("Dashboard")])]),a("li",[a("a",[t._v("Customers")])])]),a("p",{staticClass:"menu-label"},[t._v("\n        Administration\n      ")]),a("ul",{staticClass:"menu-list"},[a("li",[a("a",[t._v("Team Settings")])]),a("li",[a("a",{staticClass:"is-active"},[t._v("Manage Your Team")]),a("ul",[a("li",[a("a",[t._v("Members")])]),a("li",[a("a",[t._v("Plugins")])]),a("li",[a("a",[t._v("Add a member")])])])]),a("li",[a("a",[t._v("Invitations")])]),a("li",[a("a",[t._v("Cloud Storage Environment Settings")])]),a("li",[a("a",[t._v("Authentication")])])]),a("p",{staticClass:"menu-label"},[t._v("\n        Transactions\n      ")]),a("ul",{staticClass:"menu-list"},[a("li",[a("a",[t._v("Payments")])]),a("li",[a("a",[t._v("Transfers")])]),a("li",[a("a",[t._v("Balance")])])])])},function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"navbar-menu"},[a("div",{staticClass:"navbar-start"},[a("div",{staticClass:"navbar-item has-dropdown is-hoverable"},[a("a",{staticClass:"navbar-link  is-active",attrs:{href:"/documentation/overview/start/"}},[t._v("\n          Docs\n        ")]),a("div",{staticClass:"navbar-dropdown "},[a("a",{staticClass:"navbar-item ",attrs:{href:"/documentation/overview/start/"}},[t._v("\n            Overview\n          ")]),a("a",{staticClass:"navbar-item ",attrs:{href:"http://bulma.io/documentation/modifiers/syntax/"}},[t._v("\n            Modifiers\n          ")]),a("a",{staticClass:"navbar-item ",attrs:{href:"http://bulma.io/documentation/columns/basics/"}},[t._v("\n            Columns\n          ")]),a("a",{staticClass:"navbar-item ",attrs:{href:"http://bulma.io/documentation/layout/container/"}},[t._v("\n            Layout\n          ")]),a("a",{staticClass:"navbar-item ",attrs:{href:"http://bulma.io/documentation/form/general/"}},[t._v("\n            Form\n          ")]),a("a",{staticClass:"navbar-item ",attrs:{href:"http://bulma.io/documentation/elements/box/"}},[t._v("\n            Elements\n          ")]),a("a",{staticClass:"navbar-item is-active",attrs:{href:"http://bulma.io/documentation/components/breadcrumb/"}},[t._v("\n            Components\n          ")]),a("hr",{staticClass:"navbar-divider"}),a("div",{staticClass:"navbar-item"},[a("div",[a("p",{staticClass:"is-size-6-desktop"},[a("strong",{staticClass:"has-text-info"},[t._v("0.5.1")])]),a("small",[a("a",{staticClass:"bd-view-all-versions",attrs:{href:"/versions"}},[t._v("View all versions")])])])])])]),a("div",{staticClass:"navbar-item has-dropdown is-hoverable"},[a("a",{staticClass:"navbar-link ",attrs:{href:"http://bulma.io/blog/"}},[t._v("\n          Blog\n        ")]),a("div",{staticClass:"navbar-dropdown ",attrs:{id:"blogDropdown","data-style":"width: 18rem;"}},[a("a",{staticClass:"navbar-item",attrs:{href:"/2017/08/03/list-of-tags/"}},[a("div",{staticClass:"navbar-content"},[a("p",[a("small",{staticClass:"has-text-info"},[t._v("03 Aug 2017")])]),a("p",[t._v("New feature: list of tags")])])]),a("a",{staticClass:"navbar-item",attrs:{href:"/2017/08/01/bulma-bootstrap-comparison/"}},[a("div",{staticClass:"navbar-content"},[a("p",[a("small",{staticClass:"has-text-info"},[t._v("01 Aug 2017")])]),a("p",[t._v("Bulma / Bootstrap comparison")])])]),a("a",{staticClass:"navbar-item",attrs:{href:"/2017/07/24/access-previous-bulma-versions/"}},[a("div",{staticClass:"navbar-content"},[a("p",[a("small",{staticClass:"has-text-info"},[t._v("24 Jul 2017")])]),a("p",[t._v("Access previous Bulma versions")])])]),a("a",{staticClass:"navbar-item",attrs:{href:"http://bulma.io/blog/"}},[t._v("\n            More posts\n          ")]),a("hr",{staticClass:"navbar-divider"}),a("div",{staticClass:"navbar-item"},[a("div",{staticClass:"navbar-content"},[a("div",{staticClass:"level is-mobile"},[a("div",{staticClass:"level-left"},[a("div",{staticClass:"level-item"},[a("strong",[t._v("Stay up to date!")])])]),a("div",{staticClass:"level-right"},[a("div",{staticClass:"level-item"},[a("a",{staticClass:"button bd-is-rss is-small",attrs:{href:"http://bulma.io/atom.xml"}},[a("span",{staticClass:"icon is-small"},[a("i",{staticClass:"fa fa-rss"})]),a("span",[t._v("Subscribe")])])])])])])])])]),a("div",{staticClass:"navbar-item has-dropdown is-hoverable"},[a("div",{staticClass:"navbar-link"},[t._v("\n          More\n        ")]),a("div",{staticClass:"navbar-dropdown ",attrs:{id:"moreDropdown"}},[a("a",{staticClass:"navbar-item ",attrs:{href:"http://bulma.io/extensions/"}},[a("div",{staticClass:"level is-mobile"},[a("div",{staticClass:"level-left"},[a("div",{staticClass:"level-item"},[a("p",[a("strong",[t._v("Extensions")]),a("br"),a("small",[t._v("Side projects to enhance Bulma")])])])]),a("div",{staticClass:"level-right"},[a("div",{staticClass:"level-item"},[a("span",{staticClass:"icon has-text-info"},[a("i",{staticClass:"fa fa-plug"})])])])])])])]),a("a",{staticClass:"navbar-item ",attrs:{href:"http://bulma.io/expo/"}},[a("span",{staticClass:"bd-emoji"},[t._v("🎨")]),t._v("\n        Expo\n      ")]),a("a",{staticClass:"navbar-item ",attrs:{href:"http://bulma.io/love/"}},[a("span",{staticClass:"bd-emoji"},[t._v("❤️")]),t._v("\n        Love\n      ")])]),a("div",{staticClass:"navbar-end"},[a("a",{staticClass:"navbar-item is-hidden-desktop-only",attrs:{href:"https://github.com/jgthms/bulma",target:"_blank"}},[a("span",{staticClass:"icon",staticStyle:{color:"#333"}},[a("i",{staticClass:"fa fa-github"})])]),a("a",{staticClass:"navbar-item is-hidden-desktop-only",attrs:{href:"https://twitter.com/jgthms",target:"_blank"}},[a("span",{staticClass:"icon",staticStyle:{color:"#55acee"}},[a("i",{staticClass:"fa fa-twitter"})])]),a("div",{staticClass:"navbar-item"},[a("div",{staticClass:"field is-grouped"},[a("p",{staticClass:"control"},[a("a",{staticClass:"bd-tw-button button",attrs:{"data-social-network":"Twitter","data-social-action":"tweet","data-social-target":"http://bulma.io",target:"_blank",href:"https://twitter.com/intent/tweet?text=Bulma: a modern CSS framework based on Flexbox&hashtags=bulmaio&url=http://bulma.io&via=jgthms"}},[a("span",{staticClass:"icon"},[a("i",{staticClass:"fa fa-twitter"})]),a("span",[t._v("\n                Tweet\n              ")])])]),a("p",{staticClass:"control"},[a("a",{staticClass:"button is-primary",attrs:{href:"https://github.com/jgthms/bulma/archive/0.5.1.zip"}},[a("span",{staticClass:"icon"},[a("i",{staticClass:"fa fa-download"})]),a("span",[t._v("Download")])])])])])])])}]};s.a=i},WD2h:function(t,s,a){var e=a("gSzH");"string"==typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);a("rjj0")("18b0cff3",e,!1,{sourceMap:!1})},XL0a:function(t,s,a){"use strict";var e=function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",[a("div",{staticClass:"columns is-fullheight"},[a("div",{staticClass:"column"},[a("div",{staticClass:"content",staticStyle:{"margin-top":"20px"}},[a("section",{staticClass:" is-centered column is-4 is-offset-4"},[a("article",{staticClass:"card"},[a("div",{staticClass:"card-content"},[a("h1",{staticClass:"title"},[t._v("LXD Connect")]),a("h2",{staticClass:"subtitle is-6"},[t._v("Authenticate to your server!")]),a("div",{directives:[{name:"show",rawName:"v-show",value:t.form.error.global,expression:"form.error.global"}],staticClass:"notification is-danger"},[a("button",{staticClass:"delete"}),a("strong",[t._v("Error:")]),t._v(" "+t._s(t.form.error.global)+"\n                ")]),a("div",{staticClass:"field"},[a("label",{staticClass:"label"},[t._v("Server")]),a("div",{staticClass:"control has-icons-left"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.form.server,expression:"form.server"}],staticClass:"input",attrs:{type:"text",placeholder:"Text input",list:"servers"},domProps:{value:t.form.server},on:{input:[function(s){s.target.composing||t.$set(t.form,"server",s.target.value)},t.checkDatalist]}}),t._m(0)]),a("datalist",{attrs:{id:"servers"}},t._l(t.form.servers,function(t){return a("option",{key:t.host,domProps:{value:t.host}})})),a("p",{staticClass:"help"},[a("i",{staticClass:"fa fa-pencil"}),a("a",{attrs:{href:"javascript:void(0)"},on:{click:t.editServers}},[t._v("Manage servers")])])]),a("div",{staticClass:"field"},[a("label",{staticClass:"label"},[t._v("Secret")]),a("div",{staticClass:"control has-icons-left has-icons-right"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.form.secret,expression:"form.secret"}],staticClass:"input is-success",attrs:{type:"text",placeholder:"Text input"},domProps:{value:t.form.secret},on:{input:function(s){s.target.composing||t.$set(t.form,"secret",s.target.value)}}}),t._m(1),t._m(2)]),a("p",{staticClass:"help"})]),t._m(3),a("div",{staticStyle:{"padding-bottom":"30px"}},[a("div",{staticClass:"field is-pulled-left"},[a("div",{staticClass:"control"},[a("button",{staticClass:"button is-link",on:{click:t.signIn}},[t._v("Sign In")])])]),t._m(4)])])])])])]),a("div",{staticClass:"modal",class:{"is-active":t.isEditServersActive}},[a("div",{staticClass:"modal-background"}),a("div",{staticClass:"modal-card",staticStyle:{"margin-top":"-20vh"}},[a("header",{staticClass:"modal-card-head"},[a("p",{staticClass:"modal-card-title"},[t._v("Manage Servers")]),a("button",{staticClass:"delete",attrs:{"aria-label":"close"},on:{click:function(s){t.isEditServersActive=!1}}})]),a("section",{staticClass:"modal-card-body"},[t.form.servers.length>0?a("div",[a("div",{staticClass:"notification"},[t._v("\n                The following servers are stored in your browser for easy selection.\n              ")]),a("table",{staticClass:"table"},[t._m(5),a("tbody",t._l(t.form.servers,function(s,e){return a("tr",{key:e},[a("td",[t._v(t._s(s.host))]),a("td",[t._v(t._s(s.secret))]),a("td",[a("a",{staticClass:"button is-small is-danger",on:{click:function(s){t.deleteServer(e)}}},[a("i",{staticClass:"fa fa-times"}),t._v(" Remove")])])])}))])]):a("div",[a("div",{staticClass:"notification"},[t._v("\n                There is currently no servers stored in your browser.\n              ")]),a("div",{staticClass:"field"},[a("label",{staticClass:"label"},[t._v("Server")]),a("div",{staticClass:"control has-icons-left"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.add.server,expression:"add.server"}],staticClass:"input",attrs:{type:"text",placeholder:"Text input"},domProps:{value:t.add.server},on:{input:function(s){s.target.composing||t.$set(t.add,"server",s.target.value)}}}),t._m(6)])]),a("div",{staticClass:"field"},[a("label",{staticClass:"label"},[t._v("Secret")]),a("div",{staticClass:"control has-icons-left has-icons-right"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.add.secret,expression:"add.secret"}],staticClass:"input is-success",attrs:{type:"text",placeholder:"Text input"},domProps:{value:t.add.secret},on:{input:function(s){s.target.composing||t.$set(t.add,"secret",s.target.value)}}}),t._m(7),t._m(8)]),a("p",{staticClass:"help is-success"},[t._v("This username is available")])]),a("button",{staticClass:"button is-success",on:{click:t.addServer}},[t._v("Add Server")])])]),a("footer",{staticClass:"modal-card-foot"},[a("button",{staticClass:"button",on:{click:function(s){t.isEditServersActive=!1}}},[t._v("Cancel")])])])])])])};e._withStripped=!0;var i={render:e,staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("span",{staticClass:"icon is-small is-left"},[s("i",{staticClass:"fa fa-server"})])},function(){var t=this.$createElement,s=this._self._c||t;return s("span",{staticClass:"icon is-small is-left"},[s("i",{staticClass:"fa fa-lock"})])},function(){var t=this.$createElement,s=this._self._c||t;return s("span",{staticClass:"icon is-small is-right"},[s("i",{staticClass:"fa fa-check"})])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"field"},[s("div",{staticClass:"control"},[s("label",{staticClass:"checkbox"},[s("input",{attrs:{type:"checkbox"}}),this._v("\n                      I agree to the "),s("a",{attrs:{href:"#"}},[this._v("terms and conditions")])])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"field is-pulled-right"},[s("div",{staticClass:"control"},[s("button",{staticClass:"button is-text "},[this._v("Register")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("thead",[s("tr",[s("th",[this._v("Server")]),s("th",[this._v("Secret")]),s("th",{staticStyle:{width:"1%"}})])])},function(){var t=this.$createElement,s=this._self._c||t;return s("span",{staticClass:"icon is-small is-left"},[s("i",{staticClass:"fa fa-server"})])},function(){var t=this.$createElement,s=this._self._c||t;return s("span",{staticClass:"icon is-small is-left"},[s("i",{staticClass:"fa fa-user"})])},function(){var t=this.$createElement,s=this._self._c||t;return s("span",{staticClass:"icon is-small is-right"},[s("i",{staticClass:"fa fa-check"})])}]};s.a=i},Z2aB:function(t,s,a){"use strict";s.a={props:[],data:function(){return{}},methods:{signOut:function(){}}}},flgw:function(t,s,a){"use strict";var e=a("Z2aB"),i=a("il2g"),r=!1;var n=function(t){r||a("WD2h")},l=a("VU/8")(e.a,i.a,!1,n,"data-v-8ab2da7e",null);l.options.__file="components/SideNav.vue",s.a=l.exports},gA5U:function(t,s,a){"use strict";s.a={components:{},data:function(){return{showNav:!1}},methods:{signOut:function(){}}}},gSzH:function(t,s,a){(t.exports=a("FZ+f")(!1)).push([t.i,"#nav-toggle-state[data-v-8ab2da7e]{display:none}#nav-toggle-state:checked~.is-hidden-mobile[data-v-8ab2da7e]{display:block}",""])},grhd:function(t,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var e=a("6a6x"),i=a("XL0a"),r=!1;var n=function(t){r||a("6Rin")},l=a("VU/8")(e.a,i.a,!1,n,null,null);l.options.__file="pages/auth/sign-in.vue",s.default=l.exports},il2g:function(t,s,a){"use strict";var e=function(){var t=this.$createElement,s=this._self._c||t;return s("aside",{staticClass:"menu",staticStyle:{width:"200px"}},[s("p",{staticClass:"menu-label"},[this._v("\n      General\n    ")]),s("ul",{staticClass:"menu-list"},[s("li",[s("nuxt-link",{attrs:{to:"/","active-class":"is-active",exact:""}},[this._v("Dashboard")])],1),s("li",[s("nuxt-link",{attrs:{to:"/servers","active-class":"is-active"}},[this._v("Servers")])],1)]),s("p",{staticClass:"menu-label"},[this._v("\n      User\n    ")]),s("ul",{staticClass:"menu-list"},[s("li",[s("nuxt-link",{attrs:{to:"/auth/sign-out"}},[this._v("Sign Out")])],1)])])};e._withStripped=!0;var i={render:e,staticRenderFns:[]};s.a=i},umFH:function(t,s,a){"use strict";var e=a("gA5U"),i=a("MURi"),r=!1;var n=function(t){r||a("JKzh")},l=a("VU/8")(e.a,i.a,!1,n,null,null);l.options.__file="components/TopNav.vue",s.a=l.exports},y8Tr:function(t,s,a){(t.exports=a("FZ+f")(!1)).push([t.i,"html{background:#ddd!important;height:100%}.columns{margin-top:0}.columns.is-fullheight{min-height:100vh;max-height:100vh;display:flex;flex-direction:row;justify-content:stretch}",""])}});