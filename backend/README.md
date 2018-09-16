# ava_socket



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org


#

## connect socket 
###### socket address 6000
###### you need translate the openid and fromSource,otherwise you can't connect 


#### request  url
```
//mobile
/socket.io/?openid=0261b16e5f2afb80217ac7a9c7d62f89a7e1c6aff495800ad4e405198e2793ec&fromSouce=wx&EIO=3&transport=polling&t=M1DwbUK

//desktop
/socket.io/?openid=0261b16e5f2afb80217ac7a9c7d62f89a7e1c6aff495800ad4e405198e2793ec&fromSouce=desk&EIO=3&transport=polling&t=M1DwbUK
```

## single chat from
  

#### single chat from rm/client
```
 { 
  message: '2323',
  from: '0261b16e5f2afb80217ac7a9c7d62f89a7e1c6aff495800ad4e405198e2793ec',
  to: 'ed6fca9544811ba682e7f51b76702999e9c0d193797ffa7a9b21dcfd0764a1d4',
  msgUnRead: true,
  type: '1',
  toName: 'A、double',
  fromName: '刘祖宽',
  toRole: 'C',
  fromRole: 'R',
  openid: '0261b16e5f2afb80217ac7a9c7d62f89a7e1c6aff495800ad4e405198e2793ec',
  toList:
   [ 'ed6fca9544811ba682e7f51b76702999e9c0d193797ffa7a9b21dcfd0764a1d4' ] 
   }
```
#### single chat to rm/client
```
 { 
  message: '2323',
  from: '0261b16e5f2afb80217ac7a9c7d62f89a7e1c6aff495800ad4e405198e2793ec',
  to: 'ed6fca9544811ba682e7f51b76702999e9c0d193797ffa7a9b21dcfd0764a1d4',
  msgUnRead: true,
  type: '1',
  toName: 'A、double',
  fromName: '刘祖宽',
  toRole: 'C',
  fromRole: 'R',
  openid: '0261b16e5f2afb80217ac7a9c7d62f89a7e1c6aff495800ad4e405198e2793ec',
  toList:
   [ 'ed6fca9544811ba682e7f51b76702999e9c0d193797ffa7a9b21dcfd0764a1d4' ] 
   }`

```

## group chat from
  925477

#### group chat from
```
 { 
  chatType: '2',
  groupNumber: '1123456789',
  message: '2323',
  from: '0261b16e5f2afb80217ac7a9c7d62f89a7e1c6aff495800ad4e405198e2793ec',
  to: 'ed6fca9544811ba682e7f51b76702999e9c0d193797ffa7a9b21dcfd0764a1d4',
  msgUnRead: true,
  type: '1',
  toName: 'A、double',
  fromName: '刘祖宽',
  toRole: 'C',
  fromRole: 'R',
  openid: '0261b16e5f2afb80217ac7a9c7d62f89a7e1c6aff495800ad4e405198e2793ec',
  toList:
   [ 'ed6fca9544811ba682e7f51b76702999e9c0d193797ffa7a9b21dcfd0764a1d4',
     '1dcasdasdcad02999e9c0d193797ffa7a9b21dcfd0764a1d4' ] 
   }
```
#### sent to group Number
```
 { 
  chatType: '2',
  groupNumber: '1123456789',
  message: '2323',
  from: '0261b16e5f2afb80217ac7a9c7d62f89a7e1c6aff495800ad4e405198e2793ec',
  to: 'ed6fca9544811ba682e7f51b76702999e9c0d193797ffa7a9b21dcfd0764a1d4',
  msgUnRead: true,
  type: '1',
  toName: 'A、double',
  fromName: '刘祖宽',
  toRole: 'C',
  fromRole: 'R',
  openid: '0261b16e5f2afb80217ac7a9c7d62f89a7e1c6aff495800ad4e405198e2793ec',
  toList:
   [ 'ed6fca9544811ba682e7f51b76702999e9c0d193797ffa7a9b21dcfd0764a1d4',
     '1dcasdasdcad02999e9c0d193797ffa7a9b21dcfd0764a1d4' ] 
   }

```