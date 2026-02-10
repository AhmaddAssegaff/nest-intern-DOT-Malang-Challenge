### Project ini menggunakan **Repository Pattern** untuk memisahkan *business logic* dan *data access logic*, sehingga setiap layer memiliki tanggung jawab yang jelas.
Kenapa saya suka memisahkan dua hal ini : 

- **Business logic** : di Service  
- **Data access logic** : di Repository

dengan hal di atas jadi :
business logic terisolasi sehingga jadi lebih jelas kegunaan service sebagai business logic
Hal ini membuat kode lebih bersih, terstruktur, dan mudah dipahami.

tetapi tidak overengineering

### convesion method yang di gunakan : 
- **Controller** : HTTP verb (`get`, `post`, `patch`, `delete`)
- **Service** : business action (`find`, `create`, `update`, `remove`)
- **Repository** : DB action (`select`, `insert`, `update`, `delete`)

### convesion dalam membuat nama variable, method class dll yang di gunakan : 
- **Constant variable** : `UPPER_SNAKE_CASE` (contoh : file constant.ts di module auth)
- **Class / DTO / Interface** : `PascalCase` (contoh: `ConfigurationModule`)
- **File & folder** : `kebab-case` (contoh : `.dto.ts`, `.module.ts`, `.guard.ts`)

Aturan konvensi di atas tidak bersifat mutlak dan dapat disesuaikan dengan konteks.
Sebagai contoh, pada modul auth, beberapa convesion tidak digunakan karena kurang cocok secara semantik, misalnya:

```ts
postLogin(){}
postReqister(){}
postRefresh(){}

```
sehingga di module auth saya tidak menerapkannya

## Project setup

```bash
# clone this repo
$ git clone https://github.com/AhmaddAssegaff/nest-intern-DOT-Malang-Challenge.git
# install pakage
$ pnpm install
# create db and pgadmin container
$ docker compose up -d
# migrations all table + init.sql
$ pnpm run migrate:up
# Seed database
$ pnpm run migrate:seed
# e2e test 
$ pnpm test:e2e
# unit test
$ pnpm test
# run project watch mode
$ pnpm run start:dev
```

- **Buka swagger docs di** : http://localhost:3000/docs

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Run migrations

```bash
# Jalankan semua migration up (init + tables)
$ pnpm run migrate:up
# Rollback semua migration
$ pnpm run migrate:down
# Jalankan semua seed database
$ pnpm run migrate:seed
# Jalankan satu migration (up)
$ pnpm run migrate:up:one -- users
# Rollback satu migration (down)
$ pnpm run migrate:down:one -- users
# Membuat file migration baru
$ pnpm run migrate:create
```
- **semua seed file di buat manual**

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
