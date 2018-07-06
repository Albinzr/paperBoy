const mongoose = require('mongoose')
const StandardFeedModel = require('../model/standardFeedModel')


const manoramaonlineParser = (feeds, publisherId) => {
console.log("in mm");

    var feedModel = [] 

    feeds.feed.entry.forEach(feed => {
        var categories = []
        var category = feed.category
        if (category !== (null || undefined)) {
            for (var i in Object.keys(category)) {
                if (category[i] !== undefined || null) {
                    categories.push(category[i]["$"].term)
                } else {
                    categories.push(category['$'].term)
                }
            }
        }
    
        const model = new StandardFeedModel({
            key: feed.pubDate + publisherId + feed.id,
            title: feed.title._,
            summary: feed.summary._,
            published: feed.published,
            url: feed.id,
            category: categories,
            publisher: mongoose.Types.ObjectId(publisherId)
        })

        feedModel.push(model)
    })
   
    return feedModel
}

module.exports = manoramaonlineParser