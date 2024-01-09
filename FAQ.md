# Mini Amazon FAQ

## Working with the database

### My teammate says the code works but when I run it I always get SQL errors!

Did you rerun `db/setup.sh`?  Your teammate probably checked in some
changes to the database schema that haven't been reflected in your
local database yet.

If that didn't work, another possibility is that your teammate forgot
to check in changes to the database schema (`db/create.sql`,
`db/load.sql`, etc.) that the rest of the code depend on!  Ask him/her
to fix it.

### When running `db/setup.sh` I get `ERROR: database "amazon" is being accessed by other users`

That means you probably have other programs still accessing the
database.  Are you running your Flask app or `psql amazon` from some
container shell?  Find them and stop/exit from them (don't just close
the shell because it may not shut down the programs properly, leaving
the connections open).  And then try `db/setup.sh` again.

To find `psql` processes running in your container, try:
```
ps aux | grep psql
```
If anything comes up, you can kill it.  The process id would be the
second (integer-valued) field in the above output. The commend to kill
is:
```
kill process_id
```

Other options are:
* Run `dropdb amazon --force` and then `db/setup.sh`.
* Stop/restart your containers and then `db/setup.sh`.

### How do I see the effects of user actions on the website on the database?

Feel free to open another container shell (separate from the one where
you are running the Flask app), and run `psql amazon` there.  You can
issue SQL queries to see how table contents have changed in response
to website actions.

BTW, the PostgreSQL database does NOT store its data in the CSV files
under `db/data/`.  Those files only store the initial sample data to
load into the database.  To examine the current state of the database,
use `psql amazon`.

### What's the website login/password for user `0` in the default sample database?

* Email: `icecream@tastes.good`
* Password: `test123`

### Loading tables with automatically generated ids

An example is `Users(id)`.  You might want to hard-code a bunch of
user id values in your `db/data/Users.csv` (which is convenient,
because you can refer these ids in other tables' data files).
However, after loading the database, you realize that the next time
you insert into Users the automatically generated id value may clash
with one of your hard-coded values.  To work around this issue, in
`db/load.sql`, you need to tell PostgreSQL to start the "sequence"
used to generate automatic id values after the maximum value in your
CSV.  See that file for examples.

### Adding a user row with specific password into CSV load file

Note that the passwords in the `db/data/Users.csv` file are hashed for
safety.  If you want the password to be `secret123`, you cannot just
put that in the CSV file; instead, you put the hashed value for
`secret123` there.  Issue the following commands and use the output
(which should look like `pbkdf2:sha256:...`) for the password field in
the CSV file:
```
poetry shell
python -c 'from werkzeug.security import generate_password_hash; print(generate_password_hash("secret123"))'
```

### What are ways that I can share my database (contents) with my teammates?

For a development-focused team project like this, we highly recommend
that you check in code (like `db/create.sql`) + data files for loading
(like those CSV files in `db/data/`) that are human-readable and
diff-able.  Maintain these files up to date, so teammates can check
them out from the repo.  Everybody runs their own PostgreSQL server
and just have to run `db/setup.sh` to refresh.

Another option is to create a "database dump file" like this:
```
pg_dump --no-owner --encoding=UTF8 amazon | gzip - > ~/shared/amazon-dump.sql.gz
```
Then, send this file to your teammate in some way (you could check it
into your team repo if you really want to). They can use this dump
file to recreate the same database with same contents:
```
gunzip --stdout ~/shared/amazon-dump.sql.gz | psql amazon -f -
```
This is NOT recommended for your project as the these dump files are
not very human-readable or diff-able; not a great option if everybody
needs to refer to and/or modify the database schema.  (In the
real-world settings, this may be workable because most developers
don't even get to touch the database schema.)

Yet another option is for everybody to connect to the same backend
database.  You could for example create a separate dedicated database
server from one of the cloud vendors or on a Duke virtual machine.
Your teammates' Flask apps will connect to this same backend database.
We do NOT recommend this approach for development, however, because:
* You have to keep that server running at all times (which is not
  cheap).
* Whenever one of you change the database schema, it immediately
  affects all other teammates' Flask apps.  There is no isolation and
  it's too easy to break things.

## Interfacing the app with the database

### How do I put multiple SQL statements in a single transaction?

Read the comments in
[`app/db.py`](https://gitlab.oit.duke.edu/compsci316/mini-amazon-skeleton/-/blob/main/app/db.py).

### How do I protect against SQL injection attacks?

See lecture
[slides](https://courses.cs.duke.edu/fall23/compsci316d/lectures/09-sql-prog.pdf)
on this topic.  Specifically Slides 11 and 14-16.

### How do I paginate when there are too many result rows?  Can I avoid retrieving all of them from the database in one go?

Check out the very useful SQL feature `LIMIT`/`OFFSET`. For example,
this query returns the 400th-499th rows:
```
SELECT * FROM R
ORDER BY blah
LIMIT 100 OFFSET 400;
```

While there is a package called `flask-paginate`, it uses an ORM and
hence will NOT work our skeleton code (and in general ORM will not be
that easy to setup for complex schema).

## Working with frontend

### How do I learn more about working with forms in HTML and Flask?

The skeleton code works with
[`flask-wtf`](https://flask-wtf.readthedocs.io/en/1.2.x/), which is a
Flask wrapper for [WTF](https://wtforms.readthedocs.io/en/3.0.x/).
For a complete example, see
[`app/user.py`](https://gitlab.oit.duke.edu/compsci316/mini-amazon-skeleton/-/blob/main/app/users.py)
for `RegistrationForm` and `register()`.

Note that it's not necessary to use `flask-wtf`.  For simple things
such as implementing a button for a `POST` request, you can just code
a simple HTML form by hand; see
[tutorial](https://gitlab.oit.duke.edu/compsci316/mini-amazon-skeleton/-/blob/main/TUTORIAL.md)
for the implementation of "Add to Wishlist" as an example.

#### Can I pre-populate a form?

[`Form`'s constructor](https://wtforms.readthedocs.io/en/3.0.x/forms/)
can actually optionally accept an `obj` parameter as input to
re-populate the fields.  The constructor will automatically look for
fields within this object with matching names to supply the default
values.

## Working with `git`

### Can I get my deleted feature branch back?

Even after you delete the branch, it still lives somewhere in your
history (stored in a hidden `.git` directory under your
local/container project directory).  Google `git reflog recover
deleted branch` for help.
