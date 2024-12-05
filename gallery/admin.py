from django.contrib import admin
from .models import User, Wardrobe, Fit

# Register your models here.
admin.site.register(User)
admin.site.register(Wardrobe)
admin.site.register(Fit)