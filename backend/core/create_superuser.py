import os
from django.contrib.auth.models import User

login = str(os.getenv('DJANGO_SUPERUSER_LOGIN'))
email = str(os.getenv('DJANGO_SUPERUSER_EMAIL'))
password = str(os.getenv('DJANGO_SUPERUSER_PASS'))

query_su = User.objects.filter(username=login)
if not query_su:
    print("Creating superuser...")
    superuser = User.objects.create_superuser(login, email, password)
