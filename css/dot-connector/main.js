const stop = document.getElementById("stop"),
    start = document.getElementById("start"),
    restart = document.getElementById("restart"),
    reset = document.getElementById("reset");
const content = document.getElementById('content');
let htmlStore;

let listen = function () {
    let lines = document.getElementsByClassName('line');
    let len = lines.length;
    if (lines && lines.length) {
        start.onclick = function() {
            for (let index = 0; index < len; index ++) {
                lines.item(index).classList.remove('stop');
            }
        };
        stop.onclick = function() {
            for (let index = 0; index < len; index ++) {
                lines.item(index).classList.add('stop');
            }
        };
        restart.onclick = function () {
            if (htmlStore) {
                content.innerHTML = htmlStore;
            }
        }
        reset.onclick = function () {
            draw();
        }
    }
};

let draw = function () {
    let dataCount = 5, dataSet = [],
        height = content.offsetHeight,
        width = content.offsetWidth,
        lastX = 0, lastY = 0, length = 0, time = 0,
        heightSpace = height / dataCount,
        widthSpace = width / dataCount;
    let html = '', template = '<div class="dot-line-wrapper" id="data{{index}}">\n' +
                    '<div class="dot" style="left: {{dotLeft}}px; top: {{dotTop}}px"></div>' +
            '            <svg height="{{h}}" width="{{w}}">\n' +
            '                <line class="line active" x1="{{x1}}" y1="{{y1}}" x2="{{x2}}" y2="{{y2}}" style="stroke: blue; animation-delay: {{delay}}s;"/>\n' +
            '            </svg>\n' +
            '        </div>\n';

    for (let i = 0; i < 100; i++) {
        let x = ( Math.random() + 0.5 ) / 2 * widthSpace,
            y = Math.random() * height;
        if (length + x > width) {
            break;
        } else {
            dataSet.push([x, y]);
            html = html + template
                .replace('{{index}}', i)
                .replace('{{w}}', x)
                .replace('{{h}}', height)
                .replace('{{dotLeft}}', x - 2)  //dot width = height = 4px
                .replace('{{dotTop}}', height - y - 2)
                .replace('{{x1}}', 0)
                .replace('{{y1}}', height - lastY)
                .replace('{{x2}}', x)
                .replace('{{y2}}', height - y)
                .replace('{{delay}}', time);
            length += x;
            time += Math.sqrt((Math.pow(x, 2) + Math.pow(lastY-y, 2))) / 1000 * 10;
            lastX = x;
            lastY = y;
        }
    }

    htmlStore = html;
    content.innerHTML = html;
    listen();
};

draw();