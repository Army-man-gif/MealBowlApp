from django.db import models
from django.contrib.auth.models import User

class Data(models.Model):
    name = models.CharField(max_length=255)


class IndividualBowlOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bowlName  = models.CharField(max_length=255)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=8,decimal_places=2)
    
class Basket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    totalPrice = models.DecimalField(max_digits=8, decimal_places=2)