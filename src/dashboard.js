import {FetchSubtitles, setLogo} from "./com"

export default function Dashboard(){

    let episodes = document.querySelectorAll('#ondeck-wrapper .grid-item')
    let total = episodes.length;
    let rendered = 0;

    // console.log("Searching...")
    setLogo("pending");


    episodes.forEach((episode) =>{

        let num = episode.getElementsByClassName('main-title-sxe')[0].innerHTML.split("x");
        let season = num[0];
        let ep = num[1];    
        let title = episode.querySelector('[itemprop="partOfSeries"] [itemprop="name"]').getAttribute('content')

        let container = document.createElement("div");
        container.className = "langs_container";
        container.style = "position: absolute; top: 0; margin-top: 6px;";
        container.innerHTML = '<img src="'+chrome.extension.getURL("icons/fre.png")+'" style="width: 40px;" id="lang_fre" hidden><img src="'+chrome.extension.getURL("icons/eng.png")+'" style="width: 40px;" id="lang_eng" hidden>';

        episode.querySelector(".poster").append(container);

        FetchSubtitles(title, season, ep, ["fre","eng"], (res) => {
            let redirectURL;
            
            if (res.length){
                redirectURL = "http://www.addic7ed.com"+res[0].link;
                let freSub = res.find((element, index)=>{
                    return element.langId == "fre"; 
                });
                let engSub = res.find((element, index)=>{
                    return element.langId == "eng"; 
                });

                if(freSub){
                    let freFlag = episode.querySelector("#lang_fre");
                    freFlag.hidden = false;
                }
                if(engSub){
                    let engFlag = episode.querySelector("#lang_eng");
                    engFlag.hidden = false;
                }
            }
            
            container.addEventListener("click", function(event){
                event.preventDefault();
                window.open(redirectURL);
            });

            rendered++;
            if(rendered == total){
                // console.log("Finished");
                setLogo("active");
            }
        });

    });
}