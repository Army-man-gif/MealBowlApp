from django.db import models
from django.contrib.auth.models import User

class Data(models.Model):
    name = models.CharField(max_length=255)


class IndividualBowl(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bowlName  = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10)
    
class Basket(models.Model):
    totalPrice = models.DecimalField(max_digits=10)