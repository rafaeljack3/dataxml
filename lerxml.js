#!/usr/bin/env node
/*
Este arquivo contem as funcoes que converte os arquivos xml em arquivos json
Entradas:arquivos xml do tipo 001,002,003 e 004
Saidas: arquivos JSON. Os arquivos de saidas sao
#cromatografia.json --> possui todos os historicos de mudancas de cromatografia
de cada ponto de medicao de gas da instalacao em questao.

#configuracao.json --> possui os dados historico de configuracao de cada ponto de
medicao

#producao.json --> dados de producao de cada ponto

#cromatogra



#primario.json

FORMATO DOS XML
<>
tipo
cnpj
aaaammddhhmmss 
003_33000167_20150112170442_10746.zip
*/
//variaveis globais
var fs = require('fs');
var util = require('util');
var xml2js = require('xml2js');
var mkdirp = require('mkdirp');
var CONFIG_CV_INDEX = [  //croma  inicio:6, fim: 27
"DHA_COLETA",
"MED_TEMPERATURA",
"MED_PRESSAO_ATMSA",
"MED_PRESSAO_RFRNA",
"MED_DENSIDADE_RELATIVA",
"DSC_NORMA_UTILIZADA_CALCULO",
"PCT_CROMATOGRAFIA_NITROGENIO",
"PCT_CROMATOGRAFIA_CO2",
"PCT_CROMATOGRAFIA_METANO",
"PCT_CROMATOGRAFIA_ETANO",
"PCT_CROMATOGRAFIA_PROPANO",
"PCT_CROMATOGRAFIA_N_BUTANO",
"PCT_CROMATOGRAFIA_I_BUTANO",
"PCT_CROMATOGRAFIA_N_PENTANO",
"PCT_CROMATOGRAFIA_I_PENTANO",
"PCT_CROMATOGRAFIA_HEXANO",
"PCT_CROMATOGRAFIA_HEPTANO",
"PCT_CROMATOGRAFIA_OCTANO",
"PCT_CROMATOGRAFIA_NONANO",
"PCT_CROMATOGRAFIA_DECANO",
"PCT_CROMATOGRAFIA_H2S",
"PCT_CROMATOGRAFIA_AGUA",
"PCT_CROMATOGRAFIA_HELIO",
"PCT_CROMATOGRAFIA_OXIGENIO",
"PCT_CROMATOGRAFIA_CO",
"PCT_CROMATOGRAFIA_HIDROGENIO",
"PCT_CROMATOGRAFIA_ARGONIO",
"DSC_VERSAO_SOFTWARE"];
data_prod_1 = {"data":'',"DENS_REL":'',"CPL":'',"CTL":'',"PRESSAO":'',"TEMPERATURA":'',"MED_BRUTO":'',"MED_CORR":''};
data_prod_2 = {"data":'',"DENS_REL":'',"PRESSAO":'',"TEMPERATURA":'',"MED_BRUTO":'',"MED_CORR":''};
data_prod_3 = {"data":'',"DENS_REL":'',"DIF_PRESSAO":'',"PRESSAO":'',"TEMPERATURA":'',"MED_CORR":''};
data_placa={"data":'',"DM_PLACA":'',"TMP_PLACA":'',"MAT_PLACA":'',"DM_TRECHO":'',"TMP_TRECHO":'',"MAT_TRECHO":'',"TOMADA":''};
var prim_json = {};
var crom_json = {};
var config_json = {};
var prod_json = {};
var placa_json = {};
//cria os arquivos na pasta json
var setup = function(){
    var path = __dirname +"/json";
    //cria diretorio ./json caso ele nao exista
    mkdirp.sync(path);
    if(!fs.existsSync(path+"/primario.json")){
	fs.writeFileSync(path+"/primario.json",'{"tag":[],"data":[]}');
    }
    if(!fs.existsSync(path+"/cromatografia.json")){
	fs.writeFileSync(path+"/cromatografia.json",'{"tag":[],"data":[]}');
    }
    if(!fs.existsSync(path+"/configuracao.json")){
	fs.writeFileSync(path+"/configuracao.json",'{"tag":[],"data":[]}');
    }
    if(!fs.existsSync(path+"/producao.json")){
	fs.writeFileSync(path+"/producao.json",'{"tag":[],"data":[]}');
    }
    if(!fs.existsSync(path+"/placa_trecho.json")){
	fs.writeFileSync(path+"/placa_trecho.json",'{"tag":[],"data":[]}');
    }

};

