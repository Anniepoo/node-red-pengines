module.exports = function(RED) {
    function PengineRPCNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
		var pengines = global.get('penginesModule')
		var serverurl = context.get('server');
		var chunk = int(context.get('chunk');
                var code = context.get('sourceText');
                var template = context.get('template');
		peng = pengines({
			server: serverurl,
			chunk: chunk,
			sourceText: code,
			ask: msg.payload,
			template: template
			} )
		    .on('success',function(result){
			    node.warn(result);
			    node.warn(result.data[0])
				for(var resultData in result.data)
				    node.send(result.data[resultData]);
			    })
		    .on('error', function(result){
			 node.warn(result);
			 node.error("pengine error ", msg);
			 })
		
        });
    }
    RED.nodes.registerType("pengine-rpc",PengineRPCNode);
}
