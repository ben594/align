# Tutorial: How to Get Started with the Mini Amazon Skeleton

[:construction: Under Construction :construction:]

This tutorial walks you through the steps of adding a simple feature
to the Mini Amazon in a teamwork setting.  It touches on the basics of
source control, Python dependency management, and full-slack
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
The tutorial below can be completed in a VSCode window connected to
the course container, with the project folder opened.  You can browse
and edit files, and use the TERMINAL pane

## Overview and goal

Let's say that you want to add a simple feature to Mini Amazon that
allows users to add product to their wishlist.  Users can then see
products on their wishlist along with the times when they were added.
That's it.

In order to accomplish this task, you will learn:

* How to use the source control tool `git` to create a workspace for
  you to work on this feature without stepping on your teammates'
  toes, and to integrate new feature into your team repo in the end;

* How to extend your database design and Flask models for this
  feature;

* How to design, implement, and test API endpoints for this feature;

* How to create web page templates for this feature, and how to
  integrate it into the rest of the website.

## Making your feature branch

First, you want to create a "branch" to work on this new feature.
Your team repo has a `main` branch that holds the "definitive" version
of your project.  Creating a separate branch allows you to work making
your changes to code in a protected environment where you and your
teammates can work on things independently without stepping on each
other's toes.  Pick a name for your branch that's meaningful to your
team, say `lisa-wishlist` (replace `lisa` with your own name to avoid
nameclash with your teammates), create it, switch to it, and tell the
team repo about it:
```
git branch lisa-wishlist
git checkout lisa-wishlist
git push --set-upstream origin lisa-wishlist
```
We will walk you through the steps of checking in code changes next.

## Extending the database design

1. First, think about how would you store the wish list in your
   PostgreSQL database called `amazon`.  To get a feel what's already
   in there, take a look at the code inside `db/`:
   * `create.sql` contains the SQL code that creates the schema.
   * `load.sql` contains the SQL code that loads database from data
     files (in CSV format).
   * `setup.sh` is `bash` script that sets up or resets the `amazon`
     database for you by calling the SQL code above.  (Running it will
     wipe out any data presently stored in the database, so use it
     with caution.)
     - Running `db/setup.sh` will (re)create a small sample database
       for testing, using the data from the `data/` subdirectory.
     - Running `db/setup.sh generate` will (re)create a larger test
       database, using the synthetic data from the `generate/`
       subdirectory (which also contains the generator code).

2. Now, let's figure out what to add to `db/create.sql` to support
   wishlist.  How about a separate table `Wishes` with the same
   structure as `Purchases`, except you'd have `time_added` (to the
   list) instead of `time_purchased`?  Go ahead edit `db/create.sql`
   add the new `CREATE TABLE` statement.

3. Beside the schema, it would be a good idea to update the SQL data
   loading code as well as sample/test database contents to be
   consistent.
   * Go ahead and create a new file `db/data/Wishes.csv` with, say,
     just two or items on the wishlist for one user.  You can model it
     after `db/data/Purchases.csv`.  Check other data files in that
     directory for valid ids to use to refer to users/products.  At
     the very least, add a wishlist item for user with `uid` `0`.
   * Edit the SQL loading code in `db/data/load.sql` accordingly to
     load the `Wishes` table.  Again, you can model the code after
     those for `Purchases`.  See that funny-looking
     `pg_catalog.setval` thingy?  It's for those automatically
     generated id values.  Take some time to learn how it works.
   * To be comprehensive, you should also modify the synthetic
     generation code and data in `db/data/generate/`, but we will skip
     it this time (just for this tutorial :smirk:).

4. Now, it's a good time to test everything!  Run `db/setup.sh` and
   fix any errors.  Run `psql amazon` to examine the result database,
   and run some SQL queries to do some sanity check on your schema and
   sample data.  It's also a good time to think a bit ahead about what
   SQL query you might want to run to support the frontend.  What
   would be SQL query that retrieves the wish list for a given user?
   What if you want to display the product name in that list?  Try
   these SQL queries.

## Your first `git` commit

