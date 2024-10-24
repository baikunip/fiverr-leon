// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = 'pk.eyJ1IjoiYmFpa3VuaXAxNCIsImEiOiJjbTJiOWZodzIwa2dvMmpxd3VoYTJkZ211In0.6cOD__WxNGnwrzmLhWJL6g';
let tilesetID='baikunip14.1kl46bay',tilesetName='NewData-wY-converted-8uagme'
let userClick=0,center=[11.038322348412294,53.40777239100876],zoom=6,bearing=0
if(localStorage.hasOwnProperty('zoom')){
    // let answer = confirm("Go to the previous location?");
    // if (answer) {
        center=localStorage.getItem('coordinates').split(',')
        zoom=parseFloat(localStorage.getItem('zoom'))
        bearing=parseFloat(localStorage.getItem('bearing'))
    // }
}
if($('#isMobile').is(':visible')){
    setTimeout(() => {
        showhidefilter("hidden")
    }, 5000);
}
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: center, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: zoom, // starting zoom
    bearing:bearing,
    // minZoom:7,
    // maxZoom:16,
    style: 'mapbox://styles/mapbox/satellite-streets-v12'
});
let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true
});
map.addControl(geolocate)
$('#geolocation').on('click',()=>{
    geolocate.trigger()
})
function forwardGeocoder(query){
    const matchingFeatures = [],collectedVal=[];
    searchQueries.forEach((feature) => {
        if(feature['MaStR-Nr. der Einheit'].toLowerCase().includes(query.toLowerCase())||feature['MaStR-Nr. der Einheit'].toLowerCase()==query.toLowerCase()){  
            feature['text'] = "MarktStammRegister-Nr. der Anlage";
            feature['center'] = feature['center'];
            feature['place_name'] = feature["MaStR-Nr. der Einheit"];
            feature['place_type']=['fromLayer']
            if(!collectedVal.includes(feature['place_name'])){
                matchingFeatures.push(feature);
                collectedVal.push(feature['place_name'])
            }
        }else if(feature['MaStR-Nr. der EEG-Anlage'].toLowerCase().includes(query.toLowerCase())||feature['MaStR-Nr. der EEG-Anlage'].toLowerCase()==query.toLowerCase()){
            feature['text'] = "MarktStammRegister-Nr. der EEG-Anlage";
            feature['center'] = feature['center'];
            feature['place_name'] = feature["MaStR-Nr. der EEG-Anlage"];
            feature['place_type']=['fromLayer']
            if(!collectedVal.includes(feature['place_name'])){
                matchingFeatures.push(feature);
                collectedVal.push(feature['place_name'])
            }
        }else if(feature['EEG-Anlagenschlüssel'].toLowerCase().includes(query.toLowerCase())||feature['EEG-Anlagenschlüssel'].toLowerCase()==query.toLowerCase()){
            feature['text'] = "EEG-Anlagenschlüssel";
            feature['center'] = feature['center'];
            feature['place_name'] = feature["EEG-Anlagenschlüssel"];
            feature['place_type']=['fromLayer']
            if(!collectedVal.includes(feature['place_name'])){
                matchingFeatures.push(feature);
                collectedVal.push(feature['place_name'])
            }
        }
    });
    return matchingFeatures;
}
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: forwardGeocoder,
        countries:'de',
        // types:"country",types:"region",types:"postcode",types:"district",types:"place",types:"locality",types:"neighborhood",types:"address",
        filter: function(item) {
            // Exclude results of the type "shop" or other Point of Interest types
            var excludedTypes = ['shop'];
            return !excludedTypes.some(function(exclude) {
                return item.properties.category && item.properties.category.includes(exclude);
            });
        },
        render:function(item){
             // extract the item's maki icon or use a default=
            // let acceptedTypes=[,'fromLayer']
            let backgrounColor='white'
            if(item['place_type'][0]=='fromLayer'){backgrounColor='#D8C99B'}
            // if(acceptedTypes.includes(item['place_type'][0])){
                return `<div class='geocoder-dropdown-item row' style='background-color:${backgrounColor}!important;'>
                <span class='geocoder-dropdown-text col-12'><b>${item.place_name}</b></span>
                    <span class='geocoder-dropdown-text col-12' style='margin-left:3px;'>
                    ${item.text}
                    </span>
                </div>`;
            // }
            
        },
        zoom: 14,
        placeholder: 'Ort oder ID suchen',
        mapboxgl: mapboxgl
    })
);
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

