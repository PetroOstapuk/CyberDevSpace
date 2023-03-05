---
sidebar_position: 12
---

# 12. Шаблонний Метод (Template Method)

## Призначення

Шаблонний метод, це поведінковий патерн проєктування.

Можливо, ви стикалися з цим вже багато разів. Ідея полягає в тому, щоб дозволити спадкоємцям абстрактного класу 
перевизначити поведінку алгоритмів батьківського класу.

Як у «Голлівудському принципі»: «Не дзвоніть нам, ми самі вам подзвонимо». клас не викликається підкласами, 
але навпаки: підкласи викликаються батьком. Як? За допомогою методу в батьківській абстракції, звичайно.

Іншими словами, це каркас алгоритму, який добре підходить для бібліотек (у фреймворках, наприклад). Користувач 
просто реалізує методи, що уточнюють, а суперклас робить всю основну роботу.

Це простий спосіб ізолювати логіку у конкретні класи та зменшити копіпаст, тому ви повсюдно зустрінете його у тому 
чи іншому вигляді.

## Приклади



## Діаграма UML

![ UML](./images/template_method.png)

## Код
Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Behavioral/TemplateMethod)

```php title="Journey.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\TemplateMethod;

abstract class Journey
{
    /**
     * @var string[]
     */
    private array $thingsToDo = [];

    /**
     * This is the public service provided by this class and its subclasses.
     * Notice it is final to "freeze" the global behavior of algorithm.
     * If you want to override this contract, make an interface with only takeATrip()
     * and subclass it.
     */
    final public function takeATrip()
    {
        $this->thingsToDo[] = $this->buyAFlight();
        $this->thingsToDo[] = $this->takePlane();
        $this->thingsToDo[] = $this->enjoyVacation();
        $buyGift = $this->buyGift();

        if ($buyGift !== null) {
            $this->thingsToDo[] = $buyGift;
        }

        $this->thingsToDo[] = $this->takePlane();
    }

    /**
     * This method must be implemented, this is the key-feature of this pattern.
     */
    abstract protected function enjoyVacation(): string;

    /**
     * This method is also part of the algorithm but it is optional.
     * You can override it only if you need to
     */
    protected function buyGift(): ?string
    {
        return null;
    }

    private function buyAFlight(): string
    {
        return 'Buy a flight ticket';
    }

    private function takePlane(): string
    {
        return 'Taking the plane';
    }

    /**
     * @return string[]
     */
    final public function getThingsToDo(): array
    {
        return $this->thingsToDo;
    }
}
```

```php title="BeachJourney.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\TemplateMethod;

class BeachJourney extends Journey
{
    protected function enjoyVacation(): string
    {
        return "Swimming and sun-bathing";
    }
}
```

```php title="CityJourney.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\TemplateMethod;

class CityJourney extends Journey
{
    protected function enjoyVacation(): string
    {
        return "Eat, drink, take photos and sleep";
    }

    protected function buyGift(): ?string
    {
        return "Buy a gift";
    }
}
```

## Тест

```php title="Tests/JourneyTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\TemplateMethod\Tests;

use DesignPatterns\Behavioral\TemplateMethod\BeachJourney;
use DesignPatterns\Behavioral\TemplateMethod\CityJourney;
use PHPUnit\Framework\TestCase;

class JourneyTest extends TestCase
{
    public function testCanGetOnVacationOnTheBeach()
    {
        $beachJourney = new BeachJourney();
        $beachJourney->takeATrip();

        $this->assertSame(
            ['Buy a flight ticket', 'Taking the plane', 'Swimming and sun-bathing', 'Taking the plane'],
            $beachJourney->getThingsToDo()
        );
    }

    public function testCanGetOnAJourneyToACity()
    {
        $cityJourney = new CityJourney();
        $cityJourney->takeATrip();

        $this->assertSame(
            [
                'Buy a flight ticket',
                'Taking the plane',
                'Eat, drink, take photos and sleep',
                'Buy a gift',
                'Taking the plane'
            ],
            $cityJourney->getThingsToDo()
        );
    }
}
```