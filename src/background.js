'use strict'

import {app, protocol, BrowserWindow} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import * as electron from "electron";
import Http from '@/backend/helpers/http'

import * as fs from 'node-fs';

let list;
let win;

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])


async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 500,
        height: 300,
        frame: false,
        resizable: false,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.setMenuBarVisibility(false);
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow();

    if (fs.existsSync('presetList.dat')) {
        list = fs.readFileSync('presetList.dat', 'utf-8');
    }

    electron.ipcMain.on('get-events', async (event, arg) => {
        switch (arg.action) {
            case ('getList'):
                if (fs.existsSync('presetList.dat')) {
                    event.reply('get-events', {action: 'getList', list: JSON.parse(list)});
                    break
                }
                let ratesList = [];
                let symbolsList = [];
                let flag;

                let rates = await Http.parseRates();
                let symbols = await Http.parseSymbols();

                for (let rate in rates.rates) {
                    ratesList.push({name: rate, amount: rates.rates[rate]});
                }
                let cycle = false;
                for (let symbol in symbols.symbols) {
                    if (symbol !== 'BTC') {
                        flag = await Http.parseFlagByFullName(symbol);
                    }
                    symbolsList.push({value: symbol, text: symbols.symbols[symbol], flag: flag});
                    if (cycle === false) {
                        let listLength = Object.keys(symbols.symbols).length;
                        event.reply('get-events', {action: 'get-progressBar-update', value: 1, max: listLength});
                        cycle = true;
                    } else {
                        event.reply('get-events', {action: 'get-progressBar-update', value: 1});
                    }

                }

                fs.writeFileSync('presetList.dat', JSON.stringify({rates: ratesList, symbols: symbolsList}), 'utf-8')

                event.reply('get-events', {action: 'getList', rates: ratesList, symbols: symbolsList});
                break
        }
    })

    electron.ipcMain.on('service-events', (event, arg) => {
        switch (arg.action) {
            case ('close-win'):
                win.destroy();
                break
            case ('hide-win'):
                win.minimize();
                break
        }
    })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
