// const Feed = require('../model/feedModel')
const https = require("https");
const http = require("http");
const parseString = require('xml2js').parseString;
var convert = require('xml-js');
const Publisher = require('../model/publisherModel')
const StandardFeedModel = require("../model/standardFeedModel")
const manoramaonlineParser = require('../parser/manoramaonlineParser')
const deshabhimaniParser = require('../parser/deshabhimaniParser')
const metrovaarthaParser = require('../parser/metrovaarthaParser')
const thejasnewsParser = require('../parser/thejasnewsParser')


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
                    return createStandardFeed(feed, publisherDetails)
                }).then(standardFeedArray => {
                    return saveStandardFeed(standardFeedArray)
                }).then(() => {
                    // res.json({
                    //     status: "success"
                    // })
                }).catch(error => {
                    // console.log("error", error);
                    // res.json({
                    //     status: "failled"
                    // })
                })
                    .catch(error => {
                        // console.log("error", error);
                        // res.json({
                        //     status: "failled"
                        // })
                    })
            })

        })

    })

}

//update feeds
feedUpdateController.delete = (req, res) => {

}

//get http
const getHttp = url => (url.indexOf("https") === 0) ? https : http

//get feed details
const getPublisherDetails = () => {
    return Publisher.find((error, feed) => {
        if (error == null) {
            return feed
        } else {
            return
        }
    }).select(['id', 'feed','publisher']);
}

//check for update
const checkForUpdatedFeed = (id, feed) => {
    return new Promise(resolve => {
        getHttp(feed).get(feed, resp => {
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

        // var result1 =  convert.xml2json(xml, {compact: true, spaces: 2});
        // console.log(result1);
        
        parseString(xml, { trim: true, ignoreAttrs: false, explicitArray: false }, (error, result) => {
            if (error == null) {
                resolve(result)
            }
            reject(error)
        })

    })
}

//create standard feed
const createStandardFeed = (data, publisherDetails) => {
    console.log(publisherDetails);
    
    let functionName = publisherDetails.publisher + "Parser"    
    console.log(functionName);
    
    return eval(functionName)(data, publisherDetails.id)

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
