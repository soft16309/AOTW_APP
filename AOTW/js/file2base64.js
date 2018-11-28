/**
 * 文件转base64字符串
 * @param {Object} path
 * @param {Object} callback
 */
function file2dataURL (path, callback) {
    plus.io.resolveLocalFileSystemURL(path, function(entry){
        entry.file(function(file){
            var reader = new plus.io.FileReader();
            reader.onloadend = function (e) {
//              console.log(e.target.result);
                callback && callback(e.target.result);
            };
            reader.readAsDataURL(file);
        },function(e){
            mui.toast("读写出现异常: " + e.message );
        })
    })
}

/**
 * base64字符串转成语音文件(参考http://ask.dcloud.net.cn/question/16935)
 * @param {Object} base64Str
 * @param {Object} callback
 */
function dataURL2Audio (base64Str, callback) {
    var base64Str = base64Str.replace('data:audio/amr;base64,','');
    var audioName = (new Date()).valueOf() + '.amr';

    plus.io.requestFileSystem(plus.io.PRIVATE_DOC,function(fs){
        fs.root.getFile(audioName,{create:true},function(entry){
            // 获得平台绝对路径
            var fullPath = entry.fullPath;
            if(mui.os.android){  
                // 读取音频
                var Base64 = plus.android.importClass("android.util.Base64");
                var FileOutputStream = plus.android.importClass("java.io.FileOutputStream");
                try{
                    var out = new FileOutputStream(fullPath);
                    var bytes = Base64.decode(base64Str, Base64.DEFAULT);
                    out.write(bytes); 
                    out.close();
                    // 回调
                    callback && callback(entry);
                }catch(e){
                    console.log(e.message);
                }
            }else if(mui.os.ios){
                var NSData = plus.ios.importClass('NSData');
                var nsData = new NSData();
                nsData = nsData.initWithBase64EncodedStringoptions(base64Str,0);
                if (nsData) {
                    nsData.plusCallMethod({writeToFile: fullPath,atomically:true});
                    plus.ios.deleteObject(nsData);
                }
                // 回调
                callback && callback(entry);
            }
        })
    })
}

/**
 * 图片压缩
 */
function compressImage(path, callback){
	var compressWidth = 480;		//480  压缩到多大，改这里
  	var img = new Image();
    img.src = path;        // 传过来的图片路径在这里用。
    img.onload = function () {
    	//检查图片是否需要压缩
       	if (this.width <= compressWidth) {
       		file2dataURL(path, callback);
       		return;
       	}
        
        var that = this;
        //生成比例 
        var w = that.width,
            h = that.height,
            scale = w / h; 
            w = compressWidth || w;              
            h = w / scale;

        //生成canvas
        var canvas = document.createElement('canvas');

        var ctx = canvas.getContext('2d');

        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(that, 0, 0, w, h);

        var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8 );   //1最清晰，越低越模糊。有一点不清楚这里明明设置的是jpeg。弹出 base64 开头的一段 data：image/png;却是png。哎开心就好，开心就好

		callback && callback(base64);
	}

}
