// vanilla JS 
$(document).ready( function() {
  
  session = Date.now()
  
  start = function() {
    $('#app').show()
    counter = 0
    interval = 100   
    visible = 1
    queue = []
    
    document.querySelectorAll('p')[0].innerHTML = ''
    document.querySelectorAll('p')[1].innerHTML = ''
    document.getElementById('start').style.display = 'none'
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

  document.addEventListener("visibilitychange", onchange);
    
  interval = function() {                
    navigator.geolocation.getCurrentPosition(function(position,positionError) {  
      url = 'https://dairycampus-test.azurewebsites.net/dcdata/htmltracker?latitude=' + position.coords.latitude + '&longitude=' + position.coords.longitude + '&session=' + session
      queue.push(url)                
      document.getElementById('log').innerHTML += Date.now() +'<hr>'
      if (visible == 1) {
        for (key in queue) {
          url = queue[key]
          track(url)
        }
        queue = []
      }
    });
    $('#progress').attr('aria-valuenow',  counter)
  }            
  
  window.setInterval(interval,10000)
  
  document.getElementById("start").addEventListener("click", start);
  
  url = 'https://dairycampus-test.azurewebsites.net/dcdata/htmltracker?new=new&session=' + session
  track(url)
});

