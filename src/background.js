var addic7edApi = require('addic7ed-api');

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function({type, request}) {
    if(type == "fetchsub"){
      addic7edApi.search(request.show, request.season, request.episode, request.languages).then(function (subtitlesList) {
        // console.log(subtitlesList);
        port.postMessage({request, result: subtitlesList});
      });
    }else if(type == "setlogo"){
      chrome.browserAction.setIcon({path: "logo/"+request+".png"});
    }
  });
});

chrome.tabs.onActivated.addListener(function (activeInfo){
  // console.log(activeInfo);
  chrome.tabs.get(activeInfo.tabId, function (tab){
    // console.log(tab);
    if(tab.url.includes("trakt.tv")){
      chrome.tabs.reload(activeInfo.tabId);
    }else{
      chrome.browserAction.setIcon({path: "logo/inactive.png"});
    }
  });
});