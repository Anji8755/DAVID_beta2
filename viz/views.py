import mimetypes

from django.http.response import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .server import server,app
from django.http import JsonResponse
import pandas as pd
from django.db import connection,IntegrityError
import json
import plotly.graph_objs as go
from datetime import datetime
import mail
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt

import os
import requests
import numpy
import math, random


def fetch_data(q,returnNull,configObj={}):
    result={}
    print(configObj)
    print(q)

    #returnNull = True in insert and delete
    if(configObj and configObj["key"]) :
        try:
            with connection.cursor() as cursor:
                cursor.execute(q)
                result={}
                if not returnNull:
                    result = pd.read_sql(
                    sql=q,
                    con=connection
                    )
                cursor = connection.cursor()
        except IntegrityError:
            print('inetgrity error ocuured')
            rollback(configObj)
            return {"failure":True}
    else:
        with connection.cursor() as cursor:
            cursor.execute(q)
            result={};
            if not returnNull:
                result = pd.read_sql(
                sql=q,
                con=connection
                )
            cursor = connection.cursor()

    return result


def multiDB(requests,methods=['GET']):
    print('###############################Initializing...')

    import pandas as pd
    from sqlalchemy import SQLAlchemy
    import pyodbc

    SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
        username="Anjirwt17",
        password="AnjiMysql",
        hostname="Anjirwt17.mysql.pythonanywhere-services.com",
        databasename="Anjirwt17$comments",

    )

    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db = SQLAlchemy(app)



    #db1 = sqlalchemy.create_engine("mssql+pyodbc://user:password@db_one")
    #db2 = sqlalchemy.create_engine("mssql+pyodbc://user:password@db_two")   ##########  our db
    metadata = sqlalchemy.MetaData()
    print('#########################Writing...')

    query = '''SELECT * FROM Anjirwt17$comments.Bot'''
    df = pd.read_sql(query, db)
    df.to_sql('Bot', db2, schema='Anjirwt17$comments', index=False, if_exists='replace')

    print('(1) Bot copied.')


    table = Table('test_table', metadata, autoload=True, autoload_with=db1)
    table.create(engine=db2)
    for rec in select(table1): table2.insert(rec)

    return HttpResponse('some coding is left in multi db function ')

def test_cr(request,methods=['GET']):
    print('########test_cr') 
    q=(f'''  create table viz_testuser1(Userid,UserDomain,UserName,Password,Email,AccountName,firstLogin) ''')
    print(q)
    _=fetch_data(q,True)
    error={'failure':False , 'msg': 'successfully created','path':os.getcwd()}
    return JsonResponse(error)

def test_qu(request,methods=['GET']):
    import os
    print("Path at terminal when executing this file")
    print(os.getcwd() + "\n")

    print("This file path, relative to os.getcwd()")
    print(__file__ + "\n")

    print("This file full path (following symlinks)")
    full_path = os.path.realpath(__file__)
    print(full_path + "\n")

    print("This file directory and name")
    path, filename = os.path.split(full_path)
    print(path + ' --> ' + filename + "\n")

    print("This file directory only")
    print(os.path.dirname(full_path))
    
    query=(f''' INSERT INTO viz_testuser1(Userid,UserDomain,UserName,Password,Email,AccountName,firstLogin) VALUES(999,'mydom999','dom999','zxcvbnm','anjirwt8755@gmail.com','acc999','True')''')
    print(query)
    fetch_data(query,True)
    #val = pd.DataFrame(fetch_data(query,True))
    #print(val)
    error={'failure':False , 'msg': 'successfully inserted','path':os.getcwd()}
    return JsonResponse(error)

def test(request,methods=['GET']):
    from pathlib import Path
    print('In order to get current working directory ',Path.cwd()) 
    print('To get an absolute path to your script file',Path(__file__).resolve())
    print('to get path of a directory where your script is located',Path(__file__).resolve().parent)
    query=(f''' SELECT * FROM viz_testuser ''')
    print(query)
    print("##################inside test ")
    #query=(f''' SELECT * FROM parser_metadata ''')
    #print(query)
    val = pd.DataFrame(fetch_data(query,False))
    print(val)
    error={'failure':False , 'msg': val.to_json(),'platform':'app engine'}
    return JsonResponse(error)



def test1(request,methods=['GET']):
    from pathlib import Path
    print('In order to get current working directory ',Path.cwd()) 
    print('To get an absolute path to your script file',Path(__file__).resolve())
    print('to get path of a directory where your script is located',Path(__file__).resolve().parent)
    query=(f''' SELECT * FROM viz_testuser1 ''')
    print(query)
    print("##################inside test ")
    #query=(f''' SELECT * FROM parser_metadata ''')
    #print(query)
    val = pd.DataFrame(fetch_data(query,False))
    print(val)
    error={'failure':False , 'msg': val.to_json(),'platform':'app engine'}
    return JsonResponse(error)







# define Python user-defined exceptions
class Error(Exception):
   """Base class for other exceptions"""
   pass
class ValueTooSmallError(Error):
   """Raised when the input value is too small"""
   pass
class ValueTooLargeError(Error):
   """Raised when the input value is too large"""
   pass


def test_view (request,methods=["GET"]):
    number = 10
    while True:
       try:
           i_num = int(input("Enter a number: "))
           if i_num < number:
               raise ValueTooSmallError
           elif i_num > number:
               raise ValueTooLargeError
           break
       except ValueTooSmallError:
           print("This value is too small, try again!")
           print()
       except ValueTooLargeError:
           print("This value is too large, try again!")
           print()
    print("Congratulations! You guessed it correctly.")

################################    REGISTER   ##########################3
@csrf_exempt
def reg(request,methods=['POST']):
    print('insisde reg post')

    print(request.body)
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    print(body['id'])
    error={'failure':False , 'msg': 'reg executed successfully'}
    return JsonResponse(error)

@csrf_exempt
def dummyAPI(request,methods=['POST']):

    error={'failure':False}
    return JsonResponse(error)

@csrf_exempt
def sendquery(request,methods=['POST']):
    body_unicode = request.body.decode('utf-8')
    bodyCont = json.loads(body_unicode)
    query= (f''' SELECT UserName, Email FROM viz_testuser where UserDomain='Admin' ''')  #or Email='{email}'
    print(query)
    sendTo=[]
    body=[]
    admins = pd.DataFrame(fetch_data(query,False))
    for idx,val in enumerate(admins):
                print('################inside enumerate(admins)')
                sendTo.append(admins.get_value(idx,"Email"))
                msg = "<b>Hello"+ admins.get_value(idx,"UserName") +"<p>Email of user : "+ bodyCont['email']+"</p><br><p>Category : "+bodyCont['category']+"</p><br><p>Subject of message : "+bodyCont['sub']+"</p><br><p> Body of message : "+bodyCont['msg']
                body.append(msg)
    sendTo.append(bodyCont['cc'])
    mail.mailer(sendTo,body,"Query submitted to DAVID ")
    subDict = {"Report an Issue" : "Issue","Ask a Query" : "Query","Share a Suggestion":"Suggestion"}
    userBody = "<p> Hello user ,</p><br><p>Your "+subDict[bodyCont['category']]+"has been submitted to successfully to DAVID </p>"

    mail.mailer([bodyCont['email']],[userBody],subDict[bodyCont['category']]+" submitted to DAVID ")
    return JsonResponse({"failure":False})
