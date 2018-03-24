var editInfo = document.getElementById('edit-info');

function editable(){
  editor.document.designMode = 'on';
}

function bold(){
  editor.document.execCommand('bold', false, null);
}

function italic(){
  editor.document.execCommand('italic', false, null);
}

function underline(){
  editor.document.execCommand('underline', false, null);
}

function fontSize(){
  var size = prompt('Enter a size(1-7)', '');
  editor.document.execCommand('fontsize', false, size);
}

function fontColor(){
  var color = prompt('Enter a name of a color or a hexidecimal', '');
  editor.document.execCommand('forecolor', false, color);
}

function highlight(){
  var backColor = prompt('Enter a name of a color or a hexidecimal', '');
  editor.document.execCommand('backcolor', false, backColor);
}

function link(){
  var link = prompt('Enter a link', 'http://');
  editor.document.execCommand('createlink', false, link);
}

function unlink(){
  editor.document.execCommand('unlink', false, null);
}

function addImage(){
  editor.document.execCommand('insertImage')
}

document.getElementById('bold').onclick = bold;
document.getElementById('italic').onclick = italic;
document.getElementById('underline').onclick = underline;
document.getElementById('fontSize').onclick = fontSize;
document.getElementById('fontColor').onclick = fontColor;
document.getElementById('link').onclick = link;
document.getElementById('unlink').onclick = unlink;
