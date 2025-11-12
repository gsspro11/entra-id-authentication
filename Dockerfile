FROM node:latest@sha256:64c46a664eccedec63941dab4027c178a36debe08a232d4f9d7da5aca91cff3d as build

WORKDIR /app

COPY ./_Shared-EntraId-Auth-Artifact .

RUN npm install

RUN npm run build -- --configuration=azure

FROM nginx:stable-alpine

COPY --from=build /app/dist/shared-entra-id-auth/ /usr/share/nginx/html/
COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/