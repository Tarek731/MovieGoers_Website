$(document).ready(function() {
	function movieSearch(event) {
		event.preventDefault();
		var queryMovie = $('#search-input').val().trim();
		console.log("search: " + queryMovie);
		var queryURL = '/api/movieSearch/'+queryMovie;

        console.log(queryURL);
		
		$.get(queryURL);
	};

	$('#search-submit').on('click', movieSearch);
});