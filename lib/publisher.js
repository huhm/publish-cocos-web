const OssClient = require('./ossClient')
const configUtils=require('./config');
const path=require('path');
const pathUtils=require('./pathUtils');
const fs=require('fs');
const chalk = require("chalk");
var inquirer = require('inquirer');
// 从目录下获取文件路径
function getFilePath (predix, dirPath) {
    let files = fs.readdirSync(dirPath);
    for (let i = 0; i < files.length; i++) {
        let item = files[i];
        let fPath = path.join(dirPath, item);
        let stat = fs.statSync(fPath);
        if (stat.isFile() === true) {
            let fileName = path.basename(fPath);
            if (fileName.indexOf(predix) === 0) {
                return fPath;
            }
        }
    }
}


// 读取mainPath
function updateMainContentSync (mainPath,cdnResourcesPath) {
    console.log(' [Main] StartModify:' + mainPath)
    var mainContent = fs.readFileSync(mainPath, 'utf-8');
    if (mainContent.indexOf('_resourcesPath=') > 0) {
        console.log(' [Main] NoNeedToModify:' + mainPath);
        return;
    }
    mainContent = mainContent.replace(/window\.boot = function \(\) {/, `window.boot = function () {\r\n    var _resourcesPath="${cdnResourcesPath}";`);
    mainContent = mainContent.replace(/libraryPath\:/, 'libraryPath: _resourcesPath+');
    mainContent = mainContent.replace(/rawAssetsBase\:/, 'rawAssetsBase: _resourcesPath+');
    mainContent = mainContent.replace(/if\ \(jsList\)/, 'bundledScript= _resourcesPath+bundledScript;if (jsList)');
    fs.writeFileSync(mainPath, mainContent, 'utf8');
    console.log(chalk.green(' [Main] SuccessModify:' + mainPath));
}

 

// 创建项目关键资源json配置
function createProjectCriticalResourceJson(originalJson,srcPath,toFileName,jsonMap){
    let jsonContent = {
        ...originalJson
    }
    for(let key in jsonMap){
        let pathConfig=jsonMap[key];

        let filePath=getFilePath(pathConfig[0],pathUtils.combilePath([srcPath,pathConfig[1]],'/'));
        if(filePath){
            jsonContent[key]=pathUtils.combilePath([pathConfig[1],path.basename(filePath)],'/');
        }else{
            console.log(chalk.red(`[CriticalJson] 没有文件${key},prefix = ${pathConfig[0]},dir=${pathConfig
            [1]||'root'}`))
        }
    }
    const jsonConfigPath = path.join(srcPath, toFileName);
    fs.writeFileSync(jsonConfigPath, JSON.stringify(jsonContent, null, 2), 'utf8');
    
    console.log(chalk.green(` [Success] CreateCriticalJsonFile`),jsonConfigPath);
    return jsonContent;
}

const PublishUtils={ 
    getFilePath,
    doPublish,
    createProjectCriticalResourceJson,
    updateMainContentSync,
    OssClient
}


function getConfirmPromise(msg){
	let confirmQ=[{
		type: 'confirm',
		name: 'isConfirmStart',
		message: msg,
		default: false
	}];

	return inquirer.prompt(confirmQ).then(answers=>{
		return answers.isConfirmStart
	});
}
 
 

async function doPublish(configFile,versionDir){
    configFile = configFile || '.publish-cc.js';
    let config = configUtils.getPublishConfig(configFile);
    OssClient.tryInit(config.ossConfig,config.log); 
    versionDir=pathUtils.removeLastSlash(versionDir);

    const srcPath=path.join(process.cwd(),config.publishConfig.srcDir);
    const ossDestPath=pathUtils.convertToForwardSlash(pathUtils.combilePath([config.publishConfig.baseDir,versionDir],'/'));
    const ossFullPath='oss://'+pathUtils.convertToForwardSlash(path.join(config.ossConfig.bucket,ossDestPath));
    
    const cdnVisitPath = pathUtils.combilePath([config.cdnPath,config.publishConfig.baseDir,versionDir],'/')
    
    const hookConfig={
        config,
        srcPath,
        // 带版本号的路径
        ossDestPath,
        
        cdnVisitPath
    }
    // bofore hook
    if(config.hooks && config.hooks.beforeUpload){
        console.log(chalk.blueBright('[Hook] Start beforeUpload'))
        console.log(`CdnVisitPath: ${cdnVisitPath}`)
        try{
            await config.hooks.beforeUpload(PublishUtils,hookConfig);
            console.log(chalk.blueBright('[Hook] Successed beforeUpload'))
        }catch(ex){
            console.log(chalk.red('[Error]-Hook.beforeUpload:',ex));
            console.error(ex)
            return;
        }
    }else{
        console.log(chalk.yellow(`Skip hooks.beforeUpload
        if you want do sth before upload
        please Edit the ${configFile}`))
    }

    // start upload
    console.log(`[Confirm] To upload from [${chalk.green(srcPath)}] to [${chalk.green(ossFullPath)}]?`)
   
    const confirmUpload = await getConfirmPromise(`Did you confirm start upload?`);
    if(!confirmUpload){
        return;
    }
    console.log(chalk.blueBright(`[Upload] Start Upload`));
    OssClient.Instance.uploadFolder(srcPath,ossDestPath);
    console.log(chalk.blueBright(`[Upload] Success Upload`));

    // after hook
    if(config.hooks && config.hooks.afterUpload){
        console.log(chalk.blueBright('[Hook] Start afterUpload'))
        try{
            await config.hooks.afterUpload(PublishUtils,hookConfig);
            console.log(chalk.blueBright('[Hook] Successed afterUpload'))
        }catch(ex){
            console.log(chalk.red('[Error]-Hook.afterUpload:',ex));
            console.error(ex)
            return;
        }
    }else{
        console.log(chalk.yellow(`Skip hooks.afterUpload
        if you want do sth before upload
        please Edit the ${configFile}`))
    }
    process.exit(0);
}

module.exports=PublishUtils