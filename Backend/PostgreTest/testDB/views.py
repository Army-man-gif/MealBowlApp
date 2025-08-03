from django.shortcuts import render,redirect
from .models import Data
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login
import json
from django.http import JsonResponse
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType


def setToken(request):
    # Sets the cookie on the frontend device
    return JsonResponse({"detail":"CSRF token set"})

def createUser(request):
    if(request.method == "POST"):
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            email = data.get("email")
            content_type = ContentType.objects.get_for_model(User)
            permission = Permission.objects.create(
                codename = "admin",
                name = "Admin access granted",
                content_type=content_type,
            )
            user = User.objects.create_user(username=username,password=password,email=email)
            user.user_permissions.add(permission)
            user.save()
            return JsonResponse({"message","Created user"})
        except Exception as e:
            return JsonResponse({"error":str(e)},status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)

# user._perm_cache  = None (permission cache clearing)
def validateUser(request,username,password,email):
    try:
        user = authenticate(request,username=username,password=password)
        if(user is not None and user.email==email):
            return True
    except User.DoesNotExist:
        pass
    return False
def getUser(request,username,password,email):
    if(validateUser(request,username,password,email)):
        user = User.objects.get(username=username,email=email)
        return user
    return None
def deleteUser(request,username,password,email):
    if(validateUser(request,username,password,email)):
        user = User.objects.get(username=username,email=email)
        user.delete()
        return HttpResponse("User deleted")
    return HttpResponse("Invalid credentials")
        
# ---------------------------------------------------------------------------------------------------------------   

def login(request,username,password,email):
    user = authenticate(request, username=username, password=password)
    if(user is not None and user.email==email):
        login(request, user)

def logout(request):
    logout(request)

# ---------------------------------------------------------------------------------------------------------------   

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
    try:
        val  = Data.objects.get(name=value)
        return HttpResponse(val.name)
    except Data.DoesNotExist:
        return redirect("addData",value=value)
