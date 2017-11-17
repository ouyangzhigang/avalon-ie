var Promise = require('es6-promise-polyfill').Promise

module.exports = {
  heredoc: heredoc,
  ajaxServer: ajaxServer,
  consolefn: consolefn
};
/**
 * @description 对注释html编译
 * @name heredoc
 * @example template: heredoc(function () {
 *               // 要加注释 /* ...
 *               <div class='dialog' :attr='{a:@isShow}' ms-visible='@isShow'>
 *               <slot name='title'/>
 *               <div class='body'><slot name='content'/></div>
 *               <div class='footer'>
 *               <ms-button :click='@cbProxy(true)' :widget='@okButton' />
 *               <ms-button :click='@cbProxy(false)' :widget='@ngButton' />
 *               </div>
 *               </div>
 *          })
 *
 */
function heredoc(fn) {
  return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><');
}

/**
 * @function consolefn
 * @author ouyangzhigang
 * @description 由于IE6下没有console.log，如果又不想用VS等巨无霸IDE，可以自己定义以下方法
 * @notice 上线后，将.mass_sys_log{ display: none; }
 * @advice 如果是高级浏览器，avalon会在控制台上打印许多调试消息，如果不想看到它们，可以这样屏蔽它们：avalon.config({debug: false})
 */
function consolefn() {
  if(!window.console){
     window.console = {}
     console.log = function(str){
        avalon.ready(function() {
          var div = document.createElement('pre');
          div.className = 'mass_sys_log';
          div.innerHTML = str + ''; //确保为字符串
          document.body.appendChild(div);
        });
     }
  }
}

/**
 * @name ajaxServer
 * @description ajax请求服务封装
 * @step
 *  插件基本逻辑：
 *      GET请求：
 *      1.新建XHR对象
 *      2.定义状态监听函数，各种状态对应各种处理
 *      3.调用open方法启动请求，准备发送
 *      4.使用send方法发送请求，参数为null
 *
 *      POST请求：
 *      1.新建XHR对象
 *      2.定义状态监听函数，各种状态对应各种处理
 *      3.使用open方法启动请求，准备发送
 *      4.设置http头信息的Content-Type类型，模拟表单发送
 *      5.使用send方法发送请求，参数为自己要发送的东西
 * @param {requestType} POST GET
 * @param {url} /path
 * @param {async} boolean
 * @param {data}
 * @param {success}
 * @param {error}
 * @example
 *       ajaxServer({
 *          requestType: 'get',
 *          url: '/getFunc',
 *          async: true,
 *          cache: false,
 *          data: { name: 'lin', age: '20'},
 *          success: function (data) {
 *              alert(data);
 *          },
 *          error: function (statusText) {
 *             alert('请求失败了，以下是具体信息：\n' + statusText)
 *          }
 *       })
 */
function ajaxServer(obj) {
  var xmlHttp; //保存xmlHttpRequest对象
  var type = obj.requestType || 'get'; //保存请求方式
  var cache = obj.cache || false; //get时是否使用缓存,默认否
  var success = obj.success || function(){}; //数据请求成功的回调方法
  var errors = obj.errors || function(){}; //发生错误的回调方法
  var async = obj.async || false; //是否异步，默认否
  var data = []; //存储用户发来的数据
  var url = obj.url; //用户请求地址

  createXmlHttp(); //执行xmlHttp创建函数

  return new Promise(function(resolve, reject) {
    //创建xmlHttp失败
    if (!xmlHttp) {
      console.log('我的老哥，创建xmlHttp对象失败啦！您的浏览器不支持xmlHttpRequest对象');
    }

    try {
      //定义状态监听函数
      xmlHttp.onreadystatechange = function() {
        switch (xmlHttp.readyState) {
          case 1:
            console.log('open() 方法已调用，但是 send() 方法未调用。请求还没有被发送。');
            break;
          case 2:
            console.log('Send() 方法已调用，HTTP 请求已发送到 Web 服务器。未接收到响应。');
            break;
          case 3:
            console.log('所有响应头部都已经接收到。响应体开始接收但未完成。');
            break;
          case 4:
            if (xmlHttp.status == 200) {
              console.log('HTTP 响应已经完全接收。');
              success(xmlHttp.responseText); //调用回调函数
              resolve(xmlHttp.responseText);
            }
            break;
          default:
            errors(xmlHttp.statusText);
            reject(xmlHttp.statusText);
            break;
        }
      };

      //把用户传来的数据转换成字符串
      for (var i in obj.data) {
        data.push(i + '=' + obj.data[i]);
      }
      data = data.join('&');

      if (type.toUpperCase() == 'GET') { //如果是get请求
        if (cache === false) { //如果get请求不使用缓存
          xmlHttp.open('get', url + '?' + data + '&random=' + Math.random(), async);
          xmlHttp.send('null');
        } else { //如果get请求使用缓存
          xmlHttp.open('get', url + '?' + data, async);
          xmlHttp.send('null');
        }
      } else if (type.toUpperCase() == 'POST') //如果是post请求
      {
        xmlHttp.open('post', url, async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlHttp.send(data);
      } else {
        throw new Error('您的请求方法有误！');
      }
    } catch (errors) {
      console.log('出错啦：' + errors.message);
      reject(errors.message)
    }
  })

  //创建xmlHttpRequest对象函数
  function createXmlHttp() {
    if (window.ActiveXObject) {
      try {
        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
      }

    } else if (window.XMLHttpRequest) {
      try {
        xmlHttp = new XMLHttpRequest();
      } catch (e) {
        xmlHttp = false;
      }
    }
  }
}


// commonService.ajaxServer({
//   requestType: 'get',
//   url: 'https://www.easy-mock.com/mock/59cd2c0aa0ab222a113b2586/circleTotalList',
//   async: true,
//   cache: false,
//   success: function (data) {
//     console.log(data);
//   },
//   errors: function (statusText) {
//     alert('请求失败了，以下是具体信息：\n' + statusText);
//   }
// })

