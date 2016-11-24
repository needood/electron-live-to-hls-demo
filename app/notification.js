
const notifier = require('node-notifier');
    // Module to control application life.
const {
    ipcMain
} = require('electron');
ipcMain.on('asynchronous-message', (event, arg) => {
    if(arg.type==="alert"){
        notifier.notify({
            title: 'lalala',
            message: arg.msg,
            //icon: path.join(__dirname, 'coulson.jpg')
        });
    }
});
