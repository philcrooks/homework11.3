DEBUG = true;

BASEURL_SEARCH = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1";
BASEURL_FIND_PLACE = "https://api.flickr.com/services/rest/?method=flickr.places.find&format=json&nojsoncallback=1";

function CityPhotos(city, country) {
  this._city = city;
  this._country = country;
  this._photos = null;
  this._callback = null;
  Object.defineProperty(this, "count", { get: function () {
    return (this._photos === null) ? 0 : this._photos.total; } });
}

CityPhotos.prototype.getPhotoUrl = function(small) {
  // https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
  //   or
  // https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
  if (this._photos !== null) {
    var photo = this._photos.photos.photo[0];
    var fileExtension = (small) ? "_m.jpg" : ".jpg";
    return "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + fileExtension;
  }
  return "";
}

CityPhotos.prototype._photoSearch = function(url) {
  this._photos = null;
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function() {
    if (request.status !== 200) return;
    if (DEBUG) console.log("photoSearch incoming request:", request);
    this._photos = JSON.parse(request.responseText);
    if (this._callback !== null) {
      this._callback();
      this._callback = null;
    }
  }.bind(this);
  if (DEBUG) console.log("photoSearch outgoing request:", request);
  request.send();
}

CityPhotos.prototype.requestPhotosOfCity = function(gallery, callback){
  this._callback = callback;
  var cityAndCountry = this._city + "," + this._country
  var url = BASEURL_FIND_PLACE + "&api_key=" + FLICKR_API_KEY + "&query=" +  encodeURIComponent(cityAndCountry);
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function() {
    if (request.status !== 200) return;
    if (DEBUG) console.log("requestPhotosOfCity incoming request:", request);
    var woeid = JSON.parse(request.responseText).places.place[0].woeid;
    var url = BASEURL_SEARCH + "&api_key=" + FLICKR_API_KEY + "&woeid=" + woeid + "&tags=landscape&accuracy=10&per_page=10&in_gallery=" + gallery;
    this._photoSearch(url);
  }.bind(this);
  if (DEBUG) console.log("requestPhotosOfCity outgoing request:", request);
  request.send();
}
