const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const url = "https://dsc.community.dev/jaypee-institute-of-information-technology-sec-128/";
var webdata =  "initial";
var pastEvents = "";
var upcommingEvents = "";

async function getData() {
    axios.get(url).then(res => {
        webdata = res.data;
        console.log("I am loaded")
        const $ = cheerio.load(webdata);
        var pastEvents = $('#past-events .vertical-boxes');
        pastEvents = [].slice.call(pastEvents.getElementsByTagName('a'), 0);
        console.log(pastEvents);
    })
        .catch(error => {
            console.log(error);
        })
}

getData();