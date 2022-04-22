var http = require("http");
var url = require('url');
const https = require('https');
require('dotenv').config();

var express = require("express");
const res = require("express/lib/response");

var app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'ejs');

app.use(express.static('public')); 
app.use('/images', express.static('images'));

/* For local only 

const server = app.listen(0 || 8082, ()=>{
    console.log('Listening on port:', server.address().port);
});
*/

const server = app.listen(process.env.PORT)


app.get('/', function(req, res){
    res.sendFile(__dirname + "/" + "index.html");
})

app.get('/index.html', function(req, res){
    res.sendFile(__dirname + "/" + "index.html");
})

// Use Routers for all the connections 

// API

// Twitter (Completed Needed things) (Can get a array of redirecting link to the specified tweet or we can emmbed it)


app.post("/twitterdata", function(req, res){
    var twitterData; // contains everydata from twitter needed // 0 index is user data entry after that there is data of 100 latest tweets 

    var TUSERNAME = req.body.Twitter
    // need to set up auth anyways
    const {TwitterApi} = require('twitter-api-v2');
    const { count } = require("console");

    const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    // thinking of keeping the tweets info for latest 20 tweets only for now

    // change to a variable
    client.v2.userByUsername(TUSERNAME, {"user.fields": "public_metrics"}).then((val) => {
        //console.log(val)
        twitterData = []
        var dataArray = val.data
        var userID = dataArray.id
        //console.log(userID)

        var userMetricsObject = dataArray.public_metrics // This will have total followers_count, following_count, listed_count, tweet_count
        var userMetricsArray = Object.values(userMetricsObject)

        twitterData.push(userMetricsArray)

        //console.log(userMetricsArray)

        
        client.v2.userTimeline(userID, {"tweet.fields": "public_metrics", "max_results": "20"}).then((val2) => {
            //console.log(val2)
            var dataArray2 = val2.data
            var last100tweetArray = dataArray2.data
            
            last100tweetArray.forEach(element => {
                //console.log(element)
                var metricsObjects = element.public_metrics  // last 100 tweets data required data from it :: retweet_count, reply_count, like_count, quote_count
                //var tweetText = element.text
                var tweetID = element.id

                //app.render('https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2FInterior%2Fstatus%2F'+tweetID)
                
                //console.log(embTweet)

                var metricsArray = Object.values(metricsObjects)
                metricsArray.push(tweetID)
                //console.log(metricsObjects)
                //console.log(metricsArray)
                twitterData.push(metricsArray)
            })
            
        }).then((res) =>{
            //console.log(twitterData)
            return twitterData
        }).then((response) => {
            var userData = response[0] // user data 
            var tweetData = response.splice(1) // Whole data with tweet id
            var tweetIDs = []

            tweetData.forEach(element => {
                tweetIDs.push(element[4])
                element.pop()
            });

            res.render(__dirname + '/views/pages/result.ejs', {tweetData:tweetData, userData: userData, tweetIDs: tweetIDs, userName: TUSERNAME})

        }).catch((err) => {
            console.log(err)
        })
    
    }).catch((err) => {
        console.log(err)
    })

}
)

