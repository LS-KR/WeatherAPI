import {DirectionType, WeatherData, WeatherType} from "../data/Interface";

export function isNumeric(str: string) {
    return /[0-9]+/.test(str);
}

export async function getHour3Data(code: string): Promise<string[]> {
    const s = await (await fetch(`http://www.weather.com.cn/weather1d/${code}.shtml`)).text();
    for (const v of s.split('\n')) {
        if (v.includes('var hour3data=')) {
            const vt = JSON.parse(v.replace('var hour3data=', ''));
            return ((vt['1d'])) as string[]
        }
    }
    return []
}

const translateWeather: [string, WeatherType][] = [['晴', 'sun'], ['云', 'cloud'], ['阴', 'cloud'], ['雨', 'rain'], ['雪', 'snow'], ['雾', 'fog'], ['霾', 'fog']]
const translateWind: [string, DirectionType][] = [['北风', 'N'], ['东北风', 'NE'], ['东风', 'E'], ['东南风', 'SE'], ['南风', 'S'], ['西南风', 'SW'], ['西风', 'W'], ['西北风', 'NW']]

export async function analyseHour3Data(data: string[]): Promise<WeatherData[]> {
    const weathers = [] as WeatherData[]
    for (const d of data) {
        const s = d.split(',')
        const weather = {type: 'sun', wind: {direction: 'N', strength: 0}, temperature: NaN, day: NaN, hour: NaN} as WeatherData
        for (const v of translateWeather) {
            if (s[2].includes(v[0])) {
                weather.type = v[1]
                break;
            }
        }
        for (const v of translateWind) {
            if (s[4] == v[0]) {
                weather.wind.direction = v[1]
                break;
            }
        }
        for (const v of s[5].split('')) {
            if (isNumeric(v)) {
                weather.wind.strength = parseFloat(v[0])
                break;
            }
        }
        const t = s[0].replace('日', ';').replace('时', '').split(';')
        weather.day = parseInt(t[0])
        weather.hour = parseInt(t[1])
        weather.temperature = parseFloat(s[3])
        weathers.push(weather)
    }
    return weathers;
}
