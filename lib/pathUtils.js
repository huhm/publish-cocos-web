 function removeLastSlash(strPath){
    if(isLastSlash(strPath)){
        return strPath.substr(0,strPath.length-1);
    }
    return strPath;
}

function isLastSlash(strPath){
    if(!strPath){
        return false;
    }
    let lastChar =strPath[strPath.length-1];
    
    if(lastChar==='/'||lastChar==='\\'){
        return true;
    }
    return false;
}

/**
 * 合并path,中间用slash
 * @param {string[]} pathList 
 * @param {string} slash 
 */
function combilePath(pathList,slash){
    let str=[];
    pathList.forEach((pathItem,idx)=>{
        if(!pathItem){
            return;
        }
        str.push(pathItem);
        if(isLastSlash(pathItem)){
            return;
        }
        if(idx!==pathList.length-1){
            str.push(slash);
        }
    });
    return str.join('');
}

function convertToForwardSlash(path){
    return path.replace(/\\/g,'/')
}


module.exports={
    removeLastSlash,
    isLastSlash,
    combilePath,
    convertToForwardSlash
}