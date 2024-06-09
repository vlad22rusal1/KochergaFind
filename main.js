const fs = require("fs");
require("chromedriver");
const axios = require("axios");
// const { By } = require("selenium-webdriver");
const { By, until } = require('selenium-webdriver');
const sleep = require("./sleep");
const dbAdd = require("./db");
//const proxyRet = require("./proxy");
let chrome = require("selenium-webdriver/chrome");
//let proxy = require("selenium-webdriver/proxy");

//const proxyChain = require("proxy-chain");

async function f1() {
  //const newProxyString = proxyRet.proxyRet();
  let seleniumDriver = require("selenium-webdriver");

  // const options = new chrome.Options().addArguments('--headless=new');
  let driver = new seleniumDriver.Builder()
    .forBrowser("chrome")
    // .setProxy(
    //  proxy.manual({
    //    http: newProxyString,
    //    https: newProxyString,
    //  })
    //) //.setChromeOptions(options)
    .build();
  // .setChromeOptions(options)

  //Проверка работы прокси
  // driver.get("https://httpbin.io/ip");
  // const pageText = await driver.findElement(By.css("body")).getText();
  // console.log(pageText);

  driver.manage().window().maximize();
  driver.get("https://auto.drom.ru/region22/all/");
  sleep.sleep(1000);

  //чтение файла и внос в строку
  // let str = fs.readFileSync("cookie.txt", "utf8");
  // //создание списка
  // let cookies = JSON.parse(str);

  // await sleep.sleep(1000);
  // cookies.forEach(function (element) {
  //   try {
  //     driver.manage().addCookie({
  //       name: element.name,
  //       value: element.value,
  //       domain: element.domain,
  //       path: element.path,
  //       expirationDate: new Date(element.expirationDate * 1000),
  //     });
  //   } catch (err) {
  //     console.log("Ошибка!:" + err);
  //   }
  // });

  await sleep.sleep(1000);
  driver.get("https://auto.drom.ru/region22/all/");
  await sleep.sleep(1000);

  //   let btnShowContact = null;
  //   do {
  //     btnShowContact = await driver.findElement(
  //       By.xpath("//button[@data-ftid='open-contacts']")
  //     );
  //     if (btnShowContact == null) {
  //       await sleep.sleep(1000);
  //       console.log("sleep 1000 ms");
  //     } else {
  //       let text = await driver.executeScript(
  //         "return arguments[0].innerText",
  //         btnShowContact
  //       );
  //       break;
  //     }
  //   } while (true);
  //   await btnShowContact.click();
  //   await sleep.sleep(5000);

  await sleep.sleep(1000);
  // let spisok = null;
  // do {
  //   spisok = await driver.findElement(By.xpath('//div[@data-bulletin-list="true"]'));
  //   // spisok = await driver.findElements(By.xpath('//a[@data-ftid="bulls-list_bull"]'));
  //   //  console.log(spisok);
  //   await sleep.sleep(1000);
  //   if (spisok == null) {
  //     await sleep.sleep(1000);
  //     console.log("sleep 1000 ms");
  //   }
  //   else {
  //     let listSp = await driver.executeScript(
  //       "return arguments[0].innerText", spisok);
  //     console.log(listSp);
  //     break;
  //   }

  // } while (true);
  async function getLinksFromDiv() {
    try {
      // Находим div с указанным xpath
      const divElement = await driver.wait(until.elementLocated(By.xpath('//div[@data-bulletin-list="true"]')), 10000);
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
  
      console.log(links); // Выводим список ссылок
      dbAdd.dbAdd(links);
    } catch (error) {
      console.error('Ошибка при получении ссылок:', error);
    }
  }
  
  getLinksFromDiv();
  
  // await sleep.sleep(3000);
  // await driver.close();
  // await driver.quit();
}
//const lines = fs.readFileSync("hrefsOfCars.txt", "utf8").split("\n");
// console.log(lines.length)
// lines.forEach(function (element) {
// setTimeout(function(){
// sleep.sleep(5000);
// f(element);
// sleep.sleep(15000);
// }), 5000
// });
// for (let i = 0; i < lines.length; i++) {

//   await f(lines[i]);

// }
// f(lines[0])
//async function f1() {
//for (let i = 0; i < lines.length; i++) {

//  await f(lines[i]);

// }
//};
f1();
console.log("blya");
// <div data-bulletin-list="true">
// data-ftid="bulls-list_bull" 