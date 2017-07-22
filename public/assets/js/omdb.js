$(document).ready(function() {
	function movieSearch(event) {
		event.preventDefault();
		var queryMovie = $('#search-input').val().trim();
		console.log("search: " + queryMovie);
		var queryURL = 'http://www.omdbapi.com/?s='+queryMovie+'&y=&type=movie&r=json&apikey=40e9cece';

        console.log(queryURL);
		
		

	$.getJSON(queryURL, function() {
         console.log("success");
     }).done(function(response) {
			console.log(response);
			console.log(response.Search);

		  $("#search-term").text("SEARCH RESULT FOR: " + queryMovie);	

// // create Movie list 
//          for (var i = 0; i < response.Search.length; i++) {
//           for (var i = 0; i < 10; i++) {
//           	console.log(response.Search[i].Title);
//           	console.log(response.Search[i].Year);
          	  
//               var eachMovie = $("<div class='eachMovie bottom_divider'>");
//               var movieTitle = $("<h3 id='movie_1_title'>");
//               var moviePosterUrl = response.Search[i].Poster

//                  var movie_image = $("<div class='movie_image'>");

//                  var moviePoster = $("<img>");
//                 //add class to image
//                  moviePoster.addClass('movie-image');

//                  //set src image
                 
//                  moviePoster.attr("src", moviePosterUrl);
//                  // moviePoster.attr("style", "float:left");
//                  moviePoster.attr("value", "click");
//                  moviePoster.attr("data-href", moviePosterUrl);
                 
//                  //add videoImage to video_image
//                  movie_image.append(moviePoster);
//                  //add video_image to videoThumb
//                  // videoThumb.append(video_image);

//                  eachMovie.append(moviePoster);

//               movieTitle.text(response.Search[i].Title);
//               eachMovie.append(movieTitle);
//               var movieYear = $("<p id='movie_1_body'>");
//               movieYear.text("Year: " + response.Search[i].Year);
//               eachMovie.append(movieYear);

//               var link = $("<a>");
//               link.attr("href", response.Search[i].url);
//               var movieButtons =$("<button type='button' class='btn btn-primary paperButtons' id='movieButton_1' style='float: right'>");
//               link.append(movieButtons);
//               // articlesButtons.attr("onclick", response.articles[i].url);
              
//               movieButtons.text("Watch Later");
//               eachMovie.append(link);
              
//               $("#searchResult").append(eachMovie);

//          }; //loop

// };



		});
	}

	$('#search-submit').on('click', movieSearch);
});

