#from random import randint
import dash_core_components as dcc
import dash_html_components as html
import dash_table as dt
#import time
#from . import dashapp
#import base64
from .server import app
#from .dashapp import get_divisons
#from pandas import DataFrame as df
#import os
#from django.contrib.auth.decorators import login_required


def resetPwd():
    return html.Div([
        html.Div(),
        html.Div([
            dcc.Input(id="pwd" ,placeholder="enter new password"),
            dcc.Input(id="cpwd",placeholder="confirm new password"),
            html.Button("SUBMIT",id="submit")
            ]),
        ])
def loader():
    return html.Div([
        html.Div("",className="hr"),
            html.Div(html.Img(src=app.get_asset_url('waiting_img.png'))),
            html.Div([
                html.Div([
                    html.Div([
                        html.Span(""),
                        html.I("")],
                    className="finger-item")],
                className="finger finger-1"),
                                html.Div([
                    html.Div([
                        html.Span(""),
                        html.I("")],
                    className="finger-item")],
                className="finger finger-2"),
                                html.Div([
                    html.Div([
                        html.Span(""),
                        html.I("")],
                    className="finger-item")],
                className="finger finger-3"),
                                html.Div([
                    html.Div([
                        html.Span(""),
                        html.I("")],
                    className="finger-item")],
                className="finger finger-4"),
                                html.Div([
                    html.Div([
                        html.Span(""),
                        html.I("")],
                    className="last-finger-item")],
                className="last-finger")],
            className="loading"),
        ],id="loading", className="hidden")

