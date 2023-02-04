---
title: Factory method
subtitle: Building an coffee shop empire using a powerful design pattern
excerpt: >-
  The factory method design pattern allows us to elegantly create new objects. Let's see how it works.
date: "2023-02-04"
thumb_img_path: images/coffee-shop-factory-class-diagram.png
content_img_path: images/coffee-shop-factory-class-diagram.png
tags: ["java", "designpatterns"]
template: post
---

## Factory method

Second stop in my journey through the design patterns: **the Factory Method**.

_The Factory Method Pattern defines an interface for creating an object, but lets subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses._

Now, that might not be very clear so consider this diagram.

![Class Diagram to represent the factory method pattern](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eh1fxxc9fgrtkchz99i5.png)

As you can see, we have a Creator class that declares a factory method, called `createProduct`. We can declare it as an abstract method, to force the all subclasses to implement their own `createProduct` logic.

The Product is an interface that is common to all subclasses and the creator. Concrete Products are different implementations of the Product interface.

This all sounds very generic, so maybe we can try a more "real-world" example.

## Coffee Shop Empire

To illustrate a factory, we'll imagine ourselves running a coffee shop chain.

Below is a class diagram describing how things would be organized.

![Coffee Shop Class Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8ln5nrpjuvopwa0x8i3w.png)

We have our Coffee Shop class that defines an abstract method `orderCoffee`. This is our factory method. Each coffee shop will implement their version of the `orderCoffee` method.

The goal of the factory design pattern is to let the _subclasses_ decide which products they want to create. Let's look at the code.

```java
public abstract class CoffeeShop {
    abstract Coffee orderCoffee(String type);
    abstract void openShop();
    abstract void closeShop();
    abstract void cleanTables();

}
```

This is our abstract class CoffeeShop. That's our _creator_ class that every CoffeeShop will inherit. But, because it's an abstract class, it's up to the individual coffee shops to implement these methods.

Now, let's create two coffee shops, one in Paris, another one in New York.

```java
public class ParisCoffeeShop extends CoffeeShop{
    @Override
    public Coffee orderCoffee(String type){
        Coffee coffee = null;
        if(Objects.equals(type, "Espresso")){
            coffee = new Espresso();
        } else if(Objects.equals(type, "Café au lait")) {
            coffee = new CafeAuLait();
        }

        coffee.brew();
        return coffee;
    }

    @Override
    public void openShop() {
        System.out.println("It's 10 AM!");
        System.out.println("Opening the Coffee Shop in Paris. Un petit café?");
    }

    @Override
    public void closeShop() {
        System.out.println("It's 4 PM!");
        System.out.println("Closing the Coffee Shop in Paris. A demain!");
    }

    @Override
    public void cleanTables() {
        System.out.println("Cleaning is occuring here...");
    }
}

public class NYCoffeeShop extends CoffeeShop{

    @Override
    public Coffee orderCoffee(String type){
        Coffee coffee = null;
        if(Objects.equals(type, "Espresso")){
            coffee = new Espresso();
        } else if(Objects.equals(type, "Cappuccino")) {
            coffee = new Cappuccino();
        }

        coffee.brew();
        return coffee;
    }

    @Override
    public void openShop() {
        System.out.println("It's 9 AM!");
        System.out.println("Opening the Coffee Shop in New York! Come in!");
    }

    @Override
    public void closeShop() {
        System.out.println("It's 6 PM!");
        System.out.println("Closing the Coffee Shop in New York! See you tomorrow!");
    }

    @Override
    public void cleanTables() {
        System.out.println("Cleaning in progress....");
    }
}

```

We can see here that each coffee shop determines at their subclass level which Coffee they need to make. The coffee shop in Paris doesn't need Cappuccino for example, so it doesn't even know the product's existence. However, their clients love some "Café au lait", so they added it to their menu.

In the same way, the coffee shop in New York added a Cappuccino to their menu. But, the "Café au lait" is nowhere to be found because their customers don't want that product.

Each coffee shop knows and instantiate only the products they need. What is interesting about this approach is that whenever we need to remove or add a product to a coffee shop, we only need to touch the coffee shop in question. The other coffee shops are totally independent from this implementation.

So, what about our products?

```java
public interface Coffee {
    void brew();
}

public class Espresso implements Coffee{
    @Override
    public void brew() {
        System.out.println("Brewing Espresso!");
    }
}


public class CafeAuLait implements Coffee{
    @Override
    public void brew() {
        System.out.println("Brewing a Café au Lait");
    }
}

public class Cappuccino implements Coffee{
    @Override
    public void brew() {
        System.out.println("Brewing Cappuccino");
    }
}
```

We have a Coffee interface that declares a `brew` method. Then, every coffee type implements our interface and decide what they want to do in the `brew` method. The Coffee interface is common to all sub-products and coffee shops.

We are ready to open up our coffee shop chain! Let's run some code!

```java
public static void main(String[] args){


		ParisCoffeeShop parisCoffeeShop = new ParisCoffeeShop();
		NYCoffeeShop nyCoffeeShop = new NYCoffeeShop();

		nyCoffeeShop.openShop();
		parisCoffeeShop.openShop();


		parisCoffeeShop.orderCoffee("Café au lait");
		parisCoffeeShop.orderCoffee("Espresso");

		nyCoffeeShop.orderCoffee("Espresso");
		nyCoffeeShop.orderCoffee("Cappuccino");
}
```

This code will log out:

```
It's 9 AM!
Opening the Coffee Shop in New York! Come in!
It's 10 AM!
Opening the Coffee Shop in Paris. Un petit café?
Brewing a Café au Lait
Brewing Espresso!
Brewing Espresso!
Brewing Cappuccino
```

Nice!

Now, what happens if we actually need to change some things? Few weeks after the opening, we realise that the customers needs are not what we thought they were!

In Paris, turns out the Espresso doesn't really work out, but the Cappuccino is in high demand! Meanwhile, in New York, clients are demanding a new product: Iced Coffee.

How do we handle this? Well, first step: creating our Iced Coffee product:

```java
public class IcedCoffee implements Coffee{
    @Override
    public void brew() {
        System.out.println("Brewing a Iced Coffee!");
    }
}
```

Perfect! Now, let's got to Paris. We need to update the menu to remove the Espresso and add the Cappuccino. Easy fix in our `orderCoffee` method:

```java
    public Coffee orderCoffee(String type){
        Coffee coffee = null;
        if(Objects.equals(type, "Cappuccino")){
            coffee = new Cappuccino();
        } else if(Objects.equals(type, "Café au lait")) {
            coffee = new CafeAuLait();
        }

        coffee.brew();
        return coffee;
    }
```

That's taken care of, let's update the New York coffee shop menu:

```java
 public Coffee orderCoffee(String type){
        Coffee coffee = null;
        if(Objects.equals(type, "Espresso")){
            coffee = new Espresso();
        } else if(Objects.equals(type, "Cappuccino")) {
            coffee = new Cappuccino();
        } else if(Objects.equals(type, "Iced Coffee")) {
            coffee = new IcedCoffee();
        }

        coffee.brew();
        return coffee;
    }
```

There we go! Menus updated! Customers happy! And each coffee shop is able to update its products without all the different shops ever knowing about it!

Hopefully, that was an helpful explanation on the factory design pattern.

Have fun <3
