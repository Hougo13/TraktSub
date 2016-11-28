import * as render from "./render";
import {setLogo} from "./com";

let lastPathname = window.location.pathname;

route(lastPathname);

setInterval(() => {
    if(window.location.pathname != lastPathname){
        // console.log("location has change");
        lastPathname = window.location.pathname;
        route(lastPathname);
    }
}, 500);

function route(p){
    switch(p){
        case "/dashboard":
            render.Dashboard();
            break;
        default:
            // console.log("Can't render");
            setLogo("error");
    }
}