# publish-cocos-web
A tool to publish cocos web project to OSS

## Installation
``` bash
npm install publish-cocos-web
```

## Usage

1. Project Init
   + auto create .publish-cc.js
    ``` bash
    publish-cc init
    ```
2. 配置文件
修改.publish-cc.js,填写OSS配置或其他可配置项
3. 将.publish-cc.js加入.gitignore文件，防止自动上传oss秘钥
4. publish-cc -v v16
    + config.publishConfig.srcDir下的文件将上传到Oss的config.publishConfig.baseDir/${versionFolderName}
    + versionFolderName可通过参数v配置，如果未配置默认使用的文件夹名为项目package.json的version版本号


> 注: 如果未配置-v, 默认使用的文件夹名为项目package.json的version版本号



## Config

+ log.closeRecordFileUpload: do close the log for each upload file?
+ cdnPath: the path for the oss
