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

function jsonParser(stringValue) {

    var string = JSON.stringify(stringValue);
    var objectValue = JSON.parse(string);
    return objectValue;
}

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
