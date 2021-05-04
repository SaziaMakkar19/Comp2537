const express = require('express');
const app = express();
const fs = require("fs");
const mysql = require('mysql');
const bodyParser = require('body-parser');


app.use('/css', express.static('private/css'));
app.use('/js', express.static('private/js'));
app.use('/html', express.static('private/html'));


app.get('/', function (req, res) {


    // Let's build the DB if it doesn't exist
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      multipleStatements: true
    });

    const createDBAndTables = `CREATE DATABASE IF NOT EXISTS test;
        use test;
        CREATE TABLE IF NOT EXISTS User (
        ID int NOT NULL AUTO_INCREMENT,
        fname varchar(30),
        lname varchar(30),
        email varchar(30),
        groupName varchar(30),
        tel varchar(8),
        PRIMARY KEY (ID)
        );`;

    connection.connect();
    connection.query(createDBAndTables, function (error, results, fields) {
      if (error) {
          throw error;
      }
      console.log(results);

    });
    connection.end();

    let doc = fs.readFileSync('private/html/index.html', "utf8");
    res.send(doc);
});


app.get('/get-users', function (req, res) {

  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
  });
  connection.connect();
  connection.query('SELECT * FROM User', function (error, results, fields) {
      if (error) {
          throw error;
      }
      console.log('Rows returned are: ', results);
      res.send({ status: "success", rows: results });

  });
  connection.end();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Notice that this is a 'POST'
app.post('/add-user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  console.log("firstname", req.body.fname);
  console.log("lastname", req.body.lname);
  console.log("email", req.body.email);
  console.log("group name", req.body.groupName);
  console.log("tel", req.body.tel);

  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
  });
  connection.connect();
  // TO PREVENT SQL INJECTION, DO THIS:
  // (FROM https://www.npmjs.com/package/mysql#escaping-query-values)
  connection.query('INSERT INTO User (fname, lname, email, groupName, tel) values (?, ?, ?, ?, ?)',
        [req.body.fname, req.body.lname, req.body.email, req.body.groupName, req.body.tel],
        function (error, results, fields) {
    if (error) {
        throw error;
    }
    //console.log('Rows returned are: ', results);
    res.send({ status: "success", msg: "Recorded added." });

  });
  connection.end();

});



let port = 8000;
app.listen(port, function () {
  console.log('CRUD app listening on port ' + port + '!');
})