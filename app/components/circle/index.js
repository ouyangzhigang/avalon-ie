// let avalon = require('avalon2');
require('style-loader!css-loader!./style.css');

avalon.component('ms-circle', {
  template: require('text-loader!./template.html'),
  defaults: {
    cdata: '',
    cindex: 0,
    show: false,
    propIndex: 0,
    onInit: function (e) {
      // console.log(e)
      console.log('component cdata:', JSON.stringify(this.cdata));
    },
    overfn: function (cindex) {
      this.show = true;
      this.propIndex = cindex
    },
    leavefn: function (cindex) {
      this.propIndex = cindex;
      this.show = false
    },
    detachedCallback () {
      console.log('component cdata:', JSON.stringify(this.cdata));
    }
  }
});
