FROM debian
RUN apt-get update && apt-get install -y apache2
RUN apt-get install -y php libapache2-mod-php php-mysql php-mbstring php-xml php-curl php-gd
WORKDIR /var/www/
RUN mkdir project
COPY . project
COPY vhosts.conf /etc/apache2/sites-enabled
RUN /etc/init.d/apache2 restart
RUN chmod -R 777 project/var/cache /var/www/project/var/log
CMD ["apache2ctl", "-D", "FOREGROUND"]
EXPOSE 80