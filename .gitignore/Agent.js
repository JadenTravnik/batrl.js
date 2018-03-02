function Agent(numStates){
  function newFilledArray(len, val){
    var rv = new Array(len);
    while (--len >= 0) {
        rv[len] = val;
    }
    return rv; 
  }

  return {
    x: 50,
    y: Math.round(canvas.height*Math.random()),
    r: 10,
    jump: 5,
    gamma: 0.99, 
    alpha: 0.01,
    lambda: 0.1,
    lastAction: 0,
    epsilon: 0.05,
    currentState: 10,
    actions: ['up', 'down', 'stay'],
    numStates: numStates,
    Q: [newFilledArray(numStates,0), newFilledArray(numStates,0), newFilledArray(numStates,0)], // first is up
    E: [newFilledArray(numStates,0), newFilledArray(numStates,0), newFilledArray(numStates,0)],
    threshold: 25,
    up: function(top){
      this.y -= this.jump;
      this.lastAction = 0;
    },
    down: function(bot){
      this.y += this.jump;
      this.lastAction = 1;
    },
    updateTable: function(){
      var uText = '', dText = '', sText = '';
      for (i = 0; i < this.numStates; i++){
        uText += '<span>' + Math.ceil(this.Q[0][i]*100)/100  + ', ' + Math.ceil(this.E[0][i]*100)/100 + '</span>';
	      dText += '<span>' +Math.ceil(this.Q[1][i]*100)/100  + ', ' + Math.ceil(this.E[1][i]*100)/100 + '</span>';
        sText += '<span>' +Math.ceil(this.Q[2][i]*100)/100  + ', ' + Math.ceil(this.E[2][i]*100)/100 + '</span>';
      }
      $('#upTable').html(uText);
      $('#downTable').html(dText);
      $('#stayTable').html(sText);
      $('.actionTableValues').removeClass('activeAction').removeClass('activeState);')
      
      var activeTable = $('#' + this.actions[this.lastAction] + 'Table');
      activeTable.addClass('activeAction');
      activeTable.find(':nth-child(' + (this.currentState + 1) + ')').addClass('activeState');

     $('#agentY').html('<span>' + Math.round(this.y) + '</span>');
     $('#state').html('<span>' + this.currentState + '</span>');
    },
    reward: function(r, s){

      var aStar = this.chooseAction();

      var delta = r + this.gamma*this.Q[aStar][s] - this.Q[this.lastAction][this.currentState];

      this.E[this.lastAction][this.currentState] = this.E[this.lastAction][this.currentState] + 1;


      for (var i = 0; i < 3; i++){
        for (var j = 0; j < this.numStates; j++){
          this.Q[i][j] = this.Q[i][j] + this.alpha*delta*this.E[i][j];
          this.E[i][j] = this.gamma*this.lambda*this.E[i][j]
        }
      }

      this.currentState = s;
      this.updateTable();
    },
    stay: function(){
      this.lastAction = 2;
    },
    chooseAction: function(){
      arr = [this.Q[0][this.currentState], this.Q[1][this.currentState], this.Q[2][this.currentState]];
      var maxNum = arr[0], maxIndex = 0;
      if (Math.random() > this.epsilon){
        for (var i = 1; i < arr.length; i++) {
          if (arr[i] > maxNum) {
            maxIndex = i;
            maxNum = arr[i];
          }
          else if (arr[i] == maxNum && Math.random() > 0.5){
            maxIndex = i;
            maxNum = arr[i];
          }
        }
      } else {
        maxIndex = Math.round(Math.random()*2);
      }
      return maxIndex;
    },
    act: function(){
      var action = this.chooseAction();
      var ch = ['up', 'down', 'stay'];
      $('#currentDirection').text(ch[action]);
      this[ch[action]]();
    }
  };  
}
