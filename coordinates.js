function parseCoordinates(inputString) {
    
    const [latitude, longitude, coordinate] = inputString.split(',');

    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);
    const parsedCoordinate = parseFloat(coordinate);

    return {
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        coordinate: parsedCoordinate
    };
}

//const inputString = "37.7235125,-122.6078939,12";
//const { latitude, longitude, coordinate } = parseCoordinates(inputString);



const endpointUrl = 'http://thecleanspot.co/listings/api/toilets/'; 
fetch(endpointUrl)
    .then(response => response.json())
    .then(data => {
        
        const { latitude, longitude, coordinate } = parseCoordinates(data[0].geolocation);
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Coordinate:", coordinate);

        
});
