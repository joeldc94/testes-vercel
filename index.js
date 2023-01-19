//.env configuration file
require('dotenv').config();

const date = require('date-and-time');
//express
const express = require('express');
const app = express();

//sendgrid e-mail service
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//file system
var fs = require('fs');

//phantom pdf
//var conversion = require("phantom-html-to-pdf")();

//var buffer = require('buffer/').Buffer;

app.use(express.json());



app.post('/email', async (req, res)=>{

    console.log('Inicializar..');

    const tempFolder = '/tmp/';

    //console.log(JSON.stringify(req.body));
    
    
    const emailAddr = req.body.email;
    
    console.log(`E-mail para: ${emailAddr}`);



    // list all files in the directory
    
    console.log('Lista arquivos no /tmp...');
    fs.readdir(tempFolder, (err, files) => {
        if (err) {
            throw err
        }
    
        // files object contains all files names
        // log them on console
        files.forEach(file => {
            console.log(file)
        })
    })
    
    let now = new Date();
    //now = date.addHours(now, -3); //timezone america-sao Paulo
    const dateTimeFilename = date.format(now, 'DDMMYY[_]HHmm');

    const content = `<h1>Teste</h1><p>Gerando arquivo PDF a partir de um HTML</p><p>${dateTimeFilename}</p>`;

    
    fs.writeFileSync(tempFolder + `${dateTimeFilename}.html`, content, (err) => {
        if(err) {
            console.log(err);
        }
    });

    console.log('Ler arquivo html do body...');
    //read the email body from .html file
    let body = fs.readFileSync(__dirname+'/emailTemplate.html', 'utf8');
    let attac = fs.readFileSync(tempFolder + `${dateTimeFilename}.html`, 'base64');

    /******/
    
    console.log('Montar mensagem..');
    const msg = {
        to: emailAddr,
        from: process.env.MAIL_USER, // Use the email address or domain you verified above
        replyTo: 'ped@previsio.com.br',
        subject: 'Teste de emails',
        //text: 'Teste com SendGrid email',
        html: body,
        
        attachments: [
            {
                filename: 'relatorio.html',
                //filename: 'relatorio.pdf',
                //content: content.toString('base64'),
                content: attac,
                type: 'text/plain',
                //type: 'application/pdf',
                disposition: 'attachment'                
            }
        ] 
    };


    console.log('Enviar email..');
    try{
        sgMail.send(msg).then(() => {
            console.log('Email enviado com sucesso!');
            fs.unlink(tempFolder+`${dateTimeFilename}.html`, ()=>{console.log('Arquivo deletado')});
            res.status(200).json('Email enviado com sucesso!');
        })    
    } catch(error){
        console.log(error);
        if(error.response){
            console.log(error.response.body);
            res.status(400).json('Falha ao enviar!');
        }
    } 
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
})