1. You've done enough work to warrant a commit, which saves your work
   so far.  Here are some rules of thumbs on what goes into a commit:
   * Try to make your changes in conceptually clean steps, and commit
     at the end of every step.  Don't let too many changes accumulate!
   * Each step should be "complete" in some sense.  Don't check in
     a change that depends on something else not in the commit yet.
   * Always test your code before committing.  Every commit should
     end with a working code base.  Imagine how frustrating it would
     be if you check out somebody's changes only to find out that they
     break everything!

2. The following command gives you a summary of what changes you have
   made:
   ```
   git status
   ```
   You should see that you are currently on the `lisa-wishlist`
   branch, and you have some files modified (e.g., `db/create.sql`)
   and some "untracked" (e.g., `db/data/Wishes.csv`).  You can add all
   modifications into a staging area for commit in one go:
   ```
   git add -u
   ```
   You should add untracked files one at time, making sure that each
   one is really needed (as opposed to some temporary/sensitive file
   that shouldn't be checked in).  For example:
   ```
   git add db/data/Wishes.csv
   ```
   You can use the `git status` again to see where things stand.  It
   will show which files you've already added to the staging area for
   commit, and what other changes remain.

3. To commit, issue the following command:
   ```
   git commit -m "adding database support for wishlist"
   ```
   Here, use the message in quotes to describe your changes briefly.
   Congrats!  You made your first commit (at least in your local
   repo).

4. Next, you need to push the commit upstream:
   ```
   git push
   ```
   Now, your changes will be visible in your team's repo for others to
   see, though at this point they still remain in branch separately
   from the `main` --- we will discuss how to do a "merge request"
   later.

## Extending Flask models

1. Code in `app/models/` "wraps" data stored in the database as Python
   objects so they are easier for the rest of your Flask app to work
   with.  The intention is to encapsulate all SQL and database-facing
   code inside this subdirectory.  You will see `User`, `Product`, and
   `Purchase` Python classes already defined in the respective `.py`
   files.  Study these files and think about how you would write one
   to support wishlist data.
   * There is some useful boilerplate code in these `.py` files.  For
     example, the `app` object, imported from Flask's `current_app`,
     has an attribute `db` through which you can issue SQL commands
     --- see `app/db.py` for its implementation.  (If you feel you
     need better support from the `DB` class, feel free to
     modify/extend `app/db.py`, but that's not the focus of this
     tutorial.)

2. Create a file under `app/models/`, say `wishlist.py`, and define a
   `WishlistItem` class.  Hint: `purchase.py` is a good candidate to
   model after, though it's doesn't have a method for entering a new
   object into the database --- for that, see `User.register()` in
   `user.py` as an example.
   * You really also need a method for removing an object, but for the
     purpose of tutorial, we will just ignore it.

3. Before you make another commit, you ought to test your code.  You
   can write some unit test code in Python just for your
   `WishlistItem`, but for this tutorial, we will just write some API
   endpoints using `WishlistItem` and test them as part of the
   website.  So let's continue with the next step of the tutorial.

## Designing, implementing, and testing API endpoints

1. If you think of each HTTP request (initiated by a user click on a
   web page, for example) as a function call, then an "API endpoint"
   on your web server is the function that gets called.  In our
   project, these endpoint definitions live in various "blueprint"
   files under `app/`, such as `index.py` and `users.py`.  Each
   blueprint file holds a bunch of related endpoints: e.g., `users.py`
   contains endpoints related to user registration/authenetication.
   These various blueprints are made known to the Flask app in
   `app/__init__.py`'s `create_app()` function.
   * For simple projects, you could in fact have all your endpoints in
     a single file, without organizing them into blueprints.  For
     larger team projects like yours, however, blueprints help keep
     things modular and more tidy.

2. Let's take a closer look at one of the API endpoints, `index()` in
   `app/index.py`.  A few points are worth noting:
   * The Flask "route decoration" `@bp.route('/')` says that whenever
     user hits the landing (root) page of the website (with URL '/'),
     this endpoint function should be called.  Flask will maintain a
     mapping between URL patterns and all endpoint functions.
   * By doing `from flask_login import current_user`, you have access
     to a `current_user` object (of class `User` defined in
     `app/models/user.py`) as long as the user has already logged into
     your website (or it will be `None` otherwise).  Here, if the user
     is logged in, we will also display the user's purchase history.
   * This endpoint function returns with a call to `render_template()`,
     which basically takes a HTML template and additional data that we
     just retrieved from the database to be embedded into the HTML
     output.  The final HTML output gets returned to the user's
     browser and displayed.  We will come back to how templates work
     later.

3. Now it's your turn.  Create a new blueprint by starting a new file
   `wishlist.py` under `app/` (you can model it after `index.py`).  We
   will start with a simple endpoint `wishlist()`, with route
   decoration `@bp.route('/wishlist')`, which generates the wishlist
   for the current user.  It can use the `current_user` to get the id
   of the user, and calls the appropriate method of the `WishlistItem`
   class you previously implemented.  (If your `WishlistItem`
   implementation isn't adequate, fix that!  Resist the temptation of
   coming up with band-aid fix here.)

   Instead of having this endpoint returning fancy HTML using
   `render_template()`, let's try something simpler first --- we will
   just return the list in JSON format for now (we will add the
   templating later).  Make sure you `from flask import jsonify` at
   the beginning of `app/wishlist.py`; then, assuming that
   `wishlist()` has retrieved the list of `WishlistItem` objects in
   `items`, end `wishlist()` with the following:
   ```
   return jsonify([item.__dict__ for item in items])
   ```
   If the user is not logged in, you can do the following, where `404`
   is the "not found" error code:
   ```
   return jsonfiy({}), 404
   ```

4. Next, let's link in your new wishlist blueprint by editing
   `app/__init__.py`; just follow the example of adding the `user`
   blueprint.  Now you are now ready to try your new endpoint!

   Start your Flask app, or follow the [instructions
   below](#debugging) for debugging in VSCode.  Once your app is
   running, log in using the test user (who has `uid` of `0`) in the
   sample database:

   * Email: `icecream@tastes.good`
   * Password: `test123`

   Now, in the address bar of your browser, modify the current URL to
   append `wishlist` (so the whole thing would look like
   `http://HOST:PORT/wishlist`) and hit <kbd>Return</kbd>.  If all
   goes well, you should see a JSON snippet showing the wishlist
   item(s) you added for this user in `db/data/Wishes.csv`!

   If you made it succesfully to this point, you deserve a second
   `git` `commit` and `push`! :congratulations:

5. Now let's add a second endpoint to `app/wishlist.py`:
   `wishlist_add(product_id)`, with route decoration
   ```
   @bp.route('/wishlist/add/<int:product_id>', methods=['POST'])
   ```
   which adds the product with the given (integer-valued) id to the
   current user's wishlist.  The "patterned" URL decoration is one of
   the simplest ways to pass additional inputs to endpoints.  If a
   user visits the URL `/wishlist/add/12345`, then `wishlist_add()`
   will be called with `product_id = 12345`.

   The `POST` request method signifies that this request has side
   effects (e.g., it updates the database).  In HTML, POST requests
   typically come from some submit/action button.  They also allow
   more complex data to be passed as input to the endpoint than the
   patterned URL approach.  We don't need that feature here, however,
   because the `product_id` encoded as part of the URL already
   suffices.

   What should `wishlist_add()` return?  Well, if it succeeds, it
   makes sense to redirect the user to the newly updated wishlist.  To
   to that, add `from flask import redirect, url_for` to the beginning
   of `app/wishlist.py`, and use the following:
   ```
   return redirect(url_for('wishlist.wishlist'))
   ```
   Here, `redirect()` is self-explanatory; `url_for()` is an
   important Flask feature that you should use as much as possible.
   It basically allows you to specify the target URL by the
   combination of the blueprint name and the method name (both happen
   to be `wishlist` in this case).  It also allows you to pass
   additional parameters, e.g.: `url_for('blah.bleh',
   param1=value1, param2=value2, ...)`.  Without `url_for()`, you'd
   have to remember the correct URLs and encode the input parameters
   yourself into the URL!  Isn't Flask great? :smirk:

   > Unlike `wishlist_add()`, the majority of your endpoints may be
     ready-only (like `wishlist()`) and therefore can use the simpler
     `GET` request method (which is the default).  Those requests can
     encode additional input parameters (if any) by appending them to
     the end of the URL like this: `?param1=value1&param2=value2`.
     You don't need to worry about these details though, because Flask
     supports automatic encoding of these via `url_for()` and the
     endpoint functions will have their function arguments set
     automatically.

   What if adding the item fails (e.g., the product id is
   non-existent)?  You can redirect it to an error page, for example.
   For simplicity of this tutorial, let's ignore it (but you should
   certainly handle such cases for yor project!).

6. Ready for more testing?  Fire up your Flask app again, log in using
   the same test user as before.  Pick an existing product id, say
   `6`, and we would like to generate a POST request for
   `http://HOST:PORT/wishlist/add/6` (replace `HOST` and `PORT` with
   appropriate values for your setup) to test adding this product to
   the user's wishlist.  This is a little tricky though, because the
   browser address bar trick can send `GET` but not `POST` requests.

   There are a few tools that do this (including the vernerable
   `Postman`) but a simple, lightweight browser extension should
   suffice for our purpose.  If you use Chrome, we recommend
   installing the Restman extension, for example.  While the test user
   is still logged in from the browser, open the extension, enter the
   request URL (`http://HOST:PORT/wishlist/add/6`), and importantly,
   select `POST` instead of `GET` as the request type.  If all goes
   well, you should see a JSON result now showing the new item `6` in
   addition to the old one.

7. This is a good point to do another `git` `commit` and `push`!

## Keeping up with the `main` branch

1. So far, our changes are fairly local, but our next steps may
   involve editing other files in none-trivial ways, and these files
   might have changed since you branched off from `main`, causing
   potential conflicts.  If you don't expect there to be major changes
   affecting your own branch, you could wait until you are ready to
   merge your branch into `main` and resolve any conflicts at that
   time.  But what if signficant changes have been already made on
   `main`?  It would be prudent to incorporate these changes into your
   own branch soon rather than later.  We will walk through this
   scenario next.

2. Before you start, make sure that your branch is itself "clean"; you
   have committed and pushed all changes.  When you are ready, here is
   the sequence of `git` steps needed to refresh your branch:
   ```
   # first, temporarily switch to the main branch to download the latest:
   git checkout main
   git pull
   # then, go back to lisa-wishlist and merge the lastet main into it:
   git checkout lisa-wishlist
   git merge main -m 'incorporating latest from main'
   git push
   ```
   The `git merge` step may fail because there are conflicts between
   your changes and those made to `main` that `git` cannot resolve.
   In that case, `git` will ask you to first fix conflicts manaully
   and then commit.  When that happens, you won't be able to do `git
   push` yet.  Instead, you must edit the files to resolve the
   conflicts.  When you open up one such file, you will see sections
   with conflicts marked as follows:
   ```
   <<<<<<< ...
   ... changes you made ...
   =======
   ... changes coming from the merge ...
   >>>>>>> ...
   ```
   To resolve the conflicts, you may have to discard either your
   changes or someone else's or doing a mixture of the two.  You will
   also need to delete the lines with `<<<<<<<`, `=======`, and
   `>>>>>>>`.  Once you are done with a file, `git add` it for commit.
   At any point, you can run `git status` to see what changes have
   already been staged for commit and what files remain unmerged.
   After you are all done, commit, and finally push.

## Working with templates (and Python dependencies)

1. Back to finishing our feature.  Instead of letting
   `wishlist_add()` return JSON, let's actually display the list
   properly as a web page.  Flask uses "templates" to accomplish this
   task.  All templates can be found in the `templates/` subdirectory.
   Here, all templates "extends" `base.html`, which controls the
   overall look of the website.

   A template looks like a normal HTML file, except it has processing
   directive enclosed in `{% ... %}` (to express looping and
   conditional constructs) as well as expressions enclosed in `{{
   ... }}` (which will be replace by the results of evaluating them).
   Besides useful things like `current_user` and `url_for()`, any
   additional parameters specified in the `render_template()` call to
   a template will be accessible by the template.  For example,
   `templates/index.html` expects `avail_products` to be passed in,
   and makes loop over this list to display its contents as a table.

2. Now, let's add a new template `templates/wishlist.html` for
   displaying the wishlist for a user.  You can model this file after
   `templates/index.html`.  Suppose it would be given `items`, a list
   of `WishlistItem` objects.  If `current_user` is authenticated,
   let's display the wishlist as a table with two columns --- the
   product id and when it was added to the list.

   Just to spice things up a bit, instead of displaying the timetamp
   when an item was added, let's display something like "a day ago" or
   "2 years ago".  This requires the use of a new Python package
   called `humanize`.  To install it properly in your environment, do
   NOT use `pip`!  Do the following instead:
   ```
   poetry add humanize
   ```
   The nice thing is that `poetry` automatically updates the file
   `pyproject.toml` to track this new dependency.  The project repo is
   set up to track this file (if you do `git status` at this point,
   you will see that `pyproject.toml` has been modified), so by
   committing this change later, you will let your teammates'
   development environments pick up the new package too.

   In `app/wishlist.py`, you can define this little helper function to
   format the a `datetime` object:
   ```
   from humanize import naturaltime
   
   def humanize_time(dt):
       return naturaltime(datetime.datetime.now() - dt)
   ```
   Then, when the endpoint `wishlist()` renders the template
   `templates/wishlist.html`, it can pass in this helper function in
   addition to the `items` being rendered:
   ```
   return render_template('wishlist.html',
                         items=items,
                         humanize_time=humanize_time)
   ```

   Back in `templates/wishlist.html`, instead of directly embedding
   the timestamp `{{item.time_added}}` (replace with whatever is
   appropriate for your implementation), you would do
   `{{humanize_time(item.time_added)}}`.

   Test your template-powered endpoint on your browser now!

3. Our next step is to add a button "Add to Wishlist" next to each
   product displayed on the landing page, so an authenticated user can
   click on the button to add it to the user's wishlist.  (In reality,
   if a product is already on the wishlist, you probably should mark
   it as such instead of making a button, but we will ignore this for
   simplicity in this tutorial.)  Let's edit `template/index.html`.

   To make a button that sends `POST` request, you can use an HTML
   `form` element without user input fields:
   ```
   <form action="{{ url_for('wishlist.wishlist_add', product_id=product.id) }}"
         method="POST">
     <input type="submit" value="Add to Wishlist"/>
   </form>
   ```
   Note the use of `url_for()` to construct the URL for the target
   endpiont.  In this case, we don't need to pass any additional
   information through the `POST` request.
   * But in case you do, you can have additional elements of form
     `<input type="hidden" name="some_key" value="some_value"/>`
     inside the `form` element.  The endpoint can then retrieve
   `'some_value'` using `request.form.get('some_key')`.

   Once you are done with editing `template/index.html`, try the
   buttons out!  If they work as intended, clicking on one will add
   the corresponding product and automatically redirects you to the
   updated wishlist.  Check to make sure that the new item is there!

   You've completed all the coding required for this feature.  Time
   for another `git commit` and `push`!

## Merging your feature branch into `main`

1. Make sure that your branch is clean (you've committed and push all
   the changes).  The last step of this process to open a "merge"
   requeset to your teammates so your changes can be incorporated into
   `main`.

   **IMPORTANT:** This step is tricky for this tutorial because all
   your teammates are working on the exact same feature (which
   shouldn't happen in practice) so it wouldn't make sense for
   everybody to merge.  As a team, to complete this tutorial, discuss
   as a team what you'd like to do: you may elect one member to merge
   his or her branch into `main`, or none will merge at all (because
   your own project may not need this wishlist feature).  Depending on
   what your team decides to do, you may skip Step 2 below and just to
   go Step 3.

2. To open a merge request, visit `https://gitlab.oit.duke.edu/`, find
   your team's project repo, click on "Merge Requests" in the left
   navigation bar, and then hit the blue "New merge request" button on
   the top right.  Then:
   * For the source branch, select `lisa-wishlist`.
   * For the target branch, select `main`.
   Once the merge request is created, ping your teammates to take a
   look at it.  If they think it's acceptable, they just need to
   approve the merge request and you are done!

3. Now that you are done.  You should now delete your branch --- it's
   considered a good `git` practice to delete a feature branch once
   it's done, instead of reusing it for other purposes.  If the branch
   has been merged, run:
   ```
   git branch -d lisa-wishlist
   ```
   Or if it hasn't been merged, run:
   ```
   git branch -D lisa-wishlist
   ```
   Then, delete that from the team repo as well:
   ```
   git push --delete origin lisa-wishlist
   ```
   :fireworks: Congrats on surviving this long tutorial!  Now get
   started on your real project!

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
