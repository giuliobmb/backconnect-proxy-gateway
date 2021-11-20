const User = require('./database');


let api = () => {
   const express = require('express');
    const app = express();
    const port = 3000;

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

    app.get('/api/addbandwith', async (req, res) => {
      console.log(req.query.username + req.query.password + req.query.bandwith)
      let result = await User.findOne({username: req.query.username, password: req.query.password}).exec();
      if(result != null){
        let nbandwith = Number(result.bandwith) + Number(req.query.bandwith);
        console.log(nbandwith);
        await User.findOneAndUpdate({username: req.query.username, password: req.query.password}, {bandwith: nbandwith}).exec();
        result = await User.findOne({username: req.query.username, password: req.query.password}).exec();
        res.send(result);
      }else{
        res.send({error: 'User not found'});
      }
    })

    app.listen(port, () => {
    console.log(`API server is listening at http://localhost:${port}`);
    }) 
}

module.exports = api;
