// Define routes for simple SSJS web app. 
var express = require('express')
   , fs      = require('fs'),
path = require('path');

var uep =["p57","cdan","capx"] 
var app = express();
app.set('port', process.env.PORT || 8080);

//deixa disponivel todos os arquivos publicos,css,js e pages
app.use('/public',express.static(__dirname+'/public'));

// Render homepage (note trailing slash): example.com/
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/public/pages/index.html'));
});

app.get('/principal', function(request, response) {
    var data = fs.readFileSync('./public/pages/principal.html').toString();
    response.send(data);
});

app.get('/search',function(req,resp){
    var data = {};
    var config_json = {};
    //req.query.uep --> nome da plataforma
    config_json = fs.readFileSync(__dirname +"/json/" + req.query.uep +"/configuracao.json"); 
    json_file = JSON.parse(config_json);
    var LEN = json_file.tag.length;

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


app.get('/prim_data',function(req,resp){
    var data = {};
    var prim_json = {};
    //req.query.uep --> nome da plataforma
    prim_json = fs.readFileSync(__dirname +"/json/" + req.query.uep +"/primario.json"); 
    json_file = JSON.parse(prim_json);
    var LEN = json_file.tag.length;
    var datasend = {tab:[],g:{},xs:{},hist:[]};
    var d = [];
    var hist_tab = [];//tabela com todo historico de mudanca
    var datap = {tag: '', mf: 0,kf: 0,co: 0,curva:'',sn: '',data:''};     

    for(var i=0;i<LEN;i++){
	//dados para geracao da tabela principal
	var dlen = json_file.data[i].length;
	datap.tag = json_file.tag[i];
	var mf_kf = mean_calc(json_file.data[i][dlen-1].MF)
	datap.mf = mf_kf.mean;
	datap.curva = mf_kf.curva;
	mf_kf = mean_calc(json_file.data[i][dlen-1].KF)
	datap.kf =mf_kf.mean
	if(datap.curva!='sim')
	    datap.curva = mf_kf.curva;
	datap.co = json_file.data[i][dlen-1].CUTOFF;
	datap.sn = json_file.data[i][dlen-1].SN;
	datap.data = json_file.data[i][dlen-1].data;
	d.push(datap);
	datap = {tag: '', mf: 0,kf: 0,co: 0,curva:'',sn: '',data:''};     

	//dados para geracao do grafico
	//tag:[mfs](dados),xi:[datas](dados do eixo x
	//tag:xi - relaciona serie de dados com a serie x
	var g = get_MF(i,json_file);//{data,mf}
	var str = "x";
	str = str.concat(i);
	datasend.g[json_file.tag[i]] = g.mf;
	datasend.g[str] = g.data;
	datasend.xs[json_file.tag[i]] = str;

	//dados para geracao da tabela historica
	var dd = get_data_tab(i,json_file);
	hist_tab = hist_tab.concat(dd);

    }
    datasend.tab = d;

    datasend.hist = hist_tab;
    resp.send(datasend);
});

//historico de MF por TAG. ALERTA: apenas MEDIA POR ENQUANTO DE MF
var get_MF = function(index,json_file){
    var dlen = json_file.data[index].length;
    var mf = [];
    var data = [];
    var g = {};
    for(var i=0;i<dlen;++i){
	var s = mean_calc(json_file.data[index][i].MF);
	mf.push(s.mean);
	data.push(json_file.data[index][i].data);
    }
    g.data = data;
    g.mf = mf;
    return g;
}

var get_data_tab = function(index,json_file){
    var dlen = json_file.data[index].length;
    var datap = {tag: '', mf: [],kf: [],data:''};     
    var v= [];
    for(var i=0;i<dlen;++i){
	datap.tag = json_file.tag[index];
	datap.mf = json_file.data[index][i].MF;
	datap.kf = json_file.data[index][i].KF;
	datap.data = json_file.data[index][i].data;
	v.push(datap);
	datap = {tag: '', mf: [],kf: [],data:''};     
    }
    return v;
}
//dado os valores de mf e kf( data.mf,data.kf)
//processa a media e retorna os valores medios mf e kf ( se tiver curva)
var mean_calc = function(arr){
    var ret= {mean:0,curva:''};
    ret.mean = 0;
    ret.curva = 'nao';
    if(arr.length==1){
	ret.mean = arr[0];
    }else{
	if(arr.length >1){
	    arr.curva = 'sim';
	    var m = 0;
	    for(var i=0;i<arr.length;i++)
		m+=arr[i]
	    ret.mean = m/arr.length;
	}
    }
    return ret;

}
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

