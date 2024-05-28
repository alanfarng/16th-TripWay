let map;
let currentPosition;
let directionsRenderer;
let infowindow;
const markers = [];

document.addEventListener("DOMContentLoaded", function() {
    var spinner = document.getElementById("loading-spinner");
    var content = document.getElementById("map");

    initMap();

    google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
        spinner.style.display = "none";
        content.style.display = "block";
        
        showCurrentPosition();
        searchNearby(); 
    });
});

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
    });

    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    infowindow = new google.maps.InfoWindow();

    navigator.geolocation.getCurrentPosition(function(position) {
        currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        map.setCenter(currentPosition);

        const marker = new google.maps.Marker({
            position: currentPosition,
            map: map,
            title: 'Your Location'
        });
    }, function() {
        alert("Error: The Geolocation service failed.");
    });
}
function showCurrentPosition() {
    navigator.geolocation.getCurrentPosition(function(position) {
        currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        const marker = new google.maps.Marker({
            position: currentPosition,
            map: map,
            title: 'Your Location'
        });

        map.setCenter(currentPosition);
    }, function() {
        alert("Error: The Geolocation service failed.");
    });
}

function searchNearby(type) {
    if (!currentPosition) {
        return;
    }

    const request = {
        location: currentPosition,
        radius: 1000,
        type: [type]
    };

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbyCallback);
}

function nearbyCallback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        clearMarkers();
        for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    } else {
        alert("搜索附近失敗，原因：" + status);
    }
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, "click", function() {
        showPlaceDetails(place, marker);
    });

    markers.push(marker);
}

function showPlaceDetails(place, marker) {
    const service = new google.maps.places.PlacesService(map);
    service.getDetails({ placeId: place.place_id }, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const contentString = `
                <div class="info-window">
                    <h3>${details.name}</h3>
                    <img src="${details.photos ? details.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) : ''}" alt="${details.name}">
                    <p><strong>地址:</strong> ${details.formatted_address}</p>
                    <p><strong>電話:</strong> ${details.formatted_phone_number || 'N/A'}</p>
                    <p><strong>營業時間:</strong> ${details.opening_hours ? details.opening_hours.weekday_text.join('<br>') : 'N/A'}</p>
                </div>
            `;
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        }
    });
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}