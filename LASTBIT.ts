const I2C_ADDR = 0x10;

const REG_SERVO_S4 = 0x02;
const REG_SERVO_S1 = 0x03;
const REG_SERVO_S2 = 0x04;
const REG_SERVO_S3 = 0x05;

const SERVO_PERIOD_MS = 20;
const SERVO_MIN_US = 500;
const SERVO_MAX_US = 2500;

const AI_MODULE_ADDR = 0x2B;
const AI_FUNC_REG = 0x04;
const AI_REC_REG = 0x64;

//% blockId="AIVoice" weight=1 icon="\uf130" block="AI Voice" color=#553377
namespace AIVoice {
     export enum FunctionMode{
         //% block="IncreaseVolume"
         IncreaseVolume = 4,
         //% block="DecreaseVolume"
         DecreaseVolume = 5,
         //% block="MaxVolume"
         MaxVolume = 6,
         //% block="MediumVolume"
         MediumVolume = 7,
         //% block="MinVolume"
         MinVolume = 8,
         //% block="StartAnnouncement"
         StartAnnouncement = 9,
         //% block="StopAnnouncement"
         StopAnnouncement = 10,
     }


    export enum AsrCommand { 
        //% block="Stop"
        Stop = 1,
        //% block="CarStop"
        CarStop = 2,
        //% block="CarForward"
        CarForward = 4,
        //% block="CarBackward"
        CarBackward = 5,
        //% block="CarTurnLeft"
        CarTurnLeft = 6,
        //% block="CarTurnRight"
        CarTurnRight = 7, 
        //% block="CarSpinLeft"
        CarSpinLeft = 8,
        //% block="CarSpinRight"
        CarSpinRight = 9,
        //% block="OffLights"
        OffLights = 10,
        //% block="RedLights"
        RedLights = 11,
        //% block="GreenLights"
        GreenLights = 12,
        //% block="BlueLights"
        BlueLights = 13,
        //% block="YellowLights"
        YellowLights = 14,
        //% block="RinwaterLights"
        RinwaterLights = 15,  
        //% block="RainbowCycleLights"
        RainbowCycleLights = 16,
        //% block="BreathLights"
        BreathLights = 17,
        //% block="ShowBattery"
        ShowBattery = 18,
        //% block="FollowMode"
        FollowMode = 27,
        //% block="FollowCancle"
        FollowCancle = 28,
        //% block="Alarm"
        Alarm = 38,
        //% block="JointUp"
        JointUp = 39,
        //% block="JointDown"
        JointDown = 40,
        //% block="JointLeft"
        JointLeft = 41, 
        //% block="JointRight"
        JointRight = 42,
        //% block="JointClamp"
        JointClamp = 43,
        //% block="JointRelease"
        JointRelease = 44,
        //% block="Applause"
        Applause = 45,
        //% block="Dance"
        Dance = 52,
        //% block="PickBlock"
        PickBlock = 53,
        //% block="MoveBlock"
        MoveBlock = 54,
        //% block="InitPose"
        InitPose = 49
    }

    //% blockId="AIVoice.isAsrCommand" block="Is voice module recognition result %num %cmd" 
    export function isAsrCommand(num: number,cmd: AsrCommand): boolean {
        pins.i2cWriteNumber(AI_MODULE_ADDR, AI_REC_REG, NumberFormat.UInt8LE, true);
        if (num == cmd) {
            return true;
        }
        return false;
    }
    //% blockId="AIVoice.readResultnum" weight=80 block="AI voice module read result number"
    export function readResultnum(): number {
        pins.i2cWriteNumber(AI_MODULE_ADDR, AI_REC_REG, NumberFormat.UInt8LE, true);
        let result = pins.i2cReadNumber(AI_MODULE_ADDR, NumberFormat.UInt8LE, false);
        return result;
    }
    //% blockId="AIVoice.PlayWelcome" weight=100 block="Play welcome"
    export function PlayWelcome(): void {
        pins.i2cWriteNumber(AI_MODULE_ADDR, (AI_FUNC_REG << 8) | (1 & 0xFF), NumberFormat.UInt16BE, false);
        basic.pause(2000);
    }
    
