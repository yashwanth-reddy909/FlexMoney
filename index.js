const express = require('express');
const mongoose = require('mongoose');const path = require('path');
require('dotenv').config({path: __dirname + '/.env'})
const app = express();
mongoose.set('strictQuery', false);
app.use(express.json());
var router = require('./routes/index');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    // date.setMonth(date.getMonth() + 1);
    // console.log(date);
    console.log(`Server Started at ${PORT}`)
});

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=>{
    console.log('Connected to mongo online cluster ');
  })
  .catch(err=>{
    console.log(err);
});
app.use(router);

app.use(express.static(path.join(__dirname, "./flexmoney_react/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./flexmoney_react/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

