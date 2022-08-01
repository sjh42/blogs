---
title: Automate with defaultsnpm init
date: 2022-08-01
lang: zh
duration: 5min
---

## run script

```js
npm config set init-module ~/.npm-init.js`
```

**.npm-init.js** 需要在你 **npm** 安装的路径里，因为我是把 node 安装在了 D 盘，所以大概就是 **D:/node/node_moudle/npm/.npm-init.js** 这个样子

## .npm-init.js

```js
var cp = require('child_process');
var priv;

var USER = process.env.GITHUB_USERNAME || 'YOUR_GITHUB_USERNAME';

module.exports = {

  name: prompt('name', basename || package.name),

  version: '0.0.1',

  private: prompt('private', 'true', function(val){
    return priv = (typeof val === 'boolean') ? val : !!val.match('true')
  }),

  create: prompt('create github repo', 'yes', function(val){
    val = val.indexOf('y') !== -1 ? true : false;

    if(val){
      console.log('enter github password:');
      cp.execSync("curl -u '"+USER+"' https://api.github.com/user/repos -d " +
        "'{\"name\": \""+basename+"\", \"private\": "+ ((priv) ? 'true' : 'false')  +"}' ");
      cp.execSync('git remote add origin '+ 'https://github.com/'+USER+'/' + basename + '.git');
    }

    return undefined;
  }),

  main: prompt('entry point', 'index.js'),

  repository: {
    type: 'git',
    url: 'git://github.com/'+USER+'/' + basename + '.git' 
  },

  bugs: { url: 'https://github.com/'+USER'/' + basename + '/issues' },

  homepage: "https://github.com/"+USER+"/" + basename,

  files: ["package.json", "README.md", "LICENSE", "index.js"],

  keywords: prompt(function (s) { return s.split(/\s+/) }),

  license: 'MIT',

  cleanup: function(cb){
    cb(null, undefined)
  }

}
```

[文章链接: nodesource.com ](https://nodesource.com/blog/eleven-npm-tricks-that-will-knock-your-wombat-socks-off/)
