import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Що можна тут знайти:',
    Svg: require('@site/static/img/technology_red.svg').default,
    description: (
      <>
        <ul>
          <li>Переклади статей</li>
          <li>Збережені інструкції</li>
          <li>Огляди прочитаних книг</li>
          <li>Пости з думками про різні речі</li>
        </ul>

        <br/>
        <b>Які цілі я переслідував при виборі способу структурування контенту:</b>
        <ul>
          <li>Статичний сайт</li>
          <li>Ніяких баз даних</li>
          <li>Пост як pull request</li>
          <li>Дві теми світла/темна</li>
          <li>Швидкий доступ до контенту</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Чому виник цей проект',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Дуже часто виникало бажання десь зберігати потрібний мені контент. Щось типу записної книги,
        тільки в електронному вигляді для матеріалів котрі зацікавили.
        Дуже не хотів вести стандартних блогів на відомих cms. Хотілось щось типу html, але без верстки. Тому було вибрано
        docusaurus). Як на мене, то це ідеальний варіант для розробників і взагалі людей з технічним бекграундом.
        Можливо мої нотатки і переклади будуть корисними ще комусь.
      </>
    ),
  },
  {
    title: 'Життєве кредо',
    Svg: require('@site/static/img/technology_red_right.svg').default,
    description: (
      <>
        <i>
          "Кожен з нас – це результат думок, що прийшли до нас в голову.
          Будьте завжди зосереджені на цілі.
          Сфокусуйте свій розум на тому, що ви хочете, і не думайте про те, чого не хочете.

          І пам'ятайте, мій друже: важливі не події, а ваша реакція на них.
          Тільки від вашого ставлення залежить, чи стануть події перешкодою або сходинкою.
          Якщо ви перечепилися за камінь – наступіть на нього, щоб піднятися вище".
          <br/>
          <div className="text--right">
              <b><code>Брюс Лі</code></b>
          </div>
        </i>
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
        <h3>{title}</h3>
      </div>
      <div className="text--justify padding-horiz--md">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
