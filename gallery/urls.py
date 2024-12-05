from . import views
from django.urls import path

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("add_location", views.add_location, name="add_location"),
    path("change_location", views.change_location, name="change_location"),
    path("wardrobes", views.wardrobes_handler, name="wardrobes"),
    path("get_fit", views.get_fit, name="get_fit"),
    path("delete_fit",views.delete_fit,name="delete_fit"),
    path("delete_wardrobe",views.delete_wardrobe,name="delete_wardrobe"),
    path("edit_wardrobe",views.wardrobes_handler,name="edit_wardrobe"),
    path("edit_fit", views.fit_handler, name="edit_fit"),
    path("wardrobes/<int:id>", views.fit_handler, name="fit_handler"),
]