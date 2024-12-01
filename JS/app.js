//The URIs of the REST endpoint
POST = "https://prod-24.uksouth.logic.azure.com:443/workflows/bae358fbbbd54c2e89764542b2a8e243/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=JHxzsobTTeHaSTWXQjRleJ9gIY15WnMcqMc2-Fzb2ag";
GET_ALL = "https://prod-07.uksouth.logic.azure.com/workflows/e5fdd07148c5425fa4b0d297c225fcd4/triggers/When_a_HTTP_request_is_received/paths/invoke/gotv/highlights?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=C5G5uL2_kpLwdEg_-Y4OcAm4X_ua95NIahzaRHvbt1E"
DELETE = "https://prod-19.uksouth.logic.azure.com/workflows/d55d7557d4724df9a054306b1f966f96/triggers/When_a_HTTP_request_is_received/paths/invoke/goth/hightlights/%7Bid%7D?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=fGFN7FTzgjrLGbzmSXZPDSScnBa7QOFWxV0EqsCNkG8"

BLOB_ACCOUNT = "https://depaysokblob.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retImages").click(function(){

      //Run the get asset list function
      getImages();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){

  const file = $("#UpFile")[0].files[0]; // Get the uploaded file

  submitData = new FormData();

  submitData.append("Title", $("#Title").val());
  submitData.append('Description', $('#Description').val());
  submitData.append("Sport", $("#Sport").val());
  submitData.append("Event", $("#Event").val());
  submitData.append("File", $("#UpFile")[0].files[0]);

  if (file.type.startsWith("image/")) {
    submitData.append("Type", "image");
  } else if (file.type.startsWith("video")) {
    submitData.append("Type", "video");
  } else {
    submitData.append("Type", "unknown");
  }

  $.ajax({
    url: POST,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(data){
    }
  });

}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){
  $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');

  console.log($.getJSON(GET_ALL))

  $.getJSON(GET_ALL, function(data ) {
//Create an array to hold all the retrieved assets
    var items = [];
//Iterate through the returned records and build HTML, incorporating the key values of the

    $.each( data, function( key, val ) {
      items.push( "<li>");
      items.push( "<hr />");

      if (val["type"] === "image") {
        items.push("<img src='"+BLOB_ACCOUNT + val["filePath"] +"' width='400'/> <br />")
      } else if (val["type"] === "video") {
        items.push("<video width='400' controls> <source src='" + BLOB_ACCOUNT + val["filePath"] + "' type='video/mp4'> Your browser does not support the video tag. </video> <br />");
      }
      items.push( "<b>Title</b>: " + val["title"] + "<br />");
      items.push( "<b>Description</b>: " + val["description"] + "<br />");
      items.push( "<b>Sport</b>: " + val["sport"] + "<br />");
      items.push( "<b>Event:</b>: " + val["event"] + "<br />");
      items.push( "<hr />");
      items.push( `<button type='button' class='btn btn-outline-primary' onclick='deleteItem(` + '"' + val["id"] + '"' +`)'>Delete</button>` )
      items.push( "</li>");
    });
      //Clear the assetlist div
      $('#ImageList').empty();
      //Append the contents of the items array to the ImageList Div
      $( "<ul/>", {
        "class": "my-new-list", html: items.join( "" ),
      }).appendTo( "#ImageList" );

  });
 
}

function deleteItem(cosmosid){

  delete_with_params = DELETE.replace("%7Bid%7D", cosmosid);

  $.ajax({
    url: delete_with_params,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'DELETE',
    success: function(data){
    }
  });
  getImages()
}
