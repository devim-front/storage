import { StrictService } from '@devim-front/service';

/**
 * Коллекция значений.
 */
type Values = Record<string, any>;

/**
 * Коллекция методов управления конкретного ключа из хранилища.
 */
type Field<T> = {
  /**
   * Возвращает текущее значение или undefined, если значения не существует.
   */
  get: () => T | undefined;

  /**
   * Задает новое значение или удаляет его, если в метод было передано
   * undefined.
   */
  set: (value: T | undefined) => void;

  /**
   * Возвращает true, если значение существует (не равно undefined).
   */
  has: () => boolean;
};

/**
 * Коллекция свойств хранилища.
 */
type Fields = Record<string, Field<any>>;

/**
 * Предоставляет механизм управления значениями, хранящимися в localStorage.
 * Если в проекте используется этот сервис, важно, чтобы все изменения в
 * localStorage были сделаны через него, так как в противном случае будет
 * происходить рассинхронизация между состоянием сервиса и хранилищем.
 */
export class Service extends StrictService {
  /**
   * Уникальный идентификатор проекта, использующего сервис.
   */
  private readonly id: string;

  /**
   * Создает экземпляр сервиса с указанным уникальным идентификатором.
   *
   * @param id Уникальный идентификатор проекта, используюшего этот сервис.
   * Так как несколько сайтов могут находиться на одном домене, то могут
   * возникать ситации, когда значения localStorage одного сайта перезаписывают
   * значения другого. Чтобы избежать этой ситуации, используется идентификатор.
   */
  public constructor(id: string) {
    super();
    this.id = id;
  }

  /**
   * Возвращает коллекцию значений, считанную из localStorage.
   */
  private readValues(): Values {
    if (typeof window === 'undefined') {
      return {};
    }

    const text = window.localStorage.getItem(this.id) || '{}';
    return JSON.parse(text);
  }

  /**
   * Сериализует и записывает указанную коллекцию значений в localStorage.
   *
   * @param values Коллекция значений.
   */
  private saveValues(values: Values) {
    if (typeof window === 'undefined') {
      return;
    }

    const text = JSON.stringify(values);
    window.localStorage.setItem(this.id, text);
  }

  /**
   * Коллекция ключей, которые были изменены в текущем цикле выполнения
   * приложения. После сохранения значений в localStorage эта коллекция
   * должна быть очищена.
   */
  private changed = new Map<string, true>();

  /**
   * Сохранённое значение свойства values.
   */
  private valuesCache: Values | undefined;

  /**
   * Коллекция всех значений, содержащихся в сервисе, сгруппированная по их
   * ключам. Содержимое коллекции может отличаться от того, что находится
   * в localStorage, так что при записи значений в коллекцию следует
   * производить синхронизацию.
   */
  private get values() {
    if (this.valuesCache == null) {
      this.valuesCache = this.readValues();
    }

    return this.valuesCache;
  }

  /**
   * Коллекция всех значений, содержащихся в сервисе, сгруппированная по их
   * ключам. Содержимое коллекции может отличаться от того, что находится
   * в localStorage, так что при записи значений в коллекцию следует
   * производить синхронизацию.
   */
  private set values(values: Values) {
    this.valuesCache = values;
  }

  /**
   * Присваивает новое значение указанному ключу. Следует помнить, что для
   * оптимизации реальная запись в localStorage происходит не в текущем, а
   * следующем цикле выполнения приложения. Если после обновления значений
   * программа будет принудительно завершена, то изменения не сохранятся. Чтобы
   * избежать этого, используйте метод flush.
   *
   * @param key Ключ.
   * @param value Новое значение.
   */
  public set(key: string, value: any) {
    if (value === undefined) {
      delete this.values[key];
    } else {
      this.values[key] = value;
    }

    if (this.changed.size === 0) {
      Promise.resolve().then(() => this.flush());
    }

    this.changed.set(key, true);
  }

  /**
   * Возвращает значение, соответствующее указанному ключу. Если данный ключ
   * не существует, будет возвращено undefined.
   *
   * @param key Ключ.
   */
  public get(key: string) {
    return this.values[key];
  }

  /**
   * Возвращает true, если значение по указанному ключу существует (не равно
   * undefined).
   *
   * @param key Кюч.
   */
  public has(key: string) {
    return this.get(key) !== undefined;
  }

  /**
   * Удаляет из сервиса все значения. Следует помнить, что для оптимизации
   * реальная запись в localStorage происходит не в текущем, а следующем
   * цикле выполнения приложения. Если после обновления значений программа
   * будет принудительно завершена, то изменения не сохранятся. Чтобы избежать
   * этого, используйте метод flush.
   */
  public clear() {}

  /**
   * Немедленно записывает значения из сервиса в localStorage. Служит для того,
   * чтобы избежать рассинхронизации localStorage и сервиса при принудительном
   * завершении программы.
   */
  public flush() {
    if (this.changed.size === 0) {
      return;
    }

    this.saveValues(this.values);
    this.changed.clear();
  }

  /**
   * Производит принудительное добавление значений из localStorage в сервис.
   * Если в сервисе пристутствуют несохранённые изменения, то они не будут
   * удалены. Данный метод следует использовать лишь тогда, когда по какой-то
   * вы собираетесь повторно считать все значения из localStorage, но не хотите
   * терять текущие изменения в коллекции значений. При стандартном
   * использовании сервиса нужды в данном методе не возникает.
   */
  public merge() {
    const currentValues = this.readValues();

    if (this.changed.size === 0) {
      this.values = currentValues;
      return;
    }

    const keys = Object.keys(currentValues);
    const { length } = keys;

    if (length === 0) {
      return;
    }

    for (let i = 0; i < length; i += 1) {
      const key = keys[i];

      if (this.changed.has(key)) {
        continue;
      }

      const currentValue = currentValues[key];
      this.values[key] = currentValue;
    }
  }

  /**
   * Производит принудительную замену всех значений сервиса содержимым
   * localStorage. Все несохранённые изменения будет потеряны. При нормальном
   * использовании сервиса нужды в данном методе не возникает.
   */
  public reset() {
    this.values = this.readValues();
  }

  /**
   * Коллекция значений, созданных методом field.
   */
  private fields: Fields = {};

  /**
   * Возвращает коллекцию функций для управления значением с указанным ключом
   * (get, has и set). Все функции коллекции имеют закрепелённый контекст
   * выполнения.
   *
   * @template T Тип значения с указанным ключом.
   * @param key Ключ значения.
   */
  public field<T = any>(key: string) {
    let field: Field<T> = this.fields[key];

    if (field == null) {
      field = {
        set: (value) => this.set(key, value),
        get: () => this.get(key),
        has: () => this.has(key),
      };

      this.fields[key] = field;
    }

    return field;
  }
}
