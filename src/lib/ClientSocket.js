const EventEmitter = require('events');
import ShowCompare from './ShowCompare';

export default class extends EventEmitter {
    constructor(){

        super();

        this.port = chrome.runtime.connect({name: 'traktsub'});
        this.port.onMessage.addListener(this.msg.bind(this));

    }

    msg(msg){
        switch (msg.type){
            case 'update':
                this.update(msg.payload);
                break;
            case 'url':
                this.url(msg.payload);
                break;
        }
    }

    watch(shows) {
        this.send('watch', shows);
    }

    send(type, payload){
        this.port.postMessage({type, payload});
    }

    update(payload){
        this.emit('update', payload);
    }

    url(payload){
        this.emit('urlChange', payload);
    }

}