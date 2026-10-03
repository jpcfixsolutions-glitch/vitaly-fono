## Estructuras de carpetas del front.

Dentro de _src_ la idea es tener una carpeta por componente. 

El componente debe ser **atómico**, que realmente haga una cosa, por ejemplo un botón. Este botón puede recibir por props un método para que ejecute cierta acción, cierto label para darle un nombre. De esta manera, al atomizarlo, podemos usar este botón en los distintos componentes.

Estos componentes atómicos deben estar en la altura de _src_, para así poder asegurarnos que están disponibles para los demás componentes.

Si el componente es más complejo que un simple botón, por ejemplo ya cuando estemos trabajando con las distintas entidades, la idea es desglosarlo en componentes más simples. La estructura acá sería tener el componente complejo a la altura de _src_ y después dentro de este componente crear otra carpeta de componentes, que serían componentes simples que pertenecerían sólo para este componente complejo.

Entonces, en resumen, los componentes que sean atómicos y que puedan usarse en los demás componentes deben ir dentro de _src_ y los componentes que sean "subcomponentes" de un componente más complejo, deben ir dentro de una carpeta components dentro de la carpeta del componente que está en _src_.

Esto aplica también tanto para hooks, custom hooks, para utils.

Visualmente, un ejemplo sería:

```
 frontend     
 ├── public
 ├── src
 │    ├── assets
 │    └── components
 │          ├── index.js # este es un barril de importaciones y exp.
 │          ├── paymentMethod # componente complejo
 │          │    ├── components # subcomponentes del comp complejo
 │          │    ├── hooks # custom hooks propios del componente.
 │          │    ├── utils # utils propios del componente.
 │          │    ├── paymentMethod.jsx
 │          │    └── paymentMethod.css
 │          └── button # componente simple
 │                ├── button.jsx
 │                └── button.css
 ├── hooks # hooks o custom hooks para todos los componentes.           
 ├── utils # utils para todos los componentes.
 ├── App.jsx
 └── main.jsx
```
