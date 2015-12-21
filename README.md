# comprehensive-swim-app-server
This is the server side code for a yet to be named swim app.

## Setup
#####To install mongoDB (the database), obviously install it from [here](https://www.mongodb.org).

Next, place the unzipped file somewhere acceptable.

Cd into that directory, cd into it's bin folder, and type <pre><code>./mongod --dbpath <PATH_TO_DATA></code></pre>

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

Otherwise, you might want the server to run forever.  Possibly type in: <pre><code>forever bin/www &</code></pre>
I am not sure if the above works or not; still messing around with that.

The server currently listens on port 3000 for connections.

##Author
Leo Asher - repository owner