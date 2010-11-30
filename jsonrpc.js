/*
---
description: Implementation of JSON-RPC 1.1 for MooTools. 
license: GPL
authors: Branko Vukelic
provides: [JSONRPC, JSONRPC.call]
requires:
  core:1.3: [Native, Class, Class.Extras, Event, Request]
...
*/

var JSONRPC = {};

JSONRPC.version = '1.1';

JSONRPC.call = new Class({
    Implements: [Events, Options],
    
    options: {
        url: '/',
        method: 'post',
        encoding: 'utf-8',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/x-json, application/x-javascript'
        }
    },
    
    // JSONRPC events
    success: false,
    failure: false,
    
    // ID of the last RPC call
    rpcid: null,
    
    // Cached objects
    Request: false,
    
    initialize: function(options){
        this.setOptions(options);
        this.Request = new Request.JSON({
           url: this.options.url,
           method: this.options.method,
           encoding: this.options.encoding,
           headers: this.options.headers,
           onFailure: function(xhr){
               this.fireEvent('failure', xhr, this.rpcid);
           }.bind(this),
           onSuccess: function(response) {
               if (response.id === this.rpcid) {
                   this.fireEvent('success', response, this.rpcid);
               }
               else {
                   this.fireEvent('failure', null, this.rpcid);
               }
           }.bind(this)
        });
        return this;
    },
    
    /**
     * Send a remote procedure call.
     * If the remoteMethod parameter is falsy, it will do nothing.
     * 
     * @param remoteMethod name od the remote method to invoke.
     * @param params an array of parameters to pass (named parameters not supported).
     * @param id optional id of the call; defaults to String.uniqueID().
     */
    send: function(remoteMethod, params, id) {
        if (remoteMethod) {
            this.rpcid = id || String.uniqueID();
            this.Request.send(
                JSON.encode({
                    version: JSONRPC.version,
                    method: remoteMethod,
                    params: params,
                    id: this.rpcid
                })
            );
        }
    }
});