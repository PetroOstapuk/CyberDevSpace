---
sidebar_position: 13
---

# Відвідувач (Visitor)

## Призначення

Шаблон «Відвідувач» виконує операції над об'єктами інших класів. Головною метою є збереження поділу спрямованості 
завдань окремих класів. У цьому класи зобов'язані визначити спеціальний контракт, щоб дозволити використовувати
їх Відвідувачам (метод «прийняти роль» `Role::accept` у прикладі).

Контракт, як правило, це абстрактний клас, але ви можете використовувати чистий інтерфейс. У цьому випадку, 
кожен відвідувач повинен сам вибирати, який метод посилається на відвідувача.

## Діаграма UML

![ UML](./images/visitor.png)

## Код
Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Behavioral/Visitor)

```php title="RoleVisitor.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\Visitor;

/**
 * Note: the visitor must not choose itself which method to
 * invoke, it is the visited object that makes this decision
 */
interface RoleVisitor
{
    public function visitUser(User $role);

    public function visitGroup(Group $role);
}
```

```php title="RecordingVisitor.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\Visitor;

class RecordingVisitor implements RoleVisitor
{
    /**
     * @var Role[]
     */
    private array $visited = [];

    public function visitGroup(Group $role)
    {
        $this->visited[] = $role;
    }

    public function visitUser(User $role)
    {
        $this->visited[] = $role;
    }

    /**
     * @return Role[]
     */
    public function getVisited(): array
    {
        return $this->visited;
    }
}
```

```php title="Role.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\Visitor;

interface Role
{
    public function accept(RoleVisitor $visitor);
}
```

```php title="User.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\Visitor;

class User implements Role
{
    public function __construct(private string $name)
    {
    }

    public function getName(): string
    {
        return sprintf('User %s', $this->name);
    }

    public function accept(RoleVisitor $visitor)
    {
        $visitor->visitUser($this);
    }
}
```

```php title="Group.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Behavioral\Visitor;

class Group implements Role
{
    public function __construct(private string $name)
    {
    }

    public function getName(): string
    {
        return sprintf('Group: %s', $this->name);
    }

    public function accept(RoleVisitor $visitor)
    {
        $visitor->visitGroup($this);
    }
}
```

## Тест

```php title="Tests/VisitorTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Tests\Visitor\Tests;

use DesignPatterns\Behavioral\Visitor\RecordingVisitor;
use DesignPatterns\Behavioral\Visitor\User;
use DesignPatterns\Behavioral\Visitor\Group;
use DesignPatterns\Behavioral\Visitor\Role;
use DesignPatterns\Behavioral\Visitor;
use PHPUnit\Framework\TestCase;

class VisitorTest extends TestCase
{
    private RecordingVisitor $visitor;

    protected function setUp(): void
    {
        $this->visitor = new RecordingVisitor();
    }

    public function provideRoles()
    {
        return [
            [new User('Dominik')],
            [new Group('Administrators')],
        ];
    }

    /**
     * @dataProvider provideRoles
     */
    public function testVisitSomeRole(Role $role)
    {
        $role->accept($this->visitor);
        $this->assertSame($role, $this->visitor->getVisited()[0]);
    }
}
```