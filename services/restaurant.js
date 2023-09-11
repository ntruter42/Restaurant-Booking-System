const restaurant = (db, schema) => {

	async function getTables() {
		// get all the available tables
		const query = `SELECT * FROM ${schema || 'public'}.table_booking ORDER BY id`;
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
			const query2 = `UPDATE ${schema || 'public'}.table_booking`
			const set2 = ` SET booked = true, username = '${booking.username}', number_of_people = ${booking.seats}, contact_number = ${booking.phoneNumber.replace(/\s/g, '')}`;
			const clause2 = ` WHERE table_name = '${booking.tableName}'`;
			const return2 = ` RETURNING booked`;
			return (await db.one(query2 + set2 + clause2 + return2)).booked;
		}
	}

	async function isAvailableTable(booking) {
		const query = `SELECT * FROM ${schema || 'public'}.table_booking WHERE booked = false AND capacity >= ${booking.seats}`;
		const tables = (await db.manyOrNone(query)) || [];
		return tables.length ? true : false;
	}

	async function getBookedTables() {
		const query = `SELECT * FROM ${schema || 'public'}.table_booking WHERE booked = true ORDER BY id`;
		return await db.manyOrNone(query);
	}

	async function isTableBooked(tableName) {
		const query = `SELECT booked FROM ${schema || 'public'}.table_booking WHERE table_name = '${tableName}'`;
		return (await db.one(query)).booked;
	}

	async function cancelTableBooking(tableName) {
		const query = `UPDATE ${schema || 'public'}.table_booking SET booked = false, username = null, number_of_people = null, contact_number = null WHERE table_name = ${tableName} RETURNING booked`;
		return !(await db.none(query)).booked;
	}

	async function editTableBooking(username) {
		// edit number_of_people and contact_number columns by username
	}

	async function getBookedTablesForUser(username) {
		const query = `SELECT * FROM ${schema || 'public'}.table_booking WHERE booked = true AND username = '${username}' ORDER BY id`;

		return await db.manyOrNone(query);
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