// var avalon = require('avalon2');
require('style-loader!css-loader!./style.css');

avalon.component('ms-modal', {
  template: require('text-loader!./template.html'),
  defaults: {
    title: 'modal',
    isShow: true,
    cbProxy: function(ok) {
      var cbName = ok ? 'onConfirm' : 'onClose';
      if (this.hasOwnProperty(cbName)) {
        var ret = this[cbName]();
        if (ret !== false || (ret && typeof ret.next === 'function')) {
          this.isShow = true
        }
      } else {
        this.isShow = true
      }
    }
  },
  onReady: function() {
    var el = this.$element;
    el.style.display = 'none';

    this.$watch('isShow', function(a) {
      if (a) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    })
  },
  soleSlot: 'content'
});

module.exports = avalon;
