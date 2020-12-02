sleep 1

until nc -vz prisma 4466; do
  >&2 echo "Prisma is unavailable - sleeping"
  sleep 1
done

>&2 echo "Prisma up - executing command"
exec "$@"
