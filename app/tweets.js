// Twitter events
// -------------------------------------------------- //

var ntwitter  = require("ntwitter"),
    api_key   = require("../config/twitter_api"),
    classify  = require("speakeasy-nlp").classify,
    twitter   = new ntwitter(api_key)
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

                var entities = tweet.entities,
                    lang     = tweet.user.lang;

                // Prevent non-english tweets (sorry)
                if (lang !== "en") return false;

                // Prevent entity tweets from showing up
                if (entities.urls.length || entities.hashtags.length || entities.user_mentions.length) return false;

                // Get the aparts of speech
                tweet.tags = classify(tweet.text);

                var verbs  = tweet.tags.verbs, 
                    nouns  = tweet.tags.nouns, 
                    adjectives = tweet.tags.adjectives;
                
                // Do we have any verbs?
                if (verbs.length) {
                    tweet.text = tweet.text.replace(verbs[~~(Math.random() * verbs.length)], madlibify("verb"));
                } else { return false; }

                // Do we have any nouns?
                if (nouns.length) {
                    tweet.text = tweet.text.replace(nouns[~~(Math.random() * nouns.length)], madlibify("noun"));
                } else { return false; }

                // Do we have any adjectives?
                if (adjectives.length) {
                    tweet.text = tweet.text.replace(adjectives[~~(Math.random() * adjectives.length)], madlibify("adjective"));
                } else { return false; }

                app.volley("tweet", tweet);

            }); 

        });

    }

    stream();

};