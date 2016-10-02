function Pin (map, coords, country, photos) {
  this._photos = photos;
  this._country = country;

  this._marker = new google.maps.Marker({
    position: coords,
    map: map,
    title: this._country.name
  });

  Object.defineProperty(this, "marker", { get: function () { return this._marker; } });

  if (this._photos.ready)
    this.addInfowindow();
  else
    this._photos.observer(this.addInfowindow, this);
}

Pin.prototype.addInfowindow = function() {
  var photoUrl = this._photos.getPhotoUrl(true);
  this._infowindow = new google.maps.InfoWindow({
    content: "<h2>" + this._country.name + "</h2>" +
      "<img src='" + photoUrl + "'>"
  });

  this._marker.addListener('click', function() {
    this._infowindow.open(map, this._marker);
  }.bind(this));
}