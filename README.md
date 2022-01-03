## React todo component 
A react todo component is created using material UI

![image](https://user-images.githubusercontent.com/5221843/147893206-0a38221e-14b6-4cd2-a9e8-3b0860848d2a.png)

## Storybook
https://upnotes-io.github.io/react-todo/

## Installation

```sh
// with npm
npm i react-todo-component

// with yarn
yarn add react-todo-component
```

## Usage

Here is a quick example to get you started, **it's all you need**:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Todo} from 'react-todo-component';

ReactDOM.render(
    <Todo />,
  document.getElementById('root')
);

```

Live and interactive demo:

[![Edit Button](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/s9k1s)


## Contribution guide 
If you're reading this, you're awesome! Thank you for helping us.
- Clone git repository on your local `git clone git@github.com:upnotes-io/react-todo.git`
- Run `yarn install` to install dependencies.
- We are using storybook. Just run `yarn run storybook` to test on local.
- Pick a issue and comment you are working on it.
- Create your feature branch, do changes and create pull request.

## Step to release the npm module
1. Create a new account in npm.
   https://www.npmjs.com/signup
2. Create a new access token and select publish as a type
   https://www.npmjs.com/settings/upnotes/tokens
3. Add secret to your repo or organization as NPM_TOKEN
   https://github.com/organizations/upnotes-io/settings/secrets/actions/new
4. Create a new tag and use that tag to create the release. Creating a new release will trigger the [workflow](https://github.com/upnotes-io/react-component-template/blob/main/.github/workflows/npm-publish.yml). 

### Publishing to github pages:
Adding deploy keys to your repo:
1. https://github.com/JamesIves/github-pages-deploy-action/tree/dev#using-an-ssh-deploy-key-
2. https://docs.github.com/en/developers/overview/managing-deploy-keys#setup-2
