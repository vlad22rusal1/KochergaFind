const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
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
async function dbAdd(links){
let query="SELECT * FROM untestedhref";
connection.query(query,
    function (err, result) {
        if (err)
            console.log(`Error executing the query - ${err}`)
        else
            console.log("Result: ", result);
            // console.log("Result: ", result[0]['href']);
    })
}