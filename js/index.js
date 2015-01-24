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
    json();
    
});
function json(){
    $.getJSON("json/smc1.json").success(function(data){
        $.each( data, function( key, val ) {
            $("#algo").append('<input type="checkbox" name="'+key+'" value="'+key+'">'+key+'<br>')
        });
        $("#algo").append('<input type="button" onclick="selection()" value="OK">');
    });
}
function selection() {
    var check = [];
    $("#algo input[type='checkbox']:checked").each(function(){
        check.push($(this).attr('value'));
    })
    var valor = sacar(check);
    var Datas = {
	    labels : valor[0],
	    datasets : [
		    {
			    fillColor : "rgba(220,220,220,0.5)",
			    strokeColor : "rgba(220,220,220,0.8)",
			    highlightFill: "rgba(220,220,220,0.75)",
			    highlightStroke: "rgba(220,220,220,1)",
			    data : valor[1]
		    }
        ]
    }
    var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Line(Datas, {
		responsive: true
	});
}
function sacar(check) {
    var pos = [];
    var tiempo = [];
    var dato1 = [];
    $.ajax({
        url: 'json/smc1.json',
        dataType: 'json',
        async: false,
        success: function(json){
            $.each( json, function( key, val ) {
                for (var j = 0; j < check.length; j++){
                    if (check[j] == key){
                        for (var i = 0; i < val.length; i++){
                            if (val[i] != 0){
                                pos.push(i);
                                dato1.push(val[i]);
                            }
                        }
                    }
                }
            });
            $.each( json, function ( key, val ){
                if ((key == 'date') && (pos.length>0)){
                    for(var i = 0; i < pos.length; i++){
                        tiempo.push(val[pos[i]]);
                    }
                }
            });
        }
    });
    return [tiempo, dato1];
}
