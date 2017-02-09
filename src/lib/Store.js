import ShowCompare from './ShowCompare';

export default class {
    constructor(){
        this.id_counter = 0;
        this.data = [];
        this.collections = [];
        this.fetcher;
    }

    newCollection(){
        let id = this.id_counter++;
        let collection = new Collection(this, id);
        this.collections.push(collection);

        return collection;
    }

    setFetcher(func){
        this.fetcher = func;
    }

    fetch(show){
        let d = this.data.find((d) => {
            return ShowCompare(d.show, show);
        });

        this.fetcher(show, (languages, url) => {
            d.languages = languages;
            d.url = url;
            this.publish(d);
        });
    }

    fetchAll(){
        this.data.forEach((d) => {
            if (d.subscribers.length > 0){
                this.fetch(d.show);
            }
        });
    }

    publish({show, subscribers, languages, url}){
        subscribers.forEach((subscriber) => {
            let collection = this.collections.find((collec) => {
                return collec.id == subscriber;
            });

            collection.update({show, languages, url});
        });
    }

    subscribe(show, id){
        let sh = this.data.find((d) => {
            return ShowCompare(d.show, show);
        });

        if (sh) {
            sh.subscribers.push(id);
        } else {
            sh = {show, languages: [], subscribers: [id], url: ''};
            this.data.push(sh)
        }

        this.fetch(show);
        this.publish(sh);
    }

    unsubscribeAll(id){
        this.data.forEach((d) => {
            let index = d.subscribers.indexOf(id);
            if (index > -1) d.subscribers.splice(index, 1);
        })
    }
}

class Collection {
    constructor(store, id){
        this.id = id;
        this.store = store;
        this.updater;
    }

    set(shows){
        this.store.unsubscribeAll(this.id);
        shows.forEach((show) => {
            this.store.subscribe(show, this.id);
        });
    }

    update(msg){
        this.updater(msg);
    }

    setUpdater(func){
        this.updater = func;
    }

    destroy() {
        this.store.unsubscribeAll(this.id);
    }
}