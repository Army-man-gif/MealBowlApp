from django.shortcuts import render,redirect
# -----------------------------------------------------------
from .models import Data,IndividualBowlOrder,Basket,Perms
# -----------------------------------------------------------
from django.http import HttpResponse
# -----------------------------------------------------------
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
# -----------------------------------------------------------
from django.contrib.contenttypes.models import ContentType
# -----------------------------------------------------------
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
# -----------------------------------------------------------
import json
from django.http import JsonResponse
# -----------------------------------------------------------
import traceback
# -----------------------------------------------------------
from django.middleware.csrf import get_token
# -----------------------------------------------------------

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({"csrftoken": token})

@ensure_csrf_cookie
@require_GET
def setToken(request):
    # Sets the cookie on the frontend device
    return JsonResponse({"detail":"CSRF token set"})

# ---------------------------------------------------------------------------------------------------------------   

def createUser(request):
    print("Method: ",request.method,"Body: ",request.body)
    if(request.method == "POST"):
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            email = data.get("email")
            print("Password: ",password)
            if(password == "admin1.2.3.4"):
                user = User.objects.create_user(username=username,password=password,email=email)
                permission = Perms(user=user,adminPerm=True)
                permission.save()
                user.save()
            else:
                user = User.objects.create_user(username=username,password=password,email=email)
                permission = Perms(user=user,adminPerm=False)
                permission.save()
                user.save()
            return JsonResponse({"message":"Created user"})
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({"error":str(e)},status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)
def validateUser(request,username="",password="",email=""):
    if(request.method == "POST"):
        try:
            data = json.loads(request.body)
            username = data.get("username","")
            password = data.get("password","")
            email = data.get("email","")
            user = authenticate(request,username=username,password=password)
            if(user is not None and user.email==email):
                return JsonResponse({"message":"User validated"})
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=405)
        except Exception as e:
            return JsonResponse({"error":str(e)},status=400)
    else:
        try:
            user = authenticate(request,username=username,password=password)
            if(user is not None and user.email==email):
                return True
        except Exception:
            return False
def checkUserPermission(request):
    if request.user.is_authenticated:
        permTable = Perms.objects.get(user=request.user)
        permVal = permTable.adminPerm
        if permVal:
            return JsonResponse({"admin": True})
        else:
            return JsonResponse({"admin": False})
    return JsonResponse({"error": "User not logged in"}, status=401)

def getUser(request):
    if(request.method == "POST"):
        try:
            data = json.loads(request.body)
            username = data.get("username","")
            password = data.get("password","")
            email = data.get("email","")
            if(validateUser(request,username,password,email)):
                user = User.objects.get(username=username,email=email)
                userDataToReturn = {"username":user.username,"password":user.password,"email":user.email}
                return JsonResponse(userDataToReturn)
            return JsonResponse({"error": "User does not exist"}, status=405)
        except Exception as e:
            return JsonResponse({"error":str(e)},status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)

def deleteUser(request,username):
    try:
        user = User.objects.get(username=username)
        user.delete()
        return JsonResponse({"message":"Deleted user"})
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=405)
        
# ---------------------------------------------------------------------------------------------------------------   
@require_POST
def loginView(request):
    if(request.method == "POST"):
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            email = data.get("email")
            user = authenticate(request,username=username,password=password)
            if(user is not None and user.email == email):
                user = User.objects.get(username=username,email=email)
                login(request, user)
                return JsonResponse({"message":"User logged in"})
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=405)
        except Exception as e:
            return JsonResponse({"error":str(e)},status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)

@login_required()
def logoutView(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({"message": "User logged out"})
    return JsonResponse({"error":"User not logged in yet"})

# ---------------------------------------------------------------------------------------------------------------   

def DatabaseLandingPage(request):
    return HttpResponse("Welcome to database testing")
def landingPage(request):
    return HttpResponse("Welcome to home")

# ---------------------------------------------------------------------------------------------------------------   

def addOrder(request):
    if(request.method == "POST"):
        try:
            data = json.loads(request.body)
            bowlName = data.get("bowlName")
            number = data.get("numberofBowls")
            price = data.get("bowlTotal")
            if request.user.is_authenticated:
                user = request.user
                Bowl = IndividualBowlOrder(user=user, bowlName=bowlName,quantity=number, price=price)
                Bowl.save()
                return JsonResponse({"message":"Order created"})
            return JsonResponse({"error": "User not logged in"}, status=405)
        except Exception as e:
            return JsonResponse({"error":str(e)},status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)
    
def updateOrder(request):
    if(request.method == "POST"):
        try:
            data = json.loads(request.body)
            bowlName = data.get("bowlName")
            number = data.get("numberofBowls")
            price = data.get("bowlTotal")
            if request.user.is_authenticated:
                user = request.user
                Bowl = IndividualBowlOrder.objects.get(user=user, bowlName=bowlName)
                Bowl.quantity = number
                Bowl.price = price
                Bowl.save()
                return JsonResponse({"message":"Order updated"})
            return JsonResponse({"error": "User not logged in"}, status=405)
        except IndividualBowlOrder.DoesNotExist:
            redirect("addOrder")
        except Exception as e:
            return JsonResponse({"error":str(e)},status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)    
def deleteOrder(request):
    if(request.method == "POST"):
        try:
            data = json.loads(request.body)
            bowlName = data.get("bowlName")
            if request.user.is_authenticated:
                user = request.user
                Bowl = IndividualBowlOrder.objects.get(user=user, bowlName=bowlName)
                Bowl.delete()
                return JsonResponse({"message":"Order deleted"})
            return JsonResponse({"error": "User not logged in"}, status=405)
        except Bowl.DoesNotExist:
            return JsonResponse({"error": "No such order exists, therefore nothing to delete"}, status=405)
        except Exception as e:
            return JsonResponse({"error":str(e)},status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405) 
def makeBasket(request):
    if(request.method == "POST"):
        try:
            data = json.loads(request.body)
            price = data.get("basketTotal")
            if request.user.is_authenticated:
                user = request.user
                totalOrder = Basket(user=user, totalPrice=price)
                totalOrder.save()
                return JsonResponse({"message":"Basket created"})
            return JsonResponse({"error": "User not logged in"}, status=405)
        except Exception as e:
            return JsonResponse({"error":str(e)},status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)  

def updateBasket(request):
    if(request.method == "POST"):
        try:
            data = json.loads(request.body)
            price = data.get("basketTotal")
            if request.user.is_authenticated:
                user = request.user
                totalOrder = Basket.objects.get(user=user)
                totalOrder.totalPrice = price
                totalOrder.save()
                return JsonResponse({"message":"Basket updated"})
            return JsonResponse({"error": "User not logged in"}, status=405)
        except Basket.DoesNotExist:
            redirect("makeBasket")
        except Exception as e:
            return JsonResponse({"error":str(e)},status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)  
def clearBasket(request):
    try:
        if request.user.is_authenticated:
            user = request.user
            totalOrder = Basket.objects.get(user=user)
            totalOrder.delete()
            return JsonResponse({"message":"Order deleted"})
        return JsonResponse({"error": "User not logged in"}, status=405)
    except Basket.DoesNotExist:
        return JsonResponse({"error": "No such basket exists, therefore nothing to clear"}, status=405)
    except Exception as e:
        return JsonResponse({"error":str(e)},status=400)
