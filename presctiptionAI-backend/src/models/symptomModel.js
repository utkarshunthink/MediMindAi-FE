const pool = require('../startup/db/pool');

const getSymptoms = async (searchString, pageSize, pageNumber) => {
    console.log("🚀 ~ getSymptoms ~ searchString, pageSize, pageNumber:", searchString, pageSize, pageNumber);

    let args = [], totalRecords;

    const selectQuery = `SELECT name FROM symptoms`;

    const whereClause = `WHERE name::TEXT ILIKE $1`;

    const orderBy = `ORDER BY name ASC`;

    const finalQuery = `${selectQuery} ${whereClause} ${orderBy} LIMIT $2 OFFSET($3-1)*$2`;
    
    let countQuery = `SELECT COUNT(*) AS totalrecords FROM symptoms ${whereClause}`;

    args.push(`%${searchString}%`);

    console.log(finalQuery, countQuery);
    const {rows: allSymptoms} = await pool.query(finalQuery, [ ...args, pageSize, pageNumber ]);
    const {rows: countResult} = await pool.query(countQuery, [...args]);
    totalRecords = countResult[0].totalrecords;
    
    return {
        allSymptoms,
        totalRecords
    }
};

module.exports = {
    getSymptoms
};
