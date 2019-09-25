from flask import Flask
from dash import Dash

# should start and end with a '/'
URL_BASE_PATHNAME = '/'

server = Flask(__name__)
####################EXTERNAl STYLESHEET#############################
# external JavaScript files
external_scripts = [
#    {'src': '/viz/assets/new.js'},
     {'src':'https://cdn.plot.ly/plotly-latest.min.js'},
     {
    'src':'https://code.jquery.com/jquery-3.4.1.min.js',
    'integrity':"sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=",
    'crossorigin':"anonymous"
     },
     {
     'src':'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
     'integrity':"sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa",
     'crossorigin':"anonymous"
     },
     {
     'src':'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
     'integrity':"sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=",
     'crossorigin':"anonymous"
     }
]
external_stylesheets = [
    {
        'href': '/viz/assets/myloader.css',
        'rel': 'stylesheet'
    },
    {
        'href': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
        'rel': 'stylesheet',
        'integrity':"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u",
        'crossorigin':"anonymous"
    },
    {
        'href': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css',
        'rel': 'stylesheet',
        'integrity':"sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp",
        'crossorigin':"anonymous"
    }
]

############dash app is multi page
app = Dash(
    __name__,
    server=server,
    url_base_pathname=URL_BASE_PATHNAME,
    external_stylesheets=external_stylesheets,
    external_scripts=external_scripts

)

app.config['suppress_callback_exceptions'] = True

app.title='DAVID'