import os

from django.contrib.auth import get_user_model

User = get_user_model()

email = str(os.getenv("DJANGO_SUPERUSER_EMAIL"))
password = str(os.getenv("DJANGO_SUPERUSER_PASS"))

query_su = User.objects.filter(email=email)
if not query_su:
    print("Creating superuser...")
    superuser = User.objects.create_superuser(email, password)
