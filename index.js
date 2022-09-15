// vanilla JS 
$(document).ready( function() {
  

  if (document.cookie) {
    session = document.cookie
  } else {
    session = Date.now()
    document.cookie = session
  }
  
  
  visible = 1  
  counter = 0
  interval = 100   
  queue = [] 

  start = function() {
    $('app').show()
    document.querySelectorAll('#intro').style.display = 'none'
    window.setInterval(interval,1000)
    interval
  }
  
  onchange = function(data) {            
    if (visible == 1) {
      visible = 0
    } else {
      visible = 1
    }
  }

  track = function(url) {
      var ifrm = document.createElement("iframe");
      ifrm.setAttribute("src", url);
      ifrm.style.width = "0px";
      ifrm.style.height = "0px";
      document.body.appendChild(ifrm);
  }

  post = function(){
    $.get('https://dairycampus.azurewebsites.net/dcdata/htmltracker?session=' + session + '&data='+JSON.stringify(queue) , function(returnedData){
            console.log(returnedData);
    }).fail(function(){
          console.log("error");
    });  
    return []
  }
    
  interval = function() {                
    navigator.geolocation.getCurrentPosition(function(position,positionError) {  
      
      queue.push({'timestamp':Date.now(),'lat':position.coords.latitude,'lon':position.coords.longitude})                
     
    });
    
  }            

  url = 'https://dairycampus.azurewebsites.net/dcdata/htmltracker?new=new&session=' + session
  track(url)
});

