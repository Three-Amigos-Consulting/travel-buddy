'use strict';

console.log('app.js');

$('img.burgerpic').on('click', function(){
  $('div.menu-content').toggle();
})