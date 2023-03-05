---
sidebar_position: 6
---

# 6. Проста Фабрика (Simple Factory)

## Призначення

SimpleFactory у прикладі нижче, це патерн «Проста Фабрика».

Вона відрізняється від Статичної Фабрики тим, що власне не є статичною. 
Таким чином, ви можете мати безліч фабрик з різними параметрами. 
Проста фабрика завжди повинна бути кращою за Статичну фабрику!

## Приклади


## Діаграма UML

![Simple Factory UML](./images/simple_factory.png)

## Код
Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Creational/SimpleFactory)

```php title="SimpleFactory.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\SimpleFactory;

class SimpleFactory
{
    public function createBicycle(): Bicycle
    {
        return new Bicycle();
    }
}
```

```php title="Bicycle.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\SimpleFactory;

class Bicycle
{
    public function driveTo(string $destination)
    {
    }
}
```

## Тест

```php title="Tests/SimpleFactoryTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\SimpleFactory\Tests;

use DesignPatterns\Creational\SimpleFactory\Bicycle;
use DesignPatterns\Creational\SimpleFactory\SimpleFactory;
use PHPUnit\Framework\TestCase;

class SimpleFactoryTest extends TestCase
{
    public function testCanCreateBicycle()
    {
        $bicycle = (new SimpleFactory())->createBicycle();
        $this->assertInstanceOf(Bicycle::class, $bicycle);
    }
}
```