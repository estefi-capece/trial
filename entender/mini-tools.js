
MiniTools.serveTransforming = function serveTransforming(pathToFile, anyFileOrOptions, extOriginal, extTarget, renderizer, textType){
    var regExpExtDetect;
    var regExpExtReplace;
    var anyFile;
    var renderOptions;
    if(anyFileOrOptions==null || typeof anyFileOrOptions==="boolean"){
        anyFile=anyFileOrOptions;
    }else{
        anyFile=anyFileOrOptions.anyFile;
        renderOptions=changing(anyFileOrOptions,{anyFile:undefined},changing.options({deletingValue:undefined}));
    }
    var traceRoute=renderOptions && renderOptions.trace?'serveContent>'+renderOptions.trace:(MiniTools.logServe?getTraceroute():'');
    if(extOriginal){
        regExpExtDetect =new RegExp('\.'+escapeRegExp(extOriginal)+'$');
        regExpExtReplace=new RegExp('\.'+escapeRegExp(extOriginal)+'$','g');
    }else{
        regExpExtDetect=/^(.*\/)?[^\/\.]+$/;
        regExpExtReplace=/$/g;
    }
    return function(req,res,next){
        var pathname = 'path' in req ? req.path : url.parse(req.url).pathname;
        if(traceRoute){
            console.log('xxxxx-minitools-por-revisar',traceRoute,pathname);
        }
        if(anyFile && !regExpExtDetect.test(pathname)){
            return next();
        }
        var sfn;
        Promise.resolve().then(function(){
            var fileName=(pathToFile+(anyFile?'/'+pathname:'')).replace(regExpExtReplace, '.'+extTarget);
            sfn=fileName;
            return fs.readFile(fileName, {encoding: 'utf8'});
        }).catch(function(err){
            if(anyFile && err.code==='ENOENT'){
                if(traceRoute){
                    console.log('xxxxx-minitools: no encontre el archivo',traceRoute,pathname);
                }
                throw new Error('next');
            }
            throw err;
        }).then(function(fileContent){
            var args=[fileContent];
            if(renderOptions!==undefined){
                args.push(renderOptions);
            }
            return renderizer.render.apply(renderizer,args);
        }).then(function(htmlText){
            if(traceRoute){
                console.log('XXXXXXXX!!!!-xxxxx-minitools: ENVIANDO el archivo',traceRoute,pathname);
            }
            MiniTools.serveText(htmlText,textType)(req,res);
        }).catch(MiniTools.serveErr(req,res,next));
    };
};
