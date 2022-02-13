const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const connectionTable = 'ConnectionsTable';
let NAMES_DB = {};

exports.handler = async function(event, context) {

  const { connectionId, routeKey ,domainName,stage} = event.requestContext;
  
  const body = typeof event.body ==="string"? JSON.parse(event.body||"{}"):event.body;
  
  const apig = new AWS.ApiGatewayManagementApi({
  endpoint: `https://${domainName}/${stage}`
});
  switch(routeKey) {
    case '$connect':
      await connect(connectionId);
      break;

    case '$disconnect':
        await disconnect(apig,connectionId);
      break;
      case 'setName':
       if(body) await setName(apig,body.name,connectionId);
        break;
    case 'sendMsg':
      const ids = Object.keys(NAMES_DB);
      await sendToAll(apig,ids,body);
      break;

    case '$default':
    default:
      await apig.postToConnection({
        ConnectionId: connectionId,
        Data: `Received on $default: ${body}`
      }).promise();
  }


  return { statusCode: 200 };
};

const connect = async ()=>{
  return {};
};
const disconnect = async (apig,connectionId) => {

  
    await sendToAll(apig,Object.keys(NAMES_DB), { systemMessage: `${NAMES_DB[connectionId]} has left the chat` });
    delete NAMES_DB[connectionId];
    await sendToAll(apig,Object.keys(NAMES_DB), { members: Object.values(NAMES_DB) });
    return {};
  };
  
const sendToOne = async (apig,connectionId, body) => {
    try {
      await apig.postToConnection({
        'ConnectionId': connectionId,
        'Data': Buffer.from(JSON.stringify(body)),
      }).promise();
    } catch (err) {
      console.error(err);
    }
  };
  
  const sendToAll = async (apig,ids, body) => {
    
    const all = ids.map(i => sendToOne(apig,i, body));
    return Promise.all(all);
  };

   const setName = async (apig,name, connectionId) => {
    NAMES_DB[connectionId] = name;
    await sendToAll(apig,Object.keys(NAMES_DB), { members: Object.values(NAMES_DB) });
    await sendToAll(apig,Object.keys(NAMES_DB), { systemMessage: `${NAMES_DB[connectionId]} has joined the chat` });
    return {};
  };
  