@csrf_exempt
def checkEmails(request,methods=['POST']):
    import re
    print('insisde reg post')

    print(request.body)
    failure=False;
    msg="all users are valid "
    #count=0
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    email = (body['user'])
    print(body['user'])
    regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    if not(re.search(regex,email)):
            failure=True;
            #defaulters.push(email)
            #count=count+1
    query = (f''' select * from viz_testuser where Email='{email}' ''')
    regUser = pd.DataFrame(fetch_data(query,False))
    if not regUser.empty :
        failure :True
    error={'failure':failure , 'msg': msg}
    return JsonResponse(error)

@csrf_exempt
def getAccData(request):
    query = (f''' select AccName, Domain from AccDet''')
    result  =pd.DataFrame(fetch_data(query,False))
    return JsonResponse(result)


@csrf_exempt
def submitForm(request,methods=['POST']):
    print('$$$$$$$$$$$$$$$$$$inside submitForm')
    body_unicode = request.body.decode('utf-8')
    bodyCont = json.loads(body_unicode)

    print(body_unicode)

    print(bodyCont)
    print('fileid: ',bodyCont['fileid'])
    print('title',bodyCont['title'])
    print('iss_desc',bodyCont['issue_description'])
    print('iss_dom',bodyCont['issue_domain'])
    print('iss_mod',bodyCont['issue_module'])
    print('cust',bodyCont['customer'])
    print('log_dt',bodyCont['log_date'])
    print('rep',bodyCont['reproduce'])
    print('res',bodyCont['resolve'])
    print('auth',bodyCont['author'])
    if bodyCont['optFlag']:
        query =(f''' INSERT INTO KEDB_Tab(FileId,Title,Desc,Domain,Module,Customer,LogDate,StepsReproduce,StepsResolve,FiledBy) values('{bodyCont['fileid']}','{bodyCont['title']}','{bodyCont['issue_description']}','{bodyCont['issue_domain']}','{bodyCont['issue_module']}','{bodyCont['customer']}','{bodyCont['log_date']}','{bodyCont['reproduce']}','{bodyCont['resolve']}','{bodyCont['author']}')  ''')
    else:
        query =(f''' INSERT INTO KEDB_orphan(FileId,Title,Desc,Domain,Module,Customer,LogDate,StepsReproduce,StepsResolve,FiledBy) values('{bodyCont['fileid']}','{bodyCont['title']}','{bodyCont['issue_description']}','{bodyCont['issue_domain']}','{bodyCont['issue_module']}','{bodyCont['customer']}','{bodyCont['log_date']}','{bodyCont['reproduce']}','{bodyCont['resolve']}','{bodyCont['author']}')  ''')
    print(query)
    fetch_data(query,True)
    error={'msg':'successfullly inserted into KEDB'}
    return JsonResponse(error)


@csrf_exempt
def register(request,methods=['POST']):
    print('$$$$$$$$$$$$$$$$$$inside register first')
    body_unicode = request.body.decode('utf-8')
    bodyCont = json.loads(body_unicode)
    username=bodyCont['id']
    email=bodyCont['email']
    pwd=bodyCont['pwd']

    print(username, email,pwd)
    emails=[]
    body=[]

    query= (f''' SELECT * FROM viz_testuser where UserName ='{username}'  ''')   #or Email='{email}'
    print(query)
    regUser = pd.DataFrame(fetch_data(query,False))
    print(regUser)

    if not regUser.empty:
        error={'failure':True,'msg': 'reguser already present in viz_testuser'}
        #return JsonResponse(error)
    else:
        print('$$$$$$$$$$$$$$$$$$inside register')
        query= (f''' SELECT * FROM RegTable where UserName ='{username}'  ''') #or Email='{email}'
        print(query)
        regUser = pd.DataFrame(fetch_data(query,False))
        print(regUser)
        if not regUser.empty:
            error={'failure': True,'msg':'user already present in regtable'}
            #return JsonResponse(error)
        else:
            query= (f''' INSERT INTO RegTable (UserName,Password,Email) values('{username}','{pwd}','{email}') ''')
            print(query)
            fetch_data(query,True)
            msg_reguser="<b>Hello "+username+" ,</b> <br><p> <span style = 'color :blue ;' >Welcome to DAVID</span> This request has been sent to the admin for approval. We will get back to you soon.</p><br><p>Have a great day ahead !</p><br><p>Thanks and Regards</p><br><p>DAVID</p>"
            sub_reguser="Successfully sent Registration request"

            mail.mailer([email],[msg_reguser],sub_reguser)

                ########### to fetch all admins
            adminQuery= (f''' SELECT UserName, Email FROM viz_testuser where UserDomain='Admin' ''')
            admins = pd.DataFrame(fetch_data(adminQuery,False))
            #emails.append(email)
            body.append("<b>Hello "+username+" ,</b> <br><p> <span style = 'color :blue ;' >Welcome to DAVID</span> This request has been sent to the admin for approval. We will get back to you soon.</p><br><p>Have a great day ahead !</p><br><p>Thanks and Regards</p><br><p>DAVID</p>")
            for idx,val in enumerate(admins):
                print('################inside enumerate(admins)')
                emails.append(admins.get_value(idx,"Email"))
                msgbody="<b>Hello"+ admins.get_value(idx,"UserName") +",</b> <br><p> <span style = 'color :blue ;' >Welcome to DAVID</span> New request has been raised by "+username+" with "+email+" for approval.</p><br><p>Have a great day ahead !</p><br><p>Thanks and Regards</p><br><p>DAVID</p>"
                print(msgbody)
                print(idx)
                body.append(msgbody)
            sub_admin='Registration Request'
            mail.mailer(emails,body,sub_admin)
            error={'failure':False , 'msg': 'user succesfully registered'}
    return JsonResponse(error)


@csrf_exempt
#def delData(request,user_id,username,action,remarks,methods=['GET']):
def delData(request,methods=['POST']):
    print("body of req:",request.body)
    body_unicode = request.body.decode('utf-8')
    print("body_unicode",body_unicode)
    bodyCont = json.loads(body_unicode)
    print("bodyCont",bodyCont)
    user_id=bodyCont['admin']
    username=bodyCont['username']
    action=bodyCont['action']
    remarks=bodyCont['remarks']

    print('##################inside dalData')
    initquery=(f''' SELECT UserDomain from viz_testuser WHERE Userid ='{user_id}' ''')
    df= pd.DataFrame(fetch_data(initquery, False))
    #df.to_dict()
    print(df.get_value(0,"UserDomain"))
    if (df.get_value(0,"UserDomain"))=='Admin':

        initquery=(f''' SELECT * FROM RegTable where UserName ='{username}' ''')
        print(initquery)
        initdf=pd.DataFrame(fetch_data(initquery,False))
        print(initdf)
        print("[initdf.get_value fo email",[initdf.get_value(0,"Email")])


        query=(f''' DELETE FROM RegTable WHERE UserName ='{username}'  ''')
        print(query)
        fetch_data(query,True)
        #now = datetime.now()
        now = datetime.now()
        timestamp=now.strftime('%Y-%m-%d   %H:%M:%S') + ('-%02d' % (now.microsecond / 10000))
        content="Timestamp : "+timestamp+'...........'+"Admin Name : " +user_id+'........'+"User Name : "+username+'...........'+"Action Taken : "+action+"............................"+"With Remarks : "+remarks
        print(content)
        print(type(content))
        print("curr dir is:",os.getcwd())
        f = open(os.getcwd()+"/dash-django-example/dash_test/viz/adminLogs/adminLogDetails.txt", "a+")
        cont=f.read()
        print('################## read content of admin log is')
        print(cont)
        f.write(content)
        f.write('\n')
        print('##################write content of admin log is')
        print(cont)
        f.close()

        print('#################################    extracting email for user inside deldata')

        msg_reguser="<b>Hello "+username+" ,</b> <br><p> <span style = 'color :blue ;' >Welcome to DAVID</span> Your request has been declined.</p><br><p>Remarks : "+remarks+"</p><br><p>Have a great day ahead !</p><br><p>Thanks and Regards</p><br><p>DAVID</p>"
        sub_reguser="Request Declined"

        mail.mailer([initdf.get_value(0,"Email")],[msg_reguser],sub_reguser)
        error={'failure':False,'msg':'Successfully deleted User'}


    else:
        error={'failure':True,'msg':'You are not Admin'}
    return JsonResponse(error)
@csrf_exempt
#def addData(request,user_id,username,domain,remarks,methods=['GET']):
def addData(request,methods=['POST']):
    print('#################################    INSIDE addData')
    body_unicode = request.body.decode('utf-8')
    bodyCont = json.loads(body_unicode)

    username=bodyCont['username']
    domain=bodyCont['domain']
    remarks=bodyCont['remarks']

    initquery=(f''' SELECT * FROM RegTable where UserName ='{username}' ''')
    initdf=pd.DataFrame(fetch_data(initquery,False))

    domVal={'TIL':1,'GSFC':2}
    userid=str(domVal[domain])+(str(datetime.timestamp(datetime.now()))).split('.')[0]
    query=(f''' INSERT INTO viz_testuser(Userid,UserDomain,UserName,Password,Email) VALUES({userid},'{domain}','{username}','{initdf.get_value(0,"Password")}','{initdf.get_value(0,"Email")}')''')
    print(query)
    fetch_data(query,True)
    #delquery=(f''' DELETE FROM RegTable where UserName='{username}' ''')
    #print(delquery)
    #fetch_data(delquery,True)
    msg_reguser="<b>Hello "+username+" ,</b> <br><p> <span style = 'color :blue ;' >Welcome to DAVID</span> Your request has been approved.</p><br><p>Please login with user ID : "+userid+"<br><p>Remarks : "+remarks+"</p><br><p>Have a great day ahead !</p><br><p>Thanks and Regards</p><br><p>DAVID</p>"
    sub_reguser="Request Approved"

    mail.mailer([initdf.get_value(0,"Email")],[msg_reguser],sub_reguser)
    error={'failure':True,'msg':'New User added to viz_testuser'}
    return JsonResponse(error)
@csrf_exempt
def fetch_regtab(request, methods=['POST']):

    print('############inside fetch_regtab')
    print(request)
    data = request.POST
    print(type(data))
    print('#######################data is')
    print(data)
    print('Date now: %s' % datetime.now())
    query=(f''' SELECT * FROM RegTable ''')
    df=pd.DataFrame(fetch_data(query, False))
    query2 = (f''' select AccName, Domain from AccDet''')
    result  =pd.DataFrame(fetch_data(query2,False))
    return JsonResponse({"table":df.to_dict(),"accData":result.to_dict()})

@csrf_exempt
def draw_season_points_graph(request,methods=['POST']):
    print("result for updation is : ")
    #print(results['opponent'])
    print(request.POST)
    data = json.loads(request.body)
    print('#######################request.body')

    print()
    print (data["xdata"])
    print (data["ydata"])
    print (data["graph"])

    #print((request.POST['results']))
    #print(json.dumps(results))
    xdata =(data["xdata"])
    ydata =(data["ydata"])
    graph =(data["graph"])
    if  graph=="bar-chart":
        #print(dates)
        print(graph)
        figure = go.Figure(
        data=[
            go.Bar(x=xdata, y=ydata)
        ],
        layout=go.Layout(
            title='Points Accumulation',
            showlegend=True
            )
        )
    else:
         figure = go.Figure(
        data=[
            go.Scatter(x=xdata, y=ydata, mode='lines+markers')
        ],
        layout=go.Layout(
            title='Points Accumulation',
            showlegend=False
        )
    )



    return JsonResponse(figure,safe=False)

@csrf_exempt
def login_get_data(request):
    print("in login_get_data api")
    print('#################################    INSIDE addData')
    body_unicode = request.body.decode('utf-8')
    bodyCont = json.loads(body_unicode)
    user_id=bodyCont['username']
    pwd = bodyCont['pwd']
    isLegalUser=False;
    respData=''
    if request.method=='POST':
        initquery = ( f''' SELECT DISTINCT Userid FROM viz_testuser''' )
        legalUsers = pd.DataFrame(fetch_data(initquery,False))
        print(legalUsers)
        for x in range(legalUsers.shape[0]):
            print('444444444444444444444    inside for ')
            print(type(user_id))
            print(type(legalUsers.get_value(x,"Userid")))
            if user_id==(str(legalUsers.get_value(x,"Userid"))):
                isLegalUser=True
                print("legal user")

        if isLegalUser :
            query = ( f''' SELECT DISTINCT * FROM viz_testuser WHERE Userid='{user_id}' ''' )
            #query = ( f''' SELECT DISTINCT GrpTab FROM UserGroup WHERE UserDomain=(SELECT DISTINCT UserDomain FROM viz_testuser WHERE Userid='{user_id}') ''' )
            userlist = pd.DataFrame(fetch_data(query,False))
            print('########################userlist is')
            print(userlist)


            if  not(userlist.empty) :
                respData = {"pwd":""}
                #respData['pwd'] = (userlist.get_value(0,"Password"))
                userDomain =(userlist.get_value(0,"UserDomain"))
                accName =(userlist.get_value(0,"AccountName"))
                varfirstLogin =(userlist.get_value(0,"firstLogin"))
                respData['firstLogin']=varfirstLogin
                respData['domainTabs'] = userDomain
                respData["pwd"]=False
                respData["accName"]=accName
                ##################  START OF ADMIN ACCESS ANJALI (07.08.19)
                print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
                print(userlist.get_value(0,"UserDomain"))
                if ((userlist.get_value(0,"UserDomain"))=='Admin') and (pwd ==(userlist.get_value(0,"Password"))) :

                    respData['adminAccess']=True
                    print('###################### respData.admin')
                    print(respData['adminAccess'])
                    respData["pwd"]=True
                ##################  END OF ADMIN ACCESS ANJALI (07.08.19)

                #print(respData['domainTabs'])
                #tableData = getTableData(respData['domainTabs'])
                #if  not(usrGrp.empty) :
                 #   for item in usrGrp:
                  #      query=( f''' SELECT DISTINCT * FROM '{item}' ''')
                   #     #print(query)
                    #    tabData  = pd.DataFrame(fetch_data(query))
                     #   print(tabData)
                      #  respData['tabData'].append(tabData)
                elif  (pwd ==(userlist.get_value(0,"Password"))):
                    respData['pwd']=True

            else:
                return HttpResponse('get worked')
        #print(respData)
            return JsonResponse(respData)
        else:
            return JsonResponse({"msg":"user  does not exist"})

