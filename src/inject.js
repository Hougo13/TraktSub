import { ClientSocket } from './Socket';
import { DashboardView, ProgressView } from './View';

let socket = new ClientSocket();

let init_url = window.location.href;

let view = getView(init_url);

getAll();

socket.on('update', ({show, languages, url}) => {
    if (view) view.update(show, languages, url);
    //console.log(show, languages);
});

socket.on('urlChange', ({url}) => {
    //console.log(url);
    view = getView(url);
    getAll();
});


function getView(url) {
    switch (true){
        case /https:\/\/trakt\.tv\/dashboard/.test(url):
            return new DashboardView();
        case /https:\/\/trakt\.tv\/users\/\w+\/progress/.test(url):
            return new ProgressView();
        default :
            return false
    }
}

function getAll() {
    if (view) {
        view.getList((list) => {
            socket.watch(list);
        });
    }
}

console.log('traktsub loaded');
