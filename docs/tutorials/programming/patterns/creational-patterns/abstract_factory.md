---
sidebar_position: 1
---

# 1. Абстрактна фабрика (Abstract Factory)

## Призначення

Створити ряд пов'язаних чи залежних об'єктів без зазначення їх конкретних класів. Зазвичай створювані класи всі реалізовують один і той же інтерфейс. Клієнт абстрактної фабрики не дбає про те, як створюються ці об'єкти, він просто знає, за якими ознаками вони взаємопов'язані і як із ними поводитись.

## Діаграма UML

![Abstract Factory UML](./images/abstract_factory.png)

## Код

Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Creational/AbstractFactory)

```php title="WriterFactory.php"
<?php

namespace DesignPatterns\Creational\AbstractFactory;

interface WriterFactory
{
    public function createCsvWriter(): CsvWriter;
    public function createJsonWriter(): JsonWriter;
}
```

```php title="CsvWriter.php"
<?php

namespace DesignPatterns\Creational\AbstractFactory;

interface CsvWriter
{
    public function write(array $line): string;
}
```


```php title="JsonWriter.php"
<?php

namespace DesignPatterns\Creational\AbstractFactory;

interface JsonWriter
{
    public function write(array $data, bool $formatted): string;
}
```

```php title="UnixCsvWriter.php"
<?php

namespace DesignPatterns\Creational\AbstractFactory;

class UnixCsvWriter implements CsvWriter
{
    public function write(array $line): string
    {
        return join(',', $line) . "\n";
    }
}
```

```php title="UnixJsonWriter.php"
<?php

namespace DesignPatterns\Creational\AbstractFactory;

class UnixJsonWriter implements JsonWriter
{
    public function write(array $data, bool $formatted): string
    {
        $options = 0;

        if ($formatted) {
            $options = JSON_PRETTY_PRINT;
        }

        return json_encode($data, $options);
    }
}
```

```php title="UnixWriterFactory.php"
<?php

namespace DesignPatterns\Creational\AbstractFactory;

class UnixWriterFactory implements WriterFactory
{
    public function createCsvWriter(): CsvWriter
    {
        return new UnixCsvWriter();
    }

    public function createJsonWriter(): JsonWriter
    {
        return new UnixJsonWriter();
    }
}
```

```php title="WinCsvWriter.php"
<?php

namespace DesignPatterns\Creational\AbstractFactory;

class WinCsvWriter implements CsvWriter
{
    public function write(array $line): string
    {
        return join(',', $line) . "\r\n";
    }
}
```

```php title="WinJsonWriter.php"
<?php

namespace DesignPatterns\Creational\AbstractFactory;

class WinJsonWriter implements JsonWriter
{
    public function write(array $data, bool $formatted): string
    {
        $options = 0;

        if ($formatted) {
            $options = JSON_PRETTY_PRINT;
        }

        return json_encode($data, $options);
    }
}
```

```php title="WinWriterFactory.php"
<?php

namespace DesignPatterns\Creational\AbstractFactory;

class WinWriterFactory implements WriterFactory
{
    public function createCsvWriter(): CsvWriter
    {
        return new WinCsvWriter();
    }

    public function createJsonWriter(): JsonWriter
    {
        return new WinJsonWriter();
    }
}
```

## Тест

```php title="Tests/AbstractFactoryTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\AbstractFactory\Tests;

use DesignPatterns\Creational\AbstractFactory\CsvWriter;
use DesignPatterns\Creational\AbstractFactory\JsonWriter;
use DesignPatterns\Creational\AbstractFactory\UnixWriterFactory;
use DesignPatterns\Creational\AbstractFactory\WinWriterFactory;
use DesignPatterns\Creational\AbstractFactory\WriterFactory;
use PHPUnit\Framework\TestCase;

class AbstractFactoryTest extends TestCase
{
    public function provideFactory()
    {
        return [
            [new UnixWriterFactory()],
            [new WinWriterFactory()]
        ];
    }

    /**
     * @dataProvider provideFactory
     */
    public function testCanCreateCsvWriterOnUnix(WriterFactory $writerFactory)
    {
        $this->assertInstanceOf(JsonWriter::class, $writerFactory->createJsonWriter());
        $this->assertInstanceOf(CsvWriter::class, $writerFactory->createCsvWriter());
    }
}
```