@csrf_exempt
def getDomainData(request):
    print("in domainData api")
    body_unicode = request.body.decode('utf-8')
    bodyCont = json.loads(body_unicode)
    domain=bodyCont['domain']
    accName=bodyCont['accName']
    tableName = accName+"Role"
    if request.method=='POST':
        print("starting delay")
        #time.sleep(5)
        print("ending delay")
        respData = {"domainTabs":""}
        domainArr = domain.split("-")

        for item in domainArr:
            #respData['domainTabs'] ="-"+respData['domainTabs']
            query = ( f''' SELECT DISTINCT GrpTab FROM '{tableName}' WHERE UserDomain='{item}' ''' )
            print(query)
            userlist = pd.DataFrame(fetch_data(query, False))
            print('########################userlist is')
            print(userlist)

            if  not(userlist.empty) :
                #respData['pwd'] = "superpwd1" #(userlist.get_value(0,"Password"))
                domainTabs =(userlist.get_value(0,"GrpTab"))
                respData['domainTabs'] =respData['domainTabs']+"-"+str(domainTabs)

        print((respData['domainTabs'])[1:])


    else:
        return HttpResponse('get worked')
    #print(respData)
    ((respData['domainTabs']))=((respData['domainTabs'])[1:])
    return JsonResponse(respData)


@csrf_exempt
def getTabData(request):
    print("in tabData api")
    body_unicode = request.body.decode('utf-8')
    bodyCont = json.loads(body_unicode)
    tables=bodyCont['domainTabs']
    accName=bodyCont['accName']
    failure=True
    msg='default'
    data='default'
    if_local=False
    if request.method=='POST':
        respData = {}

        respData['dtyp'] =None
        if (tables) :
            tables = tables.split("-")
            for item in tables:

            #  query=( f''' SELECT DISTINCT * FROM '{item}' ''')
            #  query2 = (f'''PRAGMA table_info('{item}') ''')
            #  types =pd.DataFrame(fetch_data(query2, False))

            #  tabData  = (pd.DataFrame(fetch_data(query,False))).to_json()
            #  respData[item]=(tabData)

            #  respData[item+"type"]=types.to_json()
            #  print('###################datatypes are theseeeee')
            #  print(respData[item+"type"])
            #  print('##########response to  be sent')
            #  print(respData)

              try:
                        print('HANA DB is checked')
                        #r=requests.get(url, auth=(user,pwd))
                        q=(f''' SELECT Uname, Pwd, urlTables from AccDet where AccName='{accName}' ''')
                        print(q)
                        df=pd.DataFrame(fetch_data(q,False))
                        print("df for gettabdata is: ",df)
                        if not df.empty:
                            #r=requests.get("https://system1p2000519762trial.hanatrial.ondemand.com/DAVID_API/server/tabledata.xsjs/?tableName='{table}' ", auth=('SYSTEM','Urmilesh786@gmail.com'))
                            print('checking for HANA DB is')
                            ##############changed by anji  on n3/9/19
                            tableUrl =str(df.get_value(0,"urlTables")) +"/?tableName="+item
                            print(tableUrl)
                            r=requests.get(tableUrl, auth=(df.get_value(0,"Uname"),df.get_value(0,"Pwd")))

                            ##############ended by anji  on n3/9/19
                            if r.status_code ==401:
                                msg='Invalid Credentials'
                                print(msg)
                                failure=True
                            elif r.status_code==200:
                                data=json.loads(r.text)
                                print(r.text)
                                tabData=data['content']
                                respData[item]=tabData
                                respData[item+"type"]=data['metadata']
                                for i in data['content']:
                                    print(data['content'][i])
                                    respData[item]=(tabData)
                                my_json = r.content.decode('utf8')
                                print('############my_json is:',my_json)
                                data = json.loads(my_json)
                                print(data)
                                #respData['item']=data['content']
                                print('##############data is:',msg)
                                failure=False

                            else:
                                query=( f''' SELECT DISTINCT * FROM '{item}' ''')
                                print('query is:',query)
                                query2 = (f'''PRAGMA table_info('{item}') ''')
                                print('query2 is:',query2)
                                types =(pd.DataFrame(fetch_data(query2, False))).to_json()

                                tabData  = (pd.DataFrame(fetch_data(query,False))).to_json()
                                respData[item]=json.loads(tabData)
                                respData[item+"type"]=json.loads(types)
                                print('###################datatypes are theseeeee')
                                print(respData[item+"type"])
                                print('##########response to  be sent')
                                print(respData)
                                respData['if_local']=True
                        else:
                                print('HANA URL doesnt exist getting data from local storage')
                                failure='True'
                                msg="HANA URL doesn't exist getting data from local storage"
                                #code to fill tabdata goes here




              except requests.exceptions.ConnectionError as e:
                            msg='The server has not found anything matching the URI given'
                            print(msg)
                            failure=True
              except requests.exceptions.MissingSchema as e:
                            msg='not a URL'
                            print(msg)
                            failure=True


              #break
            respData['failure']=failure
            respData['msg']=msg
            respData['data']=tables
            print('respData is:',respData)
    else:
        return HttpResponse('get worked')
    return JsonResponse((respData))



rollbackKeys={1:"",2:"",3:"",4:""}
def rollback(obj):
    print(obj['key'])
    print(obj['id'])
    print("inside rollback")
    id=(int)(obj['id'][1:])
    while (id>=1):
        rollbackQueryDict ={"r1":(f''' DELETE FROM AccDet where AccName ='{rollbackKeys[id]}' '''),"r2":(f''' DROP TABLE if exists '{rollbackKeys[id]}' '''),"r3":(f''' DROP TABLE '{rollbackKeys[id]}' '''),"r4":(f''' DELETE FROM viz_testuser where AccountName ='{rollbackKeys[id]}' ''')}

        fetch_data(rollbackQueryDict["r"+str(id)],True)
        print ("Rolled back query :")
        print(rollbackQueryDict["r"+str(id)])
        rollbackKeys[id]=""
        id=id-1
#rollbackQueryDict ={"r1":(f''' DELETE FROM AccDet where AccName ='{rollbackKeys[id]}' '''),"r2":(f''' DROP TABLE if exists '{rollbackKeys[id]}' '''),"r3":(f''' DROP TABLE '{rollbackKeys[id]}' '''),"r4":(f''' DELETE FROM viz_testuser where AccountName ='{rollbackKeys[id]}' ''')}