def parser():
    return  html.Div(

    [
                            # Select Division Dropdown
                html.Div([
                # Select Division Dropdown
                    html.Div(children="",className='glyphicon glyphicon-user',id="user"),
                    #html.Button(id="addConn",className="glyphicon glyphicon-plus-sign"),
                    html.Button(id='logout', n_clicks=0,className="glyphicon glyphicon-off"),
                ],className = 'fixed_header'),
            html.Div([
                html.H3(children="",className="h3"),
                html.Button(id="closeMsg",className="glyphicon glyphicon-close")
            ],className="userAlert",id="userAlert"),
            html.Div([html.H3(children="Connect With DAVID"),
            html.Div([
                html.Div([
                        	html.Label(" Select Category : ",style={"width":"40%"}),
                            dcc.Dropdown(
                                id='category',
                                options=[
                                    {'label': 'Report an Issue', 'value': 'Issue'},
                                    {'label': 'Ask a Query', 'value': 'Query'},
                                    {'label': 'Share a Suggestion', 'value': 'Sugestion'}
                                ],
                                value='Suggestion'
                            )],style={"display":"inline-flex","width":"100%"}),
                html.Div([html.Label(" Subject : ",style={"width":"40%"}),
                dcc.Input(id='msg_sub',placeholder='Enter Subject...')],style={"width":"100%","display":"inline-flex","padding":"10px 0px"})
                    ],className="subArea"),
                html.Div([
                        	html.Label(" Message : ",style={"width":"40%"}),
                        	dcc.Textarea(id='msg_txt',placeholder='Enter Message...')],className="msgArea"),
                html.Div([
                        	html.Label(" Email : ",style={"width":"40%"}),
                        	dcc.Input(id='msg_mail',placeholder='Enter Email...'),
                        	],style={"width":"100%","padding":"10px 0px","display":"inline-flex"}),
                html.P("* You'll receive a confirmation mail on this email . We promise not to spam you , !",style={"color":"#fff","font-size":"12px","margin-left":"105px"}),
                html.Button(children="SEND" ,className="btn send "),
                html.Button(children="CLOSE" ,className="btn closeModal ")
                    ],className="contactModal hidden"),
        html.Div([
            html.Div(children="DAVID",className="logoContainer"),
            html.Div([
                html.Span([html.A("ABOUT", href='/about')] ,className="invisble-btn about"),
                html.Span([html.A("HOME", href='/login')] ,className="invisble-btn about"),
                html.Span([
                    html.Button(children="Knowledge Base", className="invisble-btn parser")
                ]),
                html.Span([
                    html.Button(children="DASHBOARD", className="invisble-btn dash")
                ]),
                html.Span([
                    html.Button(children="CONTACT",className="invisble-btn",id="contactDavid")
                ]),
            ],className="linksContainer")
        ],className="horizontal_header"),
        html.Div([
        html.Span(className="glyphicon glyphicon-upload upload"),
        dcc.Upload(
            id="upload-data",
            children=html.Div(
                ["Drag and drop or click to select a file to upload."]
            ),
            style={
                "width": "100%",
                "height": "60px",
                "lineHeight": "60px",
                "borderWidth": "1px",
                "borderStyle": "dashed",
                "borderRadius": "5px",
                "textAlign": "center",
                "margin": "10px",
            },
            multiple=True,
        ),
        html.Div([html.Ul(id="copied-file-list")],id="copied-file-list-container"),html.Span(className="glyphicon glyphicon-circle-arrow-right icons")
        ],className="uploadSection"),

        html.Div([html.Span(className="glyphicon glyphicon-search ",style={"font-size":"50px","padding":"10px"}),
                dcc.Input(placeholder="Search for corpus here..."),
                html.Span(className="glyphicon glyphicon-circle-arrow-left icons")],className="searchBox hidden"),
        #html.H2("File List"),
        #html.Div([html.Ul(id="file-list")],id="file-list-container"),

        html.Hr(),
        html.Div([
            #todolist : check for knwoledge article and auto-fill if check return true
            html.Div([
                html.Label(children="Title"),
                dcc.Input(type="text")
            ],className="title sec"),
                        html.Div([
                html.Label(children="Description"),
                html.Textarea()
            ],className="issue_description sec"),
                        html.Div([
                html.Label(children="Domain"),
                dcc.Input(type="text")
            ],className="issue_domain sec left-half"),
                        html.Div([
                html.Label(children="Module"),
                dcc.Input(type="text")
            ],className="issue_module sec right-half"),
                        html.Div([
                html.Label(children="Customer"),
                dcc.Input(type="text")
            ],className="customer sec left-half"),
            html.Div([
                html.Label(children="Log Date"),
                dcc.Input(type="date")
            ],className="log_date sec right-half"),
            html.Div([
                html.Label(children="Steps to Reproduce"),
                html.Textarea()
            ],className="reproduce sec"),
            html.Div([
                html.Label(children="Steps to Resolve"),
                html.Textarea()
            ],className="resolve sec"),
            html.Div([
                html.Label(children="Filed By"),
                dcc.Input(type="text")
            ],className="author sec"),
            dcc.Input(id="fileConnectorId",className="hidden"),
            html.Div([
                #html.Button(children="SAVE"),
                html.Span([html.Button(children="SUBMIT", className="submit sec last")]),
                html.Span([html.Button(children="SAVE AS DRAFT", className="draft sec last")]),

            #],className="submit sec last"),
            ],className="submit sec last"),
        ],className="form-container",id="formContainer"),
    ],

    style={"max-width": "100%"},)

def admin():
    return html.Div([
        #html.Div([html.Div(children="DAVID",className="logoContainer"),
                            #html.Div([html.Span(children="ABOUT"),
        #html.Span([html.A("HOME", href='/login')] ,className="invisble-btn about"),
        #html.Span([html.Button(children="Knowledge Base", className="invisble-btn parser")]),
        #html.Span([html.Button(children="DASHBOARD", className="invisble-btn dash")]),
        #html.Span(children="SOLUTIONS"),
        #html.Span([html.Button(children="CONTACT",className="invisble-btn",id="contactDavid")])],className="linksContainer")],className="horizontal_header"),

            html.Div([
                html.H3(children="",className="h3"),
                html.Button(id="closeMsg",className="glyphicon glyphicon-close")
            ],className="userAlert",id="userAlert"),
                html.Div([
                # Select Division Dropdown
                    html.Div(children="",className='glyphicon glyphicon-user',id="user"),
                    #html.Button(id="addConn",className="glyphicon glyphicon-plus-sign"),
                    html.Button(id='logout', n_clicks=0,className="glyphicon glyphicon-off"),
                    html.Button(id='addAccount', n_clicks=0,className="addAccount button glyphicon glyphicon-plus"),
                ],className = 'fixed_header'),
                html.Div([
                        html.Div([
                            html.Div([html.H3("Welcome",className="welcomeMsg")],className="welcomeContainer left"),
                            html.Div([
                                html.H3("Account Name : ",className="accountLabel"),
                                dcc.Input(placeholder="Account Name ",className="input account")
                            ],className="accountContainer right")
                        ],className="accountModalInner0 accModal-inner"),
                        html.Div([
                            html.H3("Add Primary Fetch URL : ",className="urlLabel"),
                            dcc.Input(placeholder="https://something.com/path/server/apiFile.xsjs -- PRIMARY",className="urlInput input"),
                            dcc.Input(placeholder="https://something.com/path/server/apiFile.xsjs -- SECONDARY",className="urlInputSecondary input"),
                            dcc.Input(placeholder="username",className="unameInput input"),
                            dcc.Input(placeholder="password",className="pwdInput input",type="password")

                        ],className="accountModalInner1 accModal-inner hidden"),
                        html.Div([
                            html.Div([
                                html.H4("Domain Name ",className="domainLabel"),
                                dcc.Input(placeholder="Domain Name",className="input domain")
                            ],className="domainName left "),
                            html.Div([
                                html.H4("Select Tables ",className="tablesLabel"),
                                html.Button("add",className="addTable button glyphicon glyphicon-plus"),
                                html.Div(className="tablesHolder")
                            ],className="selectTables right"),
                            html.Button("Save & Next",className="button saveDomain")
                        ],className="accountModalInner2 accModal-inner hidden"),
                        html.Div([
                            html.H3("Add User : ",className="userLabel"),
                            dcc.Input(placeholder="Email ID",className="input email"),
                            dcc.Input(placeholder="Name",className="input name"),
                            dcc.Input(placeholder="Password",className="input password"),
                            html.Button(children="Save & Next",className ="button addUser"),
                            html.Div(className="userList")
                        ],className="accountModalInner3 accModal-inner hidden"),
                                                html.Div([
                            html.Div(className="userListCont"),
                            html.Div(className="domainListCont"),
                            html.Button(children="Save & Next",className ="button addUserDomain")
                        ],className="accountModalInner4 accModal-inner hidden"),
                        html.Div([
                            html.H3("You are all done !",className="finMsg1"),
                            html.P(className="finMsg2"),
                            html.P(className="finMsg3"),
                            html.P(className="finMsg4")
                        ],className="accountModalInner5 accModal-inner hidden"),
                            html.Button(className="nextBtn glyphicon glyphicon-play"),
                            html.Button(children="OK",className="button confirm hidden"),
                            html.Button(children="CANCEL",className="button cancel hidden"),
                    ],className="accountModalOuter hidden"),
                html.Div(className = "adminTabHolder"),
                html.Div([html.Button(children = "Refresh",id="refreshAdminList")],className = "page-footer")
            ],className= "page-body")

