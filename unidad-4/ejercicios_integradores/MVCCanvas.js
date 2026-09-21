class Model extends EventTarget {
    constructor() {
        super();
        this.figures = [];
    }
    
    addFigure(figure){
        this.figures.push(figure);
        this.changed();
    }

    ClearFigure(){
        this.figures = [];
        this.changed();
    }

    changed() {
        this.dispatchEvent(new CustomEvent('changed'));
    }
}

class View extends HTMLElement {
    constructor() 
    {
        super();
        this._canvas = document.createElement('canvas');
        this.btnCargarFigure = document.createElement('button');
        this.btnClear = document.createElement('button');
        this.inputGrosor = document.createElement('input');
        this.inpuTypeLinea = document.createElement('input');

        this._canvas.width = 800;
        this._canvas.height = 600;
        this._canvas.style.border = '1px solid black';
        this.ctx = this._canvas.getContext('2d');

        this.inputGrosor.type = 'number';

        this.inputGrosor.placeholder = "Defina el grosor";
        this.inpuTypeLinea.placeholder = "Linea punteada o continua";
        this.btnCargarFigure.innerText = "Cargar figura";
        this.btnClear.innerText = "Limpiar";

        this.appendChild(this._canvas);
        this.appendChild(this.btnCargarFigure);
        this.appendChild(this.btnClear);
        this.appendChild(this.inputGrosor);
        this.appendChild(this.inpuTypeLinea);

    }
    
    render(figures) {
    this.clear();
    for (let i = 0; i < figures.length; i++) {
        let figure = figures[i];

        this.ctx.beginPath();
        this.ctx.lineWidth = figure.grosor || 1;
        let tipo = (figure.tipoLinea || '').toLowerCase().trim();
            if (tipo === 'punteada') {
                this.ctx.setLineDash([5, 5]);
            } else {
                this.ctx.setLineDash([]);
            }
        if (figure.type === 'circulo') {

            this.ctx.arc(figure.x, figure.y, figure.radio, 0, 2 * Math.PI);

        } else if (figure.type === 'poligono' && figure.puntos.length > 0) {

            this.ctx.moveTo(figure.puntos[0].x, figure.puntos[0].y);

            for (let j = 1; j < figure.puntos.length; j++) {

                this.ctx.lineTo(figure.puntos[j].x, figure.puntos[j].y);
            }
            this.ctx.closePath();
        }
        this.ctx.stroke();
    }
}

    clear(){
        this.ctx.clearRect(0,0,this._canvas.width,this._canvas.height );
    }
   
    connectedCallback() {
       console.log('Canvas agregado...');
       this.btnCargarFigure.onclick = this.onCargarClick.bind(this);
       this.btnClear.onclick = this.onClearClick.bind(this);
    }
    disconnectedCallback() {
        this.btnCargarFigure.onclick = null;
        this.btnClear.onclick = null;
    }
    
    onCargarClick() {
        let grosorValor = parseInt(this.inputGrosor.value);
        let tipoLineaValor = this.inpuTypeLinea.value.trim();
        this.dispatchEvent(new CustomEvent('request', { 
            detail: { action: 'cargar',
                tipoLinea: tipoLineaValor !== '' ? tipoLineaValor : 'continua',
                grosor: !isNaN(grosorValor) && grosorValor > 0 ? grosorValor : 1
             },
            bubbles: true 
        }));
    }

    onClearClick() {
        this.dispatchEvent(new CustomEvent('request', { 
            detail: { action: 'limpiar' },
            bubbles: true 
        }));
    }

    _onSave() {
       
    }
}
customElements.define('x-view', View);


class Controller {
    constructor(view, model) {
        this._view = view;
        this._model = model;
        this._onModelChanged = this.onModelChanged.bind(this);
        this._onViewRequest = this.onViewRequest.bind(this);
    }
    enable() {
        this._model.addEventListener('changed', this._onModelChanged);
        this._view.addEventListener('request', this._onViewRequest);
    }
    disable() {
        this._model.removeEventListener('changed', this._onModelChanged);
        this._view.removeEventListener('request', this._onViewRequest);
    }
    onModelChanged() {
       this._view.render(this._model.figures); 
    }
    onViewRequest(event) {
      const detail = event.detail;
        const action = detail.action;

        if (action === 'cargar') {
            let nuevaFigura;
            let x = Math.floor(Math.random() * 650) + 50;
        let y = Math.floor(Math.random() * 450) + 50;

        // Generamos un número del 0 al 2 para elegir qué tipo de figura crear
        let tipoAleatorio = Math.floor(Math.random() * 3);

        if (tipoAleatorio === 0) {
            // 1. Círculo
            nuevaFigura = DrawCirculo(x, y, 30);

        } else if (tipoAleatorio === 1) {
            // 2. Polígono: Triángulo
            nuevaFigura = DrawPoligono([
                { x: x, y: y },
                { x: x + 40, y: y + 60 },
                { x: x - 40, y: y + 60 }
            ]);

        } else {
            // 3. Polígono: Cuadrado
            let lado = 50;
            nuevaFigura = DrawPoligono([
                { x: x, y: y },
                { x: x + lado, y: y },
                { x: x + lado, y: y + lado },
                { x: x, y: y + lado }
            ]);
        }

            nuevaFigura.tipoLinea = detail.tipoLinea || 'continua';
            nuevaFigura.grosor = detail.grosor || 1;

            this._model.addFigure(nuevaFigura);

        } else if (action === 'limpiar') {
            this._model.ClearFigure();
        }
    }
}