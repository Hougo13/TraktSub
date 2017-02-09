import Socket from './lib/ClientSocket';
import Dashboard from './lib/DashboardView';
import Progress from './lib/ProgressView';

let socket = new Socket();

let init_url = window.location.href;

let view = getView(init_url);

getAll();

socket.on('update', ({show, languages, url}) => {
    if (view) view.update(show, languages, url);
    console.log(show, languages);
});

socket.on('urlChange', ({url}) => {
    console.log(url);
    view = getView(url);
    getAll();
});


function getView(url) {
    switch (true){
        case /https:\/\/trakt\.tv\/dashboard/.test(url):
            return new Dashboard();
        case /https:\/\/trakt\.tv\/users\/\w+\/progress/.test(url):
            return new Progress();
        default :
            return false
    }
}

function getAll() {
    console.log(view);
    if (view) {
        view.getList((list) => {
            socket.watch(list);
        });
    }
}

console.log('traktsub loaded');
