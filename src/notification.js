import {isElectron} from "./utils";


export const alert = isElectron?(function(){

    const {
        ipcRenderer
    } = require('electron');

    return function (msg){
        ipcRenderer.send('asynchronous-message', {
            type: 'alert',
            msg
        });

    };
})():alert;
