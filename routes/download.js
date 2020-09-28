const express =require('express')
const router = express.Router()
const File = require('../models/file')
router.get('/:uuid' , async (req, res)=>{

    try {
        const file = await File.findOne({ uuid : req.params.uuid})
        if(!file)
        {       
            return res.render('download' , { error : 'Link has been expired'})          
        }
        return res.render('download' ,{
            uuid : file.uuid,
            filename : file.filename,
            fileSize : file.size,
            download : `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        })
    } catch (e) {
        return res.render('download' , { error : 'Something went wrong.'})      
    }
  

    
})

module.exports = router