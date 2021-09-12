# mini-amazon-skeleton

Skeleton code for the CompSci 316 (Database Design) undergraduate course project. This course project is intended as a 'standard option'. Created by [Rickard Stureborg](www.rickard.stureborg.com).

# Setup Instructions
## To set up development environment (VSCode)
The following instructions also exist as a recorded video, which you can find [at this link](http:www.example.com). If you need specific help setting up VSCode, the TAs will be able to help you in office hours.
1. 

## To push a change to gitlab
### Proper procedure, using merge requests
1. 
### Quick and dirty, but potentially may cause messy issues when working in teams
This method is usually only preferred when you know you'll be the only person working on the project. Here, you'll work directly on the main branch, removing the need for merge requests. Learning to use merge requests (or pull requests if you're on github) is not very difficult, so we really recommend that option to save yourself a few headaches.
1. 

## Setting up passwords
1. Change the passwords in passwords.py. You can randomly generate passwords with this tool: https://www.lastpass.com/password-generator
2. Once you have new passwords, uncomment line 53 in `.gitignore` ("`#passwords.py`" -> "`passwords.py`"). This will hide the file from git so your newly created passwords don't get leaked through your repo. Only share this file securely with your teammates and have them add it to their repo independently to make the app work.
3. Now you commit and push changes to your gitlab repo.


# Tips for Development
## Querying the database
To query the database, you can create custom functions which include a SQL string just like the example in `db.py`. Then, in whatever route you want the query to execute, you just call this function (there is an example of this in `index.py`)