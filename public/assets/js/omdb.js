 
	$(document).ready(function() {
  // ============================
  function movieSearch(event) {
		event.preventDefault();
		var queryMovie = $('#search-input').val().trim();
		console.log("search: " + queryMovie);
		var queryURL = '/api/movieSearch/'+queryMovie;

        console.log(queryURL);
	
	$.getJSON(queryURL, function() {
         console.log("success");
     });
    }

 

  // ==============================
 $("#search-submit").click(function(){
         // $(".jumbotron").css("display", "none");
         console.log("slideup");
         $(".jumbotron").hide();
     });

 

$("#search-submit").click(function(){
         // $(".jumbotron").css("display", "none");
         console.log("slideup");
         $(".searchtext").css("display", "block");
     });





	$('#watchlater').on('click', function() {
		var movieTitle = $('#movieTitle').attr('id');
		var movie = {
			title: movieTitle
		}
		var movie = JSON.stringify(movie);
		console.log(movie);

		$.post('/api/watchlist',{movie});
	});
// slide up on user page

});


function hideFunction() {
    document.getElementById(".jumbotron").style.display = "none";
}