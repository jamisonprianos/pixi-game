/*
var player;
var lastTimestamp;
var angle = 0;
var keyMap = {
  87: 'up',
  65: 'left',
  68: 'right',
  83: 'down',
  49: 'action1'
}
chargeMax = 2;
chargeTime = 0;
var keys = {};
Object.keys(keyMap).forEach(function (kmk) {
  keys[keyMap[kmk]] = false;
});

$(function () {
  player = $('<i></i>').addClass('fa fa-arrow-circle-right fa-2x player');
  player.appendTo($('body'));

  $('body').on('keydown', function (e) {
    console.log(e.keyCode);
    var key = keyMap[e.keyCode];
    if (key && !keys[key]) {
      console.log('Pressed ' + key);
      keys[key] = true;
    }
  });

  $('body').on('keyup', function (e) {
    var key = keyMap[e.keyCode];
    if (key && keys[key]) {
      console.log('Released ' + key);
      keys[key] = false;
    }
  });

  lastTimestamp = performance.now();

  var step = function (timestamp) {
    var delta = timestamp - lastTimestamp;
    var fps = (1000 / delta).toFixed(1) + ' FPS';
    $('#fps').text(fps);
    lastTimestamp = timestamp;
    if (keys.left) {
      angle -= delta / 200;
    }
    if (keys.right) {
      angle += delta / 200;
    }
    angle = angle % (2 * Math.PI);
    $('.player').css('-webkit-transform', 'rotate(' + (angle * 180 / Math.PI) + 'deg)');
    $('#angle').text(angle.toFixed(1));
    if (keys.action1) {
      chargeTime += delta;
    } else {
      chargeTime = 0;
    }
    if (chargeTime > chargeMax * 1000) { chargeTime = chargeMax * 1000; }
    $('#chargeFill').css('width', (chargeTime / 10 / chargeMax) + '%');
    if (!(keys.up && keys.down)) {
      if (keys.up) {
        $('.player').css('top', '+=' + (delta * Math.sin(angle) / 7) + 'px')
        $('.player').css('left', '+=' + (delta * Math.cos(angle) / 7) + 'px')
      }
      if (keys.down) {
        $('.player').css('top', '-=' + (delta * Math.sin(angle) / 9) + 'px')
        $('.player').css('left', '-=' + (delta * Math.cos(angle) / 9) + 'px')
      }
    }
    window.requestAnimationFrame(step);
  };

  window.requestAnimationFrame(step);

});
*/

$(function () {
  var renderer = new PIXI.autoDetectRenderer(800, 600, {
    view: document.getElementById('game')
  });
  document.body.appendChild(renderer.view);
  var stage = new PIXI.Container();

  var backTexture = PIXI.Texture.fromImage('images/background-forest.jpg');
  var back = new PIXI.TilingSprite(backTexture, 1300, 694);
  back.position = { x: 0, y: 0 };
  back.tilePosition = { x: 0, y: 0 };
  stage.addChild(back);

  function animate() {
    requestAnimationFrame(animate);
    back.tilePosition.x -= .25;
    renderer.render(stage);
  }

  animate();
});