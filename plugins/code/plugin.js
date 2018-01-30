(function () {
var code = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var DOMUtils = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var getMinWidth = function (editor) {
    return editor.getParam('code_dialog_width', 600);
  };
  var getMinHeight = function (editor) {
    return editor.getParam('code_dialog_height', Math.min(DOMUtils.DOM.getViewPort().h - 200, 500));
  };
  var $_ckvx7a91jd24rirr = {
    getMinWidth: getMinWidth,
    getMinHeight: getMinHeight
  };

  var setContent = function (editor, html) {
    editor.focus();
    editor.undoManager.transact(function () {
      editor.setContent(html);
    });
    editor.selection.setCursorLocation();
    editor.nodeChanged();
  };
  var getContent = function (editor) {
    return editor.getContent({ source_view: true });
  };
  var $_6ga8x293jd24rirt = {
    setContent: setContent,
    getContent: getContent
  };

  var open = function (editor) {
    var minWidth = $_ckvx7a91jd24rirr.getMinWidth(editor);
    var minHeight = $_ckvx7a91jd24rirr.getMinHeight(editor);
    var win = editor.windowManager.open({
      title: 'Source code',
      body: {
        type: 'textbox',
        name: 'code',
        multiline: true,
        minWidth: minWidth,
        minHeight: minHeight,
        spellcheck: false,
        style: 'direction: ltr; text-align: left'
      },
      onSubmit: function (e) {
        $_6ga8x293jd24rirt.setContent(editor, e.data.code);
      }
    });
    win.find('#code').value($_6ga8x293jd24rirt.getContent(editor));
  };
  var $_dj29w690jd24rirq = { open: open };

  var register = function (editor) {
    editor.addCommand('mceCodeEditor', function () {
      $_dj29w690jd24rirq.open(editor);
    });
  };
  var $_cysnwp8zjd24rirp = { register: register };

  var register$1 = function (editor) {
    editor.addButton('code', {
      icon: 'code',
      tooltip: 'Source code',
      onclick: function () {
        $_dj29w690jd24rirq.open(editor);
      }
    });
    editor.addMenuItem('code', {
      icon: 'code',
      text: 'Source code',
      onclick: function () {
        $_dj29w690jd24rirq.open(editor);
      }
    });
  };
  var $_ciebwe94jd24riru = { register: register$1 };

  PluginManager.add('code', function (editor) {
    $_cysnwp8zjd24rirp.register(editor);
    $_ciebwe94jd24riru.register(editor);
    return {};
  });
  function Plugin () {
  }

  return Plugin;

}());
})()
