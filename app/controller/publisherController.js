const Publisher = require('../model/publisherModel')
const publisherController = {};

//read publishers
publisherController.read = (req, res) => {

	Publisher.find((error, publisher) => {
		if (error == null) {
			res.json({
				success: true,
				data: publisher
			});
		} else {
			res.json({
				success: false,
				message: "Dose not exist.",
				error: error
			});
		}
	})

}

//create publishers
publisherController.create = (req, res) => {
	const { publisher,
		feed,
		email,
		phone,
		language,
		state,
		logo } = req.body



	let newPublisher = new Publisher({
		publisher,
		feed,
		email,
		phone,
		language,
		state,
		logo
	})

	newPublisher
		.save()
		.then(publisher => {
			res.json({
				success: true,
				data: publisher
			});
		})
		.catch(error => {
			return res.json({
				success: false,
				message: "Couldn't create. Try again after sometime.",
				error: error
			});
		});

}

//update publishers
publisherController.update = (req, res) => {

}

//update publishers
publisherController.delete = (req, res) => {

}




module.exports = publisherController