//ler a lista de arquivos de xml na pasta ~/dataxml/xml
var get_list = function(){
    var ll = fs.readdirSync(__dirname + "/xml/");
    return ll;
};

//abre os arquivos json
var load_json_files = function(){
    prim_json = fs.readFileSync(__dirname +"/json/primario.json");
    crom_json = fs.readFileSync(__dirname +"/json/cromatografia.json");
    config_json = fs.readFileSync(__dirname +"/json/configuracao.json");
    prod_json = fs.readFileSync(__dirname +"/json/producao.json");
    placa_json = fs.readFileSync(__dirname +"/json/placa_trecho.json");
};

var write_json_files = function(){
    fs.writeFileSync(__dirname +"/json/primario.json",prim_json);
    fs.writeFileSync(__dirname +"/json/cromatografia.json",crom_json);
    fs.writeFileSync(__dirname +"/json/configuracao.json",config_json);
    fs.writeFileSync(__dirname +"/json/producao.json",prod_json);
    fs.writeFileSync(__dirname +"/json/placa_trecho.json",placa_json);
}
//----------------------------------------------------------------------
/*proc_xml_1: essa funcao ler os arquivos xml do tipo 1 do diretorio
indicado e salva as informacoes nos arquivos JSON correspondente.
*/
var proc_xml_1 = function(file){
    var parser = new xml2js.Parser({trim:true,childkey:9,explicitArray:false,explicitChildren:false,attrkey:'P'});
    var path = __dirname +"/xml/"+ file;
    //ler arquivo xml tipo 1
    
    var data = fs.readFileSync(path);
    parser.parseString(data,cbParseString1);
    
};

function cbParseString1(err,result){
    if(err){console.error('ERROR: erro ao usar parseString no arquivo +' +path);}

    var file = {};
    var list = result.a001.LISTA_DADOS_BASICOS.DADOS_BASICOS;
    if(list.length === undefined){
	var v = [];
	v.push(list);
	list = v;
    }

    for(var i=0; i< list.length;i++){
	var tag = list[i].P.COD_TAG_PONTO_MEDICAO;

	//processa arquivo primario.json
	file = JSON.parse(prim_json);
	var index = get_index_tag(file,tag);
	var datap ={"data":'',"MF":'',"KF":'',"CUTOFF":'',"SN":''};
	var str = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.DHA_COLETA;
	var arr = str.split(' ');
	datap.data = arr[0];
	datap.MF = list[i].LISTA_ELEMENTO_PRIMARIO.ELEMENTO_PRIMARIO.ICE_METER_FACTOR_1;
	datap.KF = list[i].LISTA_ELEMENTO_PRIMARIO.ELEMENTO_PRIMARIO.ICE_K_FACTOR_1;
	datap.CUTOFF = list[i].LISTA_ELEMENTO_PRIMARIO.ELEMENTO_PRIMARIO.ICE_CUTOFF;
	datap.KF = datap.KF.replace(/^0+/, '');//alguns KF esta vindo com zero a esquerda
	datap.CUTOFF = datap.CUTOFF.replace(/000000/, '0');//tira zero a esquerda
	push_data_file(file,datap,index);
	prim_json = JSON.stringify(file,null,2);

	//processa arquivo configuracao.json
	file = JSON.parse(config_json);
	index = get_index_tag(file,tag);
	datap =  {"data":'',"TEMP_REF":'',"PRESS_REF":'',"PRESS_ATM":'',"NORMA_CALC":''};
	datap.data = arr[0];
	datap.TEMP_REF = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.MED_TEMPERATURA;
	datap.PRESS_REF = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.MED_PRESSAO_RFRNA;
	datap.PRESS_ATM = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.MED_PRESSAO_ATMSA;
	datap.TEMP_REF = datap.TEMP_REF.replace(/^0+/,'');
	push_config_file(file,datap,index);
	config_json = JSON.stringify(file,null,2);

	//processa arquivo producao.json
	file = JSON.parse(prod_json);
	index = get_index_tag(file,tag);
	datap = data_prod_1;
	datap.data = arr[0];
	datap.DENS_REL = list[i].LISTA_PRODUCAO.PRODUCAO.ICE_DENSIDADE_RELATIVA;
	datap.CPL = list[i].LISTA_PRODUCAO.PRODUCAO.ICE_CORRECAO_PRESSAO_LIQUIDO;
	datap.CTL = list[i].LISTA_PRODUCAO.PRODUCAO.ICE_CRRCO_TEMPERATURA_LIQUIDO;
	datap.PRESSAO = list[i].LISTA_PRODUCAO.PRODUCAO.MED_PRESSAO_ESTATICA;
	datap.TEMPERATURA = list[i].LISTA_PRODUCAO.PRODUCAO.MED_TMPTA_FLUIDO;
	datap.MED_BRUTO = list[i].LISTA_PRODUCAO.PRODUCAO.MED_VOLUME_BRUTO_MVMDO;
	datap.MED_CORR = list[i].LISTA_PRODUCAO.PRODUCAO.MED_VOLUME_LIQUIDO_MVMDO;
	push_prod_file(file,datap,index);
	prod_json = JSON.stringify(file,null,2);
    }
};
//----------------------------------------------------------------------


