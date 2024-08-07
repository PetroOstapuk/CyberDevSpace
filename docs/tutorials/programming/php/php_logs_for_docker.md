---
sidebar_position: 1
sidebar_label: Як налаштувати логи PHP для Docker
slug: how-to-configure-php-logs-for-docker
---

# Як налаштувати логи PHP для Docker

Якщо ви використовуєте докер та хмарні сервіси для запуску вашого додатку в реальному часі, вам слід керувати вашими логами.

Найпоширеніший спосіб їх зберігання - це збереження у текстовому файлі. Це конфігурація за замовчуванням для більшості 
фреймворків бекенда. Цей варіант підходить, якщо ви запускаєте свій додаток локально або на VPS сервері для тестування.

Коли ви запускаєте свій додаток у виробничому середовищі, вам слід вибрати кращий варіант для керування логами. 
Майже кожна хмара має інструмент для ротації логів, а якщо його немає, ви можете використовувати, наприклад, Grafana Loki 
або стек ELK. Ці рішення кращі, тому що надають вам інтерфейси для ротації та пошуку логів. Крім того, 
ви маєте легкий доступ до них, вам не потрібно підключатися до вашого сервера, щоб переглянути їх.

Якщо ви використовуєте контейнери Docker і запускаєте свій додаток у хмарних сервісах, часто вони автоматично записують
логи ваших контейнерів до таких інструментів, як AWS CloudWatch або GCloud Stackdriver.

Але спочатку вам потрібно перенаправити потоки логів на вивід контейнера Docker, щоб мати змогу ними користуватися.

## Потоки Linux

У контейнерах Docker виконуються процеси Linux. У Linux кожен запущений процес має 3 потоки: STDIN, STDOUT, STDERR

**STDIN** - це потік введення команд, який ви можете ввести, наприклад, з клавіатури.

**STDOUT** - це потік, у який команда, що виконується, може виводити результати.

**STDERR** - це стандартний потік виведення помилок, але його назва, на мою думку, дещо заплутана, оскільки він, 
в основному, призначений для діагностичного виведення.

Коли ви запустите команду docker logs [container] у вашому терміналі, ви побачите виведення потоків STDOUT і STDERR. 
Отже, нашою метою є перенаправлення наших логів до одного з цих потоків.

[Офіційна сторінка документації логування в докері](https://docs.docker.com/config/containers/logging/)

## PHP-FPM
У PHP ми часто запускаємо наші програми за допомогою PHP-FPM (Process Manager). 
Якщо ви запускаєте ваш докер з FPM всередині контейнера докера і виконуєте команду `docker logs`, 
ви повинні побачити вивід з обробленими запитами або помилками.

Отже, PHP-FPM вже записує свій вивід у `STDOUT`.

PHP-FPM дозволяє нам перехоплювати робочий вивід і перенаправляти його в `STDOUT`. Для цього нам потрібно переконатися, 
що FPM налаштований належним чином. Ви можете створити новий конфігураційний файл і помістити його, наприклад, 
у файл `/usr/local/etc/php-fpm.d/logging.conf`:

```
[global]
error_log = /proc/self/fd/2

[www]
access.log = /proc/self/fd/2

catch_workers_output = yes
decorate_workers_output = no
```

Параметри `error_log` та `access.log` - це налаштування потоків виведення логів.

Параметр `catch_workers_output` вмикає кешування виводу воркерів. Параметр `decorate_workers_output` вимикає декорування виводу.
Якщо ви залишите цей параметр увімкненим, FPM буде декорувати вивід вашої програми ось так:
```
[21-Mar-2016 14:10:02] WARNING: [pool www] child 12 said into stdout: "[your log line]"
```

Пам'ятайте, що параметр decorate_workers_output доступний лише для [PHP 7.3.0 і вище](https://www.php.net/manual/en/install.fpm.configuration.php#decorate-workers-output).

Якщо ви використовуєте офіційний образ php-fpm докера, ця конфігурація вже встановлена 
у файлі `/usr/local/etc/php-fpm.d/docker.conf`, тому вам не потрібно робити нічого додатково 

## Налаштування PHP-додатків

Наразі все, що буде виведено в stdout від PHP-воркерів, буде показано в логах нашого докера. 
Але коли логи перенаправляються в цей потік в PHP?

Щоб записати щось в `STDOUT` на рівні PHP, нам потрібно просто написати в потік `php://stdout`.

У найпростішому випадку це можна зробити так:
```php
<?php

file_put_contents('php://stdout', 'Hello world');
```
Коли ви виконаєте цей код у php cli, ви отримаєте на виході текст Hello world.

Але це не оптимальний спосіб виведення логів у STDOUT. Кожен сучасний фреймворк повинен мати логгер PSR-3. Я думаю, 
що найпопулярнішим зараз є монолог, тому я покажу вам, як його налаштувати в Symfony, Laravel і в чистому використанні.

## Monolog

**Monolog** - чудова бібліотека для обробки логів у вашому додатку. Вона проста і еластична в налаштуванні.

### Базове налаштування монологу

Якщо ви використовуєте монолог у вашому проекті з ручним налаштуванням, вам потрібно налаштувати обробник таким чином:

(Змінений приклад з документації)
```php
<?php

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$log = new Logger('stdout');
$log->pushHandler(new StreamHandler('php://stdout', Logger::DEBUG));

$log->debug('Foo');
```

### Symfony

Ядро Symfony, починаючи з Flex, [використовує мінімалістичний логгер PSR-3](https://symfony.com/blog/new-in-symfony-3-4-minimalist-psr-3-logger), 
який за замовчуванням записує все в `php://stderr`.

У Symfony монолог, як і інші компоненти, налаштовується в YAML-файлах. Таким чином, та ж сама конфігурація буде виглядати так:
```php
# config/packages/monolog.yaml
monolog:
    handlers:
        stdout:
            type: stream
            path: "php://stdout"
            level: debug
```

### Laravel

Laravel використовує масиви для конфігурації, тому те ж саме буде виглядати так:
```php
# config/logging.php
<?php

use Monolog\Handler\StreamHandler;

return [
    'channels' =>
        'stdout' => [
            'driver' => 'monolog',
            'handler' => StreamHandler::class,
            'level' => env('LOG_LEVEL', 'debug'),
            'with' => [
                'stream' => 'php://stdout',
            ],
        ],
];
```

## STDERR або STDOUT

У деяких статтях в інтернеті ви можете прочитати, що хтось використовує `stderr`, а хтось - потоки `stdout` для запису логів. 
Наразі я не можу знайти жодних причин, щоб вибрати один з них, який є кращим.
