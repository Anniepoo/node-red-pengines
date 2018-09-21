	module.exports = function(RED) {
	    function PengineRPCNode(config) {
	        RED.nodes.createNode(this,config);

	        var node = this;
	        node.on('input', function(msg) {
					var pengines = this.context().global.get('penginesModule');

					pengines({
						server: config.server,
						chunk: parseInt(config.chunk),
						sourceText: config.sourceText,
						ask: msg.payload,
						template: config.template
						} )
					    .on('success',function(result){
							for(var resultData in result.data) {
								msg.payload = result.data[resultData];
							   node.send(msg);
							}
							if(result.more) {
							   this.next()
							}
						    })
					    .on('error', function(result){
							 node.warn(result);
							 node.error("pengine error ", msg);
						 });
	        });
	    }
	    RED.nodes.registerType("pengine-rpc",PengineRPCNode);
	}
