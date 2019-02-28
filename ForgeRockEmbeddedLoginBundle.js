(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ForgeRockEmbeddedLogin = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";(function(){"use strict";let a=(a,b)=>a.reduce((a,c)=>a||c.name===b&&c,!1),b=function(a){return this.authenticateUrl=a.authenticateUrl,this.successHandler=a.successHandler,this.failureHandler=a.failureHandler,this.loginElement=a.loginElement,this};b.prototype.handleCallbackResponse=function(){return this.success()&&this.successHandler?this.successHandler():this.failure()&&this.failureHandler?this.failureHandler():this.renderAllCallbacks().then(a=>this.renderHandler(a)),this},b.prototype.startLogin=function(){return this.currentCallbacks={},this.submitCallbacks()},b.prototype.success=function(){return!!this.currentCallbacks.tokenId},b.prototype.failure=function(){return"undefined"==typeof this.currentCallbacks.authId&&401===this.currentCallbacks.code},b.prototype.renderHandler=function(a){if(this.loginElement){let b=this.loginElement.cloneNode(!1);this.loginElement.parentNode.replaceChild(b,this.loginElement),this.loginElement=b,this.loginElement.appendChild(a);let c=this.loginElement.getElementsByTagName("form")[0];c.onsubmit=this.handleLoginSubmit.bind(this)}return this},b.prototype.renderAllCallbacks=function(){var a=!this.currentCallbacks.callbacks.reduce((a,b)=>a||-1!==["ConfirmationCallback","PollingWaitCallback","RedirectCallback"].indexOf(b.type),!1),b={input:{index:this.currentCallbacks.callbacks.length,name:"loginButton",value:0},output:[{name:"options",value:[this.getLoginButtonText()]}],type:"ConfirmationCallback"};return Promise.all((a?this.currentCallbacks.callbacks.concat(b):this.currentCallbacks.callbacks).map((a,b)=>this.renderCallback(a,b))).then(this.joinRenderedCallbacks)},b.prototype.getLoginButtonText=function(){return"Login"},b.prototype.handleLoginSubmit=function(a){a.preventDefault();var b=!0,c=!1,d=void 0;try{for(var e,f,g=new FormData(a.currentTarget)[Symbol.iterator]();!(b=(e=g.next()).done);b=!0){f=e.value;let a=f[0].match(/^callback_(\d+)$/);a&&(this.currentCallbacks.callbacks[parseInt(a[1],10)].input[0].value=f[1])}}catch(a){c=!0,d=a}finally{try{b||null==g.return||g.return()}finally{if(c)throw d}}return this.submitCallbacks()},b.prototype.submitCallbacks=function(){return fetch(this.authenticateUrl,{mode:"cors",method:"POST",credentials:"include",headers:{"accept-api-version":"protocol=1.0,resource=2.1","content-type":"application/json"},body:JSON.stringify(this.currentCallbacks)}).then(a=>a.json()).then(a=>(this.currentCallbacks=a,this.currentCallbacks)).then(()=>this.handleCallbackResponse())},b.prototype.renderCallback=function(b,c){let d="",e=a(b.output,"prompt");switch(e&&e.value&&e.value.length&&(d=e.value.replace(/:$/,"")),b.type){case"NameCallback":return this.renderNameCallback(b,c,d);case"PasswordCallback":return this.renderPasswordCallback(b,c,d);case"TextInputCallback":return this.renderTextInputCallback(b,c,d);case"TextOutputCallback":var f=a(b.output,"messageType"),g=a(b.output,"message");return"4"===f.value?this.renderTextOutputScript(c,g.value):this.renderTextOutputMessage(c,g.value,{0:"INFORMATION",1:"WARNING",2:"ERROR"}[f.value]);case"ConfirmationCallback":var h=a(b.output,"options");if(h&&void 0!==h.value){let d=1<h.value.length?a(b.output,"defaultOption"):{value:0};return Promise.all(h.value.map((a,b)=>this.renderConfirmationCallbackOption(a,c,b,d&&d.value===b)))}return Promise.all([]);case"ChoiceCallback":var i=a(b.output,"choices");if(i&&void 0!==i.value){let a=i.value.map((a,c)=>({active:b.input.value===c,key:c,value:a}));return this.renderChoiceCallback(b,c,d,a)}return Promise.all([]);case"HiddenValueCallback":return this.renderHiddenValueCallback(b,c);case"RedirectCallback":var j=a(b.output,"redirectUrl"),k=a(b.output,"redirectMethod"),l=a(b.output,"redirectData"),m=document.createElement("form");m.action=j.value,m.method=k.value,l&&l.value&&l.value.forEach((a,b)=>{let c=document.createElement("input");c.type="hidden",c.name=b,c.value=a,m.appendChild(c)}),document.getElementsByTagName("body")[0].appendChild(m),m.submit();break;case"PollingWaitCallback":var n=a(b.output,"waitTime").value;return setTimeout(()=>{this.pollingInProgress=!0},n),this.renderPollingWaitCallback(b,c,a(b.output,"message").value);default:return this.renderUnknownCallback(b,c,d);}},b.prototype.joinRenderedCallbacks=function(a){let b=document.createElement("form");return a.reduce((a,b)=>a.concat(b),[]).forEach(a=>{b.appendChild(a),b.appendChild(document.createElement("br"))}),Promise.resolve(b)},b.prototype.renderNameCallback=function(a,b,c){let d=document.createElement("div");return d.innerHTML=`<input type="text" name="callback_${b}" value="${a.input[0].value}" placeholder="${c}">`,Promise.resolve(d.firstElementChild)},b.prototype.renderPasswordCallback=function(a,b,c){let d=document.createElement("div");return d.innerHTML=`<input type="password" name="callback_${b}" value="${a.input[0].value}" placeholder="${c}">`,Promise.resolve(d.firstElementChild)},b.prototype.renderTextInputCallback=function(a,b){let c=document.createElement("div");return c.innerHTML=`<textarea name="callback_${b}">${a.input[0].value}</textarea>`,Promise.resolve(c.firstElementChild)},b.prototype.renderTextOutputScript=function(a,b){let c=document.createElement("script");return c.innerHTML=b,Promise.resolve(c)},b.prototype.renderTextOutputMessage=function(a,b,c){let d=document.createElement("div");return d.innerHTML=`<div id="callback_${a}" class="${c}">${b}</div>`,Promise.resolve(d.firstElementChild)},b.prototype.renderConfirmationCallbackOption=function(a,b,c){let d=document.createElement("div");return d.innerHTML=`<input name="callback_${b}" type="submit" index="${c}" value="${a}">`,Promise.resolve(d.firstElementChild)},b.prototype.renderChoiceCallback=function(a,b,c,d){let e=document.createElement("div");return e.innerHTML=`<label for="callback_${b}" id="label_callback_${b}">${c}</label>
            <select name="callback_${b}" id="callback_${b}">
            ${d.map(a=>`<option value="${a.key}" ${a.active?"selected":""}>${a.value}</option>`)}
            </select>`,Promise.resolve(e.firstElementChild)},b.prototype.renderHiddenValueCallback=function(a,b){let c=document.createElement("div");return c.innerHTML=`<input type="hidden" id="${a.input.value}" aria-hidden="true" name="callback_${b}" value="" />`,Promise.resolve(c.firstElementChild)},b.prototype.renderPollingWaitCallback=function(a,b){let c=document.createElement("div");return c.innerHTML=`<input type="hidden" id="${a.input.value}" aria-hidden="true" name="callback_${b}" value="" />`,Promise.resolve(c.firstElementChild)},b.prototype.renderUnknownCallback=function(a,b,c){return this.renderNameCallback(a,b,c)},module.exports=b})();

},{}]},{},[1])(1)
});
