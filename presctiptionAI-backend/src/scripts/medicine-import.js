const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../startup/db/pool');

async function insertMedicinesFromCSV(filePath) {
    try {
        // Connect to the PostgreSQL database

        const insertQuery = `
            INSERT INTO medicines(name, composition, uses, side_effects, image_url, manufacturer, 
            excellent_review_percent, average_review_percent, poor_review_percent)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;

        // Read the CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', async (row) => {
                const values = [
                    row['Medicine Name'],
                    row['Composition'],
                    row['Uses'],
                    row['Side_effects'],
                    row['Image URL'],
                    row['Manufacturer'],
                    parseFloat(row['Excellent Review %']),
                    parseFloat(row['Average Review %']),
                    parseFloat(row['Poor Review %'])
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
        console.error('Error connecting to the database:', err);
    }
}

// Call the function to import medicines
const csvFilePath = './inputs/Medicine_Details.csv'; // Specify the path to your CSV file
insertMedicinesFromCSV(csvFilePath);
