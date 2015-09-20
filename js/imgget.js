
// requirements: async, flickr api, request through npm
var fs = require('fs') 
var request = require("request") 
var async = require("async")


tag_file_path = "/home/squilter/projects/image-golf/tagfinder/output.txt"

console.log("HI")
generateRandomStartingTag();
generateStartingImage();

function generateRandomStartingTag()
{
    fs.readFile(tag_file_path, 'utf8', function (err,all_tags) {
        if (err) {
            return console.log(err);
        }
        var tag_array = all_tags.split("\n");
        var random_index = Math.floor((Math.random() * tag_array.length) + 1); 
        console.log(tag_array[random_index]);
        return(tag_array[random_index]);
    });
}

//finds three random tags, appends them, and searches flickr for that string.  Takes a random result.  Returns a URL
function generateStartingImage()
{
    fs.readFile(tag_file_path, 'utf8', function (err,all_tags) {
        if (err) {
            return console.log(err);
        }
        var tag_array = all_tags.split("\n");
        var random_index1 = Math.floor((Math.random() * tag_array.length) + 1);
        var random_index2 = Math.floor((Math.random() * tag_array.length) + 1);
        
        console.log([tag_array[random_index1],tag_array[random_index2]])
        
        list_of_urls = getImages([tag_array[random_index1],tag_array[random_index2]])
        
        console.log(list_of_urls)
        
        // if(list_of_urls == [] || list_of_urls == undefined){
        //     return(generateStartingImage());
        // } 
        
        var random_img_index = Math.floor((Math.random() * 4) + 1);
        
        console.log(list_of_urls[random_img_index])
        
        return(list_of_urls[random_img_index]);
    });
}

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
