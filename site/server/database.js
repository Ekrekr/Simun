/*****************************************/
/*              Database                */
/*****************************************/

const sqlite3 = require("sqlite3").verbose();
const dbPath = path.resolve(__dirname, "../database/database.db");
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the Login database.');
});
//GET
db.serialize(() => {
    db.each(`SELECT id,
                  forename as name
                  FROM Login`, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(row.id + "\t" + row.name);
    });
});
//PUT
//PlaceHolder - Will Get This From Pug
let placeholders = 'PLACEHOLDER';
let sql = 'INSERT INTO Login VALUES ' + placeholders;

// output the INSERT statement
console.log(sql);

db.run(sql, placeholders, function (err) {
    if (err) {
        return console.error(err.message);
    }
    console.log(`Rows inserted ${this.changes}`);
});
//UPDATE
//PlaceHolder - Will Get This From Pug
let data = ['PLACEHOLDER', 'PLACEHOLDER'];
let sql_update = `UPDATE Login
            SET forename = ?
            WHERE forename = ?`;

db.run(sql_update, data, function (err) {
    if (err) {
        return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);

});
//DELETE
//PlaceHolder - Will Get This From Pug
id = 100
db.run(`DELETE FROM Login WHERE rowid=?`, id, function (err) {
    if (err) {
        return console.error(err.message);
    }
    console.log(`Row(s) deleted ${this.changes}`);
});

// close the database connection
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
});