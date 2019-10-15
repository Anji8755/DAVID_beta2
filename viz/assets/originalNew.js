$(function(){
        var globalFuncs={};
        var graphsJSON={};
        var requestHeader = (window.location.origin).substr(0,(window.location.origin).indexOf("/")+2);
        var host = window.location.host;
        
        var currentPath = window.location.pathname ;
        console.log('#############Running in app engine')
        var userData={};
        userData.conn={};
        userData.mergedConn={};
        userData.mergeCount = 0;
        userData.dataCount =0;
        userData.currentMergeSelection=[];
        var modulesJSON = {
            "dash":{
                "link":"/dash",
                "name":"Data Analytics Dashboard"
            },
            "parser":{
                "link":"/KnowledgeRepo",
                "name":"Knowledge Repository",
            },
            "adminDashBoard":{
                "link":"/admin",
                "name":"Admin Dashboard",
                "adminAccess":"True"
            }

        }
        //(userData.mergedConn[userData.mergeCount]).selectedMergeList=[];
        console.log(currentPath);
        function clearFieldsForBlock(selector){
            var fields = ($(selector).find("input"));
            for(var i =0;i<fields.length;i++){
                if(fields[i].style.display!="none"){
                    fields[i].value="";
                }
            }
            var fields = ($(selector).find("textarea"));
            for(var i =0;i<fields.length;i++){
                if(fields[i].style.display!="none"){
                    fields[i].value="";
                }
            }
            //($(selector).find("textarea")[0]).value="";
        }
        function attachGlobalListeners(){
            $(".invisble-btn.parser").on("click",function(){
                      window.location.pathname = "/KnowledgeRepo";
                      console.log("KnowledgeRepo");
            });
            $(".invisble-btn.dash").on("click",function(){
                    alert("you must login first ");
                      window.location.pathname = "/login";
                      console.log("dash");
            });
            $("#contactDavid").on("click",function(){
                clearFieldsForBlock(".contactModal");
                $(".contactModal").removeClass("hidden");
                $("modal-overlay").removeClass("hidden");
           });
           console.log("listener for header attached");
                   $(".contactModal .btn.closeModal").on("click",function(){
                        $(".contactModal").addClass("hidden");
                        $("modal-overlay").addClass("hidden");
                   });

                   $(".contactModal .btn.send").on("click",function(){
                    ($("#msg_mail")[0]).style.backgroundColor = "#fbf8d1";
                    var email={}
                    email.sub = ($("#msg_sub")[0]).value;
                    email.msg = ($("#msg_txt")[0]).value;
                    email.cc = ($("#msg_cc")[0]).value ||"";

                    email.mailid =($("#msg_mail")[0]).value;
                    email.cat = ($("#category span.Select-value-label")[0]).innerHTML

                    email.emailExp =/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                    if (email.emailExp.test(email.mailid)){
                        var xhttp = new XMLHttpRequest();
                        console.log('########################################before hittiing register ')
                        xhttp.open("POST", requestHeader+host+"/sendquery/", false);

                        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        xhttp.send(JSON.stringify({"sub" : email.sub,"msg":email.msg,"email" : email.mailid,"category" : email.cat,"cc":email.cc}));
                        console.log(xhttp.responseText);
                        if(!(JSON.parse(xhttp.responseText).failure)){
                            userAlert("Email sent successfully !","Success");
                            $(".contactModal").addClass("hidden");
                            $("modal-overlay").addClass("hidden");
                        }
                        else{
                            userAlert("Email could not be sent !","Failure");
                        }

                    }
                    else{
                        ($("#msg_mail")[0]).style.backgroundColor = "red";
                        userAlert("Email is not valid","Failure");
                    }

                   });
        }
        setTimeout(attachGlobalListeners,2000);
        if (currentPath =="/dash/" || currentPath =="/dash"){
            show(["loading"]);
            if(getCookie("userId")){
                loginUser();
                //userData =JSON.parse(getCookie("userdata"));
                userData = JSON.parse(localStorage.getItem('userdata'));
                if(userData.tabData.if_local){
                    userData.tabData = (userData.tabData);

                    setTimeout(function(){userAlert("Server Unavailable , using cached data","failure");},2000);
                }
                else{
                    userData.tabData = reformatJSON(userData.tabData);
                    setTimeout(function(){userAlert("Server Connected","success");},2000);

                }
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
                alert("Please login first ","failure");
                window.location.pathname = "/login";
            }
            window.addEventListener('load', function () {
                hide(["loading"]);
                },
            false);
        }
        else if(currentPath=="/resetPwd" || currentPath =="/resetPwd/"){

            var uid = getCookie("uid");
            setCookie("uid","",0);
            setTimeout(function(){


            $("#submit").on("click",function(){
                var pwd = $("#pwd")[0].value;
                var cpwd =  $("#cpwd")[0].value;
                if(pwd===cpwd){
                    var xhttp = new XMLHttpRequest();
                    xhttp.open("POST", requestHeader+host+"/forgotPwdReset/", false);//getHanaData
                    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                    xhttp.send(JSON.stringify({"uid":uid,"pwd":pwd}));
                    console.log(xhttp.responseText);
                    if( !(JSON.parse(xhttp.responseText).failure)){
                        window.location.pathname="login";
                    }
                }
                else{
                    userAlert("Passwords do not match ", "failure");
                }


            });
            },3000);


        }
        else if(currentPath=="/admin" || currentPath=="/admin/"){
            function createViews(viewID,parentSelector){
                $(parentSelector).append(($("<div class = 'view "+viewID+"'><span>"+viewID+"</span><span class='glyphicon glyphicon-close remove'></span></div>")));

            }
            setCookie("admin","temporaryAdmin",1);
            //populate admin page todolist
            var userCookie = getCookie("admin");
            var accObj={};
            emails=[];
            if(userCookie){
                setTimeout(function(){
                   $("#addAccount").on("click",function(){
                        $(".accountModalOuter").removeClass("hidden");
                        $(".accountModalOuter .nextBtn").addClass("part1");
                   });
                   $("#addAccount .button.cancel").on("click",function(){
                        $(".accountModalOuter").addClass("hidden");
                   });

                    $(".accountModalOuter .nextBtn").on("click",function(ev){
                        console.log($(".accountModalOuter .nextBtn")[0].classList[3])
                        switch($(".accountModalOuter .nextBtn")[0].classList[3]){
                            case  'part1':
                                accObj["name"]="";
                                var accName = ($(".accountContainer .input")[0]).value;
                                if(!accName){
                                    userAlert("Account Name cannot be blank","failure")
                                    break;
                                }
                                var xhttp = new XMLHttpRequest();
                                xhttp.open("POST", requestHeader+host+"/checkAcc/", false);
                                xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                                xhttp.send(JSON.stringify({"val":accName}));
                                console.log(xhttp.responseText);
                                if(JSON.parse(xhttp.responseText).failure){
                                    accObj["name"]=accName;
                                    $(".accountModalInner0").addClass("hidden");
                                    $(".accountModalOuter .nextBtn").addClass("part2");
                                    $(".accountModalOuter .nextBtn").removeClass("part1");
                                    $(".accountModalInner1").removeClass("hidden");

                                }
                                else{
                                    userAlert("Account Already exists","failure")
                                }
                                break;
                            case  'part2':
                                accObj["apiUrl"]="";
                                accObj["apiUrlTables"]="";
                                accObj["uname"]="";
                                accObj["pwd"]="";
                                var apiUrl = ($(".accountModalInner1  .urlInput")[0]).value;
                                var apiUrlTables = ($(".accountModalInner1  .urlInputSecondary")[0]).value;
                                var uname = ($(".accountModalInner1  .unameInput")[0]).value;
                                var pwd = ($(".accountModalInner1  .pwdInput")[0]).value;

///////////////////////commented by Anji on 23.08.19
                                if(!apiUrl || !uname || !pwd || !apiUrlTables){
                                    userAlert("Please provide URL ,username  & password to fetch API","failure")
                                    break;
                                }
///////////////////////comment ended by Anji on 23.08.19

                                var xhttp = new XMLHttpRequest();
                                xhttp.open("POST", requestHeader+host+"/getHanaData/", false);//getHanaData
                                xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                                xhttp.send(JSON.stringify({"url":apiUrl,"uname":uname,"pwd":pwd,"apiUrlTables":apiUrlTables}));
                                console.log(xhttp.responseText);
                                if( !(JSON.parse(xhttp.responseText).failure)){
                                    accObj["apiUrl"]=apiUrl;
                                    accObj["apiUrlTables"]=apiUrlTables;
                                    accObj["uname"]=uname;
                                    accObj["pwd"]=pwd;
                                    accObj["tables"]=JSON.parse(xhttp.responseText).table || ["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11","t12","t13","t14","t15","t16","t17","t18","t19","t20","t21","t22","t23","t24","t25","t26","t27","t28","t29","t30","t31","t32","t33","t34","t35","t36","t37","t38","t39","t40","t41","t42","t43","t44","t45","t46","t47","t48","t49","t50"];
                                    console.log(accObj["tables"]);
                                    $(".accountModalInner1").addClass("hidden");
                                    $(".accountModalOuter .nextBtn").addClass("part3");
                                    $(".accountModalOuter .nextBtn").removeClass("part2");
                                    $(".accountModalInner2").removeClass("hidden");
                                    accObj["domain_tables"]={};
                                    var domainName = ($(".accountModalInner2 input.domain")[0]).value;
                                    generateSelectInput(false,".accountModalInner2 .selectTables","table-selector",accObj["tables"])
                                    $(".accountModalInner2 .addTable").on("click",function(){
                                        var domainName = ($(".accountModalInner2 input.domain")[0]).value;
                                        if(!domainName){
                                            userAlert("Please provide a domain Name","failure");
                                        }
                                        else{
                                            $(".accountModalInner2 .domain")[0].readOnly=true;
                                            var tab = $(".accountModalInner2 .selectTables select.table-selector")[0].value;
                                            if(tab){
                                                if(!(accObj["domain_tables"][domainName])){
                                                   accObj["domain_tables"][domainName]=[];
                                                }
                                                if((accObj["domain_tables"][domainName]).indexOf(tab)== -1)
                                                {
                                                    accObj["domain_tables"][domainName].push(tab);
                                                    createViews(tab,".accountModalOuter .tablesHolder");
                                                    $(".accountModalOuter .tablesHolder .view").on("click",function(ev){
                                                        var el = $(ev.target).classList[1];
                                                        (accObj["domain_tables"][domainName]).splice((accObj["domain_tables"][domainName]).indexOf(el),1);
                                                    });

                                                }
                                            }
                                        }
                                    })

                                    $(".accountModalInner2 .saveDomain").on("click",function(){
                                        var domainName = ($(".accountModalInner2 input.domain")[0]).value;
                                        if((accObj["domain_tables"][domainName]).length){
                                        $(".accountModalInner2 .domain")[0].readOnly=false;
                                         $(".accountModalInner2 .domain")[0].value="";
                                         $(".accountModalOuter .tablesHolder")[0].innerHTML=""
                                        }
                                        else{
                                            userAlert("Please add one or more tables to your domain","failure");
                                        }
                                         console.log(accObj["domain_tables"]);

                                    });

                                }
                                else{
                                    userAlert("API URL provided is incorrect ","failure")

                                }

                                break;
                            case  'part3':
                                if(!accObj["domain_tables"] || !(Object.keys(accObj["domain_tables"])).length){
                                    userAlert("No domain data created ");
                                    break;
                                }
                                else{
                                    $(".accountModalInner2").addClass("hidden");
                                    $(".accountModalOuter .nextBtn").addClass("part4");
                                    $(".accountModalOuter .nextBtn").removeClass("part3");
                                    $(".accountModalInner3").removeClass("hidden");

                                }

                                accObj["users"]=[];
                                $(".accountModalInner3 .addUser").on("click",function(){
                                    var name = $(".accountModalInner3 .name")[0].value;

                                    var pwd = $(".accountModalInner3 .password")[0].value;
                                    var email = $(".accountModalInner3 .email")[0].value;
                                    //var domain = $(".accountModalInner3 .domain-selector")[0].value;
                                    //checkEmails
                                 var xhttp = new XMLHttpRequest();
                                xhttp.open("POST", requestHeader+host+"/checkEmails/", false);
                                xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                                xhttp.send(JSON.stringify({"user":email}));
                                console.log(accObj);
                                console.log(xhttp.responseText);
                                var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;;
                                    if(regex.test(email) && (emails.indexOf(email)== -1) && !(JSON.parse(xhttp.responseText).failure)){
                                      userAlert("User Added","success");
                                      createViews(email,".accountModalOuter .userList");
                                      var email = $(".accountModalInner3 .email")[0].value;
                                      //$(".selectTables .table-selector option[value='"+email+"']").remove();
                                    emails.push(email);
                                      accObj["users"].push({"name":name,"email":email,"username":email,"pwd":pwd,"domain":[]});

                                    }
                                    else{
                                        userAlert("Invalid or Pre-Existing  Email ","failure");
                                    }

                                });


                                break;
                            case  'part4':
                                if(!accObj["users"].length){
                                    userAlert("No users created ","failure");
                                    break;
                                }
                                else{
                                    $(".accountModalInner3 .name")[0].value="";
                                    $(".accountModalInner3 .email")[0].value="";
                                    $(".accountModalInner3 .password")[0].value="";

                                    $(".accountModalInner3").addClass("hidden");
                                    $(".accountModalOuter .nextBtn").addClass("part5");
                                    $(".accountModalOuter .nextBtn").removeClass("part4");
                                    $(".accountModalInner4").removeClass("hidden");
                                }
                                 generateSelectInput(false,".userListCont","users",emails);
                                //generateSelectInput(true,".accountModalInner3","domain-selector",accObj["domain_tables"]);
                                RadioBtnHandler(true,".domainListCont","domains",accObj["domain_tables"],false);
                                $(".accountModalInner4 .addUserDomain").on("click",function(){
                                    var values = RadioBtnHandler(true,".domainListCont","","",true,true);
                                    var user = $(".userListCont select.users")[0].value;
                                    accObj["users"][search("email",user, accObj["users"])]["domain"]=values;
                                    $(".userListCont select.users  option[value='"+user+"']").remove();

                                });

                                break;
                            case  'part5':
                                var xhttp = new XMLHttpRequest();
                                xhttp.open("POST", requestHeader+host+"/addAccDet/", false);
                                xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                                xhttp.send(JSON.stringify({"payload":accObj}));
                                console.log(accObj);
                                console.log(xhttp.responseText);
                                if(!(JSON.parse(xhttp.responseText).failure)){
                                    $(".accountModalInner4").addClass("hidden");
                                    $(".accountModalOuter .nextBtn").addClass("part6");
                                    $(".accountModalOuter .nextBtn").removeClass("part5");
                                    $(".accountModalInner5").removeClass("hidden");
                                    $(".accountModalInner5 .finMsg2")[0].innerHTML="ACCOUNT NAME :"+accObj["name"];
                                $(".accountModalInner5 .finMsg3")[0].innerHTML="NUMBER OF DOMAINS :"+(Object.keys(accObj["domain_tables"])).length;
                                $(".accountModalInner5 .finMsg4")[0].innerHTML="NUMBER OF USERS :"+(Object.keys(accObj["users"])).length;
                                $(".accountModalOuter .nextBtn").addClass("part1");
                                $(".accountModalOuter .nextBtn").addClass("hidden");
                                $(".accountModalOuter .confirm").removeClass("hidden");
                                $(".accountModalOuter .confirm").on("click",function(){
                                  $(".accountModalOuter").addClass("hidden");
                                   $(".accountModalInner5").addClass("hidden");
                                    $(".accountModalOuter .nextBtn").addClass("part1");
                                    $(".accountModalOuter .nextBtn").removeClass("part5");
                                    $(".accountModalInner0").removeClass("hidden");
                                });
                                }
                                else{
                                    userAlert("Query Unsuccesful","failure");
                                    $(".accountModalInner4").addClass("hidden");
                                    $(".accountModalOuter .nextBtn").addClass("part6");
                                    $(".accountModalOuter .nextBtn").removeClass("part5");
                                    $(".accountModalInner5").removeClass("hidden");
                                    $(".accountModalInner5 .finMsg1")[0].innerHTML="OH CRAP ! LOOKS LIKE WE BLEW UP JOHN ! ";
                                //$(".accountModalInner5 .finMsg3")[0].innerHTML="NUMBER OF DOMAINS :"+(Object.keys(accObj["domain_tables"])).length;
                                //$(".accountModalInner5 .finMsg4")[0].innerHTML="NUMBER OF USERS :"+(Object.keys(accObj["users"])).length;
                                $(".accountModalOuter .nextBtn").addClass("part1");
                                $(".accountModalOuter .nextBtn").addClass("hidden");
                                $(".accountModalOuter .confirm").removeClass("hidden");
                                $(".accountModalOuter .confirm").on("click",function(){
                                  $(".accountModalOuter").addClass("hidden");
                                   $(".accountModalInner5").addClass("hidden");
                                    $(".accountModalOuter .nextBtn").addClass("part1");
                                    $(".accountModalOuter .nextBtn").removeClass("part5");
                                    $(".accountModalInner0").removeClass("hidden");
                                });

                                }

                                break;
                            case  'part6':


                                break;

                        }
                   });
                },2000);

                var date = new Date();
                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", requestHeader+host+"/fetch_regtab/", false);
                xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhttp.send(JSON.stringify({"timestamp" : date.getTime(),"user":userCookie}));
                console.log(xhttp.responseText);
                var table=document.createElement("table");
                table.setAttribute("id","adminTable");
                table.setAttribute("class",userCookie);
                var thead = document.createElement("tr");
                //debugger;
                for(i =0; i<(Object.keys(JSON.parse(xhttp.responseText).table)).length; i++){
                var td = document.createElement("td");
                    td.innerHTML =(Object.keys((JSON.parse(xhttp.responseText)).table))[i];
                    //console.log(tabData[columns[j]][i]);
                    thead.append(td);
                }
                var td = document.createElement("td");
                td.innerHTML ="Account";
                    //console.log(tabData[columns[j]][i]);
                thead.append(td);
                var td = document.createElement("td");
                td.innerHTML ="Domain";
                    //console.log(tabData[columns[j]][i]);
                thead.append(td);
                var td = document.createElement("td");
                td.innerHTML ="Remarks";
                    //console.log(tabData[columns[j]][i]);
                thead.append(td);
                var td = document.createElement("td");
                td.innerHTML ="Action";
                    //console.log(tabData[columns[j]][i]);
                thead.append(td)
                table.append(thead);
                //debugger;
                for(i =0;i<getSize(((JSON.parse(xhttp.responseText).table)).UserName);i++){
                var tr = document.createElement("tr");
                for(j=0;j<(Object.keys((JSON.parse(xhttp.responseText).table))).length;j++){
                    var td = document.createElement("td");
                    td.innerHTML =((JSON.parse(xhttp.responseText).table))[(Object.keys((JSON.parse(xhttp.responseText).table)))[j]][i];
                    tr.append(td);
                }
                var td = document.createElement("td");
                var accData = JSON.parse(xhttp.responseText).accData;
                console.log(accData);
                //debugger;
                selectorName =(((JSON.parse(xhttp.responseText).table))[(Object.keys((JSON.parse(xhttp.responseText).table)))[0]][i]);
                td.append(generateSelectInput(false,"",selectorName+"account",Object.values(accData.AccName)));
                tr.append(td);
                var td = document.createElement("td");
                //var accData = JSON.parse(xhttp.responseText).accData;
                //console.log(accData);
                //debugger;
                //selectorName =(((JSON.parse(xhttp.responseText).table))[(Object.keys((JSON.parse(xhttp.responseText).table)))[0]][i])+"domain";
                td.append(generateSelectInput(false,"",selectorName+"domain",[]));
                tr.append(td);


                var td = document.createElement("td");
                //debugger;
                td.append($("<textarea class='remarks' resize='none' ></textarea>")[0]);
                tr.append(td);
                var td = document.createElement("td");
                //debugger;
                td.append($("<div class='buttonContainer'><button class='approve btn btn-success "+((JSON.parse(xhttp.responseText).table))[(Object.keys((JSON.parse(xhttp.responseText).table)))[0]][i]+"'>Approve</button><button class='decline  btn-danger btn  "+((JSON.parse(xhttp.responseText).table))[(Object.keys((JSON.parse(xhttp.responseText).table)))[0]][i]+"'>Decline</button></div>")[0]);
                tr.append(td);
                table.append(tr);
            }
            //debugger;
            setTimeout(function() {

                $(".adminTabHolder").append(table);
                $(".select-input select."+selectorName+"account").on("change",function(){
                    td = $(".select-input select."+selectorName+"domain").parents("td");
                    (td[0]).innerHTML= "";
                    var selectedAcc = ($("select.select."+selectorName+"account")[0]).value;
                    var avlblDomains = ((accData.Domain)[search("",selectedAcc,Object.values(accData.AccName))]).split("-");
                    td.append(generateSelectInput(false,"",selectorName+"domain",avlblDomains));
                });
            },3000);

            }
            else{
                userAlert("Please login again","failure");
                setTimeout(function(){
                    window.location.pathname = "/login";
                },5000);
            }
        setTimeout(function(){

            $("#logout").on("click", function(){
                setCookie("admin","",0);
                //setCookie("userdata","",0);
                window.location.pathname = "/login";
            });
              $("#refreshAdminList").on("click", function(){
                setCookie("admin",userCookie,1);
                //setCookie("userdata","",0);
                window.location.pathname = "/admin/";
            });
            $(".buttonContainer .approve").on("click",function(ev){
            function delRow(ev){
                ($(ev.target).parents("tr")).remove();
            }
            function delData(ev){
                var action = (ev.target.classList)[0];
                var admin = (($("#adminTable")[0]).classList)[0];
                var userName =(ev.target.classList)[3];
                var remarks = (($(ev.target).parents("tr")).find(".remarks")[0]).value;

                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", requestHeader+host+"/delData/", false);
                //console.log(requestHeader+host+"/delData/"+admin+"/"+userName+"/"+action+"/"+remarks+"/");
            //  debugger;
                xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhttp.send(JSON.stringify({"admin":admin,"username":userName,"action":action,"remarks":remarks}));
                return (xhttp);
            }

                var admin = (($("#adminTable")[0]).classList)[0];
                var userName =(ev.target.classList)[3];
                var domain = ($("select.select."+userName+"domain")[0]).value;
                var remarks = (($(ev.target).parents("tr")).find(".remarks")[0]).value;

                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", requestHeader+host+"/addData/", false);
                //console.log(requestHeader+host+"/addData/"+admin+"/"+userName+"/"+domain+"/"+remarks+"/");
                //debugger;
                xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhttp.send(JSON.stringify({"admin":admin,"username":userName,"domain":domain,"remarks":remarks}));
                console.log(xhttp.responseText);
                if((xhttp.status!=500 )&& !(xhttp.responseText.failure)){
                    //userAlert("Success : User request has been removed ","success");
                    var delData = delData(ev);
                    if((delData.status!=500 )&& !(delData.responseText.failure)){
                        userAlert("Success : User request has been approved ","success");
                        delRow(ev);

                    }
                    else{
                        userAlert("Failure : User request has been approved but failed to remove from  registration table ","failure");
                    }

                }
                else{
                   userAlert("Failure : "+xhttp.responseText.msg,"failure");
                }

            });
            $(".buttonContainer .decline").on("click",function(ev){
            function delRow(ev){
                ($(ev.target).parents("tr")).remove();
            }
            function delData(ev){
                var action = (ev.target.classList)[0];
                var admin = (($("#adminTable")[0]).classList)[0];
                var userName =(ev.target.classList)[3];
                var remarks = (($(ev.target).parents("tr")).find(".remarks")[0]).value;
                var xhttps = new XMLHttpRequest();
                xhttps.open("POST", requestHeader+host+"/delData/", false);
                //console.log(requestHeader+host+"/delData/"+admin+"/"+userName+"/"+action+"/"+remarks+"/");
            //  debugger;
                xhttps.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhttps.send(JSON.stringify({"admin":admin,"username":userName,"action":action,"remarks":remarks}));
                return (xhttps);
            }

                var delData = delData(ev);
                if((delData.status!=500 )&& !(delData.responseText.failure)){
                    userAlert("Success : User request has been removed ","success");
                    delRow(ev);

                }
                else{
                   userAlert("Failure : "+delData.responseText.msg,"failure");
                }

            });
        },5000);

        }
        else if(currentPath=="/login/" || currentPath=="/login" || currentPath=="/"){

            if(getCookie("userId")){
                loginUser();

            }
            else{

                console.log("Event listener added ");
                setTimeout(function(){
                //document.getElementById("test").addEventListener("click",function(){
                 // hitapi();
                   // });
                    $("#testapi").on("click",function(){
                         var xhttp =new XMLHttpRequest();

                            console.log('########################################before hittiing register ')
                            xhttp.open("POST", requestHeader+host+"/test/", false,"system","Python@1234567890");
                            xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");

                            xhttp.send();
                            console.log(xhttp.responseText);
                           /* if(!(JSON.parse(xhttp.responseText).failure))
                            {
                                userAlert("Password reset successful","success");
                                setTimeout(function(){
                                    window.location.pathname = "/login";

                                },2000);
                            }
                            else{
                              userAlert("Password could not be reset . Try later ","failure");
                            }*/

                   });

                   $(".greeting .login").on("click",function(){
                        $(".greeting").addClass("hidden");
                        $("#login_container").removeClass("hidden");
                   });
                   $("#loginHead").on("click",function(){
                        $(".greeting").addClass("hidden");
                        $("#login_container").removeClass("hidden");
                   });

                    $("#back2login").on("click",function(){
                       $("#forgotPwd_container").addClass("hidden");
                       //$("#forgotPwd_container .firstPart").removeClass("hidden");
                        //$(".greeting").addClass("hidden");
                       //$("#signup_container").addClass("hidden");
                       $("#login_container").removeClass("hidden");
                   });
                   $("#ForgotPwd").on("click",function(){
                       $("#forgotPwd_container").removeClass("hidden");
                       $("#forgotPwd_container .firstPart").removeClass("hidden");
                        $(".greeting").addClass("hidden");
                       $("#signup_container").addClass("hidden");
                       $("#login_container").addClass("hidden");
                   });
                    var timer ="";
                    $("#changeEmail").on("click",function(){
                       //var email = ($("#veremail")[0]).value;
                       $("#forgotPwd_container").removeClass("hidden");
                       $("#forgotPwd_container .firstPart").removeClass("hidden");
                       $("#forgotPwd_container .secondPart").addClass("hidden");
                        $(".greeting").addClass("hidden");
                       $("#signup_container").addClass("hidden");
                       $("#login_container").addClass("hidden");
                       clearInterval(timer);
                   });
                   //forgotPwdReset
                   $("#resetpwd").on("click",function(){
                        var email = ($("#veremail")[0]).value;
                        var setpwd = ($("#setpwd")[0]).value;
                        var csetpwd = ($("#csetpwd")[0]).value;
                        if(setpwd==csetpwd){
                            var xhttp = new XMLHttpRequest();
                            console.log('########################################before hittiing register ')
                            xhttp.open("POST", requestHeader+host+"/forgotPwdReset/", false);

                            xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                            xhttp.send(JSON.stringify({"pwd" :setpwd}));
                            console.log(xhttp.responseText);
                            if(!(JSON.parse(xhttp.responseText).failure))
                            {
                                userAlert("Password reset successful","success");
                                setTimeout(function(){
                                    window.location.pathname = "/login";

                                },2000);
                            }
                            else{
                              userAlert("Password could not be reset . Try later ","failure");
                            }
                        }
                        else{
                            userAlert("The passwords do not match","failure");
                        }
                    })

                   function verifyAndSendOtp(){
                       var email = ($("#veremail")[0]).value;
                        var xhttp = new XMLHttpRequest();
                        console.log('########################################before hittiing register ')
                        xhttp.open("POST", requestHeader+host+"/forgotPwdMail/", false);

                        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        xhttp.send(JSON.stringify({"email" :email}));
                        console.log(xhttp.responseText);
                        if(!(JSON.parse(xhttp.responseText).failure))
                       {
                            $("#resendotp").addClass("disabled");
                            $("#forgotPwd_container").removeClass("hidden");
                            $("#forgotPwd_container .secondPart").removeClass("hidden");
                            $("#forgotPwd_container .firstPart").addClass("hidden");
                            $(".greeting").addClass("hidden");
                            $("#signup_container").addClass("hidden");
                            $("#login_container").addClass("hidden");
                            var count = 60 ;
                            timer = setInterval(function(){
                                ($("#forgotPwd_container .secondPart .timerticker")[0]).innerHTML=Math.floor((count)/60)+":"+Math.floor((count--)%60);
                                if(count<=300){
                                    ($("#forgotPwd_container .secondPart .timerticker")[0]).style.color="red";
                                }
                                if(count==0){
                                    clearInterval(timer);
                                    $("#resendotp").removeClass("disabled");

                                }
                            },1000);
                            userAlert((JSON.parse(xhttp.responseText)).msg,"success");
                            ($("#forgotPwd_container .secondPart .msg")[0]).innerHTML = "OTP has been sent in E-mail . Please enter OTP for OTP ID : "+(JSON.parse(xhttp.responseText)).otpid;
                        }
                        else{
                            userAlert((JSON.parse(xhttp.responseText)).msg,"failure");
                        }
                   }

                   $("#verifyemail").on("click",verifyAndSendOtp);
                   $(".greeting .btn.login").on("click",function(){
                       if($("#login_container").hasClass("hidden")){
                            $("#login_container").removeClass("hidden");
                       }
                       $(".greeting").addClass("hidden");
                       $("#signup_container").addClass("hidden");
                       $("#forgotPwd_container").addClass("hidden");
                   });
                   /*$(".horizontal_header .btnsContainer .btn.signup").on("click",function(){
                       if($("#signup_container").hasClass("hidden")){
                            $("#signup_container").removeClass("hidden");
                       }
                       $("#login_container").addClass("hidden");
                       $("#forgotPwd_container").addClass("hidden");
                   });*/
                    $("#verifyotp").on("click",function(){
                        var email = ($("#veremail")[0]).value;
                        var otp = ($("#otp")[0]).value;
                        var xhttp = new XMLHttpRequest();
                        console.log('########################################before hittiing register ')
                        xhttp.open("POST", requestHeader+host+"/forgotPwdOtp/", false);

                        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        xhttp.send(JSON.stringify({"email" :email,"otp":otp}));
                        console.log(xhttp.responseText);
                        if(!(JSON.parse(xhttp.responseText).failure))
                       {
                            $("#forgotPwd_container").removeClass("hidden");
                            $("#forgotPwd_container .finalPart").removeClass("hidden");
                            $("#forgotPwd_container .secondPart").addClass("hidden");
                            $(".greeting").addClass("hidden");
                            $("#signup_container").addClass("hidden");
                            $("#login_container").addClass("hidden");
                            clearInterval(timer);
                            userAlert("OTP verified successfully","success");
                       }
                       else{
                           userAlert((JSON.parse(xhttp.responseText)).msg,"failure");
                       }
                    })
                    $("#signup").on("click", function(){
                        $("#login_container").addClass("hidden");
                        $("#signup_container").removeClass("hidden");
                        $("#gotoLogin").on("click",function(){
                            $("#signup_container").addClass("hidden");
                            $("#login_container").removeClass("hidden");
                        });
                        $("#regcheck").on("click",function(){
                            var payload={}
                            payload.id = ($("#signup_container #regid")[0]).value;
                            payload.pwd = ($("#signup_container #regpwd")[0]).value;
                            var cpwd = ($("#signup_container #regcpwd")[0]).value;
                            payload.email = ($("#signup_container #regemail")[0]).value;
                            if(payload.pwd == cpwd)
                            {
                                /*  Anjali on 16/07/19
                                var xhttp = new XMLHttpRequest();
                                xhttp.open("GET", requestHeader+host+"/register/"+payload.id+"/"+payload.email+"/"+payload.pwd+"/", false);
                                xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                                console.log('########################################in register ')
                                xhttp.send();
                                console.log(xhttp.responseText);
                                */
                                var xhttp = new XMLHttpRequest();
                                console.log('########################################before hittiing register ')
                                xhttp.open("POST", requestHeader+host+"/register/", false);

                                xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                                xhttp.send(JSON.stringify({"id" : payload.id,"pwd":payload.pwd,"email" : payload.email}));
                                console.log(xhttp.responseText);

                                //xhttp.send(payload);





                                if((xhttp.status!=500 )&& !(xhttp.responseText.failure)){
                                    userAlert("Success : User request sent for approval ","success");

                                }
                                else{
                                   userAlert("Failure : "+responseText.msg,"failure");
                                }
                            }
                            else{
                                userAlert("Failure : Passwords do not match ","failure");
                            }
                        });

                    });
                    document.getElementById("submit").addEventListener("click", function(){
                      // console.log('sxdcfgvuhiytfghjiuytfrd')
                    //    alert('inside submit')
                      //  if (event.keyCode === 13) {

                        //alert('enter is pressed');

                        //}
                        var xhttp = new XMLHttpRequest();
                        var uid = document.getElementById("userid").value;
                        var pwd = document.getElementById("pwd").value;
                        //setTimeout(function(){show(["loading"]);hide(["particles-js","login_container"]);},0);
                        xhttp.open("POST", requestHeader+host+"/login_get_data/", false);
                        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        //xhttp.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        xhttp.send(JSON.stringify({"username":uid,"pwd":pwd}));
                        console.log(xhttp.responseText);
                        if((xhttp.status!=500 )&& xhttp.responseText && JSON.parse(xhttp.responseText).pwd){
                            console.log(xhttp.responseText);
                            hide(["loading"]);
                            if((JSON.parse(xhttp.responseText).firstLogin)==null || (JSON.parse(xhttp.responseText).firstLogin).toLowerCase()=="true"){
                                window.location.pathname = "resetPwd";
                                setCookie("uid",uid,2)
                            }
                            else{
                                userData.accName = JSON.parse(xhttp.responseText).accName;
                                ModuleSelectionModal(JSON.parse(xhttp.responseText).adminAccess,JSON.parse(xhttp.responseText).domainTabs,JSON.parse(xhttp.responseText).accName,uid);

                            }

                        }
                        else{
                            userAlert("Wrong username password combination","failure");
                            show(["login_container"]);
                            hide(["loading"]);
                        }
                                }
                        )
                },3000);
            }
        }
        else if(currentPath =="/KnowledgeRepo/" || currentPath =="/KnowledgeRepo"){
            if(!(getCookie("userId"))){
                alert("Please login first ");
                window.location.pathname = "login";
            }
            else{
                console.log("inside document KnowledgeRepo module");
                debugger;

                setTimeout(function(){
                    document.getElementById("logout").addEventListener("click", function(){
                    setCookie("userId","",0);
                    setCookie("userdata","",0);
                    window.location.pathname = "/login";
                });
                    $(".glyphicon.glyphicon-circle-arrow-right.icons").on("click",function(){
                        $(".uploadSection").addClass("hidden");
                        $(".searchBox").removeClass("hidden");

                    });
                    $(".glyphicon.glyphicon-circle-arrow-left.icons").on("click",function(){
                        $(".uploadSection").removeClass("hidden");
                        $(".searchBox").addClass("hidden");
                    });
                    $(".form-container .submit button").on("click",function(){
                    console.log("listener for submission attached")
                    var payload = {};
                    var err=0;
                    var formFields = $(".form-container .sec:not('.last')")
                    for(var i =0;i<formFields.length;i++){
                        payload[formFields[i].classList[0]] = ($(formFields[i]).find("input")[0])?($(formFields[i]).find("input")[0]).value :($(formFields[i]).find("textarea")[0]).value
                        if(payload[formFields[i].classList[0]]==""){
                            formFields[i].style.background = "red";
                            userAlert("Field cannot be left empty","failure");
                            break;
                        }
                    }
                    if(!err){
                        var date = new Date();
                        payload["fileid"]=($(".form-container #fileConnectorId")[0]).value;
                        payload['optFlag'] = payload["fileid"] ? 1:0;
                        payload['fileid'] =date.getTime() + payload['title'];
                        var xhttp = new XMLHttpRequest();



                        xhttp.open("POST",requestHeader+host+"/submitForm/", false);
                        //xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        console.log('$$$$$$$$$$$$$$$$payload')
                        console.log(payload)
                        //xhttp.send(payload);
                        //xhttp.send(JSON.stringify({"id" : payload.fileid}));
                        xhttp.send(JSON.stringify(payload));
                        console.log(xhttp.responseText);
                        //xhttp.send(JSON.stringify(payload));

                        //xhttp.send(JSON.stringify({"sub" : email.sub,"msg":email.msg,"email" : email.mailid}));
                        xhttp.onreadystatechange = function() { // Call a function when the state changes.
                            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        // Request finished. Do processing here.
                                userAlert("Record has been successfully updated ","success");
                                window.location.pathname = "KnowledgeRepo";//console.log(this.response);
                            }
                        }
                        //console.log(results);
                    }


                });
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
        function setGraphsJSON(){
            graphsJSON={
                'scatter':{'name':'Scatter','type':'scatter','mode':'lines+markers'},
                'bar':{'name':'Bar','type':'bar','mode':''},
                'dot':{'name':'Dot','type':'scatter','mode':'markers'},
                //'pie':{'name':'Pie','type':'pie','mode':''},
                'pointcloud':{'name':'Point Cloud','type':'pointcloud','mode':'',"constraint":"NOTEXT"},
                'line':{'name':'Line','type':'scatter','mode':'lines'},
                'histogram':{'name':'Histogram','type':'histogram','mode':''}
            }

        }
        function createLink(data){
            data = data.split(",");
            var urlData ="";
            for (i=0;i<data.length;i++){
                urlData=urlData+"-"+(data[i]).trim();
            }
            console.log(urlData);
            return urlData.slice(1);

        }

        function getDomainTableData(domain,accName){
            var xhttp = new XMLHttpRequest();

            xhttp.open("POST", requestHeader+host+"/getDomainData/", false);
                        //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        //xhttp.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            xhttp.send(JSON.stringify({"domain":domain,"accName":accName}));
            console.log(xhttp.responseText);
            domainTabs = createLink((JSON.parse(xhttp.responseText)).domainTabs);
            console.log(domainTabs);
            userData.domain=domain;
            userData.domainTabs = domainTabs;
            userData.domainTabs.split("-")
            //var tabDet = (userData.domainTabs).split("-");
            console.log('usertables are')
            console.log(userData.domainTabs.split("-"));
            xhttp.open("POST", requestHeader+host+"/getTabData/", false);
                        //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                        //xhttp.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            xhttp.send(JSON.stringify({"domainTabs":domainTabs,"accName":accName}));
            console.log(xhttp.responseText);
            userData.tabData = (JSON.parse(xhttp.responseText));
            //dtyp = (JSON.parse(xhttp.responseText));
            console.log('datatype is here')
            console.log(userData.tabData)
            //JSON.parse(tabData["ZTIL_2type"]).type

            //userData.tabData = reformatJSON(tabData);
            setCookie("userdata",JSON.stringify(userData),10);
            setCookie("dummy",JSON.stringify(userData),100);
            setCookie("xsj",(userData),100);
            setCookie("rest","(userData)",100);
            localStorage.setItem('userdata', JSON.stringify(userData));
                        //console.log(xhttp.responseText);

        }
        function ModuleSelectionModal(isAdmin,domainTabs,accName,uid){
            $(".module.modal-overlay").removeClass("hidden");
            $(".module.modal-overlay .module-container").empty();
            for(var i =0;i<((Object.keys(modulesJSON)).length);i++){
                if(((modulesJSON[Object.keys(modulesJSON)[i]]).adminAccess && isAdmin) || !(modulesJSON[Object.keys(modulesJSON)[i]]).adminAccess)
                var optionBlock = $("<a href='"+(modulesJSON[Object.keys(modulesJSON)[i]]).link+"'><div class='opt-list'><p>"+(modulesJSON[Object.keys(modulesJSON)[i]]).name+"</p></div></a>");
                $(".module.modal-overlay .module-container").append(optionBlock);
            }

            if(isAdmin){
                setCookie("admin",uid,1);
                //        window.location.pathname="/admin/";
                }
                else{
                setCookie("userId",uid,5); /*-----------------------5mins expiry time ---------------------------------------*/
                getDomainTableData(domainTabs,accName);
               // window.location.pathname="/KnowledgeRepo/";
                setGraphsJSON();
            }
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
            userAlert("Welcome again " + user,"failure");
          } else {
             user = prompt("Please enter your name:","");
             if (user != "" && user != null) {
               setCookie("username", user, 30);
             }
          }
        }

/* changes by arghya*/
        function populatePopup(selector,data,id,secondary){
            var layoutString = "<div class='container'><div class='left-panel'></div><div class='right-panel'><div class='add-data-panel'><h4>ADD</h4><div class='dropzone'></div></div><div class='merge-data-panel'><h4>MERGE</h4><div class='dropzone'></div></div></div></div>"
            //var doc = new DOMParser().parseFromString(layoutString, "text/xml");
            console.log($(layoutString));
            !($("#layover_popup .container .left-panel .table").length && ($("#layover_popup .container .left-panel .table")).remove()) && ($("#layover_popup")).append($(layoutString));
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
                userData.conn[userData.dataCount++]={"table" : dropObj.innerHTML,"x":"","y":"","tableId" : "table"+userData.dataCount,"graphId":"graph"+userData.dataCount};
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
            var dtype =userData.tabData.if_local? (userData.tabData[newProps.table+"type"]).type:(userData.tabData[newProps.table+"type"]).DATA_TYPE_NAME;
            console.log(dtype);
            var columns =Object.keys((userData.tabData[newProps.table]));
            if (dtype[columns.indexOf(connProps.x)] != "TEXT"){
                isMatch = (dtype[columns.indexOf(newProps.x)] == "TEXT")?false:true;
            }
            if ( (dtype[columns.indexOf(connProps.y)] != "TEXT") && isMatch ){
                isMatch = (dtype[columns.indexOf(newProps.y)] == "TEXT")?false:true;
            }
            return isMatch ;
    }

    function splitColon(str){
        var data = (str.substring((str.indexOf(":")+1),str.length)).trim();
        console.log(data);
        return data;
    }
    function toggleSelection(event,connProps,graph){
        //var selectList=[];
        var obj = ($(event.target)).hasClass("conn-table")?($(event.target)):($(event.target)).parents(".conn-table");
        var isMatch = checkType(connProps,{"table":splitColon(((obj[0]).getElementsByClassName("tabName")[0]).innerHTML) , "x" :splitColon(((obj[0]).getElementsByClassName("xname")[0]).innerHTML) , "y":splitColon(((obj[0]).getElementsByClassName("yname")[0]).innerHTML) });
        if((obj[0]).style.backgroundColor =="red"){
            (obj[0]).style.backgroundColor=isMatch?"green":"red";
            (userData.mergedConn[userData.mergeCount]) = (userData.mergedConn[userData.mergeCount])?(userData.mergedConn[userData.mergeCount]) : [];
            isMatch && ((userData.mergedConn[userData.mergeCount])).push({"graphId" :graph,"connID" :(userData.conn[(obj[0]).classList[1]]).connID,"xdata" :(userData.conn[(obj[0]).classList[1]]).xdata,"ydata" :(userData.conn[(obj[0]).classList[1]]).ydata,"tableId" :(userData.conn[(obj[0]).classList[1]]).tableId ,"table":splitColon(((obj[0]).getElementsByClassName("tabName")[0]).innerHTML) , "x" :splitColon(((obj[0]).getElementsByClassName("xname")[0]).innerHTML) , "y":splitColon(((obj[0]).getElementsByClassName("yname")[0]).innerHTML) });
            !(isMatch) && userAlert("incompatible datatypes","failure");
        }
        else{
            var index = ((userData.mergedConn[userData.mergeCount])).indexOf({"table":splitColon(((obj[0]).getElementsByClassName("tabName")[0]).innerHTML) , "x" :splitColon(((obj[0]).getElementsByClassName("xname")[0]).innerHTML) , "y":splitColon(((obj[0]).getElementsByClassName("yname")[0]).innerHTML) });
            (userData.mergedConn[userData.mergeCount]).splice(index,1);
             (obj[0]).style.backgroundColor="red";
        }
        return (userData.mergedConn[userData.mergeCount]);

    }

    function userAlert(msg,msgclass){
        msgclass = msgclass.toLowerCase();
        $("#userAlert").addClass(msgclass);
        ($("#userAlert .h3")[0]).innerHTML  = msg;
        setTimeout(function(){$("#userAlert").removeClass("success");$("#userAlert").removeClass("failure");},6000);
        $("#userAlert #closeMsg").on("click",function(){$("#userAlert").removeClass("success");$("#userAlert").removeClass("failure");});
    }
    function getYdata(table){
        var ydata=[];
        //var str ="";
          obj = ((userData.tabData[(table).table]))[table.y];
        ydata=(Object.keys(obj).map(function(k) { return obj[k] }));
        //return str.substr(0,(str.length)-1);
        console.log(ydata);
        return ydata;
    }
     function getXdata(table){
        var xdata=[];
        //var str ="";

        obj = ((userData.tabData[(table).table]))[table.x];
        xdata=(Object.keys(obj).map(function(k) { return obj[k] }));
        //str=str+"{ y :["+ydata[i]+"]},";

        //return str.substr(0,(str.length)-1);
        console.log(xdata);
        return xdata;
    }
    function getConnsByKey(key,value,getOnlyMerged,getOnlyOriginal){
        var conns=[];
        if(!getOnlyMerged)
        {
            for (var i =0 ;i <getSize( userData.conn);i++){
                if(((userData.conn)[i])[key]==value){
                    conns.push((userData.conn)[i]);
                }
            }
        }
        if(!getOnlyOriginal)
        {
            for (var i =0 ;i <getSize( userData.mergedConn);i++){
                if((((userData.mergedConn)[i])[0])[key]==value){
                    ((userData.mergedConn)[i][0]).traceId=((userData.mergedConn)[i]).traceId
                    conns.push(((userData.mergedConn)[i])[0]);
                }
            }
        }
        return conns;
    }
    function getMaxTrace(connArr){
        var maxTrace = 0 ;
        for(var i=0; i <getSize(connArr);i++){
            maxTrace = ((connArr[i]).traceId && (maxTrace < (connArr[i]).traceId)) ? (connArr[i]).traceId : maxTrace;
        }
        return maxTrace;
    }
    function selectConn(open,targetGraph,connProps,mergeList){
        if(mergeList){
            //var targetGraph = (($(e.target)).parents(".container")).id;
            for(var i =0;i<mergeList.length;i++){
                var ydata = getYdata(mergeList[i]);
                var xdata = getXdata(mergeList[i]);
                (userData.mergedConn[userData.mergeCount]).traceId = getMaxTrace(getConnsByKey("graphId",targetGraph))+1;;
                Plotly.addTraces(targetGraph,{x: xdata,y: ydata});

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
                var selectionColor =  isTableSelected((userData.conn[i]).connID)?"green":"red";
                (connDiv[0]).style.backgroundColor = (selectionColor);
                connDiv.on("click",function (){toggleSelection(event,connProps,targetGraph);console.log((userData.mergedConn[userData.mergeCount]));});
            }
            userData.currentTarget = targetGraph;
            //$("#selectConn #savexy").addClass(targetConn.graphId);
            $("#selectConn #savexy").on("click",function(){selectConn("",userData.currentTarget,"",(userData.mergedConn[userData.mergeCount]));})
        }
        else{
            $("#selectConn").innerHTML = "";
            $("#selectConn").addClass("hidden");
            $(".modal-overlay").addClass("hidden");
        }
    }
    function isTableSelected(connID,target){
        var isSelected=false;
        for(var i =0;i<getSize(getConnsByKey("connID",connID,true));i++){
            if(target==(getConnsByKey("connID",connID,true)[i]).graphId){
                isSelected=true;
            }
        }

        return isSelected;
    }
    function editModal(modalObj){
        //var indexstr = (($(modalObj).data()).uiDraggable.eventNamespace);
        userData.tempIndex = parseFloat(modalObj.data);
        var table = (modalObj).innerHTML;
        $("#edit_modal h3").innerHTML = table;
        generateSelectInput("true","#edit_modal","X",(JSON.parse(userData.tabData[table])));
        generateSelectInput("true","#edit_modal","Y",(JSON.parse(userData.tabData[table])));
        setGraphsJSON();
        generateSelectInput("true","#edit_modal","type",graphsJSON);
        $("#popup_overlay").removeClass("hidden");
        $("#edit_modal").removeClass("hidden");
        console.log(userData.tempIndex+"  sdfghjk    "+table);
        ($("#edit_modal select.X")[0]).value = (userData.conn[userData.tempIndex]).x;
        ($("#edit_modal select.Y")[0]).value = (userData.conn[userData.tempIndex]).y;
        ($("#edit_modal select.type")[0]).value = (userData.conn[userData.tempIndex]).type;

        $("#edit_modal .save").on("click", function () {
            userData.tempIndex = parseFloat(userData.tempIndex) || 0;
            var x= ($("#edit_modal select.X")[0]) && ($("#edit_modal select.X")[0]).value;
            var y= ($("#edit_modal select.X")[0]) && ($("#edit_modal select.Y")[0]).value;
            var gtype= ($("#edit_modal select.type")[0]) && ($("#edit_modal select.type")[0]).value;
            (userData.conn[userData.tempIndex]).x=gtype || (userData.conn[userData.tempIndex]).type;
            (userData.conn[userData.tempIndex]).y=gtype || (userData.conn[userData.tempIndex]).type;
            generateTable(userData,userData.conn[userData.tempIndex]);
            //generateGraph();--pass graph id
            $(("#"+userData.conn[userData.tempIndex]).tableId+" .editable-tab").change(function(e) {
                console.log($(e.target));
                console.log(e);
                var id = (($(e.target)).parents("table")[0]).id
                //check in which connection objects does id of modified table occur
                //var connID = id.substr((id.length)-1);
                updateGraph($(e.target),getConnsByKey("tableId",id));
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
                $("#data-holder ."+(userData.conn[userData.tempIndex]).graphId).remove();
                $("button."+(userData.conn[userData.tempIndex]).connID).remove();
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
 function validateGraphType(table,x,y,gtype){
     debugger;
    var xtype =userData.tabData.if_local? (((userData.tabData[table+"type"])).type)[search("COLUMN_NAME",x,(userData.tabData[table+"type"]))]: (((userData.tabData[table+"type"])).DATA_TYPE_NAME)[search("COLUMN_NAME",x,(userData.tabData[table+"type"]))];
    var ytype =userData.tabData.if_local?(((userData.tabData[table+"type"])).type)[search("COLUMN_NAME",y,(userData.tabData[table+"type"]))]:(((userData.tabData[table+"type"])).DATA_TYPE_NAME)[search("COLUMN_NAME",y,(userData.tabData[table+"type"]))];

    var constraint =(graphsJSON[gtype]).constraint || "";
    var isValid = false;
    switch(constraint){
        case "":
            isValid= true;
            break;
        case "NONUMBER":
            if(xtype=="TEXT" && ytype=="TEXT")
                isValid= true;
            break;
        case "NOTEXT":
            if(xtype!="TEXT" && ytype!="TEXT")
                isValid= true;
            break;
        case "SAMETYPE":
            if(xtype== ytype)
                isValid= true;
            break;
    }
    return isValid;

 }
 function getRandomColor(){
    var color="#"+(Math.floor((Math.random() * 100)))%10+(Math.floor((Math.random() * 100)))%10+(Math.floor((Math.random() * 100)))%10+(Math.floor((Math.random() * 100)))%10+(Math.floor((Math.random() * 100)))%10+(Math.floor((Math.random() * 100)))%10;
    console.log(color);
    return color;

 }
 function selectXY(tableName,close,save){
    if(close){
        if(save){
            var x= ($("#selectxy select.X")[0]) && ($("#selectxy select.X")[0]).value;
            var y= ($("#selectxy select.Y")[0]) && ($("#selectxy select.Y")[0]).value;
            var gtype= ($("#selectxy select.type")[0]) && ($("#selectxy select.type")[0]).value;
            gtype = graphsJSON[gtype].type;
            if (validateGraphType(tableName,x,y,gtype))
            {
                (userData.conn[userData.dataCount-1]).x=x || (userData.conn[userData.dataCount-1]).x;
                (userData.conn[userData.dataCount-1]).y=y || (userData.conn[userData.dataCount-1]).y;
                (userData.conn[userData.dataCount-1]).type=gtype || (userData.conn[userData.dataCount-1]).type;
                       // loadGraph(userData);
                $(".dataTable-holder").append($("<div class='data-holder "+(userData.conn[userData.dataCount-1]).graphId+"' id='data-holder' style='background : "+getRandomColor()+";'></div>")[0]);

                generateTable(userData,userData.conn[userData.dataCount-1]);
                //generateGraph();--pass graph id
                $("#"+userData.conn[userData.dataCount-1].tableId +" .editable-tab").change(function(e) {
                    console.log($(e.target));
                    console.log(e);
                    var id = (($(e.target)).parents("table")[0]).id
                    var connID = id.substr((id.length)-1);
                    updateGraph($(e.target),getConnsByKey("tableId",id));
                    //updateStatsView($(e.target));
                });
                loadGraph(userData,userData.conn[userData.dataCount-1]);
                closeModal("selectxy");
            }
            else{
                userAlert(gtype+" graph does not work with the given datatypes. Constraints are : "+graphsJSON[gtype].constraint,"failure");
                userData.conn[userData.dataCount--]={};                             //remove table from dropzone
            $(".add-data-panel .dropzone ."+tableName).remove();
            closeModal("selectxy");
            }
        }
        else{
            userData.conn[userData.dataCount--]={};                             //remove table from dropzone
            $(".add-data-panel .dropzone ."+tableName).remove();
            closeModal("selectxy");
        }

    }
    else{
        generateSelectInput(true,"#selectxy","X",((userData.tabData[tableName])));
        generateSelectInput(true,"#selectxy","Y",((userData.tabData[tableName])));
        setGraphsJSON();
        generateSelectInput("true","#selectxy","type",(graphsJSON));
        ($(".selectxy")).removeClass("hidden");
        $(".modal-overlay").removeClass("hidden");
        ($(".saveXY")).off("click");
        ($(".closeXY")).off("click");
        $("#selectxy .saveXY").addClass(tableName);
        ($("#selectxy .saveXY")).on("click",function(ev){
            selectXY((ev.target).classList[1],true,true);
        });
        ($("#selectxy .closeXY")).on("click",function(){
            selectXY(tableName,true,false);
        });
    }
 }


/*function selectCommonColumn(table){

}*/
function RadioBtnHandler(dataInKey,selector,name,data,fetch,reset){


    if(fetch){
        var values=[];
        var radioBtns = $(selector).find(".auto-radio");
        for(var i=0;i<radioBtns.length;i++){
            if(radioBtns[i].checked){
                values.push(radioBtns[i].value);
            }
            if(reset){
               radioBtns[i].checked =false;
            }
        }
        return values;

    }
    else{
        data = dataInKey? Object.keys(data):data;
        //console.log(data);
        //console.log(inputDiv);
        for(var i =0; i <data.length;i++){
            var inputDiv=$( "<div style='width:80%'><input type='radio' class = 'auto-radio "+ data[i]+"' value='"+data[i]+"'>"+data[i]+"</input></div>");
            //var optselector = "select.select."+name;
            //var selectTag = $(inputDiv.find(optselector));
            $(selector).append((inputDiv));
        }
    }
}
function search(nameKey,value, myArray){
    var i = -1;
    //var n=myArray.length;
    /*if (typeof(myArray) == "object"){
        n=getSize(myArray);
    }*/
    var n=myArray.length;
    if(nameKey && myArray[nameKey]!=undefined){
        n=myArray[nameKey].length;
    }
    for (var i=0; i < n; i++) {
        if(nameKey){
            if(myArray[nameKey]==undefined){
                if (myArray[i][nameKey] === value) {
                return i;
                }
            }
            else{
                if (myArray[nameKey][i] === value) {
                return i;
                }

            }

        }
        else{
           if (myArray[i] == value) {
                return i;
           }
        }
    }
}
        function generateSelectInput(dataInKey,selector,name,data)
        {
        data = dataInKey? Object.keys(data):data;
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
    if(selector)
        {$(selector).append(inputDiv);}
    else
        return inputDiv[0];

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

    function normaliseJSONData(tabData){
            var keys = Object.keys(tabData);
            for(var i=0 ; i <keys.length;i++){
                if(Object.hasOwnProperty(tabData[keys[i]])){
                    tabData[key[i]] = (tabData[key[i]])[key[i]];
                }
            }
            return tabData;
        }
    function reformatJSON(JSONobj,table){
        var tempObj={}
        //var tables = Object.keys(JSONobj);
        //for(var i =0;i<tables.length;i++){
           var columns = Object.keys((JSONobj[table])[0]);
           for(var k=0;k<columns.length;k++){
               tempObj[columns[k]]=[];
               for(var j=0;j<getSize(JSONobj[table]);j++){
                   tempObj[columns[k]].push(((JSONobj[table])[j])[columns[k]]);
               }
           }
           return tempObj;
        //}
    }
        function reformatJSON(JSONobj,mergeData){
        var tempObj={}
        var tables = Object.keys(JSONobj);
        if(mergeData){
            var records= (Object.keys(JSONobj)).length;
            for(var k=0;k<records.length;k++){
               tempObj[tables[i]][records[k]]=[];
               for(var j=0;j<getSize(JSONobj[tables[i]]);j++){
                   tempObj[tables[i]][records[k]].push(((JSONobj[tables[i]])[j])[records[k]]);
               }
           }

        }
        else{
            for(var i =1;i<(tables.length)-3;i++){
            tempObj[tables[i]]={};
            var columns = Object.keys((JSONobj[tables[i]])[0]);
            for(var k=0;k<columns.length;k++){
               tempObj[tables[i]][columns[k]]=[];
               for(var j=0;j<getSize(JSONobj[tables[i]]);j++){
                   tempObj[tables[i]][columns[k]].push(((JSONobj[tables[i]])[j])[columns[k]]);
               }
           }
        }

        }
        return tempObj;
    }
    function generateTable(data,conn){
            console.log(conn);
            //var columns = Object.keys(JSON.parse(data.domainTabs));
           // data.tabData[conn.table] =reformatJSON(data.tabData,conn.table);//.replace(/NaN/g,"null");
            var columns =Object.keys((data.tabData[conn.table]));
            var tabData = ((data.tabData[conn.table]));
            tabData = normaliseJSONData(tabData);
            //(tabData['Id'])=(tabData['Id'])['Id']?(tabData['Id'])['Id']:(tabData['Id']);

            //Create code to search server response and match data accordingly , ignoring server-key mismatches
            (userData.conn[data.dataCount-1]).connID = conn.tableId+conn.x+conn.y+conn.graphId;
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
            (userData.conn[userData.dataCount-1]).connID = conn.tableId+conn.x+conn.y+conn.graphId;
			var tabContainer = ($("<div class='table-container-div "+conn.tableId+"'></div>"));
            (tabContainer).append(table);
            $("button."+conn.connID).length && $("button."+conn.connID).remove();
            (tabContainer).append($("<button value = 'merge' class='"+conn.connID+" glyphicon glyphicon-link conn-btn'></button>"));
            //($(".dataTable-holder")).append(tabContainer);
            ($("#data-holder."+conn.graphId)).append(tabContainer);
            ($(".dataTable-holder button."+conn.connID)).on("click",function (ev){
                $("#MergeModal").removeClass("hidden");
                $("#MergeModal").addClass(($(ev.target)[0]).classList[0]);
                $("#MergeModal").addClass((($(ev.target)).parents(".data-holder")[0]).classList[1]);
                $("#loading .modal-overlay").removeClass("hidden");
                //$("#MergeModal").append($("<div class='button-container'><button class='tab graph fas fa-columns'></button><button class='tab graph fas fa-chart-line'></button></div>")[0]);
                $("#MergeModal .tab.mergeTable").on("click",function(){
                    var connID = ($("#MergeModal")[0]).classList[1];
                    selectTableForMerge("open",connID,userData);
                     $("#MergeModal").addClass("hidden");
                    $("#loading .modal-overlay").addClass("hidden");
                });
                $("#MergeModal .tab.mergeGraph").on("click",function(ev){
                    var id =  ($("#MergeModal")[0]).classList[2];
                //check in which connection objects does id of modified table occur
                    var connID = id.substr((id.length)-1);
                    selectConn(true,id,{"x":userData.conn[connID-1].x,"y":userData.conn[connID-1].y},false);
                     $("#MergeModal").addClass("hidden");
                    $("#loading .modal-overlay").addClass("hidden");

                });
                $("#MergeModal #closeMergeModal").on("click",function(){
                    $("#MergeModal").addClass("hidden");
                    $("#loading .modal-overlay").addClass("hidden");
                });

                //for(var i = 0 ;i<getSize(userData.))
                //($(ev.target)).parents()
            })
            //(document.getElementsByClassName("dataTable-holder")[0]).append(table);
        }



    function selectTableForMerge(modalAction,connID,data){
        userData.connectionToMerge =getConnsByKey("connID",connID,false,true);
        var tableList=[];
        var colList=[];
        switch(modalAction){
            case 'open':
                var btnsLayout = $("<button id= 'savexyMerge',class='saveXY'>SAVE</button><button id= 'closexyMerge',class='closeXY'>CLOSE</button>");
                ($("#mergeTab .btnContainer")[0]).innerHTML = "";
                $("#mergeTab .btnContainer").append(btnsLayout);
                var selectedTables = (((getConnsByKey("connID",connID,false,true))[0]).table).split("-");

                $("#mergeTab").removeClass("hidden");
                ($("#mergeTab .inner-container").length) && ($("#mergeTab .inner-container").remove());
                var layoutString = $("<div class='inner-container'></div>");
                var tables = (data.domainTabs).split("-");
                for(var i =0 ; i <tables.length;i++){
                    var tableElement = generateSelectInput(true,false,tables[i],((data.tabData)[tables[i]]));
                    var MasterTab = generateSelectInput(false,false,"MasterTable",(userData.domainTabs).split("-"));

                    ($("#mergeTab")).append(layoutString);
                    var bgColor =(selectedTables.indexOf(tables[i])!=-1)?"green": "red";

                    //userData.currentMergeSelection[key]= (((($(ev.target)).parents(".table"))[0]).getElementsByTagName("select")[0]).value;

                    ($("#mergeTab .inner-container")).append($("<div class='table "+connID+"' style='background-color:"+bgColor+";'><p>"+tables[i]+"</p></div>"));
                    ($("#mergeTab .inner-container .table")[i]).append(tableElement);

                    //layoutString.append(tString);
                }
                ($("#mergeTab .inner-container")).append(MasterTab);
                ($("#mergeTab .inner-container")).append($("<input type='checkbox' name='exclude' id='exclude'><p> Exclude unmatching data</p>"));

                ($("#mergeTab .inner-container .table")).on("click",function (ev){
                    var parent = ($(ev.target)).hasClass("table") ? ($(ev.target)[0]) :((($(ev.target)).parents(".table"))[0]);
                    var key = parent[0]?((parent[0]).getElementsByTagName("p")[0]).innerHTML : (parent.getElementsByTagName("p")[0]).innerHTML;
                        if(parent.style.backgroundColor== "red"){

                            //commonColumnModal(tString.innerHTML);
                            userData.currentMergeSelection[key]= (((($(ev.target)).parents(".table"))[0]).getElementsByTagName("select")[0]).value;


                           parent.style.backgroundColor="green";
                        }
                        else{
                            //var index = ;
                            //var ele =( $(ev.target)).hasClass("table")?$(ev.target):$(ev.target).parents(".table");
                            //(userData.currentMergeSelection).splice(((userData.currentMergeSelection).indexOf((ele).innerHTML)),1
                            delete userData.currentMergeSelection[key];
                            console.log(userData.currentMergeSelection);
                            parent.style.backgroundColor="red";

                        }
                    });
                ($("#mergeTab .inner-container .table select:not('.MasterTable')")).on("change",function (ev){
                    console.log(ev);
                    if(userData.currentMergeSelection[(($(ev.target)[0]).classList)[1]]){
                        userData.currentMergeSelection[(($(ev.target)[0]).classList)[1]]=($(ev.target)[0]).value;
                    }

                });
                $("#mergeTab #savexyMerge").addClass(connID);
                $("#mergeTab #closexyMerge").addClass(connID);

                $("#mergeTab #savexyMerge").on("click",function (){selectTableForMerge("save",connID,(userData.currentMergeSelection));});
                $("#mergeTab #closexyMerge").on("click",function (){selectTableForMerge("cancel",connID,false);});
                //var preSelectedTabs = ((((getConnsByKey("connID",connID,false,true))[0]).table).split("-"));
                for(var i=0;i<selectedTables.length;i++){
                    userData.currentMergeSelection[selectedTables[i]]=($(".table."+connID+" .select-input."+selectedTables[i]+" select")[0]).value;
                }
                break;

            case 'save':
                    var exclude = ($('#exclude').is(":checked")) ? "inner":"left";
                    var masterTab = ($("select.select.MasterTable")[0]).value
                    //console.log(userData.currentMergeSelection)
                    var tables = ((Object.keys(userData.currentMergeSelection)).join("-"));
                    var cols = (Object.values(userData.currentMergeSelection)).join("-");
                    var url = requestHeader+host+"/getMergeData/";
                    console.log(url);
                                        //      START OF DATATYPES FOR MERGED TABLE (anjali)
                    if(tables.length<2 || cols.length<2){
                        userAlert("Error : No tables to merge ","failure");
                    }
                    else{
                    //      END OF DATATYPES FOR MERGED TABLE (anjali)
                        var type = "";
                        //var isMatch = true;
                        if(checkMergeCompatibility((Object.keys(userData.currentMergeSelection)),(Object.values(userData.currentMergeSelection))))
                        {
                            ((userData.connectionToMerge)[0]).table = tables;
                            //debugger;
                            var xhttp = new XMLHttpRequest();
                            //tables = userData.currentMergeSelection;
                            //cols=[];
                            //exclude=['left','ZGSFC_1']
                            console.log('%%%%%%%%%%%%%%%%%heer goes the data to be sent in link')
                            //console.log(tables)
                            //console.log(cols)
                            //console.log(exclude)
                            xhttp.open("POST",url, false);

                            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                            xhttp.onreadystatechange = function() { // Call a function when the state changes.
                                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                                // Request finished. Do processing here.
                                userData.tabData[((userData.connectionToMerge)[0]).table]=reformatJSON(JSON.parse(this.response),true);
                                    console.log(this.response);
                                    generateTable(userData,userData.connectionToMerge[0]);
                                    //debugger;
                                }
                            }
                            //console.log(results);
                            xhttp.send(JSON.stringify({"tables":tables,"cols":cols,"exclude":exclude+"-"+masterTab,"accName":userData.accName}));
                            $("#mergeTab").addClass("hidden");
                        }
                        else{
                            userAlert("Datatypes from selected columns does not match ","failure");
                        }
                    }

                    break;

            case 'cancel':
                    $("#mergeTab").addClass("hidden");

                    //closeModal
                    break;


                //var connDiv = $("<div class='conn-table "+ i+"' style='background-color:red;'><span class='tabName'> Table :"+ (userData.conn[i]).table+"</span> <span class='xname'>X axis :"+ (userData.conn[i]).x+"</span><span class='yname'> Y axis :"+ (userData.conn[i]).y+"</span></div>");
                //$("#selectConn .modal-container").append(connDiv);
                //var selectionColor =  isTableSelected((userData.conn[i]).connID)?"green":"red";
                //(connDiv[0]).style.backgroundColor = (selectionColor);



        }


    }
    function checkMergeCompatibility (tables,cols){
        for(i=0;i<tables.length-1;i++){
            var type = userData.tabData.if_local? Object.values(((userData.tabData[tables[i]+"type"]).type))[Object.values(((userData.tabData[tables[i]+"type"]).COLUMN_NAME)).indexOf(cols[i])]:Object.values(((userData.tabData[tables[i]+"type"]).DATA_TYPE_NAME))[Object.values(((userData.tabData[tables[i]+"type"]).COLUMN_NAME)).indexOf(cols[i])];
            var nextType =userData.tabData.if_local?Object.values(((userData.tabData[tables[i+1]+"type"]).type))[Object.values(((userData.tabData[tables[i+1]+"type"]).COLUMN_NAME)).indexOf(cols[i+1])]:Object.values(((userData.tabData[tables[i+1]+"type"]).DATA_TYPE_NAME))[Object.values(((userData.tabData[tables[i+1]+"type"]).COLUMN_NAME)).indexOf(cols[i+1])];
            if(type!=nextType){
                print("first type :"+type);
                print("next type :"+nextType);
               return false
               }
            }
        return true;
    }

    /* function generateTableSelectElement(tableName){
        generateTableSelectElement

     }*/
        function loadGraph(df,conn){
            console.log(df);
            //console.log(df[x]);
            //var xhttp = new XMLHttpRequest();
            (userData.conn[userData.dataCount-1]).traceId = (userData.conn[userData.dataCount-1]).traceId || 0;
            var x= conn.x;
            var y= conn.y;
            var table=conn.table;
            //conn.graph = "bar";
            //var graph = "bar";
            var obj = ((df.tabData[table])[x]);
            var xdata = Object.keys(obj).map(function(k) { return obj[k] });
            (userData.conn[userData.dataCount-1]).xdata =xdata;
            obj = ((df.tabData[table])[y]);
            var ydata = Object.keys(obj).map(function(k) { return obj[k] });
            (userData.conn[userData.dataCount-1]).ydata =ydata;
            drawGraph({"x":xdata,"y":ydata,"type":conn.type,"id":conn.graphId});
            //(userData.conn[userData.dataCount-1]).traceId = ((userData.conn[userData.dataCount-1]).traceId)++ ;
           /* $("#update-graph .container.js-plotly-plot").on("click",function(e){
                var id = (($(e.target)).parents(".container")[0]).id;
                //check in which connection objects does id of modified table occur
                var connID = id.substr((id.length)-1);
                selectConn(true,id,{"x":userData.conn[connID-1].x,"y":userData.conn[connID-1].y},false);

            });*/



        }

        function mergeTrace(event,open){
            var isTable = ((($(event.target)[0]).parents(".dataTable-holder")).length);
            var toolTip = $("div class='tooltip "+conn.table+"'><div class='tooltip-children'> Merge</div></div>");


        }
        function drawGraph(data){
        console.log(data);
            if(data.id){
                if((graphsJSON[data.type])["mode"]){
                    data["mode"]=(graphsJSON[data.type])["mode"];
                }
                var graphContainer= $("<div class = 'container' id = '"+data.id+"'></div>");
                //($("#update-graph")).append(graphContainer) ;
                debugger;
                ($("#data-holder."+data.id)).append(graphContainer) ;
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
            xhttp.open("POST",requestHeader+host+"/graph/", false);

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
            /*console.log(requestHeader+host+"/graph/"+results+"/");
            xhttp.open("GET", requestHeader+host+"/graph/"+results+"/", false);
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
                            window.location.pathname="/dash";
                        }
        */
        }

        function updateGraph(target,con){
                    for(var i =0 ; i<getSize(con);i++){
                        var conn= con[i];
                        setGraphsJSON();
                        var gmode =(graphsJSON[conn.type])["mode"] || "";
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
                           !(target[0].value) && userAlert("Please enter numeric value only","failure");
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
                        //Plotly.update(conn.graphId, {"x":conn.xdata,"y":conn.ydata}, {}, conn.traceId);
                        Plotly.deleteTraces(conn.graphId, conn.traceId);
                        Plotly.addTraces(conn.graphId,{x :conn.xdata, y :conn.ydata,type:conn.type,mode:gmode});
                        Plotly.moveTraces(conn.graphId, -1, [conn.traceId]);
                       // Plotly.update('graph1',{x :conn.xdata, y :conn.ydata}, {}, 0);
                        //drawGraph({"x":conn.xdata,"y":conn.ydata,"type":conn.graph,"id":conn.graphId});
            }
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
            if(window.location.pathname != "/dash" && window.location.pathname != "/dash/"){
                window.location.pathname = "/dash";
                console.log("current location : "+window.location.pathname);
            }
            console.log("login user");
            setTimeout(function(){
             document.getElementById("logout").addEventListener("click", function(){
                    setCookie("userId","",0);
                    setCookie("userdata","",0);
                    localStorage.clear();
                    window.location.pathname = "/login";
                });
            document.getElementById("addConn").addEventListener("click",function(){
                       togglePopup(true);
                    });
            document.getElementById("close-btn").addEventListener("click",function(){
                       togglePopup(false);
                    });

            },4000);
        }
});