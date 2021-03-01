const express = require('express');
const router = express.Router();
const { logModel } = require('../models/logs_model');

router.get('/', function (req,res) {
	logModel
		.find({})
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});
router.get('/batch/:chatId', function (req, res) {
	logModel
		.findOne({chatId: req.params.chatId})
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
				date_time: Date.now()
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
