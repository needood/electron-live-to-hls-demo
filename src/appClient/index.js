const {
    ipcRenderer
} = require('electron');
const Handlebars = require('handlebars');
ipcRenderer.send('asynchronous-message', {
    type: 'getFiles'
});

function importFiles() {
    ipcRenderer.send('asynchronous-message', {
        type: 'dong'
    });
}

const itemTpl = Handlebars.compile(`<p>
{{#each fileList}}
<div class="js-file" data-id={{_id}}>{{file}}</div>
{{/each}}
</p>`)

const Noodle = require('noodle');

Noodle("#file-list").$on('click','.js-file',function(e){

    ipcRenderer.send('asynchronous-message', {
        type: 'file2buffer',
        file:e.target.innerHTML
    });

});
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    if(arg.type==="dong"){
        const fileListEl = document.getElementById("file-list")
        fileListEl.innerHTML=itemTpl(arg)
    }else if(arg.type==="fileBuffer"){
        recorder.background(toArrayBuffer(arg.buffer))
    }
})
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}
