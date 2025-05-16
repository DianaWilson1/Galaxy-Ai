from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/<str:provider>/', views.social_login, name='social_login'),
    path('logout/', views.logout, name='logout'),
]
