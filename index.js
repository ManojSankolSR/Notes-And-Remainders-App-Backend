
const express = require('express');
const scheduler = require('node-schedule')
const verifyEmail = require('@devmehq/email-validator-js')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const moment = require('moment');
const cors = require('cors');
const axios = require('axios');



const app = express();

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
    tls: {
        rejectUnauthorized: true
    }
});


app.use(cors({
    origin: 'https://notes-and-remainders-app.onrender.com',
    methods: ['POST'],
}))

app.use(bodyParser.urlencoded({ extended: true }));


app.post('/sendOTP', async (req, res) => {
    const email = req.body.email;
    console.log(email);
    
    const options = {
        method: 'GET',
        url: 'https://api.dev.me/v1-get-email-details',
        params: { email: email,verifyMx:true,verifySmtp:true },
        headers: {
            Accept: 'application/json',
            'x-api-key': '661772f768938d8a958a583f-91033235bada' 
        }
      

    };
    
    

    const resposne=await axios.request(options);
    if(resposne.data.validSmtp===true){
        const OTP = Math.floor(Math.random() * 1000000);
        await transporter.sendMail({
            from: "lgndark6361@gmail.com",
            to: email,
            subject: 'Verification',
            text:`OTP TO SignUp Notes and Remainders App is ${OTP}`
        });
        res.send({isValid:true,OTP:OTP});
        return;
        
    }else{
        res.send({isValid:false,OTP:undefined});

    }
    
    console.log(resposne.data);

    
   




})


app.post('/cancel', (req, res) => {
    console.log(req.body.id);
    const isCanceled = schedulear.cancelJob(req.body.id);
    res.send(JSON.stringify({
        canceled: isCanceled,
    }));
    res.end();
    console.log(isCanceled);
})



app.post('/Schedule', (req, res) => {

    const gmail = req.body.email;
    const data = JSON.parse(req.body.rem);
    console.log(data);

    try {

        scheduler.scheduleJob(data.id, data.remainderDate, () => {
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