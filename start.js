// start.js
const { exec } = require('child_process');
exec('yarn start', (err) => {
    if (err) {
        console.error('Error during yarn start:', err);
        process.exit(1);
    }
});

