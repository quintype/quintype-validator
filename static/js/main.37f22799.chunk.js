(this["webpackJsonpquintype-validator"]=this["webpackJsonpquintype-validator"]||[]).push([[0],{3:function(e,t,a){e.exports={migrator:"migrator_migrator__2neCI",heading:"migrator_heading__12-aT",content:"migrator_content__1qtIz",container:"migrator_container__dkj66","result-heading":"migrator_result-heading__2i9Ag",download:"migrator_download__sA3LK","result-statistics":"migrator_result-statistics__2W2_y","statistic-heading":"migrator_statistic-heading__SxGSl","statistic-reading":"migrator_statistic-reading__2H8Z4","success-reading":"migrator_success-reading__3Lyce","fail-reading":"migrator_fail-reading__3IRUA","result-messages":"migrator_result-messages__3CNEI","error-message":"migrator_error-message__3LAkm","error-metadata":"migrator_error-metadata__1nYcR","error-level":"migrator_error-level__fK7N_","error-list":"migrator_error-list__2qkwB","warning-list":"migrator_warning-list__MOLnC","success-list":"migrator_success-list__UhGH3"}},59:function(e,t,a){e.exports=a(91)},64:function(e,t,a){},65:function(e,t,a){},91:function(e,t,a){"use strict";a.r(t);var r=a(4),n=a(5),s=a(7),c=a(6),l=a(0),i=a.n(l),o=a(17),u=a.n(o),m=(a(64),a(21)),d=a(10),p=a(8),h=(a(65),a(47)),v=a.n(h),f=a(56),g=a(24),E=a.n(g),y=a(49),b=a.n(y),j=function(){return i.a.createElement("svg",{id:"Layer_1",width:"48",height:"48","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 40 40"},i.a.createElement("defs",null),i.a.createElement("path",{fill:"#fff",d:"M23.58,11.75a18.09,18.09,0,0,1,0,17.89Zm0,18.79a10.79,10.79,0,0,1-4.34.15c-2.62-.38-4.06-3.6-4.06-3.6l6.21-1.72v-16l2.19,2.23ZM14,20.91c0-3.16.22-7.12.22-7.12l2.18-.85V26.79L15,27.25A25.11,25.11,0,0,1,14,20.91Zm17.74,9.62-1.35,1.71a4.44,4.44,0,0,0-5.26-2s7-4.58,6.27-12.4A17,17,0,0,0,24.74,5.8c-.38-.24-5.52,5.64-10.84,7.14,0,0,.24-5.55,4.24-6V6.18S8,7.66,8,20.11c0,0,.39,10.85,10.79,11.31l4,.18s3.41-.18,4.1,4.75l.52.44,4.55-6Z"}))},O=function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"submit",value:function(e){e.preventDefault(),this.props.onSubmit(this.props.url)}},{key:"importResult",value:function(e){var t=this;if(1===e.length){var a=new FileReader;a.onload=function(e){return t.props.onImport(JSON.parse(e.target.result))},a.readAsText(e[0])}}},{key:"render",value:function(){var e=this;return i.a.createElement(i.a.Fragment,null,i.a.createElement(f.a,{accept:"application/json",onDrop:function(t){return e.importResult(t)},className:"url-dropzone",acceptClassName:"url-dropzone-accept",rejectClassName:"url-dropzone-reject",disableClick:!0},i.a.createElement("form",{className:"url-container",onSubmit:function(t){return e.submit(t)}},i.a.createElement("input",{className:"url-input",value:this.props.url,placeholder:"Enter Url",onChange:function(t){return e.props.onChange(t.target.value)}}),i.a.createElement("input",{type:"submit",className:"url-go",value:"Go!"}))))}}]),a}(i.a.Component),k=function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{className:"sidebar"},i.a.createElement("div",{className:"sidebar-container"},i.a.createElement(j,null)),i.a.createElement("div",{className:"menu"},i.a.createElement("div",{className:"menu__container"},i.a.createElement(m.c,{to:"/website",className:"navbar",activeClassName:"is-active"},i.a.createElement("div",{className:"menu__website logo"}))),i.a.createElement("div",{className:"menu__container"},i.a.createElement(m.c,{to:"/migrator",className:"navbar",activeClassName:"is-active"},i.a.createElement("div",{className:"menu__migrator logo"})))))}}]),a}(i.a.Component);var N=function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={active:!1},n}return Object(n.a)(a,[{key:"render",value:function(){var e=this,t=this.props.result.errors||[],a=this.props.result.warnings||[],r=this.props.children||t.length>0||a.length>0;return i.a.createElement("section",{className:"result ".concat(this.state.active&&"active")},i.a.createElement("header",{className:"result-header ".concat(r&&"expandable"),onClick:function(){return r&&e.setState({active:!e.state.active})}},i.a.createElement("div",{className:"clearfix"},i.a.createElement("h2",{className:"result-title"},this.props.title),i.a.createElement("h3",{className:"result-status result-status-".concat(this.props.result.status," ").concat(a.length>0?"result-status-WARN":"")},this.props.result.status))),i.a.createElement("div",{className:"result-body"},this.props.children&&i.a.createElement("div",null,this.props.children),t.length>0&&i.a.createElement("div",null,i.a.createElement("h4",null,"Errors:"),i.a.createElement("ul",null,t.map((function(e,t){return i.a.createElement("li",{key:t},e)})))),a.length>0&&i.a.createElement("div",null,i.a.createElement("h4",null,"Warnings:"),i.a.createElement("ul",null,a.map((function(e,t){return i.a.createElement("li",{key:t},e)}))))))}}]),a}(i.a.Component);var w=function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={active:!1},n}return Object(n.a)(a,[{key:"render",value:function(){var e=this;return i.a.createElement("section",{className:"result ".concat(this.state.active&&"active")},i.a.createElement("header",{className:"result-header expandable",onClick:function(){return e.setState({active:!e.state.active})}},i.a.createElement("div",{className:"clearfix"},i.a.createElement("h2",{className:"result-title"},"Debugging"))),i.a.createElement("div",{className:"result-body"},i.a.createElement("div",null,"For a full list of rules, please see"," ",i.a.createElement("a",{href:"https://github.com/quintype/quintype-validator",target:"_blank",rel:"noopener noreferrer"},"Readme.md")),i.a.createElement("div",null,i.a.createElement("table",null,i.a.createElement("thead",null,i.a.createElement("tr",null,i.a.createElement("th",null,"Category"),i.a.createElement("th",null,"Key"),i.a.createElement("th",null,"Value"))),i.a.createElement("tbody",null,E()(this.props.results).entries().flatMap((function(e){var t=Object(p.a)(e,2),a=t[0],r=t[1];return E()(r.debug).entries().map((function(e){var t=Object(p.a)(e,2),r=t[0],n=t[1];return function(e,t,a){return i.a.createElement("tr",{key:"".concat(e,"/").concat(t)},i.a.createElement("td",null,e),i.a.createElement("td",{className:"debug-key"},t),i.a.createElement("td",null,a))}(a,r,n)})).value()})).value()))),this.props.links.length>0&&i.a.createElement("div",null,i.a.createElement("h4",null,"Links:"),i.a.createElement("ul",null,this.props.links.map((function(t,a){return i.a.createElement("li",{key:a},i.a.createElement("button",{onClick:function(){return e.props.onValidate(t)}},"validate")," ","- ",t)}))))))}}]),a}(i.a.Component),_=function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){var e=this,t=function(t,a){return e.props.results[t]?i.a.createElement(N,{title:a,result:e.props.results[t]}):void 0};return i.a.createElement("div",{className:"results"},t("amp","AMP"),t("headers","Caching Headers"),this.props.results.structured?i.a.createElement(N,{title:"Structured Data",result:this.props.results.structured},i.a.createElement("div",null,"Number of Objects: ",this.props.results.structured.numObjects),i.a.createElement("div",null,"Content Id: ",this.props.results.structured.contentId)):void 0,t("og","Facebook OG Tags"),t("seo","SEO Rules"),t("robots","Robots"),t("pagespeed","PageSpeed"),t("lighthouseSeo","Lighthouse SEO"),t("lighthousePwa","PWA"),t("routeData","Route Data Size"),i.a.createElement(w,{results:this.props.results,links:this.props.links,onValidate:this.props.onValidate}),i.a.createElement("button",{className:"results-download",onClick:function(){return e.props.onDownload()}},"Download As JSON"))}}]),a}(i.a.Component),C=function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={url:"",response:null,loading:!1,error:null},n}return Object(n.a)(a,[{key:"loadRules",value:function(e){var t=this;v.a.post("".concat("https://validator.quintype.com","/api/validate.json"),{url:e}).then((function(e){return t.setState({response:e.body,loading:!1,url:e.body.url})})).catch((function(e){return t.setState({loading:!1,error:e.message})}))}},{key:"processUrl",value:function(e){var t=this;this.state.loading||this.setState({url:e,loading:!0,error:null},(function(){return t.loadRules(e)}))}},{key:"downloadResponse",value:function(){var e=new Blob([JSON.stringify(this.state.response)],{type:"application/json;charset=utf-8"});b.a.saveAs(e,"validator.json")}},{key:"import",value:function(e){this.setState({response:e,error:null,loading:!1,url:e.url})}},{key:"render",value:function(){var e=this;return i.a.createElement("div",null,i.a.createElement("h1",{className:"website-heading"},"Quintype Validator"),i.a.createElement(O,{onSubmit:function(t){return e.processUrl(t)},url:this.state.url,onChange:function(t){return e.setState({url:t})},onImport:function(t){return e.import(t)}}),this.state.error&&i.a.createElement("div",{className:"error-message"},this.state.error),this.state.loading&&i.a.createElement("div",{className:"loading"},"Crunching Numbers"),!this.state.loading&&this.state.response&&i.a.createElement(_,{results:this.state.response.results,links:this.state.response.links,onValidate:function(t){return e.processUrl(t)},url:this.state.response.url,onDownload:function(){return e.downloadResponse()}}))}}]),a}(i.a.Component),S=a(3),T=a.n(S);function x(){return i.a.createElement("section",{className:T.a["migrator-heading"]},i.a.createElement("h1",{className:T.a.heading},"Migration Validator"),i.a.createElement("p",{className:T.a.content},"Migration Data Validator checks for the intermediate files for JSON schema errors, File type & encoding errors and mandatory errors and generates a report after the validation process is completed"))}var D=a(36);function P(e){var t=e.finalResult,a=t&&t.errors.map((function(e){return i.a.createElement("li",null,i.a.createElement("span",{className:T.a["error-message"]},e.message),e.metadata&&Object.values(e.metadata).map((function(e){return i.a.createElement("p",{className:T.a["error-metadata"]},e)})))})),r=t&&t.warnings.map((function(e){return i.a.createElement("li",null,i.a.createElement("span",{className:T.a["error-message"]},e.message),e.metadata&&Object.values(e.metadata).map((function(e){return i.a.createElement("p",{className:T.a["error-metadata"]},e)})))}));return i.a.createElement(i.a.Fragment,null,i.a.createElement(D.a,null,i.a.createElement(D.b,{label:"Details",children:i.a.createElement(i.a.Fragment,null,i.a.createElement("p",{className:T.a["error-level"]},"Errors"),i.a.createElement("ul",{className:T.a["error-list"]},a),i.a.createElement("p",{className:T.a["error-level"]},"Warnings"),i.a.createElement("ul",{className:T.a["warning-list"]},r))})))}var A=function(e){var t=e.width,a=void 0===t?"24":t,r=e.height,n=void 0===r?"20":r,s=e.color,c=void 0===s?"var(--brand-3)":s;return i.a.createElement("svg",{width:a,height:n,fill:c,id:"Layer_1","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg"},i.a.createElement("path",{d:"M13.5,8.52a.73.73,0,0,0,.23.56.75.75,0,0,0,.57.24h4.53V20.25a.79.79,0,0,1-.8.8H6.83a.79.79,0,0,1-.8-.8V4.78a.77.77,0,0,1,.23-.56A.78.78,0,0,1,6.83,4H13.5Zm2.53,7a.46.46,0,0,0,.13-.57.49.49,0,0,0-.5-.33H13.5V12a.52.52,0,0,0-.15-.38.54.54,0,0,0-.39-.15H11.9a.53.53,0,0,0-.39.15.52.52,0,0,0-.15.38v2.67H9.19a.5.5,0,0,0-.5.33.47.47,0,0,0,.14.57l3.2,3.2a.54.54,0,0,0,.4.17.56.56,0,0,0,.4-.17ZM18.6,7.48a.81.81,0,0,1,.23.57v.2H14.56V4h.2a.78.78,0,0,1,.57.24Z"}))},F=a(57),R=[{label:"Story",value:"Story"},{label:"Section",value:"Section"},{label:"Author",value:"Author"},{label:"Entity",value:"Entity"},{label:"Tag",value:"Tag"}],q=[{label:"Direct text input",value:"Direct text input"},{label:"File upload",value:"File upload"},{label:"S3 path",value:"S3 path"}];function V(e,t,a){var r,n=e.value,s=t.value,c={method:"POST",headers:{Accept:"application/json","Access-Control-Allow-Origin":"https://validator.quintype.com","Access-Control-Allow-Methods":"POST",keepalive:!0}};return"Direct text input"===n||"S3 path"===n?(c.headers["Content-Type"]="application/json",r=JSON.stringify({type:s,data:a})):((r=new FormData).append("type",s),r.append("file",a)),c.body=r,console.log("options :",c),c}function L(e,t){var a={};return e&&(a.info="Affected count: ".concat(t.length,". Refer ").concat(e.toLowerCase()," with external-id '").concat(t[0],"'.")),a}function I(e){var t=e.result,a=t&&function(e){var t=e.dataType,a=e.total,r=e.successful,n=e.failed,s=e.additionalProperties,c=e.type,l=e.required,i=e.enum,o=e.minLength,u=e.maxLength,m=e.exceptions,d=e.minItems,h=e.uniqueKey,v=e.invalidURL,f=e.invalidTimestamp,g=e.oldTimestamp,E=e.invalidEmail,y=e.authorNamesMismatch,b=e.pattern,j=e.invalidHeroImage,O=e.invalidEncoding,k={errors:[],warnings:[],successful:[]};if(k.total=a||0,k.successful=r||0,k.failed=n||0,e.error)return k.errors.push({message:"Error:".concat(e.error)}),k;var N=function(e){var t="data:application/octet-stream,error-type%2Cpath%2Clog-level%2Cexternal-id%0A",a=function(a){var r="additionalProperties"===a||"oldTimestamp"===a?"warning":"error";e[a]&&e[a].forEach((function(e){var n=function(e){switch(e){case"type":return"wrongType";case"required":return"requiredField";case"wrongEnumValue":return"wrongValue";case"uniqueKey":return"duplicateKey";case"pattern":return"wrongPattern";default:return e}}(a);e.ids?e.ids.forEach((function(a){t="".concat(t).concat(n,"%2C").concat(e.key&&e.key.replace(/,/g,"/"),"%2C").concat(r,"%2C").concat(a,"%0A")})):t="".concat(t).concat(n,"%2C").concat(e.key&&e.key.replace(/,/g,"/"),"%2C").concat(r,"%2C' '%0A")}))};for(var r in e)a(r);return t}({exceptions:m,invalidEncoding:O,type:c,required:l,wrongEnumValue:i,minLength:o,maxLength:u,minItems:d,uniqueKey:h,invalidURL:v,additionalProperties:s,invalidTimestamp:f,oldTimestamp:g,invalidEmail:E,authorNamesMismatch:y,pattern:b,invalidHeroImage:j});k.errorFile=N;var w="Story"===t?"".concat(t.toLowerCase().slice(0,4),"ies"):"".concat(t.toLowerCase(),"s");return k.dataType=w,m&&m.forEach((function(e){var t={message:"Error:".concat(e.key)};e.ids&&(t.metadata={info:e.ids.join(", ")}),k.errors.push(t)})),u&&u.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];k.errors.push({message:"".concat(t," should have maximum of ").concat(s," characters for property '").concat(n,"'."),metadata:L(t,e.ids)})})),o&&o.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];k.errors.push({message:"".concat(t," should have minimum of ").concat(s," character").concat(s>1?"s":""," for property '").concat(n,"'."),metadata:L(t,e.ids)})})),d&&d.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];k.errors.push({message:"".concat(t," should have minimum of ").concat(s," ").concat(s>1?n:n.slice(0,n.length-1),"."),metadata:L(t,e.ids)})})),h&&h.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];k.errors.push({message:"".concat(n," '").concat(s,"' is not unique."),metadata:L(t,e.ids)})})),v&&v.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];k.errors.push({message:"".concat(n," has invalid url '").concat(s,"'."),metadata:L(t,e.ids)})})),f&&f.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];s=s===t?"":" in '".concat(s,"'"),k.errors.push({message:"".concat(t," has invalid timestamp for '").concat(n,"'").concat(s,". Expecting a positive integer representing timestamp in epoch milliseconds not exceeding current timestamp."),metadata:L(t,e.ids)})})),l&&l.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];s=s===t?"":" in '".concat(s,"'"),k.errors.push({message:"".concat(t," should have required property '").concat(n,"'").concat(s,"."),metadata:L(t,e.ids)})})),s&&s.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];s=s===t?"":" in '".concat(s,"'"),k.warnings.push({message:"".concat(t," has additional property '").concat(n,"'").concat(s,"."),metadata:L(t,e.ids)})})),g&&g.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];s=s===t?"":" in '".concat(s,"'"),k.warnings.push({message:"".concat(t," seems to have a very old timestamp for '").concat(n,"'").concat(s,". Please check if the desired timestamp is provided in milliseconds."),metadata:L(t,e.ids)})})),b&&b.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0];r[1];k.errors.push({message:"".concat(t," has invalid string pattern for property '").concat(n,"'."),metadata:L(t,e.ids)})})),c&&c.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];k.errors.push({message:"".concat(t," has wrong type for property '").concat(n,"'. Expected '").concat(s,"'."),metadata:L(t,e.ids)})})),i&&i.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];k.errors.push({message:"".concat(t," has incorrect value for property '").concat(n,"'. Allowed values are '").concat(s.split(",").join(", "),"'."),metadata:L(t,e.ids)})})),E&&E.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=r[0],s=r[1];k.errors.push({message:"".concat(s?"".concat(n," id: '").concat(s,"' is not valid."):"".concat(n," id cannot be empty.")),metadata:L(t,e.ids)})})),y&&y.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,1)[0],n=e.data;k.errors.push({message:"".concat(r," username: '").concat(n.username,"' & name: '").concat(n.name,"' are not same."),metadata:L(t,e.ids)})})),j&&j.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,3),n=r[0],s=r[1],c=r[2];k.errors.push({message:"".concat(n," '").concat(s,":").concat(c,"' is invalid. Example: domain/path/to/image.jpg"),metadata:L(t,e.ids)})})),O&&O.forEach((function(e){var a=e.key.split(":"),r=Object(p.a)(a,2),n=(r[0],r[1]);k.errors.push({message:"".concat(t," contains '").concat(n,"' encoded characters. Please provide only valid UTF-8 characters."),metadata:L(t,e.ids)})})),k}(t);return i.a.createElement(i.a.Fragment,null,a?i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:T.a["result-heading"]},i.a.createElement("div",{id:T.a.heading},"Results"),i.a.createElement("div",{id:T.a.download},i.a.createElement("a",{href:a.errorFile,download:"result-".concat(Date.now(),".csv")},i.a.createElement(A,null),"Download Report"))),i.a.createElement("div",{className:T.a["result-statistics"]},i.a.createElement("div",null,i.a.createElement("div",{className:T.a["statistic-heading"]},"Total validated ",a.dataType),i.a.createElement("div",{className:T.a["statistic-reading"]},a.total)),i.a.createElement("div",null,i.a.createElement("div",{className:T.a["statistic-heading"]},"Successfully validated"),i.a.createElement("div",{className:T.a["statistic-reading"]},a.successful,i.a.createElement("div",{id:T.a["success-reading"]}))),i.a.createElement("div",null,i.a.createElement("div",{className:T.a["statistic-heading"]},"Failed ",a.dataType),i.a.createElement("div",{className:T.a["statistic-reading"]},a.failed,i.a.createElement("div",{id:T.a["fail-reading"]})))),i.a.createElement("div",{className:T.a["result-messages"]},i.a.createElement(P,{finalResult:a}))):i.a.createElement(i.a.Fragment,null,i.a.createElement(F.a,null),i.a.createElement("p",{className:T.a.content},"Please wait, validation is in progress. This can take 5-10 minutes. Please don't close the tab.")))}var M=a(20),H=a.n(M),z=a(37),U=a(31),J=a(38),Z=a(58),K=a(39),Q=a(53);function W(e){var t=e.validateType,a=e.onInput,r=e.userData;return t&&i.a.createElement(i.a.Fragment,null,function(){switch(t.value){case"Direct text input":return i.a.createElement(K.a,{label:"Enter the Markup to validate:",onChange:a,value:r,placeholder:"Enter the JSON data"});case"File upload":return i.a.createElement(Q.a,{fieldLabel:"Upload File",placeholder:"Choose file (only *.txt.gz)",accepts:"application/x-gzip",size:3e6,uploadFile:a});case"S3 path":return i.a.createElement(K.a,{label:"Type url here",onChange:a,value:r,placeholder:"Enter S3 path"});default:return null}}())}var B=new(function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this)).promiseResolved=Symbol("resolved"),n.concurrentPromises=1,n.runningPromises=0,n.promiseQueue=[],n.concurrentPromises=e,n.promiseQueue=[],n}return Object(n.a)(a,[{key:"addPromise",value:function(e){for(var t=this,a=arguments.length,r=new Array(a>1?a-1:0),n=1;n<a;n++)r[n-1]=arguments[n];return new Promise((function(a,n){t.promiseQueue.push({f:e,args:r,resolve:a,reject:n}),t.runPromise()}))}},{key:"runPromise",value:function(){var e,t=this;if(this.runningPromises!==this.concurrentPromises&&0!==this.promiseQueue.length)try{this.runningPromises++,e=this.promiseQueue.shift(),console.info(e),e.f.apply(null,e.args).then((function(a,r){r?e.reject(r):(e.resolve(a),t.emit(t.promiseResolved),t.runningPromises--,t.runPromise())}))}catch(a){console.info(a),e.reject(a)}}}]),a}(a(54).EventEmitter))(5),G=function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).onChangeValidateType=function(e){n.setState({validateType:e})},n.onChangeSelectType=function(e){n.setState({selectType:e})},n.onInput=function(e,t){var a=e||t||"";n.setState({userData:a})},n.mergeError=function(e,t){var a,r=Object(U.a)(t);try{var n=function(){var t=a.value,r=e.find((function(e){return e.key===t.key}));"object"===typeof t&&r?r.ids.concat(t.ids):e.push(t)};for(r.s();!(a=r.n()).done;)n()}catch(s){r.e(s)}finally{r.f()}return e},n.resultReducer=function(e,t){for(var a in t)Array.isArray(t[a])?e[a]=e[a]?n.mergeError(e[a],t[a]):t[a]:"number"===typeof t[a]?e[a]=e[a]?e[a]+t[a]:t[a]:e[a]=t[a];return e},n.validateFromS3=function(){var e=Object(z.a)(H.a.mark((function e(t){var a,r,s,c,l,i,o,u,m,d,p,h,v,f;return H.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("".concat("https://validator.quintype.com","/api/get-s3-files"),t);case 3:return a=e.sent,e.next=6,a.json();case 6:if(!(r=e.sent).error&&!r.exceptions){e.next=10;break}return n.props.sendData({result:r}),e.abrupt("return");case 10:s=[],c=r.filter((function(e){return e.size<=2097152})),l=r.filter((function(e){return e.size>2097152})),i=Object(U.a)(Object(g.chunk)(c,2));try{for(i.s();!(o=i.n()).done;)u=(u=o.value).map((function(e){return e.key})),m=V(n.state.validateType,n.state.selectType,{path:n.state.userData,files:u}),s.push(B.addPromise(fetch,"".concat("https://validator.quintype.com","/api/validate?source=S3"),m).then((function(e,t){if(t)throw console.error(t),t;return e.json()})))}catch(E){i.e(E)}finally{i.f()}d=Object(U.a)(Object(g.chunk)(l,1));try{for(d.s();!(p=d.n()).done;)h=(h=p.value).map((function(e){return e.key})),v=V(n.state.validateType,n.state.selectType,{path:n.state.userData,files:h}),s.push(B.addPromise(fetch,"".concat("https://validator.quintype.com","/api/validate?source=S3"),v).then((function(e,t){if(t)throw console.error(t),t;return e.json()})))}catch(E){d.e(E)}finally{d.f()}return e.next=19,Promise.all(s);case 19:return f=(f=e.sent).reduce(n.resultReducer,{}),n.props.sendData({result:f}),e.abrupt("return");case 25:return e.prev=25,e.t0=e.catch(0),console.log(e.t0),n.props.sendData({result:{error:e.t0.message}}),e.abrupt("return");case 30:case"end":return e.stop()}}),e,null,[[0,25]])})));return function(t){return e.apply(this,arguments)}}(),n.onValidate=function(){var e=Object(z.a)(H.a.mark((function e(t){var a,r,s;return H.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),n.props.sendData({formEnabled:!1}),a=V(n.state.validateType,n.state.selectType,n.state.userData),"S3 path"!==n.state.validateType.value){e.next=7;break}n.validateFromS3(a),e.next=23;break;case 7:return e.prev=7,console.log("REACT_APP_API_HOST->","https://validator.quintype.com","opts-> ",JSON.stringify(a)),e.next=11,fetch("".concat("https://validator.quintype.com","/api/validate?source=").concat(n.state.validateType.value.split(" ")[0]),a);case 11:return r=e.sent,e.next=14,r.json();case 14:s=e.sent,console.log("result :",s),n.props.sendData({result:s}),e.next=23;break;case 19:e.prev=19,e.t0=e.catch(7),console.log(e.t0),n.props.sendData({result:{error:e.t0.message}});case 23:case"end":return e.stop()}}),e,null,[[7,19]])})));return function(t){return e.apply(this,arguments)}}(),n.state={validateType:null,selectType:null,userData:""},n}return Object(n.a)(a,[{key:"render",value:function(){var e=this.state,t=e.validateType,a=e.selectType,r=e.userData,n=t&&a&&r;return i.a.createElement(i.a.Fragment,null,i.a.createElement(J.a,{label:"Select Type",options:R,value:a,onChange:this.onChangeSelectType}),i.a.createElement(J.a,{label:"Validate by",options:q,value:t,onChange:this.onChangeValidateType}),i.a.createElement(W,{userData:r,validateType:t,onInput:this.onInput}),i.a.createElement(Z.a,{type:"primary",onClick:this.onValidate,disabled:!n},"Validate"))}}]),a}(l.Component),Y=(a(90),function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).setData=function(e){n.setState(e)},n.state={formEnabled:!0,result:""},n}return Object(n.a)(a,[{key:"render",value:function(){var e=this.state,t=e.formEnabled,a=e.result;return i.a.createElement("div",{className:T.a.migrator},i.a.createElement(x,null),i.a.createElement("div",{className:T.a.container},t?i.a.createElement(G,{sendData:this.setData}):i.a.createElement(I,{result:a})))}}]),a}(l.Component));var X=function(){return i.a.createElement("div",{className:"error-page"},i.a.createElement("h1",null,"Not Found"),i.a.createElement("h3",null,"Would you like to return ",i.a.createElement(m.b,{to:"/website"},"home")," instead?"))},$=function(e){Object(s.a)(a,e);var t=Object(c.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(m.a,{basename:"/quintype-validator"},i.a.createElement(k,null),i.a.createElement(d.d,null,i.a.createElement(d.a,{exact:!0,from:"/",to:"/website"}),i.a.createElement(d.b,{exact:!0,path:"/website",component:C}),i.a.createElement(d.b,{exact:!0,path:"/migrator",component:Y}),i.a.createElement(d.b,{exact:!0,path:"",component:X}))))}}]),a}(i.a.Component);u.a.render(i.a.createElement($,null),document.getElementById("root"))}},[[59,1,2]]]);
//# sourceMappingURL=main.37f22799.chunk.js.map