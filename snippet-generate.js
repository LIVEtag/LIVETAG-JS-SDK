const { readFile, writeFile } = require('fs/promises');
const env = require('./env');
const [, , templateSrc, outputSrc] = process.argv;

const readTemplate = async (file) => readFile(file).then((res) => res.toString());
const writeSnippet = (file) => async (content) => writeFile(file, await content);
const replaceVariables = (vars) => async (content) =>
  Object.entries(vars).reduce((content, [key, value]) => content.replace(`{${key}}`, value), await content);

[writeSnippet(outputSrc), replaceVariables(env), readTemplate]
  .reduceRight((res, fn) => fn(res), templateSrc)
  .then(() => {
    console.log(`Snippet "${outputSrc}" created.`);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
