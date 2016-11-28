let port = chrome.runtime.connect();

export function FetchSubtitles(show, season, episode, languages, callback){

    let request = {show, season, episode, languages};
    port.postMessage({
        type: "fetchsub",
        request
    });

    // console.log("Search for "+show+" "+season+"x"+episode);

    port.onMessage.addListener(result);
    function result(res){
        if(res.request.show == request.show){
            port.onMessage.removeListener(result);      
            callback(res.result);
        }
    }
}

export function setLogo(name){
    // console.log("SetLogo to "+name);
    port.postMessage({
        type: "setlogo",
        request: name
    });
}