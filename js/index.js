$(document).ready(function(){
    var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
    $("#example").click(function(){
	var Data = {
		labels : ["January","February","March","April","May","June","July"],
		datasets : [
			{
				fillColor : "blue",
				strokeColor : "blue",
				highlightFill: "blue",
				highlightStroke: "blue",
				data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
			},
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,0.8)",
				highlightFill : "rgba(151,187,205,0.75)",
				highlightStroke : "rgba(151,187,205,1)",
				data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
			}
		]

	}
    var Data2 = [
		{
			value: 300,
			color:"#F7464A",
			highlight: "#FF5A5E",
			label: "Red"
		},
		{
			value: 50,
			color: "#46BFBD",
			highlight: "#5AD3D1",
			label: "Green"
		},
		{
			value: 100,
			color: "#FDB45C",
			highlight: "#FFC870",
			label: "Yellow"
		},
		{
			value: 40,
			color: "#949FB1",
			highlight: "#A8B3C5",
			label: "Grey"
		},
		{
			value: 120,
			color: "#4D5360",
			highlight: "#616774",
			label: "Dark Grey"
		}

	];
    $("#bar").show();
    $("#doughnut").show();
    $("#line").show();
    $("#pie").show();
    $("#polararea").show();
    $("#radar").show();

    $("#bar").click(function() {
	    var myBar = new Chart(ctx).Bar(Data, {
		    responsive : true
	    });
    });
    $("#doughnut").click(function() {
		var myDoughnut = new Chart(ctx).Doughnut(Data2, {responsive : true});
    });
	$("#line").click(function() {
        var myLine = new Chart(ctx).Line(Data, {
			responsive: true
		});
    });
    $("#pie").click(function() {
        var myPie = new Chart(ctx).Pie(Data2);
    });
    $("#polararea").click(function() {
        var myPolarArea = new Chart(ctx).PolarArea(Data2);
    });
    $("#radar").click(function() {
        var myRadar = new Chart(ctx).Radar(Data, {
			responsive: true
		});
    });
    });
    var ctx = document.getElementById("canvas").getContext("2d");

    
//////////////////////////////////////////////////////////////////////////////////////////////////////
    $('.nav-sidebar li:first').addClass('active');
    $('.pestana section').hide();
    $('.pestana section:first').show();    
    $('.nav-sidebar li').click(function(){
        $('.nav-sidebar li').removeClass('active');
        $(this).addClass('active')
        $('.pestana section').hide();
        var activeTab = $(this).find('a').attr('href');
        $(activeTab).show();
    });
    json();
});
function json(){
    $.getJSON("json/1fifoto-its-dom-evolutionary.json").success(function(data){
        $.each( data, function( key, val ) {
            if (key != 'date'){
                $("#algo").append('<input type="checkbox" name="'+key+'" value="'+key+'"> '+key+' </input><label>-> Color: </label><input type="text" value="rgba(151,187,205,0.3)" id="color'+key+'"></input><br>')
            }
        });
        $("#algo").append('<form name="formul"><label>Desde: </label><select id="desde" name="desde"></select></form>');
        $.each( data, function( key, val ) {
            if (key == 'date'){
                for (var i = 0; i<val.length; i++){
                    $("#desde").append('<option value="'+val[i]+'">'+val[i]+'</option>');
                }
            }
        });
        $("#algo").append('<form name="formul2"><label>Hasta: </label><select id="hasta" name="hasta"></select>');
        $.each( data, function( key, val ) {
            if (key == 'date'){
                for (var i = 0; i<val.length; i++){
                    $("#hasta").append('<option value="'+val[i]+'">'+val[i]+'</option>');
                }
            }
        });
        $("#algo").append('<form name="formul3"><label>Tipo: </label><select name="tipo"><option value="Line">Line</option><option value="Bar">Bar</option><option value="Radar">Radar</option></select></form><input type="button" onclick="selection()" value="OK"></input>');
    });
}
function selection() {
    var check = [];
    var color = [];
    $("#algo input[type='checkbox']:checked").each(function(){
        check.push($(this).attr('value'));
        color.push(document.getElementById('color'+$(this).attr('value')).value);
    })
    var valor = sacar(check);
    
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
                        +'<li>'
                        +'<span style=\"background-color:<%=datasets[i].fillColor%>\">'
                        +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %></span>'
                        +'</li>'
                        +'<% } %>'
                        +'</ul>'
    }
    var tipo = document.formul3.tipo.options[document.formul3.tipo.selectedIndex].value;
    $("#canvas").remove();
    $("#legend").html('');
    $(".canvas").html('<canvas id="canvas" height="450" width="600"></canvas>');
    if (tipo == 'Line'){
        var myChart = new Chart(document.getElementById("canvas").getContext("2d")).Line(Datas, options);
    }else if (tipo == 'Bar'){
        var myChart = new Chart(document.getElementById("canvas").getContext("2d")).Bar(Datas, options);
    }else if (tipo == 'Radar'){
        var myChart = new Chart(document.getElementById("canvas").getContext("2d")).Radar(Datas, options);
    }
    var legend = myChart.generateLegend();
    $("#legend").html(legend);
}
function sacar(check) {
    var desde = document.formul.desde.options[document.formul.desde.selectedIndex].value;
    var hasta = document.formul2.hasta.options[document.formul2.hasta.selectedIndex].value;
    var pos = [];
    var tiempo = [];
    var datos = [];
    var entrar = false;
    $.ajax({
        url: 'json/1fifoto-its-dom-evolutionary.json',
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
function prueba() {
  $.get("http://dashboard.eclipse.org/data/json/", function(data){
        $("#prueba").append(data);
    });
 
}
