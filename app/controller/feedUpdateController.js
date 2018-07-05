// const Feed = require('../model/feedModel')
const https = require("https");
const parseString = require('xml2js').parseString;
const Publisher = require('../model/publisherModel')
const StandardFeedModel = require("../model/standardFeedModel")
const manoramaonlineParserParser = require('../parser/manoramaonlineParser')

const feedUpdateController = {};

//read feeds
feedUpdateController.read = (req, res) => {

}

//create feeds
feedUpdateController.create = (req, res) => {

}

//update feeds
feedUpdateController.update = (req, res) => {
    getPublisherDetails().then(publishersDetails => {

        publishersDetails.forEach(publisherDetails => {

            publisherDetails.feed.forEach(url => {

                checkForUpdatedFeed(publisherDetails.id, url).then(feed => {
                    return feed
                }).then(feed => {
                    return parseXML(feed)
                }).then(feed => {
                    return createStandardFeed(feed, publisherDetails.id)
                }).then(standardFeedArray => {
                    return saveStandardFeed(standardFeedArray)
                }).then(() => {
                    res.json({
                        status: "success"
                    })
                }).catch(error => {
                    console.log("error", error);
                    res.json({
                        status: "failled"
                    })
                })
                    .catch(error => {
                        console.log("error", error);
                        res.json({
                            status: "failled"
                        })
                    })
            })

        })

    })

}

//update feeds
feedUpdateController.delete = (req, res) => {

}

//get feed details
const getPublisherDetails = () => {
    return Publisher.find((error, feed) => {
        if (error == null) {
            return feed
        } else {
            return
        }
    }).select(['id', 'feed']);
}

//check for update
const checkForUpdatedFeed = (id, feed) => {
    return new Promise(resolve => {
        https.get(feed, resp => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                resolve(data)
            })

        }).on("error", (error) => {
            console.log("Error: " + error);
            reject(error)
        });
    })
}

//parse xml
const parseXML = xml => {
    return new Promise(resolve => {

        parseString(xml, { trim: true, ignoreAttrs: false, explicitArray: false }, (error, result) => {
            if (error == null) {
                resolve(result.feed.entry)
            }
            reject(error)
        })

    })
}

//create standard feed
const createStandardFeed = (data, publisherId) => {
    return manoramaonlineParserParser(data, publisherId)
}

//save feed
const saveStandardFeed = standardFeedModel => {

    return new Promise(resolve => {

        StandardFeedModel.insertMany(standardFeedModel, { ordered: false }).then(() => {
            resolve()
        }).catch(error => {

            if (error.code === 11000) {
                console.log("just duplicate");
                resolve()
            } else {
                console.log("error", error);
                reject(error)
            }

        })
    })

}

module.exports = feedUpdateController
