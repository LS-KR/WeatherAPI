export type WeatherType = 'sun' | 'cloud' | 'rain' | 'snow' | 'fog'
export type DirectionType = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'

export interface Wind {
    direction: DirectionType,
    strength: number
}

export interface WeatherData {
    type: WeatherType,
    temperature: number,
    wind: Wind,
    day: number,
    hour: number
}