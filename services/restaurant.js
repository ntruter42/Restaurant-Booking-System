const restaurant = (db, schema) => {

	async function getTables() {
		// get all the available tables
		const query = `SELECT * FROM ${schema || 'public'}.table_booking`;
		return await db.manyOrNone(query);
	}

	async function bookTable(booking) {
		const query1 = `SELECT * FROM ${schema || 'public'}.table_booking WHERE table_name = '${booking.tableName}'`;
		const table = await db.oneOrNone(query1);

		if (!table) {
			return "Invalid table name provided";
		} else if (booking.seats > table.capacity) {
			return "Capacity greater than the table seats";
		} else if (!booking.username) {
			return "Please enter a username";
		} else if (!booking.phoneNumber) {
			return "Please enter a contact number";
		} else {
			const query2 = `UPDATE ${schema || 'public'}.table_booking SET booked = true WHERE table_name = '${booking.tableName}' RETURNING booked`
			return (await db.one(query2)).booked;
		}
	}

	async function isAvailableTable(booking) {
		const query = `SELECT * FROM ${schema || 'public'}.table_booking WHERE booked = false AND capacity >= ${booking.seats}`;
		const tables = (await db.manyOrNone(query)) || [];
		return tables.length ? true : false;
	}

	async function getBookedTables() {
		// get all the booked tables
	}

	async function isTableBooked(tableName) {
		const query = `SELECT booked FROM ${schema || 'public'}.table_booking WHERE table_name = '${tableName}'`;
		return (await db.one(query)).booked;
	}

	async function cancelTableBooking(tableName) {
		// cancel a table by name
	}

	async function editTableBooking(username) {
		// edit number_of_people and contact_number columns by username
	}

	async function getBookedTablesForUser(username) {
		// get user table booking
	}

	return {
		getTables,
		bookTable,
		isAvailableTable,
		getBookedTables,
		isTableBooked,
		cancelTableBooking,
		editTableBooking,
		getBookedTablesForUser
	}
}

export default restaurant;