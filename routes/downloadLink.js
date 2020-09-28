const express = require('express')
const router = express.Router();
const File = require('../models/file')

router.get('/:uuid' ,async (req,res)=>{
    
    try {
        const file = await File.findOne({ uuid : req.params.uuid })
        if(!file)
        {
            return res.render('download', { error : 'Link has been expired'})
        }
        
        res.download(file.path)

    } catch (error) {
        return res.render('download' , { error : 'Something went wrong'})
    }
})

module.exports = router