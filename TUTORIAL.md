# Tutorial: How to Get Started with the Mini Amazon Skeleton

[Under Construction]

This tutorial walks you through the steps of adding a simple feature
to the Mini Amazon in a teamwork setting.  It touches on the basics of
source control, dependency management, and full-slack
development/debugging.

## Prerequisites

We assume that you have already installed the current skeleton in your
course container per
[instructions](https://gitlab.oit.duke.edu/compsci316/mini-amazon-skeleton/-/blob/main/README.md).
That means one member of your project team has already created a repo,
and you have cloned it and run the installation script succesfully.

We highly recommend you use VSCode; VSCode-related instructions below
assume that you have already got VSCode to work with your container
(see
[instructions](https://docs.google.com/document/d/1khEXxG-7dO-RU7-AJcQQqRXXuBtJCOt-hjpYu8rw25o/edit?usp=sharing)).

## Overview and goal

Let's say that you want to add a simple feature to Mini Amazon that
allows users to add product to their wish list.  Users can then see
products on their wish list along with the times when they were added.
That's it.

In order to accomplish this task, you will learn:

* How to use the source control tool `git` to create a private
  workspace for you to work on this feature without stepping on your
  teammates' toes, and to integrate new feature into your team repo in
  the end;

* How to extend your database design and Flask models for this
  feature;

* How to design, implement, and test API endpoints for this feature;

* How to create web page templates for this feature, and how to
  integrate it into the rest of the website.

## Making your feature branch

## Extending database design and Flask models

## Designing, implementing, and testing API endpoints

## Keeping up with the `main` branch

## Working with templates the rest of the website

## Merging your feature branch into `main`

## Debugging

### Basic debugging

If your code contains some error (such as a syntax error in Python),
it may cause the app server to exit with an error; you can note the
error reported in the container shell, fix it, and restart by running
`flask run` again.

For "soft" errors that don't cause the the app server to exit, it
turns out that you can keep it running and edit your app code on the
side.  In most cases, your edits will be automatically reflected.
Sometimes you will see an error reported by the server in your browser
while the server continues to run; in that case you can do some
limited form of debugging directly from your browser.  You will need a
debugger PIN in that case --- you can find it from the output in the
container shell when you issued `flask run` earlier.

When your code is not behaving as expected, you can insert `print()`
calls, recreate the steps to produce the error, and inspect what's
going on.  The output of `print()` will appear in the container shell
where you issued `flask run`.

### VSCode-aided debugging

If you run VSCode, it can give you fanicier debugging support
including setting breakpoints, stepping through code line by line,
etc.  You can set (or unset) breakpoints by clicking to the left of
the line numbers in the editor.  To use VSCode debugging, don't run
your app server from the container shell; instead, on the left edge of
the VSCode window, find the :arrow_forward: button with a bug on it,
and click on that button to bring up the debugging pane.  On top of
that pane you will see another :arrow_forward: button with "Python:
Flask" next to it; click on it to start debugging.

In the mode, you can simply rely on breakpoints to pause execution at
strategic points, and then inspect the values of Python variables at
that point in time (instead of using `print()`).  In the lower-right
pane where you typically would have the TERMINAL (conatiner shell),
you can switch to the DEBUG CONSOLE tab for more debugging facilities.
