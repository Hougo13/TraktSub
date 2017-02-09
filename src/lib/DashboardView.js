import ShowCompare from './ShowCompare';

export default class {
    constructor() {

        this.items = [];

        this.elements = document.querySelectorAll('#ondeck-wrapper .grid-item');

        this.elements.forEach((element) =>{

            let container = document.createElement("div");
            container.className = "langs_container";
            container.style = "position: absolute; top: 0; margin-top: 6px;";
            container.innerHTML = '<img src="'+chrome.extension.getURL("icons/fre.png")+'" style="width: 40px;" id="lang_fre" hidden><img src="'+chrome.extension.getURL("icons/eng.png")+'" style="width: 40px;" id="lang_eng" hidden>';

            element.querySelector(".poster").append(container);

        });

        this.getAll();
    }

    getAll(){

        this.items = [];

        for (let element of this.elements){
            let num = element.getElementsByClassName('main-title-sxe')[0].innerHTML.split("x");
            let season = num[0];
            let episode = num[1];
            let title = element.querySelector('[itemprop="partOfSeries"] [itemprop="name"]').getAttribute('content');

            this.items.push({
                show: {title, season, episode},
                element
            });

        }
    }

    getList(callback){
        let result = [];

        this.getAll();

        this.items.forEach(({show}) => {
            result.push(show);
        });

        callback(result);
    }

    update(show, languages, redirectURL){
        let item = this.items.find((i) => {
            return ShowCompare(show, i.show);
        });

        let container = item.element.getElementsByClassName("langs_container");
        container[0].onclick = (e) => {
            e.preventDefault();
            window.open(redirectURL);
        };

        languages.forEach((lang) => {

            let flag = item.element.querySelector("#lang_"+lang);
            if (flag){
                flag.hidden = false;
            }
        });
    }
}