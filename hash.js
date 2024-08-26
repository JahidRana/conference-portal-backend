const bcrypt = require('bcrypt');

(async () => {
    const plainPassword = 'admin12345'; // Your plaintext password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('Hashed Password:', hashedPassword);
})();