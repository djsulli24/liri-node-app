require("dotenv").config();
var keys = require("./keys");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var liri = {
    tweets: function() {
        var params = {screen_name: 'oprah'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                let string = `-------------------------------\nOprah's Tweets (since I don't tweet):\n\n`;
                for (var i = 0; i < 20; i++) {
                    string += (i+1) + ". " + tweets[i].text + "\n\n"
                }
                string += `-------------------------------\n`;
                console.log(string);
                liri.logFile(string);
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
            let string = `-------------------------------
            \nArtist: ${data.tracks.items[0].album.artists[0].name} 
            \nSong: ${data.tracks.items[0].name}
            \nPreview Link: ${data.tracks.items[0].preview_url}
            \nAlbum: ${data.tracks.items[0].album.name}
            \n-------------------------------\n`
            console.log(string);
            liri.logFile(string);
            });
    },
    // This function must be passed the parameterized movie title, ex: "back+to+the+future"
    // The parameterize() function does this when it is passed the process.argv array
    movie: function(movieNameParameterized) {

        let queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieNameParameterized;
        request(queryURL, function(error, response, body) {
            let string = `-------------------------------
                \nTitle: ${JSON.parse(body).Title}
                \nYear: ${JSON.parse(body).Year}
                \nIMDB Rating: ${JSON.parse(body).imdbRating}
                \nRotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}
                \nCountry of Production: ${JSON.parse(body).Country}
                \nLanguage: ${JSON.parse(body).Language}
                \nPlot: ${JSON.parse(body).Plot}
                \nActors: ${JSON.parse(body).Actors}
                \n-------------------------------\n`
            console.log(string);
            liri.logFile(string);
        });
    },
    do: function(command, string) {

    },
    paramaterize: function(processArgvArray) {
        let array = process.argv;
        array.splice(0,3);
        let string = array.join("+");
        return string;
    },
    stringify: function(processArgvArray) {
        let array = process.argv;
        array.splice(0,3);
        let string = array.join(" ");
        return string;
    },
    commandRouting: function(command) {
        if (command === "my-tweets") {
            liri.tweets();
        }
        else if (command === "spotify-this-song") {
            liri.song(liri.stringify(process.argv));
        }
        else if (command === "movie-this") {
            liri.movie(liri.paramaterize(process.argv));
        }
        else if (command === "do-what-it-says") {
            fs.readFile("random.txt", "utf8", function(error, data) {
                let string = data.replace(/"/g, "");
                let array = string.split(",");
                process.argv = process.argv.splice(0,4);
                process.argv[3] = array[1];
                liri.commandRouting(array[0]);
            });
        }
        else {
            console.log("I don't recognize that command.");
        }
    },
    logFile: function(string) {
        fs.appendFile("log.txt", string, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
};

liri.commandRouting(process.argv[2]);


