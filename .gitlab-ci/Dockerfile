FROM gitlab.gbksoft.net:5005/int/images/nginx-alpine-node:12

COPY . /var/www/html/
RUN rm -rf /var/www/html/.git
RUN mkdir -p /data/lib
RUN export APP_SDK_URL="https://sdk.livetag.sg"
RUN cd /var/www/html && npm ci && npm run dist && mv ./dist/* /data/lib/
RUN cd /var/www/html && npm ci && npm run build && mv ./src/.vuepress/dist/* /data
RUN chown -R nginx:nginx /data
RUN echo 'server { listen 80 default_server; root /var/www/html/data; index index.html index.htm; try_files $uri $uri/ /index.html =404; }' > /etc/nginx/conf.d/default.conf
RUN sed -ri 's/error_log \/var\/log\/nginx\/error.log warn;/error_log \/dev\/stdout warn;/' /etc/nginx/nginx.conf
RUN sed -ri 's/access_log \/var\/log\/nginx\/access.log main;/access_log \/dev\/stdout main;/' /etc/nginx/nginx.conf
CMD nginx
