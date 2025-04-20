#!/usr/bin/env node
const fs = require("fs");
// require("chromedriver");
const axios = require("axios");
const { By, until } = require("selenium-webdriver");
const sleep = require("./sleep");
const dbAdd = require("./db");
const stealth = require("selenium-stealth");
let chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

module.exports.mainSearch = mainSearch;

async function mainSearch(iterPage) {
  if (iterPage > 10) {
    console.log("Достигнута 10 страница. Парсинг завершен.");
    process.exit(0); // Явно завершаем процесс
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

  // Пример использования
  const { key, value } = getRandomKeyValue(namePageFilter);
  let namePage = "";
  // if (iterPage == 1 && key == "1") {
  //   namePage = value;
  // } else if (iterPage > 1 && key == "1") {
  //   namePage = value + "page" + iterPage + "/";
  // } else if (iterPage == 1 && key != "1") {
  //   namePage = value;
  // } else {
  //   const paramsAndHash = value.split("/all/")[1];
  //   const domen = value.split("/all/")[0];
  //   namePage = domen + "page" + iterPage + "/" + paramsAndHash;
  // }
  // Разбираем URL на части
  const urlObj = new URL(value);
  const pathname = urlObj.pathname; // например, "/region22/all/"
  const searchAndHash = urlObj.search + urlObj.hash; // "?order=volume#tabs"

  if (iterPage === 1) {
    // Для первой страницы оставляем URL как есть
    namePage = value;
  } else {
    // Для страниц > 1 вставляем "pageN/" перед параметрами
    if (pathname.endsWith("/")) {
      // Если путь заканчивается на "/" (например, "/all/")
      namePage = `${urlObj.origin}${pathname}page${iterPage}/${searchAndHash}`;
    } else {
      // Если нет (например, "/all")
      namePage = `${urlObj.origin}${pathname}/page${iterPage}/${searchAndHash}`;
    }
  }

  console.log(namePage);

  let seleniumDriver = require("selenium-webdriver");

  const options = new chrome.Options(); //настройка без браузерного режима
  // options.addArguments("--headless=new");
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
      // await driver.close();
      // await driver.quit();

      console.log("Уникальные ссылки:", links); // Выводим список уже уникальных ссылок
      dbAdd.dbAdd(links, iterPage);

      await driver.close();
      await driver.quit();
      // Пауза 10 секунд перед переходом к следующей странице
      console.log("Пауза 10 секунд перед переходом к следующей странице...");
      await sleep.sleep(10000);

      // Проверяем, нужно ли продолжать парсинг
      if (iterPage < 10) {
        mainSearch(iterPage + 1);
      } else {
        console.log("Парсинг завершен. Обработано 10 страниц.");
        process.exit(0); // Явно завершаем процесс
      }
    } catch (error) {
      console.error("Ошибка при получении ссылок:", error);
      await driver.close();
      await driver.quit();
    }
  }
  // console.log("Ожидание 10 секунд...");
  // await sleep.sleep(10000);
  // getLinksFromDiv();
  await getLinksFromDiv();
  // await sleep.sleep(3000 + Math.random() * 2000); // Рандомная задержка 3-5 сек
}
mainSearch(1);

// <div data-bulletin-list="true">
// data-ftid="bulls-list_bull"
