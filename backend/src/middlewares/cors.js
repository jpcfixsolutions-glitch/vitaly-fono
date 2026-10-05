const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.56.1:5173',
  'http://192.168.0.255:5173',
  process.env.FRONTEND_URL || 'https://vitalyweb-jpcfix.vercel.app'
];

export const corsOptions = {
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
