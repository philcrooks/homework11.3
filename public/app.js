var sortOptions = function(dropdownList) {

  var countriesString = new Array();
  for(i = 1; i < dropdownList.length; i++) {
    countriesString[i-1] =
      dropdownList.options[i].text + "," +
      dropdownList.options[i].value + "," +
      dropdownList.options[i].selected;
  }
  countriesString.sort();

  for(i = 1; i < dropdownList.length; i++) {
    var parts = countriesString[i-1].split(',');
    dropdownList.options[i].text = parts[0];
    dropdownList.options[i].value = parts[1];
    if(parts[2] == "true")
      dropdownList.options[i].selected = true;
    else
      dropdownList.options[i].selected = false;
  }
}

var initMap = function() {
  var container = document.getElementById('map');
  return new Map(container);
}

var initialise = function() {
  var map = initMap();

  var url = "https://restcountries.eu/rest/v1/all";
  var info = new CountryInfo();
  info.requestInfo(url);

  var languages = document.querySelector('select');
  sortOptions(languages);
  languages.onchange = function() {
    var selectedCountries = info.filter(this.value);
    if (selectedCountries === null) return;
    map = initMap();
    selectedCountries.forEach(function(country) {
        map.addPin(new google.maps.LatLng(country.latlng[0], country.latlng[1]), country.name);
    })
    map.zoom();
  }

}

window.onload = initialise;