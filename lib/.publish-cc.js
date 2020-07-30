const criticalJsonFileName = 'mobile.json'
const isMobileSytle = true;
const criticalStylePrefix = isMobileSytle ? 'style-mobile.' : 'style-desktop.'
module.exports = {
    ossConfig: {
        region: '<Input Your Oss Region>',//e.g: oss-cn-hangzhou
        accessKeyId: '<Input Your Oss AcesssKeyID>',
        accessKeySecret: '<Input Your AccessKeySecret>',
        bucket: '<Input Your Oss Bucket Name>',
        defaultOssHeader:{
            'Cache-Control': 'max-age=31536000'
        }
    },
    // publish dir etc...
    // publish dir:  ${baseDir}/${versionFolderName}/
    // gameName: the name for created url
    publishConfig: {
        baseDir: '<Input Your Game Base Path>',
        // cocos build dir
        srcDir: './build/web-mobile'
    },
    cdnPath: '<Input Your CdnPath or Oss Visit Path>',


    log: {
        closeRecordFileUpload: false
    },
    hooks: {
        // support async
        beforeUpload: async function (PublishUtils, hookConfig) {
            const { srcPath, cdnVisitPath } = hookConfig;
            
            // modify main
            const mainJsPath = PublishUtils.getFilePath('main.', srcPath);
            // cdnPath=cdnPath+ baseDir+versionFolderName
            // inject cdnPath to libraryPath and rawAssetsBase
            PublishUtils.updateMainContentSync(mainJsPath, cdnVisitPath);

            // create resource json
            PublishUtils.createProjectCriticalResourceJson({
                resourcesPath: cdnVisitPath
            }, srcPath, criticalJsonFileName, {
                // key:[filePrefix,_subFolder]
                stylePath: [criticalStylePrefix],
                mainPath: ['main.'],
                cocosPath: ['cocos2d-js'],
                settingPath: ['settings.', 'src']
            });
        },
        // support async
        afterUpload: async function (PublishUtils, hookConfig) {
            // do somthing after publish
            // you can trigger publish hook here
            // // For Example
            // // 1. add criticalJson To Oss baseDir
            // const {OssClient}=PublishUtils;
            // const {srcPath, config}=hookConfig;
            // const cSrcFilePath=srcPath+'/'+criticalJsonFileName;
            // const cdnFilePath=config.publishConfig.baseDir+'/'+criticalJsonFileName;
            // console.log('from',cSrcFilePath);
            // console.log('to',cdnFilePath);
            // await OssClient.Instance.putFile(cSrcFilePath, cdnFilePath,{})

            // // 2.fetch the publish url
            // await new Promise((resolve,reject)=>{ 
            //     console.log('[Publish] Start Publish');
            //     const req = http.request({
            //         hostname: 'xxx.com',
            //         port: 80,
            //         path: `/reqPath`,
            //         method: 'GET'
            //     }, (res) => {
            //         console.log('[Publish] STATUS: ' + res.statusCode);
            //         res.setEncoding('utf8'); 
            //         // res.on('data', function (chunk) {
            //         //     console.log(chunk);
            //         // });
            //         res.on('end',(e)=>{ 
            //             resolve();
            //         });
            //     });
            //     req.on('error', (e) => {
            //         console.log('[Publish] Error: ', e);
            //         reject(e)
            //     })
            //     req.end();
            // })
        }
    }

}