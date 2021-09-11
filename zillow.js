const cheerio = require('cheerio');
const { scrapeZillow } = require('./helpers');

const startingUrl =
  'https://www.zillow.com/homes/for_rent/clarkcounty/wa/house,townhouse_type/';

let propertyUrls = [];

function scrapeCounty() {
  scrapeZillow(startingUrl, true).then((data) => {
    let $ = cheerio.load(data);

    $('.photo-cards li').each((i, el) => {
      let obj = $(el).find('script[type="application/ld+json"]');
      for (var i in obj) {
        for (var j in obj[i].children) {
          var data = obj[i].children[j].data;
          if (data) {
            let jsonData = JSON.parse(data);
            propertyUrls.push(jsonData.url);
          }
        }
      }
    });
    console.log(propertyUrls);
    return scrapeProperties();
  });
}

function scrapeProperties(i = 0) {
  if (i >= propertyUrls.length - 1) {
    return;
  }
  console.log(`Scraping Property ${i + 1} of ${propertyUrls.length}`);
  scrapeZillow(propertyUrls[i]).then((data) => {
    let $ = cheerio.load(data);

    let property = {};

    property.address = $('#ds-chip-property-address').text();
    property.summary = $('.ds-summary-row').text();
    property.agent_name = $('.ds-listing-agent-business-name').text();
    property.agent_text = $('.ds-listing-agent-info-text').text();
    console.log(property);
    return scrapeProperties(i + 1);
  });
}
scrapeCounty();