/*proc_xml_2: essa funcao ler os arquivos xml do tipo 2 diretorio
indicado e transforma em JSON, salvando em seguida nos arquivos 
json correspondentes
*/
var proc_xml_2 = function(file){
    var parser = new xml2js.Parser({trim:true,childkey:9,explicitArray:false,explicitChildren:false,attrkey:'P'});
    var path = __dirname +"/xml/"+ file;
    //ler arquivo xml tipo 2
    
    var data = fs.readFileSync(path);
    parser.parseString(data,cbParseString2);
};

function cbParseString2(err, result){
    if(err){console.error('ERROR: erro ao usar parseString no arquivo +' +path);}

    var file = {};
    var list = result.a002.LISTA_DADOS_BASICOS.DADOS_BASICOS;
    if(list.length === undefined){
	var v = [];
	v.push(list);
	list = v;
    }

    //ITERAR PARA TODOS DADOS BASICOS
    for(var i = 0; i< list.length;i++){

	var tag = list[i].P.COD_TAG_PONTO_MEDICAO;
	//processa arquivo primario.json
	file = JSON.parse(prim_json);

	//1) pegar o index correspondente a TAG, se nao tiver a tag ela eh add.
	var index = get_index_tag(file,tag);
	//2) add dado no file
	var datap ={"data":'',"MF":'',"KF":'',"CUTOFF":'',"SN":''};
	var str = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.DHA_COLETA;
	var arr = str.split(' ');
	datap.data = arr[0];
	datap.MF = list[i].LISTA_ELEMENTO_PRIMARIO.ELEMENTO_PRIMARIO.ICE_METER_FACTOR_1;
	datap.KF = list[i].LISTA_ELEMENTO_PRIMARIO.ELEMENTO_PRIMARIO.ICE_K_FACTOR_1;
	datap.CUTOFF = list[i].LISTA_ELEMENTO_PRIMARIO.ELEMENTO_PRIMARIO.ICE_CUTOFF;
	datap.SN = list[i].P.NUM_SERIE_ELEMENTO_PRIMARIO;
	datap.KF = datap.KF.replace(/^0+/, '');//alguns KF esta vindo com zero a esquerda
	datap.CUTOFF = datap.CUTOFF.replace(/000000/, '0');//tira zero a esquerda
	push_data_file(file,datap,index);
	prim_json = JSON.stringify(file,null,2);

	//processa arquivo cromatografia.json
	file = JSON.parse(crom_json);
	index = get_index_tag(file,tag);
	datap = {"data":''};
	datap.data = arr[0];

	for(var y = 6; y<27;++y){
	    datap[CONFIG_CV_INDEX[y]] = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV[CONFIG_CV_INDEX[y]];
	}
	push_crom_file(file,datap,index);
	crom_json = JSON.stringify(file,null,2);

	//processa arquivo configuracao.json
	file = JSON.parse(config_json);
	index = get_index_tag(file,tag);
	datap =  {"data":'',"TEMP_REF":'',"PRESS_REF":'',"PRESS_ATM":'',"NORMA_CALC":''};
	datap.data = arr[0];
	datap.TEMP_REF = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.MED_TEMPERATURA;
	datap.PRESS_REF = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.MED_PRESSAO_RFRNA;
	datap.PRESS_ATM = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.MED_PRESSAO_ATMSA;
	datap.NORMA_CALC = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.DSC_NORMA_UTILIZADA_CALCULO;
	datap.TEMP_REF = datap.TEMP_REF.replace(/^0+/,'');
	push_config_file(file,datap,index);
	config_json = JSON.stringify(file,null,2);
	
	//processa arquivo producao.json
	file = JSON.parse(prod_json);
	index = get_index_tag(file,tag);
	datap = data_prod_2;
	datap.data = arr[0];
	datap.DENS_REL = list[i].LISTA_PRODUCAO.PRODUCAO.ICE_DENSIDADE_RELATIVA;
	datap.PRESSAO = list[i].LISTA_PRODUCAO.PRODUCAO.MED_PRESSAO_ESTATICA;
	datap.TEMPERATURA = list[i].LISTA_PRODUCAO.PRODUCAO.MED_TEMPERATURA;
	datap.MED_BRUTO = list[i].LISTA_PRODUCAO.PRODUCAO.MED_BRUTO_MOVIMENTADO;
	datap.MED_CORR = list[i].LISTA_PRODUCAO.PRODUCAO.MED_CORRIGIDO_MVMDO;

	push_prod_file(file,datap,index);
	prod_json = JSON.stringify(file,null,2);
    }	
};
//-------------------------------------------------------------------------------

