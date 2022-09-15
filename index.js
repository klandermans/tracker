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
  polygon.setAttribute("fill", "none");
  polygon.setAttribute("stroke-width", "0.5px");
  polygon.setAttribute("stroke", "green");
  
  
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
    


  draw = function(X,Y) {

    xmin = 52.962603
    ymin = 5.783837
    xmax = 52.962209 
    ymax = 5.784504 

    if (X==0) {
      X=(xmax-xmin) * Math.random() + xmin
      Y=(ymax-ymin) * Math.random() + ymin
    }

    x = X
    y = Y

    
    
    x = x - xmin
    y = y - ymin
    
    x = x / (xmax - xmin)
    y = y / (ymax - ymin)
    
    x = x * 100
    x = Math.floor(x)
    y = y * 100
    y = Math.floor(y)

    var point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    polygon.points.appendItem(point);
    
    // document.body.innerHTML += (x + ' ' + y + ' ' +  X + ' '+  Y+' <br>')

  }

  interval = function() {   

    navigator.geolocation.getCurrentPosition(function(position,positionError) {  
      
      queue.push({'timestamp':Date.now(),'lat':position.coords.latitude,'lon':position.coords.longitude})         
      draw(position.coords.latitude, position.coords.longitude)
  
     
    });
    // draw(X=0,Y=0)
  }            

  url = 'https://dairycampus.azurewebsites.net/dcdata/htmltracker?new=new&session=' + session
  track(url)
});

