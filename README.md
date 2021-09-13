# mini-amazon-skeleton

Skeleton code for the CompSci 316 (Database Design) undergraduate course project. This course project is intended as a 'standard option'. Created by [Rickard Stureborg](http://www.rickard.stureborg.com) and [Yihao Hu](https://www.linkedin.com/in/yihaoh/).

# Setup Instructions
## Deploying the current skeleton
1. Fork this repo by clicking the small 'Fork' button at the very top right [on Gitlab](www.example.com). It's important that you fork first, because if you clone the directory directly you won't be able to push changes (save your progress) back to Gitlab.
2. In your newly forked repo, find the blue "Clone" button. Copy the "Clone with SSH" text. In your terminal on the VM, you can now issue the command `git clone THE_TEXT_YOU_JUST_COPIED`. Make sure to replace 'THE_TEXT_YOU_JUST_COPIED' with the "Clone with SSH" text.
3. Move into the repository directory and then run `sudo bash init_amazon.sh`. When you're asked for a password, type `postgres`.
5. To view the app in your browser, you need to edit the firewall rules. Here are [instructions provided by Google](https://cloud.google.com/vpc/docs/using-firewalls). To begin with, open up port 5000. That should enable you to run `flask run --host=0.0.0.0` and view your app using your browser by pointing it to `vm_external_ip_addr:5000`.
## Important! before you push to the repo: Hide Passwords
1. For all your password/secret key needs, use passwords.py. You can randomly generate passwords with this tool: https://www.lastpass.com/password-generator
2. This file is currently tracked with git. That means any passwords you put in here will be exposed: that's bad. To fix this, uncomment line 55 in `.gitignore` ("`#passwords.py`" -> "`passwords.py`"). This will hide the file from git so your newly created passwords don't get leaked through your repo. Only share this file securely with your teammates and have them add it to their repo independently to make the app work.
3. Now you commit and push changes to your gitlab repo. Your passwords will be hidden.

# Tips for Working on This Project
## Set up VS Code on Google Cloud VM
The following instructions also exist as a recorded video, which you can find [at this link](http:www.example.com). If you need specific help setting up VSCode, the TAs will be able to help you in office hours.

1. First we need to set up SSH access through your local machine (Mac) to the Google VM.
   1. Create an SSH key-pair on your local machine. If you have a macOS, use: `ssh-keygen -f /Users/YOUR_MAC_USERNAME/.ssh/vm_316`. If you are on Windows, use: `ssh-keygen -f C:\Users\YOUR_WINDOWS_USERNAME\.ssh\vm_316`. Make sure to replace 'YOUR_XXX_USERNAME' with your local machine's username. For the passphrase, just hit enter to opt out.
   2. Now, we need to give the public key (`vm_316.pub`) to the VM instance on Google Cloud. You might have already done this if you followed along with the "SETTING UP AN SSH KEY PAIR TO ACCESS VMS" tutorial on the course website. If so, skip this.
      1. In your internet browser, go to Google Cloud and find the VM instance you want to be able to connect with. Click on its name and then click 'Edit' in the top bar.
      2. Find 'SSH Keys', click 'Show and edit'. The section will expand. Click on the '+ Add Item' button. Now keep this tab open, we are going to paste your key in here.
      3. Back in your local host terminal, run the command `cat /Users/YOUR_MAC_USERNAME/.ssh/vm_316.pub` The output will be your public key. Copy this text (all of it). 
      4. Paste the text into the text box you just opened in your browser. Before saving, however, edit the username at the very end of this key. The key will look something like "...OFUNwEsWO/dJNK user@MBP.local". Replace the last bit with your gmail username. That means it would look like this: "...OFUNwEsWO/dJNK gmailusername". Now click save.
2. Download Visual Studio Code (VS Code) from [this link](https://code.visualstudio.com/Download).
3. VS Code has a bunch of useful extensions. To use it with our VM we are going to need to download the 'remote-ssh' extension.
   - Open VS Code and click on the Extensions button in the left-most navigation bar. This button looks like a 3-block tetris piece with a 4th block hovering above it.
   - Search for an extension named 'Remote - SSH'. It will be the one by Microsoft with a description that begins with "Open any folder on a remote machine...". Click it and install the extension.
4. Now you're almost ready to log onto the VM. Open your browser again and find your VM Instances on Google Cloud. The IP Address will be listed under the 'External IP' column. Copy this IP address for the next step.
5. Open a new VS Code window, and click on 'Run a Command' (alternatively, use the shortcut `F1` or `⇧⌘P`). Type in 'Remote-SSH: Connect to Host', scroll down to 'add new host' and hit enter. Here, enter the username and IP address you just looked up like this, along with your local device username as before to specify where the private key is: `ssh -i /Users/YOUR_MAC_USERNAME/.ssh/vm_316 gmailusername@IP_adress`. The `-i` flag specifies to use the given private key instead of the default. If you already set up your SSH keys earlier, you can just issue the command `ssh gmailusername@IP_adress`.
6. You will be asked what type of platform the VM is. Select `Linux`.
7. Now you're connected! In the lower left corner of the window you'll see a green bar that reads "SSH: ...". You can access files and run things through the terminal just as you would be able to locally.

## Keep Track of Your Project with Gitlab: Merge Requests
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