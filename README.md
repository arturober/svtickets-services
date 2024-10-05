<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

- [Servicios web applicación SVTickets](#servicios-web-applicación-svtickets)
  - [Instalación de los servicios](#instalación-de-los-servicios)
  - [Configurando notificaciones Push](#configurando-notificaciones-push)
  - [Probando los servicios](#probando-los-servicios)
- [Servicios web - Colecciones](#servicios-web---colecciones)
  - [Colección /auth](#colección-auth)
    - [**POST /auth/login**](#post-authlogin)
    - [**POST /auth/google**](#post-authgoogle)
    - [**POST /auth/facebook**](#post-authfacebook)
    - [**POST /auth/register**](#post-authregister)
    - [**GET /auth/validate**](#get-authvalidate)
  - [Colección /events](#colección-events)
    - [**GET /events**](#get-events)
    - [**GET /events?creator={id}**](#get-eventscreatorid)
    - [**GET /events?attending={id}**](#get-eventsattendingid)
    - [**GET /events/:id**](#get-eventsid)
    - [**POST /events**](#post-events)
    - [**DELETE /events/:id**](#delete-eventsid)
    - [**PUT /events/:id**](#put-eventsid)
    - [**GET /events/:id/attend**](#get-eventsidattend)
    - [**POST /events/:id/attend**](#post-eventsidattend)
    - [**DELETE /events/:id/attend**](#delete-eventsidattend)
    - [**GET /events/:id/comments**](#get-eventsidcomments)
    - [**POST /events/:id/comments**](#post-eventsidcomments)
  - [Colección /users](#colección-users)
    - [**GET /users/me**](#get-usersme)
    - [**GET /users/:id**](#get-usersid)
    - [**GET /users/name/:name**](#get-usersnamename)
    - [**PUT /users/me**](#put-usersme)
    - [**PUT /users/me/photo**](#put-usersmephoto)
    - [**PUT /users/me/password**](#put-usersmepassword)

# Servicios web applicación SVTickets

Servicios web para los proyectos de la asignatura de entorno cliente.

## Instalación de los servicios

Instalamos las dependencias del proyecto:

```bash
npm install
```

Para lanzar los servicios en local, primero importar la base de datos (directorio SQL). A continuación configuramos el acceso a la base de datos en el archivo **src/micro-orm.config.ts**:

```typescript
import { ConnectionOptions } from '@mikro-orm/core';

export default {
  entities: ['dist/entities'], // compiled JS files
  dbName: 'svtickets',
  type: 'mariadb', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  user: 'example',
  password: 'example',
  port: 3306,
  host: 'localhost:3000',
  debug: true,
} as ConnectionOptions;
```

Edita el archivo **src/app.module.ts** para poner ahí tu id de Google (la que uses en el cliente) o no funcionará el login con dicho proveedor.

## Configurando notificaciones Push

<p style="color: red">Este apartado todavía no es funcional (para el proyecto de Ionic lo será)<p>

Descarga el archivo de cuenta de servicio (Configuración de proyecto -> cuentas de servicio) dentro de la carpeta **firebase** y renombralo a **serviceAccountKey.json**. Tiene que ser el mismo proyecto que uses en la aplicación cliente donde habrás descargado el archivo **google-services.json**. Los servicios están configurados para mandar una notificación push cuando alguien publique un comentario sobre un evento al que vayas a asistir.

## Probando los servicios

Lanzamos los servicios (en modo desarrollo) con el siguiente comando:

```bash
npm run start
```

También los podéis desplegar en un servidor utilizando por ejemplo Apache + [Passenger](https://www.phusionpassenger.com/library/deploy/apache/deploy/nodejs/). Después de ejecutar **npm run build** hay que lanzar el archivo main.js de la carpeta dist/.

# Servicios web - Colecciones

Normalmente, todos los servicios (que devuelven datos) devuelven un resultado en formato JSON. Cuando no se pueda realizar una operación, devolverán un código de error HTTP junto a un objeto JSON con la descripción del mismo.

Todas las colecciones, excepto **/auth** (*/auth/validate* sí lo requiere), requieren un token de autenticación para poder utilizar los servicios web, devolviendo un código 401 (Not Authorized) en caso de no incluirlo. Este debe enviarse en la cabecera Authorization con el prefijo Bearer:

```json
Authorization: Bearer auth_token
```

## Colección /auth

### **POST /auth/login**

El servicio comprueba si un usuario y contraseña son correctos, devolviendo un token de autenticación (JWT) si todo va bien. Opcionalmente se puede enviar la posición del usuario para que la actualice.

Ejemplo de petición:

```json
{
    "email": "prueba@email.es",
    "password": "1234",
    "lat": 35.4534,
    "lng": -0.54673
}
```

Si el login es correcto, la respuesta será algo como esto:

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTc4MTYyNDA2LCJleHAiOjE2MDk2OTg0MDZ9.HQZ-PO-usLc9WT-0cUpuDPnVRFl_u71njNoQNj_TIx8"
}
```

En caso de error en el login (usuario y contraseña no válidos), se devolverá el código de error 401:

```json
{
    "status": 401,
    "error": "Email or password incorrect"
}
```

### **POST /auth/google**

Este servicio recibe el campo **id_token** que devuelve la identificación mediante Google en el cliente. Lo valida y comprueba el correo en la base de datos. Si el correo existe funciona como un login normal, y si no existe registra al usuario (a partir de los datos obtenidos de Google) en la base de datos. Devuelve un token de autenticación válido para el servidor (como el login).

Ejemplo de envío (lat y lng son opcionales):

```json
{
    "token": "id_token de Google",
    "lat": 35.4534,
    "lng": -0.54673
}
```

La respuesta es la misma que la del servicio /auth/login

### **POST /auth/facebook**

Este servicio recibe el campo **accessToken** que devuelve la identificación mediante Facebook en el cliente. Lo valida y comprueba el correo en la base de datos. Si el correo existe funciona como un login normal, y si no existe registra al usuario (a partir de los datos obtenidos de Facebook) en la base de datos. Devuelve un token de autenticación válido para el servidor (como el login).

Ejemplo de envío (lat y lng son opcionales):

```json
{
    "token": "accessToken de Facebook",
    "lat": 35.4534,
    "lng": -0.54673
}
```

La respuesta es la misma que la del servicio /auth/login

### **POST /auth/register**

Este servicio recibe los datos de un usuario y lo registra en la base de datos. Los datos que recibirá son nombre, email, password, foto de perfil y opcionalmente, las coordenadas de geolocalización. Ejemplo de petición:

```json
{
    "name": "Prueba",
    "email": "prueba@correo.es",
    "password": "1234",
    "avatar": "Imagen codificada en base64",
    "lat": 35.4534,
    "lng": -0.54673
}
```

Si la petición es correcta, el servidor devolverá una respuesta **201** (Created) con el correo del usuario creado:

```json
{
    "email": "prueba@correo.es"
}
```

Mientras que si hay algún error en los datos enviados, devolverá un código **400** (Bad Request) con información de los errores:

```json
{
    "statusCode": 400,
    "message": [
        "Email test3@test3.com is already present in the database"
    ],
    "error": "Bad Request"
}
```

### **GET /auth/validate**

Este servicio simplemente comprueba que el token de autenticación que se envía en la cabecera **Authorization** es correcto (y se ha enviado), devolviendo una respuesta vacía **204** si hay token, y es válido, o un error **401** (Not Authorized), si no lo es.

## Colección /events

Todos los servicios de esta colección requieren del token de autenticación.

### **GET /events**

Puede recibir los siguientes **parámetros opcionales** en la lista de query params:
- **order**: Campo para ordenar, puede tomar los valores *distance* (distancia al usuario, valor por defecto), *price* (precio) o *date* (fecha)
- **search**: Trozo de texto para filtrar los que contengan dicho texto en el **título**
- **page**: Página de resultados (por defecto 1)  

**Ejemplo**: Eventos del 13 al 24 (página 2) que contengan la palabra fiesta y ordenados por precio -> */events?order=price&search=fiesta&page=2*

Este servicio devuelve 12 resultados. Los eventos están en el campo **events** del resultado. También incluye los siguientes campos. 
- **count**: Total de eventos que cumplen con los criterios
- **page**: Página actual (devuelta)
- **more** (booleano): Si hay más resultados (página + 1)  

Ejemplo de respuesta de un evento:

```json
{
    "events": [
        {
            "id": 2186,
            "creator": {
                "id": 13,
                "name": "Testing",
                "email": "testing@email.com",
                "avatar": "http://localhost:3000/img/users/1637329994765.jpg",
                "lat": 38,
                "lng": -0.5
            },
            "title": "An event",
            "description": "I will be fun",
            "date": "2022-10-12 00:00:00",
            "price": 55,
            "lat": 38.272348,
            "lng": -0.532826,
            "address": "Carrer Cristóbal Colón",
            "image": "http://localhost:3000/img/events/1636707297891.jpg",
            "numAttend": 4,
            "distance": 30.378314971923828,
            "attend": false,
            "mine": false
        },
        ...
    ],
    "count": 23,
    "page": 1,
    "more": true
}
```

### **GET /events?creator={id}**

Igual que el servicio **/events** pero devuelve solo los eventos creados por el usuario con la id especificada (Ejemplo: /events?creator=48)

### **GET /events?attending={id}**

Igual que el servicio **/events** pero devuelve los eventos a los que asiste el usuario con la id especificada.

### **GET /events/:id**

Devuelve los datos del evento cuya id se recibe en la url.

Ejemplo de respuesta de la llamada a **/events/2186**:

```json
{
    "event": {
        "id": 2186,
        "creator": {
            "id": 13,
            "name": "Testing",
            "email": "testing@email.com",
            "avatar": "http://localhost:3000:5009/img/users/1637329994765.jpg",
            "lat": 38,
            "lng": -0.5
        },
        "title": "An event",
        "description": "I will be fun",
        "date": "2022-10-12 00:00:00",
        "price": 55,
        "lat": 38.272348,
        "lng": -0.532826,
        "address": "Carrer Cristóbal Colón",
        "image": "http://localhost:3000:5009/img/events/1636707297891.jpg",
        "numAttend": 4,
        "distance": 30.378314971923828,
        "attend": false,
        "mine": false
    }
}
```

Si el evento no existe, el servidor deberá devolver un error **404**.

```json
{
    "statusCode": 404,
    "message": "Event not found",
    "error": "Not Found"
}
```

### **POST /events**

Este servicio inserta un nuevo evento en la base de datos y lo asocia al usuario autenticado (creador). 

Esta es la información necesaria para crear un evento que debemos enviar al servidor:

```json
{
    "title": "This is a a new event",
    "description": "Description for the new event",
    "date": "2021-12-03",
    "price": 25.35,
    "address": "Nowhere",
    "lat": 35.23434,
    "lng": -0.63453,
    "image": "Imagen en Base64"
}
```

Si todo es correcto, el servidor nos responderá con el evento añadido. Este tendrá más información de la que originalmente enviamos al servidor, como los datos del usuario creador, la distancia, número de personas que asisten, o la url de la imagen, entre otras:

```json
{
    "event": {
        "numAttend": 0,
        "title": "This is a a new event",
        "description": "Description for the new event",
        "date": "2021-12-03",
        "price": 25.35,
        "address": "Nowhere",
        "lat": 35.23434,
        "lng": -0.63453,
        "image": "http://localhost:3000:5009/img/events/1638549374048.jpg",
        "creator": {
            "id": 48,
            "name": "Another user",
            "email": "test3@email.com",
            "avatar": "http://localhost:3000:5009/img/users/1634033447718.jpg",
            "lat": 38,
            "lng": -0.5
        },
        "id": 2385,
        "attend": true,
        "distance": 0,
        "mine": true
    }
}
```

Si algún campo no tuviera un formato correcto o no estuviera presente, el servidor nos responderá con un error **400** (Bad Request) e información sobre lo que ha fallado:

```json
{
    "statusCode": 400,
    "message": [
        "title should not be empty",
        "title must be a string",
        "lat should not be empty",
        "lat must be a number conforming to the specified constraints",
        "lng should not be empty",
        "lng must be a number conforming to the specified constraints",
        "address should not be empty",
        "address must be a string"
    ],
    "error": "Bad Request"
}
```

### **DELETE /events/:id**

Este servicio borra el evento cuya id se especifica en la url. Devuelve una respuesta vacía **204** si el evento se ha borrado, o un error 404 si intentamos borrar un evento que no existe.

En caso de intentar borrar un evento que no es nuestro, nos responderá con un error **403** (Forbidden):

```json
{
    "statusCode": 403,
    "message": "This is not your event",
    "error": "Forbidden"
}
```

### **PUT /events/:id**

Similar al servicio de añadir evento pero para editar un evento existente. En la url se debe especificar la id del evento que vamos a modificar. Todos los campos a editar son opcionales, es decir, se solo se modificarán los campos enviados. También se pueden enviar todos los campos, simplemente dejando los que no cambien con su valor original.

La respuesta de este servicio será el evento actualizado, igual que el servicio de insertar evento. Se pueden producir errores del tipo **400** si algún campo es erróneo, **404** si el evento a editar no existe, o **403** si intentamos editar un evento que no es nuestro.

### **GET /events/:id/attend**

Obtiene la lista de usuarios que asisten al evento cuya id se pasa por parámetro en la url. Ejemplo de respuesta:

```json
{
    "users": [
        {
            "id": 64,
            "name": "User Test",
            "email": "test@2804.com",
            "avatar": "http://localhost:3000:5009/img/users/1637760007859.jpg",
            "lat": 37,
            "lng": -0.5,
            "me": false
        },
        {
            "id": 80,
            "name": "prueba",
            "email": "prueba@prueba.com",
            "avatar": "http://localhost:3000:5009/img/users/1637424131283.jpg",
            "lat": 38.366189,
            "lng": -0.492106,
            "me": false
        }
    ]
}
```

### **POST /events/:id/attend**

Este servicio añade al usuario logueado a la lista de asistentes al evento cuya id se pasa en la url. No se envía ningún dato con la petición y la respuesta igualmente será vacía (**204**) si todo ha ido correctamente. Si un usuario intenta marcar su asistencia al mismo evento 2 veces, obtendrá una respuesta de error **400**.

### **DELETE /events/:id/attend**

Borra al usuario logueado de la lista de asistentes al evento. La respuesta estará vacía (**204**) si no se produce ningún error. Si se llama a este servicio y el usuario no está entre los asistentes, se devuelve un error **404**.

### **GET /events/:id/comments**

Obtiene la lista de comentarios publicados en el evento cuya id se pasa por parámetro en la url. Ejemplo de respuesta:

```json
{
    "comments": [
        {
            "id": 21,
            "comment": "Another comment",
            "date": "2021-12-01T22:31:44.000Z",
            "user": {
                "id": 48,
                "name": "Another user",
                "email": "test3@email.com",
                "avatar": "http://localhost:3000:5009/img/users/1634033447718.jpg",
                "lat": 38,
                "lng": -0.5
            }
        },
        {
            "id": 1,
            "comment": "Hello Event!",
            "date": "2021-12-01T12:04:02.000Z",
            "user": {
                "id": 48,
                "name": "Another user",
                "email": "test3@email.com",
                "avatar": "http://localhost:3000:5009/img/users/1634033447718.jpg",
                "lat": 38,
                "lng": -0.5
            }
        }
    ]
}
```

### **POST /events/:id/comments**

Este servicio un comentario al evento cuya id se pasa en la url. Solo pueden comentar los usuarios que asisten a un evento. Si un usuario que no asiste, intenta publicar un comentario, recibirá un error **400** como respuesta. 

Ejemplo de cuerpo del mensaje a enviar al servidor:

```json
{
    "comment": "Another comment 2"
}
 ```

El servidor responderá con los datos del comentario publicado:

```json
{
    "id": 22,
    "comment": "Another comment 2",
    "date": "2021-12-03T17:11:03.356Z",
    "user": {
        "id": 48,
        "name": "Another user",
        "email": "test3@email.com",
        "avatar": "http://localhost:3000:5009/img/users/1634033447718.jpg",
        "lat": 38,
        "lng": -0.5
    }
}
```

## Colección /users

Todos los servicios de esta colección requieren del token de autenticación.

### **GET /users/me**

Devuelve la información del perfil del usuario autenticado. El booleano me indica si la información es del usuario autenticado o de otro.

```json
{
    "user": {
        "id": 15,
        "registrationDate": "2020-11-01T10:13:04.000Z",
        "name": "Test User",
        "email": "test@test.com",
        "lat": 38,
        "lng": -0.5,
        "avatar": "http://localhost:3000/img/users/1606587397679.jpg",
        "me": true
    }
}
```

### **GET /users/:id**

Igual que **/users/me** pero devuelve la información del usuario cuya id recibe en la url. Devuelve un error **404** si el usuario no existe.

Ejemplo de llamada a **/users/1**:

```json
{
    "user": {
        "id": 1,
        "registrationDate": "2016-12-31T11:18:14.000Z",
        "name": "Prueba",
        "email": "prueba@correo.es",
        "lat": 38.401827000000004,
        "lng": -0.524191,
        "avatar": "http://localhost:3000/img/users/1605562674191.jpg",
        "me": false
    }
}
```

### **GET /users/name/:name**

Este servicio busca usuarios a partir de la cadena que se le pasa como variable en la url. Te devuelve un array con los datos de los usuarios cuyo nombre contenga la cadena de búsqueda.

Ejemplo de respuesta al llamar a **/users/name/pru**:

```json
{
    "users": [
        {
            "id": 1,
            "name": "Prueba",
            "email": "prueba@correo.es",
            "lat": 37,
            "lng": -0.5,
            "avatar": "http://localhost:3000/img/users/1605562674191.jpg",
            "me": false
        },
        {
            "id": 22,
            "name": "PruebaX01",
            "email": "prueba@bien.com",
            "lat": 38.3681882,
            "lng": -0.49744510000000003,
            "avatar": "http://localhost:3000/img/users/1604506258691.jpg",
            "me": false
        }
    ]
}
```

### **PUT /users/me**

Modifica la información del nombre y correo del usuario autenticado.

Ejemplo de petición:

```json
{
  "name": "John",
  "email": "email@email.com"
}
```

El servidor devolverá una respuesta vacía **204**, si todo va bien o un error **400** si algún campo es erróneo, no está presente, o intentamos asignar un correo que ya tiene otro usuario.

### **PUT /users/me/photo**

Modifica la imagen del usuario autenticado. Ejemplo de petición:

```json
{
    "avatar": "Imagen en base 64"
}
```

Si no hay ningún error, responde con la url de la nueva imagen almacenada en el servidor:

```json
{
    "avatar": "http://localhost:3000/img/users/1609451684334.jpg"
}
```

### **PUT /users/me/password**

Actualiza la contraseña del usuario autenticado. Ejemplo de petición

```json
{
  "password": "1234"
}
```

Si todo va bien, el servidor devuelve una respuesta vacía **204**.

