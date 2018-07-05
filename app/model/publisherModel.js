const mongoose = require('mongoose')
const { Schema } = mongoose;
mongoose.Promise = global.Promise;


const feedModel = new Schema({
	publisher: {
		type: String,
		required: [true, "Publisher must not be empty."],
		minlength: [3, "Publisher must be 3 characters or more."],
		index: {
			unique: true,
			sparse: true
		}
	},
	feed: {
		type: [String],
		required: [true, "feed url must not be empty."],
		minlength: [3, "feed url must be 3 characters or more."]
	},
	email: {
		type: [String]
	},
	phone: {
		type: [Number, "Phone number must digit."],
		min: [10, "Phone number should be of 10 digit."],
		max: [11, "Phone number should be of 10 digit."]
	},
	language: {
		type: String,
		required: [true, "Language must not be empty."],
	},
	state: {
		type: String,
		required: [true, "state must not be empty."],
	},
	logo: {
		type: String,
		required: [true, "logo image url must not be empty."],
	},
	addedOn: {
		type: Date,
		default: Date.now
	},
	active: {
		type: Boolean,
		default: true
	}


});

const Publisher = mongoose.model("Publisher", feedModel);

module.exports = Publisher;