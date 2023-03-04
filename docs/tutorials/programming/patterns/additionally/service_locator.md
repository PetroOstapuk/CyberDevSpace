---
sidebar_position: 1
---

# 1. Локатор Служб (Service Locator)

Цей шаблон вважається антипатерном!

Дехто вважає Локатор Служб антипатерном. Він порушує принцип інверсії залежностей 
(Dependency Inversion principle)) з набору принципів SOLID. Локатор Служб приховує залежність даного класу 
замість їхнього спільного використання, як у випадку шаблону Впровадження Залежності (Dependency Injection). 
У разі зміни даних залежностей ми ризикуємо зламати функціонал класів, які їх використовують, унаслідок чого 
утрудняється підтримка системи.

## Призначення

Для реалізації слабозв'язаної архітектури, щоб отримати добре тестований код, що супроводжується і розширюється. 
Патерн Ін'єкція залежностей (DI) і патерн Локатор Служб - це реалізація патерну Інверсія керування 
(Inversion of Control, IoC).

## Використання

З «Локатором Служб» ви можете зареєструвати сервіс для певного інтерфейсу. За допомогою інтерфейсу ви можете 
отримати зареєстрований Сервіс і використовувати його в класах програми, не знаючи його реалізації. 
Ви можете налаштувати та впровадити об’єкт Service Locator на початковому етапі складання програми.

## Діаграма UML

![ UML](./images/service_locator.png)

## Код
Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/More/ServiceLocator)

```php title="Service.php"
<?php

namespace DesignPatterns\More\ServiceLocator;

interface Service
{

}
```

```php title="ServiceLocator.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\More\ServiceLocator;

use OutOfRangeException;
use InvalidArgumentException;

class ServiceLocator
{
    /**
     * @var string[][]
     */
    private array $services = [];

    /**
     * @var Service[]
     */
    private array $instantiated = [];

    public function addInstance(string $class, Service $service)
    {
        $this->instantiated[$class] = $service;
    }

    public function addClass(string $class, array $params)
    {
        $this->services[$class] = $params;
    }

    public function has(string $interface): bool
    {
        return isset($this->services[$interface]) || isset($this->instantiated[$interface]);
    }

    public function get(string $class): Service
    {
        if (isset($this->instantiated[$class])) {
            return $this->instantiated[$class];
        }

        $object = new $class(...$this->services[$class]);

        if (!$object instanceof Service) {
            throw new InvalidArgumentException('Could not register service: is no instance of Service');
        }

        $this->instantiated[$class] = $object;

        return $object;
    }
}
```

```php title="LogService.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\More\ServiceLocator;

class LogService implements Service
{

}
```

## Тест

```php title="Tests/ServiceLocatorTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\More\ServiceLocator\Tests;

use DesignPatterns\More\ServiceLocator\LogService;
use DesignPatterns\More\ServiceLocator\ServiceLocator;
use PHPUnit\Framework\TestCase;

class ServiceLocatorTest extends TestCase
{
    private ServiceLocator $serviceLocator;

    public function setUp(): void
    {
        $this->serviceLocator = new ServiceLocator();
    }

    public function testHasServices()
    {
        $this->serviceLocator->addInstance(LogService::class, new LogService());

        $this->assertTrue($this->serviceLocator->has(LogService::class));
        $this->assertFalse($this->serviceLocator->has(self::class));
    }

    public function testGetWillInstantiateLogServiceIfNoInstanceHasBeenCreatedYet()
    {
        $this->serviceLocator->addClass(LogService::class, []);
        $logger = $this->serviceLocator->get(LogService::class);

        $this->assertInstanceOf(LogService::class, $logger);
    }
}
```