FROM debian
RUN apt-get update && apt-get install -y apache2
RUN apt-get install -y php libapache2-mod-php php-mysql php-mbstring php-xml php-curl php-gd php-zip unzip curl
WORKDIR /var/www/
RUN mkdir project
COPY . project
WORKDIR /var/www/project
# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader
COPY vhosts.conf /etc/apache2/sites-enabled
RUN /etc/init.d/apache2 restart
RUN mkdir -p var/cache var/log && chmod -R 777 var
CMD ["apache2ctl", "-D", "FOREGROUND"]
EXPOSE 80