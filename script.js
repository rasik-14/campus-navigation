  var firebaseConfig = {
    apiKey: "AIzaSyDk3N0GM5F50O4tDhx6lNSWWLcSzXBQFAg",
    authDomain: "campusnavigationweb.firebaseapp.com",
    databaseURL: "https://campusnavigationweb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "campusnavigationweb",
    storageBucket: "campusnavigationweb.firebasestorage.app",
    messagingSenderId: "55248148068",
    appId: "1:55248148068:web:94191fe44153d2d1ae3171"
  };
 
 firebase.initializeApp(firebaseConfig);
var database = firebase.database();
 
 
 
 

let map;
let markers = [];
let accessibilityMode = false;

// Toggle accessibility mode
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("accessibilityToggle");
  if (toggle) {
    toggle.addEventListener("change", (e) => {
      accessibilityMode = e.target.checked;
      loadBuildings();
    });
  }
});

// This function is called by Google Maps API
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 18.5204, lng: 73.8567 }, // example campus location
    zoom: 17
  });

  loadBuildings();
}

// Example campus buildings (temporary data)
const buildings = [
  { name: "CSE Block", lat: 18.5204, lng: 73.8567, hasRamp: true },
  { name: "Library", lat: 18.5210, lng: 73.8572, hasRamp: true },
  { name: "Admin Office", lat: 18.5198, lng: 73.8561, hasRamp: false }
];

function loadBuildings() {
  // Clear old markers
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  buildings.forEach(b => {
    if (!accessibilityMode || b.hasRamp) {
      const marker = new google.maps.Marker({
        position: { lat: b.lat, lng: b.lng },
        map: map,
        title: b.name
      });
      markers.push(marker);
    }
  });
}
