const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'client', 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if(file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // determine correct relative path to utils/helpers depending on the depth of the file
  const relativeDepth = path.relative(path.join(srcDir, 'utils'), path.dirname(file));
  // e.g. from components/forms to utils is ../../utils
  // but let's just cheat:
  // if in components/xxx or pages/xxx... wait
  const relativePathToSrc = path.relative(path.dirname(file), srcDir);
  // replace '/helpers'
  let helperPath = relativePathToSrc ? relativePathToSrc.replace(/\\/g, '/') + '/utils/helpers' : './utils/helpers';
  if (!helperPath.startsWith('.')) helperPath = './' + helperPath;
  content = content.replace(/'\/helpers'/g, "'" + helperPath + "'");

  // replace '/aiService' or whatever was '/ai-helpers'
  let aiServicePath = relativePathToSrc ? relativePathToSrc.replace(/\\/g, '/') + '/services/aiService' : './services/aiService';
  if (!aiServicePath.startsWith('.')) aiServicePath = './' + aiServicePath;
  content = content.replace(/'\/aiService'/g, "'" + aiServicePath + "'");
  content = content.replace(/'\/ai-helpers'/g, "'" + aiServicePath + "'");

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("Updated: " + file);
  }
});
