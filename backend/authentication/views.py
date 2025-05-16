from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from social_core.exceptions import MissingBackend
from social_django.utils import load_backend, load_strategy

from .serializers import UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def social_login(request, provider):
    """
    Login with social auth provider (Google or Facebook)
    """
    if provider not in ['google', 'facebook']:
        return Response(
            {'error': f'Provider {provider} not supported'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # In a real implementation, you would handle OAuth tokens from frontend
    # This is a simplified version that would need to be expanded
    try:
        strategy = load_strategy(request)
        backend = load_backend(strategy=strategy, name=provider, redirect_uri=None)

        # This would normally come from the frontend after OAuth flow
        # For this example, we simulate a successful authentication
        if provider == 'google':
            email = request.data.get('email', 'test@example.com')
            # In a real app, we'd validate tokens and get user info from provider
            user, created = User.objects.get_or_create(
                username=email,
                defaults={'email': email}
            )

            # Create or get token
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        else:
            # Similar flow for Facebook
            pass

    except MissingBackend:
        return Response(
            {'error': f'Backend for {provider} not found'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout user by removing their auth token
    """
    try:
        request.user.auth_token.delete()
        return Response(
            {'success': 'User logged out successfully'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for user management
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only access their own profile
        return User.objects.filter(id=self.request.user.id)
