from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'conversations', views.ConversationViewSet, basename='conversation')

urlpatterns = [
    path('', include(router.urls)),
    path('message/', views.send_message, name='send_message'),
    path('history/', views.get_conversation_history, name='conversation_history'),
    path('history/<int:conversation_id>/', views.get_conversation_history, name='conversation_detail'),
]
