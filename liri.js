require("dotenv").config();
var keys = require("./keys");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request')
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var liri = {
    tweets: function() {
        var params = {screen_name: 'oprah'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                console.log("-------------------------------")
                console.log("Oprah's Tweets:\n");
                for (var i = 0; i < 20; i++) {
                    console.log((i+1) + ". " + tweets[i].text);
                }
                console.log("-------------------------------")
            }
        });
    },
    song: function(songName) {
        // If user has entered a songname, the query will be run for that song
        // Else, it'll query for "The Sign" by Ace of Base
        spotify.search({ type: 'track', query: (songName)? songName: "The Sign - Ace of Base", limit: 1 }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            console.log("-------------------------------")
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("-------------------------------")
            });
    },
    // This function must be passed the parameterized movie title, ex: "back+to+the+future"
    // The parameterize() function does this when it is passed the process.argv array
    movie: function(movieNameParameterized) {

        let queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieNameParameterized;
        request(queryURL, function(error, response, body) {
            console.log("-------------------------------")
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country of Production: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("-------------------------------")

        });
    },
    do: function() {},
    paramaterize: function(processArgvArray) {
        let array = process.argv;
        array.splice(0,2);
        let string = array.join("+");
        return string;
    }
};

