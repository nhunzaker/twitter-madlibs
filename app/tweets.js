// Twitter events
// -------------------------------------------------- //

var ntwitter  = require("ntwitter"),
    api_key   = require("../config/twitter_api"),
    twitter   = new ntwitter(api_key),
    classify  = require("speakeasy-nlp").classify
;

function madlibify(type) {
    return "<em class='{type}'>__________</em>".replace("{type}", type);
}

function sample(arr) {
    return arr[~~(Math.random() * arr.length)];
}

function filter(tweet) {

    var entities = tweet.entities,
        stack = 0;

    // Basic validations
    if (tweet.user.lang !== "en") return false;
    if (entities.urls.length || entities.hashtags.length || entities.user_mentions.length) return false;

    // Get the aparts of speech
    tweet.tags = classify(tweet.text);

    // Do we have any verbs?
    ['verbs', 'nouns', 'adjectives'].forEach(function(type) {

        var pos = tweet.tags[type];

        if (pos.length) {
            tweet.text = tweet.text.replace( sample(pos) , madlibify( type.slice(0, -1) ));
            stack++;
        }

    });

    // Now let's make sure the tweet is long enough
    if (stack < 2 || stack + 2 >= tweet.text.split(" ").length) return false;

    // We only care about the text, so let's only return what we need
    return {
        text: tweet.text
    };

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

                tweet = filter(tweet);
                tweet && app.volley("tweet", tweet);

            }); 

        });

    }

    stream();

};