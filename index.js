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
var conversion = require("phantom-html-to-pdf")();

var buffer = require('buffer/').Buffer;

app.use(express.json());



app.post('/email', async (req, res)=>{

    console.log('Inicializar..');

    const tempFolder = '/tmp/';

    //console.log(JSON.stringify(req.body));
    
    
    const emailAddr = req.body.email;
    
    console.log(`E-mail para: ${emailAddr}`);

    const content = 'test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123, test123!';

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

    /*
    await fs.writeFileSync(tempFolder + `${dateTimeFilename}.txt`, content, (err) => {
        if(err) {
            console.log(err);
        }
    });   
    */

    
    console.log('Gerar arquivo .pdf ...');

    //gerar arquivo .pdf com phantom
    conversion({ 
        html: `<h1>Teste</h1><p>Gerando arquivo PDF a partir de um HTML</p><p>${dateTimeFilename}</p>`
    }, async function(err, pdf) {
        if(err){
            console.log(`Erro na conversão html>pdf: ${err}`);
        } else {
            output =  fs.createWriteStream(tempFolder + dateTimeFilename +'.pdf');
            //console.log(pdf.logs);
            //console.log(pdf.numberOfPages);
            // since pdf.stream is a node.js stream you can use it
            // to save the pdf to a file (like in this example) or to
            // respond an http request.
            await pdf.stream.pipe(output);
            console.log(`PDF gerado!`);

            console.log('Ler arquivo html do body...');
            //read the email body from .html file
            let body = fs.readFileSync(__dirname+'/emailTemplate.html', 'utf8');

            /******/
            
            console.log('ler arquivo .pdf do anexo..');

            fs.readFile((tempFolder + dateTimeFilename +'.pdf'), async (err, data) => {
                if (err) {
                  console.log(err);
                }
                if(data){
                    

                    let attachment = await buffer.from(data).toString('base64');

                    /**********/

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
                                //filename: 'relatorio.txt',
                                filename: 'relatorio.pdf',
                                content: attachment,
                                //type: 'text/plain',
                                type: 'application/pdf',
                                disposition: 'attachment'                
                            }
                        ] 
                    };


                    console.log('Enviar email..');
                    try{
                        await sgMail.send(msg);
                        console.log('Email enviado com sucesso!');
                        await fs.unlink(tempFolder+`${dateTimeFilename}.pdf`, ()=>{console.log('Arquivo deletado')});
                        res.status(200).json('Email enviado com sucesso!');
                    } catch(error){
                        console.log(error);
                        if(error.response){
                            console.log(error.response.body);
                            res.status(400).json('Falha ao enviar!');
                        }
                    } 
                }
            })
        }
    })
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
})