    //% blockId="AIVoice.setFunction" weight=90 block="AI voice module function set %function" 
    export function setFunction(func: FunctionMode): void {
        pins.i2cWriteNumber(AI_MODULE_ADDR, (AI_FUNC_REG << 8) | (func & 0xFF), NumberFormat.UInt16BE, false);
        basic.pause(2000);
    }
}   

function writeReg(reg: number, value: number): void {
    pins.i2cWriteNumber(I2C_ADDR, reg << 8 | (value & 0xFF), NumberFormat.UInt16BE);
}

// function writeRegs(reg: number, values: number[]): void {
//     let buf = pins.createBuffer(values.length + 1);
//     buf.setNumber(NumberFormat.UInt8LE, 0, reg);
//     for (let i = 0; i < values.length; i++) {
//         buf.setNumber(NumberFormat.UInt8LE, i + 1, values[i] & 0xFF);
//     }
//     pins.i2cWriteBuffer(I2C_ADDR, buf);
// }
function writeRegs(reg: number, values: number[]) {
    let buf = pins.createBuffer(values.length + 1)
    buf[0] = reg
    for (let i = 0; i < values.length; i++) {
        buf[i + 1] = values[i] & 0xFF
    }
    pins.i2cWriteBuffer(I2C_ADDR, buf)
}

function readReg(reg: number): number {
    pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8LE, true);
    return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt8LE, false);
}

function readRegs(reg: number, count: number): Buffer {
    pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8LE, true);
    return pins.i2cReadBuffer(I2C_ADDR, count, false);
}

function wheel(pos: number): number[] {
    if (pos < 85) {
        return [pos * 3, 255 - pos * 3, 0];
    } else if (pos < 170) {
        pos -= 85;
        return [255 - pos * 3, 0, pos * 3];
    } else {
        pos -= 170;
        return [0, pos * 3, 255 - pos * 3];
    }
}

//% weight=3 color=#000080 icon="\uf013" block="MotionControl"
namespace MotionControl {
    export interface Color {
        r: number;
        g: number;
        b: number;
    }

    export enum ServoChannel {
        S1,
        S2,
        S3,
        S4,
        P1,
        P12
    }

    export enum Direction {
        //% block="Forward"
        Forward,
        //% block="Backward"
        Backward,
        //% block="Left"
        Left,
        //% block="Right"
        Right,
        //% block="SpinLeft"
        SpinLeft,
        //% block="SpinRight"
        SpinRight
    }

    function clampSpeed(speed: number): number {
        if (speed < 0) speed = 0;
        if (speed > 255) speed = 255;
        return speed;
    }

    //% blockId="MotionControl.motorSet" weight=100 block="Set motor speed Left: %left Right: %right"
    //% left.min=-255 left.max=255
    //% right.min=-255 right.max=255
    //% group="MotorControl"
    export function motorSet(left: number, right: number): void {
        let l = left & 0xFFFF;
        let r = right & 0xFFFF;
        writeRegs(0x16, [l & 0xFF, (l >> 8) & 0xFF, r & 0xFF, (r >> 8) & 0xFF]);
    }

    //% blockId="MotionControl.motorStop" weight=100 block="Stop motor"
    //% group="MotorControl"
    export function motorStop(): void {
        motorSet(0, 0);
    }

    //% blockId="MotionControl.motorMove" weight=95 block="Move %direction at speed %speed for %delay ms"
    //% speed.min=0 speed.max=255
    //% delay.min=0 delay.max=5000
    //% group="MotorControl"
    export function motorMove(direction: Direction, speed: number,delay:number): void {
        switch (direction) {
            case Direction.Forward:
                motorSet(speed, speed);
                basic.pause(delay);
                break;
            case Direction.Backward:
                motorSet(-speed, -speed);
                basic.pause(delay);
                break;
            case Direction.Left:
                motorSet(0, speed);
                basic.pause(delay);
                break;
            case Direction.Right:
                motorSet(speed, 0);
                basic.pause(delay);
                break;
            case Direction.SpinLeft:
                motorSet(-speed, speed);
                basic.pause(delay);
                break;
            case Direction.SpinRight:
                motorSet(speed, -speed);
                basic.pause(delay);
                break;
        }
    }

