from django.urls import path,include
from . import views
urlpatterns = [
    path("", views.DatabaseLandingPage,name="intro"),
    path("createUser/", views.createUser,name="createUser"),
    path("getData/<str:value>/", views.displayData,name="getData"),
    path("addData/<str:value>/", views.addData, name="addData"),
    path("setToken/",views.setToken,name="setToken"),
    path("deleteUser/<str:username>/", views.deleteUser,name="deleteUser"),

]
