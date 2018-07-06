const mongoose = require('mongoose')
const StandardFeedModel = require('../model/standardFeedModel')
const parseString = require('xml2js').parseString;

const getImage = feed => feed.enclosure !== undefined||null ? feed.enclosure.$.url : null

const deshabhimaniParser = (feeds, publisherId) => {

    let feedModel = []
    let feedItems = feeds.rss.channel.item
    for (var i in Object.keys(feedItems)) {

        let feed = feedItems[i]
        const model = new StandardFeedModel({
            key: feed.pubDate + publisherId + feed.link,
            title: feed.title,
            summary: feed.description,
            published: feed.pubDate,
            url: feed.link,
            image:  getImage(feed),
            category: [],
            publisher: mongoose.Types.ObjectId(publisherId)
        })
        feedModel.push(model)
    }
    
    return feedModel
}

module.exports = deshabhimaniParser