def login():

    #os.chdir(os.getcwd()+"/dash-django-example/dash_test/viz/assets/")
    #print(os.getcwd())
    #image_filename = 'logo.png' # replace with your own image
    #encoded_image = base64.b64encode(open(image_filename, 'rb').read())
    logloader = loader()
    print(" inside login")
    return html.Div([
            html.Div([
            html.H3(children="",className="h3"),
            html.Button(id="closeMsg",className="glyphicon glyphicon-close")
            ],className="userAlert",id="userAlert"),
            logloader,
            html.Button("testBtn",id="testapi",style={"position":"fixed","background":"black","z-index":"9999"}),
            html.Div([
                html.Ul([
                    html.Div(),
                    html.Div(),
                    html.Div(),
                    html.Div(),
                    html.Div(),
                    html.Div(),
                    html.Div(),
                    html.Div(),
                    html.Div(),
                    html.Div(),],
                className="circles")],
            className="area"),
            html.Div([html.Div([html.H3("CHOOSE MODULE"),html.Div(className="module-container")],className="outer-container")],className="modal-overlay module hidden"),
            #html.Div([html.Span(className="js-count-particles")],className="count-particles"),
            html.Div([html.Div(children="DAVID",className="logoContainer"),
                            html.Div([html.Span([html.A('ABOUT', href='/about')],className="invisble-btn about"),
        html.Span([html.A("HOME", href='/login')] ,className="invisble-btn about"),
        html.Span([html.Button(children="Knowledge Base", className="invisble-btn parser")]),
        html.Span([html.Button(children="DASHBOARD", className="invisble-btn dash")]),
        #html.Span(children="SOLUTIONS"),
        html.Span([html.Button(children="CONTACT",className="invisble-btn",id="contactDavid")]),
        html.Span([html.Button(children="LOGIN",className="btn",id="loginHead")])],className="linksContainer")],className="horizontal_header"),
            html.Div([html.H1(children="WELCOME TO DAVID"),
                    html.H6(children="Data Analytics Visualizaton & Insights Dashboard"),
                    html.Button(children="START" ,className="btn rounded login")
                ],className="greeting"),
                html.Div([html.H2("Be one of the first few to experience something awesome"),html.H4("Sign up and experience the all new Beta version")],className="betaPromo"),
                            html.Div([html.H3(children="Connect With DAVID"),
                    html.Div([
                        html.Div([
                        	html.Label(" Select Category : ",style={"width":"40%"}),
                            dcc.Dropdown(
                                id='category',
                                options=[
                                    {'label': 'Report an Issue', 'value': 'Issue'},
                                    {'label': 'Ask a Query', 'value': 'Query'},
                                    {'label': 'Share a Suggestion', 'value': 'Sugestion'}
                                ],
                                value='Suggestion'
                            )],style={"display":"inline-flex","width":"100%"}),
                        	html.Div([html.Label(" Subject : ",style={"width":"40%"}),
                            dcc.Input(id='msg_sub',placeholder='Enter Subject...')],style={"width":"100%","display":"inline-flex","padding":"10px 0px"})

                    ],className="subArea"),
                        html.Div([
                        	html.Label(" Message : ",style={"width":"40%"}),
                        	dcc.Textarea(id='msg_txt',placeholder='Enter Message...')],className="msgArea"),
                        html.Div([
                        	html.Label(" Email : ",style={"width":"40%"}),
                        	dcc.Input(id='msg_mail',placeholder='Enter Email...'),
                        	],style={"width":"100%","padding":"10px 0px","display":"inline-flex"}),
                        	html.P("* You'll receive a confirmation mail on this email . We promise not to spam you , !",style={"color":"#fff","font-size":"12px","margin-left":"105px"}),

                    html.Button(children="SEND" ,className="btn send "),
                    html.Button(children="CLOSE" ,className="btn closeModal ")
                ],className="contactModal hidden"),
            html.Div([
                #dcc.Location(id='locurl', refresh=True),
                dcc.Input(id='regid', type='text', className="left top0", placeholder = "USER ID..."),
                dcc.Input(id='regemail', type='email' ,className="left top50", placeholder = "EMAIL ID..."),
                dcc.Input(id='regpwd', type='password' ,className="left top100", placeholder = "Enter your password..."),
                dcc.Input(id='regcpwd', type='password' ,className="left top150", placeholder = "Confirm your password..."),
                #dcc.Input(type="button",id="submit" , value="Login"),
                html.Button(id='regcheck', n_clicks=0, children='SIGNUP' ,className="right bottom btn"),
                html.Button(id='gotoLogin', n_clicks=0, children='Back to Login' ,className="left bottom btn")
            ],className="signup_container hidden", id="signup_container"),
            html.Div([html.Div([dcc.Input(id='veremail', type='email' ,className="left top50", placeholder = "ENTER EMAIL ID..."),
                    html.Button(id="back2login",children="BACK TO LOGIN",className="btn left bottom20 back2login"),
                    html.Button(id="verifyemail",children="VERIFY & SEND OTP",className="btn bottom20 verifyMail")],className="firstPart hidden"),
                    html.Div([html.P(children="Email has been sent successfully !",className="msg",style={'color':'green'}),
                    html.Div(className="timerticker"),
                    dcc.Input(id='otp', type='password' ,className="left top100", placeholder = "ENTER OTP",maxLength=6),
                    html.Button(id="changeEmail",children="CHANGE EMAIL",className="btn left bottom20 changeEmail"),
                    html.Button(id="resendotp",children="RESEND OTP",className="btn resendOtp bottom20 right disabled"),
                    html.Button(id="verifyotp",children="VERIFY OTP",className="btn verifyOtp left180 bottom20")],className="secondPart hidden"),
                    html.Div([dcc.Input(id='setpwd', type='password' ,className="left top50", placeholder = "ENTER PASSWORD..."),
                    dcc.Input(id='csetpwd', type='password' ,className="left top50", placeholder = "CONFIRM PASSWORD..."),
                    html.Button(id="resetpwd",children="RESET PASSWORD",className="btn bottom20 resetpwd")],className="finalPart hidden")

                ],className="forgotPwd hidden",id="forgotPwd_container"),
            html.Div([
                dcc.Location(id='locurl', refresh=True),
                dcc.Input(id='userid', type='text', className="left" , placeholder = "USER ID..."),
                dcc.Input(id='pwd', type='password' ,className="left", placeholder = "Enter your password..."),
                #dcc.Input(type="button",id="submit" , value="Login"),
                html.Button(id='submit', n_clicks=0, children='LOGIN' ,className="left bottom btn"),
                html.Button(id='signup', n_clicks=0, children='SIGNUP' ,className="center bottom btn"),
                html.Button(id='ForgotPwd', n_clicks=0, children='Forgot Password', className="right bottom btn"),
                #dcc.Input(type="button",id="ForgotPwd",value="Forgot Password"),
                html.Div("Output", id="output-div", className="hidden"),
            ],className="login_container hidden", id="login_container"),
            ])

