const mongoose = require('mongoose')
const StandardFeedModel = require('../model/standardFeedModel')
const parseString = require('xml2js').parseString;

const getImage = description =>{
    let image = description.match(/\bhttps?:\/\/\S+/gi)[0]
    return image !== null||undefined ? image.replace('"',"")  : null
}
const getDescription = description => description.replace(/<(?:.|\n)*?>/gm, '') || null

const metrovaarthaParser = (feeds, publisherId) => {

    let feedModel = []
    let feedItems = feeds.rss.channel.item
    for (var i in Object.keys(feedItems)) {
        
        let feed = feedItems[i]

        const model = new StandardFeedModel({
            key: feed.pubDate + publisherId + feed.link,
            title: feed.title,
            summary: getDescription(feed.description),
            published: feed.pubDate,
            url: feed.link,
            image:  getImage(feed.description),
            category: [],
            publisher: mongoose.Types.ObjectId(publisherId)
        })        
        feedModel.push(model)
    }
    
    return feedModel
}

module.exports = metrovaarthaParser