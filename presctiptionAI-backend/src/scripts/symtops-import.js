const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../startup/db/pool');

async function insertSymptoms(filePath) {
    try {
        // Connect to the PostgreSQL database

        const insertQuery = 'INSERT INTO symptoms(name) VALUES($1) RETURNING *';

          // Read the CSV file
          fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', async (row) => {
              const values = [
                  row['symptoms'],
              ];
              
              try {
                  const res = await pool.query(insertQuery, values);
                  console.log('Inserted medicine:', res.rows[0]);
              } catch (error) {
                  console.error('Error inserting medicine:', error);
              }
          })
          .on('end', () => {
              console.log('CSV file successfully processed');
          });
    } catch (err) {
        console.error('Error inserting symptoms:', err);
    }
}

// Call the function to import medicines
const csvFilePath = './inputs/symptoms.csv'; // Specify the path to your CSV file
insertSymptoms(csvFilePath);