    //% blockId="MotionControl.motorForward" block="Move forward at speed %speed for %delay ms"
    //% speed.min=0 speed.max=255
    //% group="MotorControl"
    export function motorForward(speed: number,delay:number): void {
        motorSet(clampSpeed(speed), clampSpeed(speed));
        basic.pause(delay);
    }

    //% blockId="MotionControl.motorBackward" block="Move backward at speed %speed for %delay ms"
    //% speed.min=0 speed.max=255
    //% delay.min=0 delay.max=5000
    //% group="MotorControl"
    export function motorBackward(speed: number,delay:number): void {
        let s = clampSpeed(speed);
        motorSet(-s, -s);
        basic.pause(delay);
    }

    //% blockId="MotionControl.motorTurnLeft" block="Turn left at speed %speed for %delay ms"
    //% speed.min=0 speed.max=255
    //% delay.min=0 delay.max=5000
    //% group="MotorControl"
    export function motorTurnLeft(speed: number,delay:number): void {
        motorSet(0, clampSpeed(speed));
        basic.pause(delay);
    }

    //% blockId="MotionControl.motorTurnRight" block="Turn right at speed %speed for %delay ms"
    //% speed.min=0 speed.max=255
    //% delay.min=0 delay.max=5000
    //% group="MotorControl"
    export function motorTurnRight(speed: number,delay:number): void {
        motorSet(clampSpeed(speed), 0);
        basic.pause(delay);
    }

    //% blockId="MotionControl.motorSpinLeft" block="Spin left at speed %speed for %delay ms"
    //% speed.min=0 speed.max=255
    //% delay.min=0 delay.max=5000
    //% group="MotorControl"
    export function motorSpinLeft(speed: number,delay:number): void {
        let s = clampSpeed(speed);
        motorSet(-s, s);
        basic.pause(delay);
    }

    //% blockId="MotionControl.motorSpinRight" block="Spin right at speed %speed for %delay ms"
    //% speed.min=0 speed.max=255
    //% delay.min=0 delay.max=5000
    //% group="MotorControl"
    export function motorSpinRight(speed: number,delay:number): void {
        let s = clampSpeed(speed);
        motorSet(s, -s);
        basic.pause(delay);
    }

    // //% blockId="MotionControl.buzzerOn" block="Turn on buzzer"
    // export function buzzerOn(): void {
    //     music.ringTone(1000); 
    // }

    // //% blockId="MotionControl.buzzerOff" block="Turn off buzzer"
    // export function buzzerOff(): void {
        
    //     music.ringTone(0); 
    // }

    //% blockId="MotionControl.servoSetAngle" block="Set servo angle Channel: %channel Angle: %angle"
    //% angle.min=0 angle.max=180
    //% group="ServoControl"
    export function servoSetAngle(channel: ServoChannel, angle: number): void {
        if (angle < 0) angle = 0;
        if (angle > 180) angle = 180;
        //占空比=脉冲宽度/周期宽度
        //脉冲宽度=最小脉冲宽度+(最大脉冲宽度-最小脉冲宽度)*角度/180
        if (channel === ServoChannel.P1 || channel === ServoChannel.P12) {
            let pin = channel === ServoChannel.P1 ? DigitalPin.P1 : DigitalPin.P12;
            // let pulse = SERVO_MIN_US + ((SERVO_MAX_US - SERVO_MIN_US) * angle) / 180;
            // let duty = (pulse * 1023) / (SERVO_PERIOD_MS * 1000);
            // if (duty < 0) duty = 0;
            // if (duty > 1023) duty = 1023;
            pins.servoWritePin(pin, angle);
        } else {
            let reg = 0;
            switch (channel) {
                case ServoChannel.S1: reg = REG_SERVO_S1; break;
                case ServoChannel.S2: reg = REG_SERVO_S2; break;
                case ServoChannel.S3: reg = REG_SERVO_S3; break;
                case ServoChannel.S4: reg = REG_SERVO_S4; break;
            }
            if (reg !== 0) {
                writeReg(reg, angle);
            }
        }
    }

