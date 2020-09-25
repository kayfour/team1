from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views

app_name='common' 

urlpatterns = [
    path('', views.base),
    path('index', views.index, name='common_index'), 
    path('list', views.list, name="common_list"),    
    path('save', views.save, name="common_save"),     
    path('view/<int:id>', views.view, name="common_view"), 
    path('delete/<int:id>', views.delete, name="common_delete"),
    
    path('login/', auth_views.LoginView.as_view(template_name='common/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('signup/', views.signup, name='signup'), 

    
    # path('ChkDeleteAll', views.ChkDeleteAll, name="ChkDeleteAll"), #개발중

]