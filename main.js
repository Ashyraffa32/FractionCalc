// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 820,
    height: 600,
    resizable: true,
    icon: path.join(__dirname, 'fractioncalc.ico'),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  win.setMenu(null); 
  win.loadFile('main/index.html');
}


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
