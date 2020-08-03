$('head').append('<style>.pswp{display:none;position:absolute;width:100%;height:100%;left:0;top:0;overflow:hidden;-ms-touch-action:none;touch-action:none;z-index:1500;-webkit-text-size-adjust:100%;-webkit-backface-visibility:hidden;outline:none;}.pswp *{-webkit-box-sizing:border-box;box-sizing:border-box;}.pswp img{max-width:none;}.pswp--animate_opacity{opacity:0.001;will-change:opacity;-webkit-transition:opacity 333ms cubic-bezier(0.4,0,0.22,1);transition:opacity 333ms cubic-bezier(0.4,0,0.22,1);}.pswp--open{display:block;}.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in;}.pswp--zoomed-in .pswp__img{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab;}.pswp--dragging .pswp__img{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing;}.pswp__bg{position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(255,255,255,1);opacity:0;-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-backface-visibility:hidden;will-change:opacity;}.pswp__scroll-wrap{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;}.pswp__container,.pswp__zoom-wrap{-ms-touch-action:none;touch-action:none;position:absolute;left:0;right:0;top:0;bottom:0;}.pswp__container,.pswp__img{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;}.pswp__zoom-wrap{position:absolute;width:100%;-webkit-transform-origin:left top;-ms-transform-origin:left top;transform-origin:left top;-webkit-transition:-webkit-transform 333ms cubic-bezier(0.4,0,0.22,1);transition:transform 333ms cubic-bezier(0.4,0,0.22,1);}.pswp__bg{will-change:opacity;-webkit-transition:opacity 333ms cubic-bezier(0.4,0,0.22,1);transition:opacity 333ms cubic-bezier(0.4,0,0.22,1);}.pswp--animated-in .pswp__bg,.pswp--animated-in .pswp__zoom-wrap{-webkit-transition:none;transition:none;}.pswp__container,.pswp__zoom-wrap{-webkit-backface-visibility:hidden;}.pswp__item{position:absolute;left:0;right:0;top:0;bottom:0;overflow:hidden;}.pswp__img{position:absolute;width:auto;height:auto;top:0;left:0;}.pswp__img--placeholder{-webkit-backface-visibility:hidden;}.pswp__img--placeholder--blank{background:rgba(255,255,255,.25);}.pswp--ie .pswp__img{width:100%!important;height:auto!important;left:0;top:0;}.pswp__error-msg{position:absolute;left:0;top:50%;width:100%;text-align:center;font-size:14px;line-height:16px;margin-top:-8px;color:#CCC;}.pswp__error-msg a{color:#CCC;text-decoration:underline;}.pswp__button{width:44px;height:44px;position:relative;color:#fff; background:none;cursor:pointer;overflow:visible;-webkit-appearance:none;display:block;border:0;padding:0;margin:0;float:right;opacity:0.75;-webkit-transition:opacity 0.2s;transition:opacity 0.2s;-webkit-box-shadow:none;box-shadow:none;}.pswp__button:focus,.pswp__button:hover{opacity:1;}.pswp__button:active{outline:none;opacity:0.9;}.pswp__button::-moz-focus-inner{padding:0;border:0;}.pswp__ui--over-close .pswp__button--close{opacity:1;}.pswp__button,.pswp__button--arrow--left:before,.pswp__button--arrow--right:before{width:44px;height:44px;}.pswp__button--fs{display:none;}.pswp--supports-fs .pswp__button--fs{display:block;}.pswp--fs .pswp__button--fs{background-position:-44px 0;}.pswp__button--zoom{display:none;background-position:-88px 0;}.pswp--zoom-allowed .pswp__button--zoom{display:block;}.pswp--zoomed-in .pswp__button--zoom{background-position:-132px 0;}.pswp--touch .pswp__button--arrow--left,.pswp--touch .pswp__button--arrow--right{visibility:hidden;}.pswp__button--arrow--left,.pswp__button--arrow--right{background-color:rgba(0,0,0,0.3);top:50%;margin-top:-22px;width:44px;height:44px;position:absolute;}.pswp__button--arrow--left{left:0;}.pswp__button--arrow--right{right:0;}.pswp__button--arrow--left:before{left:6px;}.pswp__button--arrow--right:before{right:6px;}.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.pswp__counter{position:absolute;left:0;top:0;height:44px;font-size:13px;line-height:44px;color:#FFF;opacity:0.75;padding:0 10px;}.pswp__caption{position:absolute;left:0;bottom:0;width:100%;min-height:44px;}.pswp__caption small{font-size:11px;color:#BBB;}.pswp__caption__center{text-align:left;max-width:420px;margin:0 auto;font-size:13px;padding:10px;line-height:20px;color:#CCC;}.pswp__caption--empty{display:none;}.pswp__caption--fake{visibility:hidden;}.pswp__preloader{width:44px;height:44px;position:absolute;top:0;left:50%;margin-left:-22px;opacity:0;-webkit-transition:opacity 0.25s ease-out;transition:opacity 0.25s ease-out;will-change:opacity;direction:ltr;}.pswp__preloader__icn{width:20px;height:20px;margin:12px;}.pswp__preloader--active{opacity:1;}.pswp__preloader--active .pswp__preloader__icn{background:url(preloader.gif) 0 0 no-repeat;}.pswp--css_animation .pswp__preloader--active{opacity:1;}.pswp--css_animation .pswp__preloader--active .pswp__preloader__icn{-webkit-animation:clockwise 500ms linear infinite;animation:clockwise 500ms linear infinite;}.pswp--css_animation .pswp__preloader--active .pswp__preloader__donut{-webkit-animation:donut-rotate 1000ms cubic-bezier(0.4,0,0.22,1) infinite;animation:donut-rotate 1000ms cubic-bezier(0.4,0,0.22,1) infinite;}.pswp--css_animation .pswp__preloader__icn{background:none;opacity:0.75;width:14px;height:14px;position:absolute;left:15px;top:15px;margin:0;}.pswp--css_animation .pswp__preloader__cut{position:relative;width:7px;height:14px;overflow:hidden;}.pswp--css_animation .pswp__preloader__donut{-webkit-box-sizing:border-box;box-sizing:border-box;width:14px;height:14px;border:2px solid #FFF;border-radius:50%;border-left-color:transparent;border-bottom-color:transparent;position:absolute;top:0;left:0;background:none;margin:0;}@media screen and (max-width: 1024px) {.pswp__preloader{position:relative;left:auto;top:auto;margin:0;float:right;}}@-webkit-keyframes clockwise{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg);}}@keyframes clockwise{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg);}}@-webkit-keyframes donut-rotate{0%{-webkit-transform:rotate(0);transform:rotate(0);}50%{-webkit-transform:rotate(-140deg);transform:rotate(-140deg);}100%{-webkit-transform:rotate(0);transform:rotate(0);}}@keyframes donut-rotate{0%{-webkit-transform:rotate(0);transform:rotate(0);}50%{-webkit-transform:rotate(-140deg);transform:rotate(-140deg);}100%{-webkit-transform:rotate(0);transform:rotate(0);}}.pswp__ui{-webkit-font-smoothing:auto;visibility:visible;opacity:1;z-index:1550;}.pswp__top-bar{position:absolute;left:0;top:0;height:44px;width:100%;}.pswp__caption,.pswp__top-bar,.pswp__button--arrow--left,.pswp__button--arrow--right{-webkit-backface-visibility:hidden;will-change:opacity;-webkit-transition:opacity 333ms cubic-bezier(0.4,0,0.22,1);transition:opacity 333ms cubic-bezier(0.4,0,0.22,1);}.pswp--has_mouse .pswp__button--arrow--left,.pswp--has_mouse .pswp__button--arrow--right{visibility:visible;}.pswp__top-bar,.pswp__caption{background-color:rgba(0,0,0,0.5);}.pswp__ui--fit .pswp__top-bar,.pswp__ui--fit .pswp__caption{background-color:rgba(0,0,0,0.9); opacity:1!important;}.pswp__ui--idle .pswp__top-bar{opacity:0;}.pswp__ui--idle .pswp__button--arrow--left,.pswp__ui--idle .pswp__button--arrow--right{opacity:0;}.pswp__ui--hidden .pswp__top-bar,.pswp__ui--hidden .pswp__caption,.pswp__ui--hidden .pswp__button--arrow--left,.pswp__ui--hidden .pswp__button--arrow--right{opacity:0.001;}.pswp__ui--one-slide .pswp__button--arrow--left,.pswp__ui--one-slide .pswp__button--arrow--right{display:none;}.pswp__element--disabled{display:none!important;}.pswp--minimal--dark .pswp__top-bar{background:none;}</style>')
$('#product-images').append('<div id="gallery" class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close fa fa-times"><span class="sr-only">Close (Esc)</span></button><button class="pswp__button pswp__button--fs fa fa-expand"><span class="sr-only">Toggle fullscreen</span></button><button class="pswp__button pswp__button--zoom fa fa-search-plus"><span class="sr-only">Zoom in/out</span></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><button class="pswp__button pswp__button--arrow--left fa fa-chevron-left"><span class="sr-only">Previous (arrow left)</span></button><button class="pswp__button pswp__button--arrow--right fa fa-chevron-right"><span class="sr-only">Next (arrow right)</span></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>')

