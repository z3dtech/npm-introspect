var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('testDB.db'); //:memory:

db.serialize(function () {
  db.run("CREATE TABLE Test (col1, col2, col3)");

  db.run("INSERT INTO Test VALUES (?, ?, ?)", ['a1', 'b1', 'c1']);
  db.run("INSERT INTO Test VALUES (?, ?, ?)", ['a2', 'b2', 'c2']);
  db.run("INSERT INTO Test VALUES (?, ?, ?)", ['a3', 'b3', 'c3']);

  db.each("SELECT * FROM Test", function (err, row) {
    console.log(row);
  });
});
db.close();


// db.serialize(function () {
//   db.each("SELECT * FROM Test", function (err, row) {
//     console.log(row);
//   });
// });
