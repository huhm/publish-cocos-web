# publish-cocos-web
A tool to publish cocos web project to OSS

## Installation
``` bash
# use taobao proxy
npm config set registry=https://registry.npm.taobao.org/

# install
npm install publish-cocos-web
```

## Usage


### Init The Project
+ create ``.publish-cc.js`` file ``npx publish-cc init``
+ edit the config file  ``.publish-cc.js`` 
+ **[Important]** add the filePath **.publish-cc.js** to **.gitignore**

### deploy
+ publish-cc 
    + config.publishConfig.srcDir下的文件将上传到Oss的config.publishConfig.baseDir/${versionFolderName}
    + versionFolderName可通过参数v配置，如果未配置默认使用的文件夹名为项目package.json的version版本号


> 注: 如果未配置-v, 默认使用的文件夹名为项目package.json的version版本号
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


## Config

+ log.closeRecordFileUpload: do close the log for each upload file?
+ cdnPath: the path for the oss
