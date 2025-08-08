from django.urls import path,include
from . import views
urlpatterns = [
    path("", views.DatabaseLandingPage,name="intro"),
    path("createUser/", views.createUser,name="createUser"),
    path("setToken/",views.setToken,name="setToken"),
    path("getToken/",views.get_csrf_token,name="getToken"),
    path("deleteUser/<str:username>/", views.deleteUser,name="deleteUser"),
    path("validateUser/", views.validateUser,name="validateUser"),
    path("login/", views.loginView,name="login"),
    path("logout/", views.logoutView,name="logout"),
    path("checkUserperm/", views.checkUserPermission,name="checkUserperm"),

]
