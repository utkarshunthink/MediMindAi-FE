const pool = require('../startup/db/pool');

const getPrescriptions = async (searchString, pageSize, pageNumber) => {
    console.log("🚀 ~ getPrescriptions ~ searchString, pageSize, pageNumber:", searchString, pageSize, pageNumber);

    let args = [], totalRecords;

    const selectQuery = `SELECT * FROM medicines`;

    const whereClause = `WHERE name::TEXT ILIKE $1 OR composition::TEXT ILIKE $1`;

    const orderBy = `ORDER BY name ASC`;

    const finalQuery = `${selectQuery} ${whereClause} ${orderBy} LIMIT $2 OFFSET($3-1)*$2`;
    
    let countQuery = `SELECT COUNT(*) AS totalrecords FROM medicines ${whereClause}`;

    args.push(`%${searchString}%`);

    console.log(finalQuery, countQuery);
    const {rows: allMedicines} = await pool.query(finalQuery, [ ...args, pageSize, pageNumber ]);
    const {rows: countResult} = await pool.query(countQuery, [...args]);
    totalRecords = countResult[0].totalrecords;
    
    return {
        allMedicines,
        totalRecords
    }
};

module.exports = {
    getPrescriptions
};
