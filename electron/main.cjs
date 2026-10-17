const { app, BrowserWindow, shell } = require('electron')
const path = require('node:path')

const devServerUrl = 'http://127.0.0.1:5174/'
let mainWindow

function openExternalUrl(url) {
  if (!/^(https?:\/\/|mailto:|tel:)/i.test(url)) return
  shell.openExternal(url).catch(error => {
    console.error('Unable to open external link:', error)
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 900,
    minHeight: 650,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#080e15',
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternalUrl(url)
    return { action: 'deny' }
  })
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const isDevRoute = !app.isPackaged && url.startsWith(devServerUrl)
    const isCurrentPackagedDocument = app.isPackaged
      && url === mainWindow.webContents.getURL()

    if (isDevRoute || isCurrentPackagedDocument) return

    event.preventDefault()
    openExternalUrl(url)
  })

  const loadTarget = app.isPackaged
    ? path.join(__dirname, '..', 'dist', 'index.html')
    : devServerUrl

  const load = app.isPackaged
    ? mainWindow.loadFile(loadTarget)
    : mainWindow.loadURL(loadTarget)

  load.catch(error => {
    console.error('Unable to load Logic Forge:', error)
    app.quit()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
