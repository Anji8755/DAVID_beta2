$(function(){
        var currentPath = window.location.pathname ;
        var userData={};
        var test=""
        userData.conn={};
        userData.mergedConn={};
        userData.mergeCount = 0;
        userData.dataCount =0;
        //(userData.mergedConn[userData.mergeCount]).selectedMergeList=[];
        console.log(currentPath);
        if (currentPath =="/viz/dash"){
            show(["loading"]);
            if(getCookie("userId")){
                loginUser();
                userData =JSON.parse(getCookie("userdata"));
                console.log('userData is')
                console.log(userData)
                userData.uid =(getCookie("userId"));
                //setCookie("userdata","",0);
                setTimeout(function(){
                    togglePopup(true);
                    ($("#user")[0]).innerHTML = userData.uid || "User Data Unavailable";
                },2500);
            }
            else{
                alert("Please login first ");
                window.location.pathname = "/viz/login";
            }
            window.addEventListener('load', function () {
                hide(["loading"]);
                },
            false);
        }
        else if(currentPath=="/viz/login"){
            if(getCookie("userId")){
                loginUser();
            }
            else{
                console.log("Event listener added ");
                setTimeout(function(){
                    document.getElementById("test").addEventListener("click",function(){
                       hitapi();
                    });
                    document.getElementById("submit").addEventListener("click", function(){
                        var xhttp = new XMLHttpRequest();
                        var uid = document.getElementById("userid").value;
                        var pwd = document.getElementById("pwd").value;
                        setTimeout(function(){show(["loading"]);hide(["particles-js","login_container"]);},0);
                        xhttp.open("GET", "http://pysap.pythonanywhere.com/viz/login_get_data/"+uid+"/", false);
                        //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        //xhttp.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        xhttp.send();
                        console.log(xhttp.responseText);
                        if(xhttp.responseText && JSON.parse(xhttp.responseText).pwd == pwd){
                            console.log(xhttp.responseText);
                            hide(["loading"]);
                            setCookie("userId",uid,15); /*-----------------------15mins expiry time ---------------------------------------*/
                            getDomainTableData(JSON.parse(xhttp.responseText).domainTabs);
                            window.location.pathname="/viz/dash";
                        }
                        else{
                            alert("Wrong username password combination");
                            show(["login_container"]);
                            hide(["loading"]);
                        }
                                }
                        )
                },3000);
            }
        }
        else{
            console.log("Undefined Path in Javascript !");
        }
        /*
                      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML =
            this.getAllResponseHeaders();
          }
        };
        */
        function createLink(data){
            data = data.split(",");
            var urlData ="";
            for (i=0;i<data.length;i++){
                urlData=urlData+"-"+(data[i]).trim();
            }
            console.log(urlData);
            return urlData.slice(1);

        }
        function getDomainTableData(domain){
            var xhttp = new XMLHttpRequest();

            xhttp.open("GET", "http://pysap.pythonanywhere.com/viz/getDomainData/"+domain+"/", false);
                        //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        //xhttp.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            xhttp.send();
            console.log(xhttp.responseText);
            domainTabs = createLink((JSON.parse(xhttp.responseText)).domainTabs);
            console.log(domainTabs);
            userData.domain=domain;
            userData.domainTabs = domainTabs;
            userData.domainTabs.split("-")
            //var tabDet = (userData.domainTabs).split("-");
            console.log('usertables are')
            console.log(userData.domainTabs.split("-"));
            xhttp.open("GET", "http://pysap.pythonanywhere.com/viz/getTabData/"+domainTabs+"/", false);
                        //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        //xhttp.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            xhttp.send();
            console.log(xhttp.responseText);
            tabData = (JSON.parse(xhttp.responseText));
            //dtyp = (JSON.parse(xhttp.responseText));
            console.log('datatype is here')
            console.log(tabData)
            //JSON.parse(tabData["ZTIL_2type"]).type

//getDomainTableData(JSON.parse(xhttp.responseText).domainTabs);
            /*for(var i =0;i< tabDet.length;i++){
                //var block ="<div class='table "+tables[i]+"'>"+tables[i]+"</div>"
                //$(".container .left-panel").append($(block));
                console.log(i)
                JSON.parse(tabData[tabDet[i]+"type"]).type
            }*/



            userData.tabData = tabData;
            setCookie("userdata",JSON.stringify(userData),1);
                        //console.log(xhttp.responseText);

        }

        /* ---------------------------- Function for cookies --------------------------------------------*/
        function setCookie(cname,cvalue,exmins) {
          var d = new Date();
          d.setTime(d.getTime() + (exmins*60*1000));
          var expires = "expires=" + d.toGMTString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
        function hide(eleArr){
            for(var i=0;i<eleArr.length;i++){
               document.getElementById(eleArr[i]) && document.getElementById(eleArr[i]).classList.add("hidden");
            }
        }
        function show(eleArr){
            for(var i=0;i<eleArr.length;i++){
                document.getElementById(eleArr[i]) && document.getElementById(eleArr[i]).classList.remove("hidden");
            }
        }
        function getCookie(cname) {
          var name = cname + "=";
          var decodedCookie = decodeURIComponent(document.cookie);
          var ca = decodedCookie.split(';');
          for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
              c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
            }
          }
          return "";
        }

        function checkCookie() {
          var user=getCookie("username");
          if (user != "") {
            alert("Welcome again " + user);
          } else {
             user = prompt("Please enter your name:","");
             if (user != "" && user != null) {
               setCookie("username", user, 30);
             }
          }
        }

        /* -----------------------------------------Code end for Cookies --------------------------------------------------------------*/
        /*function appendConnectionHTML(parentId){
        parentElem = parentId?document.getElementsByClassNames(parentId)[0]:document.getElementsClassNames("fixed_header")[0];
        htmlString = '<input type="text" value'
        parentElem.
        }*/
/* changes by arghya*/
        function populatePopup(selector,data,id,secondary){
            var layoutString = "<div class='container'><div class='left-panel'></div><div class='right-panel'><div class='add-data-panel'><h4>ADD</h4><div class='dropzone'></div></div><div class='merge-data-panel'><h4>MERGE</h4><div class='dropzone'></div></div></div></div>"
            //var doc = new DOMParser().parseFromString(layoutString, "text/xml");
            console.log($(layoutString));
            !((($("#layover_popup")).find(".container")).length) &&  $("#layover_popup").append($(layoutString));
            var tables = (data.domainTabs).split("-");
            for(var i =0;i< tables.length;i++){
                var block ="<div class='table "+tables[i]+"'>"+tables[i]+"</div>"
                $(".container .left-panel").append($(block));
            }

            ($(".container .left-panel .table")).draggable({helper:"clone",cursor: "pointer"});
             ($( ".container .right-panel .add-data-panel .dropzone" )).droppable({
            drop: function( event, ui ) {
                (($( this )).addClass( "ui-state-highlight" ));
                var dropObj = ui.draggable[0];
                ($(event.target)[0]).append(dropObj);
                selectXY(dropObj.innerHTML);
                (dropObj).data = userData.dataCount;
                $(dropObj).on("click",function(){editModal(dropObj);});
                userData.conn[userData.dataCount++]={"table" : dropObj.innerHTML,"x":"","y":"","tableId" : "table"+userData.dataCount,"graphId":"graph"+userData.dataCount,"graph":"bar"};
                console.log(data);
                console.log(event);
                console.log(ui);
                $(this).innerHTML="dropped";
                $(".left-panel").append($("<div class='table'>"+dropObj.innerHTML+"</div>"));
                ($(".container .left-panel .table")).draggable({helper:"clone",cursor: "pointer"});
      }
    });

    /* for merge */


        }

    function checkType(connProps,newProps){
        var isMatch = false;
            var dtype = JSON.parse(userData.tabData[newProps.table+"type"]).type;
            console.log(dtype);
            var columns =Object.keys(JSON.parse(userData.tabData[newProps.table]));
            if (dtype[columns.indexOf(connProps.x)] != "TEXT"){
                isMatch = (dtype[columns.indexOf(newProps.x)] == "TEXT")?false:true;
            }
            if (isMatch && (dtype[columns.indexOf(connProps.y)] != "TEXT")){
                isMatch = (dtype[columns.indexOf(newProps.y)] == "TEXT")?false:true;
            }
            return isMatch ;
    }

    function splitColon(str){
        var data = (str.substring((str.indexOf(":")+1),str.length)).trim();
        console.log(data);
        return data;
    }
    function toggleSelection(event,connProps){
        //var selectList=[];
        var obj = ($(event.target)).hasClass("conn-table")?($(event.target)):($(event.target)).parents(".conn-table");
        var isMatch = checkType(connProps,{"table":splitColon(((obj[0]).getElementsByClassName("tabName")[0]).innerHTML) , "x" :splitColon(((obj[0]).getElementsByClassName("xname")[0]).innerHTML) , "y":splitColon(((obj[0]).getElementsByClassName("yname")[0]).innerHTML) });
        if((obj[0]).style.backgroundColor =="red"){
            (obj[0]).style.backgroundColor=isMatch?"green":"red";
            (userData.mergedConn[userData.mergeCount]) = (userData.mergedConn[userData.mergeCount])?(userData.mergedConn[userData.mergeCount]) : [];
            isMatch && ((userData.mergedConn[userData.mergeCount])).push({"table":splitColon(((obj[0]).getElementsByClassName("tabName")[0]).innerHTML) , "x" :splitColon(((obj[0]).getElementsByClassName("xname")[0]).innerHTML) , "y":splitColon(((obj[0]).getElementsByClassName("yname")[0]).innerHTML) });
            !(isMatch) && alert("incompatible datatypes");
        }
        else{
            var index = ((userData.mergedConn[userData.mergeCount])).indexOf({"table":splitColon(((obj[0]).getElementsByClassName("tabName")[0]).innerHTML) , "x" :splitColon(((obj[0]).getElementsByClassName("xname")[0]).innerHTML) , "y":splitColon(((obj[0]).getElementsByClassName("yname")[0]).innerHTML) });
            (userData.mergedConn[userData.mergeCount]).splice(index,1);
             (obj[0]).style.backgroundColor="red";
        }
        return (userData.mergedConn[userData.mergeCount]);

    }

    function getYdata(table){
        var ydata=[];
        //var str ="";
          obj = (JSON.parse(userData.tabData[(table).table]))[table.y];
        ydata=(Object.keys(obj).map(function(k) { return obj[k] }));
        //return str.substr(0,(str.length)-1);
        console.log(ydata);
        return ydata;
    }
     function getXdata(table){
        var xdata=[];
        //var str ="";

        obj = (JSON.parse(userData.tabData[(table).table]))[table.x];
        xdata=(Object.keys(obj).map(function(k) { return obj[k] }));
        //str=str+"{ y :["+ydata[i]+"]},";

        //return str.substr(0,(str.length)-1);
        console.log(xdata);
        return xdata;
    }
    function selectConn(open,targetConn,connProps,mergeList){
        if(mergeList){
            for(var i =0;i<mergeList.length;i++){
                var ydata = getYdata(mergeList[i]);
                var xdata = getXdata(mergeList[i]);
                Plotly.addTraces(targetConn.graphId,{x: xdata,y: ydata});

            }
            userData.mergeCount++;
        }
        if(open){
            $("#selectConn .modal-container").length && $("#selectConn .modal-container").remove();
            $("#selectConn").append( $("<div class='modal-container'></div>"));
            $("#selectConn").removeClass("hidden");
            $(".modal-overlay").removeClass("hidden");
            for(var i = 0 ; i <getSize(userData.conn);i++){
                var connDiv = $("<div class='conn-table "+ i+"' style='background-color:red;'><span class='tabName'> Table :"+ (userData.conn[i]).table+"</span> <span class='xname'>X axis :"+ (userData.conn[i]).x+"</span><span class='yname'> Y axis :"+ (userData.conn[i]).y+"</span></div>");
                $("#selectConn .modal-container").append(connDiv);
                connDiv.on("click",function (){toggleSelection(event,connProps);console.log((userData.mergedConn[userData.mergeCount]));});
            }
            $("#selectConn #savexy").addClass(targetConn.graphId);
            $("#selectConn #savexy").on("click",function(){selectConn("",{"graphId" : (this.classList)[0]},"",(userData.mergedConn[userData.mergeCount]));})
        }
        else{
            $("#selectConn").innerHTML = "";
            $("#selectConn").addClass("hidden");
            $(".modal-overlay").addClass("hidden");
        }
    }
    function editModal(modalObj){
        //var indexstr = (($(modalObj).data()).uiDraggable.eventNamespace);
        userData.tempIndex = parseFloat(modalObj.data);
        var table = (modalObj).innerHTML;
        $("#edit_modal h3").innerHTML = table;
        generateSelectInput("#edit_modal","X",(JSON.parse(userData.tabData[table])));
        generateSelectInput("#edit_modal","Y",(JSON.parse(userData.tabData[table])));
        $("#popup_overlay").removeClass("hidden");
        $("#edit_modal").removeClass("hidden");
        console.log(userData.tempIndex+"  sdfghjk    "+table);
        ($("#edit_modal select.X")[0]).value = (userData.conn[userData.tempIndex]).x;
        ($("#edit_modal select.Y")[0]).value = (userData.conn[userData.tempIndex]).y;


        $("#edit_modal .save").on("click", function () {
            userData.tempIndex = parseFloat(userData.tempIndex) || 0;
            var x= ($("#edit_modal select.X")[0]) && ($("#edit_modal select.X")[0]).value;
            var y= ($("#edit_modal select.X")[0]) && ($("#edit_modal select.Y")[0]).value;
            (userData.conn[userData.tempIndex]).x=x || (userData.conn[userData.tempIndex]).x;
            (userData.conn[userData.tempIndex]).y=y || (userData.conn[userData.tempIndex]).y;
            generateTable(userData,userData.conn[userData.tempIndex]);
            //generateGraph();--pass graph id
            $(("#"+userData.conn[userData.tempIndex]).tableId+" .editable-tab").change(function(e) {
                console.log($(e.target));
                console.log(e);
                var id = (($(e.target)).parents("table")[0]).id
                //check in which connection objects does id of modified table occur
                var connID = id.substr((id.length)-1);
                updateGraph($(e.target),userData.conn[connID-1]);
                //updateStatsView($(e.target));
            });
            loadGraph(userData,userData.conn[userData.tempIndex]);
            closeModal("edit_modal");
        });


         $("#edit_modal .cancel").on("click", function () {
            //loadGraph(userData,userData.conn[index])
            closeModal("edit_modal");
        });


         $("#edit_modal .delete").on("click", function () {
            //loadGraph(userData,userData.conn[index])
                $("#"+(userData.conn[userData.tempIndex]).tableId).remove();
                $("#"+(userData.conn[userData.tempIndex]).graphId).remove();
                (userData.conn[userData.tempIndex])={};
                $(".add-data-panel .dropzone ."+table).remove();
                closeModal("edit_modal");
        });


    }

    function closeModal(modal){
                $("#"+modal).addClass("hidden");
        $(".modal-overlay").addClass("hidden");
        $("#"+modal+" .select-input").remove();
    }

/*
 function mergeXY(tableName,save,close){
         if(close){
        if(save){
            var x= ($("#selectxy select.X")[0]) && ($("#selectxy select.X")[0]).value;
            var y= ($("#selectxy select.Y")[0]) && ($("#selectxy select.Y")[0]).value;
            (userData.mergedConn[userData.mergeCount-1]).x=x || (userData.mergedConn[userData.mergeCount-1]).x;
            (userData.mergedConn[userData.mergeCount-1]).y=y || (userData.mergedConn[userData.mergeCount-1]).y;


           /* $("#"+userData.mergedConn[userData.mergeCount-1].tableId +" .editable-tab").change(function(e) {
                console.log($(e.target));
                console.log(e);
                var id = (($(e.target)).parents("table")[0]).id
                var connID = id.substr((id.length)-1);
                updateGraph($(e.target),userData.mergedConn[connID-1]);

            });
            //loadGraph(userData,userData.mergedConn[userData.mergeCount-1])
            selectConn(true,{"table":tableName},{"x":(userData.mergedConn[userData.mergeCount-1]).x,"y":(userData.mergedConn[userData.mergeCount-1]).y});

        }
        else{
            userData.mergedConn[userData.mergeCount--]={};                             //remove table from dropzone
            $(".merge-data-panel .dropzone ."+tableName).remove();
        }
        closeModal("selectxy");
    }
    else{
        generateSelectInput("#selectxy","X",(JSON.parse(userData.tabData[tableName])));
        generateSelectInput("#selectxy","Y",(JSON.parse(userData.tabData[tableName])));
        ($("#selectxy")).removeClass("hidden");
        $(".modal-overlay").removeClass("hidden");
        ($("#savexy")).off("click");
        ($("#closexy")).off("click");
        ($("#savexy")).on("click",function(){
            mergeXY("",true,true);
        });
        ($("#closexy")).on("click",function(){
            mergeXY(tableName,false,true);
        });
    }

 }*/
 function selectXY(tableName,close,save){
    if(close){
        if(save){
            var x= ($("#selectxy select.X")[0]) && ($("#selectxy select.X")[0]).value;
            var y= ($("#selectxy select.Y")[0]) && ($("#selectxy select.Y")[0]).value;
            (userData.conn[userData.dataCount-1]).x=x || (userData.conn[userData.dataCount-1]).x;
            (userData.conn[userData.dataCount-1]).y=y || (userData.conn[userData.dataCount-1]).y;

                   // loadGraph(userData);
            generateTable(userData,userData.conn[userData.dataCount-1]);
            //generateGraph();--pass graph id
            $("#"+userData.conn[userData.dataCount-1].tableId +" .editable-tab").change(function(e) {
                console.log($(e.target));
                console.log(e);
                var id = (($(e.target)).parents("table")[0]).id
                var connID = id.substr((id.length)-1);
                updateGraph($(e.target),userData.conn[connID-1]);
                //updateStatsView($(e.target));
            });
            loadGraph(userData,userData.conn[userData.dataCount-1])
        }
        else{
            userData.conn[userData.dataCount--]={};                             //remove table from dropzone
            $(".add-data-panel .dropzone ."+tableName).remove();
        }
        closeModal("selectxy");
    }
    else{
        generateSelectInput("#selectxy","X",(JSON.parse(userData.tabData[tableName])));
        generateSelectInput("#selectxy","Y",(JSON.parse(userData.tabData[tableName])));
        ($(".selectxy")).removeClass("hidden");
        $(".modal-overlay").removeClass("hidden");
        ($("#savexy")).off("click");
        ($("#closexy")).off("click");
        ($("#savexy")).on("click",function(){
            selectXY("",true,true);
        });
        ($("#closexy")).on("click",function(){
            selectXY(tableName,true,false);
        });
    }
 }

function generateSelectInput(selector,name,data)
    {
        data = Object.keys(data);
        var inputDiv=$( "<div class='select-input "+name+"'><label>"+ name+" : </label><select class='select "+name+"'></select></div>");
        console.log(data);
        console.log(inputDiv);
        for(var i =0; i <data.length;i++){
        var option = document.createElement("option");
        option.value = data[i];
        option.innerText = data[i];
        //console.log(option);
        var optselector = "select.select."+name;
        var selectTag = $(inputDiv.find(optselector));
        (selectTag).append((option));
    }
    $(selector).append(inputDiv);

    }

        /* test github falana thikana */
        function populatePopup2(selector,data,id,secondary){
           // var table = document.getElementById("table-selector");
           if(secondary){
               //document.getElementById("table-selector").value
               xyoptions = JSON.parse(data[document.getElementById("table-selector").value]);
               data = (Object.keys(xyoptions)).join("-");
           }
            var options = data.split("-");
                var table = document.createElement("select");
                var id = id || "table-selector";
                table.setAttribute("id",id);
                for (i=0 ; i<options.length;i++){
                    var option = document.createElement("option");
                    option.innerText = options[i];
                    table.add(option);
                }
                ($(selector)[0]).append(table);
                if (id =="table-selector")
                {
                    table.addEventListener("onchange",populatePopup(".modal .container",userData.tabData,"x-selector",true));
                    table.addEventListener("onchange",populatePopup(".modal .container",userData.tabData,"y-selector",true));
                }

        }
        function getSize(obj) {
        var size = 0, key;
        for(key in obj) {
        if(obj.hasOwnProperty(key))
        size++;
        }
        return size;
        }
        function generateTable(data,conn){
            console.log(conn);
            //var columns = Object.keys(JSON.parse(data.domainTabs));
            var columns =Object.keys(JSON.parse(data.tabData[conn.table]));
            var tabData = (JSON.parse(data.tabData[conn.table]));
            var table="";
            if(document.getElementById(conn.tableId)){
              (document.getElementById(conn.tableId)).remove() ;
            }
            var table=document.createElement("table");
            table.setAttribute("id",conn.tableId);
            table.setAttribute("contentEditable","True");
            var thead = document.createElement("tr");
            for(i =0; i<columns.length; i++){
                var td = document.createElement("td");
                    td.innerHTML =columns[i];
                    //console.log(tabData[columns[j]][i]);
                    thead.append(td);
            }
            table.append(thead);
            for(i =0;i<getSize(tabData[columns[0]]);i++){
                var tr = document.createElement("tr");
                for(j=0;j<columns.length;j++){
                    var td = document.createElement("td");
                    var input= document.createElement("input");
                    input.setAttribute("class",columns[j]+" "+i+" editable-tab");
                    input.value = tabData[columns[j]][i];
                    td.append(input);
                    tr.append(td);
                }
                table.append(tr);
            }
            console.log(table);
            console.log(columns);
            (document.getElementsByClassName("dataTable-holder")[0]).append(table);
        }

        function loadGraph(df,conn){
            console.log(df);
            //console.log(df[x]);
            //var xhttp = new XMLHttpRequest();

            var x= conn.x;
            var y= conn.y;
            var table=conn.table;
            conn.graph = "bar";
            //var graph = "bar";
            var obj = (JSON.parse(df.tabData[table])[x]);
            var xdata = Object.keys(obj).map(function(k) { return obj[k] });
            (userData.conn[userData.dataCount-1]).xdata =xdata;
            obj = (JSON.parse(df.tabData[table])[y]);
            var ydata = Object.keys(obj).map(function(k) { return obj[k] });
            (userData.conn[userData.dataCount-1]).ydata =ydata;
            drawGraph({"x":xdata,"y":ydata,"type":conn.graph,"id":conn.graphId});
            $("#update-graph .container.js-plotly-plot").on("click",function(e){
                var id = (($(e.target)).parents(".container")[0]).id;
                //check in which connection objects does id of modified table occur
                var connID = id.substr((id.length)-1);
                selectConn(true,userData.conn[connID-1],{"x":userData.conn[connID-1].x,"y":userData.conn[connID-1].y},false);

            });



        }

        function mergeTrace(event,open){
            var isTable = ((($(event.target)[0]).parents(".dataTable-holder")).length);
            var toolTip = $("div class='tooltip "+conn.table+"'><div class='tooltip-children'> Merge</div></div>");


        }
        function drawGraph(data){
        console.log(data);
            if(data.id){
                var graphContainer= $("<div class = 'container' id = '"+data.id+"'></div>");
                ($("#update-graph")).append(graphContainer) ;
                Plotly.newPlot(data.id, [data], {"title" : data.id}, {showSendToCloud:true});
            }
        }

        function loadGraph_backend(df){
            console.log(df);
            //console.log(df[x]);
            var xhttp = new XMLHttpRequest();
            var x= document.getElementById("x-selector").value;
            var y= document.getElementById("y-selector").value;
            var table= document.getElementById("table-selector").value;
            var graph = "bar-chart";
            var obj = (JSON.parse(df.tabData[table])[x]);
            var xdata = Object.keys(obj).map(function(k) { return obj[k] });
            obj = (JSON.parse(df.tabData[table])[y]);
            var ydata =Object.keys(obj).map(function(k) { return obj[k] });
            console.log(xdata);
            console.log(ydata);
            var results=JSON.stringify({"xdata":xdata,"ydata":ydata,"graph":graph});
            xhttp.open("POST","http://pysap.pythonanywhere.com/viz/graph/", false);

        //Send the proper header information along with the request
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhttp.onreadystatechange = function() { // Call a function when the state changes.
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Request finished. Do processing here.
                    console.log(this.response);
                }
            }
            console.log(results);
            xhttp.send(results);
        //xhr.send("foo=bar&lorem=ipsum");
            /*console.log("http://pysap.pythonanywhere.com/viz/graph/"+results+"/");
            xhttp.open("GET", "http://pysap.pythonanywhere.com/viz/graph/"+results+"/", false);
                        //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        //xhttp.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        xhttp.send();
                        console.log(xhttp.responseText);
                        if(xhttp.responseText && JSON.parse(xhttp.responseText).pwd == pwd){
                            console.log(xhttp.responseText);
                            hide(["loading"]);
                            setCookie("userId",uid,15); /*-----------------------15mins expiry time ---------------------------------------
                            getDomainTableData(JSON.parse(xhttp.responseText).domainTabs);
                            window.location.pathname="/viz/dash";
                        }
        */
        }

                function updateGraph(target,conn){
            var dtype = JSON.parse(userData.tabData[conn.table+"type"]).type;
            console.log(dtype);
            var columns =Object.keys(JSON.parse(userData.tabData[conn.table]));
            //var xindex = columns.indexOf(conn.xdata);
            //var yindex = columns.indexOf(conn.ydata);
            console.log('values of xa nad y after updation is:')
            //console.log("y  "+yindex+"   x   "+xindex);
            var changeIndex = {"y" : (target[0]).classList[0],"x":(target[0]).classList[1]};
            //console.log(changeIndex);
            console.log("previous xdata");
            console.log(conn.xdata);[]
            console.log(conn.ydata);
            var yindex = columns.indexOf(changeIndex.y);
            if(dtype[yindex]!="TEXT"){
               (target[0].value)=  (target[0].value).match(/^(\d|,)*\.?\d*$/)?parseFloat(target[0].value):"";
               !(target[0].value) && alert("Please enter numeric value only");
            }
            if (changeIndex.y==conn.x){
                (target[0].value) = (target[0].value)?(target[0].value):conn.xdata[changeIndex.x];
                conn.xdata[changeIndex.x]=((target[0].value).match(/^(\d|,)*\.?\d*$/)?parseFloat(target[0].value):(target[0].value));
            }
            else if ( changeIndex.y==conn.y){
                (target[0].value) =(target[0].value)?(target[0].value): conn.ydata[changeIndex.x];
                conn.ydata[changeIndex.x]=(target[0].value) && ((target[0].value).match(/^(\d|,)*\.?\d*$/)?parseFloat(target[0].value):(target[0].value));

            }
            else{
                /**/
            }
            console.log("new xdata");
            console.log(userData.xdata);
            console.log(userData.ydata);
            drawGraph({"x":conn.xdata,"y":conn.ydata,"type":conn.graph,"id":conn.graphId});
        }

        function updateStatsView(target){
            var columns =Object.keys(JSON.parse(userData.tabData[userData.table]));
            var xindex = columns.indexOf(userData.x);
            var yindex = columns.indexOf(userData.y);
            console.log("y  "+yindex+"   x   "+xindex);
            var changeIndex = {"y" : (target[0]).classList[0],"x":(target[0]).classList[1]};
            var data = JSON.parse(userData.tabData[userData.table]);
            console.log(data);
            //data[changeIndex.y]
            data[changeIndex.y][changeIndex.x]=(target[0].value).match(/^(\d|,)*\.?\d*$/)?parseFloat(target[0].value):(target[0].value);
            var dataArray = Object.keys(data[changeIndex.y]).map(function(k) { return data[changeIndex.y][k] })
            var max = Math.max(...dataArray);
            var min = Math.min(...dataArray);
            ($("#"+changeIndex.y)[0]).innerHTML="";
            var span= document.createElement("span");
            span.innerHTML = "Column :" +columns[i];
            ($("#"+changeIndex.y)[0]).append(span);
            var span= document.createElement("span");
            span.innerHTML = "Maximum :" +max;
            ($("#"+changeIndex.y)[0]).append(span);
            var span= document.createElement("span");
            span.innerHTML = "Minimum :" +min;
           ($("#"+changeIndex.y)[0]).append(span);

            //loadStatsView(data,changeIndex.y);
        }
        function loadStatsView(data,id){
            ($(".body-content-holder .stats-holder")[0]).innerHTML="";
            var columns =Object.keys(JSON.parse(data.tabData[data.table]));
            for(var i =0 ; i <columns.length;i++){
                var obj = (JSON.parse(data.tabData[data.table])[columns[i]]);
                var dataArray = Object.keys(obj).map(function(k) { return obj[k] });
                if(typeof (dataArray[0])=="number"){
                    var max = Math.max(...dataArray);
                    var min = Math.min(...dataArray);
                    var div = document.createElement("div");
                    div.setAttribute("id",columns[i]);
                    var span= document.createElement("span");
                    span.innerHTML = "Column :" +columns[i];
                    div.append(span);
                    var span= document.createElement("span");
                    span.innerHTML = "Maximum :" +max;
                    div.append(span);
                    var span= document.createElement("span");
                    span.innerHTML = "Minimum :" +min;
                    div.append(span);
                    ($(".body-content-holder .stats-holder")[0]).append(div);
                }
            }


        }
        function togglePopup(openPopup){
            console.log(openPopup+" in popup");
            if(openPopup){
                //loadModalContent
                populatePopup(".modal .container",userData);
                console.log(userData);
                //(document.getElementById("table-selector")).options =(userData.domainTabs).split(",");
                $("#popup_overlay").removeClass("hidden");
                $("#layover_popup").removeClass("hidden");
                /*if(document.getElementById("saveBtn")){

                }
                else{
                    var btn = document.createElement("button");
                    btn.setAttribute("id","saveBtn");
                    btn.innerHTML= "SAVE";
                    (document.getElementsByClassName("modal")[0]).append(btn);
                }*/

               // (document.getElementById("saveBtn")).addEventListener("click",function (){
                   // userData.conn[userData.dataCount] = {"x":document.getElementById("x-selector").value,"y": document.getElementById("y-selector").value,"table":document.getElementById("table-selector").value, "tableId" :"table"+userData.dataCount,"graphId":"graph"+userData.dataCount };
                    /* Functionality for save of primary modal */
                    //generateTable(userData);

                   // togglePopup();
                   // loadStatsView(userData);
               // });
                    /*(document.getElementById("table-selector")).value = userData.table || "";
                    (document.getElementById("x-selector")).value = userData.x || "";
                    (document.getElementById("y-selector")).value = userData.y || "";*/

                }
            else{
                $("#popup_overlay").addClass("hidden");
                $("#layover_popup").addClass("hidden");
                document.getElementById("table-selector") && document.getElementById("table-selector").remove();
                document.getElementById("x-selector") && document.getElementById("x-selector").remove();
                document.getElementById("y-selector") && document.getElementById("y-selector").remove();

            }
        }
        function authenticateUser(user, password)
        {
            var token = user + ":" + password;

            // Should i be encoding this value????? does it matter???
            // Base64 Encoding -> btoa
            var hash = btoa(token);

            return "Basic " + hash;
        }

        function hitapi(){
            var xhttp = new XMLHttpRequest();
                        //var uid = document.getElementById("userid").value;
                        //var pwd = document.getElementById("pwd").value;
                        //setTimeout(function(){show(["loading"]);hide(["particles-js","login_container"]);},0);
                        xhttp.open("POST", "http://testhanap2000519762trial.hanatrial.ondemand.com/customer/server/post_data.xsjs", false);
                        //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        xhttp.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        xhttp.setRequestHeader('Access-Control-Allow-Origin' ,'*');
                        //xhttp.setRequestHeader('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
                        xhttp.setRequestHeader('Access-Control-Allow-Headers','Origin, Content-Type, X-Auth-Token');
                        xhttp.setRequestHeader("Authorization", authenticateUser("SYSTEM", "Urmilesh786@gmail.com"));
                        var postData = { "customerNumber": 340349 }
                        xhttp.send(postData);
                        console.log(xhttp.responseText);
        }
        function loginUser(){
            console.log("login user");
            setTimeout(function(){
             document.getElementById("logout").addEventListener("click", function(){
                    setCookie("userId","",0);
                    setCookie("userdata","",0);
                    window.location.pathname = "/viz/login";
                });
            document.getElementById("addConn").addEventListener("click",function(){
                       togglePopup(true);
                    });
            document.getElementById("close-btn").addEventListener("click",function(){
                       togglePopup(false);
                    });

            },3000);
        }
});