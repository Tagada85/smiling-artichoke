---
title: Git blame should be called git credit
subtitle: "A case for positive language"
excerpt: >-
  We often like to use negative language in our statements, even though they are more harmful are more likely to be ill-perceived. Let's replace git blame by git credit/
date: "2020-07-05"
thumb_img_path: images/positivity.jpeg
content_img_path: images/positivity.jpeg
tags: ["git", "mental health"]
template: post
---

## Positive language

Language is important, really important. How we express our ideas and our desires has a big impact on how our words will be received. Positive statements get more quickly received by the audience, but they are also _well-received_.

Which of these would you like to hear better?

- Please don't be late at the restaurant tonight.
- Please be on time at the restaurant tonight.

* 66% chances you won't die, 33% chances you will die.
* 66% chances it will save you, 33% chances you will be saved.

Well, in both cases I'd rather hear the second version of those statements. In the second set, it is known as the [**framing effect**](<https://en.wikipedia.org/wiki/Framing_effect_(psychology)>). You'll be more likely to choose the option with the positive connotations rather than the option with the negative ones.

## git blame

Ok, back to our software things. The reason I got to think about this was because of _git blame_. Isn't it kind of strange that they went with a negative word such as blame for the command?

Here is the definition for blame:

> feel or declare that (someone or something) is responsible for a fault or wrong.

> responsibility for a fault or wrong.

Ew, that's not really joyful. But what's the point of the _git blame_ command anyway?

According to the [git documentation](https://git-scm.com/docs/git-blame):

> git-blame - Show what revision and author last modified each line of a file

So, _git blame_ tells you who wrote what code in a specific file. But there are no mention that it's to find a fault or wrong doing. We just want to find who wrote some code!

Why go with negative language when we could have something positive?

## Here comes credit!

Here is the definition for credit:

> publicly acknowledge a contributor's role in the production of (something published or broadcast).

Well, that's a lot more positive! Maybe I want to find who wrote that code so I can congratulate her on such a beautifully crafted piece of engineering.

You know who wrote that 6 months ago?

You. You did. Give yourself some credit you rockstar :heart:

## Aliasing

Turns out it's not that complicated if you are some weird person like me who likes to use positive language in your git commands. We can use some alias!

All you have to do is run this command:

`git config --global alias.credit blame`

Now, _git credit_ does the same job as _git blame_!

It's a tiny tiny change. But it makes me feel happy to use positive language whenever I can :smile:

Have fun :heart:
