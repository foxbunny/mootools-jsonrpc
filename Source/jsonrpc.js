/*
---
description: Extends Request.JSON with methods to send JSON-RPC requests.
license: GPL
authors: Branko Vukelic
provides: [Request.JSON.rpcVersion, Request.JSON.callRPC]
requires:
  core:1.3: [Request]
...
*/

// Add option to specify the JSON-RPC version
Request.JSON.extend({
    options: {
        rpcVersion: '1.0'
    }
});

Request.JSON.implement({
    /**
     * Send a JSON-RPC request.
     *
     * @param method Name of the remote method.
     * @param params An object or array containing parameters passed to remote method.
     * @param id Optional id of the RPC call (defaults to a random string).
     */
    'sendRPC': function(method, params, id){
        var rpcver = this.options.rpcVersion, data = {};
        
        data.method = method;
        data.id = id || String.uniqueID();
        
        // version (or jsonrpc) key is only required for 
        // JSON-RPC specification versions 1.1 and later 
        if (rpcver == '1.1') {
            data.version = '1.1';
        }
        else 
            if (rpcver == '2.0') {
                data.jsonrpc = '2.0';
            }
        
        if (!rpcver && $type(params) != 'array') {
            // Ensure the params are an array (not needed in 2.0)
            data.params = [params];
        }
        else {
            data.params = params;
        }
        
        this.send(JSON.encode(data));
    }
});
