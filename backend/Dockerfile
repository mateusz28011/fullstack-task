FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONBUFFERED=1

RUN pip3 install pipenv

WORKDIR /app

COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock

# TODO 
# HANDLE --dev
RUN pipenv install --system

COPY . .

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000