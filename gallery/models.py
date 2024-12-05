from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    location = models.CharField(max_length=100)

class Wardrobe(models.Model):
    name = models.CharField(max_length=100, default="")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="has_wardrobe")
    weather = models.CharField(max_length=100)

class Fit(models.Model):
    head_img = models.CharField(max_length=10000)
    upper_img = models.CharField(max_length=10000)
    lower_img = models.CharField(max_length=10000)
    feet_img = models.CharField(max_length=10000)
    inWardrobe = models.ForeignKey(Wardrobe, on_delete=models.CASCADE, related_name="has_fits")
