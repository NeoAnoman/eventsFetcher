const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const url = "https://dsc.community.dev/jaypee-institute-of-information-technology-sec-128/";
const port = 9000;
var webdata =  "initial";
var pastEvents = [];
var upcommingEvents = [];

async function getData() {
    await axios.get(url).then(res => {
        webdata = res.data;
        console.log("I am loaded")
        const $ = cheerio.load(webdata);
        if ($('#past-events .vertical-boxes a').attr('href') != undefined) {
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
            pastEvents = $('#past-events .general-body--color').text();
        }
        if ($('#upcoming-events .vertical-boxes a').attr('href') != undefined) {
            $('#upcoming-events .vertical-boxes a:nth-child(n)').each((i, elem) => {
                // console.log($(elem).find('p.vertical-box--event-date').text())
                pastEvents.push({
                    id: i + 1,
                    link: 'https://dsc.community.dev/' + $(elem).attr('href'),
                    date: $(elem).find('p.vertical-box--event-date').text().replace(/  |\n/g, ''),
                    type: $(elem).find('p.vertical-box--event-type').text().replace(/  |\n/g, ''),
                    title: $(elem).find('p.vertical-box--event-title').text().replace(/  |\n/g, ''),
                    image: $(elem).find('img').attr('src')
                })
            });
        }
        else {
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
        console.log(pastEvents);
        console.log(upcommingEvents);
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