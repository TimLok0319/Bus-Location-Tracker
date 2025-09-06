let map;
let bus01;
let directionsService;
let directionsRenderer;
let busStops;

window.initMap = async function () {
  document.addEventListener("DOMContentLoaded", async () => {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
      center: {
        lat: 4.326907324458727, lng: 101.13633757458516
      },
      zoom: 15,
    });


    bus01 = new google.maps.Marker({
      position: { lat: 4.32655, lng: 101.13636 },
      map: map,
      title: "Bus#01",
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/bus.png",
        scaledSize: new google.maps.Size(40, 40)
      }
    })

    busStops = [
      { id: "standford", name: "StandFord Bus Stop", position: { lat: 4.326512, lng: 101.134936 } },
      { id: "westlake", name: "West Lake Bus Stop", position: { lat: 4.32916, lng: 101.13652 } }
    ];

    const nextStop = new google.maps.Marker({
      position: busStops[0].position,
      map: map,
      title: busStops[0].name,
    })

    document.getElementById("nextStopName").innerText = nextStop.getTitle();

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "red",
        strokeWeight: 5
      }
    });

    // Start the update loop here to prevent race conditions
    setInterval(updateBus, 3000);
    // Trigger the first update immediately to draw the initial route
    updateBus();
  });
}

async function updateBus() {
  try {
    const response = await fetch("http://localhost:3000/bus01");
    const data = await response.json();
    const newBusPosition = { lat: data.lat, lng: data.lng };

    // Update bus marker position
    bus01.setPosition(newBusPosition);

    // Recalculate and redraw the route
    directionsService.route(
      {
        origin: newBusPosition,
        destination: busStops[0].position,
        waypoints: [
          { location: { lat: 4.326928, lng: 101.134971 } }
        ],
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result); // draw route
          const leg = result.routes[0].legs[0];
          document.getElementById("etaBox").innerText = leg.duration.text;
        } else {
          console.error("Directions failed: " + status);
        }
      }
    );
  } catch (err) {
    console.error("Error fetching bus data:", err);
  }

  const pos = bus01.getPosition(); // returns a LatLng object
  console.log("Marker moved to:", pos.lat(), pos.lng());
}



//json-server --watch dummydb.json