    //% blockId="MotionControl.servoSetAllAngle" block="Set all servo angles Angle: %angle"
    //% angle.min=0 angle.max=180
    //% group="ServoControl"
        export function servoSetAllAngle(angle: number): void {
        writeRegs(0x02, [angle, angle, angle, angle]);
        servoSetAngle(ServoChannel.P1, angle);
        servoSetAngle(ServoChannel.P12, angle);
    }
    // export function servoSetAllAngle(angle: number): void {
    //     servoSetAngle(ServoChannel.S1, angle);
    //     servoSetAngle(ServoChannel.S2, angle);
    //     servoSetAngle(ServoChannel.S3, angle);
    //     servoSetAngle(ServoChannel.S4, angle);
    //     servoSetAngle(ServoChannel.P1, angle);
    //     servoSetAngle(ServoChannel.P12, angle);
    // }
}

//% weight=2 color=#FF8C00 icon="\uf0eb" block="LightsControl"
namespace LightsControl {
    export interface Color {
        r: number;
        g: number;
        b: number;
    }

    export enum Colors {
        //% block="Red"
        Red,
        //% block="Orange"
        Orange,
        //% block="Yellow"
        Yellow,
        //% block="Green"
        Green,
        //% block="Blue"
        Blue,
        //% block="Cyan"
        Cyan,
        //% block="Purple"
        Purple,
        //% block="White"
        White,
        //% block="Black"
        Black
    }
    export enum HeadlightChannel {
        //% block="Left"
        Left,
        //% block="Right"
        Right
    }
    function colorEnumToRGB(color: Colors): Color {
        switch (color) {
            case Colors.Red: return { r: 255, g: 0, b: 0 };
            case Colors.Orange: return { r: 255, g: 128, b: 0 };
            case Colors.Yellow: return { r: 255, g: 255, b: 0 };
            case Colors.Green: return { r: 0, g: 255, b: 0 };
            case Colors.Blue: return { r: 0, g: 0, b: 255 };
            case Colors.Cyan: return { r: 0, g: 255, b: 255 };
            case Colors.Purple: return { r: 255, g: 0, b: 255 };
            case Colors.White: return { r: 255, g: 255, b: 255 };
            default: return { r: 0, g: 0, b: 0 };
        }
    }

    function _ws2812SetAll(r: number, g: number, b: number): void {
        writeRegs(0x0A, [r, g, b]);
    }

    function _headlightSet(lr: number, lg: number, lb: number, rr: number, rg: number, rb: number): void {
        writeRegs(0x10, [lr, lg, lb, rr, rg, rb]);
    }

     function _ws2812SetPixel(index: number, r: number, g: number, b: number): void {
        writeRegs(0x1A, [index, r, g, b]);
    }

    //% blockId="LightsControl.ws2812Off" block="Turn off rgb lights"
    //% group="RGBLights"
    export function ws2812Off(): void {
        _ws2812SetAll(0, 0, 0);
        for (let i = 0; i < 4; i++) {
            _ws2812SetPixel(i, 0, 0, 0);
        }
    }

    //% blockId="LightsControl.ws2812SetAll" block="Set rgb lights color R: %r G: %g B: %b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% group="RGBLights"
    export function ws2812SetAll(r: number, g: number, b: number): void {
        writeRegs(0x1A, [0, r, g, b]);
        writeRegs(0x1A, [1, r, g, b]);
        writeRegs(0x1A, [2, r, g, b]);
        writeRegs(0x1A, [3, r, g, b]);
    }


