const app = require('../app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Gracefully close the pool on process exit
process.on('exit', () => {
    pool.end(() => {
      console.log('PostgreSQL pool has ended');
    });
  });