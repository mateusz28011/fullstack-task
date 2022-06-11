#!/bin/sh
set -e

# until nc -z "${POSTGRES_HOST}" "5432"; do
#   echo "Waiting for database (${POSTGRES_HOST}:5432)"
#   sleep 2
# done
/wait

python3 manage.py migrate
cat core/create_superuser.py | python3 manage.py shell
python3 manage.py collectstatic --noinput

exec "$@"
