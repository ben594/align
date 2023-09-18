# Skeleton Code for CompSci 316 Standard Course Project.

Originally created by [Rickard
Stureborg](http://www.rickard.stureborg.com) and [Yihao
Hu](https://www.linkedin.com/in/yihaoh/) for Fall 2021.  Amended by
various teaching staff in subsequent years.

We assume you are in your course container shell.  If you have a
different setup, your mileage with the following instructions may
vary.

## Installing the Current Skeleton

1. One (and only one) team member should fork this repo by clicking
   the small 'Fork' button at the very top right on GitLab.  It's
   important that you fork first, because if you clone this repo
   directly you won't be able to push changes (save your progress)
   back to this repo (which is owned by the teaching staff).  Name
   your forked repo as you prefer.

   In your newly forked repo, find the blue "Clone" button.  Copy the
   "Clone with SSH" text.  Add your teammates as members of your
   project as "Maintainers."  Share the copied text with your
   teammates so they have access to this repo too.

   The remaining steps should be carried out by all team members.

2. In your container shell, issue the command `git clone
   THE_TEXT_YOU_JUST_COPIED` (make sure to replace
   `THE_TEXT_YOU_JUST_COPIED` with the "Clone with SSH" text).
   
3. In your container shell, change into the repository directory and
   then run `./install.sh`.  This will install a bunch of things, set
   up an important file called `.flashenv`, and creates a simple
   PostgreSQL database named `amazon`.

## Running/Stopping the Website

To run your website, in your container shell, go into the repository
directory and issue the following commands:
```
poetry shell
flask run
```

The first command ensures that you are in the correct Python virtual
environment managed by a tool called `poetry` (you can tell that your
command-line prompt looks differently --- it would start with the name
of the environment).  The second command runs the Flask/web server.
Do NOT run Flask outside the `poetry` environment; you will get
errors.

You can now use your laptop's browser to explore the website.
Depending on your setup, the URL will be different:

* If you use containers on your own laptop, point your browser to
  http://localhost:8080/

* If you use the Duke OIT container, visit
  https://cmgr.oit.duke.edu/containers and open the CONTAINER CONTROLS
  info pane for your CS316 container.  There will be a line specifying
  a user-specific URL for accessing a Flask app.  Point your browser
  to that URL.

  - If you are using VSCode to access your Duke OIT container and
    run/debug your project from there (by following these
    instructions), then VSCode will do some (SSH port forwarding)
    magic to make your Flask app also accessible at
    http://localhost:8080/

To stop your app, type <kbd>CTRL</kbd>-<kbd>C</kbd> in the container
shell; that will take you back to the command-line prompt, still
inside the `poetry` environment. If you are all done with this app for
now, you can type `exit` to get out of the `poetry` environment and
get back to the normal container shell.

## Working with the Database

Your Flask server interacts with a PostgreSQL database called `amazon`
behind the scene.  As part of the installation procedure above, this
database has been created automatically for you.  You can access the
database directly by running the command `psql amazon` in your VM.

For debugging, you can access the database while the Flask server is
running.  We recommend you open a second container shell to run `psql
amazon`.  After you perform some action on the website, you run a
query inside `psql` to see the action has the intended effect on the
database.

The `db/` subdirectory of this repository contains files useful for
(re-)initializing the database if needed.  To (re-)initialize the
database, first make sure that you are NOT running your Flask server
or any `psql` sessions; then, from your repository directory, run
`db/setup.sh`.

* You will see lots of text flying by --- make sure you go through
  them carefully and verify there was no errors.  Any error in
  (re-)initializing the database will cause your Flask server to fail,
  so make sure you fix them.

* If you get `ERROR: database "amazon" is being accessed by other
  users`, that means you likely have Flask or another `psql` still
  running; terminate them and re-run `db/setup.sh`.  If you cannot
  seem to find where you are running them, a sure way to get rid of
  them is to stop/start your container.

To change the database schema, modify `db/create.sql` and
`db/load.sql` as needed.  Make sure you run `db/setup.sh` to reflect
the changes.

Under `db/data/`, you will find CSV files that `db/load.sql` uses to
initialize the database contents when you run `db/setup.sh`.  Under
`db/generated/`, you will find alternate CSV files that will be used
to initialize a bigger database instance when you run `db/setup.sh
generated`; these files are automatically generated by running a
script (which you can re-run by going inside `db/data/generated/` and
running `python gen.py`.

* Note that PostgreSQL does NOT store data inside these CSV files; it
  store data on disk files using an efficient, binary format.  In
  other words, if you change your database contents through your
  website or through `psql`, you will NOT see these changes reflected
  in these CSV files (but you can see them through `psql amazon`).

* For safety, a database should never store password in plain text;
  instead it stores one-way hash of the password.  This rule applies
  to the password value in the CSV files too.  To see what hashed
  password value you should put in a CSV file, see `db/data/gen.py`
  for example of how to compute the hashed value.

## Note on Hiding Credentials

Use the file `.flaskenv` for passwords/secret keys --- we are talking
about passwords used to access your database server, for example (not
user passwords for your website in CSV files described earlier).  This
file is NOT tracked by `git` and it was automatically generated when
you first ran `./install.sh`.  Don't check it into `git` because your
credentials would be exposed to everybody on GitLab if you are not
careful.
