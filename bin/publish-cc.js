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
  .description('deploy the build folder to oss')
  //.command('exec')
  .option('-c, --config <source>', 'specify the config file(default setting is ./.publish-cc.js)')
  .requiredOption('-v, --ver <versionFolderName>', `version folder name，if not defined use the version of the project's package.json:`,defaultVersionFolder)
  .action((program)=>{
    const options=program.opts();
    const { config, ver } = options;
    publisherUtils.doPublish(config,ver)
  })
  program.command('init')
  .usage('init [options]')
  .description('init config file')
  .usage('init [options]')
  .option('-f, --force', '',true)
  .action((program)=>{
    const options=program.opts();
    const {force } = options; 
    // create config file
    initObj.init(force);
  });

program.parse(process.argv);
