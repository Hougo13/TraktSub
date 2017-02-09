import ShowCompare from './ShowCompare';

export default class {
    constructor() {

        this.items = [];

        this.elements = document.querySelectorAll('#progress-wrapper .row.posters.fanarts.twenty-four-cols.grid-item.no-overlays');

        this.elements.forEach((element) =>{

            let container = document.createElement("div");
            container.className = "langs_container";
            container.style = "position: absolute; top: 0; margin-top: 6px;";
            container.innerHTML = '<img src="'+chrome.extension.getURL("icons/fre.png")+'" style="width: 40px;" class="flag" id="lang_fre" hidden><img src="'+chrome.extension.getURL("icons/eng.png")+'" style="width: 40px;" class="flag" id="lang_eng" hidden>';

            element.querySelector(".fanart").append(container);
        });

        this.getAll();
    }

    getAll(){

        this.items = [];

        for (let element of this.elements){
            let num = element.querySelector('[itemprop="episode"] .main-title-sxe').innerHTML.split("x");
            let season = num[0];
            let episode = num[1];
            let title = element.querySelector('.show-title a').innerHTML;

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

        let flags = item.element.getElementsByClassName("flag");
        for (let flag of flags) {
            flag.hidden = true;
        }

        languages.forEach((lang) => {

            let flag = item.element.querySelector("#lang_"+lang);
            if (flag){
                flag.hidden = false;
            }
        });
    }
}