require('dotenv').config()
const axios = require("axios");
const localhost = "http://localhost:8080/api/";
const server = process.env.API_TEST;
const activeServer = "server";
let activeIp = activeServer === "server" ? server : localhost;
const urls = [
    // PRODUCTS
    `${activeIp}product/all`,
    `${activeIp}product/search?name=alma`,
    `${activeIp}product/offers`,
    `${activeIp}product/top/selling`,
    `${activeIp}product/top/liked`,
    `${activeIp}product/top/rated`,
    `${activeIp}product/reviews/1`,
    `${activeIp}product/categories`,
    `${activeIp}product/subcategories`,
    `${activeIp}product/brands`,
    `${activeIp}product/likes`,
    `${activeIp}product/alma`,
];

const measureResponseTimes = async (urls) => {
  for (const url of urls) {
    try {
      const startTime = Date.now();
      let response = await axios.get(url);
      const endTime = Date.now();
      console.log(`${url} --> ${endTime - startTime} ms ---> request status --> ${response.status}`);
    } catch (error) {
      console.log(`Error ${url}: ${error} ms`);
    }
  }
};

measureResponseTimes(urls);