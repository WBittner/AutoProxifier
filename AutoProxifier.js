const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const rp = require('request-promise');

exports.onLoad = function (mainWindow) {
    let deckList = "Chained To The Rocks";
    askForStub(mainWindow);

    ipcMain.on("deckStub", (event, deckStub) => {
        getDeckListPromise(mainWindow, deckStub || "greenless-eggs-and-ham") //default to eggs deck if none supplied
            .then(cleanDeckList)
            .then(function (cleanedDeckList) {
                deckList = cleanedDeckList || deckList;
                mainWindow.loadURL(path.join(__dirname, "proxyList.html"));
            });
    });

    ipcMain.on("cancel", (event, arg) => {
        mainWindow.close();
    });

    ipcMain.on("deckListQuery", (event, arg) => {
        event.sender.send("deckListReply", deckList);
    });

    ipcMain.on("show", (event, arg) => {
        mainWindow.maximize();
        mainWindow.show();
    });
}

function askForStub(mainWindow) {
    let deckStubPrompt = new BrowserWindow({
        parent: mainWindow,
        width: 250,
        height: 125,
        resizable: false,
        moveable: true,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        minimizable: false
    });

    deckStubPrompt.loadURL(path.join(__dirname, "stubPrompt.html"));
}

function getDeckListPromise(window, stub) {
    window.loadURL("http://tappedout.net");

    return rp("http://tappedout.net/mtg-decks/" + stub + "/?fmt=txt");
}

function cleanDeckList(rawDeckList) {
    return rawDeckList.trim();
}
