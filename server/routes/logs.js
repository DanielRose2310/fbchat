const express = require('express');
const router = express.Router();
const { logModel } = require('../models/logs_model');

router.get('/', function (req, res) {
	logModel
		.find({})
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});
router.get('/batch/:chatId/:index', function (req, res) {
	let index = req.params.index;
	console.log(index*5, (index*5)+5)
	logModel
		.aggregate([
			{
				$match: { chatId: req.params.chatId },
			},
			{ $unwind: '$messages' },
			{ $group: { _id: '$_id', messages: { $push: '$messages' } } },{
			$project:{
				messages:{$slice:["$messages",(index*-10),10]},
				 
			}},
		])

		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

router.post('/new/', function (req, res) {
	console.log(req.body);
	logModel
		.findOneAndUpdate(
			{
				chatId: req.body.chatId,
			},

			{
				chatId: req.body.chatId,
			},
			{ upsert: true, new: true }
		)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

router.put('/update/', function (req, res) {
	let chat = logModel.find({ chatId: req.body.chatId });
	chat.updateOne({
		$push: {
			messages: {
				recipientId: req.body.recipientId,
				senderId: req.body.senderId,
				payload: req.body.payload,
				date_time: Date.now(),
			},
		},
	})
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

module.exports = router;