def dash():
    print("#######################dash function###############################")
    dashLoader = loader()
    return html.Div([
                                                       html.Div([html.H3(children="Connect With DAVID"),
                    html.Div([
                        html.Div([
                        	html.Label(" Select Category : ",style={"width":"40%"}),
                            dcc.Dropdown(
                                id='category',
                                options=[
                                    {'label': 'Report an Issue', 'value': 'Issue'},
                                    {'label': 'Ask a Query', 'value': 'Query'},
                                    {'label': 'Share a Suggestion', 'value': 'Sugestion'}
                                ],
                                value='Suggestion'
                            )],style={"display":"inline-flex","width":"100%"}),
                        	html.Div([html.Label(" Subject : ",style={"width":"40%"}),
                            dcc.Input(id='msg_sub',placeholder='Enter Subject...')],style={"width":"100%","display":"inline-flex","padding":"10px 0px"})

                    ],className="subArea"),
                        html.Div([
                        	html.Label(" Message : ",style={"width":"40%"}),
                        	dcc.Textarea(id='msg_txt',placeholder='Enter Message...')],className="msgArea"),
                        html.Div([
                        	html.Label(" Email : ",style={"width":"40%"}),
                        	dcc.Input(id='msg_mail',placeholder='Enter Email...'),
                        	],style={"width":"100%","padding":"10px 0px","display":"inline-flex"}),
                        	html.P("* You'll receive a confirmation mail on this email . We promise not to spam you , !",style={"color":"#fff","font-size":"12px","margin-left":"105px"}),


                    html.Button(children="SEND" ,className="btn send "),
                    html.Button(children="CLOSE" ,className="btn closeModal ")
                ],className="contactModal hidden"),
        html.Div([html.Div(children="DAVID",className="logoContainer"),
                            html.Div([html.Span([html.A("ABOUT", href='/about')],className="invisble-btn about"),
        html.Span([html.A("HOME", href='/login')] ,className="invisble-btn about"),
        html.Span([html.Button(children="Knowledge Base", className="invisble-btn parser")]),
        html.Span([html.Button(children="DASHBOARD", className="invisble-btn dash")]),
        #html.Span(children="SOLUTIONS"),
        html.Span([html.Button(children="CONTACT",className="invisble-btn",id="contactDavid")])],className="linksContainer")],className="horizontal_header"),

        html.Div([
            html.H3(children="",className="h3"),
            html.Button(id="closeMsg",className="glyphicon glyphicon-close")
        ],className="userAlert",id="userAlert"),
        dashLoader,
        html.Div(className="modal-overlay hidden"),
        html.Div([html.Button(children = "SAVE" ,className="saveXY", id="savexySelect"),
        html.Button(children = "CLOSE" , id="closexySelect",className="closeXY glyphicon glyphicon-close")
        ],className="selectxy hidden",id="selectxy"),

        html.Div([html.Button(children = "SAVE" ,className="saveXY", id="savexy")
        ],className="selectConn hidden",id="selectConn"),
        html.Div([html.Button(children = "CANCEL" ,className="cancel", id="closeMergeModal"),
            html.Div([html.Button(children="TABLE",className="tab mergeTable glyphicon glyphicon-list-alt"),
                html.Button(children="GRAPH" , className="tab mergeGraph glyphicon glyphicon-equalizer")
            ],className="button-container"),
        ],className="MergeModal hidden",id="MergeModal"),
        html.Div([html.Div(className="btnContainer")
        ],className="mergeTab hidden",id="mergeTab"),

        html.Div([
            html.H3(),
            html.Button(className="cancel btn btn-info" ,children ="CANCEL"),
            html.Button(className="save btn btn-success", children ="SAVE"),
            html.Button(className="delete btn btn-danger", children ="DELETE")
            #html.Button(id="add-data",children="Add Data",className = "add-data glyphicon glyphicon-plus"),
           ],id="edit_modal",className="hidden modal"),
        # Page Header
        html.Div([
        html.Div([
            html.Button(id="close-btn", children ="X"),

            #html.Button(id="add-data",children="Add Data",className = "add-data glyphicon glyphicon-plus"),
           ],id="layover_popup",className="hidden modal")],className="popup_overlay" , id="popup_overlay"),
        # Page Header
        html.Div([
            #html.Button("test",id="testbtn",onClick =testfunc()),
            html.Div([
                # Select Division Dropdown
                html.Div(children="",className='glyphicon glyphicon-user',id="user"),
                html.Button(id="addConn",className="glyphicon glyphicon-plus-sign"),
                html.Button(id='logout', n_clicks=0,className="glyphicon glyphicon-off"),

            ],className = 'fixed_header'),
            html.Div(className="stats-holder"),
                ######dataTable#####
            html.Div([
                dt.DataTable(
                    id = "match-results",
                    data=[],
                    columns=[
                        {
                        'id': 'date',
                        'name': 'date'
                        },
                        {
                        'id': 'team',
                        'name': 'team'
                        },
                        {
                        'id': 'opponent',
                        'name': 'opponent'
                        },
                         {
                        'id': 'goals',
                        'name': 'goals'
                        },
                         {
                        'id': 'goals_opp',
                        'name': 'goals_opp'
                        },
                         {
                        'id': 'result',
                        'name': 'result'
                        },
                         {
                        'id': 'points',
                        'name': 'points'
                        }],
                    filtering=False,
                    selected_rows=[],
                    style_cell={
                            'padding': '5px',
                            'whiteSpace': 'no-wrap',
                            'overflow': 'hidden',
                            'textOverflow': 'ellipsis',
                            'maxWidth': 0,
                            'height': 30,
                            'textAlign': 'left'},
                    style_header={
                            'backgroundColor': 'white',
                            'fontWeight': 'bold',
                            'color': 'black'
                    },
                    style_cell_conditional=[],
                    virtualization=True,
                    pagination_mode=False,
                    n_fixed_rows=1,
                    editable=True
                )
            ], className = "dataTable-holder"),
    ##################test#######
            # Season Summary Table and Graph
            html.Div([
                dcc.Graph(id='update-graph')


                # style={},

            ], className='six columns')
        ],className="body-content-holder"),


    ])

