FROM node:20-bullseye

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies, ignoring optional native binaries
RUN npm install --ignore-optional --legacy-peer-deps

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
