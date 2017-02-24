var FtpDeploy = require('ftp-deploy');
var fs = require("fs");
var mkdirp = require("mkdirp");
var rmdir = require("rmdir");
var ncp = require("ncp").ncp;


var events = require('events');
var eventEmitter = new events.EventEmitter();
var fileCountCurr=0;
var fileCount=0;
eventEmitter.on('endOne',function(){
    fileCountCurr++;
    if(fileCount==fileCountCurr){
        
        eventEmitter.emit('end');
        
    }
});




eventEmitter.on('run',run);


var conFile='./upftp.json';

var confName='main';


if (!fs.existsSync(conFile)) {
    console.error("upftp.json Config File Not Found!");
}else{
    var conf=require(conFile);

    var config=conf[confName];

    var dirName='.upftp_'+confName;
    
    if(fs.existsSync(dirName)){
        rmdir(dirName,function (err, dirs, files) {
            eventEmitter.emit('run');
        });
    }else{
        eventEmitter.emit('run');
    }

}

eventEmitter.on('end',function(){
    
    var ftpDeploy = new FtpDeploy();
    
    var con = {
    username: config.ftpData.user,
    password: config.ftpData.pass, // optional, prompted if none given
    host: config.ftpData.host,
    port: config.ftpData.port,
    localRoot: dirName,
    remoteRoot: ""
};

ftpDeploy.deploy(con, function(err) {
    if (err) console.log(err)
    else console.log('Success: Uploaded!');
});
   


});

function run(){
    mkdirp(dirName);
    
    var files=config.files;
    fileCount=files.length;
    if(files.length>0){
        
        for(var i=0;i<files.length;i++){
            
            var f=files[i];
            var fa=f.split('/');
            if(fa.length>1){
                var di='';
                for(var d=0;d<fa.length;d++){
                    di+=fa[d];
                    if(fs.lstatSync(di).isDirectory()){
                        if(!fs.existsSync(dirName+'/'+di)){
                            mkdirp(dirName+'/'+di);
                        }
                    }
                    di+='/';
                }
                
            }
            
            ncp(files[i], dirName+'/'+files[i], function (err) {
                if (err) {
                  return console.error(err);
                }
                eventEmitter.emit('endOne');
               });
               
               
            
        }

        
        
    }else{
        
        console.log("Files length 0");
        
    }
    }
