// vanilla JS 
$(document).ready( function() {
  

  if ('token' in window.localStorage) {
    session = window.localStorage['token']
  } else {
    session = Date.now()
    window.localStorage['token'] = session
  }
  
  visible = 1  
  counter = 0
  interval = 100   
  queue = [] 

  var svg = document.getElementById("svg");
  var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");    
  polygon.setAttribute("fill", "none");
  polygon.setAttribute("stroke-width", "1px");
  polygon.setAttribute("stroke", "#34b233");
  
  svg.appendChild(polygon);



  start = function() {
    $('#intro').slideUp("fast");
    $('app').slideDown('fast')
    //ditmoetw eer aan
    window.setInterval(interval,1000)
    interval
  }



  track = function(url) {
      var ifrm = document.createElement("iframe");
      ifrm.setAttribute("src", url);
      ifrm.style.width = "0px";
      ifrm.style.height = "0px";
      document.body.appendChild(ifrm);
  }

  post = function(queue){
    $.get('https://dairycampus.azurewebsites.net/dcdata/htmltracker?session=' + session + '&data='+JSON.stringify(queue) , function(returnedData){
            
    }).fail(function(){
          console.log("error");
    });  
    return []
  }
    


  draw = function(X,Y, z=0, speed=0, accuracy=0) {
     
    $('#status').html('lat:'+X+' lon:'+Y+'speed:'+speed+' z:'+z+  ' accuracy:'+accuracy)
    xmin = 53.178327
    ymin = 5.754580
    xmax = 53.181337
    ymax = 5.762392
    
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
    localStorage['points'] += x + ',' + y + ' '
    
    

  }



  drawheatmap = function() {
    heatmap = {}
    total = 0
    window.localStorage['points'].split(' ').forEach(function(point){
      total = total + 1
      x = Math.floor(point.split(',')[0])
      y = Math.floor(point.split(',')[1])
      if (x in heatmap) {
        if (y in heatmap[x]) {
          heatmap[x][y] += 1
        } else {
          heatmap[x][y] = 1
        }
      } else {  
        heatmap[x] = {}
        heatmap[x][y] = 1
      }
    })

    ret = "<center><table style='' cellpadding=0 cellspacing=0>"
    for (x in range(0,100)) {
      ret += "<tr>"
      for (y in range(0,100)) {
        
        color=""
        if (x in heatmap) {
          if (y in heatmap[x]) {
            
            color = "green; opacity:"+(heatmap[x][y] / total)
          }
        } 
        ret += "<td style='background-color:"+color+ "; height:5px; width:5px'>"
        ret += "</td>"
      }
      ret += "</tr>"
    }
    ret += "</table></center>"
    $('heatmap')[0].innerHTML=ret

  }
  

  interval = function() {   

    navigator.geolocation.getCurrentPosition(function(position,positionError) {  
      queue.push({'timestamp':Date.now(),'lat':position.coords.latitude,'lon':position.coords.longitude})         
      draw( position.coords.longitude,position.coords.latitude, position.coords.altitude, position.coords.speed, position.coords.accuracy)
      queue = post(queue)

    });

    queue.push({'timestamp':Date.now(),'lat':0,'lon':0})         
    queue = post(queue)
    // console.log(1)
    // draw(X=0,Y=0)
    counter = counter + 1
    $('#counter').html(counter)
    
  }            

  url = 'https://dairycampus.azurewebsites.net/dcdata/htmltracker?new=new&session=' + session
  track(url)


  if ('points' in window.localStorage && window.localStorage['points'].length > 10) {
    polygon.setAttribute("points",  window.localStorage['points']);
    start()
  } else {
    window.localStorage['points'] = '';
  }
  // drawheatmap()
  

  setInterval(function(){
    $('#timestamp').html(Date.now())
  }, 100)
});


