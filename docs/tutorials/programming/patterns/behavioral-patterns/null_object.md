---
sidebar_position: 7
---

# 7. Null object (Null Object)

## Призначення

NullObject не шаблон з книги Банди Чотирьох, але схема, яка з’являється досить часто, щоб вважатися патерном. 
Вона має такі переваги:

* Клієнтський код спрощується
* Зменшує шанс виключень через нульові покажчики (і помилок PHP різного рівня)
* Менше додаткових умов - значить менше тест кейсів

Методи, які повертають об’єкт або `Null`, натомість повинні повернути об’єкт `NullObject`. `NullObject` це спрощений 
формальний код, що усуває необхідність перевірки `if (!is_null($obj)) { $obj->callSomething(); }`, замінюючи її на 
звичайний виклик `$obj->callSomething();`.

## Приклади

Null logger або null output для збереження стандартного способу взаємодії між об'єктами, навіть якщо вони не повинні 
нічого робити

Null handler у патерні Ланцюжка обов'язків.

Null command у патерні Команда.

## Діаграма UML

![ UML](./images/null_object.png)

## Код
Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Behavioral/NullObject)

```php title="Service.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\NullObject;

class Service
{
    public function __construct(private Logger $logger)
    {
    }

    /**
     * do something ...
     */
    public function doSomething()
    {
        // notice here that you don't have to check if the logger is set with eg. is_null(), instead just use it
        $this->logger->log('We are in ' . __METHOD__);
    }
}
```

```php title="Logger.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\NullObject;

/**
 * Key feature: NullLogger must inherit from this interface like any other loggers
 */
interface Logger
{
    public function log(string $str);
}
```

```php title="PrintLogger.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\NullObject;

class PrintLogger implements Logger
{
    public function log(string $str)
    {
        echo $str;
    }
}
```

```php title="NullLogger.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\NullObject;

class NullLogger implements Logger
{
    public function log(string $str)
    {
        // do nothing
    }
}
```

## Тест

```php title="Tests/LoggerTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\NullObject\Tests;

use DesignPatterns\Behavioral\NullObject\NullLogger;
use DesignPatterns\Behavioral\NullObject\PrintLogger;
use DesignPatterns\Behavioral\NullObject\Service;
use PHPUnit\Framework\TestCase;

class LoggerTest extends TestCase
{
    public function testNullObject()
    {
        $service = new Service(new NullLogger());
        $this->expectOutputString('');
        $service->doSomething();
    }

    public function testStandardLogger()
    {
        $service = new Service(new PrintLogger());
        $this->expectOutputString('We are in DesignPatterns\Behavioral\NullObject\Service::doSomething');
        $service->doSomething();
    }
}
```