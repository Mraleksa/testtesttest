// This is a template for a Node.js scraper on morph.io (https://morph.io)

var cheerio = require("cheerio");
var request = require("request");
var sqlite3 = require("sqlite3").verbose();

function initDatabase(callback) {
	// Set up sqlite database.
	var db = new sqlite3.Database("data.sqlite");
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS data (name TEXT)");
		callback(db);
	});
}

function updateRow(db, value) {
	// Insert some data.
	var statement = db.prepare("INSERT INTO data VALUES (?)");
	statement.run(value);
	statement.finalize();
}

function readRows(db) {
	// Read some data.
	db.each("SELECT rowid AS id, name FROM data", function(err, row) {
		console.log(row.id + ": " + row.name);
	});
}

function fetchPage(url, callback) {
	// Use request to read in pages.
	request(url, function (error, response, body) {
		if (error) {
			console.log("Error requesting page: " + error);
			return;
		}

		callback(body);
	});
}

function run(db) {
	// Use request to read in pages.
	fetchPage("http://w1.c1.rada.gov.ua/pls/radan_gs09/ns_golos?g_id=15122", function (body) {
		// Use cheerio to find things in the page with css selectors.
		var $ = cheerio.load(body);

		//var elements = $("div.media-body span.p-name").each(function () {
			var value = $("#0idd386").html();
			updateRow(db, value);
		//});

		readRows(db);

		db.close();
	});
}

initDatabase(run);
