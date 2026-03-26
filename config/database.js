const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://offozoremmy_db_user:MVq2Ta2j5zFeo4Hj@cluster0.alsrrwd.mongodb.net/').then(()=>{
    console.log('database connected successfully');
})
.catch((error) => {
    console.error('Error connecting to database:', error.message);
});