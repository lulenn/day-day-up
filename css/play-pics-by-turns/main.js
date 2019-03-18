/** mac双指：
 * up: WheelEvent.deltaY > 0
 * down: WheelEvent.deltaY < 0
 * left: WheelEvent.deltaX > 0
 * right: WheelEvent.deltaX < 0
 * deltaX / deltaY 值越大，表示滑得越长
 * **/

let nodes = document.getElementsByClassName('inner');
let len = nodes.length;
let index = 0;
let canTriggerAnimation = true;

let currentNode = nodes.item(index);
currentNode.style.width = '100vw';

let scrollFun = (e) => {
    if(canTriggerAnimation){
        canTriggerAnimation = false;
        setTimeout(() => canTriggerAnimation = true, 1000);
        if (e.deltaX > 0) {
            index = (index + 1) % len;
        }
        if (e.deltaX < 0) {
            index = (index - 1 + len) % len;
        }
        currentNode.style.width = '0px';
        currentNode = nodes.item(index);
        currentNode.style.width = '100vw';
        console.log(e, currentNode);

    }
    e.preventDefault();
};

document.addEventListener("mousewheel", scrollFun, false);