/*proc_xml_3: essa funcao ler os arquivos xml do tipo 3 diretorio
indicado e transforma em JSON, salvando em seguida nos arquivos 
json correspondentes
*/
var proc_xml_3 = function(file){
    var parser = new xml2js.Parser({trim:true,childkey:9,explicitArray:false,explicitChildren:false,attrkey:'P'});
    var path = __dirname +"/xml/"+ file;
    //ler arquivo xml tipo 2
    
    var data = fs.readFileSync(path);
    parser.parseString(data,cbParseString3);
};

function cbParseString3(err, result){
    if(err){console.error('ERROR: erro ao usar parseString no arquivo +' +path);}

    var file = {};
    var list = result.a003.LISTA_DADOS_BASICOS.DADOS_BASICOS;
    if(list.length === undefined){
	var v = [];
	v.push(list);
	list = v;
    }

    //ITERAR PARA TODOS DADOS BASICOS
    for(var i = 0; i< list.length;i++){
	var tag = list[i].P.COD_TAG_PONTO_MEDICAO;

	//processa xml placa_trecho.json
	file = JSON.parse(placa_json);
	var index = get_index_tag(file,tag);
	var datap = data_placa;
	var str = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.DHA_COLETA;
	var arr = str.split(' ');
	datap.data = arr[0];
	datap.DM_PLACA = list[i].LISTA_PLACA_ORIFICIO.PLACA_ORIFICIO.MED_DIAMETRO_REFERENCIA;
	datap.DM_PLACA = datap.DM_PLACA.replace(/^0+/,'');
	datap.TMP_PLACA = list[i].LISTA_PLACA_ORIFICIO.PLACA_ORIFICIO.MED_TEMPERATURA_RFRNA;
	datap.TMP_PLACA = datap.TMP_PLACA.replace(/^0+/,'');	
	datap.MAT_PLACA = list[i].LISTA_PLACA_ORIFICIO.PLACA_ORIFICIO.DSC_MATERIAL_CONTRUCAO_PLACA;
	datap.DM_TRECHO = list[i].LISTA_PLACA_ORIFICIO.PLACA_ORIFICIO.MED_DMTRO_INTRO_TRCHO_MDCO;
	datap.DM_TRECHO = datap.DM_TRECHO.replace(/^0+/,'');
	datap.TMP_TRECHO = list[i].LISTA_PLACA_ORIFICIO.PLACA_ORIFICIO.MED_TMPTA_TRCHO_MDCO;
	datap.TMP_TRECHO = datap.TMP_TRECHO.replace(/^0+/,'');
	datap.MAT_TRECHO = list[i].LISTA_PLACA_ORIFICIO.PLACA_ORIFICIO.DSC_MATERIAL_CNSTO_TRCHO_MDCO;
	datap.TOMADA = list[i].LISTA_PLACA_ORIFICIO.PLACA_ORIFICIO.IND_TOMADA_PRESSAO_ESTATICA;
	push_placa_file(file,datap,index);
	placa_json = JSON.stringify(file,null,2);

	//processa arquivo cromatografia.json
	file = JSON.parse(crom_json);
	index = get_index_tag(file,tag);
	datap = {"data":''};
	datap.data = arr[0];

	for(var y = 6; y<27;++y){
	    datap[CONFIG_CV_INDEX[y]] = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV[CONFIG_CV_INDEX[y]];
	}
	push_crom_file(file,datap,index);
	crom_json = JSON.stringify(file,null,2);

	//processa arquivo configuracao.json
	file = JSON.parse(config_json);
	index = get_index_tag(file,tag);
	datap =  {"data":'',"TEMP_REF":'',"PRESS_REF":'',"PRESS_ATM":'',"NORMA_CALC":''};
	datap.data = arr[0];
	datap.TEMP_REF = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.MED_TEMPERATURA;
	datap.PRESS_REF = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.MED_PRESSAO_RFRNA;
	datap.PRESS_ATM = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.MED_PRESSAO_ATMSA;
	datap.NORMA_CALC = list[i].LISTA_CONFIGURACAO_CV.CONFIGURACAO_CV.DSC_NORMA_UTILIZADA_CALCULO;
	datap.TEMP_REF = datap.TEMP_REF.replace(/^0+/,'');
	push_config_file(file,datap,index);
	config_json = JSON.stringify(file,null,2);

	//processa arquivo producao.json
	file = JSON.parse(prod_json);
	index = get_index_tag(file,tag);
	datap = data_prod_3;
	datap.data = arr[0];
	datap.DENS_REL = list[i].LISTA_PRODUCAO.PRODUCAO.ICE_DENSIDADE_RELATIVA;
	datap.DIF_PRESSAO = list[i].LISTA_PRODUCAO.PRODUCAO.MED_DIFERENCIAL_PRESSAO;
	datap.PRESSAO = list[i].LISTA_PRODUCAO.PRODUCAO.MED_PRESSAO_ESTATICA;
	datap.TEMPERATURA = list[i].LISTA_PRODUCAO.PRODUCAO.MED_TEMPERATURA;
	datap.MED_CORR = list[i].LISTA_PRODUCAO.PRODUCAO.MED_CORRIGIDO_MVMDO;

	push_prod_file(file,datap,index);
	prod_json = JSON.stringify(file,null,2);
	
    }
};

