var express = require('express');
var mongoose = require('mongoose');
var util = require('util');
var async = require('async');

var router = express.Router();
var PersonalInfo = mongoose.model('PersonalInfo');
//var ComentGroupOfTheDay = mongoose.model('ComentGroupOfTheDay');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/personalinfo', function(req, res, next) {
	PersonalInfo.find(function(err, personalinfo){
    if(err){ return next(err); }

    res.json(personalinfo);
  });
});

router.post('/personalinfo', function(req, res, next) {
	  var personalinfo = new PersonalInfo(req.body);

	  personalinfo.save(function(err, personalinfo){
	    if(err){ return next(err); }

	    res.json(personalinfo);
	  });
	});


router.put('/personalinfo/:id', function(req, res) {
	PersonalInfo.findOne({ _id: req.params.id }, function(err, personalinfo) {
	    if (err) {
	        return res.send(err);
	      }
	   
	      for (prop in req.body) {
	    	  personalinfo[prop] = req.body[prop];
	      }
	   
	      personalinfo.save(function(err) {
	        if (err) {
	          return res.send(err);
	        }
	   
	        res.json(personalinfo);
	      });
	    });
	  });


router.param('personalinfo', function(req, res, next, id) {
	  var query = PersonalInfo.findById(id);
	  query.exec(function (err, personalinfo){
	    if (err) { return next(err); }
	    if (!personalinfo) { return next(new Error('can\'t find personalinfo')); }
	    req.personalinfo = personalinfo;
	    return next();
	  });
	});

router.get('/personalinfoform', function(req, res, next) {
	var personalinfoform={
		"formID":"personalinfo",
		"formType":"dataEntry",
		"formTitle":"Personal Info Form",
		"formSubTitle":"Let's get you started",
		"fields":[
			{	"fieldName":"fname",
				"fieldCaption":"First Name",
				"fieldType":"alpha",
				"validation":[
					{
						"validationName":"MinMaxLength",
						"minLength":2,
						"maxLength":30,
						"errorMessage":"Enter a string of 2 to 30 char length"
					},
					{
						"validationName":"NotEmpty",
						"errorMessage":"First Name cannot be empty"
					}
				]
			},
			{	"fieldName":"lname",
				"fieldCaption":"Last Name",
				"fieldType":"alpha",
				"validation":[
					{
						"validationName":"MinMaxLength",
						"minLength":2,
						"maxLength":30,
						"errorMessage":"Enter a string of 2 to 30 char length."
					}
				]
			},
			{	"fieldName":"dob",
				"fieldCaption":"Date of birth",
				"fieldType":"date",
				"validation":[
					{
						"validationName":"cannotBeFutureDate",
						"errorMessage":"Are you from future?"
					},
					{
						"validationName":"minDate",
						"minDate":"1900/01/01",
						"errorMessage":"You are too old."
					}
				]
			},
			{	"fieldName":"gender",
				"fieldCaption":"Gender",
				"fieldType":"singleSelect",
				"options":["Male","Female","Other"]
			}
		],
		"controls":[
			{
				"action":"save",
				"caption":"Save",
				"response":[
					{
						"resposeType":"success",
						"message":"Record saved successfully"
					},
					{
						"resposeType":"failure",
						"message":"Record saved failed"
					}
				]
			},
			{
				"action":"cancel",
				"caption":"Cancel"
			}
		]
	};
	res.json(personalinfoform);
});


module.exports = router;