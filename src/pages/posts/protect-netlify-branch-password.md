---
title: How to protect a Netlify branch behind a password
subtitle: How to make your Netlify branch private
excerpt: >-
  A common workflow is to have a branch production and a development or test branch. You might not want to let anyone check out the development branch to see all the cool stuff you're cooking. Netlify lets you do that.
date: "2020-06-12"
thumb_img_path: images/password.png
content_img_path: images/netlify.png
tags: ["netlify", "authentication", "reactjs", "react"]
template: post
---

## Introduction

A common workflow in web development is to have a production branch and one or several development branches. The production branch host the actual state of your product, where you can make all your users happy. The development branches lets you test all the new things you are cooking.

The thing is: you might not want people to wander on those development branches. Maybe you want to keep your secrets, maybe you don't want potential users to get on those branches and think your products are not finished... Whatever the reason, you want to protect those branches and not let anybody see them.

## Netlify to the rescue!

Netlify is a popular way to host static sites nowadays. Thankfully for us, Netlify offers a relatively simple way to protect specific branches. Let's see how you could achieve this.

**IMPORTANT!** _For this feature to work, you need to be at least on a PRO plan. This feature won't work on the starter plan._

For the purpose of this article, I'll assume I am working with a React application.

What we are going to do is protect our branches behind a basic authentication system. Basically, you'll have an alert showing up prompting you to enter a username/password combination. If you can pass that test, you can access the page!

### The \_headers file

Netlify uses a _\_headers_ file to set up rules like Basic-Auth. The file is read from the _public_ folder. The file would look like this:

```
/path-to-protect/*
    Basic-Auth: admin:password johnny:secret
```

You first specify the path you want to protect behind a username/password. Here it would be any path beginning with _/path-to-protect/_. Notice the wildcard _ to include all the paths beginning with _/path-to-protect/\*.

The second line starts with the rule we want to enforce: **Basic-Auth**. Then, we specify a number of username:password combinations. Here I've added two: _admin_ and _johnny_ are the usernames, _password_ and _secret_ are the passwords. So, you could see my super secret project by entering admin/password or johnny/secret !

This is cool, but if I add this file, it would add a Basic-Auth rule to ALL my branches, includes the production one. Not good!

### How to solve it

Here's one way you can solve this problem, step by step:

- Create a file that will hold the Basic-Auth we want to implement.
- In _netlify.toml_, modify the command when you are in the context of the branch you want to protect.
- The command needs to copy the file you created into _public/\_headers_

#### Creating the file

My file will be called _netlify_headers_. You can call it whatever you want, and place it wherever you want. One thing however: if you choose to put this file inside the _public_ folder, do **NOT** call it _\_headers_. That would trigger the rules for all the branches.

_netlify_headers_:

```
/*
    Basic-Auth: admin:supersecret
```

Here is my file. Notice that because I want to protect every single path on my super secret branch, I use /\* as the path definition. Then, I'll be able to connect with the combination admin/supersecret.

#### netlify.toml

_netlify.toml_ is a file read by Netlify that allows you to customize a lot of things, from your build commands to your environment variables or assets optimization... A lot of things are possible. If you don't have a _netlify.toml_ file, create it in the root of your project.

In this file, you can customize depending on the branch you are. So, assuming I have two branches, one called **production** and the other **dev**. I could customize their configuration in my _netlify.toml_ like so:

```
[context.production]
  command = "echo PROD && npm install && npm run build"
  REACT_APP_ENV_VAR = "supersecret"

[context.dev]
  command = "echo DEV && npm install && npm run build"
  REACT_APP_ENV_VAR = "whatever"
```

Depending on the branch we use to deploy, Netlify would read our file and run the appropriate command and set the right environment variable.

### Copying the file for our protected branch

What we need to do now is to make sure we have a _\_headers_ file with the Basic-Auth rule for our _dev_ branch. In order to do that, inside the _context.dev_ command, we'll copy our _netlify_headers_ file we created earlier into a _\_headers_ file. So, our command inside the _netlify.toml_ file would look like that:

```
[context.dev]
  command = "cp netlify_headers public/_headers && npm install && npm run build"
  REACT_APP_ENV_VAR = "whatever"
```

We use the command **cp** to copy our file. This command takes two arguments, the first being the file we want to copy, the second being the file we want to copy our file into. Be careful about the path of your files. The file I want to copy is in the root of my project, so `netlify_headers` is the path I need to specify. The _\_headers_ file needs to be inside the _public_ folder, hence the `public/_headers` path.

When you visit your protected branch, you will now be asked to enter a username and a password :wink:

Congratulations! You now know how to protect specific branches behind an basic authentication process! Your rivals can't spy on your new cool features now :smile:

have fun :heart:
