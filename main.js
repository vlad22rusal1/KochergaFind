const fs = require("fs");
require("chromedriver");
const axios = require("axios");
const { By } = require("selenium-webdriver");
const sleep = require("./sleep");
//const proxyRet = require("./proxy");
let chrome = require("selenium-webdriver/chrome");
//let proxy = require("selenium-webdriver/proxy");

//const proxyChain = require("proxy-chain");

async function f1() {
    console.log("blay");
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
  driver.get("https://httpbin.io/ip");
  const pageText = await driver.findElement(By.css("body")).getText();
  console.log(pageText);

  driver.manage().window().maximize();
  driver.get("https://auto.drom.ru/region22/all/");
  sleep.sleep(1000);

  //чтение файла и внос в строку
  //let str = fs.readFileSync("cookie.txt", "utf8");
  //создание списка
  //let cookies = JSON.parse(str);

  //await sleep.sleep(1000);
//   cookies.forEach(function (element) {
//     try {
//       driver.manage().addCookie({
//         name: element.name,
//         value: element.value,
//         domain: element.domain,
//         path: element.path,
//         expirationDate: new Date(element.expirationDate * 1000),
//       });
//     } catch (err) {
//       console.log("Ошибка!:" + err);
//     }
//   });

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

  // Поиск номера и проверка его на ноль м количество символов(11)
//   let findNumber = null;
//   do {
//     findNumber = await driver.findElement(
//       By.xpath(
//         '//button[@data-ga-stats-name="ask_question"]//ancestor::div[2]//child::div[1]'
//       )
//     );
//     let phoneNumber = await driver.executeScript(
//       'return arguments[0].innerText.replace("(","").replace(")","").replace("+","").replace("-","").replace(" ","").replace(" ","")',
//       findNumber
//     );

//     if (findNumber == null || phoneNumber.length != 11) {
//       await sleep.sleep(1000);
//       console.log("sleep 1000 ms");
//     } else {
//       console.log(phoneNumber);
//       break;
//     }
//   } while (true);
 // await sleep.sleep(3000);
  //await driver.close();
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