################   MERGE
#@csrf_exempt
def getMergeDataCOPY(request,tab,col,exclude,methods=['GET']):
    print('#########################inside getmergedata')
    print('##########tab is',tab)
    print('##########tab is',col)
    print('##########tab is',exclude)
    tables = tab.split("-")
    col = col.split("-")
    join = exclude.split("-")
    query=(f'''select distinct * from ( ''')
    end=(f''')''')
    tableUrl=''
    if request.method=='GET':
        dictResp={}
        tmp={}
        print('#############inside GET Method')
        if (len(tables)>1):
            for idx,val in enumerate(tables):
                print(val)
                #query2 = (f'''PRAGMA table_info('{val}') ''') #"SELECT DATA_TYPE_NAME,COLUMN_NAME FROM TABLE_COLUMNS where TABLE_NAME='"+ tableName+"'";
                #types =pd.DataFrame(fetch_data(query2,False))
                print(len(tables))
                if(idx<(len(tables)-1)):
                    print('###########inside if')
                    query =query+(f'''("SYSTEM"."{val}" {join[0]} join''')
                    end =(f'''on "SYSTEM"."{val}"."{col[idx]}"="SYSTEM"."{tables[idx+1]}"."{col[idx+1]}") ''')+end
                    print(query+end)
                    if val==tables[-2]:
                        query=query+(f''' "SYSTEM"."{tables[-1]}" ''')
            print("resultant query in sql is : ")
            print(query+end)
            result = pd.DataFrame(fetch_data(query+end,False))
            print('$$$$$$$$$$$$$$$$$$$$$$$$$    result')
            print(result)
            ls=[]
           # dictResp={}
            for item in result:
                print('&&&&&&&&&&#################################')
                #print(item)
               # print(type(item))
                comp=item.split(':')

                if col.count(comp[0]) <= 0 :
                    #push data in array
                    print(comp[0])
                    dictResp[comp[0]]=((result[item]).to_dict())
                    ls.append(comp[0])
                    ls.append(result[item])
                    print('%%%%%%%%%%%%%%%  APPEND IN LS')
                    #print(ls)
            #push master table coldata
            print((result).to_dict())
            print(result['Id'])
            print((result['Id']).to_dict())
            print(col[tables.index(join[1])])
            if (col[tables.index(join[1])]) == "Id" :
                print("condition match")
                dictResp[((col[tables.index(join[1])]))]=(((result[col[tables.index(join[1])]])["Id"]).to_dict())
                print((((result[col[tables.index(join[1])]])).to_dict()))
                print((((result[col[tables.index(join[1])]]).Id).to_dict()))

            else:
                dictResp[((col[tables.index(join[1])]))]=(((result[col[tables.index(join[1])]])).to_dict())
            print(dictResp)
            return JsonResponse(dictResp)
        else :


            query = (f''' select * from {tables[0]} ''')
            query2 = (f'''PRAGMA table_info('{tables[0]}') ''')
            types =pd.DataFrame(fetch_data(query2,False))
            ###################### start anjali 16/07/19
            tabData={}
            ######################end anjali 16/07/19
            tabData[tables[0]]  = (pd.DataFrame(fetch_data(query,False))).to_dict()
            tabData[tables[0]+"type"]=types.to_dict()

            return JsonResponse(tabData)



    return HttpResponse('master not available')


@csrf_exempt
def getMergeData(request):
    print('#########################inside getmergedata')
    body_unicode = request.body.decode('utf-8')
    bodyCont = json.loads(body_unicode)
    tab=bodyCont['tables']
    col=bodyCont['cols']
    exclude=bodyCont['exclude']

    accName=bodyCont['accName']##############################
    result={}
    result[tab]={}
    tables = tab.split("-")
    col = col.split("-")
    join = exclude.split("-")
    query=(f'''select distinct * from ''')
    end=(f'''''')

    tableUrl=''
    if request.method=='POST':
        print('#############inside GET Method')
        if (len(tables)>1):
            for idx,val in enumerate(tables):
                print(val)
                #query2 = (f'''PRAGMA table_info('{val}') ''') #"SELECT DATA_TYPE_NAME,COLUMN_NAME FROM TABLE_COLUMNS where TABLE_NAME='"+ tableName+"'";
                #types =pd.DataFrame(fetch_data(query2,False))
                print(len(tables))
                if(idx<(len(tables)-1)):
                    print('###########inside if')
                    query =query+(f'''("SYSTEM"."{val}" {join[0]} join''')
                    end =(f'''on "SYSTEM"."{val}"."{col[idx]}"="SYSTEM"."{tables[idx+1]}"."{col[idx+1]}") ''')+end
                    print(query+end)
                    if val==tables[-2]:
                        query=query+(f''' "SYSTEM"."{tables[-1]}" ''')
            print("resultant query in sql is : ")
            print(query+end)
            try:
                merge=query+end
                q=(f''' SELECT Uname, Pwd, urlTables from AccDet where AccName='{accName}' ''')
                print(q)
                df=pd.DataFrame(fetch_data(q,False))
                print("df for gettabdata is: ",df)
                if not df.empty:
                    #https://system1p2000519762trial.hanatrial.ondemand.com/DAVID_API/server/tabledata.xsjs
                    tableUrl =str(df.get_value(0,"urlTables")) +"/?mergeQuery="+merge
                    print("#######################tableurl is",tableUrl)
                    r=requests.get(tableUrl, auth=(df.get_value(0,"Uname"),df.get_value(0,"Pwd")))
                    print('################r.text is',r.text)
                    data=json.loads(r.text)
                    print('################data in json form is',data)
                    print (type(data['content']))
                    result[tab]=data['content']
                    print (type(data['content']))
                    for i in data['content']:
                        print(data['content'][i])
                    if r.status_code ==401:
                        result["msg"]='Invalid Credentials'
                        print(result["msg"])
                        result["failure"]=True
                    elif r.status_code==200:
                        data=json.loads(r.text)
                        print(r.text)
                        result[tab]=data['content']
                        #print('##############data is:',msg)
                        result["failure"]=False
                else:
                    result["failure"]='True'
                    result["msg"]="HANA URL does not exist"

            except requests.exceptions.ConnectionError as e:
                result["msg"]='The server has not found anything matching the URI given'
                print(result["msg"])
                result["failure"]=True
            except requests.exceptions.MissingSchema as e:
                result["msg"]='not a URL'
                print(result["msg"])
                result["failure"]=True
            ######################## ended by anji on 06/09/19
            result=data['content']
            #result = pd.DataFrame(fetch_data(query+end,False))
            print('$$$$$$$$$$$$$$$$$$$$$$$$$    result')
            print(result)
            return JsonResponse(result)
        ############added by anji on 13.09.19
        else:
            q=(f''' SELECT Uname, Pwd, urlTables from AccDet where AccName='{accName}' ''')
            print(q)
            df=pd.DataFrame(fetch_data(q,False))
            print("df for gettabdata is: ",df)
            if not df.empty:
                #https://system1p2000519762trial.hanatrial.ondemand.com/DAVID_API/server/tableName.xsjs

                tableUrl =str(df.get_value(0,"urlTables")) +"/?tableName="+tables
                print(tableUrl)
                r=requests.get(tableUrl, auth=(df.get_value(0,"Uname"),df.get_value(0,"Pwd")))
                print('################r.text is',r.text)
                data=json.loads(r.text)
                print('################data in json form is',data)
                result[tab]=data['content']
                result[tables+"type"]=data['metadata']

                for i in data['content']:
                    print(data['content'][i])
                if r.status_code ==401:
                    result['msg']='Invalid Credentials'
                    print(result['msg'])
                    result['failure']=True
                elif r.status_code==200:
                    data=json.loads(r.text)
                    print(r.text)
                    result[tab]=data['content']
                    #print('##############data is:',msg)
                    result['failure']=False
            else:
                result['failure']='True'
                result['msg']="HANA URL does not exist"

            return JsonResponse(result)

    return HttpResponse('master not available')


