require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');

const { authenticate } = require('./middleware/authenticate');
const {User} = require('./models/user');
const {Tag} = require('./models/tag');
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
        console.log('/recommendation/create req.body recommendation',req.body,recommendation);
        res.send(recommendation);
    }   catch (e) {
        console.log('post /recommendation/create error. recommendation not saved. e: ', e);
        res.status(200).send(error(e.message));
    }   
});

//Update  a recommendation
app.post('/recommendation/update/:id', async (req,res) => {
    try {
        const id = req.params.id
        const body = _.pick(req.body, 
            ['serviceName', 
            'providerName', 
            'providerPhone',
            'providerEmail', 
            'description',
            'tags1',
            'tags2',
            'tags3',
            'tags4',
            'eventDate',
            'servicePrice',
            'priceRemarks']); 
        let recommendation = await Recommendation.findByIdAndUpdate(id,body,{new: true});
        console.log('***/recommendation/update/:id recommendation: ', recommendation);

        if (!recommendation){
            throw new Error('1')
        }
        res.send(recommendation);

    } catch(e) {
        console.log('***/recommendation/update/:id error e:', e);
        res.status(200).send(error(e.message));
    }
});

//Delete recommendation
app.post('/recommendation/delete/:id' ,async (req, res) => {
    try {
        const id = req.params.id
        let recommendation = await Recommendation.findOne( {_id: id})
        if (!recommendation){
            throw new Error('1')
        }
        
        await recommendation.remove()
        console.log('***/recommendation/delete/:id removed');
        
        let ok = 'ok'
        res.send({ok});
    } catch (e) {
        res.status(200).send(error(e.message));
    }
})

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

//Create a tag
app.post('/tag/create',async (req,res)=>{
    try{
        const body = req.body;
        const tag = new Tag(body);   
        await tag.save();
        res.send(tag);
    }   catch (e) {
        console.log('post /tag/create error. tag not saved. e: ', e);
        res.status(200).send(error(e.message));
    }   
});

//Update  a tag
app.post('/tag/update/:id', async (req,res) => {
    try {
        const id = req.params.id
        const body = _.pick(req.body, 
            ['tagName', 
            'tagContent']); 
        let tag = await Tag.findByIdAndUpdate(id,body,{new: true});
        console.log('***/tag/update/:id tag: ');

        if (!tag){
            throw new Error('1')
        }
        res.send({tag});

    } catch(e) {
        console.log('***/tag/update/:id error e:', e);
        res.status(200).send(error(e.message));
    }
});

//Delete tag
app.post('/tag/delete/:id' ,async (req, res) => {
    try {
        const id = req.params.id
        let tag = await Tag.findOne( {_id: id})
        if (!tag){
            throw new Error('1')
        }
        
        await tag.remove()
        console.log('***/tag/delete/:id removed');
        
        let ok = 'ok'
        res.send({ok});
    } catch (e) {
        res.status(200).send(error(e.message));
    }
})

//GET all tags
app.get('/tag/all', async (req,res) => {
    try{
        const allTags = await Tag.find({});
        res.send(allTags);
    } catch (e) {
        res.status(200).send(e.message);
    }    
});

app.listen(port, () => {  
    console.log(`Started up at port ${port}`);
});

module.exports = {app};