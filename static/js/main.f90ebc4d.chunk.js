(this["webpackJsonpquintype-validator"]=this["webpackJsonpquintype-validator"]||[]).push([[0],{18:function(e,t,a){e.exports=a(38)},23:function(e,t,a){},24:function(e,t,a){},38:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(13),s=a.n(l),u=(a(23),a(9)),o=a(2),c=a(3),i=a(5),p=a(4),m=a(6),h=(a(24),a(14)),d=a.n(h),v=a(17),f=a(8),E=a.n(f),b=a(16),g=a.n(b),j=function(e){function t(){return Object(o.a)(this,t),Object(i.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"submit",value:function(e){e.preventDefault(),this.props.onSubmit(this.props.url)}},{key:"importResult",value:function(e){var t=this;if(1===e.length){var a=new FileReader;a.onload=function(e){return t.props.onImport(JSON.parse(e.target.result))},a.readAsText(e[0])}}},{key:"render",value:function(){var e=this;return r.a.createElement(v.a,{accept:"application/json",onDrop:function(t){return e.importResult(t)},className:"url-dropzone",acceptClassName:"url-dropzone-accept",rejectClassName:"url-dropzone-reject",disableClick:!0},r.a.createElement("form",{className:"url-container",onSubmit:function(t){return e.submit(t)}},r.a.createElement("input",{className:"url-input",value:this.props.url,placeholder:"Enter Url",onChange:function(t){return e.props.onChange(t.target.value)}}),r.a.createElement("input",{type:"submit",className:"url-go",value:"Go!"})))}}]),t}(r.a.Component),O=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(i.a)(this,Object(p.a)(t).call(this,e))).state={active:!1},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=this.props.result.errors||[],a=this.props.result.warnings||[],n=this.props.children||t.length>0||a.length>0;return r.a.createElement("section",{className:"result ".concat(this.state.active&&"active")},r.a.createElement("header",{className:"result-header ".concat(n&&"expandable"),onClick:function(){return n&&e.setState({active:!e.state.active})}},r.a.createElement("div",{className:"clearfix"},r.a.createElement("h2",{className:"result-title"},this.props.title),r.a.createElement("h3",{className:"result-status result-status-".concat(this.props.result.status," ").concat(a.length>0?"result-status-WARN":"")},this.props.result.status))),r.a.createElement("div",{className:"result-body"},this.props.children&&r.a.createElement("div",null,this.props.children),t.length>0&&r.a.createElement("div",null,r.a.createElement("h4",null,"Errors:"),r.a.createElement("ul",null,t.map((function(e,t){return r.a.createElement("li",{key:t},e)})))),a.length>0&&r.a.createElement("div",null,r.a.createElement("h4",null,"Warnings:"),r.a.createElement("ul",null,a.map((function(e,t){return r.a.createElement("li",{key:t},e)}))))))}}]),t}(r.a.Component);var y=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(i.a)(this,Object(p.a)(t).call(this,e))).state={active:!1},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement("section",{className:"result ".concat(this.state.active&&"active")},r.a.createElement("header",{className:"result-header expandable",onClick:function(){return e.setState({active:!e.state.active})}},r.a.createElement("div",{className:"clearfix"},r.a.createElement("h2",{className:"result-title"},"Debugging"))),r.a.createElement("div",{className:"result-body"},r.a.createElement("div",null,"For a full list of rules, please see ",r.a.createElement("a",{href:"https://github.com/quintype/quintype-validator",target:"_blank",rel:"noopener noreferrer"},"Readme.md")),r.a.createElement("div",null,r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Category"),r.a.createElement("th",null,"Key"),r.a.createElement("th",null,"Value"))),r.a.createElement("tbody",null,E()(this.props.results).entries().flatMap((function(e){var t=Object(u.a)(e,2),a=t[0],n=t[1];return E()(n.debug).entries().map((function(e){var t=Object(u.a)(e,2),n=t[0],l=t[1];return function(e,t,a){return r.a.createElement("tr",{key:"".concat(e,"/").concat(t)},r.a.createElement("td",null,e),r.a.createElement("td",{className:"debug-key"},t),r.a.createElement("td",null,a))}(a,n,l)})).value()})).value()))),this.props.links.length>0&&r.a.createElement("div",null,r.a.createElement("h4",null,"Links:"),r.a.createElement("ul",null,this.props.links.map((function(t,a){return r.a.createElement("li",{key:a},r.a.createElement("button",{onClick:function(){return e.props.onValidate(t)}},"validate")," - ",t)}))))))}}]),t}(r.a.Component),k=function(e){function t(){return Object(o.a)(this,t),Object(i.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=function(t,a){return e.props.results[t]?r.a.createElement(O,{title:a,result:e.props.results[t]}):void 0};return r.a.createElement("div",null,t("amp","AMP"),t("headers","Caching Headers"),this.props.results.structured?r.a.createElement(O,{title:"Structured Data",result:this.props.results.structured},r.a.createElement("div",null,"Number of Objects: ",this.props.results.structured.numObjects),r.a.createElement("div",null,"Content Id: ",this.props.results.structured.contentId)):void 0,t("og","Facebook OG Tags"),t("seo","SEO Rules"),t("robots","Robots"),t("pagespeed","PageSpeed"),t("lighthouseSeo","LH SEO"),t("lighthousePwa","PWA"),r.a.createElement(y,{results:this.props.results,links:this.props.links,onValidate:this.props.onValidate}),r.a.createElement("button",{className:"results-download",onClick:function(){return e.props.onDownload()}},"Download As JSON"))}}]),t}(r.a.Component),N=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(i.a)(this,Object(p.a)(t).call(this,e))).state={url:"",response:null,loading:!1,error:null},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"loadRules",value:function(e){var t=this;d.a.post("".concat("https://validator.quintype.com","/api/validate.json"),{url:e}).then((function(e){return t.setState({response:e.body,loading:!1,url:e.body.url})})).catch((function(e){return t.setState({loading:!1,error:e.message})}))}},{key:"processUrl",value:function(e){var t=this;this.state.loading||this.setState({url:e,loading:!0,error:null},(function(){return t.loadRules(e)}))}},{key:"downloadResponse",value:function(){var e=new Blob([JSON.stringify(this.state.response)],{type:"application/json;charset=utf-8"});g.a.saveAs(e,"validator.json")}},{key:"import",value:function(e){this.setState({response:e,error:null,loading:!1,url:e.url})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement(j,{onSubmit:function(t){return e.processUrl(t)},url:this.state.url,onChange:function(t){return e.setState({url:t})},onImport:function(t){return e.import(t)}}),this.state.error&&r.a.createElement("div",{className:"error-message"},this.state.error),this.state.loading&&r.a.createElement("div",{className:"loading"},"Crunching Numbers"),!this.state.loading&&this.state.response&&r.a.createElement(k,{results:this.state.response.results,links:this.state.response.links,onValidate:function(t){return e.processUrl(t)},url:this.state.response.url,onDownload:function(){return e.downloadResponse()}}))}}]),t}(r.a.Component);s.a.render(r.a.createElement(N,null),document.getElementById("root"))}},[[18,1,2]]]);
//# sourceMappingURL=main.f90ebc4d.chunk.js.map