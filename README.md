# Saper

## Plan

## 1.
* [x] Создать поле 9х9
* [x] Создать 10 бомб рандомно
  * [x] Вверху написать количество бомб и флаг
* [x] На правую кнопку мыши сделать выделение ячейки флагом.
  * [x] Уменьшается количество флагов в счётчике
  * [x] Запрет на открытие ячейки.( предполагается, что там бомба)
* [x] Второй клик показывает вопросик ( количество бомб в счётчике не уменьшается и ячейку можно выбрать.)
* [x] 3 клик на пр. кнопку мыши убирает маркеры.

## 2.
* [x] Вокруг бомб цифры в радиусе 3х3
  * [x] Цифра 1 говорит о том, что в данном радиусе 1 бомба
  * [x] Цифра 2 говорит о том, что в данном радиусе 2 бомбы
  * [x] Цифра 3 говорит о том, что в данном радиусе 3 бомбы
  * [x] Цифра 4 говорит о том, что в данном радиусе 4 бомбы etc.
  * [x] Сделать подсчёт цифр на основе количества бомб вокруг в радуисе 3х3

## 3.
* [x] Скрыть все ячейки
  * [x] Если открыта ячейка, то флаг поставть нельзя.
* [x] При клике на ячейку, где цифра, открываем 1 ячейку
* [x] При клике на пустую ячейку, открываем все пустые и 1 слой с цифрами.
  * [x] Открываем все пустые и в их радиусе 3Х3 цифры, но не бомбы.
* [x] При клике на бомбу, показываем все бомбы, а ту, на которую кликнули подсвечиваем красным.
* [x] Если открыл всё поле кроме бомб, то победа.
  * [x] Рестарт
* [x] При проигрыше задизейблить форму, чтобы нельзя было кликать
* [x] Сделать таймер

## 4
* [ ] Создать компонент, в который будет прокидываться
  * [ ] Количество бомб
  * [ ] Количество ячеек строки, столбцы
  * [ ] Написать уровни игры( новичок, средний, профи)