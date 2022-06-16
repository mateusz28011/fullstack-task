ARG MODE

FROM python:3.10-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip3 install pipenv

WORKDIR /app

COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

ENTRYPOINT ["./entrypoint.sh"]

FROM base as build-dev
RUN pipenv install --system --dev
RUN apt-get update && \
    apt-get install --no-install-recommends -y procps
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

FROM base as build-prod
RUN pipenv install --system
CMD ["gunicorn", "core.wsgi", "--bind", "0.0.0.0:8000"]

FROM build-${MODE} as final
COPY . .

EXPOSE 8000