require("dotenv").config();
var keys = require("./keys");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var liri = {
    tweets: function() {
        var params = {screen_name: 'oprah'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                console.log("Oprah's Tweets:\n");
                for (var i = 0; i < 20; i++) {
                    console.log((i+1) + ". " + tweets[i].text + "\n");
                }
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
           
          console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
          console.log("Song: " + data.tracks.items[0].name);
          console.log("Preview Link: " + data.tracks.items[0].preview_url);
          console.log("Album: " + data.tracks.items[0].album.name);
          });
    },
    movie: function() {},
    do: function() {}
};

liri.song();