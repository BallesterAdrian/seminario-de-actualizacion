class Calculadora extends HTMLElement {
  constructor() {
    super();

    this.display = document.createElement("input");
    this.display.type = "text";
    this.display.disabled = true;
    this.appendChild(this.display);

    this.botones = [
      ["7", "8", "9", "+"],
      ["4", "5", "6", "-"],
      ["1", "2", "3", "*"],
      ["0", ".", "=", "/"],
      ["BORRAR"]
    ];

    this.botones.forEach(fila => {
      let row = document.createElement("div");

      fila.forEach(texto => {
        let btn = document.createElement("button");
        btn.innerText = texto;

        btn.onclick = () => this.onClick(texto);

        row.appendChild(btn);
      });

      this.appendChild(row);
    });
  }

  onClick(valor) {
    if (valor === "BORRAR") {
      this.display.value = "";
    } else if (valor === "=") {
      try {
        this.display.value = eval(this.display.value);
      } catch {
        this.display.value = "Error";
      }
    } else {
      this.display.value += valor;
    }
  }
}

customElements.define("x-calculadora", Calculadora);