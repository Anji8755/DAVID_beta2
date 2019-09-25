from dash.dependencies import Output, Input
import dash_core_components as dcc
import dash_html_components as html
from .server import server,app
from . import router

import pandas as pd
import plotly.figure_factory as ff
import plotly.graph_objs as go
from django.db import connection


import dash_table as dt

###########################
# Data Manipulation / Model
###########################



def fetch_data(q):
    with connection.cursor() as cursor:
        cursor.execute(q)
        result = pd.read_sql(
        sql=q,
        con=connection
        )
    return result

def get_divisions():
    '''Returns the list of divisions that are stored in the database'''
    print('#################get divisons value')
    division_query = (
        f'''
        SELECT DISTINCT division
        FROM results
        '''
    )
    divisions = fetch_data(division_query)
    divisions = list(divisions['division'].sort_values(ascending=True))
    print('#########################list of divisions')
    print(divisions)
    return divisions


def get_seasons(division):
    '''Returns the seasons of the datbase store'''

    seasons_query = (
        f'''
        SELECT DISTINCT season
        FROM results
        WHERE division='{division}'
        '''
    )
    seasons = fetch_data(seasons_query)
    seasons = list(seasons['season'].sort_values(ascending=False))
    return seasons


def get_teams(division, season):
    '''Returns all teams playing in the division in the season'''

    teams_query = (
        f'''
        SELECT DISTINCT team
        FROM results
        WHERE division='{division}'
        AND season='{season}'
        '''
    )
    teams = fetch_data(teams_query)
    teams = list(teams['team'].sort_values(ascending=True))
    return teams


def get_match_results(division, season, team):
    '''Returns match results for the selected prompts'''

    results_query = (
        f'''
        SELECT date, team, opponent, goals, goals_opp, result, points
        FROM results
        WHERE division='{division}'
        AND season='{season}'
        AND team='{team}'
        ORDER BY date ASC
        '''
    )
    match_results = fetch_data(results_query)
    return match_results


def calculate_season_summary(results):
    record = results.groupby(by=['result'])['team'].count()
    summary = pd.DataFrame(
        data={
            'W': record['W'],
            'L': record['L'],
            'D': record['D'],
            'Points': results['points'].sum()
        },
        columns=['W', 'D', 'L', 'Points'],
        index=results['team'].unique(),
    )
    return summary


def draw_season_points_graph(results,graph):
    print("result for updation is : ")
    print(results['opponent'])
    print(type(results))
    dates = results['opponent']
    points = results['points']

    if  graph=="bar-chart":
        print(dates)
        print(points)
        figure = go.Figure(
        data=[
            go.Bar(x=dates, y=points)
        ],
        layout=go.Layout(
            title='Points Accumulation',
            showlegend=True
            )
        )
    else:
         print ("inside scatter")
         figure = go.Figure(
        data=[
            go.Scatter(x=dates, y=points, mode='lines+markers')
        ],
        layout=go.Layout(
            title='Points Accumulation',
            showlegend=False
        )
    )

    return figure
##py.iplot(data, filename='bubblechart-size')


#########################
# Dashboard Layout / View
#########################


def onLoad_division_options():
    '''Actions to perform upon initial page load'''
    print('##############################inside onload ')
    division_options = (
        [{'label': division, 'value': division}
         for division in get_divisions()]
    )
    return division_options



colors = {
    'background': '#C6B7B7',
    'text': '#7FDBFF'
}

app.css.append_css({
    "external_url": "https://codepen.io/chriddyp/pen/bWLwgP.css"
})


app.layout = html.Div(style={'backgroundColor': colors['background']},children=[
    dcc.Location(id='url', refresh=False),
    dcc.Link('Index', href=f'{app.url_base_pathname}'),
    ', ',
    dcc.Link('Figure 1', href=f'{app.url_base_pathname}fig1'),
    ', ',
    dcc.Link('Figure 2', href=f'{app.url_base_pathname}fig2'),
    ', ',
    dcc.Link('Dashboard', href=f'{app.url_base_pathname}dash'),
    html.Br(),
    html.Br(),
    html.Div(id='content'),

])

###############################from callback file

