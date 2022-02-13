function createAuthorizedResponse(resource) {
    return {
      principalId: 'me',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: resource
        }]
      }
    };
  }
  
  exports.handler = async function(event, context) {
    // For debug purposes only.

    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  
    const { queryStringParameters, methodArn } = event;
  

    if(queryStringParameters.auth === 'trust') {
      return createAuthorizedResponse(methodArn);
    } else {
      throw new Error('Unauthorized');
    }
  }