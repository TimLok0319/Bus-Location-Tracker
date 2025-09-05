let map;
let bus01;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: {
      lat: 4.326907324458727, lng: 101.13633757458516
    },
    zoom: 20,
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



  const busStops = [
    { id: "standford", name: "StandFord Bus Stop", position: { lat: 4.326512, lng: 101.134936 } },
    { id: "westlake", name: "West Lake Bus Stop", position: { lat: 4.32916, lng: 101.13652 } }
  ];

  const nextStop = new google.maps.Marker({
    position: busStops[0].position,
    map: map,
    title: busStops[0].name,
  })

  document.getElementById("nextStopName").innerText = nextStop.getTitle();

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: "red",
      strokeWeight: 5
    }
  });

  directionsService.route(
    {
      origin: { lat: 4.32665, lng: 101.136336 },   // start point
      destination: { lat: 4.326512, lng: 101.134946 }, // end point
      waypoints: [
        { location: { lat: 4.32672, lng: 101.13575 } }, // stops along the way
        { location: { lat: 4.32675, lng: 101.13468 } }
      ],
      travelMode: google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result); // draw route
        const leg = result.routes[0].legs[0]; // first leg of the route
        const etaText = leg.duration.text;    // e.g. "3 mins"
        const distanceText = leg.distance.text; // e.g. "0.9 km"

        document.getElementById("etaBox").innerText =
          `${etaText}`;

      } else {
        console.error("Directions failed: " + status);
      }
    }
  );
}

async function updateBus() {
  try {
    const response = await fetch("http://localhost:3000/bus01");
    const data = await response.json();

    bus01.setPosition({ lat: data.lat, lng: data.lng });

    console.log("Bus updated:", data);
  } catch (err) {
    console.error("Error fetching bus data:", err);
  }
}

initMap();

setInterval(updateBus, 5000);