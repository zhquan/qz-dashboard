$(document).ready(function(){
    $("#chardiv").click(function(){
        json('chartsjs');
    });
    $("#highdiv").click(function(){
        json('highcharts');
    });
});
// Formulario de menu
function json(div){
    cancelar();
    $("#index").append('<div id="menu"></div>');
    var Json = "json/dox-irc-rep-evolutionary.json";
    $.getJSON(Json).success(function(data){
        $.each( data, function( key, val ) {
            if (key != 'date'){
                if(div == 'chartsjs'){
                    $('#menu').append('<input type="checkbox" name="'+key+'" value="'+key+'"> <label> '+key+' -> Color: </label><input type="text" value="rgba(151,187,205,0.3)" id="color'+key+'"><br>');
                }else if (div == 'highcharts'){
                    $("#menu").append('<input type="checkbox" name="'+key+'" value="'+key+'"> <label> '+key+' -> Color: </label><input type="text" value="silver" id="color'+key+'" size="7"><input type="radio" name="'+key+'" value="line">Line <input type="radio" name="'+key+'" value="bar">Bar <input type="radio" name="'+key+'" value="pie">Pie<br>');
                }
            }
        });
        $("#menu").append('<form name="formul"><label>Desde: </label><select id="desde" name="desde"></select></form>');
        $("#menu").append('<form name="formul2"><label>Hasta: </label><select id="hasta" name="hasta"></select></form>');
        $.each( data, function( key, val ) {
            if (key == 'date'){
                for (var i = 0; i<val.length; i++){
                    $("#desde").append('<option value="'+val[i]+'">'+val[i]+'</option>');
                    $("#hasta").append('<option value="'+val[i]+'">'+val[i]+'</option>');
                }
                $("#menu").append('<div id="sdesde"></div>');
                barra("#desde", "#sdesde", val.length);
                $("#menu").append('<div id="shasta"></div>');
                barra("#hasta", "#shasta", val.length);
            }
        });
        if (div == 'chartsjs'){
            $("#menu").append('<form name="formul3"><label>Tipo: </label><select name="tipo"><option value="Line">Line</option><option value="Bar">Bar</option><option value="Radar">Radar</option></select></form>');
        }
        $("#menu").append('<br><input type="button" onclick="selection(\''+Json+'**'+div+'\')" value="OK"> <input type="button" onclick="cancelar()" value="cancelar">');
    });
}
function cancelar(){
    $("#menu").remove();
}
var id = 0;
// funcion de slider
function barra(sli, div, len){
    var select = $(sli);
    var slider = $(div).insertAfter( select ).slider({
        min: 1,
        max: len,
        value: select[ 0 ].selectedIndex + 1,
        slide: function( event, ui ) {
            select[ 0 ].selectedIndex = ui.value - 1;
        }
    });
    $(div).change(function() {
        slider.slider( "value", this.selectedIndex + 1 );
    });
}
// onclick del OK
function selection(request) {
    var json = request.split("**")[0];
    var div = request.split("**")[1];
    var check = [];
    var color = [];
    $("#menu input[type='checkbox']:checked").each(function(){
        check.push($(this).attr('value'));
        color.push(document.getElementById('color'+$(this).attr('value')).value);
    })
    var valor = sacar(check, json);
    if (div == 'chartsjs'){
        chartsjs(check, color, valor);
    }else if (div == 'highcharts'){
        highchart(check, color, valor);
    }
    cancelar();
}
// te devuelve un array con valor[0] el tiempo, valor[1] datos de la grafica
// check los checked de los keys, Json el json
function sacar(check, Json) {
    var desde = document.formul.desde.options[document.formul.desde.selectedIndex].value;
    var hasta = document.formul2.hasta.options[document.formul2.hasta.selectedIndex].value;
    var pos = [];
    var tiempo = [];
    var datos = [];
    var entrar = false;
    $.ajax({
        url: Json,
        dataType: 'json',
        async: false,
        success: function(json){
            //Su correspondiente fecha
            $.each( json, function ( key, val ){
                if (key == 'date'){
                    for(var i = 0; i < val.length; i++){
                        if(val[i] == desde){
                            entrar=true;
                        }
                        if(entrar){
                            pos.push(i);
                            tiempo.push(val[i]);
                        }
                        if(val[i] == hasta){
                            entrar=false;
                        }
                    }
                }
            });
            //Rellenar el array de dato
            $.each( json, function( key, val ) {
                for (var j = 0; j < check.length; j++){
                    if (check[j] == key){
                        var dato = [];
                        for (var i = 0; i < pos.length; i++){
                            dato.push(val[pos[i]]);
                        }
                        datos.push(dato);
                    }
                }
            });
        }
    });
    return [tiempo, datos];
}
function chartsjs(check, color, valor){
    var dataset = [];
    for (var i= 0; i<check.length; i++){
        var obj = {label: check[i], fillColor: color[i], strokeColor: color[i], highlightFill: color[i], highlightStroke: color[i], data: valor[1][i]};
        dataset.push(obj);
    }
    var Datas = {
	    labels : valor[0],
	    datasets : dataset
    }
    var options = {
        legendTemplate : '<ul>'
                        +'<% for (var i=0; i<datasets.length; i++) { %>'
                        +'<span style=\"background-color:<%=datasets[i].fillColor%>\">'
                        +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %></span>'
                        +'<% } %>'
                        +'</ul>'
    }
    var tipo = document.formul3.tipo.options[document.formul3.tipo.selectedIndex].value;
    var div = 'div'+id;
    $("#index").append('<div id="exterior'+div+'" class="canvas" style="width: 606px; height: 406px; border-width: 0px; border: solid; margin: 1px; float:left"><canvas id="canvas'+div+'" width="590" height="350"></canvas></div>');
    if (tipo == 'Line'){
        var myChart = new Chart(document.getElementById("canvas"+div).getContext("2d")).Line(Datas, options);
    }else if (tipo == 'Bar'){
        var myChart = new Chart(document.getElementById("canvas"+div).getContext("2d")).Bar(Datas, options);
    }else if (tipo == 'Radar'){
        var myChart = new Chart(document.getElementById("canvas"+div).getContext("2d")).Radar(Datas, options);
    }
    var legend = myChart.generateLegend();
    $('#exterior'+div).append('<div id="legend'+div+'"></div>');
    $("#legend"+div).html(legend+'<input type="button" onclick="borrarChart(\'exterior'+div+'\')" value="destroy">');
}
function borrarChart(div){
    $('#'+div).remove();
}
function highchart(check, color, valor) {
    var tipo = [];
    $("#menu input[type='radio']:checked").each(function(){
        tipo.push($(this).attr('value'));
    })
    var serie = [];
    var titulo = '';
    for (var i= 0; i<check.length; i++){
        var obj = {type: tipo[i], name: check[i], data: valor[1][i], color: color[i]};
        serie.push(obj);
        titulo = titulo+' '+check[i];
    }
    id = id+1;
    var div = 'div'+id;
    var style = ({
        chart: {
            renderTo: div,
            width: 600,
            height: 400
        },
        title: {
            text: titulo
        },
        xAxis: {
            categories: valor[0]
        },
        labels: {
            items: [{
                html: '',
                style: {
                    left: '50px',
                    top: '18px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }]
        },
        series: serie,
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: [{
                        text: 'Destroy',
                        onclick: function () {
                            $("#"+div).remove();
                        }
                    }]
                }
            }
        }
    });
    $('#index').append('<div id="'+div+'" class="hcanvas" style="border: solid; margin: 1px;"></div>');
    var Hchart = new Highcharts.Chart(style);
}
// Borrar la grafica del div

