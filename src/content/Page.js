export default function Page() {
  return (
    <div className="page">
      <section className="part__start">
        <h1 style={{ fontSize: 128, color: "black", textShadow: "none" }}>
          three.js
        </h1>
      </section>
      <section className="part__title">
        <h1>Bear vs Witch</h1>
      </section>
      <section className="part__stats--bear">
        <h1>Bear stats</h1>
      </section>
      <section className="part__stats--witch">
        <h1>Witch Stats</h1>
      </section>
      <section className="part__title">
        <h1>Winner?</h1>
      </section>
    </div>
  );
}
