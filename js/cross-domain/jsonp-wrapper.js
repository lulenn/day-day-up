/**
 * ref: https://blog.csdn.net/liusaint1992/article/details/50959571
 * 实现可发送 JSONP 请求、获取 JSONP 返回结果的函数
 * JSONP(url, {
 *      data: {
 *          key1: value1
 *      },
 *      callback: function (data) {} // data 是服务端返回的数据
 * })
 *
 * 主要实现功能：
 * 1.参数拼装。
 * 2.给每个回调函数唯一命名。
 * 3.在回调成功或请求失败之后删除创建的javascript标签。 需要兼容IE。IE下onerror事件不兼容。这里有对它的模拟实现。在IE下加载失败也能get到。
 * 4.超时功能。超时取消回调。执行error。   // todo
 * 5.error事件。可执行自己传入的error事件。   // todo
 */
function JSONP(url, {data, callback}) {
    let fullUrl;
    let callbackName = 'callbackFn' + new Date().getTime();

    // 准备参数
    let params = '';
    for (let key of Object.keys(data)) {
        params += (encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&');
    }
    params += ('callback=' + callbackName);
    fullUrl = url + (url.indexOf('?') > -1 ? '&' : '?') + params;   //判断原链接中有无参数

    // 创建script脚本
    let jsonp = document.createElement('script');
    jsonp.loaded = false; //为了实现IE下的onerror做的处理。JSONP的回调函数总是在script的onload事件（IE为onreadystatechange）之前就被调用了。因此我们在正向回调执行之时，为script标签添加一个属性，然后待到onload发生时，再检测有没有这个属性就可以判定是否请求成功，没有成功当然就调用我们的error。
    jsonp.type = 'text/javascript';
    jsonp.src = fullUrl;

    // 创建回调函数
    window[callbackName] = (data) => {
        callback(data);
        jsonp.loaded = true;
    };

    document.body.appendChild(jsonp);
}