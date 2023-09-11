* TODO: verify VSCode/poetry interaction
* TODO: make VSCode debugging works remotely

* turorial assumes team project repo already set up
* tutorial assumes VSCode already set up


* overview: briefly describe what we are trying to do with this tutorial, and what they should learn:
  - how git works for adding a new feature to a team repo
  - what steps are required for adding a feature that touches every component in the full stack
    + changing database schema (and load files for testing data)
    + adding new models and templates... first as indepent API endpoints
    + test endpoint directly in chrome
    + may need to add new python libraries... how to use poetry to manage
    + linking stuff in... requires modifying existing templates/code
    + how to manage git merge

* idea:
  adding to / viewing wishlist
  + new database table wishlist
  + new model... just for the sake of example say we want dateutil to compute
    "added one week ago" or something like that
  + page to view a person's wishlist + product details -> new template
  + endpoint to add a product to a person's wishlist -> need to be added to another page

* give descriptive instructions, but don't allow blind copying and pasting (at least not right away)

* need to make sure mutiple people can experiment on their own on the
  same team repo... perhaps ask them to name their own branches in a
  meangingful way... it won't make sense for everybody to merge the
  tutorial branch into main.

## Old Git Tips

These instructions seem long, but they aren't complicated.
If you've never worked with merge requests, make sure to read this thoroughly. 

To work on a gitlab project with many team members, you want to avoid working directly on the `main` branch as much as possible.
If multiple people work on this branch at the same time, you are likely to run into conflicts and be forced to restore old versions.
This is a mess.
Instead, use new branches every time you add a feature or make an edit, and then merge these into the main branch.
This is how to do it:

Let's imagine we want to create a new function to help with some specific query of the database. Before you begin, create and checkout a new branch for this feature.
1. `git branch query-feature` will create a branch named `query-feature`.
   You can change the name as you'd like.
   Then switch to this branch using `git checkout query-feature`.
2. Once you are on this branch, get to work.
   Make the edits you need to the files you want to work on.
3. Run the command `git status` to see what files have changed.
   Let's say you only edit the file `app/db.py` to add the new function along with some comments, and `README.md` to include some information about this feature.
   These files will then appear in red under the title `modified:`.
4. Now that you're done editing, you want to save your changes.
   Each save appears as a notification on gitlab in the form of a "commit".
   To be helpful, we save our edits in small chunks so that others can easily read these notifications and follow along which changes were made.
   Let's say we want to make two commits, one for `app/models/user.py` and another for `README.md`. 
   1. We make the first commit ready by adding the changes to `app/models/user.py` using the command `git add app/models/user.py`.
      Now, running `git status` will show this file in green, indicating it is being tracked.
   2. Now we can commit this change using the command `git commit -m "MESSAGE"`.
      We replace `MESSAGE` with a short description of what the change entailed.
      This is what shows up in the notification on gitlab. For example: `git commit -m "created a new function to find the total amount spent by a user"`
   3. Now repeat this process for the `README.md` file.
      That is: `git add README.md`, then `git commit -m "updated readme to include description of 'all-time spending' feature"`.
   4. You've saved your changes!
      But they're still only local (to your VM).
      To upload them to gitlab you need to run `git push --set-upstream origin query-feature`.
      By now you (and your teammates) should be able to see that you've made changes on the gitlab website.
      These changes appear in your repository under Repository -> Branches -> `query-feature`.
5. For others to add on top of your work, you want to open a "merge" request to merge your branch into the `main` branch.
   This request is an open invitation for your teammates to take a look at your code, make sure the changes look good to them, and then incorporate them onto the `main` branch for others to use.
   To open a merge request, click on "merge requests" in the left navigation bar on gitlab, and then hit the blue "New merge request" button at the top right.
   It will ask you to select a source branch.
   For our example above this would be the `query-feature` branch.
   For the target branch, leave it as `main`.
6. Once the merge request is created, ping your teammates to take a look at it.
   If they think it's acceptable, they just need to click "merge" and the code you've written gets incorporated.
   Now you can safely delete the `query-feature` branch on gitlab.
   Done!