    //% blockId="LightsControl.ws2812SetPixelColor" block="Set single rgb light color Index: %index Color: %color"
    //% index.min=0 index.max=3
    //% group="RGBLights"
    export function ws2812SetPixelColor(index: number, color: Colors): void {
        if (index < 0 || index > 3) {
            return;
        }
        let rgb = colorEnumToRGB(color);
        _ws2812SetPixel(index, rgb.r, rgb.g, rgb.b);
    }
    //% blockId="LightsControl.ws2812SetPixel" block="Set single rgb light color Index: %index R: %r G: %g B: %b"
    //% index.min=0 index.max=3
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% group="RGBLights"
    export function ws2812SetPixel(index: number, r: number, g: number, b: number): void {
        if (index < 0 || index > 3) {
            return;
        }
        _ws2812SetPixel(index, r, g, b);
    }

    //% blockId="LightsControl.ws2812Breath" block="rgb lights breath R: %r G: %g B: %b Period(ms): %period"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% period.min=1000 period.max=5000
    //% advanced=true
    //% group="RGBLights"
    export function ws2812Breath(r: number, g: number, b: number, period: number = 1000): void {
        let steps = 50;
        let stepTime = period / steps;

        for (let i = 0; i < steps; i++) {
            let brightness = Math.sin(i * Math.PI / steps) * 255;
            let cr = Math.round((r * brightness) / 255);
            let cg = Math.round((g * brightness) / 255);
            let cb = Math.round((b * brightness) / 255);
            _ws2812SetAll(cr, cg, cb);
            basic.pause(stepTime);
        }
        ws2812Off();
    }

    //% blockId="LightsControl.ws2812RunningWater" block="rgb lights running water R: %r G: %g B: %b Interval(ms): %interval"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% interval.min=100 interval.max=5000
    //% advanced=true
    //% group="RGBLights"
    export function ws2812RunningWater(r: number, g: number, b: number, interval: number = 1000): void {
        ws2812Off();
        let stepTime = interval/4;
        for (let i = 0; i < 4; i++) {
            _ws2812SetPixel(i, r, g, b);
            basic.pause(stepTime);
            _ws2812SetPixel(i, 0, 0, 0);
        }
    }

    //% blockId="LightsControl.ws2812RainbowCycle" block="rgb lights rainbow cycle Delay(ms): %delay"
    //% delay.min=1000 delay.max=5000
    //% advanced=true
    //% group="RGBLights"
    export function ws2812RainbowCycle(delay: number = 1000): void {
        let stepTime = delay/256/2;
        for (let c = 0; c < 256; c+=2) {
            let color = wheel(c % 256);
            _ws2812SetAll(color[0], color[1], color[2]);
            basic.pause(stepTime);
        }
        ws2812Off();
    }

    //% blockId="LightsControl.headlightOff" block="Turn off headlights"
    //% group="Headlights"
    export function headlightOff(): void {
        _headlightSet(0, 0, 0, 0, 0, 0);
    }


    //% blockId="LightsControl.headlightSetRGB" block="Set %channel headlights color R: %r G: %g B: %b"
    //% group="Headlights"
    export function headlightSetRGB(channel: HeadlightChannel, r: number, g: number, b: number): void {
        if (channel == HeadlightChannel.Left) {
            writeRegs(0x10, [r, g, b]);
        } 
        if (channel == HeadlightChannel.Right) {
            writeRegs(0x13, [r, g, b]);
        }
    }
    //% blockId="LightsControl.headlightSetAll" block="Set headlights color R: %r G: %g B: %b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% group="Headlights"
    export function headlightSetAll(r:number,g:number,b:number): void {
        _headlightSet(r, g, b, r, g, b);
    }
    //% blockId="LightsControl.headlightSetAllColor" block="Set headlights color Left: %lColor Right: %rColor"
    //% group="Headlights"
    export function headlightSetAllColor(lcolor: Colors, rcolor: Colors): void {
        _headlightSet(colorEnumToRGB(lcolor).r, colorEnumToRGB(lcolor).g, colorEnumToRGB(lcolor).b, colorEnumToRGB(rcolor).r, colorEnumToRGB(rcolor).g, colorEnumToRGB(rcolor).b);
    }
    //% blockId="LightsControl.headlightSetColor" block="Set %channel headlights color %color"
    //% group="Headlights"
    export function headlightSetColor(channel: HeadlightChannel, color:Colors): void {
        if (channel == HeadlightChannel.Left) {
            writeRegs(0x10, [colorEnumToRGB(color).r, colorEnumToRGB(color).g, colorEnumToRGB(color).b]);
        } 
        if (channel == HeadlightChannel.Right) {
            writeRegs(0x13, [colorEnumToRGB(color).r, colorEnumToRGB(color).g, colorEnumToRGB(color).b]);
        }
    }
    //
    //% blockId="LightsControl.headlightBreath" block="Headlights breath R: %r G: %g B: %b Period(ms): %period"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% period.min=1000 period.max=5000
    //% advanced=true
    //% group="Headlights"
    export function headlightBreath(r: number, g: number, b: number, period: number = 1000): void {
        let steps = 50;
        let stepTime = period / steps;

        for (let i = 0; i < steps; i++) {
            let brightness = Math.sin(i * Math.PI / steps) * 255;
            let cr = Math.round((r * brightness) / 255);
            let cg = Math.round((g * brightness) / 255);
            let cb = Math.round((b * brightness) / 255);
            _headlightSet(cr, cg, cb, cr, cg, cb);
            basic.pause(stepTime);
        }
        headlightOff();
    }

