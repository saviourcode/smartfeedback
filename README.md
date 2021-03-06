# smartfeedback
college feedback system

# Setting Up the Node.js App
1. Install the nodejs package
    ```
    sudo apt-get update
    sudo apt-get install nodejs
    ```
2. Clone the Repository to the home directory  
    `git clone https://github.com/DhruvGodambe/smartfeedback.git`
3. Download/Install the dependencies 
    ```
    cd smartfeedback
    npm install
    ```
    _Note: If the npm complains about the audit run,_   
    `npm audit fix`
4. Download/Install nodemon & forever
    ```
    npm install -g nodemon
    npm install -g forever
    ```
    
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
    _(path/to/the/repo is the actual path where the repo is cloned)_        
    `mv path/to/the/repo/smartfeedback/smartfeedback.conf ./`
4. Changes to be made in the smartfeedback.conf file   
    _Note: Use `sudo [vim|nano] smartfeedback.conf` due to permission issues_      
    - at line 4, change the subdomain in ServerAlias to the actual subdomain allocated   
    `ServerAlias subdomain.dmce.ac.in`
    - at line 6, change the path of the DocumentRoot to the actual path where the repo is cloned   
    `DocumentRoot /home/ubuntu/smartfeedback`
5. After saving the conf file, Enable the new site configuration and disable the default one
    ```
    sudo a2ensite smartfeedback.conf
    sudo a2dissite 000-default.conf
    ```
6. Reload the Apache Server and check for errors   
    `systemctl reload apache2`
    
# Starting and Stopping the Node.js App

## Starting the Web App as a daemon process (Background Process)
1. Change directory to the cloned repository    
    _(path/to/the/repo is the actual path where the repo is cloned)_    
    ```
    cd path/to/the/repo/smartfeedback    
    forever start app.js
    ```
## Stopping the Web App
1. List the running forever processes using   
    `forever list`
2. Stop the running process by it's UUID   
    `forever stop 0`
    
# Location

Student portal would be the home page "/"

For admin portal go to the location "/plogin"

the base url would be "localhost:3030" 3030 being the port number
