CountryInfo.prototype.requestInfo = function(url){
  this._countries = null;
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function() {
    if (request.status !== 200) return;
      this._countries = JSON.parse(request.responseText);
    }.bind(this);
  request.send();
} 

CountryInfo.prototype.filter = function(filterLanguage) {
  // console.log(this.languageList());
  if (this._countries === null) return null;
  return this._countries.filter(function(country) {
    for(var language of country.languages) {
      if(filterLanguage === language) return true;
    }
    return false;
  });
}

CountryInfo.prototype.languageList = function() {
  if (this._countries === null) return null;
  var languages = [];
  this._countries.forEach(function(country) {
    for(var language of country.languages) {
      if (languages.indexOf(language) < 0) languages.push(language);
    }
  })
  return languages.sort();
}

function CountryInfo() {
  this._countries = null;
}