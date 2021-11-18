const User = require('./database');


let api = () => {
   const express = require('express');
    const app = express();
    const porta = 3000;

    app.get('/api/getusers', (req, res) => {
        User.find().then((result) => {
            res.send(result);
          });
    })

    app.get('/api/adduser', (req, res) => {
        let user = new User({
            username: req.query.username,
            password: req.query.password,
            bandwith: req.query.bandwith
          })
          user.save().then((result) => {
            res.send(result)
          });
    })

    app.listen(porta, () => {
    console.log(`API server is listening at http://localhost:${porta}`);
    }) 
}

module.exports = api;