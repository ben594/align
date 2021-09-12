# mini-amazon-skeleton

Skeleton code for the CompSci 316 (Database Design) undergraduate course project. This course project is intended as a 'standard option'. Created by [Rickard Stureborg](http://www.rickard.stureborg.com).

# Setup Instructions
## Creating the database
To install all the required libraries and create the database, run the `init_db.sh` script. This script will among other things define the database using the `create.sql` script. To modify the database itself, go into `create.sql` and write your own code. To recreate the database from scratch, you need to first delete the current database:
   1. psql
   2. delete???
You can then create your database and populate it with whatever data you need.
## Setting up passwords
1. Change the passwords in passwords.py. You can randomly generate passwords with this tool: https://www.lastpass.com/password-generator
2. Once you have new passwords, uncomment line 53 in `.gitignore` ("`#passwords.py`" -> "`passwords.py`"). This will hide the file from git so your newly created passwords don't get leaked through your repo. Only share this file securely with your teammates and have them add it to their repo independently to make the app work.
3. Now you commit and push changes to your gitlab repo.

# Tips for Working on This Project
## Set up VS Code on Google Cloud VM
The following instructions also exist as a recorded video, which you can find [at this link](http:www.example.com). If you need specific help setting up VSCode, the TAs will be able to help you in office hours.

1. First we need to set up SSH access through your local machine (Mac) to the Google VM.
   1. Create an SSH key-pair on your local machine. If you have a macOS, use: `ssh-keygen -f /Users/YOUR_MAC_USERNAME/.ssh/vm_316`. If you are on Windows, use: `ssh-keygen -f C:\Users\YOUR_WINDOWS_USERNAME\.ssh\vm_316`. Make sure to replace 'YOUR_XXX_USERNAME' with your local machine's username. For the passphrase, just hit enter to opt out.
   2. Now, we need to give the public key (`vm_316.pub`) to the VM instance on Google Cloud.
      1. In your internet browser, go to Google Cloud and find the VM instance you want to be able to connect with. Click on its name and then click 'Edit' in the top bar.
      2. Find 'SSH Keys', click 'Show and edit'. The section will expand. Click on the '+ Add Item' button. Now keep this tab open, we are going to paste your key in here.
      3. Back in your local host terminal, run the command `cat /Users/YOUR_MAC_USERNAME/.ssh/vm_316.pub`. The output will be your public key. Copy this text (all of it). 
      4. Paste the text into the text box you just opened in your browser. Then click save.
2. Now, download Visual Studio Code (VS Code) from [this link](https://code.visualstudio.com/Download).
3. VS Code has a bunch of useful extensions. To use it with our VM we are going to need to download the 'remote-ssh' extension. 
   1. Open VS Code and click on the Extensions button in the left-most navigation bar. This button looks like a 3-block tetris piece with a 4th block hovering above it.
   2. Search for an extension named 'Remote - SSH'. It will be the one by Microsoft with a description that begins with "Open any folder on a remote machine...". Click it and install the extension.
4. Now you're almost ready to log onto the VM. Open your browser again and find your VM Instances on Google Cloud. The IP Address will be listed under the 'External IP' column. Copy this IP address for the next step.
5. Open a new VS Code window, and click on 'Run a Command' (alternatively, use the shortcut `F1` or `⇧⌘P`). Type in 'Remote-SSH: Connect to Host', scroll down to 'add new host' and hit enter. Here, enter the username and IP address you just looked up like this, along with your local device username as before to specify where the private key is: `ssh -i /Users/YOUR_MAC_USERNAME/.ssh/vm_316 YOUR_MAC_USERNAME@IP_adress`
6. You will be asked what type of platform the VM is. Select `Linux`.
7. Now you're connected! In the lower left corner of the window you'll see a green bar that reads "SSH: ...". You can access files and run things through the terminal just as you would be able to locally.

## Keep Track of Your Project with Gitlab
### Creating a gitlab project
1. Log into gitlab, create a new repository. 
2. Once created there will be a `Clone` button. Copy the `Clone with SSH` text.
3. Navigate to the directory where you'd like to work on the project.
4. Now run the command `git clone THE_TEXT_YOU_COPIED`. Make sure to replace 'THE_TEXT_YOU_COPIED' with the text you copied in step 2.

### Making changes, using merge requests
These instructions seem long, but they aren't complicated. If you've never worked with merge requests, make sure to read this thoroughly. 

To work on a gitlab project with many team members, you want to avoid working directly on the 'main' branch as much as possible. If multiple people work on this branch at the same time, you are likely to run into conflicts and be forced to restore old versions. This is a mess. Instead, use new branches every time you add a feature or make an edit, and then merge these into the main branch. This is how to do it:

Let's imagine we want to create a new function to help with some specific query of the database. Before you begin, create and checkout a new branch for this feature.
1. `git branch -b checkout query-feature` will create a branch named "query-feature". You can change the name as you'd like.
2. Once you are on this branch, get to work. Make the edits you need to the files you want to work on.
3. Run the command `git status` to see what files have changed. Let's say you only edit the file `app/db.py` to add the new function along with some comments, and `README.md` to include some information about this feature. These files will then appear in red under the title 'modified:'.
4. Now that you're done editing, you want to save your changes. Each save appears as a notification on gitlab in the form of a 'commit'. To be helpful, we save our edits in small chunks so that others can easily read these notifications and follow along which changes were made. Let's say we want to make two 'commits', one for `app/db.py` and another for `README.md`. 
   1. We make the first commit ready by adding the changes to `app/db.py` using the command `git add app/db.py`. Now, running `git status` will show the `app/db.py` file in green, indicating it is being tracked.
   2. Now we can commit this change using the command `git commit -m "MESSAGE"` We replace 'MESSAGE' with a short description of what the change entailed. This is what shows up in the notification on gitlab. For example: `git commit -m "created a new function to find the total amount spent by a user"`
   3. Now repeat this process for the `README.md` file. That is: `git add README.md`, then `git commit -m "updated readme to include description of 'all-time spending' feature"`.
   4. You've saved your changes! But they're still only local.. To upload them to gitlab you need to do is run `git push --set-upstream origin query-feature`.By now you should be able to see that you've made changes on the gitlab website. These changes appear in your repository under 'Repository'>'Branches'>'query-feature'.
5. To merge the changes into the main project so others can add on top of your work, you need to open a merge request. This request is an open invitation for your teammates to take a look at your code, make sure the changes look good to them, and then incorporate them onto the main branch for others to use. To open a merge request, click on 'merge requests' in the left hand navigation bar, and then hit the blue 'New merge request' button at the top right. It will ask you to select a source branch. For our example above this would be the `query-feature` branch. For the target branch, leave it as main.
6. Once the merge request is created, ping your teammates to take a look at it. If they think it's acceptable, they just need to click 'merge' and the code you've written get's incorporated. Now you can safely delete the `query-feature` branch on gitlab.
Done!
### Other Gitlab features
Gitlab offers a host of other features and plugins to help you develop code faster and better. If you are curious to learn more, two things to explore next would be to create tests that run automatically on any code pushed to the repo, and to specify linters to make sure the code remains clean and legible.