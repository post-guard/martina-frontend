export interface AirConditionerState {
    cooling: boolean,
    status: number,
    roomId: string,
    speed: 0 | 1 | 2,
    targetTemperature: number,
    temperature: number
}
