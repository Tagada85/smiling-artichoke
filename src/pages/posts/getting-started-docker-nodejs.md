---
title: Getting started with Docker and Node.js
subtitle:
excerpt: >-
  Let's get started with the Docker technology in a Node.js context.
date: "2019-04-12"
thumb_img_path: images/docker.jpeg
content_img_path: images/docker.jpeg
tags: ["docker", "nodejs", "express"]
template: post
---

# Introduction

Lately, I spent a lot of time in private blockchain's world. When you are learning a new technology like this one, you come across certain concepts or principles that you have to understand in order to move on. Docker and containers seems to be one of them right now for me. So, in a good old _let's write about what I learn_ fashion, I'm trying to explain what Docker does and how I'm getting started with it.

## Containers?

Docker is a _platform_ for developers to develop and deploy applications with _containers_. Docker didn't invent containers or containerization, but popularised the concept, so they are sometimes used to describe the same thing.

Containers are launched by running an _image_. An image is an executable that explains everything the application needs to run, and where/how to find them. A container is a running instance of an image. This way of doing things takes less resources than Virtual Machines (VM) that provides a full "virtual" operating system, which represents more resources than most applications need. By containerizing your application and its dependencies, differences in OS distributions and underlying infrastructure are abstracted away.

## Docker and NodeJS

Enough theory, let's see how we could use Docker to create an image for a NodeJS application.

First, install Docker by following the instructions <a href='https://docs.docker.com/install/'>here</a>. Once this is done, run `docker --version` in your terminal. You should have something like:

`Docker version 17.12.0-ce, build c97c6d6`

If you want to make sure everything is working, you can run: `docker run hello-world`. This will pull the _hello-world_ image for you and launch a container.

You can see a list of the images you downloaded with `docker image ls`.

You can see a list of running containers with `docker container ls`, or you can have all the containers with `docker container ls --all`. Remember than containers are instances of the images you downloaded.

So, if you run the _hello-world_ image, assuming you didn't have any containers running before, you will see one container in this list. If you run _hello-world_ 5 times, you will have 5 containers ( instances of the _hello-world_ image ).

_Note_: To stop containers, run `docker kill $(docker ps -q)`. You will still see these containers with ``docker container ls --all`. To remove them completely, run`docker rm \$(docker ps -a -q)`.

### The NodeJS application

Let's do something very simple. An express app with 2 routes that renders 2 html pages. Create a new directory called express-app:

`mkdir express-app && cd express-app`

Run `npm init` with the defaults. Then, run `npm install express --save`.

Create 3 files: _index.js_, _index.html_, _about.html_.

- _index.js_

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get("/about", (req, res) => {
  res.sendFile(`${__dirname}/about.html`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
```

Create an express app, 2 routes for our html files and listen on port 3000.

- _index.html_

```html
<html>
  <body>
    <h1>Hello Docker from index</h1>
  </body>
</html>
```

- _about.html_

```html
<html>
  <body>
    <h1>About page</h1>
  </body>
</html>
```

Good, our app is done. If you run `node index.js`, you will see our html pages on localhost:3000/ and localhost:3000/about.

### Dockerfile

To define the environment inside your container, we will use a _Dockerfile_. This is a list of instructions that tells Docker what it must do to create the image we want.

Create a Dockerfile in your directory with `touch Dockerfile`:

```

FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]

```

What's happening here? The first line indicates that we want to use the latest node version to build our image. This is the image we start from. _node:carbon_ being the latest Long Term Support version available.

The second line creates a directory to hold our application's code inside the image.

The third and fourth line copy the package.json and run the `npm install` command. The first line gives us node.js and npm. So we install our dependencies, in this case, express.js only. Note that we will **NOT** copy the /node_modules file.

The **COPY** instruction bundles our app inside the Docker image, so our html files and index.js file in our case.

The **EXPOSE** instruction exposes the 3000 port that our app uses.

Finally, the **CMD** instruction specifies which command needs to be run for our app to start.

### Build

Everything is now ready, we can build the app.

Run `docker build -t node-app .`

The _-t_ tag allows you to specify a friendly name to your Docker image. You should see something like this in your terminal:

```
Sending build context to Docker daemon   21.5kB
Step 1/7 : FROM node:carbon
 ---> 41a1f5b81103
Step 2/7 : WORKDIR /usr/src/app
 ---> Using cache
 ---> ffe57744035c
Step 3/7 : COPY package*.json ./
 ---> Using cache
 ---> c094297a56c2
Step 4/7 : RUN npm install
 ---> Using cache
 ---> 148ba6bb6f25
Step 5/7 : COPY . .
 ---> Using cache
 ---> 0f3f6d8f42fc
Step 6/7 : EXPOSE 3000
 ---> Using cache
 ---> 15d9ee5bda9b
Step 7/7 : CMD ["node", "index.js"]
 ---> Using cache
 ---> 154d4cd7e768
Successfully built 154d4cd7e768
Successfully tagged node-app:latest

```

Now, if you run `docker image ls`. You will see your _node-app_ in the list.

### Launch the container(s)

We can now launch our containers. Run `docker run -p 8080:3000 -d node-app`

The _-d_ flag runs the app in detached mode. _-p 8080:3000_ redirects a public port to a private port. 8080 being the private port, 3000 the public port we exported.

Go to localhost:8080 and your app is running!

Now, run `docker run -p 10000:3000 -d node-app`, then `docker run -p 4000:3000 -d node-app`.

Open localhost:10000 and localhost:4000 and see that you have three different instances of your node-app image running at the same time! To make sure of it, you can run `docker container ls` and see your 3 containers running the same image on different ports.

Well, that was a quick introduction to Docker. Have fun!

_Edit:_ I forgot to mention it and I should have. You should create a _.dockerignore_ file and add _node_modules_ in it to tell Docker you do not want this folder to be copied, since we copy the _package.json_ file and run `npm install`. It will work if you omit it, but it makes more sense to have it ;)
