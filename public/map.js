function Pin (map, coords, title) {
  this.marker = new google.maps.Marker({
    position: coords,
    map: map,
    title: title
  });
  this.infowindow = new google.maps.InfoWindow({
    content: "<h2>This is " + title + "</h2>"
  });
  this.marker.addListener('click', function() {
    this.infowindow.open(map, this.marker);
  }.bind(this));
}

Map.prototype.addPin = function(coords, title) {
  this.pins.push(new Pin(this.googleMap, coords, title));
}

Map.prototype.zoom = function() {
  var n = this.pins.length;
  if (n === 0) return;
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < n; i++) {
    bounds.extend(this.pins[i].marker.getPosition());
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

function Map (container) {
  this.googleMap = new google.maps.Map(container, {
    center: new google.maps.LatLng(0, 150.644),
    zoom: 1,
    minZoom: 1
  });
  this.pins = [];
}