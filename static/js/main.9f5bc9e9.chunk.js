(this["webpackJsonpquintype-validator"]=this["webpackJsonpquintype-validator"]||[]).push([[0],{58:function(e,t,a){e.exports=a(90)},63:function(e,t,a){},64:function(e,t,a){},7:function(e,t,a){e.exports={migrator:"migrator_migrator__2neCI",heading:"migrator_heading__12-aT",content:"migrator_content__1qtIz",container:"migrator_container__dkj66","result-heading":"migrator_result-heading__2i9Ag","error-message":"migrator_error-message__3LAkm","error-metadata":"migrator_error-metadata__1nYcR","error-level":"migrator_error-level__fK7N_","error-list":"migrator_error-list__2qkwB","warning-list":"migrator_warning-list__MOLnC","success-list":"migrator_success-list__UhGH3"}},90:function(e,t,a){"use strict";a.r(t);var r=a(3),n=a(4),l=a(5),s=a(6),c=a(0),o=a.n(c),i=a(17),u=a.n(i),m=(a(63),a(21)),p=a(9),d=a(12),h=(a(64),a(46)),v=a.n(h),f=a(56),E=a(24),g=a.n(E),b=a(48),y=a.n(b),j=function(){return o.a.createElement("svg",{id:"Layer_1",width:"48",height:"48","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 40 40"},o.a.createElement("defs",null),o.a.createElement("path",{fill:"#fff",d:"M23.58,11.75a18.09,18.09,0,0,1,0,17.89Zm0,18.79a10.79,10.79,0,0,1-4.34.15c-2.62-.38-4.06-3.6-4.06-3.6l6.21-1.72v-16l2.19,2.23ZM14,20.91c0-3.16.22-7.12.22-7.12l2.18-.85V26.79L15,27.25A25.11,25.11,0,0,1,14,20.91Zm17.74,9.62-1.35,1.71a4.44,4.44,0,0,0-5.26-2s7-4.58,6.27-12.4A17,17,0,0,0,24.74,5.8c-.38-.24-5.52,5.64-10.84,7.14,0,0,.24-5.55,4.24-6V6.18S8,7.66,8,20.11c0,0,.39,10.85,10.79,11.31l4,.18s3.41-.18,4.1,4.75l.52.44,4.55-6Z"}))},O=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"submit",value:function(e){e.preventDefault(),this.props.onSubmit(this.props.url)}},{key:"importResult",value:function(e){var t=this;if(1===e.length){var a=new FileReader;a.onload=function(e){return t.props.onImport(JSON.parse(e.target.result))},a.readAsText(e[0])}}},{key:"render",value:function(){var e=this;return o.a.createElement(o.a.Fragment,null,o.a.createElement(f.a,{accept:"application/json",onDrop:function(t){return e.importResult(t)},className:"url-dropzone",acceptClassName:"url-dropzone-accept",rejectClassName:"url-dropzone-reject",disableClick:!0},o.a.createElement("form",{className:"url-container",onSubmit:function(t){return e.submit(t)}},o.a.createElement("input",{className:"url-input",value:this.props.url,placeholder:"Enter Url",onChange:function(t){return e.props.onChange(t.target.value)}}),o.a.createElement("input",{type:"submit",className:"url-go",value:"Go!"}))))}}]),a}(o.a.Component),k=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){return o.a.createElement("div",{className:"sidebar"},o.a.createElement("div",{className:"sidebar-container"},o.a.createElement(j,null)),o.a.createElement("div",{className:"menu"},o.a.createElement("div",{className:"menu__container"},o.a.createElement(m.c,{to:"/website",className:"navbar",activeClassName:"is-active"},o.a.createElement("div",{className:"menu__website logo"}))),o.a.createElement("div",{className:"menu__container"},o.a.createElement(m.c,{to:"/migrator",className:"navbar",activeClassName:"is-active"},o.a.createElement("div",{className:"menu__migrator logo"})))))}}]),a}(o.a.Component);var N=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={active:!1},n}return Object(n.a)(a,[{key:"render",value:function(){var e=this,t=this.props.result.errors||[],a=this.props.result.warnings||[],r=this.props.children||t.length>0||a.length>0;return o.a.createElement("section",{className:"result ".concat(this.state.active&&"active")},o.a.createElement("header",{className:"result-header ".concat(r&&"expandable"),onClick:function(){return r&&e.setState({active:!e.state.active})}},o.a.createElement("div",{className:"clearfix"},o.a.createElement("h2",{className:"result-title"},this.props.title),o.a.createElement("h3",{className:"result-status result-status-".concat(this.props.result.status," ").concat(a.length>0?"result-status-WARN":"")},this.props.result.status))),o.a.createElement("div",{className:"result-body"},this.props.children&&o.a.createElement("div",null,this.props.children),t.length>0&&o.a.createElement("div",null,o.a.createElement("h4",null,"Errors:"),o.a.createElement("ul",null,t.map((function(e,t){return o.a.createElement("li",{key:t},e)})))),a.length>0&&o.a.createElement("div",null,o.a.createElement("h4",null,"Warnings:"),o.a.createElement("ul",null,a.map((function(e,t){return o.a.createElement("li",{key:t},e)}))))))}}]),a}(o.a.Component);var w=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={active:!1},n}return Object(n.a)(a,[{key:"render",value:function(){var e=this;return o.a.createElement("section",{className:"result ".concat(this.state.active&&"active")},o.a.createElement("header",{className:"result-header expandable",onClick:function(){return e.setState({active:!e.state.active})}},o.a.createElement("div",{className:"clearfix"},o.a.createElement("h2",{className:"result-title"},"Debugging"))),o.a.createElement("div",{className:"result-body"},o.a.createElement("div",null,"For a full list of rules, please see"," ",o.a.createElement("a",{href:"https://github.com/quintype/quintype-validator",target:"_blank",rel:"noopener noreferrer"},"Readme.md")),o.a.createElement("div",null,o.a.createElement("table",null,o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",null,"Category"),o.a.createElement("th",null,"Key"),o.a.createElement("th",null,"Value"))),o.a.createElement("tbody",null,g()(this.props.results).entries().flatMap((function(e){var t=Object(d.a)(e,2),a=t[0],r=t[1];return g()(r.debug).entries().map((function(e){var t=Object(d.a)(e,2),r=t[0],n=t[1];return function(e,t,a){return o.a.createElement("tr",{key:"".concat(e,"/").concat(t)},o.a.createElement("td",null,e),o.a.createElement("td",{className:"debug-key"},t),o.a.createElement("td",null,a))}(a,r,n)})).value()})).value()))),this.props.links.length>0&&o.a.createElement("div",null,o.a.createElement("h4",null,"Links:"),o.a.createElement("ul",null,this.props.links.map((function(t,a){return o.a.createElement("li",{key:a},o.a.createElement("button",{onClick:function(){return e.props.onValidate(t)}},"validate")," ","- ",t)}))))))}}]),a}(o.a.Component),C=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){var e=this,t=function(t,a){return e.props.results[t]?o.a.createElement(N,{title:a,result:e.props.results[t]}):void 0};return o.a.createElement("div",{className:"results"},t("amp","AMP"),t("headers","Caching Headers"),this.props.results.structured?o.a.createElement(N,{title:"Structured Data",result:this.props.results.structured},o.a.createElement("div",null,"Number of Objects: ",this.props.results.structured.numObjects),o.a.createElement("div",null,"Content Id: ",this.props.results.structured.contentId)):void 0,t("og","Facebook OG Tags"),t("seo","SEO Rules"),t("robots","Robots"),t("pagespeed","PageSpeed"),t("lighthouseSeo","Lighthouse SEO"),t("lighthousePwa","PWA"),t("routeData","Route Data Size"),o.a.createElement(w,{results:this.props.results,links:this.props.links,onValidate:this.props.onValidate}),o.a.createElement("button",{className:"results-download",onClick:function(){return e.props.onDownload()}},"Download As JSON"))}}]),a}(o.a.Component),S=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={url:"",response:null,loading:!1,error:null},n}return Object(n.a)(a,[{key:"loadRules",value:function(e){var t=this;v.a.post("".concat("https://validator.quintype.com","/api/validate.json"),{url:e}).then((function(e){return t.setState({response:e.body,loading:!1,url:e.body.url})})).catch((function(e){return t.setState({loading:!1,error:e.message})}))}},{key:"processUrl",value:function(e){var t=this;this.state.loading||this.setState({url:e,loading:!0,error:null},(function(){return t.loadRules(e)}))}},{key:"downloadResponse",value:function(){var e=new Blob([JSON.stringify(this.state.response)],{type:"application/json;charset=utf-8"});y.a.saveAs(e,"validator.json")}},{key:"import",value:function(e){this.setState({response:e,error:null,loading:!1,url:e.url})}},{key:"render",value:function(){var e=this;return o.a.createElement("div",null,o.a.createElement("h1",{className:"website-heading"},"Quintype Validator"),o.a.createElement(O,{onSubmit:function(t){return e.processUrl(t)},url:this.state.url,onChange:function(t){return e.setState({url:t})},onImport:function(t){return e.import(t)}}),this.state.error&&o.a.createElement("div",{className:"error-message"},this.state.error),this.state.loading&&o.a.createElement("div",{className:"loading"},"Crunching Numbers"),!this.state.loading&&this.state.response&&o.a.createElement(C,{results:this.state.response.results,links:this.state.response.links,onValidate:function(t){return e.processUrl(t)},url:this.state.response.url,onDownload:function(){return e.downloadResponse()}}))}}]),a}(o.a.Component),_=a(7),x=a.n(_);function D(){return o.a.createElement("section",{className:x.a["migrator-heading"]},o.a.createElement("h1",{className:x.a.heading},"Migration Validator"),o.a.createElement("p",{className:x.a.content},"Migration Data Validator checks for the intermediate files for JSON schema errors, File type & encoding errors and mandatory errors and generates a report after the validation process is completed"))}var T=a(30),F=a(55);function P(e){var t=e.finalResult,a=t&&t.errors.map((function(e){return o.a.createElement("li",null,o.a.createElement("span",{className:x.a["error-message"]},e.message),e.metadata&&Object.values(e.metadata).map((function(e){return o.a.createElement("p",{className:x.a["error-metadata"]},e)})))})),r=t&&t.warnings.map((function(e){return o.a.createElement("li",null,o.a.createElement("span",{className:x.a["error-message"]},e.message),e.metadata&&Object.values(e.metadata).map((function(e){return o.a.createElement("p",{className:x.a["error-metadata"]},e)})))}));return o.a.createElement(o.a.Fragment,null,o.a.createElement("p",{className:x.a["result-heading"]},"Results"),t?o.a.createElement(T.a,null,o.a.createElement(T.b,{label:"Statistics"},o.a.createElement("p",null,t.total),o.a.createElement("p",null,t.successful),o.a.createElement("p",null,t.errorFile)),o.a.createElement(T.b,{label:"Details",children:o.a.createElement(o.a.Fragment,null,o.a.createElement("p",{className:x.a["error-level"]},"Errors"),o.a.createElement("ul",{className:x.a["error-list"]},a),o.a.createElement("p",{className:x.a["error-level"]},"Warnings"),o.a.createElement("ul",{className:x.a["warning-list"]},r))})):o.a.createElement(o.a.Fragment,null,o.a.createElement(F.a,null),o.a.createElement("p",{className:x.a.content},"Please wait, validation is in progress. This can take 5-10 minutes. Please don't close the tab.")))}var A=[{label:"Story",value:"Story"},{label:"Section",value:"Section"},{label:"Author",value:"Author"},{label:"Entity",value:"Entity"},{label:"Tag",value:"Tag"}],R=[{label:"Direct text input",value:"Direct text input"},{label:"File upload",value:"File upload"},{label:"S3 path",value:"S3 path"}];function q(e,t,a){var r,n=e.value,l=t.value,s={method:"POST",headers:{Accept:"application/json",keepalive:!0}};return"Direct text input"===n||"S3 path"===n?(s.headers["Content-Type"]="application/json",r=JSON.stringify({type:l,data:a})):((r=new FormData).append("type",l),r.append("file",a)),s.body=r,s}function V(e,t){var a={};return e&&(a.info="Affected count: ".concat(t.length,". Refer ").concat(e.toLowerCase()," with external-id '").concat(t[0],"'.")),a}function L(e){if(e.error)return{errorMessage:"Failed please retry after some time"};var t={},a=e.dataType,r=e.total,n=e.successful,l=e.additionalProperties,s=e.type,c=e.required,i=e.enum,u=e.minLength,m=e.maxLength,p=e.exceptions,h=e.minItems,v=e.uniqueKey,f=function(e){var t="data:application/octet-stream,error-type%2Cpath%2Clog-level%2Cexternal-id%0A",a=function(a){var r="additionalProperties"===a?"warning":"error";e[a]&&e[a].forEach((function(e){var n=function(e){switch(e){case"type":return"wrongType";case"required":return"requiredField";case"wrongEnumValue":return"wrongValue";case"uniqueKey":return"duplicateKey";default:return e}}(a);e.ids?e.ids.forEach((function(a){t="".concat(t).concat(n,"%2C").concat(e.key&&e.key.replace(/,/g,"/"),"%2C").concat(r,"%2C").concat(a,"%0A")})):t="".concat(t).concat(n,"%2C").concat(e.key&&e.key.replace(/,/g,"/"),"%2C").concat(r,"%2C' '%0A")}))};for(var r in e)a(r);return o.a.createElement("a",{href:t,download:"result-".concat(Date.now(),".csv")},"Get results")}({exceptions:p,additionalProperties:l,type:s,required:c,wrongEnumValue:i,minLength:u,maxLength:m,minItems:h,uniqueKey:v});t.errorFile=f,t.errors=[],t.warnings=[],t.successful=[];var E="Story"===a?"".concat(a.toLowerCase().slice(0,4),"ies"):"".concat(a.toLowerCase(),"s");return t.total="Total ".concat(E," read: ").concat(r||0),t.successful="".concat(n||0," out of ").concat(r||0," ").concat(E," are valid."),p&&p.forEach((function(e){var a={message:e.key};e.ids&&(a.metadata={example:e.ids.join(", ")}),t.errors.push(a)})),m&&m.forEach((function(e){var r=e.key.split(":"),n=Object(d.a)(r,2),l=n[0],s=n[1];t.errors.push({message:"".concat(a," should have maximum of ").concat(s," characters for property '").concat(l,"'."),metadata:V(a,e.ids)})})),u&&u.forEach((function(e){var r=e.key.split(":"),n=Object(d.a)(r,2),l=n[0],s=n[1];t.errors.push({message:"".concat(a," should have minimum of ").concat(s," character").concat(s>1?"s":""," for property '").concat(l,"'."),metadata:V(a,e.ids)})})),h&&h.forEach((function(e){var r=e.key.split(":"),n=Object(d.a)(r,2),l=n[0],s=n[1];t.errors.push({message:"".concat(a," should have minimum of ").concat(s," ").concat(s>1?l:l.slice(0,l.length-1),"."),metadata:V(a,e.ids)})})),v&&v.forEach((function(e){var r=e.key.split(":"),n=Object(d.a)(r,2),l=n[0],s=n[1];t.errors.push({message:"".concat(l," '").concat(s,"' is not unique."),metadata:V(a,e.ids)})})),c&&c.forEach((function(e){var r=e.key.split(":"),n=Object(d.a)(r,2),l=n[0],s=n[1];s=s===a?"":" in '".concat(s,"'."),t.errors.push({message:"".concat(a," should have required property '").concat(l,"' ").concat(s,"."),metadata:V(a,e.ids)})})),l&&l.forEach((function(e){var r=e.key.split(":"),n=Object(d.a)(r,2),l=n[0],s=n[1];s=s===a?"":" in '".concat(s,"'."),t.warnings.push({message:"".concat(a," has additional property '").concat(l,"' ").concat(s,"."),metadata:V(a,e.ids)})})),s&&s.forEach((function(e){var r=e.key.split(":"),n=Object(d.a)(r,2),l=n[0],s=n[1];t.errors.push({message:"".concat(a," has wrong type for property '").concat(l,"'. Expected '").concat(s,"'."),metadata:V(a,e.ids)})})),i&&i.forEach((function(e){var r=e.key.split(":"),n=Object(d.a)(r,2),l=n[0],s=n[1];t.errors.push({message:"".concat(a," has incorrect value for property '").concat(l,"'. Allowed values are '").concat(s.split(",").join(", "),"'."),metadata:V(a,e.ids)})})),t}function I(e){var t=e.result,a=t&&L(t);return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:x.a.migrator},o.a.createElement(D,null),o.a.createElement("div",{className:x.a.container},a.errorMessage?o.a.createElement("p",null,a.errorMessage):o.a.createElement(P,{finalResult:a}))))}var M=a(20),z=a.n(M),J=a(35),K=a(36),Q=a(37),U=a(57),W=a(38),B=a(52);function G(e){var t=e.validateType,a=e.onInput,r=e.userData;return t&&o.a.createElement(o.a.Fragment,null,function(){switch(t.value){case"Direct text input":return o.a.createElement(W.a,{label:"Enter the Markup to validate:",onChange:a,value:r,placeholder:"Enter the JSON data"});case"File upload":return o.a.createElement(B.a,{fieldLabel:"Upload File",placeholder:"Choose file (only *.txt.gz)",accepts:"application/x-gzip",size:3e6,uploadFile:a});case"S3 path":return o.a.createElement(W.a,{label:"Type url here",onChange:a,value:r,placeholder:"Enter S3 path"});default:return null}}())}var Z=new(function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this)).promiseResolved=Symbol("resolved"),n.concurrentPromises=1,n.runningPromises=0,n.promiseQueue=[],n.concurrentPromises=e,n.promiseQueue=[],n}return Object(n.a)(a,[{key:"addPromise",value:function(e){for(var t=this,a=arguments.length,r=new Array(a>1?a-1:0),n=1;n<a;n++)r[n-1]=arguments[n];return new Promise((function(a,n){t.promiseQueue.push({f:e,args:r,resolve:a,reject:n}),t.runPromise()}))}},{key:"runPromise",value:function(){var e=this;if(this.runningPromises!==this.concurrentPromises&&0!==this.promiseQueue.length)try{this.runningPromises++;var t=this.promiseQueue.shift();console.log(t),t.f.apply(null,t.args).then((function(a,r){r?t.reject(r):(t.resolve(a),e.emit(e.promiseResolved),e.runningPromises--,e.runPromise())}))}catch(a){console.info(a)}}}]),a}(a(53).EventEmitter))(5),H=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).onChangeValidateType=function(e){n.setState({validateType:e})},n.onChangeSelectType=function(e){n.setState({selectType:e})},n.onInput=function(e,t){var a=e||t||"";n.setState({userData:a})},n.mergeError=function(e,t){var a,r=Object(K.a)(t);try{var n=function(){var t=a.value,r=e.find((function(e){return e.key===t.key}));r?r.ids.concat(t.ids):e.push(t)};for(r.s();!(a=r.n()).done;)n()}catch(l){r.e(l)}finally{r.f()}return e},n.resultReducer=function(e,t){for(var a in t)Array.isArray(t[a])?e[a]=e[a]?n.mergeError(e[a],t[a]):t[a]:"number"===typeof t[a]?e[a]=e[a]?e[a]+t[a]:t[a]:e[a]=t[a];return e},n.validateFromS3=function(){var e=Object(J.a)(z.a.mark((function e(t){var a,r,l,s,c,o,i,u;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("".concat("https://validator.quintype.com","/api/get-s3-files"),t);case 3:return a=e.sent,e.next=6,a.json();case 6:r=e.sent,l=[],s=Object(K.a)(Object(E.chunk)(r,5));try{for(s.s();!(c=s.n()).done;)o=c.value,i=q(n.state.validateType,n.state.selectType,{path:n.state.userData,files:o}),l.push(Z.addPromise(fetch,"".concat("https://validator.quintype.com","/api/validate?source=S3"),i).then((function(e){return e.json()})))}catch(m){s.e(m)}finally{s.f()}return e.next=12,Promise.all(l);case 12:return u=(u=e.sent).reduce(n.resultReducer,{}),n.props.sendData({result:u}),e.abrupt("return");case 18:return e.prev=18,e.t0=e.catch(0),console.log(e.t0),n.props.sendData({result:e.t0.message}),e.abrupt("return");case 23:case"end":return e.stop()}}),e,null,[[0,18]])})));return function(t){return e.apply(this,arguments)}}(),n.onValidate=function(){var e=Object(J.a)(z.a.mark((function e(t){var a,r,l;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),n.props.sendData({formEnabled:!1}),a=q(n.state.validateType,n.state.selectType,n.state.userData),"S3 path"!==n.state.validateType.value){e.next=7;break}n.validateFromS3(a),e.next=21;break;case 7:return e.prev=7,e.next=10,fetch("".concat("https://validator.quintype.com","/api/validate?source=").concat(n.state.validateType.value.split(" ")[0]),a);case 10:return r=e.sent,e.next=13,r.json();case 13:l=e.sent,n.props.sendData({result:l}),e.next=21;break;case 17:e.prev=17,e.t0=e.catch(7),console.error(e.t0),n.props.sendData({result:{error:e.t0}});case 21:case"end":return e.stop()}}),e,null,[[7,17]])})));return function(t){return e.apply(this,arguments)}}(),n.state={validateType:null,selectType:null,userData:""},n}return Object(n.a)(a,[{key:"render",value:function(){var e=this.state,t=e.validateType,a=e.selectType,r=e.userData,n=t&&a&&r;return o.a.createElement(o.a.Fragment,null,o.a.createElement(D,null),o.a.createElement("div",{className:x.a.container},o.a.createElement(Q.a,{label:"Select Type",options:A,value:a,onChange:this.onChangeSelectType}),o.a.createElement(Q.a,{label:"Validate by",options:R,value:t,onChange:this.onChangeValidateType}),o.a.createElement(G,{userData:r,validateType:t,onInput:this.onInput}),o.a.createElement(U.a,{type:"primary",onClick:this.onValidate,disabled:!n},"Validate")))}}]),a}(c.Component),Y=(a(89),function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).setData=function(e){n.setState(e)},n.state={formEnabled:!0,result:""},n}return Object(n.a)(a,[{key:"render",value:function(){var e=this.state,t=e.formEnabled,a=e.result;return o.a.createElement("div",{className:x.a.migrator},t?o.a.createElement(H,{sendData:this.setData}):o.a.createElement(I,{result:a}))}}]),a}(c.Component));var X=function(){return o.a.createElement("div",{className:"error-page"},o.a.createElement("h1",null,"Not Found"),o.a.createElement("h3",null,"Would you like to return ",o.a.createElement(m.b,{to:"/website"},"home")," instead?"))},$=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement(m.a,{basename:"/quintype-validator"},o.a.createElement(k,null),o.a.createElement(p.d,null,o.a.createElement(p.a,{exact:!0,from:"/",to:"/website"}),o.a.createElement(p.b,{exact:!0,path:"/website",component:S}),o.a.createElement(p.b,{exact:!0,path:"/migrator",component:Y}),o.a.createElement(p.b,{exact:!0,path:"",component:X}))))}}]),a}(o.a.Component);u.a.render(o.a.createElement($,null),document.getElementById("root"))}},[[58,1,2]]]);
//# sourceMappingURL=main.9f5bc9e9.chunk.js.map