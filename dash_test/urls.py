from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url

admin.site.site_header = 'Welcome To Admin Page'
admin.site.site_title = 'PySAP'
#admin.site.site_url = 'http://google.com/'
admin.site.index_title = 'login/signup here'
admin.empty_value_display = '**Empty**'



urlpatterns = [
    #path('/ad/', admin.site.urls),
    path('', include('viz.urls')),
   # url(r'^pwd_reset/$', include('django.contrib.auth.urls')),
    ]
