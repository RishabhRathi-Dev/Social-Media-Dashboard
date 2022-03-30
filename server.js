var http = require("http");
var url = require('url');
const { google } = require("googleapis")
require('dotenv').config();

var express = require("express");
const res = require("express/lib/response");
const { ids } = require("googleapis/build/src/apis/ids");
const { json } = require("express/lib/response");
const superagent = require('superagent');

var app = express()

var bodyParser = require('body-parser');
const request = require("superagent");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

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

app.post("/youtubedata", function(req, res){

    var finalYdata = []

    var YUSERNAME = req.body.Youtube || 'Pewdiepie'

    let getchnlID = async (YUSERNAME) => {
        const response = await request
            .get('https://www.googleapis.com/youtube/v3/channels')
            .query({forUsername : YUSERNAME})
            .query({key : process.env.YOUTUBE_API3})
            .query({part: 'statistics'});

        let id = response.body.items[0].id

        const reID = id

        return reID
    }

    let channelData = async (YUSERNAME) => {
        const response = await request
            .get('https://www.googleapis.com/youtube/v3/channels')
            .query({forUsername: YUSERNAME})
            .query({key : process.env.YOUTUBE_API3})
            .query({part: 'statistics'});

        let data = response.body.items[0].statistics

        const retDATA = data

        return retDATA
    }

    //finalYdata.push(await channelData(YUSERNAME))
    
    (async () => {
        console.log(await channelData(YUSERNAME))
     })()
    
    let VideoList = async (getchnlID) => {
        const response = await request
            .get('https://www.googleapis.com/youtube/v3/search')
            .query({channelId : getchnlID})
            .query({key : process.env.YOUTUBE_API3})
            .query({part: 'snippet'})
            .query({maxResults: '20'})
            .query({order : 'date'})
            .query({safeSearch : 'none'})
            .query({type : 'video'});

        let videoL = response.body.items

        return videoL
    }

    (async () => {
        console.log(await VideoList(await getchnlID(YUSERNAME)))
     })()
})


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
    client.v2.userByUsername('akshaykumar', {"user.fields": "public_metrics"}).then((val) => {
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
                var tweetText = element.text
                var metricsArray = Object.values(metricsObjects)
                metricsArray.push(tweetText)
                //console.log(metricsObjects)
                //console.log(metricsArray)
                twitterData.push(metricsArray)
            })
            
        }).then((res) =>{
            //console.log(twitterData)
            return twitterData
        }).then((response) => {
            res.send(JSON.stringify(response))
        }).catch((err) => {
            console.log(err)
        })
    
    }).catch((err) => {
        console.log(err)
    })

}
)