    //% blockId="LightsControl.headlightRunningWater" block="Headlights running water R: %r G: %g B: %b Interval(ms): %interval"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% interval.min=1000 interval.max=5000
    //% advanced=true
    //% group="Headlights"
    export function headlightRunningWater(r: number, g: number, b: number, interval: number = 1000): void {
        headlightOff();
        _headlightSet(r, g, b, 0, 0, 0);
        basic.pause(interval/2);
        _headlightSet(0, 0, 0, r, g, b);
        basic.pause(interval/2);
        headlightOff();
    }

    //% blockId="LightsControl.headlightRainbowCycle" block="Headlights rainbow cycle Delay(ms): %delay"
    //% delay.min=1000 delay.max=5000
    //% advanced=true
    //% group="Headlights"
    export function headlightRainbowCycle(delay: number = 1000): void {
        let stepTime = delay/256/2;
        for (let c = 0; c < 256; c+=2) {
            let color = wheel(c % 256);
            _headlightSet(color[0], color[1], color[2], color[0], color[1], color[2]);
            basic.pause(stepTime);
        }
        headlightOff();
    }

    //% blockId="LightsControl.allOff" block="Turn off all lights"
    //% advanced=true
    //% group="AllLights"
    export function allOff(): void {
        ws2812Off();
        headlightOff();
    }

    //% blockId="LightsControl.allSetColor" block="Set all lights color R: %r G: %g B: %b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% advanced=true
    //% group="AllLights"
    export function allSetColor(r: number, g: number, b: number): void {
        _ws2812SetAll(r, g, b);
        _headlightSet(r, g, b, r, g, b);
    }



    //% blockId="LightsControl.allBreath" block="All lights breath R: %r G: %g B: %b Period(ms): %period"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% period.min=1000 period.max=5000
    //% advanced=true
    //% group="AllLights"
    export function allBreath(r: number, g: number, b: number, period: number = 1000): void {
        let steps = 50;
        let stepTime = period / steps;

        for (let i = 0; i < steps; i++) {
            let brightness = Math.sin(i * Math.PI / steps) * 255;
            let cr = Math.round((r * brightness) / 255);
            let cg = Math.round((g * brightness) / 255);
            let cb = Math.round((b * brightness) / 255);
            allSetColor(cr, cg, cb);
            basic.pause(stepTime);
        }
        allOff();
        // for (let i = steps; i >= 0; i--) {
        //     let brightness = Math.sin(i * Math.PI / steps) * 255;
        //     let cr = Math.round((r * brightness) / 255);
        //     let cg = Math.round((g * brightness) / 255);
        //     let cb = Math.round((b * brightness) / 255);
        //     allSetColor(cr, cg, cb);
        //     basic.pause(stepTime);
        // }
    }

