const express = require('express');
const {sequelize} = require('./util/database');
const router = require('./routes/index')
const dotenv = require('dotenv').config(); 
const bodyParser = require('body-parser');
// const commentsRoute = require('./routes/comments');
const PORT = process.env.PORT || 8080
const app = express()

app.use(express.json())
app.use('/api', router);
app.use(bodyParser.json());
// app.use(commentsRoute);


sequelize.sync({
    alter: true
 }).then(() => {
    console.log("db has been re sync")
})

app.get('/', (req, res) => {
    return res.send({
        health: "Good" 
    })
})

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))