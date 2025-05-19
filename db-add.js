const mysql = require("mysql2");
const util = require("util");
const mainSearch = require("./main");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tiptopnub123",
  database: "kochergadb",
});

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
    const hrefId = extractIdFromUrl(adLink);

    if (!hrefId) {
      console.log(`Не удалось извлечь ID из URL: ${adLink}`);
      continue;
    }

    try {
      const checkHrefSql = "SELECT * FROM hrefs WHERE href_id = ? OR href = ?";
      const checkHrefResult = await query(checkHrefSql, [hrefId, adLink]);

      if (checkHrefResult.length === 0) {
        const insertSql = `
          INSERT INTO hrefs (href_id, href, status, update_count) 
          VALUES (?, ?, 'unchecked', 0)
        `;
        await query(insertSql, [hrefId, adLink]);
        console.log(`Ссылка добавлена в hrefs: ${adLink} с ID: ${hrefId}`);
      } else {
        const existingRecord = checkHrefResult[0];

        if (
          existingRecord.href_id == hrefId &&
          existingRecord.href !== adLink
        ) {
          const updateSql = "UPDATE hrefs SET href = ? WHERE href_id = ?";
          await query(updateSql, [adLink, hrefId]);
          console.log(`Обновлена ссылка для ID ${hrefId}`);
        } else {
          console.log(`Ссылка уже существует в hrefs: ${adLink}`);
        }
      }
    } catch (err) {
      console.log(`Ошибка при выполнении запроса: ${err}`);
    }
  }
  console.log(`Обработка страницы ${iterPage} завершена`);
}

function extractIdFromUrl(url) {
  const match = url.match(/\/(\d+)\.html$/);
  return match ? match[1] : null;
}
