// let FP = rquire('fetch-polyfill2')  // fetch polyfill which supports all mainstream browsers, even IE6, IE7, IE8.....
var commonService = require('./common.service')
/** webpack可以使用require和export ，但是不能混合使用import 和module.exports ，不然会报错Cannot assign to read only property 'exports' of object '#<Object>'*/
var Promise = require('es6-promise-polyfill').Promise

module.exports = {
  circleTotalListFn: circleTotalListFn
}

/**
 * @member of api.serveice
 * @author ouyangzhigang720
 * @function circleTotalListFn
 * @parmas {objectJson}
 * @resolve response
 * @reject errors
 */
function circleTotalListFn (parmas) {
  return new Promise(function (resolve, reject) {
    try {
      let response = commonService.ajaxServer(parmas)
      resolve(response)
      console.log(response)
    } catch (errors) {
      console.log('circleTotalListFn of commonService: ' + errors.message)
      reject(errors)
    }
  })
}
