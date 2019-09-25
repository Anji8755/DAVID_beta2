from dash.dependencies import Output, Input
from dash.exceptions import PreventUpdate

from .server import app, server
from . import layouts


pages = (
    ('', layouts.login),
    ('dash', layouts.dash),
    ('dash/', layouts.dash),
    ('login', layouts.login),
    ('login/', layouts.login),
    ('admin', layouts.admin),
    ('admin/', layouts.admin),
    ('KnowledgeRepo/', layouts.parser),
    ('KnowledgeRepo', layouts.parser),
    ('about/', layouts.about),
    ('resetPwd', layouts.resetPwd),
    ('about', layouts.about)

)

routes = {f"{app.url_base_pathname}{path}": layout for path, layout in pages}


@app.callback(Output('content', 'children'), [Input('url', 'pathname')])
def display_page(pathname):
    """A multi-page Dash router"""
    if pathname is None:
        raise PreventUpdate("Ignoring first empty location callback")

    page = routes.get(pathname, f"Unknown link '{pathname}'")
    if callable(page):
    # can add arguments to layout functions if needed
        layout = page()
    else:
        layout = page

    return layout