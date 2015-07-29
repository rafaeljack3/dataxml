/*get_config_data: recebe as informacoes de configuracao do servido dado 
a unidade de operacao (op)
*/
var get_config_data = function(op){	
	//AJAX eh uma ferramenta que facilita a troca de dados com o servidor
	//possui varias funcoes javascript...
	$.ajax({
		type: "GET",
		url: "/search",
		dataType: "json",
	    data:{uep: op}
	}).done (function (data) {
		//carrega os dados "data" na tabela com id "thetable"
		$('#thetable  tbody tr').remove();
		var html = '';
		for(var i = 0; i < data.length; i++){
            		html += '<tr><td>' + data[i].tag + '</td><td>' + data[i].p_ref +'</td><td>' + data[i].p_atm+'</td><td>' + data[i].temp + '</td><td>' + data[i].norma + '</td><td>' + data[i].data +'</td></tr>';
		}
		$('#thetable tbody').append(html);
        });
}


/*get_config_data: recebe as informacoes de configuracao do servido dado 
a unidade de operacao (op)
*/
var get_prim_data = function(op){	
	//AJAX eh uma ferramenta que facilita a troca de dados com o servidor
	//possui varias funcoes javascript...
	$.ajax({
		type: "GET",
		url: "/prim_data",
		dataType: "json",
	    data:{uep: op}
	}).done (function (data) {
		//carrega os dados "data" na tabela com id "tb_prim"
		$('#tb_prim  tbody tr').remove();
		var html = '';
		for(var i = 0; i < data.tab.length; i++){
            		html += '<tr><td>' + data.tab[i].tag + '</td><td>' + data.tab[i].mf +'</td><td>' + data.tab[i].kf+'</td><td>'+ data.tab[i].curva + '</td><td>' + data.tab[i].co + '</td><td>' + data.tab[i].sn + '</td><td>' + data.tab[i].data +'</td></tr>';
		}
		$('#tb_prim tbody').append(html);
	    //grafico Meter factor
	    var chart = c3.generate({
		bindto: '#mf_chart',
		data: {
		    xFormat:'%d/%m/%Y',
		    json:data.g,
		    xs:data.xs,
		    type: 'spline'
		},
		axis:{
		    x:{
			type:'timeseries',
			tick:{
			    format:'%d/%m/%y'
			}
		    }
		}
	    }); 
	    //Tabela historica de meter factor/k-factor

		$('#tb_prim_hist  thead tr').remove();
		var html = '';
	        //grava o cabecalho
	        var max_len = get_max_len(data.hist);
	    
	        html = '<tr><th>Tag</th>';
 	        for(var i=0;i<max_len.mf;i++){
		    var count = i+1;
		    html+='<th>MF'+count +'</th>';
		    }
 	        for(var i=0;i<max_len.kf;i++){
		    var count = i+1;
		    html+='<th>KF'+count +'</th>';
		    }
	        html+='<th>Data</th></tr>';
		$('#tb_prim_hist thead').append(html);	    
	        //grave corpo
		$('#tb_prim_hist  tbody tr').remove();
	        html='';
		for(var i = 0; i < data.hist.length; i++){
            	    html += '<tr><td>' + data.hist[i].tag + '</td>';
		    for(var j=0;j<max_len.mf;j++){
			if(j<data.hist[i].mf.length)
			    html+='<td>'+data.hist[i].mf[j]+'</td>';
			else
			    html+='<td></td>';
			
		    }
		    for(var j=0;j<max_len.kf;j++){
			if(j<data.hist[i].kf.length)
			    html+='<td>'+data.hist[i].kf[j]+'</td>';
			else
			    html+='<td></td>';
			
		    }
		    html+='<td>'+data.hist[i].data+'</td></tr>';
		}
		$('#tb_prim_hist tbody').append(html);

        });
}

var get_max_len = function(hist){
    var max_len = {mf:0,kf:0};

    for(i=0;i<hist.length;i++){
	if( hist[i].mf.length > max_len.mf) max_len.mf = hist[i].mf.length;
	if( hist[i].kf.length > max_len.kf) max_len.kf = hist[i].kf.length;
    }
    return max_len;
}

var get_page_data=function(pg){
	console.log(pg);
	switch(pg){
		case "config.html":
			get_config_data(UEP_ID);//ID variavel GLOBAL
			break;
		case "prim.html":
			get_prim_data(UEP_ID);
			break;
		default:
    		console.log("Sorry, we are out of " + pg + ".");
	}
}
//=================================================================================

//carrega pagina inicial
$("#includePage").load("/public/pages/painel.html");

//id do unidade de producao
var UEP_ID = 'p57';//valor inicial
var PAGE = "painel.html";

//muda dado do titulo com id h1 Muda o nome da unidade de producao
$("#uep li").on("click",function(){                                                                                          
        $("#h1").text($(this).text());
	UEP_ID = $(this).children(":first").attr('id');//id do elemento clicado
	get_page_data(PAGE);                                                                               
    });

$("#side_menu li").on("click",function(){
	var path="/public/pages/";
	PAGE = $(this).first().children().attr('id');//id do elemento clicado
	$("#includePage").load(path.concat(PAGE));
	get_page_data(PAGE);
});



