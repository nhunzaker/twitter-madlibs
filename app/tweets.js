// Twitter events
// -------------------------------------------------- //

var ntwitter  = require("ntwitter"),
    classify  = require("speakeasy-nlp").classify,
    twitter   = new ntwitter({
        "consumer_key"        : "xyzE3fy1U9GvWtXgKMAuPw",
        "consumer_secret"     : "NMssoTjYrLYN8GZA7O7QmZCFHTaaQM6WZeIH6ya8U",
        "access_token_key"    : "48188274-z5pk9codLkY9bPZshhl42cMumybCgHFIqYQ0ZLY2r",
        "access_token_secret" : "diYQDbInUBzc98ZiIhiJSKjNWIZGZz4mDpIVrfBa6Xo",
        "callback_url"        : "http://www.fail.com/"
    })
;

function madlibify(type) {
    return "<em class='" + type + "'>__________</em>";
}

// Stream!
// 
// -------------------------------------------------- //

module.exports = function(app) {

    function stream() {

        twitter.stream('statuses/sample', function(stream) {

            // On disconnect, reconnect the stream after 10 seconds
            stream.on("end", function() {
                setTimeout(function() {
                    stream();
                }, 10000);
            });
            
            stream.on('data', function (tweet) {

                // Prevent non-english tweets (sorry)
                if (tweet.user.lang !== "en") return false;
                
                // Get the aparts of speech
                tweet.tags = classify(tweet.text);

                var verbs  = tweet.tags.verbs, 
                    nouns  = tweet.tags.nouns, 
                    adjectives = tweet.tags.adjectives;
                
                // Do we have any verbs?
                if (verbs.length > 2) {
                    tweet.text = tweet.text.replace(verbs[~~(Math.random() * verbs.length)], madlibify("verb"));
                } else return false;

                // Do we have any nouns?
                if (nouns.length > 2) {
                    tweet.text = tweet.text.replace(nouns[~~(Math.random() * nouns.length)], madlibify("noun"));
                } else return false;

                // Do we have any adjectives?
                if (adjectives.length > 1) {
                    tweet.text = tweet.text.replace(adjectives[~~(Math.random() * adjectives.length)], madlibify("adjective"));
                } else return false;

                app.volley("tweet", tweet);

            }); 

        });

    }

    stream();

};