export class LogoHandler {
    constructor() {
        this.state = 'active';
        this.tasks = 0;
    }

    startTask(){
        this.tasks++;
        this.set('pending');
    }

    endTask(){
        this.tasks--;
        if (this.tasks == 0) this.set('active');
    }

    set(state){
        if (state != this.state){
            this.state = state;
            this.refresh();
        }
    }

    refresh(){
        chrome.browserAction.setIcon({path: "logo/"+this.state+".png"});
    }
}