const path=require('path');

function getPublishConfig(configFile){
    const configPath=path.join(process.cwd(),configFile);
    return require(configPath);
}

module.exports={
    getPublishConfig
}