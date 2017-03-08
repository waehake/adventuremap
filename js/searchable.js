function PageLink(data) {
    this.title = data.title;
    this.marker = data.marker;
}

var myLatLng = [
    {
      title: 'Favorite 1',
      marker: 'Australia 1',
      lat: -5.363,
      lng: 131.044
    },
    {
      title: 'Favorite 2',
      marker: 'Australia 2',
      lat: -25.000,
      lng: 131.299
    },
    {
      title: 'Favorite 3',
      marker: 'Australia 3',
      lat: -24.998,
      lng: 121.200
    },
    {
      title: 'Favorite 4',
      marker: 'Australia 4',
      lat: -23.086,
      lng: 120.199
    }
];


function initMap() {


  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng[1]
  });
  var marker;
  //create one instance of InfoWindow to store the content of each corresponding marker
  //https://discussions.udacity.com/t/multiple-markers-multiple-infowindows-help/226784/3
  myinfowindow = new google.maps.InfoWindow({content: ''});
  for(i = 0; i < myLatLng.length; i++) {
    position = new google.maps.LatLng(myLatLng[i].lat, myLatLng[i].lng);
    marker = new google.maps.Marker({
    position: position,
    content: myLatLng[i].marker,
    map: map
  });
  google.maps.event.addListener(marker, 'click', function() {
    myinfowindow.close();
    myinfowindow.open(map, this);
    myinfowindow.setContent(this.content);

  });
  }
}

function PageLinkViewModel() {
    var self = this;
    self.query = ko.observable('');
    self.pageLocations = ko.observableArray(myLatLng);

    self.computedLocations = ko.computed(function() {
        return ko.utils.arrayFilter(self.pageLocations(), function(item) {
            return item.title.toLowerCase().indexOf(self.query().toLowerCase()) >=0;
        });
    });
}

ko.applyBindings(new PageLinkViewModel());
