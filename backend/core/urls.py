"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView, LogoutView
from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenVerifyView
from weather.views import GetCityWeather

# TODO
# Fix documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Weather API",
        default_version="v1",
        description="""
        #### How to start?
        1. Create your account through **_POST /auth/users_**.
        2. Activate your account by clicking link sent to your e-mail.
        3. Create your access token through **_POST /auth/jwt/create_**.
        4. Authorize yourself by clicking green button below. In value field paste your token as **_JWT \{token\}_**.
        5. Now you are ready to go!
        """,
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="mathew28011@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("weather/forecast/", GetCityWeather.as_view()),
    path("", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    # path("", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path(
        "dj-rest-auth/",
        include(
            [
                path("login/", LoginView.as_view(), name="rest_login"),
                path("logout/", LogoutView.as_view(), name="rest_logout"),
                path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
                path(
                    "token/refresh/", get_refresh_view().as_view(), name="token_refresh"
                ),
                path("register/", RegisterView.as_view(), name="rest_register"),
            ]
        ),
    ),
]
