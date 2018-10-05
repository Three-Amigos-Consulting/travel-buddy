console.log('app.js');
$('.parent').on('click', '.select-trips', function () {
  alert('myTrips is a preimum feature!\n\nPlease contact Three Amigos Consulting\n\nfor pricing and additional informaiton.');
});
$('.deck-button').on('click', '.select-hotel', function () {
  $('.detail-data').toggle('hide-me');
});
$('.deck-button-too').on('click', '.select-restaurant', function () {
  $('.detail-data-too').toggle('hide-me-too');
});

$('img.burgerpic').on('click', function () {
  $('div.menu-content').toggle();
})

$('.deck-button').on('click', '.select-trips', function () {
  alert('myTrips is a premium feature!\n\nPlease contact Three Amigos Consulting\n\nfor pricing and additional information.');
});
