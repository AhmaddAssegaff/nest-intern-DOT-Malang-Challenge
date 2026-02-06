## Project ini menggunakan Repository Pattern untuk memisahkan business logic dan data access logic, sehingga setiap layer memiliki tanggung jawab yang jelas.
Kenapa saya suka memisahkan dua hal ini : 

Business logic : di Service
Data access logic : di Repository

dengan hal di atas jadi :
business logic terisolasi sehingga jadi lebih jelas kegunaan service sebagai business logic
Hal ini membuat kode lebih bersih, terstruktur, dan mudah dipahami.

tetapi tidak overengineering

## convesion method yang di gunakan : 
Controller = HTTP verb (get, post, patch, delete)
Service = business action (find, create, update, remove)
Repository = DB action (select, insert, set, delete)

## convesion dalam membuat nama variable, method class dll yang di gunakan : 
constant variable = UPPER_SNAKE_CASE
Class / DTO / Interface = ConfigurationModule 
File & folder = kebab-case di ikuti dengan jenis filenya (.dto, .module .guard dll)

Aturan konvensi di atas tidak bersifat mutlak dan dapat disesuaikan dengan konteks.
Sebagai contoh, pada modul auth, beberapa convesion tidak digunakan karena kurang cocok secara semantik, misalnya:

postLogin(){}
dan method lain 

## Project setup

```bash
# isntall pakage
$ pnpm install
# migrations
$ pnpm migrate:push
# run project watch mode
$ pnpm run start:dev
```

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
# Jalankan semua migration
$ pnpm run migrate:push

# Jalankan semua migration di linux
$ sudo pnpm run migrate:push

# Membuat file migration baru
$ pnpm run migrate:create
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
