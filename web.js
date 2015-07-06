// Define routes for simple SSJS web app. 
var express = require('express')
   , fs      = require('fs'),
path = require('path');

var app = express();
app.set('port', process.env.PORT || 8080);

//deixa disponivel todos os arquivos publicos,css,js e pages
app.use('/public',express.static(__dirname+'/public'));

// Render homepage (note trailing slash): example.com/
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/public/pages/index.html'));
});

app.get('/painel', function(request, response) {
    var data = fs.readFileSync('./public/pages/painel.html').toString();
    response.send(data);
});

app.get('/configuracao', function(request, response) {
    var data = fs.readFileSync('./public/pages/config.html').toString();
    response.send(data);
});

app.get('/search',function(req,resp){
//CARREGAR ARQUIVO JSON AQUI!
    var data = {};
    var config_json = {};
    config_json = fs.readFileSync(__dirname +"/json/configuracao.json"); 
    json_file = JSON.parse(config_json);
    var LEN = json_file.tag.length;

    var tab=JSON.parse('{ "d" : []}');
    var d = [];
    var datap = {tag: '', p_ref: '',p_atm: '',temp: '',norma: '',data:''}; 

    for(var i=0;i<LEN;i++){
	var dlen = json_file.data[i].length;
	datap.tag = json_file.tag[i];
	datap.p_ref = json_file.data[i][dlen-1].PRESS_REF;
	datap.p_atm = json_file.data[i][dlen-1].PRESS_ATM;
	datap.temp = json_file.data[i][dlen-1].TEMP_REF;
	datap.norma = json_file.data[i][dlen-1].NORMA_CALC;
	datap.data = json_file.data[i][dlen-1].data;
	d.push(datap);
	datap = {tag: '', p_ref: '',p_atm: '',temp: '',norma: '',data:''}; 

    }

resp.send(d);

});

var get_index_tag = function(file,tag){
    var LEN = file.tag.length
    var i = 0;
    if(LEN == 0){
        file.tag.push(tag);
        return 0;
    }
    while(i<LEN){
        if(tag == file.tag[i]){ return i;}
        i+=1;
    }
    file.tag.push(tag);
    return LEN;
};



app.listen(app.get('port'), function() {                                                                                        console.log("Node app is running at localhost:" + app.get('port'))                                                             
})

