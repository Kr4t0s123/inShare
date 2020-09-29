const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const File = require('../models/file')
const { v4 : uuid4 } = require('uuid')
const sendMail  = require('../services/emailSender')

const storage = multer.diskStorage({
   destination : function(req ,file,cb){
     cb(null ,path.join( __dirname , '../uploads'))
   },
   filename : function(req , file , cb){
     
    const uniquename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
    cb(null , uniquename)
    }
  })

const upload = multer({ storage }).single('myfile');

router.post('/' ,async (req, res)=>{

    
    upload(req, res, async (err)=>{
      console.log(req.file)
      if(!req.file)
      {
        return res.json({ error : "All fields are required"})
      }

      if(err)
      {
        return res.json({ error : err})
      }
      const file = new File({
        filename : req.file.filename,
        path : req.file.path,
        size : req.file.size,
        uuid : uuid4()
      })

      const response = await file.save() 
      return res.json({ file : `${process.env.APP_BASE_URL}/files/${response.uuid}`})

    })
        
})


router.post('/send' ,async (req,res)=>{
  const { uuid , emailTo , emailFrom } = req.body

  if(!uuid || !emailFrom || !emailTo) {
    return res.status(422).send({ error : "All field are required."})
  }

  const file = await File.findOne({ uuid })

  if(file.sender){
    return res.status(422).send({ error : "Email already sent"})
  }

  file.sender = emailFrom;
  file.receiver = emailTo;

  const response = await file.save()

  sendMail({
    from : emailFrom,
    to: emailTo,
    subject:"inShare file sharing",
    text :`${emailFrom} shared a file with you`,
    html : require('../services/emailTemplate')({ emailFrom , download : `${process.env.APP_BASE_URL}/files/${file.uuid}` , size : parseInt(file.size/1000) + ' KB' , expires : '24 hours'   })
  })

    return res.send({ success : true});

})
module.exports = router