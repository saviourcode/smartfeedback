# smartfeedback
college feedback system

# Setup

First to download the dependencies enter the directory and type **npm install** in your terminal

Make sure to download nodemon by typing **npm install -g nodemon**

Run the server with the command **npm start**

# Location

Student portal would be the home page "/"

For admin portal go to the location "/plogin"

the base url would be "localhost:3030" 3030 being the port number

# Setting Up the Apache Server on Unix(Debian)

1. Install the Apacher Server via   
```
sudo apt-get update   
sudo apt-get install apache2
```
2. Now, Proxy all request incoming on Port 80 through the URL of a node.js Application to the running local node.js process.   
    - Install/Enable mod_proxy & mod_proxy_http modules  
      ```
      a2enmod proxy
      a2enmod proxy_http
      ```
3. Configure the VirtualHost of Apache Server
    - cd to the directory of the Apache Server's Configuration folder   
    `cd /etc/apache2/sites-available/`
    - Create a new Configuration file in that directory as a root user   
    `sudo vim smartfeedback.conf`