    //% blockId="LightsControl.allRainbowCycle" block="All lights rainbow cycle Delay(ms): %delay"
    //% delay.min=1000 delay.max=5000
    //% advanced=true
    //% group="AllLights"
    export function allRainbowCycle(delay: number = 1000): void {
        let stepTime = delay/256/2;
        for (let c = 0; c < 256; c+=2) {
            let color = wheel(c % 256);
            allSetColor(color[0], color[1], color[2]);
            basic.pause(stepTime);
        }
        allOff();
    }

    //% blockId="LightsControl.allFlow" block="All lights flow R: %r G: %g B: %b Interval(ms): %interval"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% interval.min=1000 interval.max=5000 
    //% advanced=true
    //% group="AllLights"
    export function allFlow(r: number, g: number, b: number, interval: number = 1000): void {
        headlightRunningWater(r, g, b, interval);
        ws2812RunningWater(r, g, b, interval);
    }
}

//% blockId="Sensors" weight=2 color=#00CED1 icon="\uf1de" block="Sensors"
namespace Sensors {
    // Re-declare Color interface in this namespace to avoid conflicts
    export interface Color {
        r: number;
        g: number;
        b: number;
    }

    //% blockId="Sensors.readLight" block="Read light sensor"
    export function readLight(): number[] {
        let buf = readRegs(0x20, 2);
        return [buf.getNumber(NumberFormat.UInt8LE, 0), buf.getNumber(NumberFormat.UInt8LE, 1)];
    }

    //% blockId="Sensors.readBattery" block="Read battery voltage"
    export function readBattery(): number {
        let val = readReg(0x22);
        return val / 10.0;
    }

    //% blockId="Sensors.readTrack" block="Read four-way tracking sensor values"
    export function readTrack(): number[] {
        let val = readReg(0x23);
        return [(val >> 1) & 1, val & 1 , (val >> 2) & 1, (val >> 3) & 1];
    }

    //% blockId="Sensors.readTemperature" block="Read temperature"
    export function readTemperature(): number {
        let buf = readRegs(0x25, 2);
        let raw = buf.getNumber(NumberFormat.UInt16LE, 0);
        if (raw >= 0x8000) {
            raw -= 0x10000;
        }
        if (raw == -32768) {
            return -999;
        }
        return raw / 10.0;
    }

    //% blockId="Sensors.soundDetect" block="Detect sound intensity"
    export function soundDetect(windowMs: number = 500, sampleGapMs: number = 10): number[] {
        let deadline = input.runningTime() + windowMs;
        let total = 0;
        let count = 0;
        let vmin = 1023;
        let vmax = 0;

        while (input.runningTime() < deadline) {
            let val = pins.analogReadPin(AnalogPin.P2);
            if (val < vmin) vmin = val;
            if (val > vmax) vmax = val;
            total += val;
            count++;
            basic.pause(sampleGapMs);
        }

        let avg = count > 0 ? Math.floor(total / count) : 0;
        return [vmin, vmax, avg];
    }

    //% blockId="Sensors.measureDistanceMM" block="Measure distance (mm)"
    export function measureDistanceMM(): number {
        const ULTRA_TIMEOUT_US = 30000;

        pins.digitalWritePin(DigitalPin.P15, 0);
        control.waitMicros(5);
        pins.digitalWritePin(DigitalPin.P15, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P15, 0);

        let start = input.runningTimeMicros();
        while (pins.digitalReadPin(DigitalPin.P16) == 0) {
            if (input.runningTimeMicros() - start > ULTRA_TIMEOUT_US) {
                return -1;
            }
        }

        let pulseStart = input.runningTimeMicros();
        while (pins.digitalReadPin(DigitalPin.P16) == 1) {
            if (input.runningTimeMicros() - pulseStart > ULTRA_TIMEOUT_US) {
                return -1;
            }
        }

        let pulseDuration = input.runningTimeMicros() - pulseStart;
        let distanceCm = (pulseDuration * 0.0343) / 2;
        return Math.round(distanceCm * 10);
    }
}