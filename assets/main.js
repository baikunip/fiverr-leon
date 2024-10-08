// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = 'pk.eyJ1IjoiYmFpa3VuaXAxNCIsImEiOiJjbDBycXdmbHEwNjY0M2lrN2lubnd1aW43In0.zsbYN2VrQ1Dit4kj4uhzWw';
let userClick=0
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [10.2994,54.073831], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12, // starting zoom
    // minZoom:7,
    // maxZoom:16,
    style: 'mapbox://styles/mapbox/satellite-streets-v12'
});
let herstellerList={'ENERCON GmbH': ['ENERCON GmbH', 'Lagerwey GmbH'], 'Nordex': ['Nordex SE', 'Nordex Energy GmbH', 'Südwind Borsig Energy GmbH', 'Nordex Germany GmbH'], 'Inaktive Hersteller': ['Fuhrländer AG', 'SEEWIND Windenergiesysteme GmbH', 'DeWind GmbH', 'AN-Maschinenbau- und Umweltschutzanlagen GmbH', 'Pfleiderer Deutschland GmbH', 'Frisia Windkraftanlagen Service GmbH', 'EVIAG AG', 'PowerWind GmbH', 'QREON GmbH', 'VENTIS WIND SERVICE S.L', 'MAX-wyn GmbH', 'Schütz GmbH & Co. KGaA', 'Schuler Aktiengesellschaft', 'Pfleiderer Wind Energy GmbH', 'Husumer Dock und Reparatur GmbH & Co. KG', 'SeeBA Energiesysteme GmbH', 'Hanseatische AG', 'Wincon West Wind A/S', 'Zentrum für Sonnenenergie- und Wasserstoff-Forschung Baden-Württemberg (ZSW)', 'Norddeutsche H-Rotoren GmbH & Co. KG'], 'Vestas': ['Vestas Deutschland GmbH', 'NEG Micon Deutschland GmbH', 'Wind World A/S', 'Nordtank Energy Group', 'MHI Vestas Offshore Wind'], 'Senvion': ['Senvion Deutschland GmbH', 'REpower Systems SE', 'HSW Husumer Schiffswerft GmbH & Co. KG', 'bwu Brandenburgische Wind- und Umwelttechnologien GmbH', 'Kenersys Europe GmbH', 'Jacobs Energie GmbH'], 'GE': ['Tacke GmbH & Co. KG', 'General Electric Deutschland Holding GmbH', 'GE Wind Energy GmbH', 'GE Renewable Germany GmbH', 'Enron Wind GmbH'], 'Kleinwindanlagen-Hersteller': ['Easywind GmbH', 'Lely Aircon B.V. Niederlassung Leer', 'PSW-Energiesysteme GmbH', 'FuSystems SkyWind GmbH', 'WindTec GmbH', 'TOZZI NORD\xa0S.R.L.', 'BRAUN Windturbinen GmbH', 'EUSAG AG', 'Wind+Wing Technologies', 'Heyde Windtechnik GmbH', 'VWA-Deutschland GmbH Freude am Strom', 'LWS systems GmbH & Co. KG.', 'Kähler Maschinenbau GmbH', 'Weinack Windenergie Anlagen GmbH', 'K.D.-Stahl- und Maschinenbau GmbH', 'Fortis Wind Energy', 'Wind Technik Nord GmbH', 'Wittenbauer Technik & Consulting GmbH', 'ALPHACON GmbH', 'Kessler Energy GmbH', 'WSD - Windsysteme', 'JAMP GmbH', 'Sonkyo Energy', 'Home Energy International', 'SOLAR-WIND-TEAM GmbH', 'Mischtechnik Hoffmann & Partner GmbH', 'S & W ENERGIESYSTEME UG (haftungsbeschränkt)', 'InVentus Energie GmbH', 'SkyWind GmbH', 'Uni Wind GmbH', 'Nova-Wind GmbH', 'VENTEGO AG', 'Krogmann GmbH & Co. KG', 'Honeywell Windtronics', 'windradshop', 'myLEDsun', 'Werner Eberle GmbH', 'ESPV-TEC GmbH & Co. KG', 'MyWind', 'STM Montage GmbH', 'Ventis Energietechnik GmbH', 'PreVent GmbH', 'WES IBS GmbH', 'WTT GmbH', 'LuvSide GmbH', 'SMA Solar Technology AG', 'Svit Vitru', 'Aeolos Windkraftanlagen', 'ROPATEC SRL', 'E.A.Z. Wind GmbH', 'Gödecke Energie- und Antriebstechnik GmbH', 'Anhui Hummer Dynamo Co.,Ltd.', 'Eovent GmbH', 'ABB Power-One Italy SpA', 'Hyden', 'Kleinwind GmbH', 'Octopus Systems GmbH', 'Alpha projekt GmbH', 'SB Energy UK Ltd.'], 'Nicht genannt': ['nan', 'Sonstige'], 'VENSYS Energy AG': ['VENSYS Energy AG'], 'Siemens': ['Siemens Wind Power GmbH & Co. KG', 'Siemens Gamesa Renewable Energy GmbH & Co. KG', 'AN Windenergie GmbH', 'Gamesa Corporación Tecnológica S.A.', 'Adwen GmbH', 'Bonus Energy A/S', 'AN Windanlagen GmbH'], 'eno energy GmbH': ['eno energy GmbH', 'eno energy systems GmbH'], 'FWT energy GmbH': ['FWT energy GmbH'], 'AREVA GmbH': ['AREVA GmbH'], 'Amperax Energie GmbH': ['Amperax Energie GmbH'], 'BARD Holding GmbH': ['BARD Holding GmbH']}
function forwardGeocoder(query){
    const matchingFeatures = [];
    for (const hersteller of Object.keys(herstellerList)) {
        // Handle queries with different capitalization
        // than the source data by calling toLowerCase().
        if (
            hersteller
                .toLowerCase()
                .includes(query.toLowerCase())
        ) {
            // Add a tree emoji as a prefix for custom
            // data results using carmen geojson format:
            // https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
            // 'id': 'point',
            // 'source': 'datapoints',
            // 'source-layer': 'newDataConverted-cherwl',
            map.querySourceFeatures('point', {
                sourceLayer: 'newDataConverted-cherwl'
            }).forEach((feature) => {
                if(feature.properties["Hersteller Zusammenfassung"]==hersteller&&herstellerList[hersteller].includes(feature.properties["Hersteller der Windenergieanlage"])){
                    feature['place_name'] = feature.properties["Hersteller der Windenergieanlage"];
                    feature['center'] = feature.geometry.coordinates;
                    feature['place_type'] = feature.properties["Hersteller Zusammenfassung"];
                    matchingFeatures.push(feature);
                    console.log(matchingFeatures)
                }
            });
            
        }
    }
    return matchingFeatures;
}
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: forwardGeocoder,
        countries:'de',
        zoom: 14,
        placeholder: 'Enter search',
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
let matchPulsingDot=[
    'step',
    ['get', 'Bruttoleistung der Einheit'],
    'nopulsing-dot1',
    0.5,
    'nopulsing-dot2',
    5,
    'nopulsing-dot3',
    15,
    'nopulsing-dot4'
    
]
// map loading all components
map.on('load', () => {
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
    map.addImage('nopulsing-dot1', nopulsingDot1, { pixelRatio: 2 });
    map.addImage('nopulsing-dot2', nopulsingDot2, { pixelRatio: 2 });
    map.addImage('nopulsing-dot3', nopulsingDot3, { pixelRatio: 2 });
    map.addImage('nopulsing-dot4', nopulsingDot4, { pixelRatio: 2 });
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
        url: 'mapbox://baikunip14.31hjtm2g'
    });
    map.addLayer({
        'id': 'point',
        'source': 'datapoints',
        'source-layer': 'newDataConverted-cherwl',
        'type': 'symbol',
        'paint': {
            // 'circle-radius': 4,
            // 'circle-color': 'blue',
            'icon-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                0,
                14,
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
    },firstSymbolId);
    map.addLayer({
        'id': 'point-heat',
        'type': 'heatmap',
        'source': 'datapoints',
        'source-layer': 'newDataConverted-cherwl',
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
        map.setLayoutProperty('point', 'icon-image', matchPulsingDot)
        return;
    }
    userClick+=1
    let feature = features[0],
    fkeys=Object.keys(feature.properties),
    // 
    tagString=`<div class="card-header"><h5>Turbines Info</h5></div>
            <div class="card-body">
                <table class="table jet-color table-sm" style="width:100%;">` 
    let dateAttr=['Registrierungsdatum der Einheit','Inbetriebnahmedatum der Einheit','Letzte Aktualisierung','Datum der endgültigen Stilllegung','Datum der geplanten Inbetriebnahme','Inbetriebnahmedatum der EEG-Anlage']
    console.log(feature.properties)
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
    $("#InbetriebnahmedatumderEinheit-popup").html(setPopupDate("Inbetriebnahmedatum der Einheit"))
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
// filters
// Hide/Show FIlters
function showhidefilter(stats){
    if(stats=="hidden"){
        $("#filter-bar").hide()
        $("#show-filter-bar").show()
    }else{
        if($('#isMobile').is(':visible')) $("#filter-bar").css("width","99%").css("top","8vh").css("overflow","scroll").css("max-height","50vh")
        else $("#filter-bar").css("width","30em").css("overflow","scroll").css("max-height","70vh")
        $("#show-filter-bar").hide()
        $("#filter-bar").show()
        // $("#filter-btn-container").empty().append(
        //     `
        //         <div class="col-2">
        //                 <button id="hide-filter-btn" type="button" onclick='showhidefilter("hidden")' class="jet-color btn btn-sm"></button>
        //             </div>
        //             <div class="col-10">
        //                 <div class="text-popup">Auswahl Filtern</div>
        //         </div>
        //     `
        // )
    }
}    

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
let bdeVal=[0,20000],stats=["In Planung","In Betrieb","Endgültig stillgelegt","Vorübergehend stillgelegt"],
bundesland=["Hessen","Schleswig-Holstein","Nordrhein-Westfalen","Rheinland-Pfalz",
    "Bayern","Baden-Württemberg","Mecklenburg-Vorpommern","Niedersachsen","Sachsen-Anhalt",
    "Saarland","Sachsen","Brandenburg","Ausschließliche Wirtschaftszone","Thüringen",
    "Hamburg"
],
energyProducer=['nan', 'Frisia Windkraftanlagen Service GmbH', 'Weinack Windenergie Anlagen GmbH', 'Gamesa Corporación Tecnológica S.A.', 'General Electric Deutschland Holding GmbH', 'Sonkyo Energy', 'TOZZI NORD\xa0S.R.L.', 'BARD Holding GmbH', 'eno energy systems GmbH', 'Octopus Systems GmbH', 'Wind Technik Nord GmbH', 'Norddeutsche H-Rotoren GmbH & Co. KG', 'Wittenbauer Technik & Consulting GmbH', 'Pfleiderer Deutschland GmbH', 'Krogmann GmbH & Co. KG', 'LWS systems GmbH & Co. KG.', 'Heyde Windtechnik GmbH', 'Siemens Wind Power GmbH & Co. KG', 'ABB Power-One Italy SpA', 'HSW Husumer Schiffswerft GmbH & Co. KG', 'InVentus Energie GmbH', 'GE Wind Energy GmbH', 'SB Energy UK Ltd.', 'ESPV-TEC GmbH & Co. KG', 'MyWind', 'Gödecke Energie- und Antriebstechnik GmbH', 'WTT GmbH', 'DeWind GmbH', 'Alpha projekt GmbH', 'PowerWind GmbH', 'Svit Vitru', 'VWA-Deutschland GmbH Freude am Strom', 'WSD - Windsysteme', 'Werner Eberle GmbH', 'Anhui Hummer Dynamo Co.,Ltd.', 'Uni Wind GmbH', 'Wind World A/S', 'Südwind Borsig Energy GmbH', 'AN Windenergie GmbH', 'MAX-wyn GmbH', 'REpower Systems SE', 'Nordex SE', 'Kessler Energy GmbH', 'Schuler Aktiengesellschaft', 'SkyWind GmbH', 'windradshop', 'Siemens Gamesa Renewable Energy GmbH & Co. KG', 'eno energy GmbH', 'Jacobs Energie GmbH', 'SeeBA Energiesysteme GmbH', 'EVIAG AG', 'VENSYS Energy AG', 'Vestas Deutschland GmbH', 'Hyden', 'VENTIS WIND SERVICE S.L', 'MHI Vestas Offshore Wind', 'Aeolos Windkraftanlagen', 'FWT energy GmbH', 'Eovent GmbH', 'Adwen GmbH', 'Zentrum für Sonnenenergie- und Wasserstoff-Forschung Baden-Württemberg (ZSW)', 'Nova-Wind GmbH', 'SEEWIND Windenergiesysteme GmbH', 'Lely Aircon B.V. Niederlassung Leer', 'Mischtechnik Hoffmann & Partner GmbH', 'PreVent GmbH', 'JAMP GmbH', 'Pfleiderer Wind Energy GmbH', 'GE Renewable Germany GmbH', 'Lagerwey GmbH', 'ALPHACON GmbH', 'Bonus Energy A/S', 'NEG Micon Deutschland GmbH', 'Fuhrländer AG', 'Nordtank Energy Group', 'Wind+Wing Technologies', 'Nordex Germany GmbH', 'myLEDsun', 'WES IBS GmbH', 'WindTec GmbH', 'Home Energy International', 'Tacke GmbH & Co. KG', 'VENTEGO AG', 'QREON GmbH', 'ROPATEC SRL', 'bwu Brandenburgische Wind- und Umwelttechnologien GmbH', 'Nordex Energy GmbH', 'E.A.Z. Wind GmbH', 'BRAUN Windturbinen GmbH', 'Kleinwind GmbH', 'Fortis Wind Energy', 'Amperax Energie GmbH', 'Schütz GmbH & Co. KGaA', 'PSW-Energiesysteme GmbH', 'Hanseatische AG', 'Easywind GmbH', 'K.D.-Stahl- und Maschinenbau GmbH', 'Ventis Energietechnik GmbH', 'Wincon West Wind A/S', 'Senvion Deutschland GmbH', 'Husumer Dock und Reparatur GmbH & Co. KG', 'STM Montage GmbH', 'EUSAG AG', 'S & W ENERGIESYSTEME UG (haftungsbeschränkt)', 'ENERCON GmbH', 'Kähler Maschinenbau GmbH', 'FuSystems SkyWind GmbH', 'Sonstige', 'AN Windanlagen GmbH', 'SMA Solar Technology AG', 'LuvSide GmbH', 'SOLAR-WIND-TEAM GmbH', 'Kenersys Europe GmbH', 'AN-Maschinenbau- und Umweltschutzanlagen GmbH', 'Honeywell Windtronics', 'Enron Wind GmbH', 'AREVA GmbH']
,nachList={"Hersteller der Windenergieanlage":energyProducer,"Bundesland":bundesland,"Name des Anschluss-Netzbetreibers":['test']},
attSliders={"Bruttoleistung der Einheit":[0, 15],"Rotordurchmesser der Windenergieanlage":[0,250],"Nabenhöhe der Windenergieanlage":[0,250],"Inbetriebnahmejahr":[1983,2024]},
dateComissioned=[-2208988800,Date.now()]
bundesland.forEach(element => {$("#bundeslandOptions").append('<option value="'+element+'">')});

$( "#slider-filter" ).slider({
    range: true,
    min: 0,
    max: 15,
    values: [ 0, 15 ],
    slide: function( event, ui ) {
      if(ui.values[0]!=0)$( "#slider-filter-min" ).html((ui.values[0])+' MW')
      else $( "#slider-filter-min" ).html('0 MW')
      $( "#slider-filter-max" ).html((ui.values[1])+' MW')
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
    $('#slider-filter-container').empty().append(
        `<div id="slider-filter"></div>`
    )
    let rangeVal=attSliders[$('#slider-attr-select').val()]
    bdeVal=rangeVal
    if($('#slider-attr-select').val()=="Bruttoleistung der Einheit")measurementUnit=' MW'
    if($('#slider-attr-select').val()=="Bruttoleistung der Einheit"){
        $( "#slider-filter-min" ).html('0 MW')
        $( "#slider-filter-max" ).html((rangeVal[1])+' MW')
        enableDate()
    }else if($('#slider-attr-select').val()=="Inbetriebnahmejahr"){
        $( "#slider-filter-min" ).html((rangeVal[0]))
        $( "#slider-filter-max" ).html((rangeVal[1]))
        disableDate()
    }else{
        $( "#slider-filter-min" ).html((rangeVal[0])+' m')
        $( "#slider-filter-max" ).html((rangeVal[1])+' m')
        enableDate()
    }
    applyFilter()
    $( "#slider-filter" ).slider({
        range: true,
        min: rangeVal[0],
        max: rangeVal[1],
        values: rangeVal,
        slide: function( event, ui ) {
            if($('#slider-attr-select').val()=="Bruttoleistung der Einheit"){
                if(ui.values[0]!=0)$( "#slider-filter-min" ).html((ui.values[0])+' MW')
                else $( "#slider-filter-min" ).html('0 MW')
                $( "#slider-filter-max" ).html((ui.values[1])+' MW')
            }else{
                $( "#slider-filter-min" ).html((ui.values[0])+' m')
                $( "#slider-filter-max" ).html((ui.values[1])+' m')
            }
            bdeVal=ui.values
            applyFilter()
        }
    })
})
$('#slider-nach-select').on('change', ()=>{
    $("#nach-list").empty()
    $('#nach-list-input').flexdatalist('reset')
    let dataList=nachList[$('#slider-nach-select').val()]
    dataList.forEach(element=>{
        $("#nach-list").append('<option value="'+element+'">'+element+'</option>')
    })
    $('#nach-list-input').flexdatalist().on('change:flexdatalist',(event, set, options)=>{
        applyFilter()
    })
});
energyProducer.forEach(element=>{
    $("#nach-list").append('<option value="'+element+'">'+element+'</option>')
})
$('#nach-list-input').flexdatalist().on('change:flexdatalist',(event, set, options)=>{
    applyFilter()
})
// Date Range Picker
$('.input-group.date').datepicker({
    format: 'mm/dd/yyyy',
    todayBtn:"linked",
    startView:1
});
$('#date-commision-start').on('changeDate',()=>{
    dateComissioned[0]=new Date($('#date-commision-start').datepicker('getUTCDate')).getTime()/1000
    applyFilter()
})
$('#date-commision-end').on('changeDate',()=>{
    dateComissioned[1]=new Date($('#date-commision-end').datepicker('getUTCDate')).getTime()/1000
    applyFilter()
})
// Betriebs-Status
$('#in-planung').on('change',()=>{
    if($('#in-planung').is(":checked")) stats.push("In Planung")
    else stats.splice(stats.indexOf("In Planung"),1)
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
    dateComissioned=[0,Date.now()]
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
        startView:1
    });
    $('#date-commision-start').on('changeDate',()=>{
        dateComissioned[0]=new Date($('#date-commision-start').datepicker('getUTCDate')).getTime()/1000
        applyFilter()
    })
    $('#date-commision-end').on('changeDate',()=>{
        dateComissioned[1]=new Date($('#date-commision-end').datepicker('getUTCDate')).getTime()/1000
        applyFilter()
    })
    applyFilter()
})
function applyFilter(){
    let statsFilter=["in", ["get","Betriebs-Status"],["literal", stats]],
    // bundeslandFilter=[$("#bundesland-query").val(),["get","Bundesland"],$("#bundesland").val()],
    
    // console.log('Start Date: '+$('#date-comission-start').datepicker("getDate"))
    comissionStart=[">=",['get','Inbetriebnahmedatum der Einheit'], dateComissioned[0]],
    comissionEnd=["<=",['get','Inbetriebnahmedatum der Einheit'],dateComissioned[1]],
    // Inbetriebnahmedatum der Einheit: -2208988800
    bde1=[">=", ["get", $('#slider-attr-select').val()], bdeVal[0]],
    bde2=["<=", ["get", $('#slider-attr-select').val()], bdeVal[1]]
    queryFilter=['all',statsFilter,bde1,bde2,comissionStart,comissionEnd]
    if(!$('#nach-list-input').val().split(",")[0]==''){
        let energyProducerFilter=["in", ["get",$('#slider-nach-select').val()],["literal", $('#nach-list-input').val().split(",")]]
        queryFilter.push(energyProducerFilter)
    }
    // if($('#betriebs-status-check').is(':checked')) queryFilter.push(statsFilter)
    // if($('#bde-check').is(':checked')) queryFilter.push(bde1,bde2)
    // if($('#hdw-check').is(':checked')) queryFilter.push(energyProducerFilter)
    // if($('#ide-check').is(':checked')) queryFilter.push(comissionStart,comissionEnd)
    // if($('#bundesland-check').is(':checked')) queryFilter.push(bundeslandFilter)
    map.setFilter('point',queryFilter)
    map.setFilter('point-heat',queryFilter)
}

// legends
$('#legend-select').on('change',()=>{
    let legendVal=attSliders[$('#legend-select').val()]
    if($('#legend-select').val()=="Bruttoleistung der Einheit"){
        $( "#min-legend-bar" ).html('0.5 MW')
        $( "#max-legend-bar" ).html('15 MW')
        matchPulsingDot=[
            'step',
            ['get', $('#legend-select').val()],
            'nopulsing-dot1',
            0.5,
            'nopulsing-dot2',
            5,
            'nopulsing-dot3',
            15,
            'nopulsing-dot4'
            
        ]
    }else if($('#legend-select').val()=="Inbetriebnahmejahr"){
        $( "#min-legend-bar" ).html((legendVal[0]))
        $( "#max-legend-bar" ).html((legendVal[1]))
        matchPulsingDot=[
            'step',
            ['get', $('#legend-select').val()],
            'nopulsing-dot1',
            1990,
            'nopulsing-dot2',
            2000,
            'nopulsing-dot3',
            2023,
            'nopulsing-dot4'
        ]
    }else{
        $( "#min-legend-bar" ).html((legendVal[0])+' m')
        $( "#max-legend-bar" ).html((legendVal[1])+' m')
        matchPulsingDot=[
            'step',
            ['get', $('#legend-select').val()],
            'nopulsing-dot1',
            50,
            'nopulsing-dot2',
            125,
            'nopulsing-dot3',
            200,
            'nopulsing-dot4'
        ]
    }
    map.setLayoutProperty('point', 
        'icon-image', matchPulsingDot
    )
})
