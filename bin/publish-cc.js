#!/usr/bin/env node
const path=require('path');
const program = require('commander');
const pkg=require('publish-cocos-web/package');
const initObj=require('publish-cocos-web/lib/init');
const publisherUtils = require('publish-cocos-web/lib/publisher');
// 
// publish-cc init
// publish-cc -c ./.publish-cc.js

function tryGetPackageJson(){
  const pkgPath=path.join(process.cwd(),'package.json');
  try{
     return require(pkgPath);
  }catch(ex){
    return {};
  }
}
let projectPkg=tryGetPackageJson();

let defaultVersionFolder=projectPkg&&projectPkg.version;
if(!defaultVersionFolder){
  defaultVersionFolder='v1';
}else{
  defaultVersionFolder='v'+defaultVersionFolder;
}

program
  .storeOptionsAsProperties(false)
  .passCommandToAction(true);

program
  .version(pkg.version, '-V, --version');
program
  .usage('[options]')
  .command('exec')
  // 选择名 选项描述 默认值
  // 选项 可以带有一个参数 可以通过 program.copy 获取该选项信息
  // 如果没有参数 该值为 true
  .option('-c, --config <source>', 'specify the config file(default setting is ./.publish-cc.js)')
  .requiredOption('-v, --ver <versionFolderName>', `version folder name，if not defined use the version of the project's package.json:`,defaultVersionFolder);
  
program.command('init').usage('init [options]')
  .description('init config file')
  .usage('init [options]')
  .option('-f, --force', '',true) 

program.parse(process.argv);
function resolve(program) {
  const options=program.opts();
  const args=program.args; 
  // return;

  if(args[0]==='init'){
    const {force } = options; 
    // create config file
    initObj.init(force);
  }else{
    const { config, ver } = options;
   
    // set dir
    // upload to oss
    publisherUtils.doPublish(config,ver)
  }
}

resolve(program);
 