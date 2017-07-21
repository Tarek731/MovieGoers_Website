$(document).ready(function() {
	function movieSearch() {
		var queryMovie = $('#search-input').val().trim();
		var queryURL = 'http://www.omdbapi.com/?s='+queryMovie+'&y=&type=movie&r=json&apikey=40e9cece';
		$.ajax({
			URL: queryURL,
			method: 'GET'
		}).done(function(response) {
			console.log(response)
		});
	}

	$('#search-submit').on('click', function(event) {
		// prevent submit buttons default behavior
		event.preventDefault();
		movieSearch();
	});
});