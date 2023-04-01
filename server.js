var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var dbUrl = 'mongodb://localhost:27017/chatapp'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}).then((messages) => {
        res.send(messages);
    }).catch((err)=>{
        sendStatus(500)
    });
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save().then(()=>{
        io.emit('message', req.body);
        res.sendStatus(200);
    }).catch((err)=>{
        sendStatus(500)
    });
});

io.on('connection', (socket) => {
    console.log('user connected');
});

mongoose.connect(dbUrl)
        .catch (error => console.log(error));

var server = http.listen(3000, () => {
    console.log('server is listing on port:', server.address().port)
});
