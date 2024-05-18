export interface AirConditionerController {
    opening: boolean,
    targetTemperature: number,
    speed: 0 | 1 | 2 | undefined
}
