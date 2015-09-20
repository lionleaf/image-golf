
// requirements: async, flickr api, request through npm
var fs = require('fs') 
var request = require("request") 
var async = require("async")

async.waterfall([
    function openFile(callback) {
        // code a
        fs.readFile('flickr_secret_key.txt', 'utf8',function(err,data) {
            if (err) {
                callback(err)
            }
            else {
                callback(null,data)
            }
        })
    },
    function contactFlickr(data, callback){
        var sk = data;
        var Flickr = require("flickrapi"),
        flickrOptions = {
          api_key: "10ef3d396caccf5fbb5998765284808f",
          secret: sk,
          silent: true,
          progress: false
        } 
        //callback (null, 'a')
    
        Flickr.tokenOnly(flickrOptions, function(err, flickr) {
            if (err) {
                callback(err)
            } 
            else {
                callback(null, flickr)
            }
        })
    },
    function searchForPhotos(flickr, callback){      
        var q = '' 
        var args = process.argv.slice(2) 
        
        q = args.join('+')
        
        flickr.photos.search({text: q,page: 1,per_page: 100}, 
        function (err, result) {
            if (err) {
                callback (err)
            }
            else {
                callback (null, result)
            }
        })
    },
    
    function findRandomPhotos (result, callback) {
        var photos = result.photos 
        var photo_list = photos.photo 
        
        var rns = [] 
        // generate three random numbers
        while(rns.length < 3){
            var randomnumber = Math.floor(Math.random() * (photo_list.length - 1))
            
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
        
        rns.forEach(generateURLs)
        
        
        function generateURLs(val,index,arr) {
            var photo = photo_list[val] 
            
            // https://farm1.staticflickr.com/2/1418878_1e92283336_m.jpg
        
            // farm-id: 1
            // server-id: 2
            // photo-id: 1418878
            // secret: 1e92283336
            // size: m
            var url2 = "https://farm"+photo["farm"]+".staticflickr.com/"+photo["server"]+"/"+photo["id"]+"_"+photo["secret"]+"_m.jpg" 
            console.log(url2)
            var path = require('path') 
            var imagetype = path.extname(url2) 
        
            var file = fs.createWriteStream('./image'+index+imagetype)
            request.get(url2).pipe(file)
        }
        callback(null)
    }], 
    function final(err) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Done!")
        }
    }
)