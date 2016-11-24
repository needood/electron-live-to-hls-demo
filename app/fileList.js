const {ipcMain,dialog} = require('electron')
const fs = require('fs');

const db = require('./store')
ipcMain.on('asynchronous-message', (event, arg) => {
    if(arg.type==="dong"){
        var obj = []
        let fileList = dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
        for(var i in fileList){
            var file = fileList[i]
            obj.push({file});
        }
        db.insert(obj, function (err, newDoc) {   // Callback is optional
            db.find({}, function (err, docs) {
                var fileList = [];
                event.sender.send('asynchronous-reply', {
                    type:'dong',
                    fileList:docs
                })
            });
        });
    }else if(arg.type==="file2buffer"){
        fs.readFile(arg.file,function(err,data){
            buffer = new Buffer(data);
            event.sender.send('asynchronous-reply', {
                type:'fileBuffer',
                buffer
            });
        })
    }else if(arg.type==="getFiles"){
        db.find({}, function (err, docs) {
            var fileList = [];
            event.sender.send('asynchronous-reply', {
                type:'dong',
                fileList:docs
            })
        });
    }
})




