function Map (container) {
  this.googleMap = new google.maps.Map(container, {
    center: new google.maps.LatLng(0, 150.644),
    zoom: 1,
    minZoom: 1
  });
  this._pins = [];
}

Map.prototype.addPin = function(coords, country, photos) {
  this._pins.push(new Pin(this.googleMap, coords, country, photos));
}

Map.prototype.addPhotoToPins = function(index) {
  // 'this' is the map
  var pin = this._pins[index];
  pin.photos.requestPhotosOfCity(true, function() {
    pin.addInfowindow();
    if (index < this._pins.length - 1) this.addPhotoToPins(index + 1)
  }.bind(this))
}

Map.prototype.zoom = function() {
  var n = this._pins.length;
  if (n === 0) return;
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < n; i++) {
    bounds.extend(this._pins[i].marker.getPosition());
  }
  this.googleMap.setCenter(bounds.getCenter());
  this.googleMap.addListener('bounds_changed', function() {
    // 'this' is the googleMap
    if (this.getZoom() > 5) {
      this.setZoom(5);
    }
  })
  this.googleMap.fitBounds(bounds);
}
