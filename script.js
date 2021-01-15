const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const url = "https://dsc.community.dev/jaypee-institute-of-information-technology-sec-128/";
const port = process.env.PORT || 9000;
var webdata =  "initial";
var pastEvents = [];
var upcommingEvents = [];

async function getData() {
    await axios.get(url).then(res => {
        webdata = res.data;
        console.log("I am loaded")
        const $ = cheerio.load(webdata);
        if ($('#past-events .vertical-boxes a').attr('href') != undefined) {
            pastEvents = [];
            $('#past-events .vertical-boxes a:nth-child(n)').each((i, elem)=> {
                // console.log($(elem).find('p.vertical-box--event-date').text())
                pastEvents.push({
                    id: i+1,
                    link: 'https://dsc.community.dev/' + $(elem).attr('href'),
                    date: $(elem).find('p.vertical-box--event-date').text().replace(/  |\n/g, ''),
                    type: $(elem).find('p.vertical-box--event-type').text().replace(/  |\n/g, ''),
                    title: $(elem).find('p.vertical-box--event-title').text().replace(/  |\n/g, ''),
                    image: $(elem).find('img').attr('src')
                })
            });
        }
        else {
            pastEvents = [];
            pastEvents = $('#past-events .general-body--color').text();
        }
        if ($('#upcoming-events .event-list a').attr('href') != undefined) {
            upcommingEvents = [];
            console.log("found");
            $('#upcoming-events .event-list .row:nth-child(n)').each((i, elem) => {
                // console.log($(elem).find('p.vertical-box--event-date').text())
                upcommingEvents.push({
                    id: i + 1,
                    link: 'https://dsc.community.dev/' + $(elem).find('a.picture').attr('href'),
                    date: $(elem).find('div.date strong').text().replace(/  |\n/g, ''),
                    type: $(elem).find('div.date span').text().replace(/  |\n/g, ''),
                    title: $(elem).find('h4.general-body--color').text().replace(/  |\n/g, ''),
                    image: $(elem).find('img').attr('src')
                })
            });
        }
        else {
            upcommingEvents = [];
            upcommingEvents= $('#upcoming-events .general-body--color').text();
        }
    })
        .catch(error => {
            console.log(error);
        })
}

const app = express();


app.get('/data', async (req, res)=> {
    getData().then(()=> {
        console.log(upcommingEvents)
        res.send({
            past: pastEvents,
            upcoming: upcommingEvents
        })
    })
    .catch((error)=> {
        res.send(error);
    })
})


app.listen(port, () => {
    console.log('Server listening on port ' + port);
});