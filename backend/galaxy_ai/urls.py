from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/chat/', include('chat.urls')),
]
