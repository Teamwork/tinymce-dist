(function () {
var hr = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var register = function (editor) {
    editor.addCommand('InsertHorizontalRule', function () {
      editor.execCommand('mceInsertContent', false, '<hr />');
    });
  };
  var $_1io8mabjjd24rj30 = { register: register };

  var register$1 = function (editor) {
    editor.addButton('hr', {
      icon: 'hr',
      tooltip: 'Horizontal line',
      cmd: 'InsertHorizontalRule'
    });
    editor.addMenuItem('hr', {
      icon: 'hr',
      text: 'Horizontal line',
      cmd: 'InsertHorizontalRule',
      context: 'insert'
    });
  };
  var $_8zz4sdbkjd24rj31 = { register: register$1 };

  PluginManager.add('hr', function (editor) {
    $_1io8mabjjd24rj30.register(editor);
    $_8zz4sdbkjd24rj31.register(editor);
  });
  function Plugin () {
  }

  return Plugin;

}());
})()