@csrf_exempt
def forgotPwdMail(request,methods=['POST']):
    body_unicode = request.body.decode('utf-8')
    bodyCont = json.loads(body_unicode)
    email=bodyCont['email']
    print('##################inside forgotPwd')

    query=(f''' SELECT EMAIL FROM viz_testuser WHERE Email= '{email}' ''')
    print(query)

    df=pd.DataFrame(fetch_data(query,False))
    print(df)
    print(df.empty)

    if not df.empty:
        OtpQuery=(f''' SELECT OTP,GenTime FROM OtpTab WHERE Email= '{email}' ''')
        print('OTPQuery is:',OtpQuery)
        df1=pd.DataFrame(fetch_data(OtpQuery,False))

        if df1.empty:
            print('##############OTP doesnt exist in tab')
            digits = "0123456789"
            OTP = ""
            ID=""
            for i in range(4) :
                OTP += digits[math.floor(random.random() * 10)]
                ID += digits[math.floor(random.random() * 10)]
            currentTS = datetime.now().timestamp()
            print('currentTS:',currentTS)


            initquery=(f''' INSERT INTO OtpTab (Email,OTP,GenTime) VALUES('{email}','{OTP}','{currentTS}')  ''')
            print(initquery)
            fetch_data(initquery,True)
            #print('msg to user:',msg_reguser)
            error={'failure':False , 'currentTS': currentTS,'OTP':OTP}
            print('response inside if:',error)
        else:
            digits = "0123456789"
            OTP = ""
            ID=""
            for i in range(4) :
                OTP += digits[math.floor(random.random() * 10)]
                ID += digits[math.floor(random.random() * 10)]

            currentTS = datetime.now().timestamp()
            print('currentTS:',currentTS)
            print('####################OTP already exist')
            new_time=datetime.now().timestamp()
            print('new TS is:',new_time)
            query=(f''' UPDATE OtpTab SET GenTime='{new_time}',OTP='{OTP}' WHERE Email='{email}' ''')
            fetch_data(query,True)
            #otp=df1.get_value(0,'OTP')
            error={'failure':False , 'msg': 'new OTP generated on new request','new otp':OTP,'otpid':ID}
        msg_reguser="<b>Hello,</b> <br><p> <span style = 'color :blue ;' >Welcome to DAVID</span> Your OTP for OTP ID :"+ID+" is "+OTP+". This is valid for 15 mins.</p><br><p>Have a great day ahead !</p><br><p>Thanks and Regards</p><br><p>DAVID</p>"
        sub_reguser="OTP for DAVID"
        mail.mailer([email],[msg_reguser],sub_reguser)

    else:
        error={'failure':True , 'msg':'Email ID does not exist'}
    return JsonResponse(error)

def update_aeppl(request,methods=['GET']):
        print('###############inside update_aeppl')
        query=(f''' UPDATE viz_testuser SET Userid=1355643  WHERE Email='anjali.rawat1@tcs.com' ''')
        fetch_data(query,True)
        return HttpResponse('updated aeppl')

def update_aeppl_pl(request,methods=['GET']):
        print('###############inside update_aeppl_pl')
        query=(f''' UPDATE viz_testuser SET Userid=523537  WHERE Email='pillai.sunil@tcs.com' ''')
        fetch_data(query,True)
        return HttpResponse('updated aeppl pl')

@csrf_exempt
def forgotPwdOtp(request,methods=['POST']):
    body_unicode = request.body.decode('utf-8')
    bodyCont = json.loads(body_unicode)
    email=bodyCont['email']
    otp=bodyCont['otp']
    print('##################   inside forgotPwdOtp')
    #email='anjirwt8755@gmail.com'
    print('Received OTP is:',otp)
    query=(f''' SELECT * FROM OtpTab WHERE Email= '{email}' ''')
    df=pd.DataFrame(fetch_data(query,False))
    print(df)
    print('GenTime from db is:',df.get_value(0,"GenTime"))
    print(type(df.get_value(0,"GenTime")))
    print('OTP from db is:',df.get_value(0,"OTP"))
    print(datetime.now().timestamp()-float(df.get_value(0,"GenTime")))


    if not df.get_value(0,"OTP")==otp:
        error={'failure':True , 'msg':'OTP Invalid'+df.get_value(0,"OTP")}
        print(error)
    elif datetime.now().timestamp()-float(df.get_value(0,"GenTime"))>60.00:
        error={'failure':True , 'msg':'Time Exceeded'}
        print(error)
    elif df.get_value(0,"OTP")==otp and datetime.now().timestamp()-float(df.get_value(0,"GenTime"))<60.00:
        error={'failure':False , 'msg':'Set New Pwd'}
        print(error)
    else:
        error={'failure':False , 'msg':'Some unknown condition'}
        print(error)

        return JsonResponse(error)


@csrf_exempt
def forgotPwdReset(request,methods=['POST']):
    body_unicode=request.body.decode('utf-8')
    bodyCont=json.loads(body_unicode)
    #print('#############bodyCont is: ',bodyCont)
    pwd=bodyCont['pwd']
    #uid = bodyCont['uid']

    #print('###uid is:',uid)
    if 'uid' in bodyCont:
        query=(f''' UPDATE viz_testuser SET Password='{pwd}' , firstLogin = 'False' WHERE Userid='{bodyCont['uid']}' ''')
        fetch_data(query,True)
    else :
        query=(f''' UPDATE viz_testuser SET Password='{pwd}' , firstLogin = 'False' WHERE Email='{bodyCont['email']}' ''')

        fetch_data(query,True)
        delquery=(f''' DELETE FROM OtpTab WHERE Email ='{bodyCont['email']}' ''')
        fetch_data(delquery,True)
    #print('####################### inside forgotPwdReset')
    error={'failure':False,'msg':'Successfully Reset'}
    return JsonResponse(error)

def checkaccAdmin(request,val,methods=['GET']):
    query=(f''' SELECT * FROM AccDet where AccName='{val}' ''')
    print(query)
    df=pd.DataFrame(fetch_data(query,False))
    print(df)
    return HttpResponse(df)



@csrf_exempt
def checkAcc(request,methods=['POST']):
    print('##############inside checkAcc val is')
    body_unicode=request.body.decode('utf-8')
    bodyCont=json.loads(body_unicode)
    val=bodyCont['val']

    query=(f''' SELECT * FROM AccDet where AccName='{val}' ''')
    print(query)
    df=pd.DataFrame(fetch_data(query,False))
    print(df)

    #print('GenTime from db is:',df.get_value(0,"AccName"))
    if not df.empty:
        print('exist')
        error={'failure':False,'msg': 'user already present in AccDet'}

    else:
        print('not exists')
        error={'failure':True,'msg': 'please insert user in accdet'}
    return JsonResponse(error)


