import * as path from 'node:path'
import { generateApi } from 'swagger-typescript-api'

console.log(path.join(process.cwd(), '../../api/swagger.json'))

// This is supposed to work by providing the json file,
// but it doesn't work, so we use the localhost url instead
generateApi({ 
    name: 'api.ts',
    url: 'http://localhost:5022/swagger.json',
    output: path.join(process.cwd(), './src'),
})
.catch(() => {
    console.error('Error generating API, is the API running?')
})