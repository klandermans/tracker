// vanilla JS 
$(document).ready( function() {
  
  session = Date.now()
  visible = 1  
  counter = 0
  interval = 100   
  queue = []
  

  start = function() {
    $('#app').show()
    document.querySelectorAll('p')[0].innerHTML = ''
    document.querySelectorAll('p')[1].innerHTML = ''
    document.getElementById('start').style.display = 'none'
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

  track= function(url) {
      var ifrm = document.createElement("iframe");
      ifrm.setAttribute("src", url);
      ifrm.style.width = "0px";
      ifrm.style.height = "0px";
      document.body.appendChild(ifrm);
  }

  post = function(){
    $.get('https://dairycampus-test.azurewebsites.net/dcdata/htmltracker?session=' + session + '&data='+JSON.stringify(queue) , function(returnedData){
            console.log(returnedData);
    }).fail(function(){
          console.log("error");
    });  
    return []
  }
    
  interval = function() {                
    navigator.geolocation.getCurrentPosition(function(position,positionError) {  
      
      queue.push({'timestamp':Date.now(),'lat':position.coords.latitude,'lon':position.coords.longitude})                
      document.getElementById('log').innerHTML += Date.now() +'<hr>'
        if (visible == 1) {
          if (queue.length > 30) {
            queue = post()
          }
        }
      console.log(queue)  
      $('#progress').attr('aria-valuenow',  counter)
      
    });
    $('#progress').attr('aria-valuenow',  counter)
  }            
  interval2 = function() {   
    queue.push({'timestamp':Date.now(),'lat':1,'lon':2})                
    document.getElementById('log').innerHTML += Date.now() +'<hr>'
      if (visible == 1) {
        if (queue.length > 30) {
          queue = post()
        }
      }
    console.log(queue)  
    $('#progress').attr('aria-valuenow',  counter)
  }            
  document.addEventListener("visibilitychange", onchange); 
  document.getElementById("start").addEventListener("click", start);
  url = 'https://dairycampus-test.azurewebsites.net/dcdata/htmltracker?new=new&session=' + session
  track(url)
});

