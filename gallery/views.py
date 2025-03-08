from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.db import IntegrityError
import json
import random
from .models import User, Wardrobe, Fit
from dotenv import load_dotenv
import os
load_dotenv()

api_key = os.getenv('API_KEY')


# Create your views here.
def index(request):
   if not request.user.is_authenticated:
       return HttpResponseRedirect(reverse("login"))
   user = User.objects.get(pk=request.user.id)
   print(user.location)
   return render(request, "gallery/index.html", {
        "location": user.location,
        "key": api_key
        })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "gallery/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "gallery/login.html")
    

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "gallery/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "gallery/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "gallery/register.html")
    

def add_location(request):
    if request.method == "POST":
        user = User.objects.get(pk=request.user.id)
        user.location = request.POST["location"]
        user.save()
    return HttpResponseRedirect(reverse("index"))

def change_location(request):
    if request.method == "POST":
        user = User.objects.get(pk=request.user.id)
        data = json.loads(request.body)
        user.location = data['location']
        user.save()
    return HttpResponse(status=201)

def wardrobes_handler(request):
    user = User(request.user.id)
    if request.method == "PUT":
        data = json.loads(request.body)
        wardrobe = Wardrobe.objects.get(pk=data["id"])
        wardrobe.name = data["name"]
        wardrobe.weather = data["weather"]
        wardrobe.save()
        return HttpResponse(200)
    if request.method == "POST":
        print(request.POST)
        Wardrobe.objects.create(name=request.POST["name"], owner=user, weather=request.POST["weather"])
    wardrobes = user.has_wardrobe.all()
    
    return render(request, "gallery/wardrobe.html",{
        "wardrobes": wardrobes
    })

def wardrobe_view(request, id):
    wardrobe = Wardrobe.objects.get(pk=id)
    fits = Fit.objects.filter(inWardrobe = wardrobe)
    return render(request, "gallery/fits.html", { "fits": fits, "wardrobe": wardrobe})

def fit_handler(request, id=None):
    wardrobe = ""
    if id != None:
        wardrobe = Wardrobe.objects.get(pk=id)

    if request.method == "PUT":
        data = json.loads(request.body)
        print(data)
        fit = Fit.objects.get(pk=data["id"])
        fit.head_img = data["head_img"]
        fit.upper_img = data["upper_img"]
        fit.lower_img = data["lower_img"]
        fit.feet_img = data["feet_img"]
        fit.save()
        return HttpResponse(200)
    
    if request.method == "POST":
        data = request.POST
        fit = Fit.objects.create(head_img=data["head_img"], upper_img=data["upper_img"], lower_img=data["lower_img"], feet_img=data["feet_img"], inWardrobe=wardrobe)

    fits = Fit.objects.filter(inWardrobe = wardrobe)

    return render(request, "gallery/fits.html", { "fits": fits, "wardrobe": wardrobe})

def get_fit(request,fit_id = None):
    if request.method == "POST":
        user = User(request.user.id)
        data = json.loads(request.body)
        wardrobes = user.has_wardrobe.filter(weather = data["weather"])
        if not wardrobes:
            return JsonResponse({ "error": "No wardrobe found."})
        fits = []
        for wardrobe in wardrobes:
            for fit in wardrobe.has_fits.all():
                fits.append(fit)
        
        if not fits:
            return JsonResponse({ "error": "No fit found."})
        fit = random.choice(fits)
        
        ret_data = {
            "head_img": fit.head_img,
            "upper_img": fit.upper_img,
            "lower_img": fit.lower_img,
            "feet_img": fit.feet_img
        }
        return JsonResponse(ret_data)
    return HttpResponse(500)


def delete_fit(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        fit = Fit.objects.get(pk=data["id"])
        fit.delete()
        return HttpResponse(status=200)
    return HttpResponse(500)
    
def delete_wardrobe(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        wardrobe = Wardrobe.objects.get(pk=data["id"])
        wardrobe.delete()
        return HttpResponse(status=200)
    return HttpResponse(500)