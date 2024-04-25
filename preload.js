const { contextBridge, ipcRenderer } = require("electron");
const os = require('os');

contextBridge.exposeInMainWorld("api", {
  getOs: () => os.platform(),
  
  requestRunningApps: () => ipcRenderer.send("request-running-apps"),
  onRunningAppsUpdate: (callback) =>
    ipcRenderer.on("running-apps-update", (event, data) => callback(data)),
  deeplinks: (callback) =>
    ipcRenderer.on("deep-link-data", (event, data) => {
      callback(data);
    }),
});
