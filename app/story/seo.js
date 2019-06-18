const fs = require("fs");
const config = require("js-yaml").load(fs.readFileSync("app/story/rules.yml"));
/* 
{
  "group": "title",
  "errors": {
      "presence": true,
      "focus": true
  },
  "warnings": {
      "min_count": 10,
      "max_count": 80
  } */


  function wordCount (s)  {
    return s.split(/\s+/).filter(function(word) {
      return word !== "";
    }).length;
  };

function validateTitle(text,focus,{group,errors,warnings},output) {
  [[errors, output[group].errors], [warnings, output[group].warnings]].forEach(([rules, outputList]) => {
    //console.log("rules>>>",rules)
    if(!rules)
      return;

    if(rules.presence && (text === null || text.length === 0)) {
      outputList.push(`Empty ${group}`);
    }else if(rules.presence && text.length > 0) {
      output[group].goodies.push(`You've entered ${group}`);
    }

    if(rules.focus && !text.includes(focus)) {
      outputList.push(`${group} doesn't contains focus keyword.`); 
    }else if (rules.focus) {
      output[group].goodies.push(`${group} contains focus keyword.`);
    }

    if(rules.min_count &&  text.length < rules.min_count) {
      outputList.push(`The ${group} is too short.`);
    }else if(rules.max_count && text.length > rules.max_count) {
      output[group].goodies.push(`The ${group} is too long.`);
    }else if(rules.min_count && rules.max_count && text.length > rules.min_count && text.length <= rules.max_count) {
      output[group].goodies.push(`The ${group} length is perfect.`);
    }

    if(rules.min_word_count &&  wordCount(text) < rules.min_word_count) {
      outputList.push(`The ${group} word count is too short.`);
    }else if(rules.min_word_count) {
      output[group].goodies.push(`The ${group} word count is perfect.`);
    }
       
  })
} 

function runValidator(story,focus) {
  let title = {errors: [],warnings: [], goodies: []},
      metadata ={errors: [],warnings: [], goodies: []},
      content ={errors: [],warnings: [], goodies: []};
  //const {title1 , metadata1, content1} = story;
  const rules = config["seo"].rules;

  rules.forEach(rule => {
    //console.log("rule>>>",rule);
     return validateTitle(story[rule.group], focus, rule, {title, metadata, content});
  });
  return {title, metadata, content};
}

function getStorySeo(story, focus) {
  return runValidator(story,focus);
  //{story,focus, config};

}

module.exports = getStorySeo;