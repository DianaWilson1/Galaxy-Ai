from django.contrib.auth.models import User
from django.db import models


class Conversation(models.Model):
    """
    Store conversations for users
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations', null=True, blank=True)
    title = models.CharField(max_length=255, default="New Conversation")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.user.username if self.user else 'Anonymous'}"

    class Meta:
        ordering = ['-updated_at']

class Message(models.Model):
    """
    Store individual messages in a conversation
    """
    SENDER_CHOICES = (
        ('user', 'User'),
        ('ai', 'AI'),
    )

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.content[:50]}..."

    class Meta:
        ordering = ['created_at']
