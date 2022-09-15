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

  var svg = document.getElementById("svg");
  var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");    
  svg.appendChild(polygon);




  start = function() {
    $('app').show()
    document.querySelectorAll('#intro')[0].innerHTML = ''
    //ditmoetw eer aan
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


      xmin = 52.962603
      ymin = 5.783837
      xmax = 52.962209 
      ymax = 5.784504 

      x = position.coords.latitude - xmin
      y = position.coords.longitude - ymin
      
      x = x / (xmax - xmin)
      y = y / (ymax - ymin)
      
      var point = svg.createSVGPoint();
      point.x = x;
      point.y = y;
      polygon.points.appendItem(point);
         
     
    });
    
  }            

  url = 'https://dairycampus.azurewebsites.net/dcdata/htmltracker?new=new&session=' + session
  track(url)
});