@csrf_exempt   #########users doesn't contain domain, add in js
def addAccDet(request,methods=['POST']):
    body_unicode=request.body.decode('utf-8')
    payload=json.loads(body_unicode)
    print('the new bodyCont is: ',payload)
    bodyCont=payload['payload']         #main object from frontend
    failure=False
    acc=bodyCont['name']            #Account Name
    url=(bodyCont['apiUrl']).strip()
    urlTab=bodyCont['apiUrlTables']
    uname=bodyCont['uname']
    print('############Uname of hana database',uname)
    pwd=bodyCont['pwd']
    print('##############pwd of hana database',pwd)
    domTab=bodyCont['domain_tables']    #Dictionary
    tabs=bodyCont['tables']
    users=bodyCont['users']             #accObj["users"].push({"name":name,"email":email,"username":email,"pwd":pwd,"domain":domain}); LIST
    print('users of addaccdet are:',users)
    print('type of addaccdet are:',type(users))

    tabs = '-'.join([str(elem) for elem in tabs])
    print('##############domTab is',domTab)

    dom = '-'.join(list(domTab.keys()))
    query=(f''' INSERT INTO AccDet (AccName, Domain,Url,Tab,Uname,Pwd,urlTables) VALUES('{acc}','{dom}','{url}','{tabs}','{uname}','{pwd}','{urlTab}')  ''')
    r1=acc
    rollbackKeys[1]=acc
    print(query)
    failure = failure or fetch_data(query,True,{"key":r1,"query":query,"id":"r1"})
    tableName= acc+"Role"
    #createtab=(f''' CREATE TABLE IF NOT EXISTS '{tableName}'( DomId INT PRIMARY KEY, UserDomain VARCHAR NOT NULL, GrpTab varchar(100) ) ''')
    createtab=(f''' CREATE TABLE IF NOT EXISTS '{tableName}'(UserDomain VARCHAR NOT NULL, GrpTab varchar(100) ) ''')
    r2=tableName
    rollbackKeys[2]=tableName
    print(createtab)
    failure = failure or fetch_data(createtab,True,{"key":r2,"query":createtab,"id":"r2"})



    sendTo=[]
    body=[]
    r3=""
    insquery=(f''' INSERT INTO '{tableName}'(UserDomain,GrpTab) VALUES ''')
    for key, value in domTab.items():

        #a = str(datetime.timestamp(datetime.now()))
        #b = a[0:4]+a[-4:]
        #grpid=acc+b
        #print('#########grpid is:',grpid)
        t = '-'.join([str(elem) for elem in value])
        insquery=insquery+(f''' ('{key}','{t}'),''')
        # VALUES('{key}','{t}')  ''')
        r3=tableName
        rollbackKeys[3]=tableName
        print(insquery)
    insquery=insquery[:-1]
    print(insquery)
    failure = failure or fetch_data(insquery,True,{"key":r3+"Role","query":insquery,"id":"r3"})


    getmax=(f''' SELECT Userid FROM viz_testuser ORDER BY Userid DESC LIMIT 1 ''')
    df= pd.DataFrame(fetch_data(getmax,False))
    #print(df.get_value(0,"Userid"))
    if df.empty :
        last_id= 1
    else:
        last_id=df.get_value(0,"Userid")
    #last_id=""
    r4=""
    initquery=(f''' INSERT INTO viz_testuser(Userid,UserDomain,UserName,Password,Email,AccountName,firstLogin) VALUES ''')
    for item in users:        #({"name":name,"email":email,"username":email,"pwd":pwd,"domain":domain});
        #userid=str(datetime.timestamp(datetime.now())).split('.')[0]
        #print('userid of user: ',userid)
        print('###############item is:',item)
        #print('###############item type is:',type(item))

        d = '-'.join(item['domain'])
        n=item['name']
        p=item['pwd']
        e=item['email']
        u=item['username']


        #initquery=(f''' INSERT INTO viz_testuser(Userid,UserDomain,UserName,Password,Email,AccountName,firstLogin) VALUES({userid},'{item['domain']}','{item['name']}','{item['pwd']}','{item['email']}','{acc}',True)  ''')
        userid=last_id+1
        initquery=initquery+(f''' ({userid},'{d}','{u}','{p}','{e}','{acc}','True'),''')
        r4=acc
        rollbackKeys[4]=acc
        print('#################preparing to  send mail')
        sendTo.append(e)
        #mesg = "<b>Hello,  basic settings are complete."
        mesg = "<p>Hello"+ n+",</p><br><p>You are now registerd with DAVID. </p><br><p>Please note the credentials provided below for future reference :</p><br><div style='background :#aaa'><p>Account: "+acc+"</p><br><p>UserID: "+(str)(userid)+"</p><br><p>Password: "+(str)(p)+" </p><br><p>Domain : "+ d+"</p></div><br><br><p>Thanks for registering with us.</p>"
        #messg = "<p>Hello "+n+",</p><br><p>You are now registered with
        body.append(mesg)
        last_id=userid
        print('############last_id is:',last_id)
        print('############type of last_id is:',type(last_id))
        print('#################going to send mail')

        #sendTo.append(e)
    ##    mesg = "<b>Hello,  basic settings are complete."
        #mesg = "<p>Hello</p><br>"+ n+",<br><br><p>You are now registerd with DAVID. </p><br><p>Your Profile info is:<br><p>Account: "+acc+"<br>UserID: "+userid+"<br>Password: "+item['pwd']+" <span stlye = 'color:blue; '>Ohayō gozaimasu Anjali </span></p><br>Domain: "+ item['domain']+"</p><br><br><p>Thanks for registering with us.</p>"

        #body.append(mesg)
    initquery=initquery[:-1]
    print(initquery)
    msg='new account created'
    failure = failure or fetch_data(initquery,True,{"key":r4,"query":initquery,"id":"r4"})
    if (failure):
        msg="error"
    else:
        mail.mailer(sendTo,body,"You are all set to work DAVID")
        failure=False
    print('#########goin to send mail to users')
    print('############mail sent ')
    error={'failure':failure,'msg': msg}
    return JsonResponse(error)



