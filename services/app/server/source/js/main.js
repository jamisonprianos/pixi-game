var _resources;
var _stage;

function getFramesFromSpriteSheet(texture, frameWidth, frameHeight, row) {
  row = row || 0;
  var frames = [];
  for(var i = 0; i < texture.width-frameWidth; i+=frameWidth) {
    frames.push(new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(i, row * frameHeight, frameWidth, frameHeight)));
  }
  return frames;
}

function Character(name, spriteSheet) {
  PIXI.extras.MovieClip.call(this, getFramesFromSpriteSheet(_resources.character.texture, 70, 70, 0));
  this.animationId = 0;
  return this;
};

Character.prototype = Object.create( PIXI.extras.MovieClip.prototype );
Character.prototype.constructor = Character;

Character.prototype.setAnimation = function (id) {
  if (this.animationId !== id) {
    console.log('Changing animation to ' + id);
    this.animationId = id;
    this.textures = getFramesFromSpriteSheet(_resources.character.texture, 70, 70, id);
    this.gotoAndPlay(0);
  }
}

// Character.prototype.setAnimation = function (row) {
//   var self = this;
//   self.animation = new PIXI.extras.MovieClip(getFramesFromSpriteSheet(_resources[self.name].texture, 70, 70, row))
//   console.log(self.animation);
//   self.animation.anchor = this.anchor;
//   self.animation.animationSpeed = this.animationSpeed;
//   self.animation.position = this.position;
//   self.animation.gotoAndPlay(0);
//   _stage.addChild(self.animation);
// };

// Character.prototype.play = function () {
//   this.animation.play();
// }

// Character.prototype.stop = function () {
//   this.animation.stop();
// }


$(function () {

  var character;
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

  var lastTimestamp = performance.now();

  var renderer = new PIXI.autoDetectRenderer(800, 600, {
    view: document.getElementById('game')
  });
  document.body.appendChild(renderer.view);
  _stage = new PIXI.Container();

  //character = new Character('character', 'images/character.png');

  PIXI.loader.add('character', 'images/character.png').load(function (loader, resources) {
    _resources = resources;
    character = new PIXI.AnimatedSprite({
      walkDown: getFramesFromSpriteSheet(_resources.character.texture, 70, 70, 0),
      walkLeft: getFramesFromSpriteSheet(_resources.character.texture, 70, 70, 1),
      walkRight: getFramesFromSpriteSheet(_resources.character.texture, 70, 70, 2),
      walkUp: getFramesFromSpriteSheet(_resources.character.texture, 70, 70, 3),
      walkDownLeft: getFramesFromSpriteSheet(_resources.character.texture, 70, 70, 4),
      walkUpLeft: getFramesFromSpriteSheet(_resources.character.texture, 70, 70, 5),
      walkDownRight: getFramesFromSpriteSheet(_resources.character.texture, 70, 70, 6),
      walkUpRight: getFramesFromSpriteSheet(_resources.character.texture, 70, 70, 7)
    }, 8, 'walkRight');
    character.loop = true;
    character.play();
    character.anchor = { x: 0.5, y: 0.8 };
    character.animationSpeed = 0.1;
    character.gotoAndPlay(0);
    character.position = { x: 400, y: 300 };
    _stage.addChild(character);
    animate();
  });

  var backTexture = PIXI.Texture.fromImage('images/grass.png');
  var back = new PIXI.TilingSprite(backTexture, 1300, 694);
  back.position = { x: 0, y: 0 };
  back.tilePosition = { x: 0, y: 0 };
  _stage.addChild(back);

  function animate(timestamp) {

    var delta = timestamp - lastTimestamp;
    var fps = (1000 / delta).toFixed(1) + ' FPS';
    $('#fps').text(fps);
    lastTimestamp = timestamp;

    requestAnimationFrame(animate);

    if (keys.left) {
      angle -= delta / 200;
    }
    if (keys.right) {
      angle += delta / 200;
    }
    angle = angle % (2 * Math.PI);
    //$('.player').css('-webkit-transform', 'rotate(' + (angle * 180 / Math.PI) + 'deg)');
    $('#angle').text(angle.toFixed(1));
    // if (keys.action1) {
    //   chargeTime += delta;
    // } else {
    //   chargeTime = 0;
    // }
    // if (chargeTime > chargeMax * 1000) { chargeTime = chargeMax * 1000; }
    // $('#chargeFill').css('width', (chargeTime / 10 / chargeMax) + '%');
    if (angle < Math.PI / 4.0) { // || angle >= Math.PI * 7.0 / 4.0) {
      character.currentSequence = 'walkRight';
    } else {
      character.currentSequence = 'walkDown';
    }
    if (!(keys.up && keys.down)) {
      if (keys.up) {
        character.play();
        character.position.y += (delta * Math.sin(angle) / 7);
        character.position.x += (delta * Math.cos(angle) / 7);
      } else if (keys.down) {
        character.play();
        character.position.y -= (delta * Math.sin(angle) / 9);
        character.position.x -= (delta * Math.cos(angle) / 9);
      } else {
        character.stop();
      }
    } else {
      character.stop();
    }
    character.advanceTime(delta);

    renderer.render(_stage);
  }

  //animate();



});