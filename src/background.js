import Logo from './lib/LogoHandler';
import Socket from './lib/ServerSocket';
import Store from './lib/Store';

let addic7edApi = require('addic7ed-api');
let logo = new Logo();
let store = new Store();

chrome.runtime.onConnect.addListener((port) => {
    let socket = new Socket(port);

    let collection = store.newCollection();

    collection.setUpdater((item) => {
        console.log(item);
        socket.update(item);
    });

    socket.on('watch', ({shows}) => {
        collection.set(shows);
        //console.log(store);
    });

    socket.on('disconnect', () => {
        collection.destroy();
    });
});

store.setFetcher(({title, season, episode}, callback) => {
    logo.startTask();
    chrome.storage.sync.get('languages', ({languages}) => {
        addic7edApi.search(title, season, episode, languages).then((subtitles) => {
            let languages = [];
            subtitles.forEach((subtitle) => {
                languages.push(subtitle.langId);
            });
            let url = subtitles[0] ? 'http://www.addic7ed.com'+subtitles[0].link : '';
            callback(languages, url);
            logo.endTask();
        });
    });
});

setInterval(() => {
    store.fetchAll();
},  15 * 60 * 1000);