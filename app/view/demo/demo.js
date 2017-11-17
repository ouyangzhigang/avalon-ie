// var avalon = require('avalon2')
// require('../../components/circle');
require('../../components/modal');
// import commonService from '../../service/common.service'
let apiService = require('../../service/api.service');

avalon.ready(() => {
  avalon.config({loader: true});
  let vm = avalon.define({
    $id: 'app-demo',
    name: 'app',
    datas: [],
    propIndex: '',
    mousebol: false,
    showTip: false,
    loaded: false,
    overfn (index) {
      this.propIndex = index;
      this.showTip = true;
    },
    leavefn () {
      this.showTip = !this.showTip;
    },
    runCount (count) {
      return count;
    }
  });

  avalon.scan(document.body); // 这个必须加，不然无法渲染

  apiService.circleTotalListFn({url: 'https://www.easy-mock.com/mock/59cd2c0aa0ab222a113b2586/circleTotalList'})
  .then((res) => {
    vm.datas = JSON.parse(res).data.dataList;
    console.log(JSON.stringify(vm.datas));
    return vm.datas.length;
  }).then((res) => {
    setTimeout(() => {
      vm.loaded = !!res;
    }, 135);
  });

  setTimeout(() => {
    $('.pie').css('backgroundColor', 'aliceblue');
  }, 2000);
});
