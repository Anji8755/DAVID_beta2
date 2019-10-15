from django.urls import re_path

from . import views
from . import dashapp # this loads the Dash app
from django.conf.urls import url
from django.contrib.auth import views as auth_views  #from django.contrib.admin.templates.registration
from django.conf.urls import include


urlpatterns = [
    url(r'^login_user/$', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    url(r'^login_get_data/$',views.login_get_data),
    #r'^artists/(?P[\d]+)(|/)$'
    url(r'^register/$',views.register),
    url(r'^getAccData/$',views.getAccData),
    url(r'^getDomainData/',views.getDomainData),
    url(r'^getTabData/$',views.getTabData),
    url(r'^fetch_regtab/',views.fetch_regtab),
    url(r'^sendquery/',views.sendquery),
    url(r'^checkEmails/',views.checkEmails),
    url(r'^dummyAPI/',views.dummyAPI),
    url(r'^delData/',views.delData),
    url(r'^addData/',views.addData),
    url(r'^update_aeppl/',views.update_aeppl),#update_aeppl_pl
    url(r'^update_aeppl_pl/',views.update_aeppl_pl),
    url(r'^submitForm/',views.submitForm),
    url(r'^forgotPwdMail/$',views.forgotPwdMail),         #forgot_pwd(request,email,otp,reset
    url(r'^forgotPwdOtp/$',views.forgotPwdOtp),
    url(r'^forgotPwdReset/$',views.forgotPwdReset),#(?P<new_pwd>\d+)/
    url(r'^getMergeDataCOPY/(?P<tab>[\w-]+)/(?P<col>[\w-]+)/(?P<exclude>[\w-]+)/$',views.getMergeDataCOPY),
    url(r'^getMergeData/$',views.getMergeData),
    url(r'^multiDB/$',views.multiDB),#multiDB
    #url(r'^graph/$',views.draw_season_points_graph),
    #url(r'^mail/$',views.send_mail),#test_qu
    url(r'^test/$',views.test),#test1
    url(r'^test1/$',views.test1),
    url(r'^test_qu/$',views.test_qu),#test_cr
    url(r'^test_cr/$',views.test_cr),
    url(r'^test_view/$',views.test_view),
    #url(r'^pwd_reset/$', include('django.contrib.auth.urls')),checkAc,fetchAccDet
    url(r'^checkAcc/$',views.checkAcc),
    url(r'^checkaccAdmin/$',views.checkaccAdmin),
    url(r'^addAccDet/$',views.addAccDet),
    url(r'^getHanaData/$',views.getHanaData),#projectRole
    url(r'^projectRole/(?P<tab>[\w\-]+)/$',views.projectRole),
    re_path('^_dash-', views.dash_json),
    re_path('^assets/', views.dash_guess_mimetype),
    re_path('^', views.dash_index),


]