class DateHead {
    date;
    node;
    constructor(props) {
        this.date = props;
        this.render();
    }

    render() {
        let node = document.createElement('div');
        node.id = 'dp-head';

        let leftNode = document.createElement('div');
        leftNode.id = 'dp-head-left';
        leftNode.appendChild( this.renderIcon(() => { this.changeDate(-2); }, 'left-year-icon', '<<') );
        leftNode.appendChild( this.renderIcon(() => { this.changeDate(-1) }, 'left-month-icon', '<') );
        node.appendChild(leftNode);

        let titleNode = document.createElement('div');
        titleNode.id = 'dp-head-title';
        titleNode.innerText = this.date.getFullYear() + '年' + (this.date.getMonth() + 1) + '月';
        node.appendChild(titleNode);

        let rightNode = document.createElement('div');
        rightNode.id = 'dp-head-right';
        rightNode.appendChild( this.renderIcon(() => { this.changeDate(1) }, 'right-month-icon', '>') );
        rightNode.appendChild( this.renderIcon(() => { this.changeDate(2) }, 'right-year-icon', '>>') );
        node.appendChild(rightNode);

        this.node = node;
    }

    renderIcon(fn, id, text) {
        let iconNode = document.createElement('div');
        iconNode.classList.add('icon');
        iconNode.id = id;
        iconNode.innerText = text;
        iconNode.onclick = fn;
        return iconNode;
    }

    changeDate(flag) {  //flag: -2 last year, -1 last month, 1 next month, 2 next year
        let newDate,
            year = this.date.getFullYear(),
            month = this.date.getMonth();
        switch (flag) {
            case -2:
                newDate = this.date.setFullYear(year - 1);
                if (new Date(newDate).getMonth() !== month) {
                    newDate = new Date(newDate).setDate(0);
                }
                break;
            case -1:
                newDate = this.date.setFullYear(year, month - 1);
                if (month !== 0 && new Date(newDate).getMonth() !== month - 1) {
                    newDate = new Date(newDate).setDate(0);
                }
                break;
            case 1:
                newDate = this.date.setFullYear(year, month + 1);
                if (month !== 11 && new Date(newDate).getMonth() !== month + 1) {
                    newDate = new Date(newDate).setDate(0);
                }
                break;
            case 2:
                newDate = this.date.setFullYear(year + 1);
                if (new Date(newDate).getMonth() !== month) {
                    newDate = new Date(newDate).setDate(0);
                }
                break;
            default:
                break;
        }
        picker.update(new Date(newDate));
    }

    updateHead(date) {
        this.date = date;
        document.getElementById('dp-head-title').innerText = date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
    }
}

class DateCell {
    node;
    date;
    cellDate;
    constructor(props) {
        if (props && props.date instanceof Date) {
            this.date = props.date;
            this.cellDate = props.cellDate;
            this.render();
        }
    }

    render() {
        let node = document.createElement('div');
        let year = this.cellDate.getFullYear(),
            month = this.cellDate.getMonth(),
            day = this.cellDate.getDate();
        node.id = month + '-' + day;
        node.innerText = day;
        node.onclick = () => {
            this.selectCell(this.cellDate);
        };
        if (month !== this.date.getMonth()) {
            node.classList.add('other-month');
        }
        if (year === new Date().getFullYear() && month === new Date().getMonth() && day === new Date().getDate()) {
            node.classList.add('today');
        }
        this.node = node;
    }

    selectCell(date) {
        if (this.node.classList.contains('other-month')) {
            picker.update(date);
        } else {
            picker.select(date);
            picker.destroy();
        }
    }

}

class DateBody {
    date;
    node;
    constructor(props) {
        this.date = props;
        this.render();
    }

    render() {
        let dayList = this.generateDayList(this.date.getFullYear(), this.date.getMonth());
        let node = document.createElement('div');
        node.id = 'dp-body';

        let row = document.createElement('div');
        row.classList.add('date-row');
        let week = '' +
            '<div>一</div>' +
            '<div>二</div>' +
            '<div>三</div>' +
            '<div>四</div>' +
            '<div>五</div>' +
            '<div>六</div>' +
            '<div>七</div>';
        row.innerHTML = week;
        node.appendChild(row);

        for (let i = 0; i < dayList.length; i++) {
            let row = document.createElement('div');
            row.classList.add('date-row');
            for (let j = 0; j < 7; j++) {
                row.appendChild(dayList[i][j].node);
            }
            node.appendChild(row);
        }
        this.node = node;
    }

    generateDayList(year, month) {
        let dayList = [];
        let oneDay = 24 * 3600 * 1000,
            date = new Date().setFullYear(year, month, 1),
            week = new Date(date).getDay();
        date -= oneDay * week;

        do {
            let row = [];
            for (let i = 0; i < 7; i++) {
                row.push( new DateCell({date: this.date, cellDate: new Date(date)}) );
                date += oneDay;
            }
            dayList.push(row);
        } while (new Date(date).getMonth() === month);

        return dayList;
    }

    updateBody(date) {
        this.date = date;
        let old = this.node;
        this.render();
        old.parentNode.replaceChild(this.node, old);
    }
}

class DateFoot {
    node;
    constructor() {
        this.render();
    }
    render() {
        let node = document.createElement('div');
        node.id = 'dp-foot';
        node.innerText = '今天';
        node.onclick = () => {
            picker.update(new Date());
            picker.destroy();
        };
        this.node = node;
    }
}

class DatePicker {
    input;
    node;
    date;
    selectedDate;
    constructor(props) {
        if (props.elm) {
            this.input = props.elm;
            this.input.addEventListener('click', (e) => {
                e.stopPropagation();
                let val = e.srcElement.value.split('/').filter(x => !!x);
                let date = new Date();
                if (val.length) {
                    val[1]--;   //month is 0-11, but the value showed in input is 1-12
                    Date.prototype.setFullYear.apply(date, val);
                }
                if (!this.node) {
                    this.init(date);
                }
            });
            document.addEventListener('click', () => {
                this.destroy();
            });
            if (props.date) {
                this.date = props.date;
                this.init(props.date);
            }
        }
    }

    init(date) {
        this.date = date;
        this.selectedDate = date;
        this.head = new DateHead(date);
        this.body = new DateBody(date);
        this.foot = new DateFoot();
        this.render();
    }

    render()  {
        let node = document.createElement("div");
        node.classList.add("date-picker");
        node.appendChild(this.head.node);
        node.appendChild(this.body.node);
        node.appendChild(this.foot.node);
        node.onclick = (e) => { e.stopPropagation(); };
        this.node = node;
        this.input.parentNode.insertBefore(node, this.input.nextSibling);
        this.select(this.date);
    }

    update(date) {
        this.head.updateHead(date);
        this.body.updateBody(date);
        this.select(date);
    }

    select(date) {
        this.head.date = date;
        this.selectedDate = date;
        let month = date.getMonth(),
            day = date.getDate();
        let selected = document.getElementsByClassName('selected');
        for (let i = 0; i < selected.length; i++) {
            selected.item(i).classList.remove('selected');
        }
        document.getElementById(month + '-' + day).classList.add('selected');
        this.input.value = date.toLocaleDateString();
    }

    destroy() {
        if (this.node) {
            this.input.parentNode.removeChild(this.node);
            this.node = null;
        }
    }

}
