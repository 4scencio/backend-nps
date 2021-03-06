## Ferramentas e Tecnologias Utilizadas:
```
- Node
- TypeScript
- Express
- TypeORM
- SQLite
- Jest
- SuperTest
- Nodemailer
- Handlebars
- Yup Validation
- Express Async Error
- Bcrypt
- JWT
- Beekeeper
- Insomnia
```

## Comandos CLI TypeORM Utilizados:

### Criar uma migration:

```
yarn typeorm migration:create -n {{name}}
```

### Executar uma migration para criação no db:

```
yarn typeorm migration:run
```

### Rollback na migration (desfazer a última execução):

```
yarn typeorm migration:revert
```
