# Gitlab ASE - Giphy Project

This is project contains lots of real GitLab code. For the purposes of this project, the code has been stripped down and sandboxed so that it is easier for students to run this project locally.

- [Setup](#setup)
- [How to run?](#how-to-run)
- [Requirements](./docs/REQUIREMENTS.md)
- [How to submit?](#how-to-submit)
- [About](./ABOUT.md)

## Setup

### Install Prerequisites

To work on this project, you will need to have a computer with the following installed:

- A code editor of your preference (for exampe, [vscode](https://code.visualstudio.com/))
- [NodeJS](https://nodejs.org/en/) (at least version `14.17.5`)
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

You are ready to go if you can open up a terminal and run:

```shell
git --version && node --version
```

### If you are on Windows

You **should** install

- [git for Windows](https://gitforwindows.org/)

And use `Git Bash` as your terminal.

We DO NOT recommend using command prompt or powershell. 

### Online Setup

Now that your local environment is ready, let's do the online portion of
this set up:

1. **Create a fork** - Create a public fork of the
  [`gitlab-giphy-project`](https://gitlab.com/gitlab-ase/gitlab-giphy-project) project.
  For help, read [Creating a fork](https://docs.gitlab.com/ee/user/project/repository/forking_workflow.html#creating-a-fork).

2. **Create a branch** - From your fork, create a new branch ontop of `master`. You will commit your code for this project to this branch. For help, read
   [How to create a branch](https://docs.gitlab.com/ee/gitlab-basics/create-branch#how-to-create-a-branch).
   You can create this branch:
   - [Locally with Git](https://docs.gitlab.com/ee/gitlab-basics/start-using-git.html#create-a-branch).
   - [In the GitLab UI](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-new-branch).

3. **Create a Giphy API key** - Follow the [Giphy developer documentation](https://developers.giphy.com/docs/api#quick-start-guide), to create a Giphy API key:
   - Create a Giphy account.
   - Use the [Giphy developer dashboard](https://developers.giphy.com/dashboard/).

### Local Setup

Now that our environemnt is ready and the online fork is created, let's setup this project locally so we can run the code and make changes.

1. **Get ready to clone** - Open your terminal and `cd` to a directory where you'd like for your personal code projects to live. For help, [see this guide on using the terminal/command line](https://tutorials.codebar.io/command-line/introduction/tutorial.html).
2. **Clone** - Visit your forked GitLab project and click the "Clone" button. Copy one of the URL's. Enter the following command in the terminal, replacing `<URL>` with the URL copied from GitLab. 
   
   ```bash
   git clone <URL>
   ```

3. **Checkout branch** - Instead of working off the default `master` branch, lets work ontop of the branch we created in the Online Setup above. You can likely change branches within your favorite code editor, or you can do this through the terminal. In the terminal make sure you `cd` into your project directory before creating the branch:  
    
    ```bash
    git checkout <NAME_OF_BRANCH>
    ```

3. **Open Editor** - Using your favorite code editor, open the newly created `gitlab-giphy-project` directory.
4. **Update `giphy.config.json`** - Using the code editor, open the `giphy.config.json` and replace the empty string for `"apiToken": ""` with the Giphy API token you created in the Online Setup above.
5. **Commit** - Now that we've made a change, we should tell `git` to remember our change. To do this, we need to create a _commit_. Many editors provide ways to do this through the UI, but you can also do this through the terminal with:  
   
    ```bash
    # This will tell git we want to "STAGE" this change for commit
    git add giphy.config.json

    # This will create the commit
    git commit -m "Add giphy api key"
    ```

6. **Push** - `git` now knows about our commit, but only on our local repository. We want these changes to be copied to our online GitLab repository. We use `git push` to do this:  
   
   ```bash
   git push
   ```

IMPORTANT: As you continue to make changes, you'll want to frequently commit/push so that your commits will be copied to the online GitLab repository and not just your local machine.

## How to run?

1. **Install dependencies** - Run the following in the terminal (this will take a couple of minutes at first):  
   
   ```bash
   npm install
   ```

2. **Run** - Run the following in the terminal. Press `CTRL+C` to kill this process.
   
   ```bash
   npm run start
   ```

Once `parcel` has finished building everything and starting its dev server, you can visit 
the local server (likely at `http://localhost:1234`) from any browser.

## How to submit?

When you are all finished with [the requirements](./docs/REQUIREMENTS.md), here is how you can submit your project:

1. **Create a private merge request** - Create a
   [**confidential** merge request](https://docs.gitlab.com/ee/user/project/merge_requests/confidential.html#create-a-confidential-merge-request)
   **within** your private fork:

   1. Set your _source branch_ to the newly-created branch on your fork.
   1. Set your _target branch_ to `master` on your fork.

2. **Prepare for review** - Double-check that your code works. Add the necessary project
   reviewers [as members of your private fork](https://docs.gitlab.com/ee/user/project/members/#add-users-to-a-project).
   Grant each reviewer the Developer role.
3. **Submit for review** - Comment in your merge request, and
   [@mention](https://docs.gitlab.com/ee/user/discussions/#mentions) the project reviewers.
   Tell them your merge request is ready for review. For example:

   ```plaintext
   Hey @<username>, I've prepared my merge request, can you please review it when you're free?
   ```

## Troubleshooting

- Sometimes `parcel` doesn't pick up on new changes really well. If you have `npm run start` running, press `CTRL+C` to kill the process. Then try running `npm run clean` to remove `parcel` cache files. Then restart the server with `npm run start`.

## References

- [Git tutorial](https://docs.gitlab.com/ee/gitlab-basics/start-using-git.html)
