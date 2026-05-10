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

  // Replace components/CustomCursor -> components/ui/CustomCursor
  content = content.replace(/['"](.*?)components\/CustomCursor['"]/g, "'/ui/CustomCursor'");
  content = content.replace(/['"](.*?)components\/ErrorBoundary['"]/g, "'/ui/ErrorBoundary'");
  content = content.replace(/['"](.*?)components\/LoadingOverlay['"]/g, "'/ui/LoadingOverlay'");
  content = content.replace(/['"](.*?)components\/ChatPanel['"]/g, "'/chat/ChatPanel'");
  content = content.replace(/['"](.*?)components\/MeetingScheduler['"]/g, "'/forms/MeetingScheduler'");
  content = content.replace(/['"](.*?)components\/MyMeetings['"]/g, "'/dashboard/MyMeetings'");
  content = content.replace(/['"](.*?)components\/PPTMaker['"]/g, "'/dashboard/PPTMaker'");

  // Replace lib/utils -> utils/helpers
  content = content.replace(/['"](.*?)lib\/utils['"]/g, "'/helpers'");
  // Replace lib/ai-helpers -> services/aiService
  content = content.replace(/['"](.*?)lib\/ai-helpers['"]/g, "'/aiService'");
  // Replace ./data -> ./utils/constants or ../utils/constants
  content = content.replace(/['"](\.\/|\.\.\/|\.\.\/\.\.\/)data['"]/g, "'/constants'");
  // Replace ./firebase -> ./services/firebase
  content = content.replace(/['"](\.\/|\.\.\/|\.\.\/\.\.\/)firebase['"]/g, "'/firebase'");

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("Updated: " + file);
  }
});