@csrf_exempt   #########users doesn't contain domain, add in js
def addAccDet1(request,methods=['POST']):
    body_unicode=request.body.decode('utf-8')
    payload=json.loads(body_unicode)
    print('bodyCont is: ',payload)
    bodyCont=payload['payload']         #main object from frontend

    acc=bodyCont['name']            #Account Name
    url=(bodyCont['apiUrl']).strip()
    urlTab=bodyCont['apiUrlTables']
    uname=bodyCont['uname']
    print('############Uname of hana database',uname)
    pwd=bodyCont['pwd']
    print('##############pwd of hana database',pwd)
    domTab=bodyCont['domain_tables']    #Dictionary
    tabs=bodyCont['tables']
    users=bodyCont['users']             #accObj["users"].push({"name":name,"email":email,"username":email,"pwd":pwd,"domain":domain}); LIST
    print('users of addaccdet are:',users)
    print('type of addaccdet are:',type(users))

    tabs = '-'.join([str(elem) for elem in tabs])
    print('##############domTab is',domTab)

    dom = '-'.join(list(domTab.keys()))
    query=(f''' INSERT INTO AccDet (AccName, Domain,Url,Tab,Uname,Pwd,urlTables) VALUES('{acc}','{dom}','{url}','{tabs}','{uname}','{pwd}','{urlTab}')  ''')
    r1=acc
    print(query)
    fetch_data(query,True)
    tableName= acc+"Role"
    #createtab=(f''' CREATE TABLE IF NOT EXISTS '{tableName}'( DomId INT PRIMARY KEY, UserDomain VARCHAR NOT NULL, GrpTab varchar(100) ) ''')
    createtab=(f''' CREATE TABLE IF NOT EXISTS '{tableName}'(UserDomain VARCHAR NOT NULL, GrpTab varchar(100) ) ''')
    r2=tableName
    print(createtab)
    fetch_data(createtab,True)



    sendTo=[]
    body=[]
    r3=""
    for key, value in domTab.items():

        #a = str(datetime.timestamp(datetime.now()))
        #b = a[0:4]+a[-4:]
        #grpid=acc+b
        #print('#########grpid is:',grpid)
        t = '-'.join([str(elem) for elem in value])
        #insquery=(f''' INSERT INTO '{tableName}'(DomId, UserDomain,GrpTab) VALUES('{grpid}','{key}','{t}')  ''')
        insquery=(f''' INSERT INTO '{tableName}'(UserDomain,GrpTab) VALUES('{key}','{t}')  ''')
        r3=r3+"-"+tableName
        print(insquery)
        fetch_data(insquery,True)


    getmax=(f''' SELECT Userid FROM viz_testuser ORDER BY Userid DESC LIMIT 1 ''')
    df= pd.DataFrame(fetch_data(getmax,False))
    #print(df.get_value(0,"Userid"))
    if df.empty :
        last_id= 1
    else:
        last_id=df.get_value(0,"Userid")
    #last_id=""
    r4=""
    for item in users:        #({"name":name,"email":email,"username":email,"pwd":pwd,"domain":domain});
        #userid=str(datetime.timestamp(datetime.now())).split('.')[0]
        #print('userid of user: ',userid)
        print('###############item is:',item)
        #print('###############item type is:',type(item))

        d = '-'.join(item['domain'])
        n=item['name']
        p=item['pwd']
        e=item['email']
        u=item['username']


        #initquery=(f''' INSERT INTO viz_testuser(Userid,UserDomain,UserName,Password,Email,AccountName) VALUES({userid},'{item['domain']}','{item['name']}','{item['pwd']}','{item['email']}','{acc}')  ''')
        userid=last_id+1
        initquery=(f''' INSERT INTO viz_testuser(Userid,UserDomain,UserName,Password,Email,AccountName) VALUES({userid},'{d}','{u}','{p}','{e}','{acc}')  ''')
        r4=r4+"-"+userid
        print(initquery)
        fetch_data(initquery,True)
        print('#################going to send mail')
        sendTo.append(e)
        #mesg = "<b>Hello,  basic settings are complete."
        mesg = "<p>Hello"+ n+",</p><br><p>You are now registerd with DAVID. </p><br><p>Please note the credentials provided below for future reference :</p><br><div style='background :#aaa'><p>Account: "+acc+"</p><br><p>UserID: "+(str)(userid)+"</p><br><p>Password: "+(str)(p)+" </p><br><p>Domain : "+ d+"</p></div><br><br><p>Thanks for registering with us.</p>"
        #messg = "<p>Hello "+n+",</p><br><p>You are now registered with
        body.append(mesg)
        last_id=userid
        print('############last_id is:',last_id)
        print('############type of last_id is:',type(last_id))
        print('#################going to send mail')

        #sendTo.append(e)
    ##    mesg = "<b>Hello,  basic settings are complete."
        #mesg = "<p>Hello</p><br>"+ n+",<br><br><p>You are now registerd with DAVID. </p><br><p>Your Profile info is:<br><p>Account: "+acc+"<br>UserID: "+userid+"<br>Password: "+item['pwd']+" <span stlye = 'color:blue; '>Ohayō gozaimasu Anjali </span></p><br>Domain: "+ item['domain']+"</p><br><br><p>Thanks for registering with us.</p>"

        #body.append(mesg)

    print('#########goin to send mail to users')
    mail.mailer(sendTo,body,"You are all set to work DAVID")
    print('############mail sent ')
    error={'failure':False,'msg': 'new account created'}
    return JsonResponse(error)

def projectRole(request,tab,methods=['GET']):
    print('###########inside peojectRole')
    query=(f''' select * from '{tab}' ''')
    df=pd.DataFrame(fetch_data(query,False))
    return  df


@csrf_exempt
def getHanaData(request,methods=['POST']):

    body_unicode =request.body.decode('utf-8')
    bodyCont=json.loads(body_unicode)
    url=bodyCont['url']
    user=bodyCont['uname']
    pwd=bodyCont['pwd']
    print(url)
    #https://testp2001666554trial.hanatrial.ondemand.com/customer_test/server/new.xsjs
    msg=''
    data=''
    tables=[]
    failure=True
    try:
        r=requests.get(url, auth=(user,pwd))
        #r=requests.get('https://testp2001666554trial.hanatrial.ondemand.com/customer_test/server/new.xsjs', auth=('system','Python@1234567890'))
        if r.status_code ==401:
            msg='Invalid Credentials'
            print(msg)
            failure=True
        elif r.status_code==200:
            my_json = r.content.decode('utf8')
            print('############my_json is:',my_json)
            data = json.loads(my_json)
            for item in data:
                if ((((data)[item])['SCHEMA_NAME'])=="SYSTEM"):
                      print ((((data)[item])['TABLE_NAME']))
                      tables.append((((data)[item])['TABLE_NAME']))
            print('##############data is:',msg)
            failure=False


    except requests.exceptions.ConnectionError as e:
            msg='The server has not found anything matching the URI given'
            print(msg)
            failure=True
    except requests.exceptions.MissingSchema as e:
            msg='not a URL'
            print(msg)
            failure=True


    error={'failure':failure,'table':tables,'msg':msg}
    return JsonResponse(error)


def dispatcher(request):
    '''
    Main function
    @param request: Request object
    '''
    params = {
        'data': request.body,
        'method': request.method,
        'content_type': request.content_type
    }
    with server.test_request_context(request.path, **params):
        server.preprocess_request()

        try:
    #        print('#####################################inside viz.views.try block')
    #        print(server.full_dispatch_request())                           #<Response 1069 bytes [200 OK]>
            response = server.full_dispatch_request()
        except Exception as e:
            response = server.make_response(server.handle_exception(e))

        response.direct_passthrough = False
    #    print('#######################################data from response')
    #    print(response.get_data)                        #<bound method BaseResponse.get_data of <Response 1069 bytes [200 OK]>>
        return response.get_data()


@csrf_exempt
def dash_json(request, **kwargs):
    """Handle Dash JSON API requestsurm """
    #print('###################after processing /viz/_dash- the requested  url is: ')
    #print(request.get_full_path())
    return HttpResponse(dispatcher(request), content_type='application/json')


def dash_index(request, **kwargs):
    """Handle Dash CSS requests"""
    #print('##################after processing /viz/')
    return HttpResponse(dispatcher(request), content_type='text/html')


def dash_guess_mimetype(request, **kwargs):
    """Handle Dash requests and guess the mimetype. Needed for static files."""
    url = request.get_full_path().split('?')[0]
    #print('#######################aftre processing /viz/assests/ link, url is:')
    #print(url)
    content_type, _encoding = mimetypes.guess_type(url)
    return HttpResponse(dispatcher(request), content_type=content_type)

