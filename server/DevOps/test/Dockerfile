FROM docker:18.09.7-dind
RUN apk add curl jq python3 python3-dev build-base libffi-dev libressl-dev gettext nodejs npm
RUN curl -O https://bootstrap.pypa.io/get-pip.py
RUN python3 get-pip.py
RUN pip install docker-compose
WORKDIR /app
COPY docker-compose.yml .