const PORT = 8000;

const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const j2cp = require("json2csv").Parser;
const fs = require("fs");

const app = express();

var today = new Date();

var month = parseFloat(today.getMonth()) + 1;

const url = "https://weather.com/weather/today/l/49bf5bbb67541b52b493f1b5a59088bb5beb770f54d475e4c9544855f571ce11";

async function getData() {
    var data = {};

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Store data
        // Daily summary data
        const curTemp = $("#todayDetails > section > div.TodayDetailsCard--hero--2QGgO > div.TodayDetailsCard--feelsLikeTemp--2x1SW > span.TodayDetailsCard--feelsLikeTempValue--2icPt").text();
        const highTemp = $("#todayDetails > section > div.TodayDetailsCard--detailsContainer--2yLtL > div:nth-child(1) > div.WeatherDetailsListItem--wxData--kK35q > span:nth-child(1)").text();
        const lowTemp = $("#todayDetails > section > div.TodayDetailsCard--detailsContainer--2yLtL > div:nth-child(1) > div.WeatherDetailsListItem--wxData--kK35q > span:nth-child(2)").text();
        const wind = $("#todayDetails > section > div.TodayDetailsCard--detailsContainer--2yLtL > div:nth-child(2) > div.WeatherDetailsListItem--wxData--kK35q > span").text();
        const humidity = $("#todayDetails > section > div.TodayDetailsCard--detailsContainer--2yLtL > div:nth-child(3) > div.WeatherDetailsListItem--wxData--kK35q > span").text();
        const moonPhase = $("#todayDetails > section > div.TodayDetailsCard--detailsContainer--2yLtL > div:nth-child(8) > div.WeatherDetailsListItem--wxData--kK35q").text();

        // Hourly Forecast
        const nowTemp = $("#WxuHourlyWeatherCard-main-29584a07-3742-4598-bc2a-f950a9a4d900 > section > div > ul > li.Column--column--3tAuz.Column--active--27U5T > a > div.Column--temp--1sO_J > span").text();
        const hourFutureTemp = $("#WxuHourlyWeatherCard-main-29584a07-3742-4598-bc2a-f950a9a4d900 > section > div > ul > li:nth-child(2) > a > div.Column--temp--1sO_J > span").text();
        const twoHourFutureTemp = $("#WxuHourlyWeatherCard-main-29584a07-3742-4598-bc2a-f950a9a4d900 > section > div > ul > li:nth-child(3) > a > div.Column--temp--1sO_J > span").text();
        const threeHourFutureTemp = $("#WxuHourlyWeatherCard-main-29584a07-3742-4598-bc2a-f950a9a4d900 > section > div > ul > li:nth-child(4) > a > div.Column--temp--1sO_J > span").text();
        const fourHourFutureTemp = $("#WxuHourlyWeatherCard-main-29584a07-3742-4598-bc2a-f950a9a4d900 > section > div > ul > li:nth-child(5) > a > div.Column--temp--1sO_J > span").text();

        // Daily Forecast
        const todayTemp = $("#WxuDailyWeatherCard-main-bb1a17e7-dc20-421a-b1b8-c117308c6626 > section > div > ul > li.Column--column--3tAuz.Column--active--27U5T > a > div.Column--temp--1sO_J > span").text();
        const tomorrowTemp = $("#WxuDailyWeatherCard-main-bb1a17e7-dc20-421a-b1b8-c117308c6626 > section > div > ul > li:nth-child(2) > a > div.Column--temp--1sO_J > span").text();
        const twoDayTemp = $("#WxuDailyWeatherCard-main-bb1a17e7-dc20-421a-b1b8-c117308c6626 > section > div > ul > li:nth-child(3) > a > div.Column--temp--1sO_J > span").text();
        const threeDayTemp = $("#WxuDailyWeatherCard-main-bb1a17e7-dc20-421a-b1b8-c117308c6626 > section > div > ul > li:nth-child(4) > a > div.Column--temp--1sO_J > span").text();
        const fourDayTemp = $("#WxuDailyWeatherCard-main-bb1a17e7-dc20-421a-b1b8-c117308c6626 > section > div > ul > li:nth-child(5) > a > div.Column--temp--1sO_J > span").text();
    
        // Put data in dict
        data["curTemp"] = curTemp;
        data["highTemp"] = highTemp;
        data["lowTemp"] = lowTemp;
        data["wind"] = wind;
        data["humidity"] = humidity;
        data["moonPhase"] = moonPhase;

        data["nowTemp"] = nowTemp;
        data["hourFutureTemp"] = hourFutureTemp;
        data["twoHourFutureTemp"] = twoHourFutureTemp;
        data["threeHourFutureTemp"] = threeHourFutureTemp;
        data["fourHourFutureTemp"] = fourHourFutureTemp;

        data["todayTemp"] = todayTemp;
        data["tomorrowTemp"] = tomorrowTemp;
        data["twoDayTemp"] = twoDayTemp;
        data["threeDayTemp"] = threeDayTemp;
        data["fourDayTemp"] = fourDayTemp;
    }
    catch(error) {
        console.error(error);
    }

    const parser = new j2cp();
    const csv = parser.parse(data);
    fs.writeFileSync("./weather.csv", csv);
}

getData();

app.listen(PORT, () => console.log(`URL is: ${url}`));  

