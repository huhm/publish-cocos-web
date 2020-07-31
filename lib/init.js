
const fs=require('fs');
const path=require('path');


exports.init=function init () {
    // 判断源文件是否存在
    const srcPath=path.join(process.cwd(),'.publish-cc.js')
    fs.exists(srcPath, function (exists) {
        if (exists) {
            console.log(`This Project has inited by publish-cc`)
        } else { 
           let data = fs.readFileSync(path.join(__dirname,'../template/.publish-cc.js'),{
               encoding:'utf-8'
           });
           fs.writeFileSync(srcPath,data,{
               encoding:'utf-8'
           });
           console.log(`[${srcPath}] has created,Please edit the file,before use publish-cc`);
        }
    })
}