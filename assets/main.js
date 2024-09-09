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
        url: 'mapbox://baikunip14.1l8f5t0m'
    });
    map.addLayer({
        'id': 'point',
        'source': 'datapoints',
        'source-layer': 'newData-323m7b',
        'type': 'symbol',
        'paint': {
            // 'circle-radius': 4,
            // 'circle-color': '#FFFC62',
            'icon-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                0,
                14,
                1
            ]
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
        'source-layer': 'newData-323m7b',
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
    userClick+=1
    let feature = features[0],
    fkeys=Object.keys(feature.properties),
    // 
    tagString=`<div class="card-header"><h5>Turbines Info</h5></div>
            <div class="card-body">
                <table class="table jet-color table-sm" style="width:100%;">` 
    let dateAttr=['Registrierungsdatum der Einheit','Inbetriebnahmedatum der Einheit','Letzte Aktualisierung','Datum der endgültigen Stilllegung','Datum der geplanten Inbetriebnahme','Inbetriebnahmedatum der EEG-Anlage']
    for (let index = 0; index < fkeys.length; index++) {
        const element = fkeys[index];
        let stringVal=''
        if(dateAttr.includes(element)){
            console.log(element+': '+feature.properties[element])
            let convertedTime=new Date(feature.properties[element]* 1000)
            stringVal=convertedTime.getDay()+'-'+convertedTime.getMonth()+'-'+convertedTime.getFullYear()
            if(stringVal=='1-0-1900')stringVal='-'
        }else{
            stringVal=feature.properties[element]
        }
        if(userClick>4){
            tagString+=`<tr class="jet-color">
                        <th scope="row" class="jet-color">`+(index+1)+`</th>
                        <td class="jet-color">`+element+`</td>
                        <td class="jet-color"><b>*****</b></td>
                      </tr>`
        }
            tagString+=`<tr class="jet-color">
                            <th scope="row" class="jet-color">`+(index+1)+`</th>
                            <td class="jet-color">`+element+`</td>
                            <td class="jet-color">`+stringVal+`</td>
                        </tr>`
    }    
    tagString+=`</table>
            </div>`
    $("#popup").show().empty().append(tagString)
    // example: https://codepen.io/cladjidane/pen/GRErYqO
    map.setLayoutProperty('point', 'icon-image', ["match", ["get","MaStR-Nr. der Einheit"], feature.properties["MaStR-Nr. der Einheit"], 'pulsing-dot', 'nopulsing-dot'])
});
map.on('mouseenter', 'point', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
map.on('mouseleave', 'point', () => {
    map.getCanvas().style.cursor = ''
})
// filters
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
let bdeVal=[0,20000],stats=["In Planung","In Betrieb","Endgültig stillgelegt"],
bundesland=["Hessen","Schleswig-Holstein","Nordrhein-Westfalen","Rheinland-Pfalz",
    "Bayern","Baden-Württemberg","Mecklenburg-Vorpommern","Niedersachsen","Sachsen-Anhalt",
    "Saarland","Sachsen","Brandenburg","Ausschließliche Wirtschaftszone","Thüringen",
    "Hamburg"
],
energyProducer=['nan', 'Frisia Windkraftanlagen Service GmbH', 'Weinack Windenergie Anlagen GmbH', 'Gamesa Corporación Tecnológica S.A.', 'General Electric Deutschland Holding GmbH', 'Sonkyo Energy', 'TOZZI NORD\xa0S.R.L.', 'BARD Holding GmbH', 'eno energy systems GmbH', 'Octopus Systems GmbH', 'Wind Technik Nord GmbH', 'Norddeutsche H-Rotoren GmbH & Co. KG', 'Wittenbauer Technik & Consulting GmbH', 'Pfleiderer Deutschland GmbH', 'Krogmann GmbH & Co. KG', 'LWS systems GmbH & Co. KG.', 'Heyde Windtechnik GmbH', 'Siemens Wind Power GmbH & Co. KG', 'ABB Power-One Italy SpA', 'HSW Husumer Schiffswerft GmbH & Co. KG', 'InVentus Energie GmbH', 'GE Wind Energy GmbH', 'SB Energy UK Ltd.', 'ESPV-TEC GmbH & Co. KG', 'MyWind', 'Gödecke Energie- und Antriebstechnik GmbH', 'WTT GmbH', 'DeWind GmbH', 'Alpha projekt GmbH', 'PowerWind GmbH', 'Svit Vitru', 'VWA-Deutschland GmbH Freude am Strom', 'WSD - Windsysteme', 'Werner Eberle GmbH', 'Anhui Hummer Dynamo Co.,Ltd.', 'Uni Wind GmbH', 'Wind World A/S', 'Südwind Borsig Energy GmbH', 'AN Windenergie GmbH', 'MAX-wyn GmbH', 'REpower Systems SE', 'Nordex SE', 'Kessler Energy GmbH', 'Schuler Aktiengesellschaft', 'SkyWind GmbH', 'windradshop', 'Siemens Gamesa Renewable Energy GmbH & Co. KG', 'eno energy GmbH', 'Jacobs Energie GmbH', 'SeeBA Energiesysteme GmbH', 'EVIAG AG', 'VENSYS Energy AG', 'Vestas Deutschland GmbH', 'Hyden', 'VENTIS WIND SERVICE S.L', 'MHI Vestas Offshore Wind', 'Aeolos Windkraftanlagen', 'FWT energy GmbH', 'Eovent GmbH', 'Adwen GmbH', 'Zentrum für Sonnenenergie- und Wasserstoff-Forschung Baden-Württemberg (ZSW)', 'Nova-Wind GmbH', 'SEEWIND Windenergiesysteme GmbH', 'Lely Aircon B.V. Niederlassung Leer', 'Mischtechnik Hoffmann & Partner GmbH', 'PreVent GmbH', 'JAMP GmbH', 'Pfleiderer Wind Energy GmbH', 'GE Renewable Germany GmbH', 'Lagerwey GmbH', 'ALPHACON GmbH', 'Bonus Energy A/S', 'NEG Micon Deutschland GmbH', 'Fuhrländer AG', 'Nordtank Energy Group', 'Wind+Wing Technologies', 'Nordex Germany GmbH', 'myLEDsun', 'WES IBS GmbH', 'WindTec GmbH', 'Home Energy International', 'Tacke GmbH & Co. KG', 'VENTEGO AG', 'QREON GmbH', 'ROPATEC SRL', 'bwu Brandenburgische Wind- und Umwelttechnologien GmbH', 'Nordex Energy GmbH', 'E.A.Z. Wind GmbH', 'BRAUN Windturbinen GmbH', 'Kleinwind GmbH', 'Fortis Wind Energy', 'Amperax Energie GmbH', 'Schütz GmbH & Co. KGaA', 'PSW-Energiesysteme GmbH', 'Hanseatische AG', 'Easywind GmbH', 'K.D.-Stahl- und Maschinenbau GmbH', 'Ventis Energietechnik GmbH', 'Wincon West Wind A/S', 'Senvion Deutschland GmbH', 'Husumer Dock und Reparatur GmbH & Co. KG', 'STM Montage GmbH', 'EUSAG AG', 'S & W ENERGIESYSTEME UG (haftungsbeschränkt)', 'ENERCON GmbH', 'Kähler Maschinenbau GmbH', 'FuSystems SkyWind GmbH', 'Sonstige', 'AN Windanlagen GmbH', 'SMA Solar Technology AG', 'LuvSide GmbH', 'SOLAR-WIND-TEAM GmbH', 'Kenersys Europe GmbH', 'AN-Maschinenbau- und Umweltschutzanlagen GmbH', 'Honeywell Windtronics', 'Enron Wind GmbH', 'AREVA GmbH']
bundesland.forEach(element => {$("#bundeslandOptions").append('<option value="'+element+'">')});
$( "#slider-filter" ).slider({
    range: true,
    min: 0,
    max: 20000,
    values: [ 0, 20000 ],
    slide: function( event, ui ) {
      $( "#slider-filter-min" ).html(ui.values[0])
      $( "#slider-filter-max" ).html(ui.values[1])
      bdeVal=ui.values
    }
});
energyProducer.forEach(element=>{$("#energy-producer-list").append('<option value="'+element+'">'+element+'</option>')})
$("#energy-producer-list").multiSelect()
// $('#date-comission-start').datepicker()
// $('#date-comission-end').datepicker()
let dateComissioned=[0,Date.now()]
$('input[name="date-comission-start"]').daterangepicker({
    opens: 'left'
  }, function(start, end, label) {
    let newStart=new Date(start).getTime()
    if(newStart==0)newStart=0
    else newStart=newStart/1000
    dateComissioned=[newStart,(new Date(end).getTime()/1000)]
  })
// Betriebs-Status
$('#in-planung').on('change',()=>{
    if($('#in-planung').is(":checked")) stats.push("In Planung")
    else stats.splice(stats.indexOf("In Planung"),1)
})
$('#in-betrieb').on('change',()=>{
    if($('#in-betrieb').is(":checked")) stats.push("In Betrieb")
    else stats.splice(stats.indexOf("In Betrieb"),1)
})
$('#in-es').on('change',()=>{
    if($('#in-es').is(":checked")) stats.push("Endgültig stillgelegt")
    else stats.splice(stats.indexOf("Endgültig stillgelegt"),1)
})
$('#apply-filter').on('click',()=>{
    let statsFilter=["in", ["get","Betriebs-Status"],["literal", stats]],
    bundeslandFilter=[$("#bundesland-query").val(),["get","Bundesland"],$("#bundesland").val()],
    energyProducerFilter=["in", ["get","Hersteller der Windenergieanlage"],["literal", $("#energy-producer-list").val()]],
    // console.log('Start Date: '+$('#date-comission-start').datepicker("getDate"))
    comissionStart=[">=",['get','Inbetriebnahmedatum der Einheit'], dateComissioned[0]],
    comissionEnd=["<=",['get','Inbetriebnahmedatum der Einheit'],dateComissioned[1]],
    bde1=[">=", ["get", "Bruttoleistung der Einheit"], bdeVal[0]],
    bde2=["<=", ["get", "Bruttoleistung der Einheit"], bdeVal[1]]
    queryFilter=['all']
    if($('#betriebs-status-check').is(':checked')) queryFilter.push(statsFilter)
    if($('#bde-check').is(':checked')) queryFilter.push(bde1,bde2)
    if($('#hdw-check').is(':checked')) queryFilter.push(energyProducerFilter)
    if($('#ide-check').is(':checked')) queryFilter.push(comissionStart,comissionEnd)
    if($('#bundesland-check').is(':checked')) queryFilter.push(bundeslandFilter)
    map.setFilter('point',['any',
        queryFilter
    ])
    map.setFilter('point-heat',['any',
        queryFilter
    ])
})