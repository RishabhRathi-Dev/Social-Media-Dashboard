var http = require("http");
var url = require('url');
const { google } = require("googleapis")
require('dotenv').config();

var express = require("express");
const res = require("express/lib/response");
const { ids } = require("googleapis/build/src/apis/ids");
const { json } = require("express/lib/response");

var app = express()

const server = app.listen(0 || 8082, ()=>{
    console.log('Listening on port:', server.address().port);
});

app.get('/', function(req, res){
    res.sendFile(__dirname + "/" + "index.html");
})

app.get('/index.html', function(req, res){
    res.sendFile(__dirname + "/" + "index.html");
})

// Use Routers for all the connections 


// Sign in and log

app.get('/login.html', function(req, res){
    res.sendFile(__dirname + '/login.html');
})

app.get('/signup.html', function(req, res){
    res.sendFile(__dirname + '/signup.html');
})

// Selection Page

app.get('/views/selectplatform.html', function(req, res){
    res.sendFile(__dirname + '/views/selectplatform.html');
})

// API


// This part gets viewcount, subscriber count and video count of the entered youtube channel
google.youtube("v3").channels.list({
    key: process.env.YOUTUBE_API,
    part: 'statistics',
    forUsername: 'Pewdiepie',
}).then((response) =>{
    console.log("statistics")
    const {data} = response;
    //console.log(data)
    const {items} = data;

    items.forEach(element => {
        //console.log(element)
        const {statistics} = element
        var StatArray = Object.values(statistics)
        //console.log(statistics)

        var viewCount = StatArray[0]
        var subscriberCount = StatArray[1]
        var videoCount = StatArray[3]
    });
}).catch((err)=> console.log(err))



// Twitter (Completed Needed things) (Can get a array of redirecting link to the specified tweet or we can emmbed it)

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

 
client.v2.userByUsername('akshaykumar', {"user.fields": "public_metrics"}).then((val) => {
    //console.log(val)
    var dataArray = val.data
    var userID = dataArray.id
    //console.log(userID)

    var userMetricsArray = dataArray.public_metrics // This will have total followers_count, following_count, listed_count, tweet_count
    //console.log(userMetricsArray)

    
    client.v2.userTimeline(userID, {"tweet.fields": "public_metrics", "max_results": "100"}).then((val2) => {
        //console.log(val2)
        var dataArray2 = val2.data
        var last100tweetArray = dataArray2.data
        
        last100tweetArray.forEach(element => {
            //console.log(element)
            var metricsArray = element.public_metrics  // last 100 tweets data required data from it :: retweet_count, reply_count, like_count, quote_count
            //console.log(metricsArray)
        })
        
    }).catch((err) => {
        console.log(err)
    })

}).catch((err) => {
    console.log(err)
})




