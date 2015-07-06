	//AJAX eh uma ferramenta que facilita a troca de dados com o servidor
	//possui varias funcoes javascript...
	$.ajax({
		type: "GET",
		url: "/search",
		dataType: "json"
	}).done (function (data) {
		//carrega os dados "data" na tabela com id "thetable"
		console.log(data.length);

		$('#thetable  tbody tr').remove();
		var html = '';
		for(var i = 0; i < data.length; i++){
			console.log(data[i].tag);
            		html += '<tr><td>' + data[i].tag + '</td><td>' + data[i].p_ref +'</td><td>' + data[i].p_atm+'</td><td>' + data[i].temp + '</td><td>' + data[i].norma + '</td><td>' + data[i].data +'</td></tr>';
		}
		$('#thetable tbody').append(html);
        });

 

