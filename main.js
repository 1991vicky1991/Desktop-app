const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const { exec } = require("child_process");

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "First App",
    height: 600,
    width: 1000,
    fullscreen: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.setContentProtection(true);
  mainWindow.webContents.openDevTools();
  // mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  // mainWindow.setAlwaysOnTop(true, "screen-saver", 2);

  // app.on("second-instance", (event, commandLine) => {
  //   if (process.platform == "win32" || process.platform == "linux") {
  //     // Protocol handler for win32/linux
  //     // argv[1] is the URL
  //     console.log("commandLine: ", commandLine[1]);
  //     handleDeepLink(commandLine[1], mainWindow);
  //   }
  // });

  // if (process.platform === "darwin") {
  //   // Protocol handler for macOS
  //   app.on("open-url", (event, url) => {
  //     event.preventDefault();
  //     handleDeepLink(url, mainWindow);
  //   });
  // }

  // const startUrl = url.format({
  //   pathname: path.join(__dirname, "index.html"),
  //   protocol: "file",
  // });

  const startUrl = url.format({
    pathname: path.join(__dirname, "./my-app/build/index.html"),
    protocol: "file",
  });

  mainWindow.loadURL(startUrl);
};

// function handleDeepLink(url, mainWindow) {
//   // Extract the data from the URL
//   console.log("Deep link URL:", url);
//   const data = url.split("//")[1];
//   console.log("Deep link URL data:", data);
//   mainWindow.webContents.send("deep-link-data", data);
// }

const getRunningApps = (win) => {
  exec(
    `osascript -e 'tell application "System Events" to get name of every process whose background only is false' && osascript -e 'if application "screencaptureui" is running then return "screencaptureui"'`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Access denied Error: ${err}`, stderr);
        return;
      }
      console.log(stdout);
      win.send("running-apps-update", stdout);
    }
  );
};

app.whenReady().then(() => {
  createMainWindow();
  app.setAsDefaultProtocolClient("edmingleDesktopPoc");
});
ipcMain.on("request-running-apps", (event) => {
  getRunningApps(event.sender);
});