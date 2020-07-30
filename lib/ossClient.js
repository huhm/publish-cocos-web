let OSS = require('ali-oss');
const fs = require('fs');
const chalk=require('chalk');

class OssClient {
	static Instance;

	static tryInit (ossConfig,logConfig) {
		if (!OssClient.Instance) {
			OssClient.Instance = new OssClient(ossConfig,logConfig);
		}
	}
	_store;
	_logConfig={
		closeRecordFileUpload:true
	}
	_ossConfig;
	constructor(ossConfig,logConfig) {
		this._store = OSS({
			region:ossConfig.region,
			accessKeyId:ossConfig.accessKeyId,
			accessKeySecret:ossConfig.accessKeySecret,
			bucket:ossConfig.bucket
		});
		this._ossConfig=ossConfig;
		this._logConfig=logConfig;
	}

	_logFileRecord(msg){
		if(this._logConfig && this._logConfig.closeRecordFileUpload){
			return;
		}
		console.log(msg);
	}

	putFile (src, dist,_headers) {
		const store = this._store;
		try {
			let result = store.put(dist, src, {
				headers: _headers || this._ossConfig.defaultOssHeader
			});
			this._logFileRecord(chalk.green('  [OK] UploadFile:',dist)) 
			return result;
		} catch (e) {
			console.log(chalk.red('  [ERR] UploadFile:' + e, src));
			return Promise.resolve(false);
		}
	}


	// uploder folder deep search
	_dsUploadFolder (src, dist) {
		var docs = fs.readdirSync(src);
		let pList = [];
		docs.forEach((doc)=> {
			var _src = src + '/' + doc,
				_dist = dist + '/' + doc;
			var st = fs.statSync(_src);
			if (st.isFile() && doc !== '.DS_Store') {
				pList.push(this.putFile(_src, _dist));
			} else if (st.isDirectory()) {
				pList = pList.concat(this._dsUploadFolder(_src, _dist))
			}
		});
		return pList;
	}


	/**
	* uploader Folder
	* @param src source Path e.g:'../web-mobile'
	* @param dist OSS dest path e.g: folderName/versionName(oss://bucketName/folderName)
	*/
	async uploadFolder (src, dist) {
		try {
			// console.log('start upload oss');

			// delete last '/'
			if (dist[dist.length - 1] === '/') {
				dist = dist.substr(0, dist.length - 1);
			}
			let pList =this._dsUploadFolder(src, dist);
			await Promise.all(pList)
			// console.log('end upload oss');
		} catch (ex) {
			console.log(chalk.red('[ERROR] uploadFolder ex', ex));
		}
	}
}

module.exports=OssClient;
