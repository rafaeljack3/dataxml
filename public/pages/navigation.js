//sed 's/^.*$/&\\/g;' navigation.html > navigationB.html
document.write('<!-- Navigation -->\
<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">\
            <div class="navbar-header">\
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\
                    <span class="sr-only">Toggle navigation</span>\
                    <span class="icon-bar"></span>\
                    <span class="icon-bar"></span>\
                    <span class="icon-bar"></span>\
                </button>\
                <a class="navbar-brand" href="/">AuditMed</a>\
            </div>\
            <!-- /.navbar-header -->\
            <!-- /.navbar-header -->\
	<ul class="nav navbar-top-links navbar-right">\
		<li class="dropdown">  \
	<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Unidade de Produ&ccedil&atildeo <span class="caret"></span></a>\
          	<ul id="uep" class="dropdown-menu" role="menu">\
            		<li><a id="p57" href="#">FPSO P-57</a></li>\
            		<li><a id="cdan" href="#">FPSO Cidade Anchieta</a></li>\
            		<li><a id="capx" href="#">FPSO Capixaba</a></li>\
           	</ul></li>\
            <li><a href="#">Configura&ccedil&atildeo</a></li>\
            <li ><a href="#">Ajuda</a></li>\
		</ul>\
            <!-- /.navbar-top-links -->\
            <div class="navbar-default sidebar" role="navigation">\
                <div class="sidebar-nav navbar-collapse">\
                    <ul id="side_menu" class="nav" >\
			<li>\
                         <a> <b id="h1">FPSO P-57</b> </a>\
			</li>\
                        <li>\
                            <a id="painel.html" href="#"><i class="fa fa-dashboard fa-fw"></i> Painel</a>\
                        </li>\
                         <li>\
                            <a id="config.html" href="#"><i class="fa fa-table fa-fw"></i> Configura&ccedil&atildeo</a>\
                        </li>\
                        <li>\
                            <a href="#"><i class="fa fa-table fa-fw"></i> Produção</a>\
                        </li>\
                        <li>\
                            <a href="#"><i class="fa fa-edit fa-fw"></i>Propriedades &Oacuteleo/G&aacutes</a>\
                        </li>\
                        <li>\
                            <a id="prim.html" href="#"><i class="fa fa-edit fa-fw"></i>Medidor Prim&aacuterio</a>\
                        </li>\
                        <li>\
                            <a id="placa_trecho.html" href="#"><i class="fa fa-edit fa-fw"></i>Placa/Trecho</a>\
                        </li>\
                    </ul>\
                </div>\
                <!-- /.sidebar-collapse -->\
            </div>\
            <!-- /.navbar-static-side -->\
        </nav>\
');
