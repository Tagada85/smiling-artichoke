---
title: Observer pattern
subtitle: Managing client expectations thanks to the Observer pattern
excerpt: >-
  The Observer pattern allows us to control the notifications we send to subscribed objects. Let's see how it works.
date: "2023-02-11"
thumb_img_path: images/observer-pattern.png
content_img_path: images/observer-pattern.png
tags: ["java", "designpatterns"]
template: post
---

## Observer pattern

Third stop on my journey: the Observer pattern.

### The problem

Let's consider the following example. You run a company that sells video games. Some of your customers want to be notified when you receive the game they want to buy. Or maybe they'll want to receive an alert when a game of certain genre is for sale in your store.

We don't want the customer to check in with your store every day until what they want is available. We also don't want to send an alert to every single customer every time a new game comes out. Only certain types of customers are interested in certain types of games. We can't spam them all!

Here's the sort of problems that the Observer pattern allows us to solve. How?

## Solving the problem

In the Observer pattern, we define two sorts of objects: the **Publisher** and the **Subscriber**.

The Publisher, also called Subject, is the object that holds interesting state. In our case, the Publisher would be our video game store. The Publisher knows which objects are subscribed to it.

The Subscribers, like the name indicates, are the objects subscribing to the Publisher. The subscribers can subscribe/unsubscribe to the Publisher object when they want to. The subscribers will then receive notifications from the Publisher when the Publisher state changes.

### Class diagram

Let's look at a class diagram to see how the objects would interact with one another.

![Video game store Observer Class Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rcjvkdhapk5hujebeyum.png)

Our `VideoGameStore` is the _client_ that creates our `Publisher` and `Subscriber` objects.

The `Publisher` holds a state. In this case, we called it _videoGamesOfInterest_, which would be the list of video games that our subscribers want to be notified about. Publishers have a subscription infrastructure that allows new subscribers to join the list, and actual subscribers to unsubscribe. The list of subscribers is not set in stone when we create our Publisher. Finally, our Publisher triggers events when its state changes. Theses events notify each Subscriber in the list.

The `Subscriber` object declares the notification interface. We have here an `update` method that can take a context so that the Publisher can pass along some details about the events.

Finally, our `Client` objects are the concrete Subscribers. They implement the Subscriber interface and will receive the events from the Publisher class. When the Subscriber receive the notification, it will usually perform some actions, that's why it's useful to send a context with the notification to help with that.

### The code

Now that we have a structure in mind, let's see how that would be implemented directly in code.

Let's first create our `VideoGameStore`

```java

public class VideoGameStore {

    List<VideoGame> listOfVideoGames = new ArrayList<>();
    public Publisher RTSPublisher;
    public Publisher FPSPublisher;

    public VideoGameStore(){
        VideoGame SC2 = new VideoGame("Starcraft 2", "RTS");
        VideoGame CallOfDuty = new VideoGame("Call of Duty", "FPS");
        this.listOfVideoGames.add(SC2);
        this.listOfVideoGames.add(CallOfDuty);
        RTSPublisher = new Publisher(SC2);
        FPSPublisher = new Publisher(CallOfDuty);
    }
    public void sellVideoGame(VideoGame videoGame){
        System.out.println("Selling " + videoGame.name);
    }
}

class VideoGame{
    String name;
    String type;
    public VideoGame(String name, String type){
        this.name = name;
        this.type = type;
    }

}

```

Our `VideoGameStore` holds a list of VideoGame. Each VideoGame has a name and a type. We then create 2 Publishers, one for the video game Starcraft 2, and another for the video game Call of Duty. Our Publisher code looks like this:

```java
public class Publisher {

    List<Subscriber> subscribers = new ArrayList<>();
    private final VideoGame videoGameOfInterest;

    public Publisher(VideoGame videoGame){
        this.videoGameOfInterest = videoGame;
    }
    public void subscribe(Subscriber subscriber){
        this.subscribers.add(subscriber);
    }

    public void unsubscribe(Subscriber subscriber){
        this.subscribers.remove(subscriber);
    }

    public void notifySubscribers(){
        System.out.println(this.videoGameOfInterest.name + " has arrived!!");
        for(Subscriber subscriber: subscribers){
            subscriber.update( this.videoGameOfInterest.name + " has arrived!!");
        }
    }
}
```

Like we mentionned before, the Publisher holds a state. In our case, this is the video game of interest. The Publisher also has a list of subscribers. This would be the list of clients we need to notify when we get an update for our video game of interest. We can also subscribe or unsubscribe clients to this Publisher. Finally, the notifySubscribers function will send an update to each subscriber.

Each Client implements the Subscriber interface.

```java
public interface Subscriber {
    void update(String context);
}

public class Client implements Subscriber{
    String name;
    public Client(String name){
        this.name = name;
    }
    @Override
    public void update(String context) {
        goToStore();
    }

    private void goToStore(){
        System.out.println(this.name + " is going to the store!");
    }
}
```

We keep things simple here. We pass a `context` to the `update` method, so our Client knows what happens. Then, when our Client receives the notification, we trigger a `goToStore` function. We could of course have more complicated logic in there.

Let's test it out:

```java
public static void main(String[] args){

		VideoGameStore videoGameStore = new VideoGameStore();

		Client John = new Client("John");
		Client Sarah = new Client("Sarah");
		Client Paul = new Client("Paul");

		videoGameStore.FPSPublisher.subscribe(John);
		videoGameStore.FPSPublisher.subscribe(Sarah);

		videoGameStore.RTSPublisher.subscribe(Sarah);

		// We receive the new RTS game
	videoGameStore.RTSPublisher.notifySubscribers();

	// We receive the new FPS game
	videoGameStore.FPSPublisher.notifySubscribers();

}

```

After creating our VideoGameStore, we create 3 clients, John, Sarah and Paul. John is interested in the new FPS game, Call of Duty, so we subscribe him to the FPSPublisher we have, so he can be notified when the store has something new.

Meanwhile, Sarah is also interested in the Call of Duty game, but she's also interested in RTS games, so we subscribe her to our RTSPublisher.

Finally, Paul is not interested is neither FPS or RTS games, so we do not subscribe him to any of the Publishers.

The goal is to send updates to the clients that are interested in specific games, nothing more. Paul should not receive any updates.

Let's run this code:

```
Starcraft 2 has arrived!!
Sarah is going to the store!
Call of Duty has arrived!!
John is going to the store!
Sarah is going to the store!

```

First, we trigger our RTSPublisher notify function for the game Starcraft 2. Sarah is the only client subscribed to this publisher, so she goes to the store. As expected, nothing is sent to Paul and John because they don't care.

Then, we trigger our FPSPublisher notify function for the Call of Duty game. Sarah and John go to the store because they both subscribed to the Publisher. As expected, Paul didn't receive anything.

And that, in a nutshell, is how the Observer pattern works.

We could imagine a different Publisher for MOBA games, that Paul would be interested in for example. We could also imagine that Paul become interested in FPS games in the future and decides to subscribe to the FPSPublisher to get updates from now on.

What is important to realize is that this system is dynamic, the list of subscribers is not set in stone and can evolve over time.

Have fun <3
