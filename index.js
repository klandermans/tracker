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
     
    // leeuwarden
    xmin = 53.18
    ymin = 5.754580
    xmax = 53.181223
    ymax = 5.7612



    if (X==0) {
      X=(xmax-xmin) * Math.random() + xmin
      Y=(ymax-ymin) * Math.random() + ymin
    }

    x = X
    y = Y

    if (X < xmin) {x = xmin + 0.0000001}
    if (X > xmax) {x = xmax - 0.0000001}
    if (Y < ymin) {y = ymin + 0.0000001}
    if (Y > ymax) {y = ymax - 0.0000001}    

    x = x - xmin
    y = y - ymin
    console.log(x)
    x = x / (xmax - xmin)
    y = y / (ymax - ymin)
    
    x = x * 500
    x = Math.floor(x)
    
    y = y * 500
    y = Math.floor(y)

    var point = svg.createSVGPoint();
    point.x = x;
    point.y = y;

    polygon.points.appendItem(point);
    localStorage['points'] += x + ',' + y + ' '
    
    $('#status').html('lat:'+X+' lon:'+Y+' speed:'+speed+' z:'+z+  ' accuracy:'+accuracy +' x:'+x+' y:'+y)
    

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
    for (x in range(0,1000)) {
      ret += "<tr>"
      for (y in range(0,1000)) {
        
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
      draw( position.coords.latitude,  position.coords.longitude, position.coords.altitude, position.coords.speed, position.coords.accuracy)
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


