// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//jQuery
$(document).ready(() => {
  $('.blur').addClass("antiblur");

  $( "#lform" ).submit(function( event ) {
    alert( "hihi silly user, this function isn't working yet ;)" );
    event.preventDefault();
  });

  $( ".psw" ).on('click', () => {
    alert( "HA! dumbass.." );
  });

  $(".card").on('mouseenter', event => {
    $(".home-background").addClass("darken");
    $(event.currentTarget).removeClass("text-muted");
  });
  $(".card").on('mouseleave', event => {
    $(".home-background").removeClass("darken");
    $(event.currentTarget).addClass("text-muted");
  });
});

var titles = [];
var notes = [];
var dates = [];
