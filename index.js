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
    const content = 'test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123!';

    // list all files in the directory
    
    fs.readdir('/tmp', (err, files) => {
        if (err) {
            throw err
        }
    
        // files object contains all files names
        // log them on console
        files.forEach(file => {
            console.log(file)
        })
    })
    


    await fs.writeFileSync('/tmp/abc.txt', content, (err) => {
        if(err) {
            console.log(err);
        }
    });   

    //read the email body from .html file
    let body = fs.readFileSync(__dirname+'/emailTemplate.html', 'utf8');
    //read the attachment file from .pdf file
    let attachment = fs.readFileSync('/tmp/abc.txt').toString("base64");

    const msg = {
        to: emailAddr,
        from: process.env.MAIL_USER, // Use the email address or domain you verified above
        replyTo: 'ped@previsio.com.br',
        subject: 'Teste de emails',
        //text: 'Teste com SendGrid email',
        html: body,
        
        attachments: [
            {
                filename: 'relatorio.txt',
                //filename: 'relatorio.pdf',
                content: attachment,
                type: 'text/plain',
                //type: 'application/pdf',
                disposition: 'attachment'                
            }
        ] 
      };


    try{
        await sgMail.send(msg);
        console.log('Email enviado com sucesso!');
        //await fs.unlinkSync(__dirname+'/tmp/abc.pdf');
        //console.log('Arquivo deletado');
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