const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PALYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


let enteredValue = prompt('Maximum life for you and the monster', '100');

console.log('enteredValue = '+ enteredValue);

let chosenMaxLife = parseInt(enteredValue);

let battleLog = [];

if(isNaN(chosenMaxLife) || chosenMaxLife === undefined || chosenMaxLife === null || chosenMaxLife<=0) {
  enteredValue = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if(currentPlayerHealth <=0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('You would have been dead but the bonus life saved you.');
  }

  if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You Won!!')
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'PLAYER_WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  }
  else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lost');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'MONSTER_WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  }
  else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert('You have a Draw');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'A DRAW',
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  }
}

function attackMonster(mode){
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if(mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // }
  // else if(mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry;

  if(ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntry = {
      event : ev ,
      value : val ,
      target : 'MONSTER' ,
      finalMonsterHealth : monsterHealth ,
      finalPlayerHealth : playerHealth
    };
  }
  else if(ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry = {
      event : ev ,
      value : val ,
      target : 'MONSTER' ,
      finalMonsterHealth : monsterHealth ,
      finalPlayerHealth : playerHealth
    };
  }
  else if(ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      event : ev ,
      value : val ,
      target : 'PLAYER' ,
      finalMonsterHealth : monsterHealth ,
      finalPlayerHealth : playerHealth
    };
  }
  else if(ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry = {
      event : ev ,
      value : val ,
      target : 'PLAYER' ,
      finalMonsterHealth : monsterHealth ,
      finalPlayerHealth : playerHealth
    };
  }
  else if(ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event : ev ,
      value : val ,
      finalMonsterHealth : monsterHealth ,
      finalPlayerHealth : playerHealth
    };
  }

  battleLog.push(logEntry);

}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function attackHandler() {
  
  attackMonster('ATTACK');
}

function strongAttackHandler(){
  
  attackMonster('STRONG_ATTACK');
}

function healPlayerHandler() {

  if(currentPlayerHealth === chosenMaxLife){
    alert('You are at max initial health.');
    return;
  }

  let healValue;
  if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  }
  else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;

  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );

  endRound();
}

function printLogHandler() {
  console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);