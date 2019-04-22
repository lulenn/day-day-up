/***
 * 写一个方法，让一个全是返回promise的方法组成的数组中的方法按顺序执行
 * promiseArr: Promise[] = [fn1, fn2, fn3, ...];
 * ***/

function fn1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('fn1, timeout = 500');
            resolve(500);
        }, 500);
    })
}

function fn2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('fn2, timeout = 300');
            resolve(300);
        }, 300);
    })
}

function fn3() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('fn3, timeout = 1000');
            resolve(1000);
        }, 1000);
    })
}

const fnArr = [fn1, fn2, fn3];

// use async
(async function actuatorAsync(promiseArr) {
    let len = promiseArr.length;
    let res = [];
    for (let i = 0; i < len; i++) {
        res[i] = await promiseArr[i]();
    }
    console.log(res);
})(fnArr);

// use promise then
(function actuatorThen(promiseArr) {
    let res = [];
    let thenable = Promise.resolve();
    promiseArr.forEach(item => {
        thenable = thenable.then(item).then(data => {
            console.log(data);
            res.push(data);
            return data;
        })
    });
    thenable.then(() => {
        console.log(res);
    })
})(fnArr);

// use generator
(function actuatorIterator(promiseArr) {
    function* actuatorGenerator(arr) {
        for (let i = 0, len = arr.length; i < len; i++) {
            yield arr[i]();
        }
    }
    let iterator = actuatorGenerator(promiseArr);
    let val = iterator.next();
    while (!val.done) {
        val = iterator.next(val.value)
    }
})(fnArr);
