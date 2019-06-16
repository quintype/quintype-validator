const fs = require("fs");
const config = require("js-yaml").load(fs.readFileSync("config/rules.yml"));

function getContent($, element, contentAttr) {
  return (contentAttr == 'body' ? $(element).html() : $(element).attr(contentAttr)) || '';
}

/* 
head title >>>selector
body >>>contentAttr
body title >>>selector
body >>>contentAttr
body h1 >>>selector
body >>>contentAttr
meta[name=description] >>>selector
content >>>contentAttr
html[lang] >>>selector
lang >>>contentAttr
meta[name=robots] >>>selector
content >>>contentAttr
head link[rel=canonical] >>>selector
href >>>contentAttr
img >>>selector
alt >>>contentAttr
iframe >>>selector
src >>>contentAttr
head meta[name=viewport] >>>selector
content >>>contentAttr
*/
function getGroupedMessage (message, contentAttr){
  if (contentAttr == 'body'){
    return {message: message,group: 'content'}
  }
    return {message: message,group: 'metadata'}
    }
    //validateDom(dom, rule, url, {errors, warnings, debug});
    function validateNewDom($, {selector, contentAttr, errors, warnings}, url, outputLists) {
      const elements = $(selector);
      
     // console.log(selector, ">>>selector");
      //console.log(contentAttr, ">>>contentAttr");
      [[errors, outputLists.errors], [warnings, outputLists.warnings]].forEach(([rules, outputList]) => {
        if(!rules)
        return;
        
        if(rules.presence && elements.length == 0){
          return outputList.push(getGroupedMessage(`Could not find an element with selector ${selector}`, contentAttr));      
        }
        
        
        if(rules.count != null && elements.length != rules.count) {
          return outputList.push(getGroupedMessage(`Expected to find ${rules.count} elements with selector ${selector}, got ${elements.length}`, contentAttr));
        }
        
        
        elements.each((i, element) => {
          const content = getContent($, element, contentAttr);
          
          // Reuse this?
          if((rules.presence || rules.presence_if_node_exists) && (!content || content == '')) {
            return outputList.push(getGroupedMessage(`Found an empty ${selector} (attribute ${contentAttr})`, contentAttr))
          }
          
          
          if(rules.length_le && content.length > rules.length_le) {
            return outputList.push(getGroupedMessage(`Content in ${selector} is longer than ${rules.length_le}`, contentAttr));
          }
          
          
          
          if(rules.value == 'url' && content != url) {
            return outputList.push(getGroupedMessage(`Content in ${selector} should have value ${url} (got ${content})`, contentAttr));
          }
          
          if(rules.different_from) {
            const otherElements = $(rules.different_from.selector);
            otherElements.each((i, otherElement) => {
              const otherContent = getContent($, otherElement, rules.different_from.contentAttr);
              if(content == otherContent) {
                return outputList.push(getGroupedMessage(`Content in ${selector} should not have the same value as ${rules.different_from.selector}`, contentAttr));
              }
            });
          }
        });
      });
    }
    
    
    function runNewValidator(category, dom, url, response) {
      var errors = [];
      var warnings = [];
      const debug = {};
      const rules = config[category].rules;
      
      rules.forEach(rule => {
        switch(rule.type) {
          case 'dom': return validateNewDom(dom, rule, url, {errors, warnings, debug});
          default: throw `Unknown rule type: ${rule.type}`;
        }
      });
      
      return {errors, warnings, debug};
    }
    
    module.exports = runNewValidator;