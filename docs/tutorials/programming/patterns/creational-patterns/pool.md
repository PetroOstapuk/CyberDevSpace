---
sidebar_position: 4
---

# 4. Пул об'єктів (Pool)

## Призначення

Патерн, що породжує, який надає набір заздалегідь ініціалізованих об'єктів, готових до використання («пул»), що не вимагає щоразу створювати та знищувати їх.

Зберігання об'єктів у пулі може помітно підвищити продуктивність у ситуаціях, коли вартість та швидкість ініціалізації екземпляра класу високі, а кількість екземплярів, що одночасно використовуються, в будь-який момент часу є низьким. Час отримання об’єкта з пулу легко прогнозується, як створення нового об'єкта (особливо з мережевим оверхедом) може займати невизначений час.

Однак ці переваги в основному належать до об'єктів, які спочатку є дорогими за часом створення. Наприклад, з’єднання з базою даних, з’єднання сокетів, потоків або ініціалізація великих графічних об’єктів, таких як шрифти або растрові зображення. У деяких ситуаціях, використання простого пулу об'єктів (які не залежать від Зовнішніх ресурсів, а тільки займають пам’ять) може виявитися неефективним і приведе до зниження продуктивності.

## Діаграма UML

![Pool UML](./images/pool.png)

## Код
Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Creational/Pool)

```php title="WorkerPool.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\Pool;

use Countable;

class WorkerPool implements Countable
{
    /**
     * @var StringReverseWorker[]
     */
    private array $occupiedWorkers = [];

    /**
     * @var StringReverseWorker[]
     */
    private array $freeWorkers = [];

    public function get(): StringReverseWorker
    {
        if (count($this->freeWorkers) === 0) {
            $worker = new StringReverseWorker();
        } else {
            $worker = array_pop($this->freeWorkers);
        }

        $this->occupiedWorkers[spl_object_hash($worker)] = $worker;

        return $worker;
    }

    public function dispose(StringReverseWorker $worker): void
    {
        $key = spl_object_hash($worker);
        if (isset($this->occupiedWorkers[$key])) {
            unset($this->occupiedWorkers[$key]);
            $this->freeWorkers[$key] = $worker;
        }
    }

    public function count(): int
    {
        return count($this->occupiedWorkers) + count($this->freeWorkers);
    }
}
```

```php title="StringReverseWorker.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\Pool;

class StringReverseWorker
{
    public function run(string $text): string
    {
        return strrev($text);
    }
}
```

## Тест

```php title="Tests/PoolTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Creational\Pool\Tests;

use DesignPatterns\Creational\Pool\WorkerPool;
use PHPUnit\Framework\TestCase;

class PoolTest extends TestCase
{
    public function testCanGetNewInstancesWithGet()
    {
        $pool = new WorkerPool();
        $worker1 = $pool->get();
        $worker2 = $pool->get();

        $this->assertCount(2, $pool);
        $this->assertNotSame($worker1, $worker2);
    }

    public function testCanGetSameInstanceTwiceWhenDisposingItFirst()
    {
        $pool = new WorkerPool();
        $worker1 = $pool->get();
        $pool->dispose($worker1);
        $worker2 = $pool->get();

        $this->assertCount(1, $pool);
        $this->assertSame($worker1, $worker2);
    }
}
```