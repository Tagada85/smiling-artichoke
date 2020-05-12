---
title: Deploy a Loopback 4 / PostgresQL application on Google Cloud
subtitle:
excerpt: >-
  In this article, we will explain how to create a simple drawer navigation for your React Native application.
date: "2019-12-15"
thumb_img_path: images/react-native.png
content_img_path: images/react-native.png
tags: ["loopback", "javascript", "google cloud", "postgresql", "node"]
template: post
---

## Setup

- get the code from the github project
- GO to the google cloud console
- Select a project (img 1)
- CLick new Project (img 2)
- Create new project (img 3)
- Wait for the project to be created. You will see the dashboard.
- Click on App Engine on the left menu
- Click on Create Application (img 11)
- Choose your region, and Choose Flexible as the environment.
- Click on Download Cloud SDK and follow the instructions to install it.(img 12)

## Creating a SQL Cloud instance

- CLick on SQL in the left menu (img 4)
- You will have to create/enable a billing account before going further.
- Creating the billing account will send you to the Billing page. Click again on SQL in the left menu.
- CLick on create instance. (img 5)
- YOu have three choices. Choose PostgresQL
- Wait for the initialisation.
- Create your instance by filling the form. Choose the instance name, password, region as you wish. (img 6)
- THe instance will be updated and you should see it in the instances list.
- Click on the instance name, lb4-psql-gcp-instance in my case
- We need to create a new database. Click on the database tab on the left (img 8)
- CLick on the blue button Create Database
- Give a name to your database in the modal that appears.
- After that, you should see your database in the list like so. Mine is called cooldatabase (img 9)
- Next, we have to define a password for the postgres user. That user is created by default, but we need to set a password for it.
- Click on the Users tab on the left, then click on the 3 little dots and finally click on Change Password (img 10)
- Give a password to your postgres user.
- Of course, if you wish, you can create a different user than postgres ;)

## Setting up our lb4 code

Ok, so now we have our App Engine application and PostgresQL database set up, we need to modify our loopback4 code to make sure that our application works properly. We need to create an app.yaml file. This file will be used by App Engine to know what it needs to deploy.

In the root of the project, create the app.yaml file:

```yaml
runtime: custom
env: flex
beta_settings:
  cloud_sql_instances: loopback4-psql-gcp:europe-west1:lb4-psql-gcp-instance

manual_scaling:
  instances: 1
resources:
  cpu: 1
  memory_gb: 0.5
  disk_size_gb: 10
```

Two things here: the first is the custom runtime. Loopback uses a Dockerfile to build the project. Therefore, we can't define this application as _nodejs_ for App Engine, it needs to be _custom_. Second, the _cloud_sql_instances_. The connection name can be found in SQL -> CLick on your instance's name, you will see it in the instance overview.(img-13)

Then, we need to tell our loopback4 application where to find our database. We already have a JSON file inside _src/datasources_ to configure our localhost database. Now, we need to configure our database connection for our production environment.

- Create a folder called _server_ in the root of your project. Then create a file called _datasources.production.json_.
- Add the following inside that file:

```json
{
  "name": "Postgres_Db",
  "connector": "postgresql",
  "host": "/cloudsql/loopback4-psql-gcp:europe-west1:lb4-psql-gcp-instance",
  "user": "postgres",
  "password": "postgres",
  "database": "cooldatabase"
}
```

A few things to be careful about:

- The name value is important because it's used in the datasource when we inject it. (img 14)
- You need to replace the host, user, password and database values with the values you created.

Now, inside the _src/application.ts_ file, we need to import the JSON configuration. Add the following line at the top of the file:

```javascript
import configProd from "./server/datasources.production.json";
```

Then, inside the constructor in the same file, add the following lines:

```javascript
this.component(RestExplorerComponent);

// We added these lines
if (process.env.NODE_ENV === "production") {
  this.bind("datasources.config.db").to(configProd);
}
// Stop

this.projectRoot = __dirname;
```

Here, we tell our application to change the database configuration in our production environment by binding the JSON configuration we imported to the datasource.

Finally, in the Dockerfile, change the line:

```
ENV HOST=0.0.0.0 PORT=3000
```

to

```
ENV NODE_ENV=production
```

## Deploy with gcloud command line

After installing the Cloud SDK, you should have access to the gcloud command line tool. We will use it to deploy our application.

- Inside the project folder, run _gcloud init_. If there is already a current configuration, choose 2 and enter your configuration name. (img 15)
- Choose the account you want to run operations for this configuration. You are new logged.
- Pick a project. You should see the name you entered at the very beginning of the article. Mine is _loopback4-psql-gcp_.

- Run _gcloud app deploy_. You will be asked to confirm:
  (img 16)
