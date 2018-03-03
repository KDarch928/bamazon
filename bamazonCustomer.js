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

//make connection to mysql, then run the function to start the program.
connection.connect(function(err) {
    if (err) throw err;
    runProgram();
});

function runProgram() {
    console.log("Welcome to Bamazon!");
    displayInventory();
    setTimeout(start, 1000);
    //start()
}

//function to display the items to the user
function displayInventory() {
    connection.query("SELECT item_id as ID, product_name as Product, department_name as Department, price as Price, stock_quanity as Stock from product", function (err, res) {
        if(err) throw err;
        console.table(res);
    });
}

//function to end the program
function endProgram() {
    connection.end();
}

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "buyOrSell",
            type: "rawlist",
            message: "Would you like to [BUY] an item or [SELL] an item or [QUIT]?",
            choices: ["BUY", "SELL","QUIT"]
        })
        .then(function(answer) {
            // based on their answer, either call the buy or the sell or quit functions
            if (answer.buyOrSell === "BUY") {
                purchaseItem();
            } else if (answer.buyOrSell === "QUIT"){
                endProgram();
            } else {
                sellItem();
            }
        });
}

function purchaseItem() {

    // query the database for all items being auctioned
    connection.query("SELECT * FROM product", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they would like to buy
        inquirer
            .prompt([
                {
                    name: "itemID",
                    type: "input",
                    message: "Enter the ID of the Item you would like to buy?"
                },
                {
                    name: "qty",
                    type: "input",
                    message: "How many would you like to buy?"
                }
            ])
            .then(function(answer) {
                // get the information of the item selected
                var selection;

                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id === parseFloat(answer.itemID)) {
                        selection = results[i];
                    }
                }

                // //check to see if the there is enough quality to satisfy their purchase.
                if (selection.stock_quanity > 0 && selection.stock_quanity > answer.qty){
                    connection.query(
                        "UPDATE product SET ? WHERE ?",
                        [
                            {
                                stock_quanity: (selection.stock_quanity - answer.qty)
                            },
                            {
                                item_id: selection.item_id
                            }
                        ],
                        function(err){
                            if (err) throw err;
                            console.log("You have successfully purhcased a " + selection.product_name + " for $" + selection.price);
                            runProgram();
                        }
                    );
                } else {
                    console.log("Not enough quantity to complete your purchased!!")
                    runProgram();
                }
            });
    });
}

// function for a customers to sell an item
function sellItem() {
    // prompt for info about the item being sold
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the item you would like to submit?"
            },
            {
                name: "dept",
                type: "input",
                message: "What department would this item go in?"
            },
            {
                name: "itemPirce",
                type: "input",
                message: "How much would you like to sell the item?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "itemQty",
                type: "input",
                message: "How many of them item are you selling?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO product SET ?",
                {
                    product_name: answer.item,
                    department_name: answer.dept,
                    price: answer.itemPrice,
                    stock_quanity: answer.itemQty
                },
                function(err) {
                    if (err) throw err;
                    console.log("Your " + answer.item + " was created successfully!");
                    // re-prompt the user for if they want to buy or sell another item
                    runProgram();
                }
            );
        });
}
