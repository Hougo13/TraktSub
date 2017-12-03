import { LogoHandler, Store } from './Util';
import { ServerSocket } from './Socket';

let addic7edApi = require('addic7ed-api');
let logo = new LogoHandler();
let store = new Store();

chrome.runtime.onConnect.addListener((port) => {
    let socket = new ServerSocket(port);

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
        if (languages) {
            if (languages.length > 0){
                addic7edApi.search(title, season, episode, languages).then((subtitles) => {
                    let languages = [];
                    subtitles.forEach((subtitle) => {
                        languages.push(subtitle.langId);
                    });
                    let url = subtitles[0] ? 'http://www.addic7ed.com'+subtitles[0].link : '';
                    callback(languages, url);
                    logo.endTask();
                });
            } else {
                logo.endTask();
            }
        } else {
            logo.endTask();
        }
    });
});

setInterval(() => {
    store.fetchAll();
},  15 * 60 * 1000);