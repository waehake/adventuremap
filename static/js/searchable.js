var myLatLng = [
  {
      title: 'Whitney Museum of American Art',
      des: 'Museum 1',
      lat: 40.739,
      lng: -74.008,
      articleinfo: '',
    },
    {
      title: 'Metropolitan Museum of Art',
      des: 'Museum 2',
      lat: 40.779,
      lng: -73.963,
      articleinfo: '',
    },
    {
      title: 'American Museum of Natural History',
      des: 'Museum 3',
      lat: 40.781,
      lng: -73.974,
      articleinfo: '',
    },
    {
      title: 'Museum of Modern Art',
      des: 'Museum 4',
      lat: 40.761,
      lng: -73.977,
      articleinfo: '',
    },
    {
      title: 'Morgan Library & Museum',
      des: 'Museum 5',
      lat: 40.749,
      lng: -73.981,
      articleinfo: '',
    },
];

var map;

var mapItems = function (data) {
    var self = this;
    this.title = data.title;
    this.des = data.des;
    this.lat = data.lat;
    this.lng = data.lng;
    this.articleinfo = data.articleinfo;

    //create an observable to handle displaying markers on the map
    this.visible = ko.observable(true);

    //gather information based on the title of marker
    var wikiInfo = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + this.title + '&format=json&callback=?';

    console.log('WikiInfo to display: ' + wikiInfo);

    //global infoWindow ( Udacity instructor suggestion)
    var infoWindow = new google.maps.InfoWindow();

    $.getJSON(wikiInfo).done(function(data) {
      self.articleinfo = data[2][0];
    }).fail(function () {
      alert('There was an error with the Wikipedia database. Please try refreshing the page.');
    });

    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.lat, data.lng),
      map: map,
      title: data.title,
    });

    this.showMarkers = ko.computed(function () {
      if (this.visible() === true) {
        console.log(this.marker, null, 4);
        this.marker.setMap(map);
      } else {
        console.log(this.marker);
        this.marker.setMap(null);
      }
      return true;
    }, this);
    //handle clicks on markers that are displayed
    this.marker.addListener('click', function () {

      infoWindow.setContent(self.articleinfo);
      infoWindow.open(map, this);

      self.marker.setAnimation(google.maps.Animation.BOUNCE);
      //trigger bounce animation for 600ms when a markers clicked
      window.setTimeout(function() {
        self.marker.setAnimation(null);
      }, 1200);

    });

    this.targeted = function(locs) {
      google.maps.event.trigger(self.marker, 'click');
    };
  };


function PageLinkViewModel() {

  var self = this;

  this.searchItem = ko.observable('');

  this.locList = ko.observableArray([]);

  //create an instance of the mapdata per loclist
  myLatLng.forEach(function (locItem) {
    self.locList.push(new mapItems(locItem));
    console.log('Location Item: ', locItem);
  });

  this.computedLocations = ko.computed(function () {
    var filtered = self.searchItem().toLowerCase();
    console.log('filtered item: ' + filtered);
    if (!filtered) {
      self.locList().forEach(function (locItem) {
        console.log('LocItem: ' + locItem);
        locItem.visible(true);
      });
      return self.locList();
    } else {
      return ko.utils.arrayFilter(self.locList(), function (locItem) {
        var string = locItem.title.toLowerCase();
        console.log('String Item: ' + string);
        var result = (string.search(filtered) >= 0);
        locItem.visible(result);
        return result;
      });
    }
  }, self);

}

//in case there's an issue loading google maps
function errorOnStart() {
  alert('Google maps did not load, please refresh this page and check your internet connection');
}

//google maps initilize function
function initMap() {
  //inital map - moved to initMap as per Udacity instructor recommendation
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: { lat: 40.739, lng: -74.008 },
  });
  ko.applyBindings(new PageLinkViewModel());
}
