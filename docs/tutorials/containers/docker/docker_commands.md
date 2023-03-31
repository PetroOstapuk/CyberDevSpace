---
sidebar_position: 1
---

# Базові команди Docker

    Контейнери дозволяють упакувати ваш додаток (і все, що потрібно для його запуску) у "образ контейнера". Всередину 
    контейнера ви можете включити базову операційну систему, бібліотеки, файли і теки, змінні оточення, точки монтування 
    томів і двійкові файли вашої програми(або вихідний код).

    "Образ контейнера" є шаблоном для виконання контейнера - це означає, що ви можете мати декілька контейнерів, які 
    запускаються з одного образу і мають однакову поведінку, що сприяє масштабуванню та розповсюдженню програми. Ці 
    образи можна зберігати у віддаленому реєстрі(репозиторії) для полегшення розповсюдження. Після створення контейнера, 
    виконанням керує середовище виконання контейнера. Ви можете взаємодіяти з середовищем виконання контейнера за 
    допомогою команди "docker". Три основні компоненти архітектури контейнера (клієнт, середовище виконання та реєстр).

## Docker CLI

### Команди, пов'язані з контейнерами
`docker [CMD] [OPTS] [CONTAINER]`

```shell
1. Run a container in interactive mode:
#Run a bash shell inside an image
$ docker run -it petro/image-php bash
#Check the release inside a container
[root@.../]# cat /etc/php-release
2. Run a container in detached mode:
$ docker run --name container_name -d -p 8080:8080 petro/image-php
3. Run a detached container in a previously created container network:
$ docker network create mynetwork
$ docker run --name mywild-net -d --net mynetwork \
-p 8080:8080 petro/image-php
4. Run a detached container mounting a local folder inside the container:
$ docker run --name container-name-volume -d \
-v myfolder/:/opt/petro/php/standalone/deployments/ \
-p 8080:8080 petro/image-php
5. Follow the logs of a specific container:
$ docker logs -f container_name
$ docker logs -f [container-name|container-id]
6. List containers:
# List only active containers
$ docker ps
# List all containers
$ docker ps -a
7. Stop a container:
# Stop a container
$ docker stop [container-name|container-id]
# Stop a container (timeout = 1 second)
$ docker stop -t1
8. Remove a container:
# Remove a stopped container
$ docker rm [container-name|container-id]
# Force stop and remove a container
$ docker rm -f [container-name|container-id]
# Remove all containers
$ docker rm -f $(docker ps-aq)
# Remove all stopped containers
$ docker rm $(docker ps -q -f "status=exited")
9. Execute a new process in an existing container:
# Execute and access bash inside a container
$ docker exec -it container_name bash
```

* `daemon` Запустити постійний процес, який керує контейнерами
* `attach` Приєднатися до запущеного контейнера, щоб переглянути його поточний вивід(логи) або керувати ним інтерактивно
* `commit` Створити новий образ на основі змін у контейнері
* `cp` Копіювати файли/теки між контейнером і локальною файловою системою
* `create` Створити новий контейнер
* `diff` Перевірити зміни у файловій системі контейнера
* `exec` Запустити команду в контейнері, що працює
* `export` Експортувати вміст файлової системи контейнера у вигляді tar-архіву
* `kill` Вбити запущений контейнер за допомогою SIGKILL або вказаного сигналу
* `logs` Отримати логи контейнера
* `pause` Призупинити всі процеси всередині контейнера
* `port` Вивести список зіставлень портів або знайти публічний порт, який прописано у NAT до PRIVATE_PORT
* `ps` Перелік контейнерів
* `rename` Перейменувати контейнер
* `restart` Перезапустити контейнер
* `rm` Видалити один або декілька контейнерів
* `run` Виконати команду в новому контейнері
* `start` Запустити один або декілька контейнерів
* `stats` Показати статистику використання ресурсів одного або декількох контейнерів
* `stop` Зупинити контейнер, відправивши SIGTERM, а потім SIGKILL після пільгового періоду
* `top` Показати запущені процеси контейнера
* `unpause` Призупинити всі процеси в контейнері
* `update` Оновити конфігурацію одного або декількох контейнерів
* `wait` Зачекати, доки контейнер зупиниться, а потім вивести код завершення роботи контейнера

