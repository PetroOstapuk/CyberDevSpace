---
sidebar_position: 9
---

# 9. Легковаговик (Flyweight)

## Призначення

Для зменшення використання пам’яті Легковаговик розділяє як можна більше пам’яті між аналогічними об'єктами. 
Це необхідно, коли використовується велика кількість об'єктів, стан яких не сильно відрізняється. 
Звичайною практикою є зберігання стану у зовнішніх структурах і передавати їх в об’єкт-легковаговик, 
коли необхідно.

## Діаграма UML

![Flyweight UML](./images/flyweight.png)

## Код
Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Structural/Flyweight)

```php title="Text.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Flyweight;

/**
 * This is the interface that all flyweights need to implement
 */
interface Text
{
    public function render(string $extrinsicState): string;
}
```

```php title="Word.php"
<?php

namespace DesignPatterns\Structural\Flyweight;

class Word implements Text
{
    public function __construct(private string $name)
    {
    }

    public function render(string $extrinsicState): string
    {
        return sprintf('Word %s with font %s', $this->name, $extrinsicState);
    }
}
```

```php title="Character.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Flyweight;

/**
 * Implements the flyweight interface and adds storage for intrinsic state, if any.
 * Instances of concrete flyweights are shared by means of a factory.
 */
class Character implements Text
{
    /**
     * Any state stored by the concrete flyweight must be independent of its context.
     * For flyweights representing characters, this is usually the corresponding character code.
     */
    public function __construct(private string $name)
    {
    }

    public function render(string $extrinsicState): string
    {
         // Clients supply the context-dependent information that the flyweight needs to draw itself
         // For flyweights representing characters, extrinsic state usually contains e.g. the font.

        return sprintf('Character %s with font %s', $this->name, $extrinsicState);
    }
}
```

```php title="TextFactory.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Flyweight;

use Countable;

/**
 * A factory manages shared flyweights. Clients should not instantiate them directly,
 * but let the factory take care of returning existing objects or creating new ones.
 */
class TextFactory implements Countable
{
    /**
     * @var Text[]
     */
    private array $charPool = [];

    public function get(string $name): Text
    {
        if (!isset($this->charPool[$name])) {
            $this->charPool[$name] = $this->create($name);
        }

        return $this->charPool[$name];
    }

    private function create(string $name): Text
    {
        if (strlen($name) == 1) {
            return new Character($name);
        }
        return new Word($name);
    }

    public function count(): int
    {
        return count($this->charPool);
    }
}
```

## Тест

```php title="Tests/FlyweightTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\Flyweight\Tests;

use DesignPatterns\Structural\Flyweight\TextFactory;
use PHPUnit\Framework\TestCase;

class FlyweightTest extends TestCase
{
    private array $characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
        'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    private array $fonts = ['Arial', 'Times New Roman', 'Verdana', 'Helvetica'];

    public function testFlyweight()
    {
        $factory = new TextFactory();

        for ($i = 0; $i <= 10; $i++) {
            foreach ($this->characters as $char) {
                foreach ($this->fonts as $font) {
                    $flyweight = $factory->get($char);
                    $rendered = $flyweight->render($font);

                    $this->assertSame(sprintf('Character %s with font %s', $char, $font), $rendered);
                }
            }
        }

        foreach ($this->fonts as $word) {
            $flyweight = $factory->get($word);
            $rendered = $flyweight->render('foobar');

            $this->assertSame(sprintf('Word %s with font foobar', $word), $rendered);
        }

        // Flyweight pattern ensures that instances are shared
        // instead of having hundreds of thousands of individual objects
        // there must be one instance for every char that has been reused for displaying in different fonts
        $this->assertCount(count($this->characters) + count($this->fonts), $factory);
    }
}
```