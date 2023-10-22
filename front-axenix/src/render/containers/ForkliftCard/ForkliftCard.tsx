import "./style.scss";

export const ForkliftCard = ({ selectedFork }) => {
  return (
    <div className="fork-card">
      <div className="fork-card__title">Отчёт по погрузчику:</div>

      {!selectedFork && <div className="fork-card__empty">Нет выбранного погрузчика</div>}
    </div>
  );
};