### Команди, пов'язані з образами
`docker [CMD] [OPTS] [IMAGE]`

```shell
1. Build an image using a Dockerfile:
#Build an image
$ docker build -t [username/]<image-name>[:tag] <dockerfile-path>
#Build an image called myimage using the Dockerfile in the same folder where the command was executed
$ docker build -t myimage:latest .
2. Check the history of an image:
# Check the history of the petro/image-php image
$ docker history petro/image-php
# Check the history of an image
$ docker history [username/]<image-name>[:tag]
3: List the images:
$ docker images
4: Remove an image from the local registry:
$ docker rmi [username/]<image-name>[:tag]
5. Tag an image:
# Creates an image called “myimage” with the tag “v1” for the image petro/image-php:latest
$ docker tag petro/image-php myimage:v1
# Creates a new image with the latest tag
$ docker tag <image-name> <new-image-name>
# Creates a new image specifying the “new tag” from an existing image and tag
$ docker tag <image-name>[:tag][username/] <new-image-name>.[:new-tag]
6. Exporting and importing an image to an external file:
# Export the image to an external file
$ docker save -o <filename>.tar
# Import an image from an external file
$ docker load -i <filename>.tar
7 Push an image to a registry:
$ docker push [registry/][username/]<image-name>[:tag]
```

* `build` Зібрати образи з Docker-файлу
* `history` Показати історію образу
* `images` Перерахувати образи
* `import` Створити порожній образ файлової системи та імпортувати до нього вміст
* `info` Показати загальносистемну інформацію
* `inspect` Повернути низькорівневу інформацію про контейнер або образ
* `load` Завантажити образ з tar-архіву або STDIN
* `pull` Витягнути образ з реєстру
* `push` Відправити образ до реєстру
* `rmi` Вилучити один або декілька образів
* `save` Зберегти один або декілька образів до tar-архіву (за замовчуванням передається у STDOUT)
* `search` Пошук образів
* `tag` Додати тег образу

### Команди, пов'язані з контейнерами

Dockerfile аргументи інструкції

1. `FROM` - Встановлює базовий образ з котрого буде проводитись збірка контейнера
2. `MAINTAINER` Задає поле автора згенерованих образів
3. `RUN` Виконує команди у новому шарі поверх поточного образу та фіксує результати
4. `CMD` Дозволяється лише один раз (якщо декілька, то діє остання)
5. `LABEL` Додає метадані до образу
6. `EXPOS` Інформує програму виконання контейнера про те, що під час виконання контейнер прослуховує вказані мережеві порти
7. `ENV` Встановлює змінну оточення
8. `ADD` Копіює нові файли, каталоги або URL-адреси віддалених файлів до файлової системи контейнера
9. `COPY` Копіювати нові файли або каталоги у файлову систему контейнера
10. `ENTRYPOINT` Дозволяє налаштувати контейнер, який буде запускатися як виконуваний файл
11. `VOLUME` Створює точку монтування і позначає її як таку, що містить змонтовані ззовні томи з рідного хоста або інших контейнерів
12. `USER` Задає ім'я користувача або UID для використання під час запуску образу
13. `WORKDIR` Задає робочий каталог для команд RUN, CMD, ENTRYPOINT, COPY, та ADD
14. `ARG` Визначає змінну, яку користувачі можуть передати під час збирання образу за допомогою --build-arg
15. `ONBUILD` Додає інструкцію, яку буде виконано пізніше, коли образ буде використано як основу для іншої збірки
16. `STOPSIGNAL` Задає сигнал системного виклику, який буде надіслано контейнеру для завершення роботи