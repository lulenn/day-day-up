/***
 * ref: https://github.com/ygm125/promise/blob/master/promise.js
 * 1、promise有三种状态， 等待（pending）、已完成（fulfilled）、已拒绝（rejected）
 * 2、promise的状态只能从“等待”转到“完成”或者“拒绝”，不能逆向转换，同时“完成”和“拒绝”也不能相互转换
 * 3、promise必须有一个then方法，而且要返回一个promise，供then的链式调用，也就是可thenable的
 * 4、then接受俩个回调(成功与拒绝),在相应的状态转变时触发，回调可返回promise，等待此promise被resolved后，继续触发then链
 * ***/

class MyPromise {
    _status = 'pending';    // store myPromise's status: PENDING, FULFILLED, REJECTED
    _value;
    _reason;
    _resolves = [];
    _rejects = [];

    constructor(executor) {
        if ('function' !== typeof executor) {
            throw new TypeError('You must pass a function as the actuator of my-promise');
        }
        executor((value) => {
            if (this._status !== 'pending') return;
            setTimeout(() => {
                this._status = 'fulfilled';
                let res = value;
                let item;
                while (item = this._resolves.shift()) {
                    res = item(res) || res;
                }
                this._value = res;
            });
        }, (reason) => {
            if (this._status !== 'pending') return;
            setTimeout(() => {
                this._status = 'rejected';
                let res = reason;
                let item;
                while (item = this._rejects.shift()) {
                    res = item(res) || res;
                }
                this._reason = res;
            });
        });
    }

    static resolve(value) {
        return new MyPromise( (resolve) => resolve(value) );
    }

    static reject(reason) {
        return new MyPromise( (resolve, reject) => reject(reason) );
    }

    static all(promises){
        if (!Array.isArray(promises)) {
            throw new TypeError('You must pass an array to all.');
        }
        return new MyPromise((resolve,reject) => {
            let result = [],
                len = promises.length,
                count = 0;
            for (let i = 0; i < len; i++) {
                promises[i].then((res) => {
                    count ++;
                    result[i] = res;
                    if (count === len) {
                        resolve(result);
                    }
                }, (e) => reject(e))
            }
        });
    }

    static race(promises){
        if (!Array.isArray(promises)) {
            throw new TypeError('You must pass an array to race.');
        }
        return new MyPromise((resolve,reject) => {
            let len = promises.length;
            for (let i = 0; i < len; i++) {
                promises[i].then((e) => resolve(e), (e) => reject(e));
            }
        });
    }

    static delay(ms, val){
        return MyPromise((resolve) => {
            setTimeout(function(){
                resolve(val);
            }, ms);
        })
    }

    /**
     * @param resolveCallBack Called while _status changed from 'pending' to 'fulfilled'
     * @param rejectCallBack Called while _status changed from 'pending' to 'rejected'
     */
    then(resolveCallBack, rejectCallBack) {
        let processor = (resolve, reject) => {
            let doResolve = (lastVal) => {
                let val = ('function' === typeof resolveCallBack && resolveCallBack(lastVal)) || lastVal;
                if (val && val.then && 'function' === typeof val.then) {
                    val.then((e) => {
                        resolve(e);
                    }, (e) => {
                        reject(e);
                    })
                } else {
                    resolve(val);
                }
            };
            let doReject = (lastVal) => {
                let val = ('function' === typeof rejectCallBack && rejectCallBack(lastVal)) || lastVal;
                reject(val);
            };
            switch (this._status) {
                case 'pending':
                    this._resolves.push(doResolve);
                    this._rejects.push(doReject);
                    break;
                case 'fulfilled':
                    doResolve(this._value);
                    break;
                case 'rejected':
                    doReject(this._reason);
                    break;
                default:
                    break;
            }
        };
        return new MyPromise(processor);
    }

    catch(rejectCallBack) {
        return this.then(undefined, rejectCallBack);
    }

    delay(ms, val){
        return this.then(() => MyPromise.delay(ms, val));
    }
}
