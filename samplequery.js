var pengines = global.get('penginesModule')
node.warn("taco")
peng = pengines({
        server: "https://pengines.swi-prolog.org/pengine",
        chunk: 3,
        sourceText: 'animal(cat). animal(dog).',
        ask: 'animal(Animal)'
        } )
    .on('success',function(result){
    node.warn(result)
    node.warn(result.data[0])
        for(var resultData in result.data)
            node.warn(result.data[resultData].Animal);
            })
    .on('error', function(result){
         node.warn(result)
         })
     .on('stop', function(result){
         node.warn('stopped')
         })
     .on('destroy', function(result){
         node.warn('destroyed')
         })
return msg;
