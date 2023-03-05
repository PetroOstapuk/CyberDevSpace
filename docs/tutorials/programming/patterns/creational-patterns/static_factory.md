---
sidebar_position: 8
---

# 8. Статична Фабрика (Static Factory)

## Призначення

Подібно до AbstractFactory, цей патерн використовується для створення ряду зв'язаних або залежних об'єктів. 
Різниця між цим шаблоном і абстрактною Фабрикою полягає в тому, що Статична Фабрика використовує лише один 
Статичний метод, щоб створити всі допустимі типи об'єктів. Цей метод, зазвичай, називається «factory» або «build».

## Діаграма UML

![Static Factory UML](./images/static_factory.png)

## Код
Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Creational/StaticFactory)

```php title="StaticFactory.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\StaticFactory;

use InvalidArgumentException;

/**
 * Note1: Remember, static means global state which is evil because it can't be mocked for tests
 * Note2: Cannot be subclassed or mock-upped or have multiple different instances.
 */
final class StaticFactory
{
    public static function factory(string $type): Formatter
    {
        return match ($type) {
            'number' => new FormatNumber(),
            'string' => new FormatString(),
            default => throw new InvalidArgumentException('Unknown format given'),
        };
    }
}
```

```php title="Formatter.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\StaticFactory;

interface Formatter
{
    public function format(string $input): string;
}
```

```php title="FormatString.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\StaticFactory;

class FormatString implements Formatter
{
    public function format(string $input): string
    {
        return $input;
    }
}

```

```php title="FormatNumber.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\StaticFactory;

class FormatNumber implements Formatter
{
    public function format(string $input): string
    {
        return number_format((int) $input);
    }
}
```

## Тест

```php title="Tests/StaticFactoryTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\StaticFactory\Tests;

use InvalidArgumentException;
use DesignPatterns\Creational\StaticFactory\FormatNumber;
use DesignPatterns\Creational\StaticFactory\FormatString;
use DesignPatterns\Creational\StaticFactory\StaticFactory;
use PHPUnit\Framework\TestCase;

class StaticFactoryTest extends TestCase
{
    public function testCanCreateNumberFormatter()
    {
        $this->assertInstanceOf(FormatNumber::class, StaticFactory::factory('number'));
    }

    public function testCanCreateStringFormatter()
    {
        $this->assertInstanceOf(FormatString::class, StaticFactory::factory('string'));
    }

    public function testException()
    {
        $this->expectException(InvalidArgumentException::class);

        StaticFactory::factory('object');
    }
}
```