const mongoose = require('mongoose')
require('dotenv').config()

function connectDB(){

    mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser : true , useCreateIndex : true , useUnifiedTopology : true , useFindAndModify : true}).then(()=>{
        console.log('Database is connected')
    }).catch(e => console.log(e))
  
}


module.exports = connectDB