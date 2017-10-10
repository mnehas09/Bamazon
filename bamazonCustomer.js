var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Welser2017!",
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startBuying();
})

function printProducts(res) {
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock'],
        colWidths: [10, 45, 40, 8, 8]
    });
    for (var i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.log(table.toString());
}

var startBuying = function() {
    connection.query('SELECT * FROM products', function(err, res) {
        printProducts(res);
        var choiceArray = [];
        for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].product_name);
        }
        inquirer.prompt([{
                name: 'item',
                type: 'input',
                message: 'Which item would you like to purchase? (Enter the Item ID)'
            },
            {
                name: 'quantity',
                type: 'input',
                message: 'How many would you like to purchase?'
            }
        ]).then(function(answer) {
            console.log(answer);
            var item_id = answer.item;
            var chosenItem = item_id;
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id == answer.item) {
                    if (res[i].stock_quantity < answer.quantity) {
                        console.log("Not enough product in stock!");
                    } else {
                        //Trying to figure out how to update the stock quantity with the new quantity
                    }
                } else {
                    console.log("product does not exists")
                }
            }
            var newQuantity = item_id.stock_quantity - answer.quantity;
            if (newQuantity >= 0) {
                connection.query('UPDATE products SET ? WHERE item_id = ?', [{ stock: newQuantity }, item_id]);
                startBuying();
            } else {
                console.log('Insufficient Quantity!');
                startBuying();
            }
        })
    })
}
