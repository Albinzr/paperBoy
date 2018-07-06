const mongoose = require('mongoose')
const Publisher = require('./publisherModel')
const { Schema } = mongoose;
mongoose.Promise = global.Promise;


const feedModel = new Schema({
	key: {
		type: String,
		required: [true, "unique key must not be empty."],
		index: {
			unique: true,
			sparse: true
		}
	},
	title: {
		type: String,
		required: [true, "Title must not be empty."],
		minlength: [3, "Title must be 3 characters or more."],
		index: {
			sparse: true
		}
	},
	summary: {
		type: String,
		required: [true, "Summary must not be empty."],
		minlength: [3, "Summary must be 3 characters or more."],
	},
	content: {
		type: String
	},
	url: {
		type: String,
		required: [true, "Url must not be empty."],
	},
	image: {
		type: String
	},
	category:{
		type:[String]
	},
	publisher:{
		type: Schema.Types.ObjectId,
		ref: "Publisher",
		required: [true, "Article must be connected to a publisher"]	
	},
	publishedOn: {
		type: Date,
		default: Date.now
	},
	active: {
		type: Boolean,
		default: true
	}
});

const standardFeed = mongoose.model("StandardFeed", feedModel);
module.exports = standardFeed;