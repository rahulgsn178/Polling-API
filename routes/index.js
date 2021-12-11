const express = require('express');
const mongoose = require('../config/mongoose');
const Question = require('../models/question');
const Option = require('../models/option');


const router = express.Router();


// to get the home index
router.get('/', async (req, res) => {
    let questions = await Question.find({}).populate({ path: 'options' });
    res.render('home', {
        title: 'HOME',
        questions: questions
    });
});


// to create question
router.post('/questions/create', async (req, res) => {

    let question = await Question.create({
        content: req.body.content
    });
    // return res.json({
    //     question: question,
    //     message: "question created"
    // }); 
    return res.redirect('/');

});


// to create options to a specific question
router.post('/questions/:id/options/create', async (req, res) => {
    let question = await Question.findById(req.params.id).populate({
        path: 'options'
    });
    console.log(req.params.id);
    if (question) {
        let option = await Option.create({
            content: req.body.content,
            question: req.params.id,
            vote: 0
        });
        question.options.push(option);
        question.save();

        console.log(question);
        // return res.json({
        //     option: option,
        //     message: "option created"
        // }); 
        res.redirect('/');

    } else {
        return res.json({
            message: "Please put valid Id of the question"
        })
    }


});


// to increase the vote of a given option 
router.get('/options/:id/add_vote', async (req, res) => {


    let option = await Option.findById(req.params.id).populate('question');
    option.vote = option.vote+1;
    console.log(option);
    option.save();
    return res.redirect('/');
    // return res.json({
    //     option: option,
    //     message: "vote increased"
    // });

});

// to delete the option 
router.get('/options/:id/delete', async (req, res) => {
    let option = await Option.findByIdAndDelete(req.params.id);
    return res.redirect('/');
    // return res.json({
    //     message: "option deleted"
    // });

});


// to view question with specific id
router.get('/questions/:id', async (req, res) => {

    let question = await Question.findById(req.params.id).populate('options');
    return res.json({
        question: question,
        message: "question with given id in URL"
    }); 
    // return res.render('question', {
    //     title: "Question",
    //     question: question
    // });

});

// to delete question
router.get('/questions/:id/delete', async (req, res) => {
    console.log(req.params);
    let question = await Question.findByIdAndDelete(req.params.id);
    // return res.json({
    //     message: "question with given id is deleted"
    // })    

    return res.redirect('/');

});


module.exports = router;