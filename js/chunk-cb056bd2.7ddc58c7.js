(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cb056bd2"],{"109a":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{class:t.isMobile?"":"px-2"},[i("v-tabs-items",{staticClass:"rounded-xl elevation-1",model:{value:t.tab,callback:function(e){t.tab=e},expression:"tab"}},[i("v-tab-item",[0===t.tab?i("notification-list",{attrs:{section:"all"}}):t._e()],1),i("v-tab-item",[1===t.tab?i("notification-list",{attrs:{section:"sensor"}}):t._e()],1),i("v-tab-item",[2===t.tab?i("notification-list",{attrs:{section:"activity"}}):t._e()],1)],1)],1)},o=[],a=i("5530"),s=i("2f62"),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("v-list",{attrs:{"three-line":""}},[t.loadState?t._e():n("v-subheader",{staticClass:"text-capitalize"},[t._v(" "+t._s(t.titleCase(t.section))+" "),n("v-spacer"),t.isMobile?n("v-bottom-sheet",{staticClass:"rounded-t-xl",attrs:{"overlay-color":"lime lighten-5"},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on,o=e.attrs;return[n("v-btn",t._g(t._b({attrs:{color:"grey darken-1",icon:"",depressed:"",small:""}},"v-btn",o,!1),i),[n("v-icon",{attrs:{dense:""}},[t._v(" mdi-dots-horizontal ")])],1)]}}],null,!1,2293521054),model:{value:t.bottomSheet,callback:function(e){t.bottomSheet=e},expression:"bottomSheet"}},[n("v-list",[n("v-list-item",{on:{click:t.readall}},[n("v-list-item-title",[t._v("Tandai baca semua")])],1),n("v-list-item",{on:{click:t.readall}},[n("v-list-item-title",[t._v("Matikan push notification")])],1)],1)],1):n("v-menu",{attrs:{"offset-y":""},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on,o=e.attrs;return[n("v-btn",t._g(t._b({staticClass:"primary--text",attrs:{text:"",depressed:"",icon:""}},"v-btn",o,!1),i),[n("v-icon",[t._v("mdi-dots-vertical")])],1)]}}],null,!1,2206429597)},[n("v-list",[n("v-list-item",{on:{click:t.readAll}},[n("v-list-item-title",[t._v("Tandai baca semua")])],1)],1)],1)],1),t._l(t.notifications,(function(e,i){return[n("v-list-item",{key:e.title,on:{click:function(i){return t.read(e.data.link,e.id,e.read_at)}},nativeOn:{scroll:function(e){return t.infiniteLoad(e)}}},[n("v-badge",{staticStyle:{"margin-left":"-15px"},attrs:{value:!e.read_at,color:"red lighten-1","offset-x":"22","offset-y":"22",dot:""}},[n("v-list-item-avatar",{attrs:{color:"light-green lighten-5"}},[n("v-icon",{attrs:{color:t._f("typeNotif")(e.type,"color")}},[t._v(" "+t._s(t._f("typeNotif")(e.type,"icon"))+" ")])],1)],1),n("v-list-item-content",[n("v-list-item-title",[t._v(" "+t._s(t._f("typeNotif")(e.type,"title"))+" ")]),n("v-list-item-subtitle",{domProps:{innerHTML:t._s(e.data.data)}})],1),n("v-list-item-action",{staticClass:"align-self-center"},[n("v-list-item-action-text",[t._v(" "+t._s(t._f("cD")(e.created_at))+" ")])],1)],1),n("v-divider",{key:i,attrs:{inset:""}})]})),n("div",{staticClass:"text-center mt-2"},[t.loadState?n("Loader"):t._e(),t.loadState||0!==t.notifications.length?t._e():n("div",[n("div",{staticClass:"text-center primary--text"},[t._v(" Belum ada notifikasi ")]),n("v-img",{staticClass:"my-3",attrs:{src:i("559a"),contain:"",height:"120"}})],1)],1)],2),t.maxPage?n("div",{staticClass:"text-center primary--text"},[t._v(" . . . ")]):t._e()],1)},c=[],l=i("2909"),d=i("1da1"),u=(i("96cf"),i("99af"),i("c740"),i("d81d"),i("7d70")),h={components:{Loader:u["a"]},props:{section:{type:String,default:"all"}},data:function(){return{bottomSheet:!1,notifications:[],page:1,maxPage:!1}},computed:Object(a["a"])({},Object(s["d"])("layout",["loadState","isMobile"])),created:function(){this.getNotification(),window.addEventListener("scroll",this.infiniteLoad)},beforeMount:function(){window.scrollTo(0,0)},beforeDestroy:function(){},destroyed:function(){window.removeEventListener("scroll",this.infiniteLoad)},methods:Object(a["a"])(Object(a["a"])({},Object(s["c"])("notification",["readNotif","readAll"])),{},{getNotification:function(){var t=this;return Object(d["a"])(regeneratorRuntime.mark((function e(){var i,n,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.loadstate(!0),e.next=3,t.axios.get("notification/".concat(t.section,"/").concat(t.page));case 3:i=e.sent,n=i.data.data.data,t.page++,n.length>0?(o=t.notifications).push.apply(o,Object(l["a"])(n)):t.maxPage=!0,t.loadstate(!1);case 8:case"end":return e.stop()}}),e)})))()},infiniteLoad:function(){var t=Math.ceil(document.documentElement.scrollTop+window.innerHeight)>=document.documentElement.offsetHeight;t&&!this.maxPage&&!1===this.loadState&&(document.documentElement.scrollTop-=25,this.getNotification())},loadstate:function(t){this.$store.commit("layout/setLoadstate",t)},read:function(t,e,i){if(!i){var n=this.notifications.findIndex((function(t){return t.id===e}));console.log("index notif",n),this.notifications[n]=Object.assign(this.notifications[n],{read_at:(new Date).toISOString()}),this.readNotif(e)}this.$router.push({path:t})},readall:function(){this.bottomSheet=!1,this.readAll(),this.notifications.map((function(t){return t.read_at?t:Object.assign(t,{read_at:(new Date).toISOString()})}))},titleCase:function(t){var e={all:"semua",sensor:"sensor",activity:"aktivitas"};return e[t]}})},f=h,v=(i("38e0"),i("2877")),m=i("6544"),p=i.n(m),b=i("4ca6"),g=(i("a9e3"),i("d0cd"),i("169a")),w=g["a"].extend({name:"v-bottom-sheet",props:{inset:Boolean,maxWidth:{type:[String,Number],default:"auto"},transition:{type:String,default:"bottom-sheet-transition"}},computed:{classes:function(){return Object(a["a"])(Object(a["a"])({},g["a"].options.computed.classes.call(this)),{},{"v-bottom-sheet":!0,"v-bottom-sheet--inset":this.inset})}}}),y=i("8336"),x=i("ce7e"),_=i("132d"),T=i("adda"),O=i("8860"),C=i("da13"),k=i("1800"),S=i("5d23"),A=i("8270"),$=i("e449"),j=i("2fa4"),I=i("e0c7"),E=Object(v["a"])(f,r,c,!1,null,null,null),L=E.exports;p()(E,{VBadge:b["a"],VBottomSheet:w,VBtn:y["a"],VDivider:x["a"],VIcon:_["a"],VImg:T["a"],VList:O["a"],VListItem:C["a"],VListItemAction:k["a"],VListItemActionText:S["a"],VListItemAvatar:A["a"],VListItemContent:S["b"],VListItemSubtitle:S["c"],VListItemTitle:S["d"],VMenu:$["a"],VSpacer:j["a"],VSubheader:I["a"]});var B={components:{NotificationList:L},data:function(){return{tabItem:[{title:"semua"},{title:"sensor"},{title:"aktivitas"}]}},computed:Object(a["a"])({tab:{get:function(){return this.$store.state.layout.tab},set:function(t){this.$store.commit("layout/setTab",t)}}},Object(s["d"])("layout",["isMobile"])),created:function(){this.$store.commit("layout/SET_TAB",{tab:this.$route.meta.activity?2:0,tabs:this.tabItem})},beforeDestroy:function(){this.$store.commit("layout/SET_TAB",{tab:null,tabs:null})}},V=B,D=i("9d65"),G=i("4e82"),M=i("c3f0"),N=i("80d2"),P=i("58df"),W=Object(P["a"])(D["a"],Object(G["a"])("windowGroup","v-window-item","v-window")),H=W.extend().extend().extend({name:"v-window-item",directives:{Touch:M["a"]},props:{disabled:Boolean,reverseTransition:{type:[Boolean,String],default:void 0},transition:{type:[Boolean,String],default:void 0},value:{required:!1}},data:function(){return{isActive:!1,inTransition:!1}},computed:{classes:function(){return this.groupClasses},computedTransition:function(){return this.windowGroup.internalReverse?"undefined"!==typeof this.reverseTransition?this.reverseTransition||"":this.windowGroup.computedTransition:"undefined"!==typeof this.transition?this.transition||"":this.windowGroup.computedTransition}},methods:{genDefaultSlot:function(){return this.$slots.default},genWindowItem:function(){return this.$createElement("div",{staticClass:"v-window-item",class:this.classes,directives:[{name:"show",value:this.isActive}],on:this.$listeners},this.genDefaultSlot())},onAfterTransition:function(){this.inTransition&&(this.inTransition=!1,this.windowGroup.transitionCount>0&&(this.windowGroup.transitionCount--,0===this.windowGroup.transitionCount&&(this.windowGroup.transitionHeight=void 0)))},onBeforeTransition:function(){this.inTransition||(this.inTransition=!0,0===this.windowGroup.transitionCount&&(this.windowGroup.transitionHeight=Object(N["g"])(this.windowGroup.$el.clientHeight)),this.windowGroup.transitionCount++)},onTransitionCancelled:function(){this.onAfterTransition()},onEnter:function(t){var e=this;this.inTransition&&this.$nextTick((function(){e.computedTransition&&e.inTransition&&(e.windowGroup.transitionHeight=Object(N["g"])(t.clientHeight))}))}},render:function(t){var e=this;return t("transition",{props:{name:this.computedTransition},on:{beforeEnter:this.onBeforeTransition,afterEnter:this.onAfterTransition,enterCancelled:this.onTransitionCancelled,beforeLeave:this.onBeforeTransition,afterLeave:this.onAfterTransition,leaveCancelled:this.onTransitionCancelled,enter:this.onEnter}},this.showLazyContent((function(){return[e.genWindowItem()]})))}}),Z=H.extend({name:"v-tab-item",props:{id:String},methods:{genWindowItem:function(){var t=H.options.methods.genWindowItem.call(this);return t.data.domProps=t.data.domProps||{},t.data.domProps.id=this.id||this.value,t}}}),z=i("aac8"),F=Object(v["a"])(V,n,o,!1,null,null,null);e["default"]=F.exports;p()(F,{VTabItem:Z,VTabsItems:z["a"]})},"169a":function(t,e,i){"use strict";var n=i("5530"),o=i("2909"),a=i("ade3"),s=(i("a9e3"),i("498a"),i("caad"),i("2532"),i("7db0"),i("368e"),i("480e")),r=i("4ad4"),c=i("b848"),l=i("75eb"),d=i("e707"),u=i("e4d3"),h=i("21be"),f=i("f2e7"),v=i("a293"),m=i("58df"),p=i("d9bd"),b=i("80d2"),g=Object(m["a"])(r["a"],c["a"],l["a"],d["a"],u["a"],h["a"],f["a"]);e["a"]=g.extend({name:"v-dialog",directives:{ClickOutside:v["a"]},props:{dark:Boolean,disabled:Boolean,fullscreen:Boolean,light:Boolean,maxWidth:{type:[String,Number],default:"none"},noClickAnimation:Boolean,origin:{type:String,default:"center center"},persistent:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,transition:{type:[String,Boolean],default:"dialog-transition"},width:{type:[String,Number],default:"auto"}},data:function(){return{activatedBy:null,animate:!1,animateTimeout:-1,isActive:!!this.value,stackMinZIndex:200,previousActiveElement:null}},computed:{classes:function(){var t;return t={},Object(a["a"])(t,"v-dialog ".concat(this.contentClass).trim(),!0),Object(a["a"])(t,"v-dialog--active",this.isActive),Object(a["a"])(t,"v-dialog--persistent",this.persistent),Object(a["a"])(t,"v-dialog--fullscreen",this.fullscreen),Object(a["a"])(t,"v-dialog--scrollable",this.scrollable),Object(a["a"])(t,"v-dialog--animated",this.animate),t},contentClasses:function(){return{"v-dialog__content":!0,"v-dialog__content--active":this.isActive}},hasActivator:function(){return Boolean(!!this.$slots.activator||!!this.$scopedSlots.activator)}},watch:{isActive:function(t){var e;t?(this.show(),this.hideScroll()):(this.removeOverlay(),this.unbind(),null==(e=this.previousActiveElement)||e.focus())},fullscreen:function(t){this.isActive&&(t?(this.hideScroll(),this.removeOverlay(!1)):(this.showScroll(),this.genOverlay()))}},created:function(){this.$attrs.hasOwnProperty("full-width")&&Object(p["e"])("full-width",this)},beforeMount:function(){var t=this;this.$nextTick((function(){t.isBooted=t.isActive,t.isActive&&t.show()}))},beforeDestroy:function(){"undefined"!==typeof window&&this.unbind()},methods:{animateClick:function(){var t=this;this.animate=!1,this.$nextTick((function(){t.animate=!0,window.clearTimeout(t.animateTimeout),t.animateTimeout=window.setTimeout((function(){return t.animate=!1}),150)}))},closeConditional:function(t){var e=t.target;return!(this._isDestroyed||!this.isActive||this.$refs.content.contains(e)||this.overlay&&e&&!this.overlay.$el.contains(e))&&this.activeZIndex>=this.getMaxZIndex()},hideScroll:function(){this.fullscreen?document.documentElement.classList.add("overflow-y-hidden"):d["a"].options.methods.hideScroll.call(this)},show:function(){var t=this;!this.fullscreen&&!this.hideOverlay&&this.genOverlay(),this.$nextTick((function(){t.$nextTick((function(){t.previousActiveElement=document.activeElement,t.$refs.content.focus(),t.bind()}))}))},bind:function(){window.addEventListener("focusin",this.onFocusin)},unbind:function(){window.removeEventListener("focusin",this.onFocusin)},onClickOutside:function(t){this.$emit("click:outside",t),this.persistent?this.noClickAnimation||this.animateClick():this.isActive=!1},onKeydown:function(t){if(t.keyCode===b["y"].esc&&!this.getOpenDependents().length)if(this.persistent)this.noClickAnimation||this.animateClick();else{this.isActive=!1;var e=this.getActivator();this.$nextTick((function(){return e&&e.focus()}))}this.$emit("keydown",t)},onFocusin:function(t){if(t&&this.retainFocus){var e=t.target;if(e&&![document,this.$refs.content].includes(e)&&!this.$refs.content.contains(e)&&this.activeZIndex>=this.getMaxZIndex()&&!this.getOpenDependentElements().some((function(t){return t.contains(e)}))){var i=this.$refs.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),n=Object(o["a"])(i).find((function(t){return!t.hasAttribute("disabled")}));n&&n.focus()}}},genContent:function(){var t=this;return this.showLazyContent((function(){return[t.$createElement(s["a"],{props:{root:!0,light:t.light,dark:t.dark}},[t.$createElement("div",{class:t.contentClasses,attrs:Object(n["a"])({role:"document",tabindex:t.isActive?0:void 0},t.getScopeIdAttrs()),on:{keydown:t.onKeydown},style:{zIndex:t.activeZIndex},ref:"content"},[t.genTransition()])])]}))},genTransition:function(){var t=this.genInnerContent();return this.transition?this.$createElement("transition",{props:{name:this.transition,origin:this.origin,appear:!0}},[t]):t},genInnerContent:function(){var t={class:this.classes,ref:"dialog",directives:[{name:"click-outside",value:{handler:this.onClickOutside,closeConditional:this.closeConditional,include:this.getOpenDependentElements}},{name:"show",value:this.isActive}],style:{transformOrigin:this.origin}};return this.fullscreen||(t.style=Object(n["a"])(Object(n["a"])({},t.style),{},{maxWidth:"none"===this.maxWidth?void 0:Object(b["g"])(this.maxWidth),width:"auto"===this.width?void 0:Object(b["g"])(this.width)})),this.$createElement("div",t,this.getContentSlot())}},render:function(t){return t("div",{staticClass:"v-dialog__container",class:{"v-dialog__container--attached":""===this.attach||!0===this.attach||"attach"===this.attach},attrs:{role:"dialog"}},[this.genActivator(),this.genContent()])}})},"368e":function(t,e,i){},"38e0":function(t,e,i){"use strict";i("aff3")},aff3:function(t,e,i){},d0cd:function(t,e,i){}}]);