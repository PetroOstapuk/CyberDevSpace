---
sidebar_position: 8
---

# Текучий інтерфейс (Fluent Interface)

## Призначення

Писати код, який легко читається, як речення у природній мові (на кшталт української чи англійської).

## Приклади

Doctrine 2 Query Builder працює приблизно так само, як приклад нижче.

PHPUnit використовує текучий інтерфейс, щоб створювати підставні об'єкти.

## Діаграма UML

![Fluent Interface UML](./images/fluent_interface.png)

## Код
Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Structural/FluentInterface)

```php title="Sql.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\FluentInterface;

class Sql implements \Stringable
{
    private array $fields = [];
    private array $from = [];
    private array $where = [];

    public function select(array $fields): Sql
    {
        $this->fields = $fields;

        return $this;
    }

    public function from(string $table, string $alias): Sql
    {
        $this->from[] = $table . ' AS ' . $alias;

        return $this;
    }

    public function where(string $condition): Sql
    {
        $this->where[] = $condition;

        return $this;
    }

    public function __toString(): string
    {
        return sprintf(
            'SELECT %s FROM %s WHERE %s',
            join(', ', $this->fields),
            join(', ', $this->from),
            join(' AND ', $this->where)
        );
    }
}
```

## Тест

```php title="Tests/FluentInterfaceTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\FluentInterface\Tests;

use DesignPatterns\Structural\FluentInterface\Sql;
use PHPUnit\Framework\TestCase;

class FluentInterfaceTest extends TestCase
{
    public function testBuildSQL()
    {
        $query = (new Sql())
                ->select(['foo', 'bar'])
                ->from('foobar', 'f')
                ->where('f.bar = ?');

        $this->assertSame('SELECT foo, bar FROM foobar AS f WHERE f.bar = ?', (string) $query);
    }
}
```