# Load Seasons in Dropdown
@app.callback(

    Output(component_id='season-dropdown', component_property='options'),
    [
        Input(component_id='division-selector', component_property='value')
    ]

)
def populate_season_selector(division):
    print('########################inside callback of division selector')
    seasons = get_seasons(division)
    print('#########################end of callabck of diviosn selctor')
    print(seasons)
    return [
        {'label': season, 'value': season}
        for season in seasons
    ]


###################UPDATE GRAPH WAS HERE###########################
# Load Teams into dropdown
@app.callback(
    Output(component_id='team-selector', component_property='options'),
    [
        Input(component_id='division-selector', component_property='value'),
        Input(component_id='season-dropdown', component_property='value')
    ]
)
def populate_team_selector(division, season):
    print('########################populate_team_selector')
    teams = get_teams(division, season)
    return [
        {'label': team, 'value': team}
        for team in teams
    ]


@app.callback(
    Output(component_id='match-results', component_property='data'),
    [
        Input(component_id='division-selector', component_property='value'),
        Input(component_id='season-dropdown', component_property='value'),
        Input(component_id='team-selector', component_property='value')
    ]
)
def update_table(division, season,team):
    results = get_match_results(division, season, team)
    print("############################################################################### RESULTS##############")
    print(results)
    print(type(results))
    results = pd.DataFrame(results)
    print(results.to_dict('records'))

    return results.to_dict('records')


#########################start of datatable##################################
def generate_table(dataframe, max_rows=10):
    '''Given dataframe, return template generated using Dash components
    '''
    return html.Table(
        # Header
        [html.Tr([html.Th(col) for col in dataframe.columns])] +

        # Body
        [html.Tr([
            html.Td(dataframe.iloc[i][col]) for col in dataframe.columns
        ]) for i in range(min(len(dataframe), max_rows))]
    )

def generate_table1(dataframe,max_rows=10):
    print('################################generate table')
    columns=[{"name": i, "id": i} for i in dataframe.columns]
    print(columns)
    data=dataframe.to_dict("rows")
    print(data)
    return dt.DataTable(
            id = "match-results",
            data=data.to_dict('rows'),
            columns=[{
            'id': 'city',
            'name': 'City',
            'type': 'text'
             }, {
            'id': 'average_04_2018',
            'name': 'Average Price ($)',
            'type': 'numeric'
            }, {
            'id': 'change_04_2017_04_2018',
            'name': 'Variation (%)',
            'type': 'numeric'
            }],
            style_as_list_view=True,
            filtering=False,
            selected_rows=[],
            style_cell={'padding': '5px',
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
            n_fixed_rows=1
        )
################################end of datattable##########

# Load Match results


# Update Season Summary Table
@app.callback(
    Output(component_id='season-summary', component_property='figure'),
    [
        Input(component_id='division-selector', component_property='value'),
        Input(component_id='season-dropdown', component_property='value'),
        Input(component_id='team-selector', component_property='value')
    ]
)
def load_season_summary(division, season, team):
    print('########################callback load_season_summary')
    print(division,season,team)

    results = get_match_results(division, season, team)
    print('#######################results')
    print(results)
    table = []
    if len(results) > 0:
        summary = calculate_season_summary(results)
        table = ff.create_table(summary)

    return table


# Update Season Point Graph
@app.callback(
    Output(component_id='season-graph', component_property='figure'),
    [
        Input(component_id='division-selector', component_property='value'),
        Input(component_id='season-dropdown', component_property='value'),
        Input(component_id='team-selector', component_property='value'),
        Input(component_id='graph-selector', component_property='value')
    ]
)
def load_season_points_graph(division, season, team,graph):
    results = get_match_results(division, season, team)

    figure = []
    if len(results) > 0:
        figure = draw_season_points_graph(results,graph)

    return figure

#def ctrl_func(input_selection):
#    return None

@app.callback(
    [Output('update-graph', 'figure'),
    Output('season-graph', 'style')],
    [Input('match-results', 'data'),
     Input('match-results', 'columns')])
def display_output(rows, columns):
    df = pd.DataFrame(rows, columns=[c['name'] for c in columns])
    print("------------in display output revised-----")
    print(df)
    figure = draw_season_points_graph(df,"bar-chart")
    return  figure,{"display":"none"}

