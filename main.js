#!/usr/bin/env node
const fs = require("fs");
const axios = require("axios");
const { By, until } = require("selenium-webdriver");
const sleep = require("./sleep");
const dbAdd = require("./db-add");
const stealth = require("selenium-stealth");
let chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

module.exports.mainSearch = mainSearch;

async function mainSearch(iterPage) {
  if (iterPage > 10) {
    console.log("Достигнута 10 страница. Парсинг завершен.");
    process.exit(0);
  }

  const namePageFilter = JSON.parse(
    fs.readFileSync("./namePageFilter.json", "utf-8")
  );

  function getRandomKeyValue(obj) {
    const keys = Object.keys(obj);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return {
      key: randomKey,
      value: obj[randomKey],
    };
  }

  const { key, value } = getRandomKeyValue(namePageFilter);
  let namePage = "";

  const urlObj = new URL(value);
  const pathname = urlObj.pathname;
  const searchAndHash = urlObj.search + urlObj.hash; 

  if (iterPage === 1) {
    namePage = value;
  } else {
    if (pathname.endsWith("/")) {
      namePage = `${urlObj.origin}${pathname}page${iterPage}/${searchAndHash}`;
    } else {
      namePage = `${urlObj.origin}${pathname}/page${iterPage}/${searchAndHash}`;
    }
  }

  console.log(namePage);

  let seleniumDriver = require("selenium-webdriver");

  const options = new chrome.Options();
  options.addArguments("--disable-gpu");
  options.addArguments("--window-size=1920,1080");

  let driver = new seleniumDriver.Builder()
    .forBrowser("chrome")
    // .setProxy(
    //  proxy.manual({
    //    http: newProxyString,
    //    https: newProxyString,
    //  })
    // )
    .setChromeOptions(options)
    .build();

  //Проверка работы прокси
  // driver.get("https://httpbin.io/ip");
  // const pageText = await driver.findElement(By.css("body")).getText();
  // console.log(pageText);

  async function checkPage(namePage) {
    const fetch = (await import("node-fetch")).default;
    try {
      const response = await fetch(namePage);
      if (response.status !== 200) {
        console.log("Страница не найдена или недоступна");
        await sleep.sleep(3000);
        await driver.close();
        await driver.quit();
        process.exit(1);
      }
    } catch (error) {
      console.error("Ошибка при проверке страницы:", error);
      await sleep.sleep(3000);
      await driver.close();
      await driver.quit();
      process.exit(1);
    }
  }
  driver.manage().window().maximize();
  checkPage(namePage);
  driver.get(namePage);
  sleep.sleep(1000);

  await sleep.sleep(1000);
  driver.get(namePage);
  await sleep.sleep(1000);

  async function getLinksFromDiv() {
    try {
      const divElement = await driver.wait(
        until.elementLocated(By.xpath('//div[@data-bulletin-list="true"]')),
        10000
      );
      await driver.sleep(1000);

      const links = await driver.executeScript(
        `
            var elements = arguments[0].querySelectorAll('a');
            var links = [];
            var uniqueUrls = new Set(); // Для фильтрации дубликатов
            
            for (var i = 0; i < elements.length; i++) {
                const url = elements[i].href;
                if (!uniqueUrls.has(url)) {
                    links.push(url);
                    uniqueUrls.add(url);
                }
            }
            return links;
            `,
        divElement
      );

      await sleep.sleep(3000);

      console.log("Уникальные ссылки:", links);
      dbAdd.dbAdd(links, iterPage);

      await driver.close();
      await driver.quit();
      console.log("Пауза 10 секунд перед переходом к следующей странице...");
      await sleep.sleep(10000);

      if (iterPage < 10) {
        mainSearch(iterPage + 1);
      } else {
        console.log("Парсинг завершен. Обработано 10 страниц.");
        process.exit(0);
      }
    } catch (error) {
      console.error("Ошибка при получении ссылок:", error);
      await driver.close();
      await driver.quit();
    }
  }
  await getLinksFromDiv();
}
mainSearch(1);
