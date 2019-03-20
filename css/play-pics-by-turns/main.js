/** mac双指：
 * up: WheelEvent.deltaY > 0
 * down: WheelEvent.deltaY < 0
 * left: WheelEvent.deltaX > 0
 * right: WheelEvent.deltaX < 0
 * deltaX / deltaY 值越大，表示滑得越长
 * **/

let ul = document.getElementsByTagName('ul')[0];
let len = ul.childElementCount;
ul.insertBefore(ul.children[len-1].cloneNode(true), ul.children[0]);
ul.appendChild(ul.children[1].cloneNode(true));

let docArr = document.getElementsByClassName('doc')[0].children;
let index = 0;
let width = 400;

let changePic = (i) => {    //i: [-1, len]
    ul.style.transition = 'transform 300ms ease';
    ul.style.transform = `translateX(-${width * (i + 1)}px)`;
    docArr[index].className = '';
    if (i >= 0 && i <= len -1) {
        index = i;
        docArr[index].className = 'active';
        return;
    }
    //prevent visual noise when pic change from last one to the first one
    if (i < 0) {
        index = len - 1;
    }
    if (i > len - 1) {
        index = 0;
    }
    docArr[index].className = 'active';

    setTimeout(() => {
        ul.style.transition = '';
        ul.style.transform = `translateX(-${width * (index + 1)}px)`;
    }, 400);
};

let canTriggerAnimation = true; //prevent too many mouse wheel events triggered during a very short time
let scrollFun = (e) => {
    if(canTriggerAnimation){
        canTriggerAnimation = false;
        let x = e.deltaX;
        let y = e.deltaY;
        if (x > 0 || y > 0) {   //以x,y中绝对值较大的为准判断垂直或水平方向，以正负判断左右或上下
            changePic(index + 1);
        }
        if (x <= 0 && y <= 0) {
            changePic(index - 1);
        }
        setTimeout(() => canTriggerAnimation = true, 1000);
    }
    e.preventDefault();
};

//1.change picture while mouse wheel event triggered
document.addEventListener("mousewheel", scrollFun, false);
//2.auto change the picture every 4000ms
setInterval(() => changePic(index + 1), 2000);
//3.shange picture while user click the left/right button
document.getElementsByClassName('left')[0].addEventListener('click', () => changePic(index - 1));
document.getElementsByClassName('right')[0].addEventListener('click', () => changePic(index + 1));
