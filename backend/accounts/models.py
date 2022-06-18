from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils import timezone
from weather.models import City


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **other_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **other_fields):
        other_fields.setdefault("is_staff", True)
        other_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **other_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    join_date = models.DateTimeField(default=timezone.now)
    is_staff = models.BooleanField(default=False, blank=True)
    is_active = models.BooleanField(default=True, blank=True)
    saved_city = models.ForeignKey(
        City, on_delete=models.SET_NULL, null=True, blank=True
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return str(self.email)
