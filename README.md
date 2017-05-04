# chat

## Screenshot
![Screenshotfrom2017-04-0922-30-00.png](http://sv1.upsieutoc.com/2017/04/09/Screenshotfrom2017-04-0922-30-00.png)
![Screenshotfrom2017-04-1614-00-55.png](http://sv1.upsieutoc.com/2017/04/16/Screenshotfrom2017-04-1614-00-55.png)

## Development

#### First
Configure MongoDB.
#### Second
Use your email to configure mail server.
#### Third
Use other IP address or other domain to setup mail template.
#### Fourth
Run
```sh
$ npm start
```

## Test
#### Authentication
Route | Method | Params
--- | ------ | ------
`/authentication/register` | `POST` | `email, password`
`/authentication/signin` | `POST` | `email, password`
`/authentication/signout` | `GET` | `NONE`
`/email/recovery` | `POST` | `email`
`/password/reset` | `POST` | `id, new_password`

#### API v1
Route | Method | Params
--- | ------ | ------
`/v1/info` | `GET` | `id`
`/v1/get_user` | `GET` | `NONE`
`/v1/direct/create` | `POST` | `myEmail, otherEmail`
`/v1/direct/remove` | `POST` | `myEmail, directID`

#### Dev
Route | Method | Params
--- | ------ | ------
`/dev/user/reset` | `GET` | `NONE`
`/dev/session/reset` | `GET` | `NONE`


