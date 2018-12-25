const navbarOffset = 54;

$(document).ready(function () {

  let offset = navbarOffset + 20;
  $(id = "#navP").click((event) => {
    event.preventDefault();
    $('html, body').animate({
      scrollTop: $("#projects").offset().top - offset
    }, 'slow');
  });

  $(id = "#navC").click((event) => {
    event.preventDefault();
    $('html, body').animate({
      scrollTop: $(document).height() - window.innerWidth + navbarOffset
    }, 'slow');
  });

  $(id = "#navH").click((event) => {
    event.preventDefault();
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  });

});
