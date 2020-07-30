#!/usr/bin/env node
const path=require('path');
const program = require('commander');
const pkg=require('../package.json');
const initObj=require('../lib/init');
const publisherUtils = require('../lib/publisher');
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
  .version(pkg.version, '-V, --version')
  // 用法说明
  .usage('init')
  .usage('[options]')
  // 选择名 选项描述 默认值
  // 选项 可以带有一个参数 可以通过 program.copy 获取该选项信息
  // 如果没有参数 该值为 true
  .option('-c, --config <source>', 'specify the config file(default setting is ./.publish-cc.js)')
  .requiredOption('-v, --ver <versionFolderName>', `version folder name，if not defined use the version of the project's package.json:`,defaultVersionFolder)
  .parse(process.argv);

function resolve(program) {
  const { config, ver,args } = program;
  console.log('config',config);
  console.log('ver',ver)
  for (let i = 0; i < args.length; i++) {
    console.log(`arg[${i}]:${args[i]}`);
  }

  if(args[0]==='init'){
    // create config file
    initObj.init();
  }else{
    // set dir
    // upload to oss
    publisherUtils.doPublish(config,ver)
  }
}

resolve(program);
 