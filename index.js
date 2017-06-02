const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const devtools = require('vue-devtools');

let win;

const createWindow = () => {
    win = new BrowserWindow({ width: 800, height: 600 });
    // win.loadURL(url.format({
    //     pathname: path.resolve(__dirname, 'dist/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }));

    devtools.install();

    // Connect to port hosted by webpack-dev-server for HMR
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
};

app.on('ready', createWindow);

app.on('closed', () => {
    win = null;
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (win === null) createWindow();
});

