typ=0;
status = ""
kml_URL = "airportboundry.kml";
xmlHTTP = null;

function ajaxinit(){
	xmlHTTP=null;
	try{xmlHTTP=new XMLHttpRequest();}
	catch (e){try{xmlHTTP=new ActiveXObject("Msxml2.XMLHTTP");}
	catch (e){xmlHTTP=new ActiveXObject("Microsoft.XMLHTTP");}}
	return xmlHTTP;
}

function stateChanged(){
	if(xmlHTTP.readyState==4){
		if(typ==0){
		    //alert(xmlHTTP.responseText);
		    status = " ajax loaded ";
		    //send event here
		    //im_ready();
		    xml_done();
		}
	}
	if(xmlHTTP.readyState==1 || xmlHTTP.readyState==2){
		
	}
}

function ajax(type,arg1,arg2,arg3){
	var url;
	typ=type;
	switch(typ){
	    case 0:
	    url = kml_URL;
	    break;
	}
	xmlHTTP=ajaxinit();
	xmlHTTP.onreadystatechange=stateChanged;
	xmlHTTP.open("GET",url,true);
	xmlHTTP.send(null);
}
