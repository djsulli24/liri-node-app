require("dotenv").config();
var keys = require("./keys");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var liri = {
    tweets: function() {
        var params = {screen_name: 'danielliriapp'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                for (var i = 0; i < 20; i++) {
                    console.log((i+1) + ". " + tweets[i].text + "\n");
                }
            }
        });
    },
    song: function() {},
    movie: function() {},
    do: function() {}
};

liri.tweets();