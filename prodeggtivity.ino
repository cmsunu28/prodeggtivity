/* 
prodEggtivity
by christine @ hackpretty

Make the servo tap the chicken button on Egg, Inc
when you're in a productive tab, and make it stop
when you're in an unproductive tab.

Hooks up to the prodeggtivity chrome extension.

Check out the video at [put a video link here, christine]
*/

// Servo
Servo tapper;
int servoPin=D0;

// Servo Variables
int servoState=0;
// 1: holding down the tapper but not tapping rapidly
// 2: tapping super rapidly
// 3: not tapping at all
int lastState=0;

int tapOnTime=500;
int tapOffTime=2000;

int servoUp=10;
int servoDown=30;

void setup() {
// Set up the functions
    Particle.function("tap",remoteTapSet);
    // Particle.function("set",remoteTapTimeSet);  // for calibrating tap speed
    tapper.attach(servoPin);
}

void loop() {
    if (servoState==1) {
        // only trigger when you first get to this state
        tapper.write(servoDown);
        delay(tapOnTime);
        tapper.write(servoUp);
        delay(tapOffTime);
    }
    else if (servoState==2) {
        if (lastState!=2) {
            // tap occasionally
            // hold down
            tapper.write(servoDown);
            delay(1000);
        }
    }
    else if (servoState==0)  {
        // only trigger when you first get to this state
        if (lastState!=0) {
            // no tapping or holding
            tapper.write(servoUp);
            delay(1000);
        }
    }
    lastState=servoState;
}

int remoteTapSet(String command) {
    //that one bit of code that makes Strings become Ints??
    char inputStr[64];
    command.toCharArray(inputStr,64);   // magic!
    
    // ok now assign that somewhere...
    servoState=atoi(inputStr);
    
    Serial.println(inputStr);
    Serial.println(servoState);
    return servoState;
}

int remoteTapTimeSet(String command) {
    //that one bit of code that makes Strings become Ints??
    char inputStr[64];
    command.toCharArray(inputStr,64);   // magic!
    
    // ok now assign that somewhere...
    tapOffTime=atoi(inputStr);
}