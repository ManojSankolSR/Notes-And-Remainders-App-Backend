const express=require('express');
const scheduler=require('node-schedule')
const bodyParser=require('body-parser')
const nodemailer=require('nodemailer')
const moment=require('moment');


const app=express();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    debug:true,
    logger:true,
    auth: {
      user: "lgndark6361@gmail.com",
      pass: "dsmu ufli cjqc jyue",
    },
    tls:{
        rejectUnauthorized:true
    }
  });

app.use(bodyParser.urlencoded({extended:true}));


app.post('/cancel',(req,res)=>{
    console.log(req.body.id);
    const isCanceled=scheduler.cancelJob(req.body.id);
    res.send(JSON.stringify({
        canceled:isCanceled,
    }));
    res.end();
    console.log(isCanceled);
})



app.post('/Schedule',(req,res)=>{
   
    const gmail=req.body.email;
    const data=JSON.parse(req.body.rem);
    console.log(data);
   
    try {
        
        scheduler.scheduleJob(data.id,data.remainderDate,()=>{
            console.log(data.remainderDate);
            transporter.sendMail({
                from: "lgndark6361@gmail.com",
                to: gmail,
                subject: 'Remainder',
                html: `<!DOCTYPE html>
                <html lang="en">

                <head>
                    <style>
                        body{
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        
                        }
                        .card{
                            background-color: ${data.color};
                        
                            width: 250px;
                          
                            /* gap: 8px; */
                            min-height: 270px;
                            box-sizing: border-box;
                            padding: 15px;
                            border-radius: 10px;
                            word-break: break-all;
                        
                        }
                        .date{
                            font-size: 14px;
                            width: 100%;
                        }
                        .title{
                            font-size: 17px;
                            font-weight: 700;
                        }
                        .Note{
                            font-size: 17px;
                            font-weight: 400;
                        }
                        .gap{
                            height: 10px;
                        }
                    </style>
                </head>
                <body>
                
                        <div class="card">
                            <div class="date" >
                                ${moment(data.date).format('D-MMM-yy')}
                            </div>
                            <div class="gap" ></div>
                            <div class="title" >
                                ${data.title}
                            </div>
                            <div class="gap" ></div>
                            <div class="Note" >
                                ${data.description}
                            </div>
                
                        </div>
                
                    
                </body>
                </html>`,
                
              })
        })
        
        console.log(scheduler.scheduledJobs);
        
    } catch (error) {
        console.log(error);
        
    }
    


})




app.listen(8000);