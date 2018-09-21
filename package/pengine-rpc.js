	module.exports = function(RED) {
	    function PengineRPCNode(config) {
	        RED.nodes.createNode(this,config);
	        this.server = config.server;
	        this.chunk = parseInt(config.chunk);
	        this.sourceText = config.sourceText;
	        this.template = config.template;
	        var node = this;
	        node.on('input', function(msg) {
					var pengines = this.context().global.get('penginesModule');

					pengines({
						server: node.server,
						chunk: parseInt(node.chunk),
						sourceText: node.sourceText,
						ask: msg.payload,
						template: node.template
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
