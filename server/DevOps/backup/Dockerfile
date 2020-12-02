FROM docker:18.09.7
RUN apk add curl jq python3 python3-dev build-base libffi-dev libressl-dev gettext nodejs npm
RUN curl -O https://bootstrap.pypa.io/get-pip.py
RUN python3 get-pip.py
RUN pip install docker-compose
WORKDIR '/app'
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g prisma@1.34
RUN npm run build
COPY ./prisma/prisma.yml .
COPY ./prisma/generated .
COPY ./prisma/datamodel.prisma .
# EXPOSE 3000

# Conditions:
#   Type              Status
#   Initialized       True 
#   Ready             False 
#   ContainersReady   False 
#   PodScheduled      True 
