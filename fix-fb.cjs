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
  
  let fbPath = relativePathToSrc ? relativePathToSrc.replace(/\\/g, '/') + '/services/firebase' : './services/firebase';
  if (!fbPath.startsWith('.')) fbPath = './' + fbPath;
  content = content.replace(/'\/firebase'/g, "'" + fbPath + "'");

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("Updated: " + file);
  }
});
