console.log('app.js');
$('.parent').on('click', '.select-trips', function(){
  alert('Please become a Premium User \n to \'Save\' your results. Thank you.');
});
$('.deck-button').on('click', '.select-hotel', function(){
  $('.detail-data').toggle('hide-me');
});
$('.deck-button-too').on('click', '.select-restaurant', function(){
  $('.detail-data-too').toggle('hide-me-too');
});
