---
sidebar_position: 2
---

# Міст (Bridge)

## Призначення

Відокремити абстракцію від її реалізації, отже вони можуть змінюватися незалежно один від одного.

## Діаграма UML

![Bridge UML](./images/bridge.png)

## Код

Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Structural/Bridge)

```php title="Formatter.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Bridge;

interface Formatter
{
    public function format(string $text): string;
}
```

```php title="PlainTextFormatter.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Bridge;

class PlainTextFormatter implements Formatter
{
    public function format(string $text): string
    {
        return $text;
    }
}
```

```php title="HtmlFormatter.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Bridge;

class HtmlFormatter implements Formatter
{
    public function format(string $text): string
    {
        return sprintf('<p>%s</p>', $text);
    }
}
```

```php title="Service.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Bridge;

abstract class Service
{
    public function __construct(protected Formatter $implementation)
    {
    }

    final public function setImplementation(Formatter $printer)
    {
        $this->implementation = $printer;
    }

    abstract public function get(): string;
}
```

```php title="HelloWorldService.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Bridge;

class HelloWorldService extends Service
{
    public function get(): string
    {
        return $this->implementation->format('Hello World');
    }
}
```

```php title="PingService.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Bridge;

class PingService extends Service
{
    public function get(): string
    {
        return $this->implementation->format('pong');
    }
}
```

## Тест

```php title="Tests/BridgeTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Bridge\Tests;

use DesignPatterns\Structural\Bridge\HelloWorldService;
use DesignPatterns\Structural\Bridge\HtmlFormatter;
use DesignPatterns\Structural\Bridge\PlainTextFormatter;
use PHPUnit\Framework\TestCase;

class BridgeTest extends TestCase
{
    public function testCanPrintUsingThePlainTextFormatter()
    {
        $service = new HelloWorldService(new PlainTextFormatter());

        $this->assertSame('Hello World', $service->get());
    }

    public function testCanPrintUsingTheHtmlFormatter()
    {
        $service = new HelloWorldService(new HtmlFormatter());

        $this->assertSame('<p>Hello World</p>', $service->get());
    }
}
```