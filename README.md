# publish-cocos-web
A tool to publish cocos web project to OSS

[TOC]

## Installation
``` bash
# use taobao proxy
npm config set registry=https://registry.npm.taobao.org/

# install
npm install publish-cocos-web
```

## Usage


### Init The Project
> **PreWork:**
> if there's no package.json file in your project,please run ``npm init`` to create one.
> ```npm install publish-cocos-web -D``` install the tool

1. ``npx publish-cc init``
   +  to create ``.publish-cc.js`` file 
2. edit the config file  ``.publish-cc.js`` 
3. **[Important]** add the filePath **.publish-cc.js** to **.gitignore**
4. [Optional] add publish script task to package.json

package.json
``` json
{
    "version":"1.0.1",
    "name":"cocos-example",
    "scripts":{
        "publish":"publish-cc"
    }
}
```


### deploy
1. edit the package.json's version
2. npm run build

> 注: if no -v config is provided, publish-cc will use the package.json's version
``` bash
# init project(create a .publish-cc.js)
npx publish-cc init

# help
npx publish-cc --help

# start (use the version of the project's package.json file)
npx publish-cc
# or
npx publish-cc -v v11


# or you can add a task to scripts
npm run publish
```





## 推荐使用说明
### 初始化

1. 项目下面没有package.json的请执行``npm init`` 创建
2. 安装  publish-cocos-web ```npm install publish-cocos-web -D```
3. npx publish-cc init 首次创建.public-cc.js
4. 将 ``.publish-cc.js`` 加入到``.gitignore``文件中，防止秘钥被提交到git
5. 配置``.publish-cc.js``文件中的秘钥等字段
6. pacakge.json文件增加publish脚本

``` json
{
    "version":"1.0.0",
     "scripts": {
        "publish": "publish-cc"
      },
}
```



### 使用

``` bash
# 使用package.json中的version作为本次发布的版本文件夹
npm run publish
# or
npx publish-cc

# 使用指定文件夹名v11作为本次发布的版本文件夹
npx publish-cc -v v11
```






## Config

+ log.closeRecordFileUpload: do close the log for each upload file?
+ cdnPath: the path for the oss
