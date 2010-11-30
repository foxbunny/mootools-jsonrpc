# JSON-RPC plugin for mootools

This plugin implements a ``JSONRPC`` class that can be used for performing
[JSON-RPC](http://json-rpc.org/) calls. The plugin adheres to version 1.1 of
the specification (working draft).

## Usage

The JSON-RPC API is similar to the API used in core Request object. Here's a
simple example:

    var myRpcCaller = JSONRPC.call({
        url: '/serivces/jsonrpc',
        onSuccess: function(request){
            $('test').set('html', request.result)
        }
    });

    myRpcCaller.send('remote_method', ['param1', 2, null]);

The caller object is created by calling ``new JSONRPC.call(...)``. This object
has a ``send`` method which can be called to actually send the RPC call. Check
the source code for parameters of both ``JSONRPC.call`` and ``JSONRPC.send``.
