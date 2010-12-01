/*
---
description: Extends Request.JSON with methods to send JSON-RPC requests.
license: GPL
authors: Branko Vukelic
provides: [Request.JSONRPC]
requires:
  core:1.3: [Request.JSON]
...
*/

Request.JSONRPC = new Class({
    
    Extends: Request.JSON,
    
    // JSON-RPC-specific options
    options: {
        version: '1.0'
    },
   
    /**
     * Send a JSON-RPC request.
     * You can use sendRPC method instead for more readable code.
     *
     * @param opts Object with three parameters
     */
    send: function(opts) {
        var method = opts.method,
            params = opts.params,
            id = opts.id;
                        
        var data = {};
        
        if (method) {
            // JSON-RPC 1.1 uses 'version' key
            if (this.options.version == '1.1') {
                data.version = '1.1';
            }
            // JSON-RPC 2.0 uses 'jsonrpc' key
            else if (this.options.version == '2.0') {
                data.jsonrpc = '2.0';
            }
            
            data.method = method;
            
            if (this.options.version === '2.0' || this.options.version == '1.1' && params) {
                data.params = params;
            }
            else if (params) {
                // The older specs and some non-conforming clients do not 
                // allow non-array parameters. This is not a correct way to
                // deal with the problem, but we do it anyway.
                // FIXME: Find a better solution, or just remove this block.
                data.params = [params];
            }
            
            data.id = id || String.uniqueID();

            // Call parent's send() function
            this.parent(JSON.encode(data));
        }
        else {
            throw('JSON-RPC remote method must be specified.')
        }
    },
    
    /**
     * Wrapper that sends out RPC request.
     * Packages up the parameters and calls send().
     * 
     * @param method 
     * @param params
     * @param id
     */
    sendRPC: function(method, params, id){
        var opts = {};
        
        opts.method = method;
        opts.params = params;
        opts.id = id;
        
        this.send(opts);
    }
    
});