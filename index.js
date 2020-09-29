const express = require('express')
const app = express();
const path = require('path')

const connectDB = require('./config/db')
connectDB()

const fileroutes = require('./routes/files')
const downloadroutes = require('./routes/download')
const downloadLinks = require('./routes/downloadLink')

//cors
const cors = require('cors')
const Corsoptions = {
    origin :process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(Corsoptions))

app.use(express.static('public'))
app.use(express.json())
//views
app.set('views' , path.join(__dirname , '/views'))
app.set('view engine', 'ejs')

//Routes
app.get('/' , (req ,res)=>{
    res.render('index')
})

app.use('/api/files' , fileroutes)
app.use('/files' , downloadroutes)
app.use('/files/download', downloadLinks)

const PORT = process.env.PORT || 3000
app.listen( PORT , ()=>{
    console.log(`Listening on Port ${PORT}`)
})