/*! PhotoSwipe - v4.1.2 - 2017-04-05
* http://photoswipe.com
// * Copyright (c) 2017 Dmitry Semenov; */
!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.PhotoSwipe=t()}(this,function(){"use strict";return function(e,t,n,i){var o={features:null,bind:function(e,t,n,i){var o=(i?"remove":"add")+"EventListener";t=t.split(" ");for(var a=0;a<t.length;a++)t[a]&&e[o](t[a],n,!1)},isArray:function(e){return e instanceof Array},createEl:function(e,t){var n=document.createElement(t||"div");return e&&(n.className=e),n},getScrollY:function(){var e=window.pageYOffset;return void 0!==e?e:document.documentElement.scrollTop},unbind:function(e,t,n){o.bind(e,t,n,!0)},removeClass:function(e,t){var n=new RegExp("(\\s|^)"+t+"(\\s|$)");e.className=e.className.replace(n," ").replace(/^\s\s*/,"").replace(/\s\s*$/,"")},addClass:function(e,t){o.hasClass(e,t)||(e.className+=(e.className?" ":"")+t)},hasClass:function(e,t){return e.className&&new RegExp("(^|\\s)"+t+"(\\s|$)").test(e.className)},getChildByClass:function(e,t){for(var n=e.firstChild;n;){if(o.hasClass(n,t))return n;n=n.nextSibling}},arraySearch:function(e,t,n){for(var i=e.length;i--;)if(e[i][n]===t)return i;return-1},extend:function(e,t,n){for(var i in t)if(t.hasOwnProperty(i)){if(n&&e.hasOwnProperty(i))continue;e[i]=t[i]}},easing:{sine:{out:function(e){return Math.sin(e*(Math.PI/2))},inOut:function(e){return-(Math.cos(Math.PI*e)-1)/2}},cubic:{out:function(e){return--e*e*e+1}}},detectFeatures:function(){if(o.features)return o.features;var e=o.createEl().style,t="",n={};if(n.oldIE=document.all&&!document.addEventListener,n.touch="ontouchstart"in window,window.requestAnimationFrame&&(n.raf=window.requestAnimationFrame,n.caf=window.cancelAnimationFrame),n.pointerEvent=navigator.pointerEnabled||navigator.msPointerEnabled,!n.pointerEvent){var i=navigator.userAgent;if(/iP(hone|od)/.test(navigator.platform)){var a=navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);a&&a.length>0&&(a=parseInt(a[1],10))>=1&&a<8&&(n.isOldIOSPhone=!0)}var r=i.match(/Android\s([0-9\.]*)/),l=r?r[1]:0;(l=parseFloat(l))>=1&&(l<4.4&&(n.isOldAndroid=!0),n.androidVersion=l),n.isMobileOpera=/opera mini|opera mobi/i.test(i)}for(var s,c,u=["transform","perspective","animationName"],d=["","webkit","Moz","ms","O"],m=0;m<4;m++){t=d[m];for(var p=0;p<3;p++)s=u[p],c=t+(t?s.charAt(0).toUpperCase()+s.slice(1):s),!n[s]&&c in e&&(n[s]=c);t&&!n.raf&&(t=t.toLowerCase(),n.raf=window[t+"RequestAnimationFrame"],n.raf&&(n.caf=window[t+"CancelAnimationFrame"]||window[t+"CancelRequestAnimationFrame"]))}if(!n.raf){var f=0;n.raf=function(e){var t=(new Date).getTime(),n=Math.max(0,16-(t-f)),i=window.setTimeout(function(){e(t+n)},n);return f=t+n,i},n.caf=function(e){clearTimeout(e)}}return n.svg=!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,o.features=n,n}};o.detectFeatures(),o.features.oldIE&&(o.bind=function(e,t,n,i){t=t.split(" ");for(var o,a=(i?"detach":"attach")+"Event",r=function(){n.handleEvent.call(n)},l=0;l<t.length;l++)if(o=t[l])if("object"==typeof n&&n.handleEvent){if(i){if(!n["oldIE"+o])return!1}else n["oldIE"+o]=r;e[a]("on"+o,n["oldIE"+o])}else e[a]("on"+o,n)});var a=this,r={allowPanToNext:!0,spacing:.12,bgOpacity:1,mouseUsed:!1,loop:!0,pinchToClose:!0,closeOnScroll:!0,closeOnVerticalDrag:!0,verticalDragRange:.75,hideAnimationDuration:333,showAnimationDuration:333,showHideOpacity:!1,focus:!0,escKey:!0,arrowKeys:!0,mainScrollEndFriction:.35,panEndFriction:.35,isClickableElement:function(e){return"A"===e.tagName},getDoubleTapZoom:function(e,t){return e?1:t.initialZoomLevel<.7?1:1.33},maxSpreadZoom:1.33,modal:!0,scaleMode:"fit"};o.extend(r,i);var l,s,c,u,d,m,p,f,y,x,h,v,g,w,b,I,C,D,M,S,T,A,E,O,k,R,Z,P,F,L,z,_,N,U,Y,W,B,G,H,X,V,K,q,$,j,J,Q,ee,te,ne,ie,oe,ae,re,le,se,ce={x:0,y:0},ue={x:0,y:0},de={x:0,y:0},me={},pe=0,fe={},ye={x:0,y:0},xe=0,he=!0,ve=[],ge={},we=!1,be=function(e,t){o.extend(a,t.publicMethods),ve.push(e)},Ie=function(e){var t=Yt();return e>t-1?e-t:e<0?t+e:e},Ce={},De=function(e,t){return Ce[e]||(Ce[e]=[]),Ce[e].push(t)},Me=function(e){var t=Ce[e];if(t){var n=Array.prototype.slice.call(arguments);n.shift();for(var i=0;i<t.length;i++)t[i].apply(a,n)}},Se=function(){return(new Date).getTime()},Te=function(e){re=e,a.bg.style.opacity=e*r.bgOpacity},Ae=function(e,t,n,i,o){(!we||o&&o!==a.currItem)&&(i/=o?o.fitRatio:a.currItem.fitRatio),e[A]=v+t+"px, "+n+"px"+g+" scale("+i+")"},Ee=function(e){te&&(e&&(x>a.currItem.fitRatio?we||($t(a.currItem,!1,!0),we=!0):we&&($t(a.currItem),we=!1)),Ae(te,de.x,de.y,x))},Oe=function(e){e.container&&Ae(e.container.style,e.initialPosition.x,e.initialPosition.y,e.initialZoomLevel,e)},ke=function(e,t){t[A]=v+e+"px, 0px"+g},Re=function(e,t){if(!r.loop&&t){var n=u+(ye.x*pe-e)/ye.x,i=Math.round(e-ut.x);(n<0&&i>0||n>=Yt()-1&&i<0)&&(e=ut.x+i*r.mainScrollEndFriction)}ut.x=e,ke(e,d)},Ze=function(e,t){var n=dt[e]-fe[e];return ue[e]+ce[e]+n-n*(t/h)},Pe=function(e,t){e.x=t.x,e.y=t.y,t.id&&(e.id=t.id)},Fe=function(e){e.x=Math.round(e.x),e.y=Math.round(e.y)},Le=null,ze=function(){Le&&(o.unbind(document,"mousemove",ze),o.addClass(e,"pswp--has_mouse"),r.mouseUsed=!0,Me("mouseUsed")),Le=setTimeout(function(){Le=null},100)},_e=function(e,t){var n=Xt(a.currItem,me,e);return t&&(ee=n),n},Ne=function(e){return e||(e=a.currItem),e.initialZoomLevel},Ue=function(e){return e||(e=a.currItem),e.w>0?r.maxSpreadZoom:1},Ye=function(e,t,n,i){return i===a.currItem.initialZoomLevel?(n[e]=a.currItem.initialPosition[e],!0):(n[e]=Ze(e,i),n[e]>t.min[e]?(n[e]=t.min[e],!0):n[e]<t.max[e]&&(n[e]=t.max[e],!0))},We=function(e){var t="";r.escKey&&27===e.keyCode?t="close":r.arrowKeys&&(37===e.keyCode?t="prev":39===e.keyCode&&(t="next")),t&&(e.ctrlKey||e.altKey||e.shiftKey||e.metaKey||(e.preventDefault?e.preventDefault():e.returnValue=!1,a[t]()))},Be=function(e){e&&(K||V||ne||B)&&(e.preventDefault(),e.stopPropagation())},Ge=function(){a.setScrollOffset(0,o.getScrollY())},He={},Xe=0,Ve=function(e){He[e]&&(He[e].raf&&R(He[e].raf),Xe--,delete He[e])},Ke=function(e){He[e]&&Ve(e),He[e]||(Xe++,He[e]={})},qe=function(){for(var e in He)He.hasOwnProperty(e)&&Ve(e)},$e=function(e,t,n,i,o,a,r){var l,s=Se();Ke(e);var c=function(){if(He[e]){if((l=Se()-s)>=i)return Ve(e),a(n),void(r&&r());a((n-t)*o(l/i)+t),He[e].raf=k(c)}};c()},je={shout:Me,listen:De,viewportSize:me,options:r,isMainScrollAnimating:function(){return ne},getZoomLevel:function(){return x},getCurrentIndex:function(){return u},isDragging:function(){return H},isZooming:function(){return J},setScrollOffset:function(e,t){fe.x=e,L=fe.y=t,Me("updateScrollOffset",fe)},applyZoomPan:function(e,t,n,i){de.x=t,de.y=n,x=e,Ee(i)},init:function(){if(!l&&!s){var n;a.framework=o,a.template=e,a.bg=o.getChildByClass(e,"pswp__bg"),Z=e.className,l=!0,z=o.detectFeatures(),k=z.raf,R=z.caf,A=z.transform,F=z.oldIE,a.scrollWrap=o.getChildByClass(e,"pswp__scroll-wrap"),a.container=o.getChildByClass(a.scrollWrap,"pswp__container"),d=a.container.style,a.itemHolders=I=[{el:a.container.children[0],wrap:0,index:-1},{el:a.container.children[1],wrap:0,index:-1},{el:a.container.children[2],wrap:0,index:-1}],I[0].el.style.display=I[2].el.style.display="none",function(){if(A){var t=z.perspective&&!O;return v="translate"+(t?"3d(":"("),void(g=z.perspective?", 0px)":")")}A="left",o.addClass(e,"pswp--ie"),ke=function(e,t){t.left=e+"px"},Oe=function(e){var t=e.fitRatio>1?1:e.fitRatio,n=e.container.style,i=t*e.w,o=t*e.h;n.width=i+"px",n.height=o+"px",n.left=e.initialPosition.x+"px",n.top=e.initialPosition.y+"px"},Ee=function(){if(te){var e=te,t=a.currItem,n=t.fitRatio>1?1:t.fitRatio,i=n*t.w,o=n*t.h;e.width=i+"px",e.height=o+"px",e.left=de.x+"px",e.top=de.y+"px"}}}(),y={resize:a.updateSize,orientationchange:function(){clearTimeout(_),_=setTimeout(function(){me.x!==a.scrollWrap.clientWidth&&a.updateSize()},500)},scroll:Ge,keydown:We,click:Be};var i=z.isOldIOSPhone||z.isOldAndroid||z.isMobileOpera;for(z.animationName&&z.transform&&!i||(r.showAnimationDuration=r.hideAnimationDuration=0),n=0;n<ve.length;n++)a["init"+ve[n]]();t&&(a.ui=new t(a,o)).init(),Me("firstUpdate"),u=u||r.index||0,(isNaN(u)||u<0||u>=Yt())&&(u=0),a.currItem=Ut(u),(z.isOldIOSPhone||z.isOldAndroid)&&(he=!1),e.setAttribute("aria-hidden","false"),r.modal&&(he?e.style.position="fixed":(e.style.position="absolute",e.style.top=o.getScrollY()+"px")),void 0===L&&(Me("initialLayout"),L=P=o.getScrollY());var c="pswp--open ";for(r.mainClass&&(c+=r.mainClass+" "),r.showHideOpacity&&(c+="pswp--animate_opacity "),c+=O?"pswp--touch":"pswp--notouch",c+=z.animationName?" pswp--css_animation":"",c+=z.svg?" pswp--svg":"",o.addClass(e,c),a.updateSize(),m=-1,xe=null,n=0;n<3;n++)ke((n+m)*ye.x,I[n].el.style);F||o.bind(a.scrollWrap,f,a),De("initialZoomInEnd",function(){a.setContent(I[0],u-1),a.setContent(I[2],u+1),I[0].el.style.display=I[2].el.style.display="block",r.focus&&e.focus(),o.bind(document,"keydown",a),z.transform&&o.bind(a.scrollWrap,"click",a),r.mouseUsed||o.bind(document,"mousemove",ze),o.bind(window,"resize scroll orientationchange",a),Me("bindEvents")}),a.setContent(I[1],u),a.updateCurrItem(),Me("afterInit"),he||(w=setInterval(function(){Xe||H||J||x!==a.currItem.initialZoomLevel||a.updateSize()},1e3)),o.addClass(e,"pswp--visible")}},close:function(){l&&(l=!1,s=!0,Me("close"),o.unbind(window,"resize scroll orientationchange",a),o.unbind(window,"scroll",y.scroll),o.unbind(document,"keydown",a),o.unbind(document,"mousemove",ze),z.transform&&o.unbind(a.scrollWrap,"click",a),H&&o.unbind(window,p,a),clearTimeout(_),Me("unbindEvents"),Wt(a.currItem,null,!0,a.destroy))},destroy:function(){Me("destroy"),Lt&&clearTimeout(Lt),e.setAttribute("aria-hidden","true"),e.className=Z,w&&clearInterval(w),o.unbind(a.scrollWrap,f,a),o.unbind(window,"scroll",a),ft(),qe(),Ce=null},panTo:function(e,t,n){n||(e>ee.min.x?e=ee.min.x:e<ee.max.x&&(e=ee.max.x),t>ee.min.y?t=ee.min.y:t<ee.max.y&&(t=ee.max.y)),de.x=e,de.y=t,Ee()},handleEvent:function(e){e=e||window.event,y[e.type]&&y[e.type](e)},goTo:function(e){var t=(e=Ie(e))-u;xe=t,u=e,a.currItem=Ut(u),pe-=t,Re(ye.x*pe),qe(),ne=!1,slickMatchZoom(u+1),a.updateCurrItem()},next:function(){a.goTo(u+1)},prev:function(){a.goTo(u-1)},updateCurrZoomItem:function(e){if(e&&Me("beforeChange",0),I[1].el.children.length){var t=I[1].el.children[0];te=o.hasClass(t,"pswp__zoom-wrap")?t.style:null}else te=null;ee=a.currItem.bounds,h=x=a.currItem.initialZoomLevel,de.x=ee.center.x,de.y=ee.center.y,e&&Me("afterChange")},invalidateCurrItems:function(){b=!0;for(var e=0;e<3;e++)I[e].item&&(I[e].item.needsUpdate=!0)},updateCurrItem:function(e){if(0!==xe){var t,n=Math.abs(xe);if(!(e&&n<2)){a.currItem=Ut(u),we=!1,Me("beforeChange",xe),n>=3&&(m+=xe+(xe>0?-3:3),n=3);for(var i=0;i<n;i++)xe>0?(t=I.shift(),I[2]=t,ke((++m+2)*ye.x,t.el.style),a.setContent(t,u-n+i+1+1)):(t=I.pop(),I.unshift(t),ke(--m*ye.x,t.el.style),a.setContent(t,u+n-i-1-1));if(te&&1===Math.abs(xe)){var o=Ut(C);o.initialZoomLevel!==x&&(Xt(o,me),$t(o),Oe(o))}xe=0,a.updateCurrZoomItem(),C=u,Me("afterChange")}}},updateSize:function(t){if(!he&&r.modal){var n=o.getScrollY();if(L!==n&&(e.style.top=n+"px",L=n),!t&&ge.x===window.innerWidth&&ge.y===window.innerHeight)return;ge.x=window.innerWidth,ge.y=window.innerHeight,e.style.height=ge.y+"px"}if(me.x=a.scrollWrap.clientWidth,me.y=a.scrollWrap.clientHeight,Ge(),ye.x=me.x+Math.round(me.x*r.spacing),ye.y=me.y,Re(ye.x*pe),Me("beforeResize"),void 0!==m){for(var i,l,s,c=0;c<3;c++)i=I[c],ke((c+m)*ye.x,i.el.style),s=u+c-1,r.loop&&Yt()>2&&(s=Ie(s)),(l=Ut(s))&&(b||l.needsUpdate||!l.bounds)?(a.cleanSlide(l),a.setContent(i,s),1===c&&(a.currItem=l,a.updateCurrZoomItem(!0)),l.needsUpdate=!1):-1===i.index&&s>=0&&a.setContent(i,s),l&&l.container&&(Xt(l,me),$t(l),Oe(l));b=!1}h=x=a.currItem.initialZoomLevel,(ee=a.currItem.bounds)&&(de.x=ee.center.x,de.y=ee.center.y,Ee(!0)),Me("resize")},zoomTo:function(e,t,n,i,a){t&&(h=x,dt.x=Math.abs(t.x)-de.x,dt.y=Math.abs(t.y)-de.y,Pe(ue,de));var r=_e(e,!1),l={};Ye("x",r,l,e),Ye("y",r,l,e);var s=x,c=de.x,u=de.y;Fe(l);var d=function(t){1===t?(x=e,de.x=l.x,de.y=l.y):(x=(e-s)*t+s,de.x=(l.x-c)*t+c,de.y=(l.y-u)*t+u),a&&a(t),Ee(1===t)};n?$e("customZoomTo",0,1,n,i||o.easing.sine.inOut,d):d(1)}},Je={},Qe={},et={},tt={},nt={},it=[],ot={},at=[],rt={},lt=0,st={x:0,y:0},ct=0,ut={x:0,y:0},dt={x:0,y:0},mt={x:0,y:0},pt=function(e,t){return rt.x=Math.abs(e.x-t.x),rt.y=Math.abs(e.y-t.y),Math.sqrt(rt.x*rt.x+rt.y*rt.y)},ft=function(){q&&(R(q),q=null)},yt=function(){H&&(q=k(yt),Et())},xt=function(e,t){return!(!e||e===document)&&!(e.getAttribute("class")&&e.getAttribute("class").indexOf("pswp__scroll-wrap")>-1)&&(t(e)?e:xt(e.parentNode,t))},ht={},vt=function(e,t){return ht.prevent=!xt(e.target,r.isClickableElement),Me("preventDragEvent",e,t,ht),ht.prevent},gt=function(e,t){return t.x=e.pageX,t.y=e.pageY,t.id=e.identifier,t},wt=function(e,t,n){n.x=.5*(e.x+t.x),n.y=.5*(e.y+t.y)},bt=function(){var e=de.y-a.currItem.initialPosition.y;return 1-Math.abs(e/(me.y/2))},It={},Ct={},Dt=[],Mt=function(e){for(;Dt.length>0;)Dt.pop();return E?(se=0,it.forEach(function(e){0===se?Dt[0]=e:1===se&&(Dt[1]=e),se++})):e.type.indexOf("touch")>-1?e.touches&&e.touches.length>0&&(Dt[0]=gt(e.touches[0],It),e.touches.length>1&&(Dt[1]=gt(e.touches[1],Ct))):(It.x=e.pageX,It.y=e.pageY,It.id="",Dt[0]=It),Dt},St=function(e,t){var n,i,o,l,s=de[e]+t[e],c=t[e]>0,u=ut.x+t.x,d=ut.x-ot.x;if(n=s>ee.min[e]||s<ee.max[e]?r.panEndFriction:1,s=de[e]+t[e]*n,(r.allowPanToNext||x===a.currItem.initialZoomLevel)&&(te?"h"!==ie||"x"!==e||V||(c?(s>ee.min[e]&&(n=r.panEndFriction,ee.min[e],i=ee.min[e]-ue[e]),(i<=0||d<0)&&Yt()>1?(l=u,d<0&&u>ot.x&&(l=ot.x)):ee.min.x!==ee.max.x&&(o=s)):(s<ee.max[e]&&(n=r.panEndFriction,ee.max[e],i=ue[e]-ee.max[e]),(i<=0||d>0)&&Yt()>1?(l=u,d>0&&u<ot.x&&(l=ot.x)):ee.min.x!==ee.max.x&&(o=s))):l=u,"x"===e))return void 0!==l&&(Re(l,!0),$=l!==ot.x),ee.min.x!==ee.max.x&&(void 0!==o?de.x=o:$||(de.x+=t.x*n)),void 0!==l;ne||$||x>a.currItem.fitRatio&&(de[e]+=t[e]*n)},Tt=function(e){if(!("mousedown"===e.type&&e.button>0))if(Nt)e.preventDefault();else if(!G||"mousedown"!==e.type){if(vt(e,!0)&&e.preventDefault(),Me("pointerDown"),E){var t=o.arraySearch(it,e.pointerId,"id");t<0&&(t=it.length),it[t]={x:e.pageX,y:e.pageY,id:e.pointerId}}var n=Mt(e),i=n.length;j=null,qe(),H&&1!==i||(H=oe=!0,o.bind(window,p,a),W=le=ae=B=$=K=X=V=!1,ie=null,Me("firstTouchStart",n),Pe(ue,de),ce.x=ce.y=0,Pe(tt,n[0]),Pe(nt,tt),ot.x=ye.x*pe,at=[{x:tt.x,y:tt.y}],U=N=Se(),_e(x,!0),ft(),yt()),!J&&i>1&&!ne&&!$&&(h=x,V=!1,J=X=!0,ce.y=ce.x=0,Pe(ue,de),Pe(Je,n[0]),Pe(Qe,n[1]),wt(Je,Qe,mt),dt.x=Math.abs(mt.x)-de.x,dt.y=Math.abs(mt.y)-de.y,Q=pt(Je,Qe))}},At=function(e){if(e.preventDefault(),E){var t=o.arraySearch(it,e.pointerId,"id");if(t>-1){var n=it[t];n.x=e.pageX,n.y=e.pageY}}if(H){var i=Mt(e);if(ie||K||J)j=i;else if(ut.x!==ye.x*pe)ie="h";else{var a=Math.abs(i[0].x-tt.x)-Math.abs(i[0].y-tt.y);Math.abs(a)>=10&&(ie=a>0?"h":"v",j=i)}}},Et=function(){if(j){var e,t,n=j.length;if(0!==n)if(Pe(Je,j[0]),et.x=Je.x-tt.x,et.y=Je.y-tt.y,J&&n>1){if(tt.x=Je.x,tt.y=Je.y,!et.x&&!et.y&&(e=j[1],t=Qe,e.x===t.x&&e.y===t.y))return;Pe(Qe,j[1]),V||(V=!0,Me("zoomGestureStarted"));var i=pt(Je,Qe),o=Pt(i);o>a.currItem.initialZoomLevel+a.currItem.initialZoomLevel/15&&(le=!0);var l=1,s=Ne(),c=Ue();if(o<s)if(r.pinchToClose&&!le&&h<=a.currItem.initialZoomLevel){var u=1-(s-o)/(s/1.2);Te(u),Me("onPinchClose",u),ae=!0}else(l=(s-o)/s)>1&&(l=1),o=s-l*(s/3);else o>c&&((l=(o-c)/(6*s))>1&&(l=1),o=c+l*s);l<0&&(l=0),wt(Je,Qe,st),ce.x+=st.x-mt.x,ce.y+=st.y-mt.y,Pe(mt,st),de.x=Ze("x",o),de.y=Ze("y",o),W=o>x,x=o,Ee()}else{if(!ie)return;if(oe&&(oe=!1,Math.abs(et.x)>=10&&(et.x-=j[0].x-nt.x),Math.abs(et.y)>=10&&(et.y-=j[0].y-nt.y)),tt.x=Je.x,tt.y=Je.y,0===et.x&&0===et.y)return;if("v"===ie&&r.closeOnVerticalDrag&&"fit"===r.scaleMode&&x===a.currItem.initialZoomLevel){ce.y+=et.y,de.y+=et.y;var d=bt();return B=!0,Me("onVerticalDrag",d),Te(d),void Ee()}!function(e,t,n){if(e-U>50){var i=at.length>2?at.shift():{};i.x=t,i.y=n,at.push(i),U=e}}(Se(),Je.x,Je.y),K=!0,ee=a.currItem.bounds,St("x",et)||(St("y",et),Fe(de),Ee())}}},Ot=function(e){if(z.isOldAndroid){if(G&&"mouseup"===e.type)return;e.type.indexOf("touch")>-1&&(clearTimeout(G),G=setTimeout(function(){G=0},600))}var t;if(Me("pointerUp"),vt(e,!1)&&e.preventDefault(),E){var n=o.arraySearch(it,e.pointerId,"id");n>-1&&(t=it.splice(n,1)[0],navigator.pointerEnabled?t.type=e.pointerType||"mouse":(t.type={4:"mouse",2:"touch",3:"pen"}[e.pointerType],t.type||(t.type=e.pointerType||"mouse")))}var i,l=Mt(e),s=l.length;if("mouseup"===e.type&&(s=0),2===s)return j=null,!0;1===s&&Pe(nt,l[0]),0!==s||ie||ne||(t||("mouseup"===e.type?t={x:e.pageX,y:e.pageY,type:"mouse"}:e.changedTouches&&e.changedTouches[0]&&(t={x:e.changedTouches[0].pageX,y:e.changedTouches[0].pageY,type:"touch"})),Me("touchRelease",e,t));var c=-1;if(0===s&&(H=!1,o.unbind(window,p,a),ft(),J?c=0:-1!==ct&&(c=Se()-ct)),ct=1===s?Se():-1,i=-1!==c&&c<150?"zoom":"swipe",J&&s<2&&(J=!1,1===s&&(i="zoomPointerUp"),Me("zoomGestureEnded")),j=null,K||V||ne||B)if(qe(),Y||(Y=kt()),Y.calculateSwipeSpeed("x"),B)if(bt()<r.verticalDragRange)a.close();else{var u=de.y,d=re;$e("verticalDrag",0,1,300,o.easing.cubic.out,function(e){de.y=(a.currItem.initialPosition.y-u)*e+u,Te((1-d)*e+d),Ee()}),Me("onVerticalDrag",1)}else{if(($||ne)&&0===s){if(Zt(i,Y))return;i="zoomPointerUp"}ne||("swipe"===i?!$&&x>a.currItem.fitRatio&&Rt(Y):Ft())}},kt=function(){var e,t,n={lastFlickOffset:{},lastFlickDist:{},lastFlickSpeed:{},slowDownRatio:{},slowDownRatioReverse:{},speedDecelerationRatio:{},speedDecelerationRatioAbs:{},distanceOffset:{},backAnimDestination:{},backAnimStarted:{},calculateSwipeSpeed:function(i){at.length>1?(e=Se()-U+50,t=at[at.length-2][i]):(e=Se()-N,t=nt[i]),n.lastFlickOffset[i]=tt[i]-t,n.lastFlickDist[i]=Math.abs(n.lastFlickOffset[i]),n.lastFlickDist[i]>20?n.lastFlickSpeed[i]=n.lastFlickOffset[i]/e:n.lastFlickSpeed[i]=0,Math.abs(n.lastFlickSpeed[i])<.1&&(n.lastFlickSpeed[i]=0),n.slowDownRatio[i]=.95,n.slowDownRatioReverse[i]=1-n.slowDownRatio[i],n.speedDecelerationRatio[i]=1},calculateOverBoundsAnimOffset:function(e,t){n.backAnimStarted[e]||(de[e]>ee.min[e]?n.backAnimDestination[e]=ee.min[e]:de[e]<ee.max[e]&&(n.backAnimDestination[e]=ee.max[e]),void 0!==n.backAnimDestination[e]&&(n.slowDownRatio[e]=.7,n.slowDownRatioReverse[e]=1-n.slowDownRatio[e],n.speedDecelerationRatioAbs[e]<.05&&(n.lastFlickSpeed[e]=0,n.backAnimStarted[e]=!0,$e("bounceZoomPan"+e,de[e],n.backAnimDestination[e],t||300,o.easing.sine.out,function(t){de[e]=t,Ee()}))))},calculateAnimOffset:function(e){n.backAnimStarted[e]||(n.speedDecelerationRatio[e]=n.speedDecelerationRatio[e]*(n.slowDownRatio[e]+n.slowDownRatioReverse[e]-n.slowDownRatioReverse[e]*n.timeDiff/10),n.speedDecelerationRatioAbs[e]=Math.abs(n.lastFlickSpeed[e]*n.speedDecelerationRatio[e]),n.distanceOffset[e]=n.lastFlickSpeed[e]*n.speedDecelerationRatio[e]*n.timeDiff,de[e]+=n.distanceOffset[e])},panAnimLoop:function(){if(He.zoomPan&&(He.zoomPan.raf=k(n.panAnimLoop),n.now=Se(),n.timeDiff=n.now-n.lastNow,n.lastNow=n.now,n.calculateAnimOffset("x"),n.calculateAnimOffset("y"),Ee(),n.calculateOverBoundsAnimOffset("x"),n.calculateOverBoundsAnimOffset("y"),n.speedDecelerationRatioAbs.x<.05&&n.speedDecelerationRatioAbs.y<.05))return de.x=Math.round(de.x),de.y=Math.round(de.y),Ee(),void Ve("zoomPan")}};return n},Rt=function(e){if(e.calculateSwipeSpeed("y"),ee=a.currItem.bounds,e.backAnimDestination={},e.backAnimStarted={},Math.abs(e.lastFlickSpeed.x)<=.05&&Math.abs(e.lastFlickSpeed.y)<=.05)return e.speedDecelerationRatioAbs.x=e.speedDecelerationRatioAbs.y=0,e.calculateOverBoundsAnimOffset("x"),e.calculateOverBoundsAnimOffset("y"),!0;Ke("zoomPan"),e.lastNow=Se(),e.panAnimLoop()},Zt=function(e,t){var n,i,l;if(ne||(lt=u),"swipe"===e){var s=tt.x-nt.x,c=t.lastFlickDist.x<10;s>30&&(c||t.lastFlickOffset.x>20)?i=-1:s<-30&&(c||t.lastFlickOffset.x<-20)&&(i=1)}i&&((u+=i)<0?(u=r.loop?Yt()-1:0,l=!0):u>=Yt()&&(u=r.loop?0:Yt()-1,l=!0),l&&!r.loop||(xe+=i,pe-=i,n=!0));var d,m=ye.x*pe,p=Math.abs(m-ut.x);return n||m>ut.x==t.lastFlickSpeed.x>0?(d=Math.abs(t.lastFlickSpeed.x)>0?p/Math.abs(t.lastFlickSpeed.x):333,d=Math.min(d,400),d=Math.max(d,250)):d=333,lt===u&&(n=!1),ne=!0,Me("mainScrollAnimStart"),$e("mainScroll",ut.x,m,d,o.easing.cubic.out,Re,function(){qe(),ne=!1,lt=-1,(n||lt!==u)&&a.updateCurrItem(),Me("mainScrollAnimComplete")}),n&&a.updateCurrItem(!0),n},Pt=function(e){return 1/Q*e*h},Ft=function(){var e=x,t=Ne(),n=Ue();x<t?e=t:x>n&&(e=n);var i,r=re;return ae&&!W&&!le&&x<t?(a.close(),!0):(ae&&(i=function(e){Te((1-r)*e+r)}),a.zoomTo(e,0,200,o.easing.cubic.out,i),!0)};be("Gestures",{publicMethods:{initGestures:function(){var e=function(e,t,n,i,o){D=e+t,M=e+n,S=e+i,T=o?e+o:""};(E=z.pointerEvent)&&z.touch&&(z.touch=!1),E?navigator.pointerEnabled?e("pointer","down","move","up","cancel"):e("MSPointer","Down","Move","Up","Cancel"):z.touch?(e("touch","start","move","end","cancel"),O=!0):e("mouse","down","move","up"),p=M+" "+S+" "+T,f=D,E&&!O&&(O=navigator.maxTouchPoints>1||navigator.msMaxTouchPoints>1),a.likelyTouchDevice=O,y[D]=Tt,y[M]=At,y[S]=Ot,T&&(y[T]=y[S]),z.touch&&(f+=" mousedown",p+=" mousemove mouseup",y.mousedown=y[D],y.mousemove=y[M],y.mouseup=y[S]),O||(r.allowPanToNext=!1)}}});var Lt,zt,_t,Nt,Ut,Yt,Wt=function(t,n,i,l){var s;Lt&&clearTimeout(Lt),Nt=!0,_t=!0,t.initialLayout?(s=t.initialLayout,t.initialLayout=null):s=r.getThumbBoundsFn&&r.getThumbBoundsFn(u);var d,m,p=i?r.hideAnimationDuration:r.showAnimationDuration,f=function(){Ve("initialZoom"),i?(a.template.removeAttribute("style"),a.bg.removeAttribute("style")):(Te(1),n&&(n.style.display="block"),o.addClass(e,"pswp--animated-in"),Me("initialZoom"+(i?"OutEnd":"InEnd"))),l&&l(),Nt=!1};if(!p||!s||void 0===s.x)return Me("initialZoom"+(i?"Out":"In")),x=t.initialZoomLevel,Pe(de,t.initialPosition),Ee(),e.style.opacity=i?0:1,Te(1),void(p?setTimeout(function(){f()},p):f());d=c,m=!a.currItem.src||a.currItem.loadError||r.showHideOpacity,t.miniImg&&(t.miniImg.style.webkitBackfaceVisibility="hidden"),i||(x=s.w/t.w,de.x=s.x,de.y=s.y-P,a[m?"template":"bg"].style.opacity=.001,Ee()),Ke("initialZoom"),i&&!d&&o.removeClass(e,"pswp--animated-in"),m&&(i?o[(d?"remove":"add")+"Class"](e,"pswp--animate_opacity"):setTimeout(function(){o.addClass(e,"pswp--animate_opacity")},30)),Lt=setTimeout(function(){if(Me("initialZoom"+(i?"Out":"In")),i){var n=s.w/t.w,a=de.x,r=de.y,l=x,c=re,u=function(t){1===t?(x=n,de.x=s.x,de.y=s.y-L):(x=(n-l)*t+l,de.x=(s.x-a)*t+a,de.y=(s.y-L-r)*t+r),Ee(),m?e.style.opacity=1-t:Te(c-t*c)};d?$e("initialZoom",0,1,p,o.easing.cubic.out,u,f):(u(1),Lt=setTimeout(f,p+20))}else x=t.initialZoomLevel,Pe(de,t.initialPosition),Ee(),Te(1),m?e.style.opacity=1:Te(1),Lt=setTimeout(f,p+20)},i?25:90)},Bt={},Gt=[],Ht={index:0,errorMsg:'<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',forceProgressiveLoading:!1,preload:[1,1],getNumItemsFn:function(){return zt.length}},Xt=function(e,t,n){if(e.src&&!e.loadError){var i=!n;if(i&&(e.vGap||(e.vGap={top:0,bottom:0}),Me("parseVerticalMargin",e)),Bt.x=t.x,Bt.y=t.y-e.vGap.top-e.vGap.bottom,i){var o=Bt.x/e.w,a=Bt.y/e.h;e.fitRatio=o<a?o:a;var l=r.scaleMode;"orig"===l?n=1:"fit"===l&&(n=e.fitRatio),n>1&&(n=1),e.initialZoomLevel=n,e.bounds||(e.bounds={center:{x:0,y:0},max:{x:0,y:0},min:{x:0,y:0}})}if(!n)return;return s=e,c=e.w*n,u=e.h*n,(d=s.bounds).center.x=Math.round((Bt.x-c)/2),d.center.y=Math.round((Bt.y-u)/2)+s.vGap.top,d.max.x=c>Bt.x?Math.round(Bt.x-c):d.center.x,d.max.y=u>Bt.y?Math.round(Bt.y-u)+s.vGap.top:d.center.y,d.min.x=c>Bt.x?0:d.center.x,d.min.y=u>Bt.y?s.vGap.top:d.center.y,i&&n===e.initialZoomLevel&&(e.initialPosition=e.bounds.center),e.bounds}return e.w=e.h=0,e.initialZoomLevel=e.fitRatio=1,e.bounds={center:{x:0,y:0},max:{x:0,y:0},min:{x:0,y:0}},e.initialPosition=e.bounds.center,e.bounds;var s,c,u,d},Vt=function(e,t,n,i,o,r){t.loadError||i&&(t.imageAppended=!0,$t(t,i,t===a.currItem&&we),n.appendChild(i),r&&setTimeout(function(){t&&t.loaded&&t.placeholder&&(t.placeholder.style.display="none",t.placeholder=null)},500))},Kt=function(e){e.loading=!0,e.loaded=!1;var t=e.img=o.createEl("pswp__img","img"),n=function(){e.loading=!1,e.loaded=!0,e.loadComplete?e.loadComplete(e):e.img=null,t.onload=t.onerror=null,t=null};return t.onload=n,t.onerror=function(){e.loadError=!0,n()},t.src=e.src,t},qt=function(e,t){if(e.src&&e.loadError&&e.container)return t&&(e.container.innerHTML=""),e.container.innerHTML=r.errorMsg.replace("%url%",e.src),!0},$t=function(e,t,n){if(e.src){t||(t=e.container.lastChild);var i=n?e.w:Math.round(e.w*e.fitRatio),o=n?e.h:Math.round(e.h*e.fitRatio);e.placeholder&&!e.loaded&&(e.placeholder.style.width=i+"px",e.placeholder.style.height=o+"px"),t.style.width=i+"px",t.style.height=o+"px"}},jt=function(){if(Gt.length){for(var e,t=0;t<Gt.length;t++)(e=Gt[t]).holder.index===e.index&&Vt(e.index,e.item,e.baseDiv,e.img,0,e.clearPlaceholder);Gt=[]}};be("Controller",{publicMethods:{lazyLoadItem:function(e){e=Ie(e);var t=Ut(e);t&&(!t.loaded&&!t.loading||b)&&(Me("gettingData",e,t),t.src&&Kt(t))},initController:function(){o.extend(r,Ht,!0),a.items=zt=n,Ut=a.getItemAt,Yt=r.getNumItemsFn,r.loop,Yt()<3&&(r.loop=!1),De("beforeChange",function(e){var t,n=r.preload,i=null===e||e>=0,o=Math.min(n[0],Yt()),l=Math.min(n[1],Yt());for(t=1;t<=(i?l:o);t++)a.lazyLoadItem(u+t);for(t=1;t<=(i?o:l);t++)a.lazyLoadItem(u-t)}),De("initialLayout",function(){a.currItem.initialLayout=r.getThumbBoundsFn&&r.getThumbBoundsFn(u)}),De("mainScrollAnimComplete",jt),De("initialZoomInEnd",jt),De("destroy",function(){for(var e,t=0;t<zt.length;t++)(e=zt[t]).container&&(e.container=null),e.placeholder&&(e.placeholder=null),e.img&&(e.img=null),e.preloader&&(e.preloader=null),e.loadError&&(e.loaded=e.loadError=!1);Gt=null})},getItemAt:function(e){return e>=0&&void 0!==zt[e]&&zt[e]},allowProgressiveImg:function(){return r.forceProgressiveLoading||!O||r.mouseUsed||screen.width>1200},setContent:function(e,t){r.loop&&(t=Ie(t));var n=a.getItemAt(e.index);n&&(n.container=null);var i,s=a.getItemAt(t);if(s){Me("gettingData",t,s),e.index=t,e.item=s;var c=s.container=o.createEl("pswp__zoom-wrap");if(!s.src&&s.html&&(s.html.tagName?c.appendChild(s.html):c.innerHTML=s.html),qt(s),Xt(s,me),!s.src||s.loadError||s.loaded)s.src&&!s.loadError&&((i=o.createEl("pswp__img","img")).style.opacity=1,i.src=s.src,$t(s,i),Vt(0,s,c,i));else{if(s.loadComplete=function(n){if(l){if(e&&e.index===t){if(qt(n,!0))return n.loadComplete=n.img=null,Xt(n,me),Oe(n),void(e.index===u&&a.updateCurrZoomItem());n.imageAppended?!Nt&&n.placeholder&&(n.placeholder.style.display="none",n.placeholder=null):z.transform&&(ne||Nt)?Gt.push({item:n,baseDiv:c,img:n.img,index:t,holder:e,clearPlaceholder:!0}):Vt(0,n,c,n.img,0,!0)}n.loadComplete=null,n.img=null,Me("imageLoadComplete",t,n)}},o.features.transform){var d="pswp__img pswp__img--placeholder";d+=s.msrc?"":" pswp__img--placeholder--blank";var m=o.createEl(d,s.msrc?"img":"");s.msrc&&(m.src=s.msrc),$t(s,m),c.appendChild(m),s.placeholder=m}s.loading||Kt(s),a.allowProgressiveImg()&&(!_t&&z.transform?Gt.push({item:s,baseDiv:c,img:s.img,index:t,holder:e}):Vt(0,s,c,s.img,0,!0))}_t||t!==u?Oe(s):(te=c.style,Wt(s,i||s.img)),e.el.innerHTML="",e.el.appendChild(c)}else e.el.innerHTML=""},cleanSlide:function(e){e.img&&(e.img.onload=e.img.onerror=null),e.loaded=e.loading=e.img=e.imageAppended=!1}}});var Jt,Qt,en={},tn=function(e,t,n){var i=document.createEvent("CustomEvent"),o={origEvent:e,target:e.target,releasePoint:t,pointerType:n||"touch"};i.initCustomEvent("pswpTap",!0,!0,o),e.target.dispatchEvent(i)};be("Tap",{publicMethods:{initTap:function(){De("firstTouchStart",a.onTapStart),De("touchRelease",a.onTapRelease),De("destroy",function(){en={},Jt=null})},onTapStart:function(e){e.length>1&&(clearTimeout(Jt),Jt=null)},onTapRelease:function(e,t){var n,i;if(t&&!K&&!X&&!Xe){var a=t;if(Jt&&(clearTimeout(Jt),Jt=null,n=a,i=en,Math.abs(n.x-i.x)<25&&Math.abs(n.y-i.y)<25))return void Me("doubleTap",a);if("mouse"===t.type)return void tn(e,t,"mouse");if("BUTTON"===e.target.tagName.toUpperCase()||o.hasClass(e.target,"pswp__single-tap"))return void tn(e,t);Pe(en,a),Jt=setTimeout(function(){tn(e,t),Jt=null},300)}}}}),be("DesktopZoom",{publicMethods:{initDesktopZoom:function(){F||(O?De("mouseUsed",function(){a.setupDesktopZoom()}):a.setupDesktopZoom(!0))},setupDesktopZoom:function(t){Qt={};var n="wheel mousewheel DOMMouseScroll";De("bindEvents",function(){o.bind(e,n,a.handleMouseWheel)}),De("unbindEvents",function(){Qt&&o.unbind(e,n,a.handleMouseWheel)}),a.mouseZoomedIn=!1;var i,r=function(){a.mouseZoomedIn&&(o.removeClass(e,"pswp--zoomed-in"),a.mouseZoomedIn=!1),x<1?o.addClass(e,"pswp--zoom-allowed"):o.removeClass(e,"pswp--zoom-allowed"),l()},l=function(){i&&(o.removeClass(e,"pswp--dragging"),i=!1)};De("resize",r),De("afterChange",r),De("pointerDown",function(){a.mouseZoomedIn&&(i=!0,o.addClass(e,"pswp--dragging"))}),De("pointerUp",l),t||r()},handleMouseWheel:function(e){if(x<=a.currItem.fitRatio)return r.modal&&(!r.closeOnScroll||Xe||H?e.preventDefault():A&&Math.abs(e.deltaY)>2&&(c=!0,a.close())),!0;if(e.stopPropagation(),Qt.x=0,"deltaX"in e)1===e.deltaMode?(Qt.x=18*e.deltaX,Qt.y=18*e.deltaY):(Qt.x=e.deltaX,Qt.y=e.deltaY);else if("wheelDelta"in e)e.wheelDeltaX&&(Qt.x=-.16*e.wheelDeltaX),e.wheelDeltaY?Qt.y=-.16*e.wheelDeltaY:Qt.y=-.16*e.wheelDelta;else{if(!("detail"in e))return;Qt.y=e.detail}_e(x,!0);var t=de.x-Qt.x,n=de.y-Qt.y;(r.modal||t<=ee.min.x&&t>=ee.max.x&&n<=ee.min.y&&n>=ee.max.y)&&e.preventDefault(),a.panTo(t,n)},toggleDesktopZoom:function(t){t=t||{x:me.x/2+fe.x,y:me.y/2+fe.y};var n=r.getDoubleTapZoom(!0,a.currItem),i=x===n;a.mouseZoomedIn=!i,a.zoomTo(i?a.currItem.initialZoomLevel:n,t,333),o[(i?"remove":"add")+"Class"](e,"pswp--zoomed-in")}}}),o.extend(a,je)}});

