import express from "express";
import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import "dotenv/config";

import RestaurantTableBooking from "./services/restaurant.js";

const app = express()
const connectionString = process.env.DATABASE_URL;
const db = pgp()(connectionString);
const restaurantTableBooking = RestaurantTableBooking(db);

app.use(express.static('public'));
app.use(flash());
app.use(session({
	secret: "secret42",
	resave: false,
	saveUninitialized: false,
	cookie: { }
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
	partialsDir: "./views/partials",
	viewPath: './views',
	layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.get("/", async (req, res) => {
	const tables = await restaurantTableBooking.getTables();

	res.render('index', {
		tables,
		error: req.flash('error')[0],
		success: req.flash('success')[0]
	})
});

app.post("/book", async (req, res) => {
	const status = await restaurantTableBooking.bookTable({
		tableName: req.body.tableName,
		username: req.body.username,
		phoneNumber: req.body.phone_number,
		seats: req.body.booking_size
	});

	if (status === true) {
		req.flash('success', `${req.body.tableName} successfully booked!`);
	} else {
		req.flash('error', `${status}`);
	}

	res.redirect('/');
})

app.post("/cancel/:table_name", async (req, res) => {
	await restaurantTableBooking.cancelTableBooking(req.params.table_name);

	res.redirect('/bookings');
});

app.get("/bookings", async (req, res) => {
	const tables = await restaurantTableBooking.getBookedTables();

	res.render('bookings', {
		tables
	});
});

app.post("/bookings", (req, res) => {
	res.redirect('/bookings/' + req.body.username);
})

app.get("/bookings/:username", async (req, res) => {
	const tables = await restaurantTableBooking.getBookedTablesForUser(req.params.username);

	res.render('bookings', {
		tables
	});
});


var portNumber = process.env.PORT || 3000;

// start everything up
app.listen(portNumber, function () {
	console.log('🚀  server listening on:', portNumber);
});