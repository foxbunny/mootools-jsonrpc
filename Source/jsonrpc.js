/*
 *
---
description: Implementation of JSON-RPC for MooTools. 
license: GPL
authors: Branko Vukelic
provides: [JSONRPC]
requires:
  core:1.3: [Native, Class, Class.Extras, Event, Request, JSON]
...
*/

var JSONRPC = new Class({
    Implements: [Events, Options],
    
    Extends: Request.JSON,
    
    // JSON-RPC-specific options
    options: {
        url: '/',
        methodname: null,
        params: null,
        method: 'post',
        encoding: 'utf-8',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/x-json, application/x-javascript'
        }
    },
    
    // Events
    success: false,
    failure: false,
    remoteFailure: false,
    idMismatch: false,
    
    initialize: function(options){
        this.setOptions(options);
        return this;
    },
    
    send: function(opts){
        var id = opts.id || String.uniqueID(), params = {};
        
        caller = new Request.JSON({
            url: this.options.url,
            method: this.options.method,
            encoding: this.options.encoding,
            headers: this.options.headers,
            onFailure: function(xhr){
                if (typeOf(opts.onFailure) === 'function') {
                    opts.onFailure(xhr);
                }
                else {
                    this.fireEvent('failure', xhr);
                }
            }.bind(this)            ,
            onSuccess: function(response){
                if (response.id == id) {
                    if (response.error) {
                        if (typeOf(opts.onRemoteFailure) === 'function') {
                            opts.onRemoteFailure(response.error);
                        }
                        else {
                            this.fireEvent('remoteFailure', response.error);
                        }
                    }
                    else {
                        if (typeOf(opts.onSuccess) === 'function') {
                            opts.onSuccess(response);
                        }
                        else {
                            this.fireEvent('success', response);
                        }
                    }
                }
                else {
                    if (typeOf(opts.onIdMismatch) === 'function') {
                        opts.onIdMismatch(response);
                    }
                    else {
                        this.fireEvent('idMismatch', response);
                    }
                }
            }.bind(this)
        });
        
        if (this.options.version === '1.1') {
            params.version = '1.1';
        }
        else 
            if (this.options.version === '2.0') {
                params.jsonrpc = '2.0';
            }
        params.method = opts.method || this.options.methodname;
        params.params = opts.params || this.options.params;
        params.id = id;
        
        caller.send(JSON.encode(params));
    }
    
});
