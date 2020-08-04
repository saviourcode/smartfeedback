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

# Setting Up the Apache Server to host Node.js App on Unix(Debian)

1. Install the Apache Server via   
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
    - cd to the directory of the Apache server's configuration folder   
    `cd /etc/apache2/sites-available/`
    - move the "smartfeedback.conf" file to the configuration folder   
    (path/to/the/repo is the actual path where the repo is cloned)      
    `mv path/to/the/repo/smartfeedback/smartfeedback.conf ./`
4. Changes to be made in the smartfeedback.conf file
    - at line 4, change the subdomain in ServerAlias to the actual subdomain allocated   
    `ServerAlias subdomain.dmce.ac.in`
    - at line 6, change the path of the DocumentRoot to the actual path where the repo is cloned   
    `DocumentRoot /home/ubuntu/smartfeedback`
5. After saving the conf file, Enable the new site configuration and disable the default one
    ```
    sudo a2ensite smartfeedback.conf
    sudo a2dissite 000-default.conf
    ```
    
