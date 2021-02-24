## Comando CLI TypeORM utilizados

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
