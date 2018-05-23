## simpozio 

### Constructor

    const simpozio = new Simpozio(ConfigObject);

Initialize local data store and starts ```heartbeat``` and ```trace``` by default
    
### ConfigObject

#### config.data 
**{object}** Initial data (for static content)

#### config.baseUrl 
**{string}** Url of Simpozio instance (default 'https://api.simpozio.com/v2')

#### config.touchpoint
**{string}** Touchpoint value

#### config.terminalId
**{string}** Explicit id of terminal 

#### config.userAgent
**{string}** ```User-Agent``` header value

#### config.acceptLanguage
**{string}**  ```Accept-Language``` header initial value

#### config.xHttpMethodOverride
**{string}** ```X-HTTP-Method-Override``` header initial value

#### config.locale
**{string}** initial ```locale``` value (default ```en_US```)

#### config.heartbeat 
**{HeartbeatConfigObject | boolean}** 

```false``` to avoid heartbeat

#### config.debug
**{boolean}** Debug mode

### Methods

#### simpozio.auth(object: AuthObject): Promise
Authentication of terminal

    type AuthObject =  {
        apiKey: string,
        host: string,
        terminal: string,
        credentials: array[object],
        locale: string,
        timezone: string
    } 

#### simpozio.get(objectId: string): Promise<void>
Get an object

#### simpozio.batch(requests: array): Promise<void>
Submit a batch request


#### simpozio.config(config: ConfigObject): <void>
Update config of simpozio in runtime



