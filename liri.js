/* .env file allows storage of API keys locally, which is in the .gitignore file, so 
keys cannot be taken from a public repo */
require("dotenv").config();
// Holds the variables for all API keys
var keys = require("./keys");
// For making API calls to Twitter
var Twitter = require('twitter');
// For making API calls to Spotify
var Spotify = require('node-spotify-api');
// For making any GET HTTP request (specifically for OMDB API here)
var request = require('request');
// For reading and writing to files (specifically log.txt and random.txt here)
var fs = require("fs");
// Initializing a new instance of the Spotify and Twitter objects with they keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// This object holds all the methods for this program
var liri = {
    // Makes an API call to Twitter for Oprah's tweets, and prints the 20 most recent
    // in the console and logs them to the log.txt file
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
    // This makes an API call to Spotify with the song name string and outputs
    // the song information in the console and to the log.txt file
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
    // This takes the string of the movie title, parameterizes it by adding + characters
    // where there are spaces in the title string, and makes the API call to OMDB
    movie: function(movieName) {
        // An API call is made to OMDB with the user's entered movie. If they haven't
        // entered a movie, the call is made for the movie "Mr. Nobody"
        let queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + ((movieName)? this.paramaterize(movieName):"Mr+Nobody");
        request(queryURL, function(error, response, body) {
            let object = JSON.parse(body);
            let string = `-------------------------------
                \nTitle: ${object.Title}
                \nYear: ${object.Year}
                \nIMDB Rating: ${object.imdbRating}
                \nRotten Tomatoes Rating: ${object.Ratings[1].Value}
                \nCountry of Production: ${object.Country}
                \nLanguage: ${object.Language}
                \nPlot: ${object.Plot}
                \nActors: ${object.Actors}
                \n-------------------------------\n`
            console.log(string);
            liri.logFile(string);
        });
    },
    // This takes a string ("Back to the Future"), adds + characters in between
    // words ("Back+to+the+Future") and returns the string
    paramaterize: function(string) {
        return string.replace(/ /g, "+");
    },
    // This takes all of the words the user has added after the command in the CLI
    // from the process.argv array and combines them into a string with spaces in between
    // words, returning the string
    stringify: function(processArgvArray) {
        let array = process.argv;
        array.splice(0,3);
        let string = array.join(" ");
        return string;
    },
    /* This method takes the user's command (such as movie-this) and string following the command, 
    and decides which method to call based on the command, then passes the string to the correct
    method */
    commandRouting: function(command, string) {
        if (command === "my-tweets") {
            liri.tweets();
        }
        else if (command === "spotify-this-song") {
            liri.song(string);
        }
        else if (command === "movie-this") {
            liri.movie(string);
        }
        else if (command === "do-what-it-says") {
            fs.readFile("random.txt", "utf8", function(error, data) {
                let string = data.replace(/"/g, "");
                let array = string.split(",");
                liri.commandRouting(array[0], array[1]);
            });
        }
        else {
            console.log(`-------------------------------\nI don't recognize that command\n-------------------------------\n`);
            this.logFile(`-------------------------------\nI don't recognize that command\n-------------------------------\n`)
        }
    },
    // This method logs a given string to the log.txt file.
    logFile: function(string) {
        fs.appendFile("log.txt", string, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
};

// Passes the user's command and string given on the CLI to the commandRouting method
liri.commandRouting(process.argv[2], liri.stringify(process.argv));


