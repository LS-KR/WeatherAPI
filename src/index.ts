import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {getCode} from "./data/CityCode";
import {analyseHour3Data, getHour3Data, isNumeric} from "./logic/helper";

const app = new Hono()

app.get('/', (c) => {
  return c.text('403 Forbidden')
})

app.get('/weather/:id', async (c) => {
  const id = c.req.param('id');
  const header = {'Access-Control-Allow-Origin': '*'} as Record<string, string | string[]>
  if (isNumeric(id)) {
    return c.json(await analyseHour3Data(await getHour3Data(id)), 200, header)
  }
  else {
    const code = getCode(id)
    if (code == '0') return c.text('400 Bad Request')
    return c.json(await analyseHour3Data(await getHour3Data(code)), 200, header)
  }
})

const port = 8964
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
