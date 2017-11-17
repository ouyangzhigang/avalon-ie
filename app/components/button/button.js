define(["avalon","template.html","style.css"], function(avalon, template){
    var _interface = function(){}
    avalon.component('ms:button', {
       $template: template,
       a: 1,
       b: 2,
       aMethod: _interface ,//组件的方法，在开始必须为空方法
       bMethod: _interface,//组件的方法，在开始必须为空方法
       onAevent: _interface,//组件的事件回调，在开始必须为空方法，必须以on开头，后面是大写，如onSelect
       onBevent: _interface,//组件的事件回调，在开始必须为空方法， 必须以on开头，后面是大写
       $init: function(vm, el){
          //vm就是当前组件的vm, el就是此自定义标签
       },
       $ready: function(vm, el){
          //在这里重写所有空方法
       },
       $dispose:function(vm, el){
          //在这里移除事件与清空节点内部
          el.innerHTML = ''
       }
    }
  })
  return avalon
})
