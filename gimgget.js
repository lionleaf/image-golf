function randomInt (low, high) {
    
    return Math.floor(Math.random() * (high - low) + low) 
}



var fs = require('fs') 
var request = require("request") 
var async = require("async")

function download (url, dest, cb) {
          
    var file = fs.createWriteStream(dest) 
      
    request
        .get(url)
        .on('error', function(err) {
            fs.unlink(dest)  // Delete the file async. (But we don't check the result)
            if (cb) cb(err.message) 
        })
        .pipe(file)
}

// read flickr secret
var sk = "" 
var urllist = []
fs.readFile('flickr_secret_key.txt', 'utf8', contactFlickr)

function contactFlickr (err,data) {
    if (err) {
        return console.log(err) 
    }
    
    sk = data 
    
    var Flickr = require("flickrapi"),
        flickrOptions = {
          api_key: "10ef3d396caccf5fbb5998765284808f",
          secret: sk,
          silent: true,
          progress: false
        } 
    
    Flickr.tokenOnly(flickrOptions, searchForPhotos)
}

function searchForPhotos(error, flickr) {
    // we can now use "flickr" as our API object
    
    var args = process.argv.slice(2) 
    
    var q = args.join('+')
    
    flickr.photos.search({
      text: q,
      page: 1,
      per_page: 100
    }, findRandomPhotos) 
}

function findRandomPhotos(err, result) {
    var photos = result.photos 
    var photo_list = photos.photo 
    
    if(err) { throw new Error(err)  }
    var rns = [] 
    // generate three random numbers
    while(rns.length < 3){
        var randomnumber = randomInt(0, photo_list.length - 1) 
        // console.log(randomnumber) 
        var found=false 
        for(var i=0; i<rns.length; i++){
    	    if(rns[i]==randomnumber){
    	        found=true 
    	        break 
    	    }
        }
        if(!found) {
            rns.push(randomnumber) 
        }
    }
    var urllist = []
    rns.forEach (generateURLs)
    
    function generateURLs(val,index,arr) {
        var photo = photo_list[val] 
        
        // https://farm1.staticflickr.com/2/1418878_1e92283336_m.jpg
    
        // farm-id: 1
        // server-id: 2
        // photo-id: 1418878
        // secret: 1e92283336
        // size: m
        var url2 = "https://farm"+photo["farm"]+".staticflickr.com/"+photo["server"]+"/"+photo["id"]+"_"+photo["secret"]+"_m.jpg" 
        urllist.push(url2)
        //var path = require('path') 
        //var imagetype = path.extname(url2) 
    
        //download(url2, './image'+index) 
    
        //if (imagetype != null) {
        //    fs.rename('./image' + index, './image'+ index + imagetype) 
        //}
    }
    
    console.log(urllist)
    
}