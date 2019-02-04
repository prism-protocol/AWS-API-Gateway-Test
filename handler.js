'use strict';

var AWS = require('aws-sdk'),
	uuid = require('uuid'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

module.exports.writeMovie = function(event, context, callback){
	const ID = uuid.v1();
	var params = {
		Item : {
			"id" : ID,
			"Name" : event.Name
		},
		TableName : process.env.TABLE_NAME
	};
	documentClient.put(params, function(err, data){
		if(err){
			callback({response:0,message:'document not inserted'});
		}else{
			
		callback(null,{response:3,id:ID,message:'record inserted'});
		}
	});
};

module.exports.readAllMovies = function(event, context, callback){
	var params = {
		TableName : process.env.TABLE_NAME
	};
	documentClient.scan(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
		    callback(null, {response:3,data:data.Items});
		}
	});
}

module.exports.updateMovie = function(event, context, callback){
  console.log('id of the movie..',event.id);
var params = {

  TableName : process.env.TABLE_NAME,
  Key: {
          id : event.id
          },
      UpdateExpression: "set #Name = :Name",
      ExpressionAttributeValues:{
      ":Name":event.Name
      },
      ExpressionAttributeNames:{
      "#Name": "Name"
      },
      ReturnValues:"UPDATED_NEW"
    };

console.log("Updating the item...");
documentClient.update(params, function(err, data) {
  if (err) {
      console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
  } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      callback(null,{response:3,message:'Profile updated'});
  }
});
};

