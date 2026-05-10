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

  const relativePathToSrc = path.relative(path.dirname(file), srcDir);
  
  let constPath = relativePathToSrc ? relativePathToSrc.replace(/\\/g, '/') + '/utils/constants' : './utils/constants';
  if (!constPath.startsWith('.')) constPath = './' + constPath;
  
  // replace incorrect '../utils/constants' or './utils/constants' with correct one if it's not already correct
  // Actually, let's just use regex to replace all existing constant paths.
  content = content.replace(/['"]\.\.\/utils\/constants['"]/g, "'" + constPath + "'");
  content = content.replace(/['"]\.\/utils\/constants['"]/g, "'" + constPath + "'");

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("Updated: " + file);
  }
});
