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
        this._canvas.width = 800;
        this._canvas.height = 600;
        this._canvas.style.border = '1px solid black';
        this.ctx = this._canvas.getContext('2d');
        this.appendChild(this._canvas);
    }
    
    render(figures){
        //renderFunction( this._canvas );       
        for(let i = 0; i < figures.length; i++){
            let figure = figures[i];
            this.ctx.beginPath();
        
        if(figure.type === 'circulo'){
            this.ctx.arc(figure.x, figure.y, figure.radio, 0, 2 * Math.PI);
        }
        else if(figure.type === 'poligono' && figure.puntos.length > 0){
            this.ctx.moveTo(figure.puntos[0].x, figure.puntos[0].y);
            for(let j = 1; j < figure.puntos.length; j++){
                this.ctx.lineTo(figure.puntos[j].x, figure.puntos[j].y);
            }
            
            this.ctx.closePath();
        }
            this.ctx.stroke();
        }
    }

    clear()
    {
        this.ctx.clearRect(0,0,this._canvas.width,this._canvas.height );
        console.log('Limpiooo');
    }
   
    connectedCallback() {
       console.log('Canvas agregado...')
    }
    disconnectedCallback() {
        
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
       
    }
}