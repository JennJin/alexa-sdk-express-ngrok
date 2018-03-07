// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const Alexa = require('alexa-sdk');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/', function(req, res) {
    console.log("Alexa Request");
    
    // Prints the incoming Request to log
    console.log("===REQUEST=== \n" + JSON.stringify(req.body)); 
    
    const handlers = {
        'LaunchRequest': function () {
            console.log("Launch Request");
            this.emit('SayHello');
        },
        'HelloWorldIntent': function () {
            console.log("HelloWorldIntent Request");
            this.emit('SayHello');
        },
        'SayHello': function () {
            this.response.speak('Hello World!');
            
            // Prints Response to log
            console.log("==RESPONSE== " + JSON.stringify(this.handler.response));
            this.emit(':responseReady');
        },
        'AMAZON.HelpIntent': function () {
            const speechOutput = 'This is the Hello World Sample Skill. ';
            const reprompt = 'Say hello, to hear me speak.';
    
            this.response.speak(speechOutput).listen(reprompt);
            this.emit(':responseReady');
        },
        'AMAZON.CancelIntent': function () {
            this.response.speak('Goodbye!');
            this.emit(':responseReady');
        },
        'AMAZON.StopIntent': function () {
            this.response.speak('See you later!');
            this.emit(':responseReady');
        }
    };
    
    // Context is specific to lambda. Define a context variable to handle the behavior
    const context = {
        fail: () => {
        res.sendStatus(500);
    },
    succeed: data => {
        res.send(data);
    }   
    };
        
    const alexa = Alexa.handler(req.body, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
});

app.listen(port);
console.log('The magic happens on port ' + port);