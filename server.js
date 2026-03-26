require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4488;

require('./config/database');
require('./models/user');
app.use(express.json());

const userRouter = require('./routes/userRouter');
app.use( userRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});