const nopulsingDot1 = {
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
        context.fillStyle = '#fffc1c';
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
const nopulsingDot2 = {
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
        context.fillStyle = '#ebc120';
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
const nopulsingDot3 = {
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
        context.fillStyle = '#ce6a26';
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
const nopulsingDot4 = {
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
        context.fillStyle = '#b2182b';
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
const nopulsingDotGrey = {
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
        context.fillStyle = '#93A3BC';
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
let matchPulsingDot=[
    'step',
    ['get', 'Bruttoleistung der Einheit'],
   'nopulsing-dotGrey',
    0,
    'nopulsing-dotGrey',
    0.01,
    'nopulsing-dot1',
    5,
    'nopulsing-dot2',
    10,
    'nopulsing-dot3',
    15, 
    'nopulsing-dot4'
]
// map loading all components
map.on('load', () => {
    
    // $('.mapboxgl-ctrl-geocoder--input').on('focus',()=>{
    // map.flyTo({
    //     center: [9.520702538433511,51.47691783935821],zoom:5,
    // })})
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
    map.addImage('nopulsing-dot1', nopulsingDot1, { pixelRatio: 2 });
    map.addImage('nopulsing-dot2', nopulsingDot2, { pixelRatio: 2 });
    map.addImage('nopulsing-dot3', nopulsingDot3, { pixelRatio: 2 });
    map.addImage('nopulsing-dot4', nopulsingDot4, { pixelRatio: 2 });
    map.addImage('nopulsing-dotGrey', nopulsingDotGrey, { pixelRatio: 2 });
    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style.
    let firstSymbolId,countryBoundaries;
    for (const layer of layers) {
        console.log(layer)
        if(layer.id=="admin-1-boundary-bg") countryBoundaries = layer.id
        if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
        }
    }
    map.addSource('datapoints', {
        type: 'vector',
        // Use any Mapbox-hosted tileset using its tileset id.
        // Learn more about where to find a tileset id:
        // https://docs.mapbox.com/help/glossary/tileset-id/
        url: 'mapbox://'+tilesetID
    });
    map.addLayer({
        'id': 'point',
        'source': 'datapoints',
        'source-layer': tilesetName,
        'type': 'symbol',
        'filter':['all',["in", ["get","Betriebs-Status"],["literal", ["In Betrieb","Vorübergehend stillgelegt"]]]],
        'paint': {
            // 'circle-radius': 4,
            // 'circle-color': 'blue',
            'icon-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7,
                0,
                9,
                1
            ],
            // 'circle-color': [
            //     'step',
            //     ['get', 'Bruttoleistung der Einheit'],
            //     '#51bbd6',
            //     100,
            //     '#f1f075',
            //     1000,
            //     '#f28cb1'
            // ],
        },
        'layout': {
            'icon-image': matchPulsingDot,
            'icon-allow-overlap': true // important fot display
        }
    },countryBoundaries);
    map.addLayer({
        'id': 'point-heat',
        'type': 'heatmap',
        'source': 'datapoints',
        'source-layer': tilesetName,
        'maxzoom': 9,
        'filter':['all',["in", ["get","Betriebs-Status"],["literal", ["In Betrieb","Vorübergehend stillgelegt"]]]],
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
    },countryBoundaries);
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
        $("#slide-up-popup").hide()
        map.setLayoutProperty('point', 'icon-image', matchPulsingDot)
        return;
    }
    userClick+=1
    let feature = features[0]
    function setPopupDate(property){
        // let dateString=feature.properties[property].split('.')
        let popupDate=new Date(feature.properties[property]*1000)
        // let popupDate=new Date(Number(dateString[2]).toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false})+'-'+
        // Number(dateString[1]).toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false})+'-'+
        // Number(dateString[0]).toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false}))
        // console.log(dateString)
        // console.log("date check: "+feature.properties[property])
        // console.log("time epoch: "+popupDate)
        if(feature.properties[property]==-2208988800) return "-"
        // if(feature.properties[property]=="") return "-"
        else return popupDate.getDate()+'.'+(popupDate.getMonth()+1)+'.'+popupDate.getFullYear()
    }
    function setPopupValue(property){
        if(!feature.properties[property]) return "-"
        else return feature.properties[property]
    }
    $("#Betriebs-Status-popup").html(setPopupValue("Betriebs-Status"))
    if(setPopupValue("Betriebs-Status")=="In Betrieb")$("#betriebs-status-icon").css("color","rgb(103, 213, 103)")
    else if(setPopupValue("Betriebs-Status")=="Endgültig stillgelegt")$("#betriebs-status-icon").css("color","red")
    else if(setPopupValue("Betriebs-Status")=="In Planung")$("#betriebs-status-icon").css("color","blue")
    else $("#betriebs-status-icon").css("color","transparent")
    $("#BruttoleistungderEinheit-popup").html((feature.properties["Bruttoleistung der Einheit"])+" MW")
    $('#vestas-text').html(setPopupValue('Hersteller-Zusammenfassung'))
    $("#HerstellerderWindenergieanlage-popup").html(setPopupValue("Hersteller der Windenergieanlage"))
    $("#Typenbezeichnung-popup").html(setPopupValue("Typenbezeichnung"))
    $("#RotordurchmesserderWindenergieanlage-popup").html(setPopupValue("Rotordurchmesser der Windenergieanlage")+" m")
    $("#NabenhöhederWindenergieanlage-popup").html(setPopupValue("Nabenhöhe der Windenergieanlage")+" m")
    if(setPopupValue("Betriebs-Status")=="In Planung")$("#InbetriebnahmedatumderEinheit-popup").html(setPopupDate("Datum der geplanten Inbetriebnahme"))
    else $("#InbetriebnahmedatumderEinheit-popup").html(setPopupDate("Inbetriebnahmedatum der Einheit"))
    $("#NamedesWindparks-popup").html(setPopupValue("Name des Windparks"))
    $("#LetzteAktualisierung-popup").html(setPopupDate("Letzte Aktualisierung"))
    $("#Betriebers-popup").html(setPopupValue("Name des Anlagenbetreibers (nur Org.)"))
    $("#Anlagenbetreibers-popup").html(setPopupValue("Anzeige-Name der Einheit"))
    $("#Anschluss-Netzbetreibers-popup").html(setPopupValue("Name des Anschluss-Netzbetreibers"))
    $("#Netzbetreiberprüfung-popup").html(setPopupValue("Netzbetreiberprüfung"))
    if(feature.properties["Netzbetreiberprüfung"]=="Geprüft")$("#gepruft-check").show()
    else $("#gepruft-check").hide()
    $("#RegistrierungsdatumderEinheit-popup").html(setPopupDate("Registrierungsdatum der Einheit"))
    $("#Spannungsebene-popup").html(setPopupValue("Spannungsebene"))
    $("#MaStR-NrderEEG-Anlage-popup").html(setPopupValue("MaStR-Nr. der Einheit"))
    $("#InstallierteLeistungderEEG-Anlage-popup").html((setPopupValue("Installierte Leistung der EEG-Anlage"))+" MW")
    $("#InbetriebnahmedatumderEEG-Anlage-popup").html(setPopupDate("Inbetriebnahmedatum der EEG-Anlage"))
    $("#MarktStammRegister-Nr-popup").html(setPopupValue("MaStR-Nr. der EEG-Anlage"))
    $("#Zuschlagnummer-popup").html(setPopupValue("Zuschlagnummer (EEG/KWK-Ausschreibung)"))
    $("#EEG-Anlagenschlüssel-popup").html(setPopupValue("EEG-Anlagenschlüssel"))
    $("#popup").show()
    map.setLayoutProperty('point', 
        'icon-image', 
        ["match", ["get","MaStR-Nr. der Einheit"], feature.properties["MaStR-Nr. der Einheit"], 'pulsing-dot', 
        matchPulsingDot
    ]
    )
});
map.on('mouseenter', 'point', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
map.on('mouseleave', 'point', () => {
    map.getCanvas().style.cursor = ''
})
map.on('moveend',()=>{
    localStorage.setItem('coordinates',[map.getCenter().lng,map.getCenter().lat])
    localStorage.setItem('zoom',map.getZoom())
    // localStorage.setItem('bearing',map.getBearing())
})
// filters
// Hide/Show FIlters
function showhidefilter(stats){
    if(stats=="hidden"){
        $("#filter-bar").hide()
        $("#show-filter-bar").show()
    }else{
        if($('#isMobile').is(':visible')) $("#filter-bar").css("width","99%").css("top","8vh").css("overflow","scroll").css("max-height","83vh")
        else $("#filter-bar").css("width","30em").css("overflow","scroll").css("max-height","70vh")
        $("#show-filter-bar").hide()
        $("#filter-bar").show()
    }
} 
$('#slide-down-popup').on('click',()=>{
    $('#popup').hide()
    $('#slide-up-popup').show()
}) 
$('#slide-up-popup').on('click',()=>{
    $('#popup').show()
    $('#slide-up-popup').hide()
})     

$('#betriebs-status-check').change(()=>{
    if($('#betriebs-status-check').is(":checked"))$('.betriebs-status-filter').show()
    else $('.betriebs-status-filter').hide()     
})
$('#bde-check').change(()=>{
    if($('#bde-check').is(":checked"))$('.bde-filter').show()
    else $('.bde-filter').hide()     
})
$('#hdw-check').change(()=>{
    if($('#hdw-check').is(":checked"))$('.hdw-filter').show()
    else $('.hdw-filter').hide()     
})
$('#ide-check').change(()=>{
    if($('#ide-check').is(":checked"))$('.ide-filter').show()
    else $('.ide-filter').hide()     
})
$('#bundesland-check').change(()=>{
    if($('#bundesland-check').is(":checked"))$('.bundesland-filter').show()
    else $('.bundesland-filter').hide()     
})
let bdeVal=[0,20000],stats=["In Betrieb","Vorübergehend stillgelegt"],
bundesland=["Hessen","Schleswig-Holstein","Nordrhein-Westfalen","Rheinland-Pfalz",
    "Bayern","Baden-Württemberg","Mecklenburg-Vorpommern","Niedersachsen","Sachsen-Anhalt",
    "Saarland","Sachsen","Brandenburg","Ausschließliche Wirtschaftszone","Thüringen",
    "Hamburg"
],
hersteller=['ENERCON GmbH', 'Nordex', 'Inaktive Hersteller', 'Vestas', 'Senvion', 'GE', 'Kleinwindanlagen-Hersteller', 'Nicht genannt', 'VENSYS Energy AG', 'Siemens', 'eno energy GmbH', 'FWT energy GmbH', 'AREVA GmbH', 'Amperax Energie GmbH', 'BARD Holding GmbH'],
anschluss=['Städtische Werke Netz+Service GmbH (SNB935482852901)', 'Schleswig-Holstein Netz AG (SNB919861978666)', 'Alliander Netz Heinsberg GmbH (SNB931070025696)', 'e-netz Südhessen AG (SNB956958990736)', 'Westnetz GmbH (SNB921897286493)', 'N-ERGIE Netz GmbH (SNB973875583315)', 'Energie Waldeck-Frankenberg GmbH (SNB936172924014)', 'Avacon Netz GmbH (SNB990362338043)', 'naturenergie netze GmbH (SNB945502201350)', 'E.DIS Netz GmbH (SNB941690671609)', 'EAM Netz GmbH (SNB971311555230)', 'Überlandwerk Mittelbaden GmbH & Co. KG (SNB913992545742)', 'LokalWerke GmbH (SNB977443469322)', 'Energienetze Mittelrhein GmbH & Co. KG (SNB980055629275)', 'LSW Netz GmbH & Co. KG (SNB957862279702)', 'nan', 'EWE NETZ GmbH (SNB951051725711)', 'Stadtwerke Emden GmbH (SNB941183960449)', 'Bayernwerk Netz GmbH (SNB940352624434)', 'wesernetz Bremen GmbH (SNB942238573102)', 'Regionetz GmbH (SNB911641710114)', 'Westfalen Weser Netz GmbH (SNB929881052512)', 'Netze BW GmbH (SNB948311994307)', 'Stadtnetze Münster GmbH (SNB980883363112)', 'GELSENWASSER Energienetze GmbH (SNB961497906636)', 'Creos Deutschland GmbH (SNB940133714842)', 'Syna GmbH (SNB918250928893)', 'EWR Netz GmbH (SNB969068596941)', 'Mitteldeutsche Netzgesellschaft Strom mbH (SNB916269213931)', 'SWW Wunsiedel GmbH (SNB967812386411)', 'EUROGATE Technical Services GmbH (SNB929575518928)', 'TenneT TSO GmbH (SNB970033313272)', 'Stadtwerke Emmerich GmbH (SNB986190606218)', 'Mainfranken Netze GmbH (SNB915316807789)', 'AllgäuNetz GmbH & Co. KG (SNB926394308747)', 'Stadtwerke Wertheim GmbH (SNB922051401837)', 'WEMAG Netz GmbH (SNB928759560869)', 'Osterholzer Stadtwerke GmbH & Co. KG (SNB959255155907)', 'SEW Stromversorgungs GmbH (SNB950960779068); Überlandwerk Erding GmbH & Co. KG (SNB957632855181)', 'TEN Thüringer Energienetze GmbH & Co. KG (SNB970821959712)', '50Hertz Transmission GmbH (SNB982046657236)', 'BIGGE ENERGIE GmbH & Co. KG (SNB990174285078)', 'EVI Energieversorgung Hildesheim GmbH & Co. KG (SNB980449174619)', 'Stadtwerke Nordfriesland - Netz GmbH (SNB951791941969)', 'Pfalzwerke Netz AG (SNB961471621746)', 'Stromversorgung Pfaffenhofen a. d. Ilm GmbH & Co. KG (SNB916151866986)', 'ASCANETZ GmbH (SNB918620072652)', 'Stadtwerke Winsen (Luhe) GmbH (SNB972723368326)', 'Stadtwerke Rhede GmbH (SNB979326623005)', 'AVU Netz GmbH (SNB967794191157)', 'Stadtwerke Karlsruhe Netzservice GmbH (SNB971087047229)', 'Stadtwerke Neumarkt i. d. OPf. Energie GmbH (SNB989365725226)', 'Stadtwerke Sondershausen Netz GmbH (SNB987483520273)', 'Kreiswerke Main-Kinzig GmbH (SNB937858140285)', 'NEW Netz GmbH (SNB940437318166)', 'ovag Netz GmbH (SNB969534177940)', 'Stadtwerke Haltern am See GmbH (SNB921816651920)', 'Netze ODR GmbH (SNB935556509052)', 'Stadtwerke Schwäbisch Hall GmbH (SNB982660786343)', 'Stadtwerke Hameln Weserbergland GmbH (SNB981984960101)', 'SWTE Netz GmbH & Co. KG (SNB950006175489)', 'GEW Wilhelmshaven GmbH (SNB920157746937)', 'OsthessenNetz GmbH (SNB934071779865)', 'Stadtwerke Neustadt in Holstein (SNB933386930565)', 'WEV Warendorfer Energieversorgung GmbH (SNB969345305204)', 'NGN Netzgesellschaft Niederrhein mbH (SNB911144461377)', 'Mainzer Netze GmbH (SNB959523885956)', 'enwor - energie & wasser vor ort GmbH (SNB977716315769)', 'Stadtwerke Bernburg GmbH (SNB953669866350)', 'Stadtwerke Detmold GmbH (SNB924774487556)', 'Stadtwerke Hof Energie+Wasser GmbH (SNB977206503256)', 'Stadtwerke Malchow (SNB948470226516)', 'Städtische Betriebswerke Luckenwalde GmbH (SNB943531720705)', 'wesernetz Bremerhaven GmbH (SNB985704986426)', 'Stadtwerke Jena Netze GmbH (SNB945861817537)', 'energis-Netzgesellschaft mbH (SNB976379598847)', 'VSE Verteilnetz GmbH (SNB941650885558)', 'SachsenNetze HS.HD GmbH (SNB968914838013)', 'Stadtwerke Ochtrup (SNB934961797092)', 'EGT Energie GmbH (SNB979557818782)', 'Stadtwerke Gronau GmbH (SNB934949020686)', 'Bocholter Energie- und Wasserversorgung GmbH (SNB918576265276)', 'Stadtwerke Lehrte GmbH (SNB950039201827)', 'LEW Verteilnetz GmbH (SNB911705062982)', 'TraveNetz GmbH (SNB983425156814)', 'ÜZ Mainfranken eG (SNB929185184919)', 'Stadtwerke Unna GmbH (SNB944150243392)', 'Stadtwerke Landshut (SNB928992067729)', 'ELE Verteilnetz GmbH (SNB973074326355)', 'Stadtwerke Einbeck GmbH (SNB965692805121)', 'Celle-Uelzen Netz GmbH (SNB955238223991)', 'Stadtwerke Verden GmbH (SNB962996832648)', 'Harz Energie Netz GmbH (SNB984607096621)', 'ENERVIE Vernetzt GmbH (SNB921319639913)', 'Stadtwerke Brunsbüttel GmbH (SNB951835062254)', 'Stadtwerke Rostock Netzgesellschaft mbH (SNB939724292715)', 'Energie- und Wasserversorgung Hamm GmbH (SNB912743424114)', 'Stadtwerke Geesthacht GmbH (SNB960882503184)', 'SWO Netz GmbH (SNB943662886851)', 'Stadtwerke Schwedt GmbH (SNB913280322543)', 'Stadt- und Überlandwerke GmbH Luckau-Lübbenau (SNB922689183730)', 'Stadtwerke Lutherstadt Wittenberg GmbH (SNB932107297727)', 'GSW Gemeinschaftsstadtwerke GmbH Kamen, Bönen, Bergkamen (SNB935600499711)', 'Stadtwerke Schwabach GmbH (SNB962110557570)', 'Stadtwerke Lünen GmbH (SNB942111583372)', 'Stadtwerke Aalen GmbH (SNB982726407335)', 'Stadtwerke Iserlohn GmbH (SNB913730249284)', 'Stadtwerke Prenzlau GmbH (SNB941283828373)', 'Stadtwerke Geldern Netz GmbH (SNB965107360993)', 'Hamburger Energienetze GmbH (SNB968295079586)', 'Elektrizitäts-Werk Ottersberg (SNB916008519201)', 'Stadtwerke Radevormwald GmbH (SNB964262506406)', 'Bielefelder Netz GmbH (SNB918516395612)', 'Stadtwerke Coesfeld GmbH (SNB943480673763)', 'Elektrizitätswerk des Kantons Schaffhausen AG (SNB985099151188)', 'LeineNetz GmbH (SNB952845016893)', 'Stadtwerke Heide GmbH (SNB953938790515)', 'Stadtwerke Velbert GmbH (SNB974492211483)', 'SWK Stadtwerke Kaiserslautern Versorgungs-AG (SNB982394830312)', 'Energie- und Wasserwerke Bautzen GmbH Energijowe a Wodowezawody Budysin (SNB943962034624)', 'Stadtwerke Ostmünsterland GmbH & Co. KG (SNB932375556731)', 'Stadtwerke Ansbach GmbH (SNB937406641264)', 'Amprion GmbH (SNB976890256486)', 'Stadtwerke EVB Huntetal GmbH (SNB922030852827)', 'Stadtwerke Achim AG (SNB942257679137)', 'Albwerk GmbH & Co. KG (SNB926699071292)', 'TraveNetz GmbH (SNB983425156814); Schleswig-Holstein Netz AG (SNB919861978666)', 'Stadtwerke Georgsmarienhütte Netz GmbH (SNB977481237679)', 'Freiberger Stromversorgung GmbH (SNB990971435621)', 'Energieversorgung Titisee-Neustadt GmbH (SNB948468070435)', 'Netzwerke Merzig GmbH (SNB929088252340)', 'Stadtwerke Steinfurt GmbH (SNB900123507953)', 'Werraenergie GmbH (SNB973501936539)', 'Regionalwerke Wolfhager Land GmbH (SNB917014884420)', 'Stromnetz Berlin GmbH (SNB979269087643)', 'Stadtwerke Zittau GmbH (SNB959966681252)', 'Stadtwerke Kleve GmbH (SNB935814055062)', 'Stadtwerke Lemgo GmbH (SNB967075358620)', 'Stadtwerke Vlotho Stromnetz GmbH (SNB991263248615)', 'Stromnetz Weilheim GmbH & Co. KG (SNB929262647085)', 'Stadtwerke Schüttorf - Emsbüren GmbH (SNB944294076061)', 'Teutoburger Energie Netzwerk eG (TEN eG) (SNB910696207785)', 'Stadtwerke Werdau GmbH (SNB962389410347)', 'Dessauer Stromversorgung GmbH (SNB954281375657)', 'Stadtwerke Löbau GmbH (SNB926470799582)', 'Energieversorgung Limburg GmbH (SNB965281540327)', 'Stadtwerke Staßfurt GmbH (SNB910474681448)', 'nvb Nordhorner Versorgungsbetriebe GmbH (SNB945532057606)', 'Stadtwerke Service Meerbusch Willich GmbH & Co. KG (SNB971503120734)', 'Stadtwerke Delitzsch GmbH (SNB937001443546)', 'Elektrizitätswerke Schönau Netze GmbH (SNB974894111862)', 'Stadtwerke Villingen-Schwenningen GmbH (SNB916927144072)', 'Rheinische NETZGesellschaft mbH (SNB924477581384)', 'WSW Netz GmbH (SNB914306944756)', 'Stadtwerke Werl GmbH (SNB979980141082)', 'Stadtwerke GmbH Bad Kreuznach (SNB985431470335)', 'Leitungspartner GmbH (SNB920357766414)', 'Blomberg Netz GmbH & Co. KG (SNB910395619643)', 'Stadtwerke Soest GmbH (SNB965118678667)', 'Überlandwerk Leinetal GmbH (SNB910956210043)', 'Netzgesellschaft Eisenberg mbH (SNB917432806905)', 'Stadtwerke Meerane GmbH (SNB918070278383)', 'ENRW Energieversorgung Rottweil GmbH & Co. KG (SNB951180867351)', 'Stadtwerke Wolfenbüttel GmbH (SNB983546347757)', 'badenovaNETZE GmbH (SNB965774651691)', 'Elektroenergieversorgung Cottbus GmbH (SNB931431136771)', 'Stadtwerke Döbeln GmbH (SNB976679550309)', 'Netz Leipzig GmbH (SNB948859455841)', 'Netzgesellschaft Frankfurt (Oder) mbH (SNB954814647626)', 'Stadtwerke Schweinfurt GmbH (SNB922811950100)', 'SWM Infrastruktur GmbH & Co. KG (SNB969473762610)', 'Wirtschaftsbetriebe der Stadt Norden GmbH (SNB919649671758)', 'Überlandzentrale Wörth/I.-Altheim Netz AG (SNB917454122557)', 'Stadtwerke Merseburg GmbH (SNB913006238462)', 'Maintal-Werke-GmbH-Stadtwerke der Stadt Maintal (SNB943571241628)', 'Strom- und Gasnetz Wismar GmbH (SNB964045995373)', 'Stadtwerke Peine GmbH (SNB954026274702)', 'Stadtwerke Fröndenberg Wickede GmbH (SNB912063565672)', 'Stadtwerke Lingen GmbH (SNB982030394239)', 'Netze Magdeburg GmbH (SNB933459598975)', 'Stadtwerke Lübz GmbH (SNB915358347793)', 'Stadtwerke Crailsheim GmbH (SNB934532229953)', 'Stadtwerke Bayreuth Energie und Wasser GmbH (SNB967782555602)', 'SÜC Energie und H²O GmbH (SNB968862623211)', 'Mittelhessen Netz GmbH (SNB906862380628)', 'Energie- und Wasserversorgung Rheine GmbH (SNB932516649124)', 'GGEW, Gruppen-Gas- und Elektrizitätswerk Bergstraße AG (SNB968670865650)', 'Überlandwerk Rhön GmbH (SNB936940951426)', 'Stadtwerke Borken/Westf. GmbH (SNB982432856366)', 'Rheinhessische Energie- und Wasserversorgungs-GmbH (SNB912239808732)', 'Stadtwerke Lippe-Weser Service GmbH & Co. KG (SNB916255659316)', 'Stadtwerke Springe GmbH (SNB954187049256)', 'Stadtwerke Grünstadt GmbH (SNB958070514050)', 'Energieversorgung Südbaar GmbH & Co. KG (SNB921611512679)', 'Stadtwerke Pirmasens Versorgungs GmbH (SNB955001358523)', 'Stadtwerke Glauchau Dienstleistungsgesellschaft mbH (SNB963070917732)', 'Stadtwerke Rotenburg (Wümme) GmbH (SNB976170444053)', 'Technische Werke Naumburg GmbH (SNB978071940108)', 'Stadtwerke Uelzen GmbH (SNB965557517831)', 'Stadtwerke Lippstadt GmbH (SNB985098042388)', 'BEW Netze GmbH (SNB944057190867)', 'Stadtwerke Homburg GmbH (SNB954537392643)', 'Dortmunder Netz GmbH (SNB981060961299)', 'Stadtwerke Emsdetten GmbH (SNB958416423039)', 'EWR GmbH (Remscheid) (SNB924747450655)', 'Überlandwerk Erding GmbH & Co. KG (SNB957632855181)', 'Stadtwerke Dachau Eigenbetr. d. Stadt Dachau (SNB945149216045)', 'Hertener Stadtwerke GmbH (SNB964592501355)', 'Stadtwerke Zweibrücken GmbH (SNB923190544898)', 'Stadtwerk Tauberfranken GmbH (SNB936176430474)', 'T.W.O. Technische Werke Osning GmbH (SNB974739102161)', 'Energieversorgung Beckum GmbH & Co. KG (SNB942173666990)', 'Regensburg Netz GmbH (SNB941929592729)', 'GETEC net GmbH (SNB901665585874)', 'Netzgesellschaft Ahlen mbH (SNB933767388565)', 'GeraNetz GmbH (SNB948816192529)', 'Blomberger Versorgungsbetriebe GmbH (SNB954056001255)', 'NHL Netzgesellschaft Heilbronner Land GmbH & Co. KG (SNB978108787379)', 'SWE Netz GmbH (Erfurt) (SNB950262883869)', 'Stadtwerke Nettetal GmbH (SNB985347645049)', 'Stadtwerke Husum Netz GmbH (SNB950336540445)', 'Westnetz GmbH (SNB921897286493); SWTE Netz GmbH & Co. KG (SNB950006175489)', 'Braunschweiger Netz GmbH (SNB926644622999)', 'SWS Netze GmbH (SNB915638224585)', 'Stadtwerk Haßfurt GmbH (SNB964046129302)', 'Remstalwerk Netzgesellschaft GmbH (SNB979950878543)', 'Stadtwerke Bernau GmbH (SNB962890977544)', 'Halberstadtwerke GmbH (SNB977374861035)', 'Stadtwerke Hemau (SNB939428749966)', 'Netzgesellschaft Lübbecke mbH (SNB934185023519)', 'Herzo Werke GmbH (SNB930312838582)', 'Stadtwerke Rosenheim Netze GmbH (SNB988838479086)', 'enercity Netz GmbH (SNB971746988153)', 'Stadtwerke Freudenstadt GmbH & Co. KG (SNB973733148182)', 'Stadtwerke Soltau GmbH & Co. KG (SNB947030954821)', 'Avacon Netz GmbH (SNB990362338043); GELSENWASSER Energienetze GmbH (SNB961497906636)', 'REDINET Burgenland GmbH (SNB963995572245)', 'Stadtwerke Harsewinkel GmbH (SNB972046955654)', 'STADTWERKE GREVEN GMBH (SNB998044089535)', 'Stadtwerke Hemer GmbH (SNB931639626302)', 'Vereinigte Stadtwerke Netz GmbH (SNB931064958931)', 'inetz GmbH (SNB916663914472)', 'Netzgesellschaft Gütersloh mbH (SNB931546188436)', 'STADTWERKE KELHEIM GmbH & Co KG (SNB965500640463)', 'Regionalnetze Linzgau GmbH (SNB942274543879)', 'Stadtwerke Nürtingen GmbH (SNB948186469375)', 'Stadtwerke Rinteln GmbH (SNB924409922308)', 'Netzgesellschaft Panketal GmbH (SNB987317008403)', 'Avacon Netz GmbH (SNB990362338043); Westfalen Weser Netz GmbH (SNB929881052512)', 'Energieversorgung Dahlenburg-Bleckede AG (SNB932388577952)', 'Stadtwerke Pritzwalk GmbH (SNB922354559020)', 'Stadtwerke Schwarzenberg GmbH (SNB985072256732)', '50Hertz Transmission GmbH (SNB982046657236); Stadtwerke Brunsbüttel GmbH (SNB951835062254)', 'Stadtwerke Dülmen GmbH (SNB926697076725)', 'Stadtwerke Schneverdingen-Neuenkirchen GmbH (SNB950028563172)', 'SWKiel Netz GmbH (SNB973742186519)', 'Versorgungsbetriebe Hoyerswerda GmbH (SNB946612539746)', 'SWP Stadtwerke Pforzheim GmbH & Co. KG (SNB929168402344)', 'Stadtwerke Buchholz in der Nordheide GmbH (SNB968489334224)', 'Gemeindewerke Nümbrecht GmbH (SNB987153361809)', 'energie- und wassergesellschaft mbh (SNB921626387354)', 'SWL Verteilungsnetzgesellschaft mbH (SNB967148688999)', 'SWL Übertragungsnetzgesellschaft mbH (SNB930325069232)', 'Energieversorgung Selb-Marktredwitz GmbH (SNB911696239035)', 'Stadtwerke Kempen GmbH (SNB943042904373)', 'Energieversorgung Halle Netz GmbH (SNB982934611074)', 'Stadtwerke Parchim GmbH (SNB999125588145)', 'Saerbecker Ver- und Entsorgungsnetzgesellschaft mbH (SNB956986612075)', 'Stadtwerke Neunburg vorm Wald Strom GmbH (SNB955718588763)', 'Elektrizitätswerk Goldbach-Hösbach GmbH & Co. KG (SNB965998184692)', 'Stadtwerke Versmold GmbH (SNB930709120863)', 'Stadtwerke Haldensleben GmbH (SNB959120377328)', 'Stadtwerke Buchen GmbH & Co KG (SNB922393870476)', 'ewag kamenz Energie und Wasserversorgung Aktiengesellschaft Kamenz (SNB934984130722)', 'Fischereihafen-Betriebsgesellschaft mbH (SNB914149166902)', 'Stadtwerke Frankenthal GmbH (SNB961745390019)', 'Stadtwerke Güstrow GmbH (SNB983029590205)', 'Freitaler Stadtwerke GmbH (SNB982241851170)', 'Stadtwerke Warburg GmbH (SNB911692402044)', 'Stadtwerke Flensburg GmbH (SNB922220582657)', 'Stadtwerke Buxtehude GmbH (SNB974547197724)', 'Stadtwerke Walldürn GmbH (SNB969708579983)', 'Stadtwerke Ludwigsburg - Kornwestheim GmbH (SNB978730380269)', 'Stadtwerke Zeven GmbH (SNB980783618473)', 'SSW Netz GmbH (SNB989025785690)', 'Überlandwerk Eppler GmbH (SNB972264483465)', 'Stadtwerke Schramberg GmbH & Co. KG (SNB944999584793)', 'Stadtwerke Burg Energienetze GmbH (SNB927160517950)', 'Schleswiger Stadtwerke GmbH (SNB953868012787)', 'KWH Netz GmbH (SNB922161652860)', 'Stadtwerke Neuruppin GmbH (SNB920348005966)', 'Stadtwerke Bad Harzburg GmbH (SNB924330086940)', 'SWV Regional GmbH (SNB931164620455)', 'Gemeindewerke Grefrath GmbH (SNB993724515038)', 'Stadtwerke Fürstenfeldbruck GmbH (SNB985701689504)', 'Licht-, Kraft- und Wasserwerke Kitzingen GmbH (SNB943319305469)', 'Netzgesellschaft Schwerin mbH (NGS) (SNB913130054136)', 'NordNetz GmbH (SNB920393062051)', 'Stadtwerke Bad Sachsa Gesellschaft mit beschränkter Haftung (SNB967958627669)', 'Vereinigte Wertach Elektrizitätswerke GmbH (SNB966808200267)', 'Stadtwerke Radolfzell GmbH (SNB974041045040)', 'Energieversorgung Lohr-Karlstadt und Umgebung GmbH & Co. KG (SNB991797615686)', 'Stadtwerke Menden GmbH (SNB922774216633)', 'Stadtwerke Ilmenau GmbH (SNB964659661008)', 'Stadtwerke Forchheim GmbH (SNB996457394093)', 'Zwickauer Energieversorgung GmbH (SNB925823629552)', 'KBG Kraftstrom- Bezugsgenossenschaft Homberg eG (SNB913273314623)', 'SWL Energienetz- und Entsorgungsgesellschaft mbH (SNB914027640531)', 'EVU Langenpreising (SNB930329896650)', 'EVB Netze GmbH (SNB989700422711)', 'SEW Stromversorgungs GmbH (SNB950960779068)', 'Nordseeheilbad Borkum GmbH (SNB931610892481)', 'Stadtwerke Schorndorf GmbH (SNB935144085258)', 'Neubrandenburger Stadtwerke GmbH (SNB939624707241)', 'VW KRAFTWERK Gesellschaft mit beschränkter Haftung (SNB978865527096)', 'Stadtwerke Schwerte GmbH (SNB932788203468)', 'Stadtwerke Annaberg-Buchholz Energie AG (SNB936769439815)', 'Stadtwerke Sangerhausen GmbH (SNB922861338965)', 'Stadtwerke Ratingen GmbH (SNB953661539375)', 'Verteilnetze Energie Weißenhorn GmbH & Co. KG (SNB940122004213)', 'Stadtwerke Bad Kissingen GmbH (SNB911031559460)', 'Stuttgart Netze GmbH (SNB947592865054)', 'MVV Netze GmbH (SNB985472799266)', 'Elektrizitäts-Versorgungs-Genossenschaft Perlesreut eG (SNB930558787330)', 'Elektrizitäts-Genossenschaft Tacherting-Feichten eG (SNB935303204162)', 'Energieversorgung Inselsberg GmbH (SNB974763887737)', 'Stadtwerke Neustrelitz GmbH (SNB914630088973)', 'Gemeinde Glattbach (SNB968325295962)', 'Stadtwerke Velten GmbH (SNB957440824454)', 'Netzgesellschaft Düsseldorf mbH (SNB933956506145)', 'Stadtwerke Kaltenkirchen GmbH (SNB933013692798)', 'infra fürth gmbh (SNB911960309587)', 'ENRO Ludwigsfelde Netz GmbH (SNB964092397892)', 'Oberhausener Netzgesellschaft mbH (SNB992672107807)', 'Stadtwerke Speyer GmbH (SNB918097788087)', 'STADTWERKE WEISSENBURG GmbH (SNB965819408044)', 'Stadtwerke Pasewalk GmbH (SNB961833910969)', 'Stadtwerke Baden-Baden (SNB931622346583)', 'Elektrizitätsgenossenschaft Vogling & Angrenzer eG (SNB930134015819)', 'Niedersachsen Ports GmbH & Co. KG (SNB917783023525)', 'Elektrizitätsgenossenschaft Nordhalben und Umgebung e. G. (SNB985498109605)', 'Energieversorgung Rottenburg am Neckar GmbH (SNB935932937127)', 'Erlanger Stadtwerke AG (SNB967982606159)', 'Stadtwerke Wiesbaden Netz GmbH (SNB950584553167)', 'Stadtwerke Mühlacker GmbH (SNB953132482766)', 'Energienetze Offenbach GmbH (SNB915100694458)', 'e.wa riss Netze GmbH (SNB925685357501)', 'Elektrizitätswerk Wörth a. d. Donau Rupert Heider GmbH & Co. KG (SNB988980270319)', 'Stadtwerke Altdorf GmbH (SNB947092763157)', 'Bonn-Netz GmbH (SNB927498960503)', 'Stadtwerke Bamberg Energie- und Wasserversorgungs GmbH (SNB949646353012)'],
energyProducer=['nan', 'Frisia Windkraftanlagen Service GmbH', 'Weinack Windenergie Anlagen GmbH', 'Gamesa Corporación Tecnológica S.A.', 'General Electric Deutschland Holding GmbH', 'Sonkyo Energy', 'TOZZI NORD\xa0S.R.L.', 'BARD Holding GmbH', 'eno energy systems GmbH', 'Octopus Systems GmbH', 'Wind Technik Nord GmbH', 'Norddeutsche H-Rotoren GmbH & Co. KG', 'Wittenbauer Technik & Consulting GmbH', 'Pfleiderer Deutschland GmbH', 'Krogmann GmbH & Co. KG', 'LWS systems GmbH & Co. KG.', 'Heyde Windtechnik GmbH', 'Siemens Wind Power GmbH & Co. KG', 'ABB Power-One Italy SpA', 'HSW Husumer Schiffswerft GmbH & Co. KG', 'InVentus Energie GmbH', 'GE Wind Energy GmbH', 'SB Energy UK Ltd.', 'ESPV-TEC GmbH & Co. KG', 'MyWind', 'Gödecke Energie- und Antriebstechnik GmbH', 'WTT GmbH', 'DeWind GmbH', 'Alpha projekt GmbH', 'PowerWind GmbH', 'Svit Vitru', 'VWA-Deutschland GmbH Freude am Strom', 'WSD - Windsysteme', 'Werner Eberle GmbH', 'Anhui Hummer Dynamo Co.,Ltd.', 'Uni Wind GmbH', 'Wind World A/S', 'Südwind Borsig Energy GmbH', 'AN Windenergie GmbH', 'MAX-wyn GmbH', 'REpower Systems SE', 'Nordex SE', 'Kessler Energy GmbH', 'Schuler Aktiengesellschaft', 'SkyWind GmbH', 'windradshop', 'Siemens Gamesa Renewable Energy GmbH & Co. KG', 'eno energy GmbH', 'Jacobs Energie GmbH', 'SeeBA Energiesysteme GmbH', 'EVIAG AG', 'VENSYS Energy AG', 'Vestas Deutschland GmbH', 'Hyden', 'VENTIS WIND SERVICE S.L', 'MHI Vestas Offshore Wind', 'Aeolos Windkraftanlagen', 'FWT energy GmbH', 'Eovent GmbH', 'Adwen GmbH', 'Zentrum für Sonnenenergie- und Wasserstoff-Forschung Baden-Württemberg (ZSW)', 'Nova-Wind GmbH', 'SEEWIND Windenergiesysteme GmbH', 'Lely Aircon B.V. Niederlassung Leer', 'Mischtechnik Hoffmann & Partner GmbH', 'PreVent GmbH', 'JAMP GmbH', 'Pfleiderer Wind Energy GmbH', 'GE Renewable Germany GmbH', 'Lagerwey GmbH', 'ALPHACON GmbH', 'Bonus Energy A/S', 'NEG Micon Deutschland GmbH', 'Fuhrländer AG', 'Nordtank Energy Group', 'Wind+Wing Technologies', 'Nordex Germany GmbH', 'myLEDsun', 'WES IBS GmbH', 'WindTec GmbH', 'Home Energy International', 'Tacke GmbH & Co. KG', 'VENTEGO AG', 'QREON GmbH', 'ROPATEC SRL', 'bwu Brandenburgische Wind- und Umwelttechnologien GmbH', 'Nordex Energy GmbH', 'E.A.Z. Wind GmbH', 'BRAUN Windturbinen GmbH', 'Kleinwind GmbH', 'Fortis Wind Energy', 'Amperax Energie GmbH', 'Schütz GmbH & Co. KGaA', 'PSW-Energiesysteme GmbH', 'Hanseatische AG', 'Easywind GmbH', 'K.D.-Stahl- und Maschinenbau GmbH', 'Ventis Energietechnik GmbH', 'Wincon West Wind A/S', 'Senvion Deutschland GmbH', 'Husumer Dock und Reparatur GmbH & Co. KG', 'STM Montage GmbH', 'EUSAG AG', 'S & W ENERGIESYSTEME UG (haftungsbeschränkt)', 'ENERCON GmbH', 'Kähler Maschinenbau GmbH', 'FuSystems SkyWind GmbH', 'Sonstige', 'AN Windanlagen GmbH', 'SMA Solar Technology AG', 'LuvSide GmbH', 'SOLAR-WIND-TEAM GmbH', 'Kenersys Europe GmbH', 'AN-Maschinenbau- und Umweltschutzanlagen GmbH', 'Honeywell Windtronics', 'Enron Wind GmbH', 'AREVA GmbH']
,nachList={"Hersteller der Windenergieanlage":energyProducer,"Bundesland":bundesland,"Name des Anschluss-Netzbetreibers":anschluss,"Hersteller-Zusammenfassung":hersteller},
attSliders={"Bruttoleistung der Einheit":[0, 15],"Rotordurchmesser der Windenergieanlage":[0,250],"Nabenhöhe der Windenergieanlage":[0,230],"Inbetriebnahmejahr":[1983,2024]},
dateComissioned=[-2208988800,Date.now()]
bundesland.forEach(element => {$("#bundeslandOptions").append('<option value="'+element+'">')});
$( "#slider-filter" ).slider({
    range: true,
    min: 0,
    max: 15,
    values: [ 0, 15 ],
    slide: function( event, ui ) {
    //   if(ui.values[0]!=0)$( "#slider-filter-min" ).html((ui.values[0])+' MW')
    //   else $( "#slider-filter-min" ).html('0 MW')
    //   $( "#slider-filter-max" ).html((ui.values[1])+' MW')
    //   bdeVal=ui.values
    //   applyFilter()
        if($('#slider-attr-select').val()=="Bruttoleistung der Einheit"){
                    // if(ui.values[0]!=0)$( "#slider-filter-min" ).html((ui.values[0])+' MW')
                    // else $( "#slider-filter-min" ).html('0 MW')
            $( "#slider-filter-min" ).html((ui.values[0])+' MW')
            $( "#slider-filter-max" ).html((ui.values[1])+' MW')
        }else if($('#slider-attr-select').val()=="Inbetriebnahmejahr"){
            $( "#slider-filter-min" ).html((ui.values[0]))
            $( "#slider-filter-max" ).html((ui.values[1]))
        }else{
            $( "#slider-filter-min" ).html((ui.values[0])+' m')
            $( "#slider-filter-max" ).html((ui.values[1])+' m')
        }
        bdeVal=ui.values
        applyFilter()
    }
});
function disableDate(){
    $('#reverse-date-filter').click()
    $('.date-input').prop("disabled",true)
    $('#reverse-date-filter').prop("disabled",true)
}
function enableDate(){
    $('.date-input').prop("disabled",false)
    $('#reverse-date-filter').prop("disabled",false)
}
$('#slider-attr-select').on('change',()=>{
    // $('#slider-filter-container').empty().append(
    //     `<div id="slider-filter"></div>`
    // )
    let rangeVal=attSliders[$('#slider-attr-select').val()]
    bdeVal=rangeVal
    if($('#slider-attr-select').val()=="Bruttoleistung der Einheit")measurementUnit=' MW'
    if($('#slider-attr-select').val()=="Bruttoleistung der Einheit"){
        $( "#slider-filter-min" ).html('0 MW')
        $( "#slider-filter-max" ).html((rangeVal[1])+' MW')
        enableDate()
    }else if($('#slider-attr-select').val()=="Inbetriebnahmejahr"){
        $( "#slider-filter-min" ).html((rangeVal[0]))
        if(stats.includes('In Planung')){rangeVal[1]=2029}
        else rangeVal[1]=2024
        $( "#slider-filter-max" ).html((rangeVal[1]))
        disableDate()
    }else{
        $( "#slider-filter-min" ).html((rangeVal[0])+' m')
        $( "#slider-filter-max" ).html((rangeVal[1])+' m')
        enableDate()
    }
    $( "#slider-filter" ).slider("option","min",rangeVal[0])
    $( "#slider-filter" ).slider("option","max",rangeVal[1])
    $( "#slider-filter" ).slider("option","values",rangeVal)
    applyFilter()
    // $( "#slider-filter" ).slider({
    //     range: true,
    //     min: rangeVal[0],
    //     max: rangeVal[1],
    //     values: rangeVal,
    //     slide: function( event, ui ) {
    //         if($('#slider-attr-select').val()=="Bruttoleistung der Einheit"){
    //             // if(ui.values[0]!=0)$( "#slider-filter-min" ).html((ui.values[0])+' MW')
    //             // else $( "#slider-filter-min" ).html('0 MW')
    //             $( "#slider-filter-min" ).html((ui.values[0])+' MW')
    //             $( "#slider-filter-max" ).html((ui.values[1])+' MW')
    //         }else if($('#slider-attr-select').val()=="Inbetriebnahmejahr"){
    //             $( "#slider-filter-min" ).html((ui.values[0]))
    //             $( "#slider-filter-max" ).html((ui.values[1]))
    //         }else{
    //             $( "#slider-filter-min" ).html((ui.values[0])+' m')
    //             $( "#slider-filter-max" ).html((ui.values[1])+' m')
    //         }
    //         bdeVal=ui.values
    //         applyFilter()
    //     }
    // })
})
$('#slider-nach-select').on('change', ()=>{
    $("#nach-list").empty()
    $('#nach-list-input').flexdatalist('reset')
    let dataList=nachList[$('#slider-nach-select').val()]
    dataList.forEach(element=>{
        $("#nach-list").append('<option value="'+element+'">'+element+'</option>')
    })
    $('#nach-list-input').flexdatalist({searchContain: true}).on('change:flexdatalist',(event, set, options)=>{
        applyFilter()
    })
});
hersteller.forEach(element=>{
    $("#nach-list").append('<option value="'+element+'">'+element+'</option>')
})
$('#nach-list-input').flexdatalist({searchContain: true}).on('change:flexdatalist',(event, set, options)=>{
    applyFilter()
})
// Date Range Picker
$('.input-group.date').datepicker({
    format: 'mm/dd/yyyy',
    todayBtn:"linked",
    startView:2
});
$('#date-commision-start').on('changeDate',()=>{
    dateComissioned[0]=new Date($('#date-commision-start').datepicker('getUTCDate')).getTime()/1000
    applyFilter()
    $('#reverse-date-filter').show()
})
$('#date-commision-end').on('changeDate',()=>{
    dateComissioned[1]=new Date($('#date-commision-end').datepicker('getUTCDate')).getTime()/1000
    applyFilter()
    $('#reverse-date-filter').show()
})
// Betriebs-Status
$('#in-planung').on('change',()=>{
    if($('#in-planung').is(":checked")){
        stats.push("In Planung")
        if($('#slider-attr-select').val()=="Inbetriebnahmejahr"){
            $( "#slider-filter" ).slider("option","max",2029)
            $( "#slider-filter-max" ).html(2029)
        }
    }else{
        stats.splice(stats.indexOf("In Planung"),1)
        if($('#slider-attr-select').val()=="Inbetriebnahmejahr"){
            $( "#slider-filter" ).slider("option","max",2024)
            $( "#slider-filter-max" ).html(2024)
        }      
    }
    if($('#legend-select').val()=="Inbetriebnahmejahr"){
        let legendVal=attSliders[$('#legend-select').val()]
        $( "#min-legend-bar" ).html((legendVal[0]))
        let endVal=[2010,2024]
        if(stats.includes('In Planung'))endVal=[2015,2029]
        $( "#max-legend-bar" ).html((endVal[1]))
        matchPulsingDot=[
            "case",
            ["==", ["get", $('#legend-select').val()], ""],
            'nopulsing-dotGrey',
            ['step',
                ['get', $('#legend-select').val()],
                'nopulsing-dotGrey',
                0,
                'nopulsing-dotGrey',
                1980,
                'nopulsing-dot1',
                2000,
                'nopulsing-dot2',
                endVal[0],
                'nopulsing-dot3',
                endVal[1],
                'nopulsing-dot4' ] 
        ]
    }
    applyFilter()
})
$('#in-betrieb').on('change',()=>{
    if($('#in-betrieb').is(":checked")) stats.push("In Betrieb")
    else stats.splice(stats.indexOf("In Betrieb"),1)
    applyFilter()
})
$('#in-es').on('change',()=>{
    if($('#in-es').is(":checked")) stats.push("Endgültig stillgelegt")
    else stats.splice(stats.indexOf("Endgültig stillgelegt"),1)
    applyFilter()
})
$('#in-vs').on('change',()=>{
    if($('#in-vs').is(":checked")) stats.push("Vorübergehend stillgelegt")
    else stats.splice(stats.indexOf("Vorübergehend stillgelegt"),1)
    applyFilter()
})
$('#reverse-date-filter').on('click',()=>{
    dateComissioned=[-2208988800,Date.now()]
    $('#date-commision-start-container').empty().append(
        `<div id="date-commision-start" class="input-group date">
                        <div class="row d-flex align-items-center row-date">
                            <div class="col-8">
                                <input type="text" value="von" class="date-input jet-color">
                            </div>
                            <div class="col-2 jet-color">
                                <span class="input-group-addon">
                                    <i class="bi bi-sm bi-calendar-week-fill"></i>
                                </span>
                            </div>
                        </div>  
                    </div>
                    <div id="date-commision-end" class="input-group date">
                        <div class="row d-flex align-items-center row-date">
                            <div class="col-8">
                                <input type="text" value="bis" class="date-input jet-color">
                            </div>
                            <div class="col-2 jet-color">
                                <span class="input-group-addon">
                                    <i class="bi bi-sm bi-calendar-week-fill"></i>
                                </span>
                            </div>
                        </div>  
                    </div>`
    )
    $('.input-group.date').datepicker({
        format: 'mm/dd/yyyy',
        todayBtn:"linked",
        startView:2
    });
    $('#date-commision-start').on('changeDate',()=>{
        dateComissioned[0]=new Date($('#date-commision-start').datepicker('getUTCDate')).getTime()/1000
        applyFilter()
        $('#reverse-date-filter').show()
    })
    $('#date-commision-end').on('changeDate',()=>{
        dateComissioned[1]=new Date($('#date-commision-end').datepicker('getUTCDate')).getTime()/1000
        applyFilter()
        $('#reverse-date-filter').show()
    })
    applyFilter()
    $('#reverse-date-filter').hide()
})
function applyFilter(){
    let statsFilter=["in", ["get","Betriebs-Status"],["literal", stats]],
    // bundeslandFilter=[$("#bundesland-query").val(),["get","Bundesland"],$("#bundesland").val()],
    
    // console.log('Start Date: '+$('#date-comission-start').datepicker("getDate"))
    comissionStart=[">=",['get','Inbetriebnahmedatum der Einheit'], dateComissioned[0]],
    comissionEnd=["<=",['get','Inbetriebnahmedatum der Einheit'],dateComissioned[1]],
    // Inbetriebnahmedatum der Einheit: -2208988800
    bde1=[">=", ["get", $('#slider-attr-select').val()], bdeVal[0]],
    bde2=["<=", ["get", $('#slider-attr-select').val()], bdeVal[1]],
    queryFilter=['all',statsFilter,bde1,bde2,comissionStart,comissionEnd]
    // rangeVal=attSliders[$('#slider-attr-select').val()]
    // bdeVal=rangeVal
    // if(!bdeVal[0]==attSliders[$('#slider-attr-select').val()][0])queryFilter.push(bde1)
    if(!$('#nach-list-input').val().split(",")[0]==''){
        let energyProducerFilter=["in", ["get",$('#slider-nach-select').val()],["literal", $('#nach-list-input').val().split(",")]]
        queryFilter.push(energyProducerFilter)
    }
    map.setFilter('point',queryFilter)
    queryFilter.push([">", ['to-number', ["get", $('#slider-attr-select').val()]], 0])
    map.setFilter('point-heat',queryFilter)
}

// legends
$('#legend-select').on('change',()=>{
    let legendVal=attSliders[$('#legend-select').val()]
    map.setFilter('point-heat',[">", ['to-number', ["get", $('#legend-select').val()]], 0])
    if($('#legend-select').val()=="Bruttoleistung der Einheit"){
        $( "#min-legend-bar" ).html('0.5 MW')
        $( "#max-legend-bar" ).html('15 MW')
        matchPulsingDot=[
            'step',
            ['get', $('#legend-select').val()],
            'nopulsing-dotGrey',
            0,
            'nopulsing-dotGrey',
            0.01,
            'nopulsing-dot1',
            5,
            'nopulsing-dot2',
            10,
            'nopulsing-dot3',
            15, 
            'nopulsing-dot4' 
        ]
    }else if($('#legend-select').val()=="Inbetriebnahmejahr"){
        $( "#min-legend-bar" ).html((legendVal[0]))
        let endVal=[2010,2024]
        if(stats.includes('In Planung'))endVal=[2015,2029]
        $( "#max-legend-bar" ).html((endVal[1]))
        matchPulsingDot=[
            "case",
            ["==", ["get", $('#legend-select').val()], ""],
            'nopulsing-dotGrey',
            ['step',
                ['get', $('#legend-select').val()],
                'nopulsing-dotGrey',
                0,
                'nopulsing-dotGrey',
                1980,
                'nopulsing-dot1',
                2000,
                'nopulsing-dot2',
                endVal[0],
                'nopulsing-dot3',
                endVal[1],
                'nopulsing-dot4' ] 
        ]
    }else if($('#legend-select').val()=="Nabenhöhe der Windenergieanlage"){
        $( "#min-legend-bar" ).html((legendVal[0])+' m')
        $( "#max-legend-bar" ).html((legendVal[1])+' m')
        matchPulsingDot=[
            'step',
            ['get', $('#legend-select').val()],
            'nopulsing-dotGrey',  
            0,
            'nopulsing-dotGrey',
            1,
            'nopulsing-dot1',
            100,
            'nopulsing-dot2',
            150,
            'nopulsing-dot3',
            190,
            'nopulsing-dot4'
        ]
    }else{
        $( "#min-legend-bar" ).html((legendVal[0])+' m')
        $( "#max-legend-bar" ).html((legendVal[1])+' m')
        matchPulsingDot=[
            'step',
            ['get', $('#legend-select').val()],
            'nopulsing-dotGrey',
            0,
            'nopulsing-dotGrey',
            1,
            'nopulsing-dot1',
            100,
            'nopulsing-dot2',
            150,
            'nopulsing-dot3',
            250,
            'nopulsing-dot4'
        ]
    }
    map.setLayoutProperty('point', 
        'icon-image', matchPulsingDot
    )
})
