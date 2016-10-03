BASEURL_SEARCH = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1";
BASEURL_FIND_PLACE = "https://api.flickr.com/services/rest/?method=flickr.places.find&format=json&nojsoncallback=1";

function Photographs() {
  this._request = null;
  this._url = "";

  this._photos = null;
  this._callback = null;
  Object.defineProperty(this, "count", { get: function () {
    return (this._photos === null) ? 0 : this._photos.total; } });
  Object.defineProperty(this, "ready", { get: function () {
    return (this._photos !== null); } });

  // for debug
  this._cityAndCountry = "";
}

Photographs.prototype.observer = function(callback, context) {
  this._callback = { fnCode: callback, fnContext: context };
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
  this._photos = null;

  this._request = new XMLHttpRequest();
  this._request.open("GET", url);
  // console.log("photoSearch:", this);
  this._request.onload = function() {
    if (this._request.status !== 200) return;
       this._photos = JSON.parse(this._request.responseText);
       // console.log("photoSearch callback:", this);
       if (this._callback !== null) {
        this._callback.fnCode.call(this._callback.fnContext);
        this._callback = null;
      }
    }.bind(this);
  this._request.send();
}

Photographs.prototype.requestPhotosAtLatLon = function(lat, lon, gallery){
  var url = BASEURL_SEARCH + "&api_key=" + API_KEY + "&lat=" + lat + "&lon=" + lon + "&tags=landscape&accuracy=10&per_page=10&in_gallery=" + gallery;
  this._photoSearch(url);
}

Photographs.prototype.requestPhotosOfCityByWoeId = function(woeid, gallery){
  var url = BASEURL_SEARCH + "&api_key=" + API_KEY + "&woeid=" + woeid + "&tags=landscape&accuracy=10&per_page=10&in_gallery=" + gallery;
  this._photoSearch(url);
}

Photographs.prototype.requestPhotosOfCity = function(city, country, gallery){
  this._cityAndCountry = city + "," + country

  var url = BASEURL_FIND_PLACE + "&api_key=" + API_KEY + "&query=" +  encodeURIComponent(this._cityAndCountry);
  this._request = new XMLHttpRequest();
  this._request.open("GET", url);
  this._request.onload = function() {
    if (this._request.status !== 200) return;
      console.log("requestPhotosOfCity:", this);
      var woeid = JSON.parse(this._request.responseText).places.place[0].woeid;
      this.requestPhotosOfCityByWoeId(woeid, gallery);
    }.bind(this);
  this._request.send();
}
