function Photographs() {
  this._API_KEY = "bdfce550364ad51359eabbad4e254bea";
  this._BASEURL_SEARCH = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1";
  this._BASEURL_FIND_PLACE = "https://api.flickr.com/services/rest/?method=flickr.places.find&format=json&nojsoncallback=1";
  this._photos = null;
  this._callback = null;
  Object.defineProperty(this, "count", { get: function () {
    return (this._photos === null) ? 0 : this._photos.total; } });
  Object.defineProperty(this, "ready", { get: function () {
    return (this._photos !== null); } });
}

Photographs.prototype.observer = function(callback) {
  this._callback = callback;
}

Photographs.prototype.getPhotoUrl = function(small) {
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

Photographs.prototype._photoSearch = function(url) {
  var request = new XMLHttpRequest();
  this._photos = null
  request.open("GET", url);
  request.onload = function() {
    if (request.status !== 200) return;
       this._photos = JSON.parse(request.responseText);
       if (this._callback !== null) {
        this._callback();
        this._callback = null;
      }
    }.bind(this);
  request.send();
}

Photographs.prototype.requestPhotosAtLatLon = function(lat, lon, gallery){
  var url = this._BASEURL_SEARCH + "&api_key=" + this._API_KEY + "&lat=" + lat + "&lon=" + lon + "&accuracy=10&per_page=10&in_gallery=" + gallery;
  this._photoSearch(url);
}

Photographs.prototype.requestPhotosOfCityByWoeId = function(woeid, gallery){
  var url = this._BASEURL_SEARCH + "&api_key=" + this._API_KEY + "&woeid=" + woeid + "&accuracy=10&per_page=10&in_gallery=" + gallery;
  this._photoSearch(url);
}

Photographs.prototype.requestPhotosOfCity = function(city, country, gallery){
  var request = new XMLHttpRequest();
  var url = this._BASEURL_FIND_PLACE + "&api_key=" + this._API_KEY + "&query=" +  encodeURIComponent(city + "," + country);
  request.open("GET", url);
  request.onload = function() {
    if (request.status !== 200) return;
       var woeid = JSON.parse(request.responseText).places.place[0].woeid;
       this.requestPhotosOfCityByWoeId(woeid, gallery);
    }.bind(this);
  request.send();
}
