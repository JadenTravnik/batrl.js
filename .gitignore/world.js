function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

window.addEventListener("load", function (ev) {
  var canvas = document.getElementById("canvas");
  canvas.style.backgroundColor = "black";
  var c2d = canvas.getContext("2d");

  var numStates = Math.round(canvas.height/20);

  var agent = Agent(numStates);

   var perlin = Perlin();
  var topPoints = new Float32Array(canvas.width);
  var botPoints = new Float32Array(canvas.width);
  var index = 0;
  topPoints[index] = perlin.get1d(0);
  botPoints[index] = perlin.get1d(10);
  var y = function (x, level) {
    if (level == 'bot'){
      return (1 - botPoints[x % botPoints.length]) * canvas.height / 3;
    } else {
      return (1 - topPoints[x % topPoints.length]) * canvas.height / 3; 
    }
  };


  c2d.strokeStyle = "green";
  c2d.lineJoin = "round";
  var draw = function () {
    index = index + 1;

    topPoints[index % topPoints.length] = perlin.get1d(7 * index / canvas.width);
    botPoints[index % botPoints.length] = perlin.get1d(9 * (index+300) / canvas.width);
    var zero = index + 1;
    c2d.clearRect(0, 0, canvas.width, canvas.height);


    // bot
    c2d.beginPath();
    c2d.moveTo(0, y(zero));
    for (var i = 1; i < canvas.width; i++) {
      c2d.lineTo(i, Math.min(canvas.height, y(zero + i, 'bot') + canvas.height/2));
    }    
    c2d.stroke();

    // top
    c2d.beginPath();
    c2d.moveTo(0, y(zero) - 10);
    for (var i = 1; i < canvas.width; i++) {
      c2d.lineTo(i, Math.max(0,y(zero + i, 'top')));
    }
    
    c2d.stroke();


    var top = y(agent.x + zero, 'top'), bot = y(agent.x + zero, 'bot') + canvas.height/2;

    agent.act();

    // gravity
    agent.y += 1;

    agent.y = Math.max(0, agent.y);
    agent.y = Math.min(canvas.height, agent.y);

    // calc state
    var binSize = (canvas.height)/numStates;
    var state = (agent.y)/binSize - 1;
    if (state < 0){
      state = 0;
    }
  

    var reward = 0;
    // check if agent hit top or bottom
    if (agent.y + agent.r > bot)
	    reward = -Math.abs(Math.max(-(agent.y + agent.r - bot), -200));
    if (agent.y - agent.r < top)
	    reward = -Math.abs(Math.max(top - agent.r - agent.y, -200));

    console.log("Reward: " + reward);

    c2d.fillStyle = "rgb(" + Math.round((255*-reward)/200) + "," + Math.round((255*(200+reward))/200) + "," + 0 + ")";


    agent.reward(reward, Math.round(state)); // should give bot and top only
    

    c2d.beginPath();
    c2d.arc(agent.x, agent.y, agent.r, 0, 2 * Math.PI, false);

    c2d.fill();
    c2d.lineWidth = 5;
    c2d.strokeStyle = '#003300';
    c2d.stroke();
    c2d.fillStyle = 'green';

    setTimeout(draw, 1);
  };
  draw();
}, false);
