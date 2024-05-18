import {AirConditionerState} from "./AirConditionerState.ts";

export interface MonitorRoomState {
    info: {
        id: string,
        name: string,
    },
    airConState: AirConditionerState
}