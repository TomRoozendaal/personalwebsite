$(document).ready(function () {

  $(".projects").mouseenter(function () {
    $(this).find(".bar").addClass('bar-on');
  }).mouseleave(function () {
    $(this).find(".bar").removeClass('bar-on');
  });

  $(".contact").mouseenter(function () {
    $(this).find(".bar").addClass('bar-on');
  }).mouseleave(function () {
    $(this).find(".bar").removeClass('bar-on');
  });

});
