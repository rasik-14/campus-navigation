var firebaseConfig = {
  apiKey: "AIzaSyDk3N0GM5F50O4tDhx6lNSWWLcSzXBQFAg",
  authDomain: "campusnavigationweb.firebaseapp.com",
  databaseURL: "https://campusnavigationweb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "campusnavigationweb"
};


firebase.initializeApp(firebaseConfig);
var database = firebase.database();

let map;
let buildings = {};
let polyline = null;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 21.103333, lng: 79.004637 },
    zoom: 18
  });

  loadBuildings();
}

function loadBuildings() {
  database.ref("buildings").once("value").then(snapshot => {
    const fromSel = document.getElementById("fromSelect");
    const toSel = document.getElementById("toSelect");

    fromSel.innerHTML = "";
    toSel.innerHTML = "";

    snapshot.forEach(child => {
      const id = child.key;
      const b = child.val();
      buildings[id] = b;

      new google.maps.Marker({
        position: { lat: b.lat, lng: b.lng },
        map: map,
        title: b.name
      });

      fromSel.add(new Option(b.name, id));
      toSel.add(new Option(b.name, id));
    });
  });
}

function drawPath() {
  clearPath();

  const from = buildings[fromSelect.value];
  const to = buildings[toSelect.value];

  if (!from || !to) {
    alert("Select both buildings");
    return;
  }

  polyline = new google.maps.Polyline({
    path: [
      { lat: from.lat, lng: from.lng },
      { lat: to.lat, lng: to.lng }
    ],
    strokeColor: "#FF0000",
    strokeOpacity: 1,
    strokeWeight: 4,
    map: map
  });

  // 📏 Distance
  const distanceKm = calculateDistance(
    from.lat, from.lng,
    to.lat, to.lng
  );

  // 🚶 Time (walking speed ≈ 5 km/h)
  const timeMinutes = (distanceKm / 5) * 60;

  // 🖥️ Show on UI
  document.getElementById("distance").innerText =
    (distanceKm * 1000).toFixed(0) + " meters";

  document.getElementById("duration").innerText =
    Math.ceil(timeMinutes) + " mins";
}

function clearPath() {
  if (polyline) polyline.setMap(null);
}
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
