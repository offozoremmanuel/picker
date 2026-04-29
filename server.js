require('dotenv').config();
const express = require('express');
const expressSession = require('express-session');
const PORT = process.env.PORT ;

require('./config/database');
require('./models/user');


const userRouter = require('./routes/userRouter');
const paymentRouter = require('./routes/payment');
const {passport} = require('./middleware/passport');

const app = express();
app.use(express.json());
app.use(expressSession({
    secret: 'emmanuel',
    resave: true,
    saveUninitialized: true
}))
app.use (passport.initialize())
app.use (passport.session())

app.use( userRouter);
app.use( paymentRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});