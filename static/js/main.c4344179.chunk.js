(this["webpackJsonpquintype-validator"]=this["webpackJsonpquintype-validator"]||[]).push([[0],{3:function(e,t,a){e.exports={migrator:"migrator_migrator__2neCI",heading:"migrator_heading__12-aT",content:"migrator_content__1qtIz",container:"migrator_container__dkj66","result-heading":"migrator_result-heading__2i9Ag","error-message":"migrator_error-message__3LAkm","error-metadata":"migrator_error-metadata__1nYcR","error-level":"migrator_error-level__fK7N_","error-list":"migrator_error-list__2qkwB","warning-list":"migrator_warning-list__MOLnC","success-list":"migrator_success-list__UhGH3"}},56:function(e,t,a){e.exports=a(88)},61:function(e,t,a){},62:function(e,t,a){},88:function(e,t,a){"use strict";a.r(t);var n=a(5),r=a(6),l=a(7),s=a(8),c=a(0),o=a.n(c),i=a(16),u=a.n(i),m=(a(61),a(20)),p=a(19),d=a(14),h=(a(62),a(43)),v=a.n(h),f=a(54),E=a(31),g=a.n(E),b=a(45),y=a.n(b),N=function(){return o.a.createElement("svg",{id:"Layer_1",width:"48",height:"48","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 40 40"},o.a.createElement("defs",null),o.a.createElement("path",{fill:"#fff",d:"M23.58,11.75a18.09,18.09,0,0,1,0,17.89Zm0,18.79a10.79,10.79,0,0,1-4.34.15c-2.62-.38-4.06-3.6-4.06-3.6l6.21-1.72v-16l2.19,2.23ZM14,20.91c0-3.16.22-7.12.22-7.12l2.18-.85V26.79L15,27.25A25.11,25.11,0,0,1,14,20.91Zm17.74,9.62-1.35,1.71a4.44,4.44,0,0,0-5.26-2s7-4.58,6.27-12.4A17,17,0,0,0,24.74,5.8c-.38-.24-5.52,5.64-10.84,7.14,0,0,.24-5.55,4.24-6V6.18S8,7.66,8,20.11c0,0,.39,10.85,10.79,11.31l4,.18s3.41-.18,4.1,4.75l.52.44,4.55-6Z"}))},j=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"submit",value:function(e){e.preventDefault(),this.props.onSubmit(this.props.url)}},{key:"importResult",value:function(e){var t=this;if(1===e.length){var a=new FileReader;a.onload=function(e){return t.props.onImport(JSON.parse(e.target.result))},a.readAsText(e[0])}}},{key:"render",value:function(){var e=this;return o.a.createElement(o.a.Fragment,null,o.a.createElement(f.a,{accept:"application/json",onDrop:function(t){return e.importResult(t)},className:"url-dropzone",acceptClassName:"url-dropzone-accept",rejectClassName:"url-dropzone-reject",disableClick:!0},o.a.createElement("form",{className:"url-container",onSubmit:function(t){return e.submit(t)}},o.a.createElement("input",{className:"url-input",value:this.props.url,placeholder:"Enter Url",onChange:function(t){return e.props.onChange(t.target.value)}}),o.a.createElement("input",{type:"submit",className:"url-go",value:"Go!"}))))}}]),a}(o.a.Component),O=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){return o.a.createElement("div",{className:"sidebar"},o.a.createElement("div",{className:"sidebar-container"},o.a.createElement(N,null)),o.a.createElement("div",{className:"menu"},o.a.createElement("div",{className:"menu__container"},o.a.createElement(m.c,{to:"/website",className:"navbar",activeClassName:"is-active"},o.a.createElement("div",{className:"menu__website logo"}))),o.a.createElement("div",{className:"menu__container"},o.a.createElement(m.c,{to:"/migrator",className:"navbar",activeClassName:"is-active"},o.a.createElement("div",{className:"menu__migrator logo"})))))}}]),a}(o.a.Component);var k=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var r;return Object(n.a)(this,a),(r=t.call(this,e)).state={active:!1},r}return Object(r.a)(a,[{key:"render",value:function(){var e=this,t=this.props.result.errors||[],a=this.props.result.warnings||[],n=this.props.children||t.length>0||a.length>0;return o.a.createElement("section",{className:"result ".concat(this.state.active&&"active")},o.a.createElement("header",{className:"result-header ".concat(n&&"expandable"),onClick:function(){return n&&e.setState({active:!e.state.active})}},o.a.createElement("div",{className:"clearfix"},o.a.createElement("h2",{className:"result-title"},this.props.title),o.a.createElement("h3",{className:"result-status result-status-".concat(this.props.result.status," ").concat(a.length>0?"result-status-WARN":"")},this.props.result.status))),o.a.createElement("div",{className:"result-body"},this.props.children&&o.a.createElement("div",null,this.props.children),t.length>0&&o.a.createElement("div",null,o.a.createElement("h4",null,"Errors:"),o.a.createElement("ul",null,t.map((function(e,t){return o.a.createElement("li",{key:t},e)})))),a.length>0&&o.a.createElement("div",null,o.a.createElement("h4",null,"Warnings:"),o.a.createElement("ul",null,a.map((function(e,t){return o.a.createElement("li",{key:t},e)}))))))}}]),a}(o.a.Component);var _=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var r;return Object(n.a)(this,a),(r=t.call(this,e)).state={active:!1},r}return Object(r.a)(a,[{key:"render",value:function(){var e=this;return o.a.createElement("section",{className:"result ".concat(this.state.active&&"active")},o.a.createElement("header",{className:"result-header expandable",onClick:function(){return e.setState({active:!e.state.active})}},o.a.createElement("div",{className:"clearfix"},o.a.createElement("h2",{className:"result-title"},"Debugging"))),o.a.createElement("div",{className:"result-body"},o.a.createElement("div",null,"For a full list of rules, please see"," ",o.a.createElement("a",{href:"https://github.com/quintype/quintype-validator",target:"_blank",rel:"noopener noreferrer"},"Readme.md")),o.a.createElement("div",null,o.a.createElement("table",null,o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",null,"Category"),o.a.createElement("th",null,"Key"),o.a.createElement("th",null,"Value"))),o.a.createElement("tbody",null,g()(this.props.results).entries().flatMap((function(e){var t=Object(d.a)(e,2),a=t[0],n=t[1];return g()(n.debug).entries().map((function(e){var t=Object(d.a)(e,2),n=t[0],r=t[1];return function(e,t,a){return o.a.createElement("tr",{key:"".concat(e,"/").concat(t)},o.a.createElement("td",null,e),o.a.createElement("td",{className:"debug-key"},t),o.a.createElement("td",null,a))}(a,n,r)})).value()})).value()))),this.props.links.length>0&&o.a.createElement("div",null,o.a.createElement("h4",null,"Links:"),o.a.createElement("ul",null,this.props.links.map((function(t,a){return o.a.createElement("li",{key:a},o.a.createElement("button",{onClick:function(){return e.props.onValidate(t)}},"validate")," ","- ",t)}))))))}}]),a}(o.a.Component),w=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){var e=this,t=function(t,a){return e.props.results[t]?o.a.createElement(k,{title:a,result:e.props.results[t]}):void 0};return o.a.createElement("div",{className:"results"},t("amp","AMP"),t("headers","Caching Headers"),this.props.results.structured?o.a.createElement(k,{title:"Structured Data",result:this.props.results.structured},o.a.createElement("div",null,"Number of Objects: ",this.props.results.structured.numObjects),o.a.createElement("div",null,"Content Id: ",this.props.results.structured.contentId)):void 0,t("og","Facebook OG Tags"),t("seo","SEO Rules"),t("robots","Robots"),t("pagespeed","PageSpeed"),t("lighthouseSeo","Lighthouse SEO"),t("lighthousePwa","PWA"),t("routeData","Route Data Size"),o.a.createElement(_,{results:this.props.results,links:this.props.links,onValidate:this.props.onValidate}),o.a.createElement("button",{className:"results-download",onClick:function(){return e.props.onDownload()}},"Download As JSON"))}}]),a}(o.a.Component),C=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var r;return Object(n.a)(this,a),(r=t.call(this,e)).state={url:"",response:null,loading:!1,error:null},r}return Object(r.a)(a,[{key:"loadRules",value:function(e){var t=this;v.a.post("".concat("https://validator.quintype.com","/api/validate.json"),{url:e}).then((function(e){return t.setState({response:e.body,loading:!1,url:e.body.url})})).catch((function(e){return t.setState({loading:!1,error:e.message})}))}},{key:"processUrl",value:function(e){var t=this;this.state.loading||this.setState({url:e,loading:!0,error:null},(function(){return t.loadRules(e)}))}},{key:"downloadResponse",value:function(){var e=new Blob([JSON.stringify(this.state.response)],{type:"application/json;charset=utf-8"});y.a.saveAs(e,"validator.json")}},{key:"import",value:function(e){this.setState({response:e,error:null,loading:!1,url:e.url})}},{key:"render",value:function(){var e=this;return o.a.createElement("div",null,o.a.createElement("h1",{className:"website-heading"},"Quintype Validator"),o.a.createElement(j,{onSubmit:function(t){return e.processUrl(t)},url:this.state.url,onChange:function(t){return e.setState({url:t})},onImport:function(t){return e.import(t)}}),this.state.error&&o.a.createElement("div",{className:"error-message"},this.state.error),this.state.loading&&o.a.createElement("div",{className:"loading"},"Crunching Numbers"),!this.state.loading&&this.state.response&&o.a.createElement(w,{results:this.state.response.results,links:this.state.response.links,onValidate:function(t){return e.processUrl(t)},url:this.state.response.url,onDownload:function(){return e.downloadResponse()}}))}}]),a}(o.a.Component),S=a(3),x=a.n(S);function D(){return o.a.createElement("section",{className:x.a["migrator-heading"]},o.a.createElement("h1",{className:x.a.heading},"Migration Validator"),o.a.createElement("p",{className:x.a.content},"Migration Data Validator checks for the intermediate files for JSON schema errors, File type & encoding errors and mandatory errors and generates a report after the validation process is completed"))}var T=a(28),F=a(53);function R(e){var t=e.finalResult,a=t&&t.errors.map((function(e){return o.a.createElement("li",null,o.a.createElement("span",{className:x.a["error-message"]},e.message),e.metadata&&Object.values(e.metadata).map((function(e){return o.a.createElement("p",{className:x.a["error-metadata"]},e)})))})),n=t&&t.warnings.map((function(e){return o.a.createElement("li",null,o.a.createElement("span",{className:x.a["error-message"]},e.message),e.metadata&&Object.values(e.metadata).map((function(e){return o.a.createElement("p",{className:x.a["error-metadata"]},e)})))}));return o.a.createElement(o.a.Fragment,null,o.a.createElement("p",{className:x.a["result-heading"]},"Results"),t?o.a.createElement(T.a,null,o.a.createElement(T.b,{label:"Statistics"},o.a.createElement("p",null,t.total),o.a.createElement("p",null,t.successful)),o.a.createElement(T.b,{label:"Details",children:o.a.createElement(o.a.Fragment,null,o.a.createElement("p",{className:x.a["error-level"]},"Errors"),o.a.createElement("ul",{className:x.a["error-list"]},a),o.a.createElement("p",{className:x.a["error-level"]},"Warnings"),o.a.createElement("ul",{className:x.a["warning-list"]},n))})):o.a.createElement(o.a.Fragment,null,o.a.createElement(F.a,null),o.a.createElement("p",{className:x.a.content},"Please wait, validation is in progress. This can take 5-10 minutes. Please don't close the tab.")))}var A=[{label:"Story",value:"Story"},{label:"Section",value:"Section"},{label:"Author",value:"Author"},{label:"Entity",value:"Entity"},{label:"Tag",value:"Tag"}],V=[{label:"Direct text input",value:"Direct text input"},{label:"File upload",value:"File upload"},{label:"S3 path",value:"S3 path"}];function I(e,t,a){var n,r=e.value,l=t.value,s={method:"POST",headers:{Accept:"application/json"}};return"Direct text input"===r||"S3 path"===r?(s.headers["Content-Type"]="application/json",n=JSON.stringify({type:l,data:a})):((n=new FormData).append("type",l),n.append("file",a)),s.body=n,s}function q(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"Affected",n={},r="data:text/plain;charset=utf-8,";return e&&(n.info="Affected count: ".concat(t.length,". Refer ").concat(e.toLowerCase()," with external-id '").concat(t[0],"'.")),n.affected=o.a.createElement("a",{href:r+encodeURIComponent(t.join(",")),download:"external-ids.txt"},a," externals ids"),n}function L(e){var t=e.result,a=t&&function(e){var t={},a=e.dataType,n=e.total,r=e.successful,l=e.additionalProperties,s=e.type,c=e.required,o=e.enum,i=e.error,u=e.errorKeys;t.errors=[],t.warnings=[],t.successful=[];var m="Story"===a?"".concat(a.toLowerCase().slice(0,4),"ies"):"".concat(a.toLowerCase(),"s");if(t.total="Total ".concat(m," read: ").concat(n||0),t.successful="".concat(r||0," out of ").concat(n||0," ").concat(m," are valid."),i){var p={message:i};u&&(p.metadata={example:u.join(", ")}),t.errors.push(p)}return c&&c.forEach((function(e){var n=e.key.split(":"),r=Object(d.a)(n,2),l=r[0],s=r[1];s=s===a?"":" in '".concat(s,"'."),t.errors.push({message:"".concat(a," should have required property '").concat(l,"' ").concat(s),metadata:q(a,e.ids)})})),l&&l.forEach((function(e){var n=e.key.split(":"),r=Object(d.a)(n,2),l=r[0],s=r[1];s=s===a?"":" in '".concat(s,"'."),t.warnings.push({message:"".concat(a," has additional property '").concat(l,"' ").concat(s),metadata:q(a,e.ids)})})),s&&s.forEach((function(e){var n=e.key.split(":"),r=Object(d.a)(n,2),l=r[0],s=r[1];t.errors.push({message:"".concat(a," has wrong type for property '").concat(l,"'. Expected '").concat(s,"'."),metadata:q(a,e.ids)})})),o&&o.forEach((function(e){var n=e.key.split(":"),r=Object(d.a)(n,2),l=r[0],s=r[1];t.errors.push({message:"".concat(a," has incorrect value for property '").concat(l,"'. Allowed values are '").concat(s.split(",").join(", "),"'."),metadata:q(a,e.ids)})})),t}(t);return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:x.a.migrator},o.a.createElement(D,null),o.a.createElement("div",{className:x.a.container},o.a.createElement(R,{finalResult:a}))))}var z=a(23),J=a.n(z),M=a(48),P=a(34),U=a(55),W=a(35),B=a(51);function Z(e){var t=e.validateType,a=e.onInput,n=e.userData;return t&&o.a.createElement(o.a.Fragment,null,function(){switch(t.value){case"Direct text input":return o.a.createElement(W.a,{label:"Enter the Markup to validate:",onChange:a,value:n,placeholder:"Enter the JSON data"});case"File upload":return o.a.createElement(B.a,{fieldLabel:"Upload File",placeholder:"Choose file (only *.txt.gz)",accepts:"application/x-gzip",size:3e6,uploadFile:a});case"S3 path":return o.a.createElement(W.a,{label:"Type url here",onChange:a,value:n,placeholder:"Enter S3 path"});default:return null}}())}var G=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var r;return Object(n.a)(this,a),(r=t.call(this,e)).onChangeValidateType=function(e){r.setState({validateType:e})},r.onChangeSelectType=function(e){r.setState({selectType:e})},r.onInput=function(e,t){var a=e||t||"";r.setState({userData:a})},r.onValidate=function(){var e=Object(M.a)(J.a.mark((function e(t){var a,n,l;return J.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),r.props.sendData({formEnabled:!1}),a=I(r.state.validateType,r.state.selectType,r.state.userData),e.prev=3,e.next=6,fetch("".concat("https://validator.quintype.com","/api/validate?source=").concat(r.state.validateType.value.split(" ")[0]),a);case 6:return n=e.sent,e.next=9,n.json();case 9:l=e.sent,r.props.sendData({result:l}),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(3),r.props.sendData({result:e.t0.message});case 16:case"end":return e.stop()}}),e,null,[[3,13]])})));return function(t){return e.apply(this,arguments)}}(),r.state={validateType:null,selectType:null,userData:""},r}return Object(r.a)(a,[{key:"render",value:function(){var e=this.state,t=e.validateType,a=e.selectType,n=e.userData,r=t&&a&&n;return o.a.createElement(o.a.Fragment,null,o.a.createElement(D,null),o.a.createElement("div",{className:x.a.container},o.a.createElement(P.a,{label:"Select Type",options:A,value:a,onChange:this.onChangeSelectType}),o.a.createElement(P.a,{label:"Validate by",options:V,value:t,onChange:this.onChangeValidateType}),o.a.createElement(Z,{userData:n,validateType:t,onInput:this.onInput}),o.a.createElement(U.a,{type:"primary",onClick:this.onValidate,disabled:!r},"Validate")))}}]),a}(c.Component),K=(a(87),function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(e){var r;return Object(n.a)(this,a),(r=t.call(this,e)).setData=function(e){r.setState(e)},r.state={formEnabled:!0,result:""},r}return Object(r.a)(a,[{key:"render",value:function(){var e=this.state,t=e.formEnabled,a=e.result;return o.a.createElement("div",{className:x.a.migrator},t?o.a.createElement(G,{sendData:this.setData}):o.a.createElement(L,{result:a}))}}]),a}(c.Component));var H=function(){return o.a.createElement("div",{className:"error-page"},o.a.createElement("h1",null,"Not Found"),o.a.createElement("h3",null,"Would you like to return ",o.a.createElement(m.b,{to:"/website"},"home")," instead?"))},Q=function(e){Object(s.a)(a,e);var t=Object(l.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement(m.a,{basename:"/quintype-validator"},o.a.createElement(O,null),o.a.createElement(p.d,null,o.a.createElement(p.a,{exact:!0,from:"/",to:"/website"}),o.a.createElement(p.b,{exact:!0,path:"/website",component:C}),o.a.createElement(p.b,{exact:!0,path:"/migrator",component:K}),o.a.createElement(p.b,{exact:!0,path:"",component:H}))))}}]),a}(o.a.Component);u.a.render(o.a.createElement(Q,null),document.getElementById("root"))}},[[56,1,2]]]);
//# sourceMappingURL=main.c4344179.chunk.js.map