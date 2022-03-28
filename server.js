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

// Youtube

var YoutubeData = []

// This part gets viewcount, subscriber count and video count of the entered youtube username
google.youtube("v3").channels.list({
    key: process.env.YOUTUBE_API,
    part: 'statistics, contentDetails', // 'snippet'
    forUsername: "Ask Gamedev", // change to a varaiable // point to be noted username is not always same as channel name
}).then((response) =>{
    //console.log("statistics")
    const {data} = response;
    console.log(data)
    const {items} = data;

    items.forEach(element => {
        // needs rewrite since not getting latest videos
        //console.log(element)
        const {id} = element
        const {statistics} = element
        var StatArray = Object.values(statistics)
        //console.log(statistics)

        const {contentDetails} = element
        const {relatedPlaylists} = contentDetails
        var contentDetailsArray = Object.values(relatedPlaylists) 
        var uploadedPlaylistID = contentDetailsArray[1]

        getUploadedPlaylistData(id) // uses channel id and search 
    
        var viewCount = StatArray[0]
        var subscriberCount = StatArray[1]
        var videoCount = StatArray[3]

        YoutubeData.push(statsArray)
    });
}).catch((err)=> console.log(err))

var VideoMetricsArray = {} // date: array



function getUploadedPlaylistData(channelId){
    // This part will get latest 50 videos

    google.youtube("v3").search.list({
        key: process.env.YOUTUBE_API,
        part: 'snippet',
        channelId: channelId,
        type: "video",
        maxResults: "50",
        order: 'date',
        safeSearch: 'none',
        videoType: 'any',
        videoDuration: 'any',
    }).then((response) => {
        console.log(response) // modify response to get data 
        var resData = response.data
        const {items} = resData

        var key = 0

        items.forEach(element => {
            //var id = Object.values(id)
            //const {videoID} = id
            //console.log(element)

            var elementDataArray = Object.values(element)
            console.log(elementDataArray)

            var videokindobject = elementDataArray[2]
            var videokindarray = Object.values(videokindobject)
            console.log(videokindarray)
            var videoID = videokindarray[1]
            //console.log(videoID)
            
            var forVideoTitleobject = elementDataArray[3]
            var forVideoTitlearray = Object.values(forVideoTitleobject)
            var videoTitle = forVideoTitlearray[2]
            var date = forVideoTitlearray[0]

            //console.log(videoID)
            getVideoData(videoID, videoTitle, key, date)
            key++;
        })

    }).catch((err) => {
        console.log(err)
 
    })
}

function getVideoData(videoID, videoTitle, key, date){
  
    // This part will get vidio 's stats
    google.youtube("v3").videos.list({
        key: process.env.YOUTUBE_API,
        part: 'statistics',
        id: videoID,
    }).then((response) => {
        var resDATA = response.data
        const {items} = resDATA
        
        items.forEach(element => {
            const {statistics} = element
            //console.log(statistics)
            var statsArray = Object.values(statistics) // values :: 0: viewCount, 1:likeCount, 2:favouriteCount(no use), 3: commentCount
            //console.log(statsArray)

            statsArray.push(videoTitle) // 4 : videoTitle
            statsArray.push(key)
            VideoMetricsArray[date] = statsArray
        })

        
    }).catch((err)=> {
        console.log(err)
    })
}


//console.log(VideoMetricsArray)
YoutubeData.push(VideoMetricsArray)


// Twitter (Completed Needed things) (Can get a array of redirecting link to the specified tweet or we can emmbed it)

var twitterData = [] // contains everydata from twitter needed // 0 index is user data entry after that there is data of 100 latest tweets 

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
client.v2.userByUsername('akshaykumar', {"user.fields": "public_metrics"}).then((val) => {
    //console.log(val)
    var dataArray = val.data
    var userID = dataArray.id
    //console.log(userID)

    var userMetricsObject = dataArray.public_metrics // This will have total followers_count, following_count, listed_count, tweet_count
    var userMetricsArray = Object.values(userMetricsObject)

    twitterData.push(userMetricsArray)

    //console.log(userMetricsArray)

    
    client.v2.userTimeline(userID, {"tweet.fields": "public_metrics", "max_results": "100"}).then((val2) => {
        //console.log(val2)
        var dataArray2 = val2.data
        var last100tweetArray = dataArray2.data
        
        last100tweetArray.forEach(element => {
            //console.log(element)
            var metricsObjects = element.public_metrics  // last 100 tweets data required data from it :: retweet_count, reply_count, like_count, quote_count
            var tweetText = element.text
            var metricsArray = Object.values(metricsObjects)
            metricsArray.push(tweetText)
            //console.log(metricsObjects)
            //console.log(metricsArray)
            twitterData.push(metricsArray)
        })
        
    }).catch((err) => {
        console.log(err)
    })

}).catch((err) => {
    console.log(err)
})




