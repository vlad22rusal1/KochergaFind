const fs = require("fs");
require("chromedriver");
const axios = require("axios");
const { By, until } = require("selenium-webdriver");
const sleep = require("./sleep");
const dbAdd = require("./db");
//const proxyRet = require("./proxy");
let chrome = require("selenium-webdriver/chrome");
//let proxy = require("selenium-webdriver/proxy");
//const proxyChain = require("proxy-chain");

module.exports.mainSearch = mainSearch;

async function mainSearch(iterPage) {
  let namePage = "";
  if (iterPage == 1) {
    namePage = "https://auto.drom.ru/region22/all/";
  } else {
    //console.log("Vivod iterpage!!! = " + iterPage);
    namePage = "https://auto.drom.ru/region22/all/page" + iterPage + "/";
  }
  //const newProxyString = proxyRet.proxyRet();
  let seleniumDriver = require("selenium-webdriver");

  const options = new chrome.Options(); //настройка без браузерного режима
  options.addArguments("--headless=new");
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
    // .setChromeOptions(options)
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
        process.exit(1); // Останавливаем работу скрипта
      }
    } catch (error) {
      console.error("Ошибка при проверке страницы:", error);
      await sleep.sleep(3000);
      await driver.close();
      await driver.quit();
      process.exit(1); // Останавливаем работу скрипта
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
      // Находим div с указанным xpath
      const divElement = await driver.wait(
        until.elementLocated(By.xpath('//div[@data-bulletin-list="true"]')),
        10000
      );
      await driver.sleep(1000); // Ждем 1 секунду для стабилизации страницы

      // Используем executeScript для получения всех ссылок внутри div
      const links = await driver.executeScript(
        `
        var elements = arguments[0].querySelectorAll('a');
        var links = [];
        for (var i = 0; i < elements.length; i++) {
          links.push(elements[i].href);
        }
        return links;
        `,
        divElement
      );
      await sleep.sleep(3000);
      await driver.close();
      await driver.quit();
      console.log(links); // Выводим список ссылок
      dbAdd.dbAdd(links, iterPage);
    } catch (error) {
      console.error("Ошибка при получении ссылок:", error);
    }
  }
  getLinksFromDiv();
}
mainSearch(1);

// <div data-bulletin-list="true">
// data-ftid="bulls-list_bull"
