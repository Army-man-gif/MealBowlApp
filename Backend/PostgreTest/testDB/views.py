from django.shortcuts import render,redirect
from .models import Data
from django.http import HttpResponse
from django.contrib.auth.models import User

def UserLogic(request,username,password,email):
    user = User.objects.create_user(username=username, email=email)
    user.set_password(password)
    user.save()
def DatabaseLandingPage(request):
    return HttpResponse("Welcome to database testing")
def landingPage(request):
    return HttpResponse("Welcome to home")
# Create your views here.
def addData(request,value):
    try:
        Data.objects.get(name=value)
    except Data.DoesNotExist:
        Data.objects.create(name=value)
    return redirect("getData",value=value)
    
def displayData(request,value):
    val  = Data.objects.get(name=value)
    return HttpResponse(val.name)