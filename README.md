# Devim Front: React Route

Содержит сущности для роутинга в React.

## Установка

Подключите этот пакет в зависимости:

```bash
npm i -S @devim-front/react-route
```

## Общие концепции

Маршрут - это [ленивый сервис](https://github.com/devim-front/service#%D0%BB%D0%B5%D0%BD%D0%B8%D0%B2%D1%8B%D0%B9-%D1%81%D0%B5%D1%80%D0%B2%D0%B8%D1%81), который отвечает за маршрутизацию в React-приложении. Маршруты предоставляют унифицированный и строго типизированный способ работы с сущностями библиотеки [react-router](https://github.com/ReactTraining/react-router).

Сущность маршрута имеет маску адреса страницы и компонент - представление, который должен обрабатывать этот маршрут. Когда в браузере меняется адрес страницы, все маршруты, подключённые к дерево React проверяют, соответствует ли их маскам этот адрес, и, если соответствует, то монтирует обработчики. Рассмотрим каждый атрибут маршрута.

### Маска адреса страницы

В классе маршрута представлена свойством `path`. По нотации и поведению полностью аналогична свойству `path` из компонента [Route](https://reacttraining.com/react-router/web/api/Route/path-string-string) (в отличии от `Route.path` не поддерживает массив строк). Подробнее о синтаксисе масок можно прочитать в описании библиотеки [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

Маска может иметь именованные параметры. В таком случае их нужно указать в generic-типе `Route`:

```ts
import { Route } from '@devim-front/react-route';

type Params = { id: number };

export class ArticleRoute extends Route<Params> {
  public path = 'article/:id';
}
```

### Обработчик маршрута

Обработчик маршрута (он же представление) - это компонент, который монтируется в дерево React, когда адрес страницы совпадает с маской адреса. У этого компонента не должно быть свойств, помеченных как `required`. Пример объявления свойства:

```tsx
import { Route } from '@devim-front/react-route';

type Params = { id: number };

const ArticleView = () => <div>It works!</div>;

export class ArticleRoute extends Route<Params> {
  public path = 'article/:id';
  public component = ArticleView;
}
```

### Флаг "exact"

Помимо обработчика и маски, у маршрута так же есть флаг `exact`, который работает точно так же, как свойство `exact` у компонента [Route](https://reacttraining.com/react-router/web/api/Route/exact-bool).

### Подключение маршрута в приложение

По сути, маршрут просто предоставляет интерфейс для сущностей из библиотеки `react-router`. У класс есть метод `render`, который возвращает элемент React, предзаполняя его свойства из переменных класса. Таким образом, подключение маршрута в дерево выглядит так:

```tsx
import React, { FC } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import { ArticleRoute } from './ArticleRoute';
import { NotFoundRoute } from './NotFoundRoute';

export const App: FC = () => (
  <BrowserRouter>
    <Switch>
      {ArticleRoute.get().render()}
      {NotFoundRoute.get().render()}
    </Switch>
  </BrowserRouter>
);
```

### Перенаправления

Также маршрут умеет генерировать элементы [Redirect](https://reacttraining.com/react-router/web/api/Redirect), предзаполняя его свойства. За это отвечают методы [redirect](https://github.com/devim-front/react-route/blob/master/docs/classes/route.md#markdown-header-redirect) (перенаправление с записью в браузерной истории) и [replace](https://github.com/devim-front/react-route/blob/master/docs/classes/route.md#markdown-header-replace) (без записи в браузерной истории). К примеру, перенаправление на страницу авторизации, если токен авторизации не указан:

```tsx
import React, { FC } from 'react';

import { useAuthToken } from './useAuthToken';
import { AuthRoute } from './AuthRoute';

export const Account: FC = () => {
  const token = useAuthToken();

  if (token == null) {
    return AuthRoute.get().replace();
  }

  return <div>Dashboard</div>;
};
```

## API

Документация находится [в этом разделе](https://github.com/devim-front/react-route/tree/master/docs).
