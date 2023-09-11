import assert from "assert"
import RestaurantTableBooking from "../services/restaurant.js";
import pgPromise from 'pg-promise';
import "dotenv/config";

const DATABASE_URL = '';

const connectionString = process.env.DATABASE_URL || DATABASE_URL;
const db = pgPromise()(connectionString);

describe("The restaurant booking table", function () {
	let restaurantTableBooking;
	beforeEach(async function () {
		try {
			restaurantTableBooking = RestaurantTableBooking(db, 'tests');
			// clean the tables before each test run
			// await db.none("TRUNCATE TABLE table_booking RESTART IDENTITY CASCADE;");
		} catch (err) {
			console.log(err);
			throw err;
		}
	});

	it("should get all the available tables", async function () {
		assert.deepEqual([{
			id: 1,
			table_name: 'Table one',
			capacity: 4,
			booked: false,
			username: null,
			number_of_people: null,
			contact_number: null
		}, {
			id: 2,
			table_name: 'Table two',
			capacity: 6,
			booked: false,
			username: null,
			number_of_people: null,
			contact_number: null
		}, {
			id: 3,
			table_name: 'Table three',
			capacity: 4,
			booked: false,
			username: null,
			number_of_people: null,
			contact_number: null
		}, {
			id: 4,
			table_name: 'Table four',
			capacity: 2,
			booked: false,
			username: null,
			number_of_people: null,
			contact_number: null
		}, {
			id: 5,
			table_name: 'Table five',
			capacity: 6,
			booked: false,
			username: null,
			number_of_people: null,
			contact_number: null
		}, {
			id: 6,
			table_name: 'Table six',
			capacity: 4,
			booked: false,
			username: null,
			number_of_people: null,
			contact_number: null
		}], await restaurantTableBooking.getTables());
	});


	it("should check if the capacity is not greater than the available seats.", async function () {
		const result = await restaurantTableBooking.bookTable({
			tableName: 'Table four',
			username: 'Kim',
			phoneNumber: '084 009 8910',
			seats: 3
		});

		assert.deepEqual("Capacity greater than the table seats", result);
	});

	it("should check if there are available seats for a booking.", async function () {
		assert.deepEqual(true, await restaurantTableBooking.isAvailableTable({
			tableName: 'Table four',
			username: 'Kim',
			phoneNumber: '084 009 8910',
			seats: 6
		}));
	});

	it("should check if the booking has a user name provided.", async function () {
		assert.deepEqual("Please enter a username", await restaurantTableBooking.bookTable({
			tableName: 'Table four',
			phoneNumber: '084 009 8910',
			seats: 2
		}));
	});

	it("should check if the booking has a contact number provided.", async function () {
		assert.deepEqual("Please enter a contact number", await restaurantTableBooking.bookTable({
			tableName: 'Table four',
			username: 'Kim',
			seats: 2
		}));
	});

	it("should not be able to book a table with an invalid table name.", async function () {
		const message = await restaurantTableBooking.bookTable({
			tableName: 'Table eight',
			username: 'Kim',
			phoneNumber: '084 009 8910',
			seats: 2
		});

		assert.deepEqual("Invalid table name provided", message);
	});

	it("should be able to book a table.", async function () {
		// Table three should not be booked
		assert.equal(false, await restaurantTableBooking.isTableBooked('Table three'));
		// book Table three

		await restaurantTableBooking.bookTable({
			tableName: 'Table three',
			username: 'Kim',
			phoneNumber: '084 009 8910',
			seats: 2
		});

		// Table three should be booked now
		const booked = await restaurantTableBooking.isTableBooked('Table three')
		assert.equal(true, booked);
	});

	it("should list all booked tables.", async function () {
		let tables = await restaurantTableBooking.getTables();
		assert.deepEqual(6, tables.length);
	});

	it("should allow users to book tables", async function () {

		assert.deepEqual([], await restaurantTableBooking.getBookedTablesForUser('jodie'));

		restaurantTableBooking.bookTable({
			tableName: 'Table five',
			username: 'Jodie',
			phoneNumber: '084 009 8910',
			seats: 4
		});

		restaurantTableBooking.bookTable({
			tableName: 'Table four',
			username: 'Jodie',
			phoneNumber: '084 009 8910',
			seats: 2
		});

		await restaurantTableBooking.bookTable({
			tableName: 'Table five',
			username: 'Jodie',
			phoneNumber: '084 009 8910',
			seats: 4
		})

		// should only return 2 bookings as two of the bookings were for the same table
		assert.deepEqual([{}, {}], await restaurantTableBooking.getBookedTablesForUser('jodie'));
	});

	it("should be able to cancel a table booking", async function () {
		let restaurantTableBooking = await RestaurantTableBooking(db);

		await restaurantTableBooking.bookTable({
			tableName: 'Table five',
			username: 'Jodie',
			phoneNumber: '084 009 8910',
			seats: 4
		});

		restaurantTableBooking.bookTable({
			tableName: 'Table four',
			username: 'Kim',
			phoneNumber: '084 009 8910',
			seats: 2
		});

		let bookedTables = await restaurantTableBooking.getBookedTables();
		assert.equal(2, bookedTables.length);

		await restaurantTableBooking.cancelTableBooking("Table four");

		bookedTables = await restaurantTableBooking.getBookedTables();
		assert.equal(1, bookedTables.length);
	});

	after(function () {
		db.$pool.end;
	});
})
