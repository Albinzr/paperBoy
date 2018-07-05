const Feed = require('../model/standardFeedModel')

const feedController = {};
const fields = 'title, summary, url, category, publisher, publishedOn'

//read feeds
feedController.read = (req, res) => {

    let offset = parseInt(req.param('offset'))
    let limit = parseInt(req.param('limit'))
    
    Feed.find(
        {
            active: true
        }, (error, feeds) => {
            if (error == null) {
				res.status(200).json({
					success: true,
					data: feeds
				})
			} else {
				res.status(404).json({
					success: false,
					message: 'Dose not exist.',
					error: error
				})
			}
        }).sort({ publishedDate: -1 })
		.populate('publisher')
		.skip(offset)
		.limit(limit)
}

//create feeds
feedController.create = (req, res) => {

}

//update feeds
feedController.update = (req, res) => {

}

//update feeds
feedController.delete = (req, res) => {

}


module.exports = feedController