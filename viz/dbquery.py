from django.http import JsonResponse
import pandas as pd
from django.db import connection, IntegrityError, transaction


@transaction.atomic
def fetch_data(q,returnNull):       #returnNull = True in insert and dele
    try:
        with connection.cursor() as cursor:
            cursor.execute(q)
            result={};
            if not returnNull:
                result = pd.read_sql(
                sql=q,
                con=connection
                )
            cursor = connection.cursor()
    except (sqlite.Error, e):

        if self.con:
            self.con.rollback()


        print('Exception follows:',e)

        print('Quitting...')
        sys.exit(1)
    return result

rollbackQueryDict ={"r1":(f''' DELETE FROM AccDet where AccName ='{obj.key}' '''),"r2":(f''' DROP TABLE if exists '{obj.key}' '''),"r3":(f''' DROP TABLE '{obj.key}' '''),"r4":(f''' DELETE FROM viz_testuser where AccountName ='{obj.key}' ''')}
def rollback(obj):
    id=(int)(obj.id[1:])
    while (id>=1):
        fetch_data(rollbackQueryDict["r"+str(id)],True)
        print ("Rolled back query :")
        print(rollbackQueryDict["r"+str(id)]["query"])
        id=id-1



def fetch_data(q,returnNull,configObj):
    #returnNull = True in insert and delete
    if(configObj) :
        try:
            with connection.cursor() as cursor:
                cursor.execute(q)
                result={};
                if not returnNull:
                    result = pd.read_sql(
                    sql=q,
                    con=connection
                    )
                cursor = connection.cursor();


    else:
        with connection.cursor() as cursor:
            cursor.execute(q)
            result={};
            if not returnNull:
                result = pd.read_sql(
                sql=q,
                con=connection
                )
            cursor = connection.cursor();

    return result


@csrf_exempt   #########users doesn't contain domain, add in js
def addAccDet(request,methods=['POST']):
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
    fetch_data(query,True,{"key":r1,"query":query,"id":"r1"})
    tableName= acc+"Role"
    #createtab=(f''' CREATE TABLE IF NOT EXISTS '{tableName}'( DomId INT PRIMARY KEY, UserDomain VARCHAR NOT NULL, GrpTab varchar(100) ) ''')
    createtab=(f''' CREATE TABLE IF NOT EXISTS '{tableName}'(UserDomain VARCHAR NOT NULL, GrpTab varchar(100) ) ''')
    r2=tableName
    print(createtab)
    fetch_data(createtab,True,{"key":r2,"query":createtab,"id":"r2"})



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
        print(insquery)
    insquery=insquery[:-1]
    print(insquery)
    fetch_data(insquery,True,{"key":r3,"query":insquery,"id":"r3"})


    getmax=(f''' SELECT Userid FROM viz_testuser ORDER BY Userid DESC LIMIT 1 ''')
    df= pd.DataFrame(fetch_data(getmax,False))
    #print(df.get_value(0,"Userid"))
    if df.empty :
        last_id= 1
    else:
        last_id=df.get_value(0,"Userid")
    #last_id=""
    r4=""
    initquery=(f''' INSERT INTO viz_testuser(Userid,UserDomain,UserName,Password,Email,AccountName) VALUES ''')
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
        initquery=(f''' ({userid},'{d}','{u}','{p}','{e}','{acc}'),  ''')
        r4=acc
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
    initquery=initquery[:-1]
    print(initquery)
    fetch_data(initquery,True,{"key":r4,"query":initquery,"id":"r4"})
    print('#########goin to send mail to users')
    mail.mailer(sendTo,body,"You are all set to work DAVID")
    print('############mail sent ')
    error={'failure':False,'msg': 'new account created'}
    return JsonResponse(error)


def test(request,methods=['GET']):
    query=(f''' SELECT * FROM viz_testuser ''')
    print(query)
    print("##################inside test ")
    #query=(f''' SELECT * FROM parser_metadata ''')
    #print(query)
    val = pd.DataFrame(fetch_data(query,False))
    print(val)
    error={'failure':False , 'msg': val.to_json()}
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


