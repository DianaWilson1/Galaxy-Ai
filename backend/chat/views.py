import asyncio
import json

from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .ai_utils import get_ai_response
from .models import Conversation, Message
from .serializers import (
    ConversationSerializer,
    MessageInputSerializer,
    MessageSerializer,
)


class ConversationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for conversations
    """
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_message(request):
    """
    Send a message and get AI response
    """
    serializer = MessageInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user_message = serializer.validated_data['message']
    conversation_id = serializer.validated_data.get('conversation_id')

    # Handle authenticated users
    if request.user.is_authenticated:
        # Get or create conversation
        if conversation_id:
            conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
        else:
            conversation = Conversation.objects.create(user=request.user)

        # Save user message
        Message.objects.create(
            conversation=conversation,
            sender='user',
            content=user_message
        )

        # Get conversation history
        history = conversation.messages.all().order_by('created_at')

        # Get AI response
        ai_message_text = asyncio.run(get_ai_response(user_message, history))

        # Save AI response
        ai_message = Message.objects.create(
            conversation=conversation,
            sender='ai',
            content=ai_message_text
        )

        # Update conversation timestamp
        conversation.save()

        return Response({
            'message': ai_message_text,
            'conversation_id': conversation.id
        })

    # Handle anonymous users
    else:
        # For anonymous users, we don't save conversation history
        ai_message_text = asyncio.run(get_ai_response(user_message))

        return Response({
            'message': ai_message_text
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversation_history(request, conversation_id=None):
    """
    Get conversation history for a user
    """
    if conversation_id:
        # Get specific conversation
        conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)
    else:
        # Get all conversations
        conversations = Conversation.objects.filter(user=request.user)
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)
