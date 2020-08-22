const { remote } = require('electron');
const { app } = require('electron');
const { dialog, Menu } = remote;
const fs = require('fs');
const os = require('os');
const windowTitle = document.getElementById("window-title");
const title = document.getElementById("note-title");
title.onchange = titleChanged;
const note = document.getElementById("note-content");
note.onchange = parse;
const preview = document.getElementById("preview");
const saveButton = document.getElementById("save-button");
saveButton.onclick = save;
const deleteButton = document.getElementById("delete-button");
deleteButton.onclick = deleteNote;

function titleChanged() {
    windowTitle.innerText = title.value;
}

function parse() {
    preview.innerHTML = '';
    let lines = note.value.split('\n')

    for(let line of lines) {
        if(line.startsWith("######")) {
            preview.innerHTML += "<h6 style='font-size: 22px;'>" + line.substring(6, line.length) + "</h6>";
        } else if(line.startsWith("#####")) {
            preview.innerHTML += "<h5 style='font-size: 24px;'>" + line.substring(5, line.length) + "</h5>";
        } else if(line.startsWith("####")) {
            preview.innerHTML += "<h4 style='font-size: 26px;'>" + line.substring(4, line.length) + "</h4>";
        } else if(line.startsWith("###")) {
            preview.innerHTML += "<h3 style='font-size: 28px;'>" + line.substring(3, line.length) + "</h3>";
        } else if(line.startsWith("##")) {
            preview.innerHTML += "<h2 style='font-size: 30px;'>" + line.substring(2, line.length) + "</h2>";
        } else if(line.startsWith("#")) {
            preview.innerHTML += "<h1 style='font-size: 32px;'>" + line.substring(1, line.length) + "</h1>";
        } else {
            preview.innerHTML += line;
        }
    }
}

async function save() {
    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save note',
        defaultPath: app.getPath('home') + '/Documents/' + windowTitle.innerText + '.md'
    });

    if(filePath) {
        fs.writeFile(filePath, note.value, () => null);
    }
}

async function deleteNote() {
    let choice = await dialog.showMessageBox(
        {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Confirm',
            message: 'Are you sure you want to delete your note?'
        });
    if (choice.response === 0) {
        window.location.href = "../../index.html";
    }
    console.log(choice.response === 1);
}