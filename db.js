const mysql = require('mysql');
const util = require('util');
const mainSearch = require("./main");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "kochergadb"
});
// Connecting to database
connection.connect(function (err) {
  if (err) {
    console.log("Error in the connection")
    console.log(err)
  }
  else {
    console.log(`Database Connected`)
  }
});
module.exports.dbAdd = dbAdd;
const query = util.promisify(connection.query).bind(connection);
async function dbAdd(links,iterPage) {
  for (let i = 0; i < links.length; i++) {
    let filter = [links[i]];

    try {
      const result1 = await query("SELECT * FROM testedhref WHERE href=?", filter);
      const result2 = await query("SELECT * FROM untestedhref WHERE href=?", filter);

      if (result1.length === 0 && result2.length === 0) {
        const values = [[null, links[i]]]; // null для автоинкрементного id
        const sql = "INSERT INTO untestedhref(id_untest, href) VALUES ?";
        const results = await query(sql, [values]);
        // console.log(results);
      } else if (result1.length !== 0 && result2.length !== 0) {
        const deleteSql = "DELETE FROM untestedhref WHERE href=?";
        const deleteResult = await query(deleteSql, filter);
        // console.log("Delete: " + filter);
      } else {
        console.log(`Link ${links[i]} is already in one of the tables.`);
      }
    } catch (err) {
      console.log(`Error executing the query - ${err}`);
    }
  }
  iterPage+=1;
  // console.log("in DB = " + iterPage);
  mainSearch.mainSearch(iterPage);
}