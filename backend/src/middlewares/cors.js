const allowedOrigins = ['http://localhost:5173', 'http://192.168.56.1:5173', 'http://192.168.0.255:5173', 'https://vitalyweb.vercel.app'];

export const corsOptions = {
  // yieeeeebboy
  // origin: function (origin, callback) { 
  //   // Verificamos si el origen de la petición está en la lista de orígenes permitidos
  //   if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
  //     // Si el origen está permitido o la solicitud no tiene un origen (por ejemplo, en desarrollo local), continuamos
  //     callback(null, true);
  //   } else {
  //     // Si el origen no está permitido, respondemos con un error.
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // },
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['Set-Cookie'],
};

