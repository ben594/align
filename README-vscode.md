# Set up VS Code on Google Cloud VM

If you need specific help setting up VSCode, the TAs will be able to help you in office hours.

1. First we need to set up SSH access through your local machine (Mac) to the Google VM.
   If you have already set up your Google VM for this course previously, and plans to use the same for your project, you simply can skip to Step 2 below.
   Otherwise, follow the steps below.
   We are going to take a slightly different approach of using a dedicated SSH key; the following instructions also exist as a recorded video, which you can find [at this link](https://youtu.be/y-l6FLSsCz0).
   1. Create an SSH key-pair on your local machine.
      If you have a macOS, use: `ssh-keygen -f /Users/YOUR_MAC_USERNAME/.ssh/vm_316`.
      If you are on Windows, use: `ssh-keygen -f C:\Users\YOUR_WINDOWS_USERNAME\.ssh\vm_316`.
      Make sure to replace `YOUR_XXX_USERNAME` with your local machine's username.
      For the passphrase, just hit enter to opt out.
   2. Now, we need to give the public key (`vm_316.pub`) to the VM instance on Google Cloud.
      1. In your internet browser, go to Google Cloud and find the VM instance you want to be able to connect with.
         Click on its name and then click "Edit" in the top bar.
      2. Find "SSH Keys", click "Show and edit".
         The section will expand. Click on the "+ Add Item" button.
         Now keep this tab open, we are going to paste your key in here.
      3. Back in your local host terminal, run the command `cat /Users/YOUR_MAC_USERNAME/.ssh/vm_316.pub`
         The output will be your public key.
         Copy this text (all of it).
      4. Paste the text into the text box you just opened in your browser.
         Before saving, however, edit the username at the very end of this key.
         The key will look something like "...OFUNwEsWO/dJNK user@MBP.local".
         Replace the last bit with your Google username.
         That means it would look like this: "...OFUNwEsWO/dJNK googleusername".
         Now click save.
         - IMPORTANT: if your Google user name contains any dots, it will cause various issues.
           You may need to replace all dots with underscores.
           When in doubt, use the browser-based SSH interface found through [Compute Engine Console](https://console.cloud.google.com/compute) to log into your Google VM, and use the command `whoami` to see the Google user name to use.
2. If you haven't already, download and install Visual Studio Code (VS Code) from [this link](https://code.visualstudio.com/Download).
3. VS Code has a bunch of useful extensions.
   To use it with our VM we are going to need to download the `remote-ssh` extension.
   - Open VS Code and click on the Extensions button in the left-most navigation bar.
     This button looks like a 3-block tetris piece with a 4th block hovering above it.
   - Search for an extension named "Remote - SSH".
     It will be the one by Microsoft with a description that begins with "Open any folder on a remote machine...".
     Click it and install the extension.
4. Now you're almost ready to log onto the VM.
   Open your browser again and find your VM Instances on Google Cloud.
   The IP Address will be listed under the "External IP" column.
   Copy this IP address for the next step.
5. Open a new VS Code window, and click on "Run a Command"
   (alternatively, use the shortcut `F1` or `⇧⌘P`).
   Type in "Remote-SSH: Connect to Host", scroll down to "add new host" and hit enter.
   Here, enter the username and the external IP address you just looked up like this:
   - If you skipped Step 1 above (because you have already set up your Google VM previously), you can just use the command `ssh googleusername@IP_address`.
   - Otherwise (you followed Step 1 and created another dedicated SSH key), use the command `ssh -i /Users/YOUR_MAC_USERNAME/.ssh/vm_316 googleusername@IP_address`.
     The `-i` flag specifies to use the given private key you created in Step 1 instead of the default.
6. You will be asked what type of platform the VM is. Select `Linux`.
7. Now you're connected!
   In the lower left corner of the window you'll see a green bar that reads "SSH: ...".
   You can access files and run things through the terminal just as you would be able to locally.