//-----------------------------------------------------------------------------------
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

/*
compara duas datas no formato dd/mm/aaaa
data1 > data 2  -> 1
data1 < data 2  -> -1
data1 == data 2 -> 0
*/
var comp_data = function(data1,data2){
    var d1 = data1.split('/');
    var d2 = data2.split('/');
    
    if( d1[2] > d2[2]) {return 1;}
    if(d1[2] < d2[2]) {return -1;}
    if(d1[1] > d2[1]) {return 1;}
    if(d1[1] < d2[1]) {return -1;}

    if(d1[0] > d2[0]) {return 1;}
    if(d1[0] < d2[0]) {return -1;}

    return 0;
};
/*adiciona data {data,mf,kf} ao vetor de dados 'data'
  vale ressaltar que soh adciona o vetor caso haja alguma
mudanca no kf e mf*/
var push_data_file = function(file,data,index){
    var LEN = file.data.length;
    var arr = [];
    
    //vetor de dados esta vazio ainda OU
    //se o dado adcionado corresponde a uma nova tag
    if(LEN == 0 || index == LEN){
	arr.push(data);
	file.data.push(arr);
	return;
    }
    //verifica se teve mudanca de MF ou KF
    //caso tenha, add data.
    arr = file.data[index];
    var arr_len = arr.length;

    if(comp_data( arr[arr_len-1].data , data.data) == 1){
	return;}

    if(arr[arr_len-1].MF === data.MF && arr[arr_len-1].KF === data.KF && arr[arr_len-1].CUTOFF === data.CUTOFF && arr[arr_len-1].SN === data.SN){
	return;
    }
    file.data[index].push(data);

};

