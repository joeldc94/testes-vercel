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
    let attachment = fs.readFileSync(__dirname+'/abc.pdf').toString("base64");

    const msg = {
        to: emailAddr,
        from: process.env.MAIL_USER, // Use the email address or domain you verified above
        replyTo: 'ped@previsio.com.br',
        subject: 'Teste de emails',
        //text: 'Teste com SendGrid email',
        html: body,
        
        attachments: [
            {
                filename: 'relatorio.pdf',
                content: attachment,
                type: 'application/pdf',
                disposition: 'attachment'                
            }
        ] 
      };


    try{
        await sgMail.send(msg);
        console.log('Email enviado com sucesso!');
        await fs.unlinkSync(__dirname+'/abc.pdf');
        console.log('Arquivo deletado');
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