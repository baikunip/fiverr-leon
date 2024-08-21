// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = 'pk.eyJ1IjoiYmFpa3VuaXAxNCIsImEiOiJjbDBycXdmbHEwNjY0M2lrN2lubnd1aW43In0.zsbYN2VrQ1Dit4kj4uhzWw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [10.2994,54.073831], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12, // starting zoom
    // minZoom:7,
    // maxZoom:16,
    style: 'mapbox://styles/mapbox/satellite-streets-v12'
});
// draw pulsing dot before load it to the map components
 // to draw a pulsing dot icon on the map.
 const size = 50
 ,pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },

    // Call once before every frame where the icon will be used.
    render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, .5)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        map.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
    }
};

const nopulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },

    render: function () {
        const radius = (size / 2) * 0.3;
        const context = this.context;

        // Draw the inner circle.
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
        );
        context.fillStyle = '#FFFC62';
        context.strokeStyle = 'white';
        context.lineWidth = 1;
        context.fill();
        context.stroke();

        this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;

        return true;
    }
};

// map loading all components
map.on('load', () => {
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
    map.addImage('nopulsing-dot', nopulsingDot, { pixelRatio: 2 });
    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style.
    let firstSymbolId;
    for (const layer of layers) {
        if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
        }
    }
    map.addSource('datapoints', {
        type: 'vector',
        // Use any Mapbox-hosted tileset using its tileset id.
        // Learn more about where to find a tileset id:
        // https://docs.mapbox.com/help/glossary/tileset-id/
        url: 'mapbox://baikunip14.51ogwkf4'
    });
    map.addLayer({
        'id': 'point',
        'source': 'datapoints',
        'source-layer': 'Stromerzeuger_1_bis_36666-48glzr',
        'type': 'symbol',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#FFFC62'
        },
        'layout': {
            'icon-image': 'nopulsing-dot',
            'icon-allow-overlap': true // important fot display
        }
    },firstSymbolId);
    map.addLayer({
        'id': 'point-heat',
        'type': 'heatmap',
        'source': 'datapoints',
        'source-layer': 'Stromerzeuger_1_bis_36666-48glzr',
        'maxzoom': 9,
        'paint':{
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1,
                9,
                1.1
            ],
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(255,252,28,0)',
                0.2,
                'rgb(255,252,28)',
                0.4,
                'rgb(209,229,240)',
                0.6,
                'rgb(253,219,199)',
                0.8,
                'rgb(239,138,98)',
                1,
                'rgb(178,24,43)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                2,
                9,
                3.6
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7,
                .9,
                9,
                0
            ]
        }
    },firstSymbolId);
})
// Layer Control Functionalities
let layerHide=(layerId)=>{
    map.setLayoutProperty(layerId, 'visibility', 'none');
    $('#'+layerId+'-visibility').empty().append(
        `<a id="point-heat-hide" class="btn btn-sm btn-dark jet-color" onclick="layerShow('`+layerId+`')" role="button" data-bs-toggle="button"><i class="bi bi-eye-slash"></i></a>`
    )
}
let layerShow=(layerId)=>{
    map.setLayoutProperty(layerId, 'visibility', 'visible');
    $('#'+layerId+'-visibility').empty().append(
        `<a id="point-heat-show" class="btn btn-sm btn-dark jet-color" onclick="layerHide('`+layerId+`')" role="button" data-bs-toggle="button"><i class="bi bi-eye"></i></a>`
    )
}
// Popup functions
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['point'] });

    if (!features.length) {
        $("#popup").hide()
        map.setLayoutProperty('point', 'icon-image', 'nopulsing-dot')
        return;
    }

    let feature = features[0],
    fkeys=Object.keys(feature.properties),
    // 
    tagString=`<div class="card-header"><h5>Turbines Info</h5></div>
            <div class="card-body">
                <table class="table jet-color table-sm" style="width:100%;">` 
    console.log(feature)

    for (let index = 0; index < fkeys.length; index++) {
        const element = fkeys[index];
        tagString+=`<tr class="jet-color">
                        <th scope="row" class="jet-color">`+(index+1)+`</th>
                        <td class="jet-color">`+element+`</td>
                        <td class="jet-color">`+feature.properties[element]+`</td>
                      </tr>`
    }    
    tagString+=`</table>
            </div>`
    $("#popup").show().empty().append(tagString)
    // example: https://codepen.io/cladjidane/pen/GRErYqO
    map.setLayoutProperty('point', 'icon-image', ["match", ["id"], feature.id, 'pulsing-dot', 'nopulsing-dot'])
});
map.on('mouseenter', 'point', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
map.on('mouseleave', 'point', () => {
    map.getCanvas().style.cursor = ''
})