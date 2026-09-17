function DrawCirculo(x, y, radio, filled = null){
    return{
        type: 'circulo',
        x: x,
        y: y,
        radio: radio,
        filled: filled
    }
}

function DrawPoligono(puntos, filled = null){
    return{
        type: 'poligono',
        puntos: puntos,
        filled: filled
    }

}