/*
push_crom_file: insere cromatografia no arquivo file caso tenha
ocorrido mudanca na mesma.  
*/
var push_crom_file = function(file,data,index){
    var LEN = file.data.length;
    var arr = [];
    
    //vetor de dados esta vazio ainda OU
    //se o dado adcionado corresponde a uma nova tag
    if(LEN == 0 || index == LEN){
	//verifica se a porcentagem de nitrogenio esta indefinida
	//se estiver, considera cromatografia invalida
	if(data[CONFIG_CV_INDEX[6]] === undefined) { return false;}	
	arr.push(data);
	file.data.push(arr);
	return;
    }
    //verifica se teve mudanca na cromatografia
    //caso tenha, add data.
    arr = file.data[index];
    var arr_len = arr.length;
    //verifica se data da cromatografia eh anterior a data
    //da cromatografia jah inserida no file
    if(comp_data( arr[arr_len-1].data , data.data) == 1){
	return;}

    if(update_cromo(arr[arr_len-1],data)){
	file.data[index].push(data);
    }


};
var update_cromo = function(data1,data2){
	if(data2[CONFIG_CV_INDEX[6]] === undefined) { return false;}
    for(var i=6;i<27;++i){

	if(data1[CONFIG_CV_INDEX[i]]!=data2[CONFIG_CV_INDEX[i]]){ return true;}
    }
    return false;
};

var push_config_file = function(file,data, index){
    var LEN = file.data.length;
    var arr = [];
    var prop = ["TEMP_REF","PRESS_REF","PRESS_ATM","NORMA_CALC"];
    //vetor de dados esta vazio ainda OU
    //se o dado adcionado corresponde a uma nova tag
    if(LEN == 0 || index == LEN){
	for(var i=0;i<prop.length;++i){
	    if(data[prop[i]] === undefined) data[prop[i]] = "";
	}
	arr.push(data);
	file.data.push(arr);
	return;
    }
    //verifica se teve mudanca na configuracao
    //caso tenha, add data.
    arr = file.data[index];
    var arr_len = arr.length;

    if(comp_data( arr[arr_len-1].data , data.data) == 1){
	return;}

    for(var i = 0;i<prop.length;i++){
	if(arr[arr_len-1][prop[i]]!==data[prop[i]]){
	    file.data[index].push(data);
	    return;
	}
    }
    
};

/*add os dados de producao no arquivo producao.json
naoeh feito nenhuma comparacao jah que os dados
de producao mudam diariamente
*/
var push_prod_file = function(file,data,index){
    var LEN = file.data.length;
    var arr = [];

    //vetor de dados esta vazio ainda OU
    //se o dado adcionado corresponde a uma nova tag
    if(LEN == 0 || index == LEN){
	arr.push(data);
	file.data.push(arr);
	return;
    }
    arr = file.data[index];

    var arr_len = arr.length;
    if(comp_data( arr[arr_len-1].data , data.data) == 1){ return;}

    file.data[index].push(data);
};


var push_placa_file = function(file,data, index){
    var LEN = file.data.length;
    var arr = [];
    var prop =["DM_PLACA","TMP_PLACA","MAT_PLACA","DM_TRECHO","TMP_TRECHO","MAT_TRECHO","TOMADA"];

    //vetor de dados esta vazio ainda OU
    //se o dado adcionado corresponde a uma nova tag
    if(LEN == 0 || index == LEN){
	for(var i=0;i<prop.length;++i){
	    if(data[prop[i]] === undefined) data[prop[i]] = "";
	}
	arr.push(data);
	file.data.push(arr);
	return;
    }
    //verifica se teve mudanca na configuracao
    //caso tenha, add data.
    arr = file.data[index];
    var arr_len = arr.length;

    if(comp_data( arr[arr_len-1].data , data.data) == 1){
	return;}

    for(var i = 0;i<prop.length;i++){
	if(arr[arr_len-1][prop[i]]!==data[prop[i]]){
	    file.data[index].push(data);
	    return;
	}
    }
    
};

//-----------------------------------------------------------


//setup: cria os arquivos json caso eles nao existam 
setup();
//processa os arquivos xml
var list = get_list();//lista dos nomes dos arquivos xml
load_json_files();


for(var ii in list){
    var file = list[ii];

    switch(file[2]){
	case '1':
	//processa xml tipo 1
	proc_xml_1(file);
	break;
	case '2':
	//processa xml tipo 2
	proc_xml_2(file);
	break;
	case '3':
	//processa xml tipo 3
	proc_xml_3(file);
	break
	case '4':
	//processa xml tipo 4
	break;
	default:
	console.error('ERROR: nome de arquivo inconsistente. Nome: ' + file);
    };
};
write_json_files();


