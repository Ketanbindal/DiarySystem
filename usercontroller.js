const express = require('express');
const path = require('path');
const ejs = require('ejs');
const app = express();
const file = require('fs');

// let create = document.getElementById('create');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));
const Filepath = path.join(__dirname, 'File');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));
app.get('/',(req, res)=>
{
    // res.redirect('index.html');
    res.render('index')
});

app.get('/create', (req, res)=>
{
    res.render('create');
    
});
app.get('/delete', async (req, res)=>
{
    file.readdir(Filepath,(err, files)=>
    {
        if(err)
        {
            console.log("there is an error");
        }
        // console.log(files);
        res.render('delete',{files})
        
    })
    // file.unlink(`${Filepath}/day1.txt`, (err)=>
    // {
    //     if(err)
    //     {
    //         res.send("File not found");
    //     }
    //     else
    //     {
    //         res.send("file deleted sucessfully");
    //     }
    // })
});
app.post('/files_deleted',async (req, res)=>
{
    let filestodel = req.body.Filestodel;
    console.log(filestodel);
    // console.log(filestodel.length);
    // console.log(typeof(filestodel));
    // let arr = JSON.parse(filestodel);
    // Array(filestodel)
    // filestodel = Object.values(filestodel);
  
    if(filestodel.length == 0)
    {
        res.redirect("/");
    }
    else if(typeof(filestodel)==="string")
    {
        file.unlink(`${Filepath}/${filestodel}`,(err)=>
            {
                if(err)
                {
                    res.send("something wrong happpened");
                }
                else
                {
                    res.send("file deleted");
                }
            })
    }
    else
    {
    filestodel = Object.values(filestodel);
    let deletefiles = filestodel.map(fle=>
    {
        return new Promise((resolve, reject)=>
        {
            file.unlink(`${Filepath}/${fle}`, (err)=>
                {
                    if(err)
                        {
                            reject("cant delete file")
                        }
                    else{
                            resolve("file deleted");
                        }
                        })
        })
    }
    )
 
    try
    {
        await Promise.all(deletefiles);
        res.redirect('/');
    }
    catch(e)
    {
        console.log(e);
        res.send("Error occured");
    }
}
    
    // let allfiledelpromise = new Promise((resolve, reject)=>{
    //     filestodel.forEach(fle => {
    //         let singledelfile = new Promise((resolve, reject)=>
    //         {
    //             file.unlink(`${Filepath}/${fle}`, (err)=>
    //             {
    //                 if(err)
    //                 {
    //                     reject("cant delete file")
    //                 }
    //                 else{
    //                     resolve("file deleted");
    //                 }
    //             })
    //         }).then((res)=>
    //             {
    //                 console.log(fle, "deleted");
                  
    //             }).catch((err)=>
    //             {
    //                console.log("problem here");
    //             });
          
    //     });
    //     resolve("files deleted");
    // }
    // ).then((res)=>
    // {
    //     res.send("done")
    // }
    // ).catch((err)=>{
    //     res.send(err);
    // });    
    
}
)
app.post('/filecreated', (req, res)=>
{
    let data = req.body.file_data;
    let filename = req.body.file_name;
    data = String(data);
    file.writeFile(`${Filepath}/${filename}.txt`, data , (err)=>
    {
        if(err)
        {
            console.log("Fatt gaya");
        }
        else{
            console.log("le re lnd k bn gye teri file");
        }
    } )
    res.send('file created');

})
app.get('/edit', (req, res)=>
{
    file.readdir(Filepath,(err, files)=>
        {
            if(err)
            {
                console.log("there is an error");
            }
            // console.log(files);
            res.render('edit',{files})
        })
});
app.post('/file_to_edit', (req, res)=>
{
    let filename = req.body.Filename;
    let data = file.readFileSync(`${Filepath}/${filename}`, 'utf8');
    console.log(data)
    res.render('editingfile', {data, filename} );
});
app.post('/fileedited', (req, res)=>
{
    let filename = req.body.file_name;
    let data = req.body.file_data;
    try{
    file.writeFileSync(`${Filepath}/${filename}`, data,)
    res.redirect('/');
}
catch(e){
    res.send(e);
}
});
app.listen('3000')

