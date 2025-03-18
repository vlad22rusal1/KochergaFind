const mysql = require("mysql2");
const util = require("util");
const mainSearch = require("./main");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tiptopnub123",
  database: "kochergadb",
});

// Connecting to database
connection.connect(function (err) {
  if (err) {
    console.log("Error in the connection");
    console.log(err);
  } else {
    console.log(`Database Connected`);
  }
});

module.exports.dbAdd = dbAdd;

const query = util.promisify(connection.query).bind(connection);

async function dbAdd(links, iterPage) {
  for (let i = 0; i < links.length; i++) {
    // let filter = [links[i]];
    const adLink = links[i];

    // try {
    //   const result1 = await query("SELECT * FROM testedhref WHERE href=?", filter);
    //   const result2 = await query("SELECT * FROM untestedhref WHERE href=?", filter);

    //   if (result1.length === 0 && result2.length === 0) {
    //     const values = [[null, links[i]]]; // null для автоинкрементного id
    //     const sql = "INSERT INTO untestedhref(id_untest, href) VALUES ?";
    //     const results = await query(sql, [values]);
    //     // console.log(results);
    //   } else if (result1.length !== 0 && result2.length !== 0) {
    //     const deleteSql = "DELETE FROM untestedhref WHERE href=?";
    //     const deleteResult = await query(deleteSql, filter);
    //     // console.log("Delete: " + filter);
    //   } else {
    //     console.log(`Link ${links[i]} is already in one of the tables.`);
    //   }
    // } catch (err) {
    //   console.log(`Error executing the query - ${err}`);
    // }
    try {
      // Проверяем, есть ли ссылка в таблице ad
      const checkAdSql = "SELECT * FROM ad WHERE ad_link = ?";
      const checkAdResult = await query(checkAdSql, [adLink]);

      // Проверяем, есть ли ссылка в таблице unchecked_ads
      const checkUncheckedSql = "SELECT * FROM unchecked_ads WHERE ad_link = ?";
      const checkUncheckedResult = await query(checkUncheckedSql, [adLink]);

      // Если ссылки нет ни в ad, ни в unchecked_ads, добавляем её в UncheckedAds
      if (checkAdResult.length === 0 && checkUncheckedResult.length === 0) {
        const insertSql = "INSERT INTO unchecked_ads (ad_link) VALUES (?)";
        const insertResult = await query(insertSql, [adLink]);
        console.log(`Ссылка добавлена в unchecked_ads: ${adLink}`);
      } else {
        console.log(`Ссылка уже существует в ad или unchecked_ads: ${adLink}`);
      }
    } catch (err) {
      console.log(`Ошибка при выполнении запроса: ${err}`);
    }
  }
  iterPage += 1;
  // console.log("in DB = " + iterPage);
  mainSearch.mainSearch(iterPage);
}
