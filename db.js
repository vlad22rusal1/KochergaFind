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
    const hrefId = extractIdFromUrl(adLink);

    if (!hrefId) {
      console.log(`Не удалось извлечь ID из URL: ${adLink}`);
      continue;
    }

    try {
      // Сначала проверяем существование записи по ID или URL
      const checkHrefSql = "SELECT * FROM hrefs WHERE href_id = ? OR href = ?";
      const checkHrefResult = await query(checkHrefSql, [hrefId, adLink]);

      if (checkHrefResult.length === 0) {
        // Если записи нет - добавляем
        const insertSql = `
          INSERT INTO hrefs (href_id, href, status) 
          VALUES (?, ?, 'unchecked')
        `;
        await query(insertSql, [hrefId, adLink]);
        console.log(`Ссылка добавлена в hrefs: ${adLink} с ID: ${hrefId}`);
      } else {
        // Если запись существует
        const existingRecord = checkHrefResult[0];

        if (
          existingRecord.href_id == hrefId &&
          existingRecord.href !== adLink
        ) {
          // Обновляем URL, если ID совпадает, но URL изменился
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
  iterPage++;
  mainSearch.mainSearch(iterPage);
}

function extractIdFromUrl(url) {
  // Регулярное выражение для поиска ID в URL
  const match = url.match(/\/(\d+)\.html$/);
  return match ? match[1] : null;
}
