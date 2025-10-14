FROM httpd:2.4

# Copiar configuración de Apache
COPY httpd.conf /usr/local/apache2/conf/httpd.conf

# Copiar sitio web completo
COPY . /usr/local/apache2/htdocs/

# Exponer puertos
EXPOSE 80
EXPOSE 443

CMD ["httpd-foreground"]