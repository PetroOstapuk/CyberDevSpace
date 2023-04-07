---
sidebar_position: 1
---

# Базові команди Mysql

> Деякі важливі команди для роботи з Mysql

```sql
mysql -u root -p пароль # Підключення до бази даних

SHOW DATABASES; # Показати всі бази даних
CREATE DATABASE xxx; # Створити базу даних 
DROP DATABASE xxx; # Видалити базу даних

use xxx; # Вибрати базу даних

SHOW TABLES; # Показати всі таблиці
CREATE TABLE yyy(назва_стовпця тип_стовпця); # Створити нову таблицю. Ви можете одночасно встановити атрибути первинного ключа/не нульовий/інкрементний/символьний набір для таблиці
DROP TABLE yyy;

SHOW CREATE TABLE yyy; # Переглянути конкретні атрибути таблиці
ALTER TABLE yyy engine=innodb # ALTER використовується для зміни властивостей таблиці, 
    у цьому прикладі використовується для зміни engine

INSERT INTO user VALUES(null, 'user', 'root') # Вставити дані
DELETE FROM user WHERE user_id = '111' # Видалення даних
UPDATE user SET user_name = 'admin' WHERE user_id = '111' # Оновити дані
SELECT user_name, user_psw FROM user WHERE user_id = '111' # Знайти дані
```

**Транзакції**

По-перше, транзакції підтримують лише бази даних або таблиці, які використовують двигун баз 
даних **Innodb** в MYSQL. Ви можете дізнатись механізм, який використовується таблицею, 
за допомогою `show create table yyy`.

Зазвичай за замовчуванням Mysql використовує режим автофіксації (тобто змінна autocommit має значення ON), 
що означає, що операції фіксації виконуються автоматично.

```sql
show session variables like 'autocommit'; # Запитати значення autocommit
set autocommit=0 # не буде автоматично фіксуватися, вимкнено
set autocommit=1 # фіксувати автоматично, це ON
```

> Однак, змінивши змінні у такий спосіб, ви не зможете зробити це назавжди. Якщо ви хочете зробити його постійним, 
> вам потрібно змінити конфігураційний файл mysql.

- BEGIN транзакції
- COMMIT фіксує транзакцію
- ROLLBACK відкочує транзакцію

```sql
BEGIN
INSERT INTO user VALUES(NULL, 'A', 'a'); # ще не COMMIT, немає даних в базі даних
INSERT INTO user VALUE(NULL, 'B', 'b'); # ще не COMMIT, немає даних в базі даних
COMMIT; # в базі даних є дані для A та B
INSERT INTO user VALUES(NULL, 'C', 'c');
ROLLBACK; # відкочується назад, так, ніби останній запис ніколи не був введений
COMMIT; # немає даних для C, навіть якщо COMMIT, тому що він був відкочений
```