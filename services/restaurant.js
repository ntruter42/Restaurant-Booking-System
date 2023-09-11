const restaurant = (db) => {

    async function getTables() {
		// get all the available tables
		const query = `SELECT * FROM public.table_booking`;
		return await db.manyOrNone(query);
    }

    async function bookTable(tableName) {
        // book a table by name
    }

    async function getBookedTables() {
        // get all the booked tables
    }

    async function isTableBooked(tableName) {
        // get booked table by name
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
        getBookedTables,
        isTableBooked,
        cancelTableBooking,
        editTableBooking,
        getBookedTablesForUser
    }
}

export default restaurant;