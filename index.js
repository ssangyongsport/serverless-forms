'use strict';
var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var nodemailer = require('nodemailer');

// setup the server
// listen on port specified by the `PORT` env var
var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        //processAllFieldsOfTheForm(req, res);
        processFormFieldsIndividual(req, res);
    }
});
var port = process.env.PORT || 8080;
server.listen(port);
console.log("server listening on ", port);

// serve HTML file
// located according to the `FORM` env var
function displayForm(res) {
    fs.readFile(process.env.FORM || 'form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

// get the POST data 
// and call the sendMail method
function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });
}

function processFormFieldsIndividual(req, res) {
    var fields = [];
    var form = new formidable.IncomingForm();
    form.on('field', function (field, value) {
        console.log(field);
        console.log(value);
        fields[field] = value;
    });

    form.on('end', function () {
        res.writeHead(302, {
            'Location': 'https://ssangyongsports.eu.org/thanks'
        });
        res.end();
        sendMail(util.inspect(fields), fields['email']);
    });
    form.parse(req);
}

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function sendMail(text, replyTo) {
    let mailOptions = {
        from: process.env.FROM || 'Email form data bot <no-reply@no-email.com>',
        to: process.env.TO,
        replyTo: replyTo,
        subject: 'New form submission' + (process.env.SITE_NAME ? ' on ' + process.env.SITE_NAME : ''),
        text: text
    };
    console.log('sending email: ', mailOptions);
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}
