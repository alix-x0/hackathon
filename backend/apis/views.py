from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q, Count, Avg
from django.utils import timezone
from django.http import FileResponse
from .models import *
from .serializers import *
from .permissions import *
import requests
from django.conf import settings

# Authentication Views

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email']
    ordering_fields = ['id', 'username']

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"status": "success", "message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DrugListView(generics.ListAPIView):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['brand_name', 'generic_name']

@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_interactions(request):
    drugs = request.data.get('drugs', [])
    if not drugs:
        return Response({"error": "No drugs provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    base_url = getattr(settings, 'FASTAPI_BASE', 'http://127.0.0.1:8001')
    if not base_url.startswith('http'):
        base_url = f"http://{base_url}"
    
    fastapi_url = f"{base_url}/api/v1/interactions/analyze"
    
    try:
        response = requests.post(fastapi_url, json={"drugs": drugs}, timeout=60)
        return Response(response.json(), status=response.status_code)
    except requests.exceptions.Timeout:
        return Response({"error": "MedSafe engine timed out. It might still be loading the AI model."}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.exceptions.RequestException as e:
        print(f"MedSafe Connection Error: {e}")
        return Response({"error": f"Could not connect to MedSafe engine: {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
