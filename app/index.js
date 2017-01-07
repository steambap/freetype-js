'use strict';
const electron = require('electron');
const {app, BrowserWindow} = electron;

let win;

function createWindow() {
	win = new BrowserWindow({width: 800, height: 600});
	win.maximize();

	win.loadURL(`file://${__dirname}/index.html`);

	win.on('closed', () => win = null);
}

app.on('ready', createWindow);
