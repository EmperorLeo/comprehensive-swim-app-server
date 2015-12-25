# comprehensive-swim-app-server
This is the server side code for a yet to be named swim app.

## Setup (Localhost)
#####To install mongoDB (the database), obviously install it from [here](https://www.mongodb.org).

Next, place the unzipped file somewhere acceptable.

Cd into that directory, cd into it's bin folder, and type <pre><code>./mongod --dbpath \<PATH_TO_DATA\></code></pre>

This should make it listen on port 27017.

#####Do the following if you want to use the mongoDB console:

Open another terminal tab, go to bin folder again, and type <pre><code>./mongo</code></pre>

Congrats! You have access to the console now.

At this point, you probably want to type in: <pre><code>use comprehensive-swim-app-server</code></pre>

Now, you can use mongodb commands to insert, get, delete from the database used by the node.js application.

#####Install the dependencies for this project.

Make sure that whatever computer is running this code has node installed.  With node comes npm, and using it, you'll probably want to type in this command:

<pre><code>npm install -g express-generator</code></pre>

The -g flag installs express-generator globally.

Next (or first, if all this stuff was already installed), cd into the base directory of this project.  Then type:

<pre><code>npm install</code></pre>

##Running the server

If you just want to run the server only while you have a terminal open, cd into the base directory of the project, and type: <pre><code>npm start</code></pre>

Otherwise, you might want the server to run forever.  Install forever:
<pre><code>sudo npm install forever -g</code></pre>
Possibly type in: <pre><code>forever bin/www &</code></pre>
I am not sure if the above works or not; still messing around with that.  The following command, while wordy, definitely works.

<pre><code>forever start -c "npm start" -o log.out -e log.err ./</code></pre>

To stop the server, try this:
<pre><code>forever stopall</code></pre>
This will actually kill all processes running using the forever script, but for these purposes, I am only running one process with this script.  In the case where multiple scripts are being run, do not use that command.

The server currently listens on port 3000 for connections.

##Amazon EC2 Development Server
####Important: This isn't a production server, so please don't hack :)

The chosen EC2 instance is Ubuntu Linux.  Using the public domain ec2-52-23-154-47.compute-1.amazonaws.com, you can connect via ssh using the terminal (and using the private key pair.)  Assuming the private key is named leosprivatekey.pem, connect to the server using this command:
<pre><code>ssh -i leosprivatekey.pem ubuntu@ec2-52-23-154-47.compute-1.amazonaws.com</code></pre>
Obviously, you will have to be in the directory of the pem file, or you have to add the full path to the pem file.

To install nodejs on ubuntu, try this:

<pre><code>curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -</code></pre>
<pre><code>sudo apt-get install --yes nodejs</code></pre>

Once node is installed, you need to install the Ubuntu Linux version of mongodb. (Note, this works for Ubuntu Linux v. 14.04)

Import MongoDB public GPG Key:
<pre><code>sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10</code></pre>
Create list file for MongoDB:
<pre><code>echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list</code></pre>
Reload the packages:
<pre><code>sudo apt-get update</code></pre>
Install latest version of MongoDB.
<pre><code>sudo apt-get install -y mongodb-org</code></pre>

Once installed, you can start and stop mongodb at your leisure.

Start:
<pre><code>sudo service mongod start</code></pre>
Stop:
<pre><code>sudo service mongod stop</code></pre>

You can view the log files at the path /var/log/mongodb/mongod.log.

Now you need to clone the repository, and cd into it.  There is a small problem where npm install will not install the bcrypt dependency, and apparently, that is fixed by installing build-essential.  Unfortunately, I had already installed g++, so to be careful, just install both.  [This](https://github.com/ncb000gt/node.bcrypt.js/issues/351) issue might shed some light on the problem.

<pre><code>sudo apt-get install g++</code></pre>
<pre><code>sudo apt-get install build-essential</code></pre>
<pre><code>npm install</code></pre>

You should be good to go now.


##Routes
####/users
1. / - POST
2. /auth - POST
3. /username/:username - GET, DELETE
4. /:username/clubs - POST, DELETE
5. /:username/meets - POST, DELETE
6. /:username/times - POST, DELETE
7. /:username/goals - POST, DELETE
8. /:username/sets - POST, DELETE


####/meets
1. / - POST, GET
2. /meetId/:meetId - GET, DELETE
3. /:meetId/event - POST, DELETE
4. /:meetId/event/:eventId - PATCH, DELETE


##Author
Leo Asher - repository owner
