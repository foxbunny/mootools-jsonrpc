# JSON-RPC plugin for mootools

This plugin implements the ``JSONRPC`` class with a ``send`` function 
that can be used for performing [JSON-RPC](http://json-rpc.org/) calls. The 
plugin adheres supports all currently available version of the JSON-RPC 
specification, but the implementation may be partial or inaccurate in some 
cases. 

The code has been completely rewritten 3 times, but this release (0.4) will 
be the foundation of future releases, and I will going to stabilize the API
until 1.0.

## Acknowledgements

Special thanks to [Arian Stolwijk](http://www.aryweb.nl) (arian), and 
[Mark Obcena](http://keetology.com/) (keeto) for great 
advice, code, guidance, and generally being cool guys to talk to. :)

## Bugs and Feature Requests

Report any issues to the 
[github issue tracker](https://github.com/foxbunny/mootools-jsonrpc/issues).

## How to Use

The API of this plugin has changed a lot since the initial release. The 
original idea was to simplfy JSON-RPC calls so they can be used almost like
a plain function call. The JSON-RPC setup has two parts: configuration and
call. Configuration may look like this:

    var myRpcCaller = new JSONRPC({
        url: '/serivces/jsonrpc',
        methodname: 'mymethod',
        onSuccess: function(response){
            console.log(response)
        }
    });
    
The above code creates a myRpcCaller object, that is bound to remote ``mymethod``
method. This binding allows us to call the remote method passing only parameters
and callbacks, without repeating the method multiple times: 

    myRpcCaller.send({params: "some text", onSuccess: function(){
        console.log('we did it!');
        }
    });
    
### Options

Options for JSON-RPC configuration are as follows:

#### url

__String__: The URL of the JSON-RPC service. Defaults to ``'/'``.

#### methodname

__String__: Name of the remote method. Defaults to ``null``. This option is not
required. It can be specified later when using the ``send`` function.

#### params

__Array__ or __Object__: Either a list of parameters, or an object containing
the parameters that will be passed to the remote method. Defaults to ``null``.
This option is not required.

#### method

__String__: HTTP method to use in the request. This is passed directly to 
``Request.JSON``.

#### encoding

__String__: Encoding scheme. It is passed through to ``Request.JSON``.

#### headers

__String__: Request headers. Passed through to ``Request.JSON``.

### Callback methods

The JSONRPC class has four events and you can specify the matching callbacks.

#### success / onSuccess

This event is fired when the JSON-RPC call is finished, and the id returned 
from the server matches the one used in the request.

#### failure / onFailure

This event is fired when the HTTP request fails. This even does not signify 
that the actual RPC call failed. For the RPC failure (soft failure) use the
``idMismatch`` and ``remoteFailure`` methods.

#### remoteFailure / onRemoteFailure

This event is fired when the remote method raises an exception. You should use 
this method in order to handle remote exceptions. Only the ``error`` key of the
complete response is returned.

#### idMismatch / onIdMismatch

This event is fired when the RPC id returned by the server does not match the
one sent by JSONRPC call. Although the complete ``response`` object is passed
to the callback function, it would probably be unwise to treat it as safe.

### Sending requests

You send JSON-RPC requests using the ``send`` function. This function takes a 
single object as is argument. If any of the object properties matches the one
specified in the configuration, it will override the configuration. The object 
can have the following properties:

#### method

__String__: The remote method name.

#### params

__Array__ or __Object__: Parameters to pass to remote method.

#### id

__Any__: The RPC call id.

#### onSuccess, onFailure, onRemoteFailure, onIdMismatch

__Function__: Callback methods. These will override the configured methods. 
Note that specifying callback methods when calling ``send`` will not only
override the configured callbacks, but also prevent the events from being 
fired, so anything listening to the events will not be able to catch them.
 
## Known Issues

### Params and Original JSON-RPC 1.0

The first version of the specification requires that the parameters are 
specified inside an array. JSONRPC plugin doesn't check for this, so it is
your job to ensure this. Later version of the specification also allow objects
to be used in place of arrays, which makes it possible to use named parameters.
