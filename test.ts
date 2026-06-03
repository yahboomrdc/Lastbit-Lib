
makerbit.onIrButton(IrButton.NUM9, IrButtonAction.Pressed, function () {
    basic.showNumber(9)
})
function stopCar () {
    MotionControl.motorStop()
    basic.showIcon(IconNames.Square)
}
// 启动/停止测试
makerbit.onIrButton(IrButton.NUM0, IrButtonAction.Pressed, function () {
    if (testActive) {
        stopAll()
        showTestName()
    } else {
        testActive = true
        showTestName()
    }
})
makerbit.onIrButton(IrButton.BEEP, IrButtonAction.Pressed, function () {
    stopCar()
    music.ringTone(1000)
    basic.pause(500)
    music.ringTone(0)
})
makerbit.onIrButton(IrButton.Light, IrButtonAction.Pressed, function () {
    LightsControl.allSetColor(255, 255, 255)
})
function turnLeft () {
    MotionControl.motorSet(0 - MOTOR_SLOW, MOTOR_SLOW)
    basic.showArrow(ArrowNames.East)
}
function testIRControlTick () {
    if (irPressedKey != -1) {
        basic.showNumber(irPressedKey)
        log("IR_KEY", irPressedKey)
        irPressedKey = -1
    }
}
function goBackward () {
    MotionControl.motorSet(0 - currentSpeed, 0 - currentSpeed)
    basic.showArrow(ArrowNames.North)
}
makerbit.onIrButton(IrButton.NUM1, IrButtonAction.Pressed, function () {
    basic.showNumber(1)
})
function goForward () {
    MotionControl.motorSet(currentSpeed, currentSpeed)
    basic.showArrow(ArrowNames.South)
}
function testBuzzerTick () {
    buzzerOn ? music.ringTone(0) : music.ringTone(1000);
led.toggle(0, 2)
    buzzerOn = !(buzzerOn)
}
function testAIVoiceTick () {
    if (ai_status == 0) {
        pins.i2cWriteNumber(
        AI_MODULE_ADDR,
        (0x04 << 8) | aiCmd,
        NumberFormat.UInt16BE,
        false
        )
        ai_status = 1
    }
    ai_result_last = Sensors.AIReadResult()
    if (ai_result_last != 255) {
        log("AI_RESULT", ai_result_last)
    }
}
function testBatteryTick () {
    log("BAT", Sensors.readBattery())
}
function testTemperatureTick () {
    log("TEMP", Sensors.readTemperature())
}
input.onButtonPressed(Button.A, function () {
    let buttonADownTime = 0
    pressDuration = input.runningTime() - buttonADownTime
    if (pressDuration < 300) {
        return;
    }
    stopAll()
    currentTest = (currentTest + 1) % TEST_COUNT
    showTestName()
})
makerbit.onIrButton(IrButton.NUM3, IrButtonAction.Pressed, function () {
    basic.showNumber(3)
})
function testMotorTick () {
    MotionControl.motorSet(50 * motorDir, 50 * motorDir)
    led.toggle(2, 2)
    motornum += 1
    if (motornum >= 20) {
        motornum = 0
        motorDir *= -1;
    }
}
function log (tag: string, value: number) {
    serial.writeLine("" + tag + ":" + value)
}
makerbit.onIrButton(IrButton.Power, IrButtonAction.Pressed, function () {
    basic.showIcon(IconNames.Happy)
    stopCar()
    LightsControl.allOff()
})
function testUltrasonicTick () {
    log("DIST", Math.round(Sensors.measureDistanceMM()))
}
function testLightsBasicTick () {
    c = [[255, 0, 0], [0, 255, 0], [0, 0, 255]]
    LightsControl.ws2812SetAll(c[lightIdx][0], c[lightIdx][1], c[lightIdx][2])
    lightIdx = (lightIdx + 1) % c.length
}
// +下一个测试
makerbit.onIrButton(IrButton.Plus, IrButtonAction.Pressed, function () {
    stopAll()
    currentTest = (currentTest + 1) % TEST_COUNT
    showTestName()
})
function testLightsEffectsTick () {
    LightsControl.allRainbowCycle(20)
}
makerbit.onIrButton(IrButton.NUM7, IrButtonAction.Pressed, function () {
    basic.showNumber(7)
})
makerbit.onIrButton(IrButton.NUM2, IrButtonAction.Pressed, function () {
    basic.showNumber(2)
})
makerbit.onIrButton(IrButton.NUM8, IrButtonAction.Pressed, function () {
    basic.showNumber(8)
})
makerbit.onIrButton(IrButton.Right, IrButtonAction.Pressed, function () {
    turnRight()
})
function turnRight () {
    MotionControl.motorSet(MOTOR_SLOW, 0 - MOTOR_SLOW)
    basic.showArrow(ArrowNames.West)
}
makerbit.onIrButton(IrButton.NUM6, IrButtonAction.Pressed, function () {
    basic.showNumber(6)
})
makerbit.onIrButton(IrButton.TRight, IrButtonAction.Pressed, function () {
    MotionControl.motorSet(MOTOR_SPEED, MOTOR_SLOW)
    basic.showString("TR")
})
// 停止所有测试项目
function stopAll () {
    testActive = false
    MotionControl.motorStop()
    music.ringTone(0)
    LightsControl.allOff()
    basic.clearScreen()
}
input.onButtonPressed(Button.B, function () {
    if (input.runningTime() - lastPressB < 300) {
        return;
    }
    lastPressB = input.runningTime()
    if (testActive) {
        testActive = false
        stopAll()
        showTestName()
    } else {
        testActive = true
        showTestName()
    }
})
makerbit.onIrButton(IrButton.NUM5, IrButtonAction.Pressed, function () {
    basic.showNumber(5)
})
function testServoTick () {
    MotionControl.servoSetAllAngle(servoAngle)
    servoAngle += 10 * servoDir
    if (servoAngle >= 180 || servoAngle <= 0) {
        servoDir *= -1;
    }
}
makerbit.onIrButton(IrButton.NUM4, IrButtonAction.Pressed, function () {
    basic.showNumber(4)
})
makerbit.onIrButton(IrButton.Left, IrButtonAction.Pressed, function () {
    turnLeft()
})
// −上一个测试
makerbit.onIrButton(IrButton.Minus, IrButtonAction.Pressed, function () {
    stopAll()
    currentTest = (currentTest - 1 + TEST_COUNT) % TEST_COUNT
    showTestName()
})
function testTrackTick () {
    t = Sensors.readTrack()
    basic.clearScreen()
    for (let i = 0; i <= 3; i++) {
        if (t[i]) {
            led.plot(i, 3)
        }
    }
}
function testLightSensorTick () {
    l = Sensors.readLight()
    log("LIGHT_LEFT", l[0])
    log("LIGHT_RIGHT", l[1])
}
makerbit.onIrButton(IrButton.Up, IrButtonAction.Pressed, function () {
    goForward()
})
makerbit.onIrButton(IrButton.TLeft, IrButtonAction.Pressed, function () {
    MotionControl.motorSet(MOTOR_SLOW, MOTOR_SPEED)
    basic.showString("TL")
})
function showTestName () {
    basic.clearScreen()
    config = tests[currentTest]
    if (config) {
        basic.showString("" + (config.name))
    }
}
makerbit.onIrButton(IrButton.Down, IrButtonAction.Pressed, function () {
    goBackward()
})
function testSoundTick () {
    log("SOUND", Sensors.soundDetect(500, 10)[2])
}
let l: number[] = []
let t: number[] = []
let servoAngle = 0
let lastPressB = 0
let lightIdx = 0
let c: number[][] = []
let motornum = 0
let pressDuration = 0
let ai_result_last = 0
let ai_status = 0
let currentSpeed = 0
let MOTOR_SLOW = 0
let MOTOR_SPEED = 0
let irPressedKey = 0
let TEST_COUNT = 0
let NUM_CUR = 0
let testActive = false
let lastPressA = 0
let buzzerOn = false
let motorDir = 0
let servoDir = 0
let config :any=null
TEST_COUNT = 13
enum TestItem {
    Motor = 0,
    Servo,
    Buzzer,
    LightSensor,
    Battery,
    TrackSensor,
    Temperature,
    SoundDetect,
    Ultrasonic,
    AIVoice,
    LightsBasic,
    LightsEffects,
    IRControl
}
interface TestConfig {
    name: string;
    tick: () => void;
}
const tests: { [key: number]: TestConfig } = {
    [TestItem.Motor]: { name: "MOTOR", tick: testMotorTick },
    [TestItem.Servo]: { name: "SERVO", tick: testServoTick },
    [TestItem.Buzzer]: { name: "BUZZ", tick: testBuzzerTick },
    [TestItem.LightSensor]: { name: "LIGHT", tick: testLightSensorTick },
    [TestItem.Battery]: { name: "BAT", tick: testBatteryTick },
    [TestItem.TrackSensor]: { name: "TRACK", tick: testTrackTick },
    [TestItem.Temperature]: { name: "TEMP", tick: testTemperatureTick },
    [TestItem.SoundDetect]: { name: "SOUND", tick: testSoundTick },
    [TestItem.Ultrasonic]: { name: "ULTRA", tick: testUltrasonicTick },
    [TestItem.AIVoice]: { name: "AI", tick: testAIVoiceTick },
    [TestItem.LightsBasic]: { name: "LED", tick: testLightsBasicTick },
    [TestItem.LightsEffects]: { name: "EFFECTS", tick: testLightsEffectsTick },
    [TestItem.IRControl]: { name: "IR", tick: testIRControlTick }
};
let currentTest = TestItem.Motor;
irPressedKey = -1
motorDir = 1
servoDir = 1
let aiCmd = 1
// 串口配置到USB
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
MOTOR_SPEED = 200
MOTOR_SLOW = 80
currentSpeed = MOTOR_SPEED
makerbit.connectIrReceiver(DigitalPin.P8)
MotionControl.servoSetAllAngle(90)
basic.pause(200)
basic.showIcon(IconNames.Yes)
showTestName()
forever(() => {
    if (!testActive) return;

    const config2 = tests[currentTest];
    if (config2) {
        config2.tick();
    }

    basic.pause(50);
});
