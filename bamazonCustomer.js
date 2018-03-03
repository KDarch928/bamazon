var mysql = require("mysql");
require("dotenv").config();
var inquirer = require("inquirer");
var table = require('console.table');
var key = require("./key.js");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: key.mysqlaccess.access,
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    startProgram();
});

function startProgram() {
    displayInventory();
}

// function displayInventory() {
//     connection.query("SELECT * from product", function (err, res) {
//         if(err) throw err;
//         console.table(res);
//     });
//     connection.end();
// }

function displayInventory() {
    connection.query("SELECT item_id as ID, product_name as Product, department_name as Department, price as Price, stock_quanity as Stock from product", function (err, res) {
        if(err) throw err;
        console.table(res);
    });
    connection.end();
}


// function runSearch() {
//     inquirer
//         .prompt({
//             name: "action",
//             type: "list",
//             message: "What would you like to do?",
//             choices: [
//                 "Find songs by artist",
//                 "Find all artists who appear more than once",
//                 "Find data within a specific range",
//                 "Search for a specific song"
//             ]
//         })
//         .then(function(answer) {
//             switch (answer.action) {
//                 case "Find songs by artist":
//                     artistSearch();
//                     break;
//
//                 case "Find all artists who appear more than once":
//                     multiSearch();
//                     break;
//
//                 case "Find data within a specific range":
//                     rangeSearch();
//                     break;
//
//                 case "Search for a specific song":
//                     songSearch();
//                     break;
//             }
//         });
// }

// function artistSearch() {
//     inquirer
//         .prompt({
//             name: "artist",
//             type: "input",
//             message: "What artist would you like to search for?"
//         })
//         .then(function(answer) {
//             var query = "SELECT position, song, year FROM top5000 WHERE ?";
//             connection.query(query, { artist: answer.artist }, function(err, res) {
//                 for (var i = 0; i < res.length; i++) {
//                     console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//                 }
//                 runSearch();
//             });
//         });
// }

// function multiSearch() {
//     var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//     connection.query(query, function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//             console.log(res[i].artist);
//         }
//         runSearch();
//     });
// }

// function rangeSearch() {
//     inquirer
//         .prompt([
//             {
//                 name: "start",
//                 type: "input",
//                 message: "Enter starting position: ",
//                 validate: function(value) {
//                     if (isNaN(value) === false) {
//                         return true;
//                     }
//                     return false;
//                 }
//             },
//             {
//                 name: "end",
//                 type: "input",
//                 message: "Enter ending position: ",
//                 validate: function(value) {
//                     if (isNaN(value) === false) {
//                         return true;
//                     }
//                     return false;
//                 }
//             }
//         ])
//         .then(function(answer) {
//             var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//             connection.query(query, [answer.start, answer.end], function(err, res) {
//                 for (var i = 0; i < res.length; i++) {
//                     console.log(
//                         "Position: " +
//                         res[i].position +
//                         " || Song: " +
//                         res[i].song +
//                         " || Artist: " +
//                         res[i].artist +
//                         " || Year: " +
//                         res[i].year
//                     );
//                 }
//                 runSearch();
//             });
//         });
// }

// function songSearch() {
//     inquirer
//         .prompt({
//             name: "song",
//             type: "input",
//             message: "What song would you like to look for?"
//         })
//         .then(function(answer) {
//             console.log(answer.song);
//             connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//                 console.log(
//                     "Position: " +
//                     res[0].position +
//                     " || Song: " +
//                     res[0].song +
//                     " || Artist: " +
//                     res[0].artist +
//                     " || Year: " +
//                     res[0].year
//                 );
//                 runSearch();
//             });
//         });
// }