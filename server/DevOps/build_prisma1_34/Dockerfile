FROM prismagraphql/prisma:1.34
COPY ./wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
ENTRYPOINT ["/bin/sh","-c","/app/wait-for-it.sh db:3306 -t 30 -- /app/start.sh"]