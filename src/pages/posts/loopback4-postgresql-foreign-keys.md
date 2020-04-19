---
title: Using foreign keys with Loopback 4 ans PostgresQL
subtitle: Setting up a Loopback4/PostgresQL project
excerpt: >-
  Configuring properly a Loopback 4 project that uses PostgresQL and setting up correctly the foreign keys appeared to be quite difficult for me. In this article, let's explore how you could do it!
date: "2020-04-19"
thumb_img_path: images/lb4.png
content_img_path: images/lb4.png
tags: ["loopback", "postgresql", "node", "javascript"]
template: post
---

# Introduction

I recently started a new project for a client. The stack for this project included the framework Loopback 4 with a PostgresQL database. I ran into some issues setting up the foreign keys. In this article, we'll set up a quick project with a few models and foreign keys to get started properly. That might help some of you if you ever need to do the same thing.

# Setting up our project

Loopback allows developers to use a command line tool. To install it globally, you can run: `npm i -g @loopback/cli`.

Once this is done, we can create a new project by running the command `lb4 app`. You'll have a complete a few fields like shown on the following image.
![Creating an Loopback application](https://dev-to-uploads.s3.amazonaws.com/i/fjswctphi9yjxh8vjjud.png)

I added every single function in the project. Now, the CLI tool will install the needed dependencies for you. When it's done, you should see:

![Successfully created Loopback application](https://dev-to-uploads.s3.amazonaws.com/i/265f8gxy65lu9vkwh0v2.png)

Mine is in French, but it just tells you that the project has been created and how to run it.

Great! Now we can create our models.

## Creating our models

The models we create with Loopback will be used to create the database's tables. Loopback gives us a way to quickly create a model with the command line tool we installed earlier.

But what kind of models will we create? We'll have 3:

- Customer model will have an id, a name and a platformId.
- Order model will have an id and a customerId.
- Platform model will have an id and a name.

We keep things simple, the point is not to have complex models, but to show how to setup everything properly.

First, let's create the customer model. To create a model, we can run `lb4 model`.

The command line will ask you some questions about the model. Answer it like the image below.

![Creating the Customer model](https://dev-to-uploads.s3.amazonaws.com/i/8euq0ti6w97po7mh9ni5.png)

Good, next up, the Order model:

![Creating the Order model](https://dev-to-uploads.s3.amazonaws.com/i/af809mlzrawe11btabgp.png)

Finally, the Platform model:

![Creating the Platform model](https://dev-to-uploads.s3.amazonaws.com/i/3b2qri2qzsir0yjyn14u.png)

We know have our three models. Next up, we need to create a datasource. In other words, tell our application where to find our database.

## The Loopback datasource

As mentioned previously, we want to use a PostgresQL database. To link a database to Loopback, we can run the command `lb4 datasource`:

![Creating the datasource](https://dev-to-uploads.s3.amazonaws.com/i/wvhsc8vbyi2xltjlps1s.png)

You'll have to use the arrow keys to find the PostgresQL connector in the list. By default, PostgresQL runs on port 5432. Choose the username/password combination that you want.

_Note:_ Loopback may install the _loopback-connector-postgresql_ package if it's not present. This connector is used by Loopback to talk to a PostgresQL database.

## Create the database

Good! Now, the problem that we have is that we need to actually create the database _test_postgres_, which is the name I chose here. If you do not have PostgresQL installed, you can follow this [tutorial](https://blog.timescale.com/tutorials/how-to-install-psql-on-mac-ubuntu-debian-windows/).

Once you have it installed, you should see the PostgresQL version when you run `psql --version`.

If that's the case, you should be able to connect to a PostgresQL instance:

![PostgresQL instance](https://dev-to-uploads.s3.amazonaws.com/i/7cmbw0o9i2kx6vhbyem1.png)

The -U flag is followed by the user name you chose when you created your datasource with Loopback. You'll then be prompted to enter the password you entered earlier. If everything went smoothly, you should see `postgres=#` in the command line, meaning that the connection was successfull.

To create the database, we'll run the command `CREATE DATABASE <Database_Name>;`

![Creating our database](https://dev-to-uploads.s3.amazonaws.com/i/aiw2q8dpqlypdzat455g.png)

Then we can connect to our new database by running `\c test_postgres;`

![Connecting to our database](https://dev-to-uploads.s3.amazonaws.com/i/9gg294t8c72uq122dewa.png)

Great! Next up, we need to create the repositories.

## Create the repositories

A repository is adding behavior to a model. This is different from Loopback 3 where the model was also providing the CRUD behaviors. Here, we can run `lb4 repository` to create our repositories.

![Creating our repositories](https://dev-to-uploads.s3.amazonaws.com/i/xqcou8sgvb43ifz0msxw.png)

You first select our datasource, then choose all three models ( use space to select ).

Now, we can run our Loopback application with `npm start`. In our psql instance, I can see the current tables by running `\dt;`

![Showing the tables](https://dev-to-uploads.s3.amazonaws.com/i/f9uzom6jrp44t9zjr7oz.png)

## Create our controllers

Finally, we'll create our controllers. Controllers are created by running `lb4 controller`

![Creating our controllers](https://dev-to-uploads.s3.amazonaws.com/i/cgn2lnj3astm40fq78zb.png)

This will create the basic CRUD endpoints for each model.

## Where the issue starts

So far, everything is going fine. Let's see where it starts to go bad. Loopback 4 gives you a command to auto-migrate your database models that you can run with `npm run migrate`.

![Running the migration](https://dev-to-uploads.s3.amazonaws.com/i/ezpxu0ksv78yto2lsyq2.png)

Ok, this comes out of nowhere. Let me explain. Remember when we created our models earlier, we gave the _id_ field a type _string_. I also said that this field would be generated automatically. Indeed, I want to use the PostgresQL UUID type, something in the form of `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`.

Now, if I said that the _id_ type was _number_, it would be quite easy for Loopback. It starts at 1, and increments by 1 every time a new entity is created in the database. But when the type is string, Loopback doesn't know how to autogenerate this, we have to tell him. That's what the error is all about.

### Giving our id fields the UUID type

We need first to go into our models and explicitly say how to generate the id field. In the files `src/models/customer.model.ts`, `src/models/order.model.ts` and `src/models/platform.model.ts`, change the code:

```js
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;
```

to

```js
  @property({
    type: 'string',
    id: true,
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id?: string;
```

That's how we explicitly tell Loopback how to use the UUID type for our id fields. We are going to run `npm run migrate -- --rebuild` to drop the existing schemas. The warnings are gone!

_Note:_ You may have to install the package _uuid-ossp_ that provides the function for the UUID generation in psql. If that the case, inside your psql instance, run `create extension if not exists "uuid-ossp";`.

## Testing our progress

I want to make sure that our ID field is indeed using the UUID type. Loopback gives us the Explorer API to easily interact with the database and the models. You can find the Explorer at `http://localhost:3000/explorer`. You can find here our controllers we created earlier and the basic endpoints. Let's quickly create a new Platform. Find the PlatformController and click on the _POST /platforms_ item. Then, click on the _Try it out!_ button on the right. You should see the following screen.

![Inside the Loopack Explorer API](https://dev-to-uploads.s3.amazonaws.com/i/0qxi94tn58ew3simoi3i.png)

We can create a new Platform entity by typing the platform name ( where there is _"string"_. I'm calling my new platform "Best Platform Ever". Then click on _Execute_. You should see this below.

![Creating a new Platform feedback](https://dev-to-uploads.s3.amazonaws.com/i/dos2bcxms0hwabn1k38l.png)

As you can see, the id has been generated automatically and it has the UUID type we wanted!

## Foreign keys

Last but not least, we will configure our foreign keys. In our models, we need to add some settings. First, in our Customer model, we need to configure the foreign key for the Platform model. In `src/models/customer.model.ts`, above the class definition, you have a _@model()_ decorator. Replace it with:

```js
@model({
  settings: {
    foreignKeys: {
      fkCustomerPlatformId: {
        name: 'fk_customer_platformId',
        entity: 'Platform',
        entityKey: 'id',
        foreignKey: 'platformid',
      },
    },
  },
})
```

As you can see, our foreign key as a name, and entity, entity key and foreign key. The entity represents the model it references, here, _Platform_. The entity key is the field we use for the reference, here, _id_. Finally, the foreign key is the name of the field in our Customer table, here _platformid_.

Good, so we should be good for the Customer table right? Let's find out. Run `npm run build`, then `npm run migrate -- --rebuild`.

ERROR!

![Migration error](https://dev-to-uploads.s3.amazonaws.com/i/cwpuz4pndm2ths1qq8b0.png)

It says that the foreign key can't be implemented. If you look for details in the error log, it says that the type _uuid_ and _text_ are not compatible. Which makes sense, our Platform model has a field _id_ of type uuid. The _platformid_ field in our Customer model is of type string. That can't work. Go back in the Customer model and change the platformid field from

```js
@property({
    type: 'string',
    required: true,
  })
  platformId: string;
```

to

```js
 @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'uuid',
    },
  })
  platformId: string;
```

Run `npm run build` and `npm run migrate` (no need to rebuild). The error is gone. But let's make sure the foreign key has been implemented in the database. Move to psql and run `\d+ customer;` to get the constraints from the Customer table.

![Constraints of the Customer Table](https://dev-to-uploads.s3.amazonaws.com/i/kiiz92itsnwpw6i6q3fk.png)

As you can see, the foreign key constraint has successfully been added to the table!

We can now do the same thing for the Order model. We'll add a little difficulty here. We have to add a Platform reference in our Order model. So in addition to the customer.id foreign key, we need to add a platform.id foreign key. Don't worry, we don't need much :wink:

In our `src/models/order.model.ts`, the new class should look like this:

```js
// Adding our foreign keys configuration
@model({
  settings: {
    foreignKeys: {
      fkOrderPlatformId: {
        name: 'fk_order_platformId',
        entity: 'Platform',
        entityKey: 'id',
        foreignKey: 'platformid',
      },
      fkOrderCustomerId: {
        name: 'fk_order_customerId',
        entity: 'Customer',
        entityKey: 'id',
        foreignKey: 'customerid',
      },
    },
  },

})
export class Order extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'uuid',
    },
  })
  customerId: string;

// This is new
  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'uuid',
    },
  })
  platformId: string;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}
```

We added the new _platformId_ property definition. We also added the dataType for the _customerId_ and _platformId_, to make sure the field types are compatible. Finally, we added the configuration for our foreign keys in the model decorator.

Let's run `npm run build` and `npm run migrate` again. This time, in psql, run `\d+ order;` to get the constraints from the Order table:

![Constraints Order table](https://dev-to-uploads.s3.amazonaws.com/i/ali139xxfdt5i9xvzoxv.png)

There we have it! Our 2 foreign keys are properly configured, just like we expected! Congratulations!

## Conclusion

I spent a lot of time debugging this issue. I hope I managed to make it clear for you if you run into those issues. The Loopback 4 documentation can be a bit difficult to navigate sometimes, or even non-existent.

Have fun :heart:
