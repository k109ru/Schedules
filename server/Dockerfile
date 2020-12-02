FROM YOUR_LOCAL_DOCKER_REGISTRY:5000/docker18_node_prisma_npm 
WORKDIR '/app'
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY ./prisma/prisma.yml .
COPY ./prisma/generated .
COPY ./prisma/datamodel.prisma .
EXPOSE 3000
