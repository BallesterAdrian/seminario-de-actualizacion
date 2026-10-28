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
        this.btnCake = document.createElement('button'); 
        
        this.inputGrosor = document.createElement('input');
        this.inpuTypeLinea = document.createElement('input');

        this.selectEjercicio = document.createElement('select');
        
        // Contenedores separados para cada ejercicio
        this.contenedorEj6 = document.createElement('div');
        this.contenedorEj12 = document.createElement('div');
        this.contenedorEj19 = document.createElement('div');
        this.contenedorUNI = document.createElement('div');

        this.selectTipoFigura = document.createElement('select');
        let optCirculo = document.createElement('option');
        optCirculo.value = 'circulo';
        optCirculo.textContent = 'Círculo';
        
        let optPoligono = document.createElement('option');
        optPoligono.value = 'poligono';
        optPoligono.textContent = 'Polígono';
        
        this.selectTipoFigura.appendChild(optCirculo);
        this.selectTipoFigura.appendChild(optPoligono);

        this._canvas.width = 800;
        this._canvas.height = 600;
        this._canvas.style.border = '1px solid black';
        this.ctx = this._canvas.getContext('2d');

        this.inputGrosor.type = 'number';
        this.inputGrosor.placeholder = "Defina el grosor";
        this.inputGrosor.value = 1; 
        this.inpuTypeLinea.placeholder = "Linea punteada o continua";
        this.inpuTypeLinea.value = 'continua'; 
        
        this.btnCargarFigure.innerText = "Cargar figura";
        this.btnClear.innerText = "Limpiar";
        this.btnCake.innerText = "Cargar Torta";

        let opt6 = document.createElement('option');
        opt6.value = 'ej6';
        opt6.textContent = 'Ejercicio 6';
        opt6.selected = true;
        
        let opt12 = document.createElement('option');
        opt12.value = 'ej12';
        opt12.textContent = 'Ejercicio 12';

        let opt19 = document.createElement('option');
        opt19.value = 'ej19';
        opt19.textContent = 'Ejercicio 19';
        
        //appendChilds
        this.selectEjercicio.appendChild(opt6);
        this.selectEjercicio.appendChild(opt12);
        this.selectEjercicio.appendChild(opt19);
        this.contenedorUNI.appendChild(this.btnCargarFigure);
        this.contenedorUNI.appendChild(this.btnClear);
        this.contenedorEj12.appendChild(this.inputGrosor);
        this.contenedorEj12.appendChild(this.inpuTypeLinea);
        this.contenedorEj12.appendChild(this.contenedorUNI);
        this.contenedorEj19.appendChild(this.selectTipoFigura);
        this.contenedorEj19.appendChild(this.btnCake);
        this.contenedorEj19.appendChild(this.contenedorUNI);

        this.contenedorEj12.style.display = 'none';
        this.contenedorEj19.style.display = 'none';

        this.appendChild(this.selectEjercicio);
        this.appendChild(this.contenedorEj6);
        this.appendChild(this.contenedorEj12);
        this.appendChild(this.contenedorEj19);
        this.appendChild(this.contenedorUNI);
        this.appendChild(this._canvas);
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
            if (figure.type === 'cake') {
                this.drawCakeGraph(figure);
            } else if (figure.type === 'circulo') {
                this.ctx.arc(figure.x, figure.y, figure.radio, 0, 2 * Math.PI);
                this.ctx.stroke();
            } else if (figure.type === 'poligono' && figure.puntos && figure.puntos.length > 0) {
                this.ctx.moveTo(figure.puntos[0].x, figure.puntos[0].y);
                for (let j = 1; j < figure.puntos.length; j++) {
                    this.ctx.lineTo(figure.puntos[j].x, figure.puntos[j].y);
                }
                this.ctx.closePath();
                this.ctx.stroke();
            }
        }
    }

    clear(){
        this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
   
    connectedCallback() {
       console.log('Canvas agregado...');
       this.btnCargarFigure.onclick = this.onCargarClick.bind(this);
       this.btnClear.onclick = this.onClearClick.bind(this);
       this.btnCake.onclick = this.onCargarClick.bind(this); 
       this.selectEjercicio.onchange = this.onCambiarEjercicio.bind(this);
    }

    disconnectedCallback() {
        this.btnCargarFigure.onclick = null;
        this.btnClear.onclick = null;
        this.btnCake.onclick = null;
        this.selectEjercicio.onchange = null;
    }

    onCambiarEjercicio(event) {
        let ejercicio = event.target.value;
        this.inputGrosor.value = 1;
        this.inpuTypeLinea.value = 'continua';

        if (ejercicio === 'ej6') {
            this.contenedorEj6.style.display = 'block';
            this.contenedorEj12.style.display = 'none';
            this.contenedorEj19.style.display = 'none';
            
        } else if (ejercicio === 'ej12') {
            this.contenedorEj6.style.display = 'none';
            this.contenedorEj12.style.display = 'block';
            this.contenedorEj19.style.display = 'none';
    
        } else if (ejercicio === 'ej19') {
            this.contenedorEj6.style.display = 'none';
            this.contenedorEj12.style.display = 'none';
            this.contenedorEj19.style.display = 'block';
        }
    }
    
    drawCakeGraph(figure) {
        let valores = figure.valores;
        let total = 0;
        for (let i = 0; i < valores.length; i++) {
            total += valores[i];
        }

        let anguloFactor = (2 * Math.PI) / total;
        let inicio = 0;
        this.ctx.font = "14px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        for (let i = 0; i < valores.length; i++) {
            let fin = inicio + (valores[i] * anguloFactor);
            let medio = (inicio + fin) / 2;
            let colorAleatorio = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

            this.ctx.beginPath();
            this.ctx.moveTo(figure.x, figure.y);
            this.ctx.arc(figure.x, figure.y, figure.radio, inicio, fin);
            this.ctx.closePath();
            this.ctx.fillStyle = colorAleatorio;
            this.ctx.fill();
            this.ctx.stroke();

            let radioTexto = figure.radio * 0.65;
            let xt = figure.x + radioTexto * Math.cos(medio);
            let yt = figure.y + radioTexto * Math.sin(medio);
            let porcentaje = ((valores[i] / total) * 100).toFixed(1) + "%";
            let textoBase = (figure.textos && figure.textos[i]) ? figure.textos[i] : '';
            let textoFinal = textoBase ? (textoBase + " " + porcentaje) : porcentaje;

            this.ctx.fillStyle = 'black'; 
            this.ctx.fillText(textoFinal, xt, yt);

            inicio = fin;
        }
    }

    onCargarClick(event) {
        let jsonStr = window.prompt("Ingrese el objeto JSON para representar la figura:");
        if (jsonStr === null) return;

        try {
            let datos = JSON.parse(jsonStr);
            let tipoSeleccionado = null;

            if (event && event.target === this.btnCake) {
                tipoSeleccionado = 'cake'; 
            } else if (this.contenedorEj19.style.display === 'block' && this.selectTipoFigura) {
                tipoSeleccionado = this.selectTipoFigura.value; 
            }

            if (tipoSeleccionado && datos.type !== tipoSeleccionado) {
                alert("ERROR DE SEGURIDAD:\nEl JSON es de tipo '" + datos.type + "', pero tienes seleccionado '" + tipoSeleccionado + "'.\n\nNo se permite cargar figuras que no coincidan con la seleccion.");
                return; 
            }

            let grosorValor = parseInt(this.inputGrosor.value);
            let tipoLineaValor = this.inpuTypeLinea.value.trim();

            this.dispatchEvent(new CustomEvent('request', { 
                detail: { 
                    action: 'cargar',
                    datos: datos, 
                    tipoFigura: tipoSeleccionado || datos.type, 
                    tipoLinea: tipoLineaValor !== '' ? tipoLineaValor : 'continua',
                    grosor: !isNaN(grosorValor) && grosorValor > 0 ? grosorValor : 1
                },
                bubbles: true 
            }));
        } catch (e) {
            alert("Error: El texto ingresado no es un JSON valido.");
        }
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
            let datos = detail.datos; 
            let x = datos.x !== undefined ? datos.x : Math.floor(Math.random() * 650) + 50;
            let y = datos.y !== undefined ? datos.y : Math.floor(Math.random() * 450) + 50;

            if (datos.type === 'circulo') {
                let radio = datos.radio !== undefined ? datos.radio : 30; 
                nuevaFigura = DrawCirculo(x, y, radio);

            } else if (datos.type === 'poligono') {

                if (datos.puntos && Array.isArray(datos.puntos)) {
                    nuevaFigura = DrawPoligono(datos.puntos);
                } else {
                    nuevaFigura = DrawPoligono([
                        { x: x, y: y },
                        { x: x + 40, y: y + 60 },
                        { x: x - 40, y: y + 60 }
                    ]);
                }
            } else if (datos.type === 'cake') {
                        let x = datos.x || 400;
                        let y = datos.y || 300;
                        let radio = datos.radio || 150;
                        
                        nuevaFigura = DrawCakeGraph(x, y, radio, datos.valores); 
                    }

            if (nuevaFigura) {
                nuevaFigura.tipoLinea = detail.tipoLinea || 'continua';
                nuevaFigura.grosor = detail.grosor || 1;
                this._model.addFigure(nuevaFigura);
            }

        } else if (action === 'limpiar') {
            this._model.ClearFigure();
        }
    }
}