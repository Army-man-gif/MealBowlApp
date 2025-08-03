from django.urls import path,include
from . import views
urlpatterns = [
    path("", views.DatabaseLandingPage,name="intro"),
    path("createUser/", views.addData,name="addData"),
    path("getData/<str:value>/", views.displayData,name="getData"),
    path("setToken/",views.setToken,name="setToken")
]