/*! PhotoSwipe Default UI - 4.1.2 - 2017-04-05
* http://photoswipe.com
* Copyright (c) 2017 Dmitry Semenov; */
!function(a,b){"function"==typeof define&&define.amd?define(b):"object"==typeof exports?module.exports=b():a.PhotoSwipeUI_Default=b()}(this,function(){"use strict";var a=function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v=this,w=!1,x=!0,y=!0,z={barsSize:{top:44,bottom:"auto"},closeElClasses:["item","caption","zoom-wrap","ui","top-bar"],timeToIdle:4e3,timeToIdleOutside:1e3,loadingIndicatorDelay:1e3,addCaptionHTMLFn:function(a,b){return a.title?(b.children[0].innerHTML=a.title,!0):(b.children[0].innerHTML="",!1)},closeEl:!0,captionEl:!0,fullscreenEl:!0,zoomEl:!0,shareEl:!0,counterEl:!0,arrowEl:!0,preloaderEl:!0,tapToClose:!1,tapToToggleControls:!0,clickToCloseNonZoomable:!0,shareButtons:[{id:"facebook",label:"Share on Facebook",url:"https://www.facebook.com/sharer/sharer.php?u={{url}}"},{id:"twitter",label:"Tweet",url:"https://twitter.com/intent/tweet?text={{text}}&url={{url}}"},{id:"pinterest",label:"Pin it",url:"http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"},{id:"download",label:"Download image",url:"{{raw_image_url}}",download:!0}],getImageURLForShare:function(){return a.currItem.src||""},getPageURLForShare:function(){return window.location.href},getTextForShare:function(){return a.currItem.title||""},indexIndicatorSep:" / ",fitControlsWidth:1200},A=function(a){if(r)return!0;a=a||window.event,q.timeToIdle&&q.mouseUsed&&!k&&K();for(var c,d,e=a.target||a.srcElement,f=e.getAttribute("class")||"",g=0;g<S.length;g++)c=S[g],c.onTap&&f.indexOf("pswp__"+c.name)>-1&&(c.onTap(),d=!0);if(d){a.stopPropagation&&a.stopPropagation(),r=!0;var h=b.features.isOldAndroid?600:30;s=setTimeout(function(){r=!1},h)}},B=function(){return!a.likelyTouchDevice||q.mouseUsed||screen.width>q.fitControlsWidth},C=function(a,c,d){b[(d?"add":"remove")+"Class"](a,"pswp__"+c)},D=function(){var a=1===q.getNumItemsFn();a!==p&&(C(d,"ui--one-slide",a),p=a)},E=function(){C(i,"share-modal--hidden",y)},F=function(){return y=!y,y?(b.removeClass(i,"pswp__share-modal--fade-in"),setTimeout(function(){y&&E()},300)):(E(),setTimeout(function(){y||b.addClass(i,"pswp__share-modal--fade-in")},30)),y||H(),!1},G=function(b){b=b||window.event;var c=b.target||b.srcElement;return a.shout("shareLinkClick",b,c),!!c.href&&(!!c.hasAttribute("download")||(window.open(c.href,"pswp_share","scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left="+(window.screen?Math.round(screen.width/2-275):100)),y||F(),!1))},H=function(){for(var a,b,c,d,e,f="",g=0;g<q.shareButtons.length;g++)a=q.shareButtons[g],c=q.getImageURLForShare(a),d=q.getPageURLForShare(a),e=q.getTextForShare(a),b=a.url.replace("{{url}}",encodeURIComponent(d)).replace("{{image_url}}",encodeURIComponent(c)).replace("{{raw_image_url}}",c).replace("{{text}}",encodeURIComponent(e)),f+='<a href="'+b+'" target="_blank" class="pswp__share--'+a.id+'"'+(a.download?"download":"")+">"+a.label+"</a>",q.parseShareButtonOut&&(f=q.parseShareButtonOut(a,f));i.children[0].innerHTML=f,i.children[0].onclick=G},I=function(a){for(var c=0;c<q.closeElClasses.length;c++)if(b.hasClass(a,"pswp__"+q.closeElClasses[c]))return!0},J=0,K=function(){clearTimeout(u),J=0,k&&v.setIdle(!1)},L=function(a){a=a?a:window.event;var b=a.relatedTarget||a.toElement;b&&"HTML"!==b.nodeName||(clearTimeout(u),u=setTimeout(function(){v.setIdle(!0)},q.timeToIdleOutside))},M=function(){q.fullscreenEl&&!b.features.isOldAndroid&&(c||(c=v.getFullscreenAPI()),c?(b.bind(document,c.eventK,v.updateFullscreen),v.updateFullscreen(),b.addClass(a.template,"pswp--supports-fs")):b.removeClass(a.template,"pswp--supports-fs"))},N=function(){q.preloaderEl&&(O(!0),l("beforeChange",function(){clearTimeout(o),o=setTimeout(function(){a.currItem&&a.currItem.loading?(!a.allowProgressiveImg()||a.currItem.img&&!a.currItem.img.naturalWidth)&&O(!1):O(!0)},q.loadingIndicatorDelay)}),l("imageLoadComplete",function(b,c){a.currItem===c&&O(!0)}))},O=function(a){n!==a&&(C(m,"preloader--active",!a),n=a)},P=function(a){var c=a.vGap;if(B()){var g=q.barsSize;if(q.captionEl&&"auto"===g.bottom)if(f||(f=b.createEl("pswp__caption pswp__caption--fake"),f.appendChild(b.createEl("pswp__caption__center")),d.insertBefore(f,e),b.addClass(d,"pswp__ui--fit")),q.addCaptionHTMLFn(a,f,!0)){var h=f.clientHeight;c.bottom=parseInt(h,10)||44}else c.bottom=g.top;else c.bottom="auto"===g.bottom?0:g.bottom;c.top=g.top}else c.top=c.bottom=0},Q=function(){q.timeToIdle&&l("mouseUsed",function(){b.bind(document,"mousemove",K),b.bind(document,"mouseout",L),t=setInterval(function(){J++,2===J&&v.setIdle(!0)},q.timeToIdle/2)})},R=function(){l("onVerticalDrag",function(a){x&&a<.95?v.hideControls():!x&&a>=.95&&v.showControls()});var a;l("onPinchClose",function(b){x&&b<.9?(v.hideControls(),a=!0):a&&!x&&b>.9&&v.showControls()}),l("zoomGestureEnded",function(){a=!1,a&&!x&&v.showControls()})},S=[{name:"caption",option:"captionEl",onInit:function(a){e=a}},{name:"share-modal",option:"shareEl",onInit:function(a){i=a},onTap:function(){F()}},{name:"button--share",option:"shareEl",onInit:function(a){h=a},onTap:function(){F()}},{name:"button--zoom",option:"zoomEl",onTap:a.toggleDesktopZoom},{name:"counter",option:"counterEl",onInit:function(a){g=a}},{name:"button--close",option:"closeEl",onTap:a.close},{name:"button--arrow--left",option:"arrowEl",onTap:a.prev},{name:"button--arrow--right",option:"arrowEl",onTap:a.next},{name:"button--fs",option:"fullscreenEl",onTap:function(){c.isFullscreen()?c.exit():c.enter()}},{name:"preloader",option:"preloaderEl",onInit:function(a){m=a}}],T=function(){var a,c,e,f=function(d){if(d)for(var f=d.length,g=0;g<f;g++){a=d[g],c=a.className;for(var h=0;h<S.length;h++)e=S[h],c.indexOf("pswp__"+e.name)>-1&&(q[e.option]?(b.removeClass(a,"pswp__element--disabled"),e.onInit&&e.onInit(a)):b.addClass(a,"pswp__element--disabled"))}};f(d.children);var g=b.getChildByClass(d,"pswp__top-bar");g&&f(g.children)};v.init=function(){b.extend(a.options,z,!0),q=a.options,d=b.getChildByClass(a.scrollWrap,"pswp__ui"),l=a.listen,R(),l("beforeChange",v.update),l("doubleTap",function(b){var c=a.currItem.initialZoomLevel;a.getZoomLevel()!==c?a.zoomTo(c,b,333):a.zoomTo(q.getDoubleTapZoom(!1,a.currItem),b,333)}),l("preventDragEvent",function(a,b,c){var d=a.target||a.srcElement;d&&d.getAttribute("class")&&a.type.indexOf("mouse")>-1&&(d.getAttribute("class").indexOf("__caption")>0||/(SMALL|STRONG|EM)/i.test(d.tagName))&&(c.prevent=!1)}),l("bindEvents",function(){b.bind(d,"pswpTap click",A),b.bind(a.scrollWrap,"pswpTap",v.onGlobalTap),a.likelyTouchDevice||b.bind(a.scrollWrap,"mouseover",v.onMouseOver)}),l("unbindEvents",function(){y||F(),t&&clearInterval(t),b.unbind(document,"mouseout",L),b.unbind(document,"mousemove",K),b.unbind(d,"pswpTap click",A),b.unbind(a.scrollWrap,"pswpTap",v.onGlobalTap),b.unbind(a.scrollWrap,"mouseover",v.onMouseOver),c&&(b.unbind(document,c.eventK,v.updateFullscreen),c.isFullscreen()&&(q.hideAnimationDuration=0,c.exit()),c=null)}),l("destroy",function(){q.captionEl&&(f&&d.removeChild(f),b.removeClass(e,"pswp__caption--empty")),i&&(i.children[0].onclick=null),b.removeClass(d,"pswp__ui--over-close"),b.addClass(d,"pswp__ui--hidden"),v.setIdle(!1)}),q.showAnimationDuration||b.removeClass(d,"pswp__ui--hidden"),l("initialZoomIn",function(){q.showAnimationDuration&&b.removeClass(d,"pswp__ui--hidden")}),l("initialZoomOut",function(){b.addClass(d,"pswp__ui--hidden")}),l("parseVerticalMargin",P),T(),q.shareEl&&h&&i&&(y=!0),D(),Q(),M(),N()},v.setIdle=function(a){k=a,C(d,"ui--idle",a)},v.update=function(){x&&a.currItem?(v.updateIndexIndicator(),q.captionEl&&(q.addCaptionHTMLFn(a.currItem,e),C(e,"caption--empty",!a.currItem.title)),w=!0):w=!1,y||F(),D()},v.updateFullscreen=function(d){d&&setTimeout(function(){a.setScrollOffset(0,b.getScrollY())},50),b[(c.isFullscreen()?"add":"remove")+"Class"](a.template,"pswp--fs")},v.updateIndexIndicator=function(){q.counterEl&&(g.innerHTML=a.getCurrentIndex()+1+q.indexIndicatorSep+q.getNumItemsFn())},v.onGlobalTap=function(c){c=c||window.event;var d=c.target||c.srcElement;if(!r)if(c.detail&&"mouse"===c.detail.pointerType){if(I(d))return void a.close();b.hasClass(d,"pswp__img")&&(1===a.getZoomLevel()&&a.getZoomLevel()<=a.currItem.fitRatio?q.clickToCloseNonZoomable&&a.close():a.toggleDesktopZoom(c.detail.releasePoint))}else if(q.tapToToggleControls&&(x?v.hideControls():v.showControls()),q.tapToClose&&(b.hasClass(d,"pswp__img")||I(d)))return void a.close()},v.onMouseOver=function(a){a=a||window.event;var b=a.target||a.srcElement;C(d,"ui--over-close",I(b))},v.hideControls=function(){b.addClass(d,"pswp__ui--hidden"),x=!1},v.showControls=function(){x=!0,w||v.update(),b.removeClass(d,"pswp__ui--hidden")},v.supportsFullscreen=function(){var a=document;return!!(a.exitFullscreen||a.mozCancelFullScreen||a.webkitExitFullscreen||a.msExitFullscreen)},v.getFullscreenAPI=function(){var b,c=document.documentElement,d="fullscreenchange";return c.requestFullscreen?b={enterK:"requestFullscreen",exitK:"exitFullscreen",elementK:"fullscreenElement",eventK:d}:c.mozRequestFullScreen?b={enterK:"mozRequestFullScreen",exitK:"mozCancelFullScreen",elementK:"mozFullScreenElement",eventK:"moz"+d}:c.webkitRequestFullscreen?b={enterK:"webkitRequestFullscreen",exitK:"webkitExitFullscreen",elementK:"webkitFullscreenElement",eventK:"webkit"+d}:c.msRequestFullscreen&&(b={enterK:"msRequestFullscreen",exitK:"msExitFullscreen",elementK:"msFullscreenElement",eventK:"MSFullscreenChange"}),b&&(b.enter=function(){return j=q.closeOnScroll,q.closeOnScroll=!1,"webkitRequestFullscreen"!==this.enterK?a.template[this.enterK]():void a.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT)},b.exit=function(){return q.closeOnScroll=j,document[this.exitK]()},b.isFullscreen=function(){return document[this.elementK]}),b}};return a});

