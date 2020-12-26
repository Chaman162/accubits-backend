
function base(res, body){
    res.status(200).json(body);
}

function log(req, body){
    console.log(`
    ====================================================================================
    code: ${body.code},
    path: ${req.path},
    method: ${req.method},
    query: ${req.query ? JSON.stringify(req.query): ''},
    params: ${req.params ? JSON.stringify(req.params): ''},
    body: ${req.body ? JSON.stringify(req.body): ''},
    user: ${req.user ? JSON.stringify(req.user): ''},
    error: ${body.error ? JSON.stringify(body.error): ''}
    ====================================================================================
    `)
}
module.exports = {
  
    unauthorised: function(req,  res, body){
        body.code = 401;
        log(req, body);
        base(res, body);
    },
    forbidden: function(req,  res, body){
        body.code = 403;
        log(req, body);
        base(res, body);
    },
   
}
