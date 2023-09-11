import express from "express";
import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";
import "dotenv/config";

import RestaurantTableBooking from "./services/restaurant.js";

const app = express()
const connectionString = process.env.DATABASE_URL;
const db = pgp()(connectionString);
const restaurantTableBooking = RestaurantTableBooking(db);

app.use(express.static('public'));
app.use(flash());

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
		tables
	})
});


app.get("/bookings", (req, res) => {
    res.render('bookings', { tables : [{}, {}, {}, {}, {}, {}]})
});


var portNumber = process.env.PORT || 3000;

// start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});