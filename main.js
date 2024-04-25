const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const { exec } = require("child_process");
const os = require('os');

// function killProcessByPid(pid) {
//   const command = `taskkill /PID ${pid} /F /T`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error('Error killing process:', stderr);
//       // callback(error, null);
//       return;
//     }
//     // callback(null, stdout);
//   });
// }

// const processData = (data) => {
//   // Use map to transform each item in the array
//   return data.map(item => {
//       // Trim whitespace and carriage returns, then split by spaces
//       const parts = item.trim().split(/\s+/);
//       // The process name is typically the second element after the initial space and ID
//       return parts.length > 1 ? parts[1] : undefined;
//   }).filter(name => name !== undefined); // Filter out any undefined values (empty lines)
// };


const getRunningApps = (win) => {
  let command;
  if(os.platform() === "darwin") {
    command =  `osascript -e 'tell application "System Events" to get name of every process whose background only is false' && osascript -e 'if application "screencaptureui" is running then return ",screencaptureui"'`
  } else if(os.platform() === "win32") {
    // command = `powershell "gps | where {($_.MainWindowTitle -ne '')} | select ProcessName, MainWindowTitle -Unique"`;
    command = `powershell "gps | where { $_.MainWindowHandle -ne 0 -and $_.MainWindowTitle -ne '' } | select Id, ProcessName, MainWindowTitle -Unique | Format-Table -HideTableHeaders"`;
  }
  exec(
   command,(err, stdout, stderr) => {
      if (err) {
        console.error(`Access denied Error: ${err}`, stderr);
        return;
      }
      // if(os.platform() === 'win32') {
      //   const lines = stdout.split('\n').slice(1).filter(Boolean);
      //   let windowsApp = processData(lines).join(', ');
      //   // lines.map((item) => {
      //   //   windowsApp = windowsApp + item[1].join(",")
      //   // })
      //   console.log("lnes re: ", windowsApp);
      //   // const processes = lines.map(line => {
      //   //   const [id, name, title] = line.trim().split(/\s+/).map(item => item.trim());
      //   //   // console.log('name is: ',id,  name);
      //   //   if(name !== 'electron' && name !== 'Code' && name !== 'chrome' && id > 0) {
      //   //     killProcessByPid(id);
      //   //   }
          
      //   // });
      //   win.send("running-apps-update", windowsApp);
      // }
      win.send("running-apps-update", stdout);
    }
  );
};
const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 1000,
    icon:path.join(__dirname, "./my-app/assets/images/splash.png"),
    title: "Aldine CA",
    fullscreen: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.setContentProtection(true);
  mainWindow.webContents.openDevTools();

  const startUrl = url.format({
    pathname: path.join(__dirname, "./my-app/build/index.html"),
    protocol: "file",
  });

  mainWindow.loadURL(startUrl);
};



app.whenReady().then(() => {
  createMainWindow();
});
ipcMain.on("request-running-apps", (event) => {
  getRunningApps(event.sender);
});