def about():
    print("#######################about function###############################")
    dashLoader = loader()
    return  html.Div([
                html.Div([
                    html.H3(children="",className="h3"),
                    html.Button(id="closeMsg",className="glyphicon glyphicon-close")
            ],className="userAlert",id="userAlert"),
                html.Div([html.H3(children="Connect With DAVID"),
                html.Div([
                    html.Div([
                        	html.Label(" Select Category : ",style={"width":"40%"}),
                            dcc.Dropdown(
                                id='category',
                                options=[
                                    {'label': 'Report an Issue', 'value': 'Issue'},
                                    {'label': 'Ask a Query', 'value': 'Query'},
                                    {'label': 'Share a Suggestion', 'value': 'Sugestion'}
                                ],
                                value='Suggestion'
                            )],style={"display":"inline-flex","width":"100%"}),
                    html.Div([html.Label(" Subject : ",style={"width":"40%"}),
                    dcc.Input(id='msg_sub',placeholder='Enter Subject...')],style={"width":"100%","display":"inline-flex","padding":"10px 0px"})
                        ],className="subArea"),
                html.Div([
                        	html.Label(" Message : ",style={"width":"40%"}),
                        	dcc.Textarea(id='msg_txt',placeholder='Enter Message...')],className="msgArea"),
                html.Div([
                        	html.Label(" Email : ",style={"width":"40%"}),
                        	dcc.Input(id='msg_mail',placeholder='Enter Email...'),
                        	],style={"width":"100%","padding":"10px 0px","display":"inline-flex"}),
                html.P("* You'll receive a confirmation mail on this email . We promise not to spam you , !",style={"color":"#fff","font-size":"12px","margin-left":"105px"}),
                html.Button(children="SEND" ,className="btn send "),
                html.Button(children="CLOSE" ,className="btn closeModal ")
                        ]   ,className="contactModal hidden"),
                html.Div([
                    html.Div(children="DAVID",className="logoContainer"),
                    html.Div([
                        html.Span([html.A("ABOUT", href='/about')] ,className="invisble-btn about"),
                        html.Span([html.A("HOME", href='/login')] ,className="invisble-btn about"),
                        html.Span([
                            html.Button(children="Knowledge Base", className="invisble-btn parser")
                                  ]),
                        html.Span([
                        html.Button(children="DASHBOARD", className="invisble-btn dash")
                        ]),
                        html.Span([
                    html.Button(children="CONTACT",className="invisble-btn",id="contactDavid")
                ]),
            ],className="linksContainer")
                ],className="horizontal_header"),


            ######################## ABOUT US ###################

            html.Div([
                html.Div([
                    html.H3(" Data Analytics, Visualization and Insights Dashboard",
                        style={ 'font-size': '40px',
                                'font-style': 'unset',
                                    "margin-left": "calc(50% - 450px)",
                                    "padding-top": "20px",
                                    "margin-top": "50px",
                                'font-weight': 'inherit',
                                'font-family': 'cursive',
                                'text-shadow': 'blue',
                                'text-decoration-color': 'aqua'}),
                    html.Div([
                        html.Div([

                        html.Div("Learning is a life-long process....and i'm also learning. Help me learn and grow.We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.",className='abt2')
                    ],style={"position":"absolute","left": "20px","max-width": "600px","top": "50px","cusrsor":"pointer"}),
                    html.Div([],className='abt',style={"position":"absolute"})
                    ],style={"position":"relative","min-height":"80vh"}),
                ]),
            ],className='about_us',style={    'height': '-webkit-fill-available'}),
            ])