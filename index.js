//.env configuration file
require('dotenv').config();
//express
const express = require('express');
const app = express();

//sendgrid e-mail service
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//file system
var fs = require('fs');

app.use(express.json());



app.get('/email', async  (req, res)=>{
    
    const emailAddr = 'joel@previsio.com.br';


    let body = fs.readFileSync(__dirname+'/emailTemplate.html', 'utf8');

    const msg = {
        to: emailAddr,
        from: process.env.MAIL_USER, // Use the email address or domain you verified above
        replyTo: 'ped@previsio.com.br',
        subject: 'Teste de emails',
        //text: 'Teste com SendGrid email',
        html: body,
        /*
        attachments: [
            {
                filename: filename,
                content: buffer.from(result).toString('base64'),
                type: 'text/html',
                disposition: 'attachment'
                //path: rPath
            }
        ]
        */
        
        
      };


    try{
        await sgMail.send(msg);
        console.log('Email enviado com sucesso!');
        res.status(200).json('Email enviado com sucesso!');
    } catch(error){
        console.log(error);
        if(error.response){
            console.log(error.response.body);
            res.status(400).json('Falha ao enviar!');
        }
    }
    
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
})