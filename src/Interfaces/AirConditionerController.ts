export interface AirConditionerController {
    status: number,
    targetTemperature: number,
    speed: 0 | 1 | 2 | undefined
}
