const EventEmitter = require('events');
import ShowCompare from './ShowCompare';

export default class extends EventEmitter {
    constructor(port){

        super();

        this.updating = {
            url: '',
            count: 0,
            root: false
        };

        this.port = port;
        this.tabId = port.sender.tab.id;

        this.port.onMessage.addListener(this.msg.bind(this));
        this.port.onDisconnect.addListener(this.disconnect.bind(this));
        chrome.tabs.onUpdated.addListener(this.urlListener.bind(this));

    }

    disconnect(){
        chrome.tabs.onUpdated.removeListener(this.urlChange);
        this.emit('disconnect');
    }

    msg(msg){
        switch (msg.type){
            case 'watch':
                this.watch(msg.payload);
                break;
            case 'clear':
                this.clear();
                break;
        }
    }

    watch(shows) {
        this.emit('watch', {shows});
    }

    urlListener(tabId, changeInfo){
        if (tabId == this.tabId) {
            if (changeInfo.status == 'loading' && changeInfo.url) {

                this.updating.url = changeInfo.url;

                if (!this.updating.root) {
                    this.updating.count = 4;
                    if (this.updating.url == "https://trakt.tv/") {
                        this.updating.count = 6;
                        this.updating.root = true;
                    }
                }
            } else {
                this.updating.count--;
                if (this.updating.count == 0) {
                    this.send('url', {url: this.updating.url});
                    console.log(tabId+': '+this.updating.url);
                    this.updating.root = false;
                }
            }
        }
    }

    send(type, payload){
        this.port.postMessage({type, payload});
    }

    update(params){
        this.send('update', params);
    }

}