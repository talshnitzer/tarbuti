require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');

const { authenticate } = require('./middleware/authenticate');
const {User} = require('./models/user');
const {Recommendation} = require('./models/recommendation')
const {error} = require('./service')

const app = express();
const corsOptions = {
    origin: '*',
    exposedHeaders: ['Content-Range','x-auth', 'Content-Type']
  }
const port = process.env.PORT ;
app.use(cors(corsOptions));
app.use(bodyParser.json()); //convert the request body from json to an object

//Create a recommendation
app.post('/recommendation/create',async (req,res)=>{
    try{
        const body = req.body;
        const recommendation = new Recommendation(body);   
        await recommendation.save();
        res.send(recommendation);
    }   catch (e) {
        console.log('post /recommendation/create error. recommendation not saved. e: ', e);
        res.status(200).send(error(e.message));
    }   
});

//GET all recommendations
app.get('/recommendation/all', async (req,res) => {
    try{
        const allRecommendations = await Recommendation.find({});
        res.send(allRecommendations);
    } catch (e) {
        res.status(200).send(e.message);
    }    
});

//GET a specific recommendation
app.get('/recommendation/:id', async (req,res) => {
    try{
        const id = req.params.id
        const recommendation = await Recommendation.findById(id);
        res.send(recommendation);
    } catch (e) {
        res.status(200).send(e.message);
    }    
});

app.listen(port, () => {  
    console.log(`Started up at port ${port}`);
});

module.exports = {app};