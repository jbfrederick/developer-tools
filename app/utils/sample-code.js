const sampleCode = [
    {
        name: "Get Current User",
        code: `//use that session to interface with the API
var users = new platformClient.UsersApi();

console.log("getting ME");
users.getUsersMe().then(function(userObject){
    console.log("got me");
    console.log(userObject);
    console.log("done");
});`
    },
    {
        name: "Update Presence",
        code: `//This example will toggle your status between available and busy.
// TIP: open the notification tester, subscribe to your presence and pin the notifications.
// You can see the websocket messages as your status changes.

var presenceApi = new platformClient.PresenceApi();
var usersApi = new platformClient.UsersApi();

var userId = null;

var availablePresenceId = null;
var busyPresenceId = null;

//method to set your presence for a given id.
function setPresence(presenceId){
  console.log("Setting presence to " + presenceId);
  // Create request body
  var newPresence = {
      "presenceDefinition" : {
          "id": presenceId
      }
  };

  // Patch presence
  presenceApi.getUserPresence(userId, 'PURECLOUD', newPresence);
}

//Start by getting all the presence definitions in the system
presenceApi.getPresencedefinitions().then(function(presenceData){
    for (var x=0; x< Object.keys(presenceData.entities).length; x++){
        var presence = presenceData.entities[x];

        //keep track of the busy and available statuses
        if(presence.systemPresence == "Busy"){
          busyPresenceId = presence.id;
        }else if(presence.systemPresence == "Available"){
          availablePresenceId = presence.id;
        }
    }

    console.log("got all presence info");

    //get your user information, including current presence info
    usersApi.getUsersMe({'expand': ["presence"]}).then(function(userObject){
        userId = userObject.id;

        var currentPresenceId = userObject.presence.presenceDefinition.id;
        console.log("Current presence id: " + currentPresenceId);

        if(currentPresenceId !== availablePresenceId){
          setPresence(availablePresenceId);
        }else{
          setPresence(busyPresenceId);
        }
    });
});
`
    },
    {
        name: "Place a Phone Call",
        code: `var conversationsApi = new platformClient.ConversationsApi();

//create the request body, here (317) 222-2222 is the weather phone
// in Indianapolis.

var body = {
  phoneNumber: "3172222222"
};

conversationsApi.postConversationsCalls(body).then(function(result){
  console.log("call placed successfully");
  console.log(result);
}).catch(function(error){
  console.error("Error Placing call", error);
});`
    },
    {
        name: "Get Documents in Content Management",
        code: `//This example will get the user's workspace and then list out
// all the documents in the workspace
var contentManagementApi = new platformClient.ContentManagementApi();
var usersWorkspaceId = null;

contentManagementApi.getContentmanagementWorkspaces().then(function(workspaces){
    //iterate over the workspaces the user has access to
    for(var x=0; x< workspaces.entities.length; x++){

      if(workspaces.entities[x].isCurrentUserWorkspace){
        usersWorkspaceId = workspaces.entities[x].id;
        console.log("user's workspace id " + usersWorkspaceId);
      }

    }

    //get the documents for the workspace
    contentManagementApi.getContentmanagementDocuments(usersWorkspaceId).then(function(documents){
      var entities = documents.entities;
      for(var x=0; x< entities.length; x++){
        let document =entities[x];
        console.log(document.name, document.dateCreated);
      }
    }).catch(function(error){
        console.error(error);
    });

}).catch(function(error){
    console.error(error);
});`
    },
    {
        name: "User Paging",
        code: `//This example will log out a list of all users in the system.
var users = new platformClient.UsersApi();

console.log("getting ME");

function processPageOfUsers(results){
  for(var x=0; x< results.entities.length; x++){
    console.log(results.entities[x].name);
  }

  if(results.nextUri){
    //get the next page of users directly
    pureCloudSession.get(results.nextUri).then(processPageOfUsers);
  }

}

users.getUsers().then(processPageOfUsers);`
    },
    {
        name: "Get Org Details",
        code: `var orgApi = new platformClient.OrganizationApi();

orgApi.getOrganizationsMe().then(function(result){
    console.log(result);
});`
    }
];

export default sampleCode;
