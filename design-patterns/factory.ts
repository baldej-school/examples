/**
 * Пример реализации паттерна «Фабрика».
 * Статья в Telegra.ph: https://telegra.ph/Design-Patterns-Factory-07-04
 * Подписаться на канал в Telegram: https://t.me/+XqVR3di_u7M2N2Zi
 *
 * Задача:
 * Представим себя разработчиком балдежного Нетфликса.
 * Нам надо написать код, который создает фильмы или сериалы.
 */

/**
 * Для начала создадим интерфейс продукта, который будет выпускать наш Нетфликс.
 */
interface IProduct {
  /**
   * Продукт можно выпустить в прокат, чтобы люди его посмотрели
   */
  release(): void;
}

/**
 * Теперь создаем первый продукт – фильм.
 * Его просто запустить в прокат.
 */
class Movie implements IProduct {
  public release(): void {
    console.log("Фильм выпущен!");
  }
}

/**
 * А теперь создадим второй продукт – сериал.
 * Сериал сложнее выпускать, так как надо выпускать по одной серии в неделю.
 */
class Series implements IProduct {
  public totalCount: number = 10;
  private releasedCount: number = 0;

  public release(): void {
    if (this.releasedCount < this.totalCount) {
      this.releasedCount += 1;

      console.log(`Серия #${this.releasedCount} выпущена!`);

      // Выпускаем новую серию через неделю
      setTimeout(() => {
        this.release();
      }, 1000 * 60 * 60 * 24 * 7);
    }
  }
}

/**
 * Создадим «Production» (Creator).
 * Этот класс умеет работать с нашими продуктами, но не умеет их создавать.
 * Фишка в том, что этот класс нельзя создать, так как он абстрактный.
 *
 * А вот его наследники, уже смогут реализовать метод создания продукта.
 */
abstract class Production {
  public abstract createProduct(): IProduct;

  public release(product: IProduct): void {
    product.release();

    console.log("У нас новинка! Спешите посмотреть!");
  }
}

/**
 * Этот класс тоже «Создатель». Только уже не абстрактный, а обычный.
 * Поскольку он наследуется от базового класса Production, у него есть метод «release».
 *
 * Однако, из-за того, что он обычный, мы вынуждены реализовать метод создания продукта.
 * И этот класс будет создавать фильмы.
 */
class MovieProduction extends Production {
  public createProduct(): IProduct {
    return new Movie();
  }
}

/**
 * Здесь все точно также, как и с MovieProduction, только создаем мы сериалы.
 */
class SeriesProduction extends Production {
  public createProduct(): IProduct {
    return new Series();
  }
}

/**
 * А эта функция отвечает за создание и выпуск нового продукта в мир!
 *
 * Мы просим ее создать либо фильм, либо сериал.
 * Дальше, функция понимает, какого «создателя» нужно использовать и создает новый продукт.
 * После этого, она выпускает этот продукт в прокат.
 */
function runNewProduct(type: string) {
  let production: Production;

  switch (type) {
    case "movie":
      production = new MovieProduction();
      break;

    case "series":
      production = new SeriesProduction();
      break;

    default:
      throw new Error("Мы такие продукты пока делать не умеем!");
  }

  const product = production.createProduct();

  production.release(product);
}