/*! photoswipe-acenda.js */
$('html').on("click", ".active .slick-heroic .img-fluid", function() {
	var match = $(this).attr('src');
	fixSizes();
	$('#product-images .active.variation .ztrig img[src=\''+match+'\']').click();
});

$('html').on("click", ".easyzoom-flyout img", function() {
    var match = $(this).attr('src');
    fixSizes();
    $('#product-images .active.variation .ztrig[data-href=\''+match+'\'] img').click();
});


function fixSizes() {
    $('.active .ztrig').each(function() {
        var fact = 2.5; // 1500 / 600
        var i = $(this).find('img');
        var w = i.width();
        var h = i.height();
        var f = parseFloat(w / h).toFixed(0);
        var neww = parseFloat(fact * w).toFixed(0);
        var newh = parseFloat(fact * h).toFixed(0);
        $(this).attr('data-size',neww+'x'+newh).attr('data-med-size',w+'x'+h);
    });
}

function slickMatchZoom(a) {
    $('.slick-heroic,.slick-heroic-nav').slick('slickGoTo',parseInt(a-1));
}
//
var initPhotoSwipeFromDOM = function(gallerySelector) {
	function getParents(el, parentSelector /* optional */) {
		// If no parentSelector defined will bubble up all the way to *document*
		if (parentSelector === undefined) {
			parentSelector = document;
		}

		var parents = [];
		var p = el.parentNode;

		while (p !== parentSelector) {
			var o = p;
			parents.push(o);
			p = o.parentNode;
		}
		parents.push(parentSelector); // Push that parentSelector you wanted to stop at

		return parents;
	}

	var parseThumbnailElements = function(el) {
		var thumbElements = $(el).find('.ztrig'),//el.childNodes,
			numNodes = thumbElements.length,
			items = [],
			el,
			childElements,
			thumbnailEl,
			size,
			item;

		for(var i = 0; i < numNodes; i++) {
			el = thumbElements[i];

			// include only element nodes 
			if(el.nodeType !== 1) {
			  continue;
			}

			childElements = el.children;

			size = el.getAttribute('data-size').split('x');

			// create slide object
			item = {
				src: el.getAttribute('data-href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10),
				author: el.getAttribute('data-author')
			};

			item.el = el; // save link to element for getThumbBoundsFn

			if(childElements.length > 0) {
			  item.msrc = childElements[0].getAttribute('src'); // thumbnail url
			  if(childElements.length > 1) {
				  item.title = childElements[1].innerHTML; // caption (contents of figure)
			  }
			}


			var mediumSrc = el.getAttribute('data-med');
			if(mediumSrc) {
				size = el.getAttribute('data-med-size').split('x');
				// "medium-sized" image
				item.m = {
					src: mediumSrc,
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};
			}
			// original image
			item.o = {
				src: item.src,
				w: item.w,
				h: item.h
			};

			items.push(item);
		}
		return items;
	};

	// find nearest parent element
	var closest = function closest(el, fn) {
		return el && ( fn(el) ? el : closest(el.parentNode, fn) );
	};

	var onThumbnailsClick = function(e) {
		var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

		if (w > 0) {
			e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;

			var eTarget = e.target || e.srcElement;
			
			var clickedListItem = $(e.target).parents('.ztrig');
			
			if(!clickedListItem || $(e.target).is('.bgv')) {
				return;
			}

			var clickedGallery = $(e.target).parents('.variation');
			
			if(!clickedGallery) {
				return;
			}

			var childNodes = $(clickedListItem).parents('.variation').find('.ztrig'),
				numChildNodes = childNodes.length,
				nodeIndex = 0,
				index;

			for (var i = 0; i < numChildNodes; i++) {
				if(childNodes[i].nodeType !== 1) { 
					continue; 
				}
					
				if($(childNodes[i]).attr('id') == $(clickedListItem).attr('id')) {
					index = nodeIndex;
					break;
				}
				nodeIndex++;
			}

			if(index >= 0) {
				openPhotoSwipe( index, clickedGallery );
			} else {

			}
			return false;
		}
	};

	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
		params = {};

		if(hash.length < 5) { // pid=1
			return params;
		}

		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if(!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');  
			if(pair.length < 2) {
				continue;
			}           
			params[pair[0]] = pair[1];
		}

		if(params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		return params;
	};

	var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
		var pswpElement = document.querySelectorAll('.pswp')[0],
			gallery,
			options,
			items;

		items = parseThumbnailElements(galleryElement);

		// define options (if needed)
		options = {

			captionEl: false,
			tapToClose: true,
			getThumbBoundsFn: function(index) {
				// See Options->getThumbBoundsFn section of docs for more info
				var thumbnail = items[index].el.children[0],
					pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					rect = thumbnail.getBoundingClientRect(); 

				return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
			}

		};


		if(fromURL) {
			if(options.galleryPIDs) {
				// parse real index when custom PIDs are used 
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
				for(var j = 0; j < items.length; j++) {
					if(items[j].pid == index) {
						options.index = j;
						break;
					}
				}
			} else {
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}

		// exit if index not found
		if( isNaN(options.index) ) {
			return;
		}



		var radios = document.getElementsByName('gallery-style');
		for (var i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
				if(radios[i].id == 'radio-all-controls') {

				} else if(radios[i].id == 'radio-minimal-black') {
					options.mainClass = 'pswp--minimal--dark';
					options.barsSize = {top:0,bottom:0};
					options.captionEl = false;
					options.fullscreenEl = false;
					options.shareEl = false;
					options.bgOpacity = 0.85;
					options.tapToClose = true;
					options.tapToToggleControls = false;
				}
				break;
			}
		}

		if(disableAnimation) {
			options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

		// see: http://photoswipe.com/documentation/responsive-images.html
		var realViewportWidth,
			useLargeImages = false,
			firstResize = true,
			imageSrcWillChange;

		gallery.listen('beforeResize', function() {

			var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
			dpiRatio = Math.min(dpiRatio, 2.5);
			realViewportWidth = gallery.viewportSize.x * dpiRatio;


			if(realViewportWidth >= 1200 || (/*!gallery.likelyTouchDevice &&*/ realViewportWidth > 800) || screen.width > 1200 ) {
				if(!useLargeImages) {
					useLargeImages = true;
					imageSrcWillChange = true;
				}
				
			} else {
				if(useLargeImages) {
					useLargeImages = false;
					imageSrcWillChange = true;
				}
			}

			if(imageSrcWillChange && !firstResize) {
				gallery.invalidateCurrItems();
			}

			if(firstResize) {
				firstResize = false;
			}

			imageSrcWillChange = false;

		});

		gallery.listen('gettingData', function(index, item) {
			if( useLargeImages ) {
				item.src = item.o.src;
				item.w = item.o.w;
				item.h = item.o.h;
			} else {
				item.src = item.m.src;
				item.w = item.m.w;
				item.h = item.m.h;
			}
		});

		gallery.init();
	};

	// select all gallery elements
	var galleryElements = document.querySelectorAll( gallerySelector );
	for(var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute('data-pswp-uid', i+1);
		galleryElements[i].onclick = onThumbnailsClick;
	}

	// Parse URL and open gallery if it contains #&pid=3&gid=1
	var hashData = photoswipeParseHash();
	if(hashData.pid && hashData.gid) {
		openPhotoSwipe( hashData.pid,  galleryElements[ hashData.gid - 1 ], true, true );
	}
};

initPhotoSwipeFromDOM('#product-images');