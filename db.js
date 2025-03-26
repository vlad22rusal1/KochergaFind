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
    const adLink = links[i];

    try {
      // Проверяем, есть ли ссылка в таблице hrefs
      const checkHrefSql = "SELECT * FROM hrefs WHERE href = ?";
      const checkHrefResult = await query(checkHrefSql, [adLink]);

      // Если ссылки нет в hrefs, добавляем её
      if (checkHrefResult.length === 0) {
        const insertSql =
          "INSERT INTO hrefs (href, status) VALUES (?, 'unchecked')";
        const insertResult = await query(insertSql, [adLink]);
        console.log(`Ссылка добавлена в hrefs: ${adLink}`);
      } else {
        console.log(`Ссылка уже существует в hrefs: ${adLink}`);
      }
    } catch (err) {
      console.log(`Ошибка при выполнении запроса: ${err}`);
    }
  }

  iterPage += 1;
  mainSearch.mainSearch(iterPage);
}
