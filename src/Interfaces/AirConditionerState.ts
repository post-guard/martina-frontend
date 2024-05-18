export interface AirConditionerState {
    cooling: boolean,
    opening: boolean,
    roomId: string,
    speed: 0 | 1 | 2,
    targetTemperature: number,
    temperature: number
}
