FROM node:14-alpine as builder

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm ci --quiet && npm run build

#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:14-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --quiet --only=production

## We just need the build to execute the command
COPY . .

EXPOSE 8083
CMD ["node", "/app/build/server.js"]
