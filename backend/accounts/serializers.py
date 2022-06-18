from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer
from django.db import transaction
from rest_framework import serializers

from .models import User


class CustomLoginSerializer(LoginSerializer):
    username = None
    email = serializers.EmailField(required=True)


class CustomRegisterSerializer(RegisterSerializer):
    username = None

    # Define transaction.atomic to rollback the save operation in case of error
    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "join_date", "is_staff", "saved_city"]
        read_only_fields = ["email", "join_date", "is_staff"]

    def __init__(self, *args, **kwargs):
        super(UserSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and (request.method in ["POST", "PATCH", "PUT"]):
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1


class UserBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "join_date", "saved_city"]
        read_only_fields = ["email", "join_date"]
        depth = 1
