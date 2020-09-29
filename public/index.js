
const dropzone = document.querySelector('.drop-zone')
const fileinput = document.querySelector('#fileinput')
const browseBtn = document.querySelector('.browseBtn')
const bgProgress = document.querySelector('.bg-progress')
const percentDiv = document.querySelector('#percent')
const progressBar = document.querySelector('.progress-bar')
const progressContainer = document.querySelector('.progress-container')
const fileURL = document.querySelector('#fileURL')
const sharingContainer = document.querySelector('.sharing-container')
const copyButton = document.querySelector('#copyBtn')
const emailForm = document.querySelector('.emailForm')
const button = document.querySelector('#hi')
const Popup = document.querySelector('.msg')
const emailButton = document.querySelector('#email-button')


const host = "https://sr-inshare.herokuapp.com"
const uplaodURL = `${host}/api/files`
const emailURL = `${host}/api/files/send`
const maxAllowedSize = 1024 * 1024 * 100;

dropzone.addEventListener('dragover'  , (e)=>{
    e.preventDefault()
    console.log('dragging ')
    if(!dropzone.classList.contains('dragged'))
    {
        dropzone.classList.add('dragged')
    }
   
})
dropzone.addEventListener('dragleave'  , (e)=>{
   e.preventDefault()
    dropzone.classList.remove('dragged')
})

dropzone.addEventListener('drop'  , (e)=>{
    e.preventDefault()
    dropzone.classList.remove('dragged')
    const files = e.dataTransfer.files
    console.table(files)
    if(files.length)
    {
        fileinput.files = files
        uploadfile()
    }
})


browseBtn.addEventListener('click' , ()=>{
    fileinput.click()
})
fileinput.addEventListener('change' ,()=>{
    if(fileinput.files)
    {
        uploadfile();
    }
})

copyButton.addEventListener('click' ,()=>{
     fileURL.select()
     document.execCommand('copy')
     showToast('Link copied')
})


const uploadfile =()=>{
    const files = fileinput.files[0]
    if(fileinput.files.length > 1)
    {
        fileinput.value=''
        showToast('Only upload 1 file')
        return;
    }
    if(files.size > maxAllowedSize)
    {
        fileinput.value=""
        showToast("Can't upload more than 100MB")
        return;
    }
    progressContainer.style.display = 'block'
    const formdata = new FormData()
    formdata.append('myfile' , files)

    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange =()=>{
       if(xhr.readyState === XMLHttpRequest.DONE){
           console.log(xhr.response)
            showLink(JSON.parse(xhr.response))
       }
    }

    xhr.upload.onprogress = updateProgress
    xhr.upload.onerror = ()=>{
        fileinput.value = ""
        showToast(`Error in upload : ${xhr.statusText}`)
    }

    xhr.open("POST" , uplaodURL);
    xhr.send(formdata)
}

const updateProgress =(e)=>{
    const percent =Math.round((e.loaded/e.total) * 100)
    bgProgress.style.width = `${percent}%`
    percentDiv.innerHTML = percent
    progressBar.style.transform = `scaleX(${percent/100})`
}

const showLink =({ file })=>{
    fileURL.value = file
    emailForm[2].removeAttribute('disabled');
    fileinput.value = ''
    progressContainer.style.display = 'none'
    sharingContainer.style.display = 'block'
}

emailForm.addEventListener('submit' , (e)=>{
    e.preventDefault();
    console.log('sumbit form')

    const url = fileURL.value;
    const formData = {
        uuid : url.split('/').splice(-1,1),
        emailTo : emailForm.elements['to-email'].value,
        emailFrom : emailForm.elements['from-email'].value
    }

    emailForm[2].setAttribute('disabled' , 'true');
    fetch(emailURL , {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json' 
        },
        body : JSON.stringify(formData)
    }).then(res => res.json()).then(data =>{
        const { success } = data;
        if(success)
        {
            sharingContainer.style.display = 'none'
            emailButton.click();
        }
    })
    .catch(e => console.log(e))
})

let timer;
const showToast = (msg)=>{
    Popup.innerHTML = msg
    Popup.style.transform = 'translateY(0px)'
    clearTimeout(timer);
    timer = setTimeout(()=>{
        Popup.style.transform = 'translateY(60px)'
    },2000)
}