import Overlay from 'ol/Overlay.js';
window.onload = init;

function init(){
    const map = new ol.Map({
        layers:[
            new ol.layer.Tile({
                source: new ol.source.TileJSON({
                    url:'https://api.maptiler.com/maps/streets-v2/tiles.json?key=wchDz6pR3F9CjeKtV0mI',
                    tileSize: 512,
                })
            })
        ],
        target: 'map',
        view: new ol.View({
            center: ol.proj.fromLonLat([-43.206091, -22.920387]),
            zoom: 13
        })
    });

    const marker = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(
                        ol.proj.fromLonLat([-43.206091, -22.920387])
                    )
                })
            ],
        }),
        style: new ol.style.Style({
image: new ol.style.Icon({
src: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
anchor: [0.5, 1]
})
        })
    });

  map.addLayer(marker);     
    
    const toilet = new ol.layer.Vector({
    source: new ol.source.Vector({
        url:'http://thecleanspot.co/listings/api/toilets/',
        format: new ol.format.GeoJSON(),
    })
})
   map.addLayer(toilet);

const endpointUrl = 'http://thecleanspot.co/listings/api/toilets/'; 
fetch(endpointUrl)
    .then(response => response.json())
    .then(data => {
        
        const latitude = data.latitude;
        const longitude = data.longitude;

        const pinpoint = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
        }); 
        const pinpointStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: 'https://openlayers.org/en/latest/examples/icon.html',
                scale: 0.5,
            }),
        });
        pinpoint.setStyle(pinpointStyle);

        const pointLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [pinpoint],
            }),
        });
        map.addLayer(pointLayer);

        const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
});
map.addOverlay(popup);

let popover;
function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}
map.on('click', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });
    disposePopover();
    if (!feature) {
      return;
    }
    popup.setPosition(evt.coordinate);
    popover = new bootstrap.Popover(element, {
      placement: 'top',
      html: true,
      content: feature.get('name'),
    });
    popover.show();
  });
  map.on('pointermove', function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
  });
  
  map.on('movestart', disposePopover);

})
}
