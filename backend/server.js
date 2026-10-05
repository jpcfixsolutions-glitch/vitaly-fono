import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config.js";
import { corsOptions } from "./src/middlewares/cors.js";
import { 
    additionalPatientInformationRoutes,
    adultAntecedentsAdditionalInfoRoutes,
    archiveAttachmentRoutes,
    authUserRoutes,
    calendarRoutes,
    cohabitantRoutes,
    documentTypeRoutes,
    fatherRoutes,
    firstInterviewRoutes,
    healthInsuranceRoutes,
    motherRoutes,
    patientRoutes,
    patientDischargeRoutes,
    paymentMethodRoutes,
    paymentHistoryRoutes,
    privilegeRoutes,
    roleRoutes,
    schoolingRoutes,
    sessionRoutes,
    siblingRoutes,
    turnRoutes,
    typeServiceRoutes,
    userRoutes
} from "./src/v1/routes/index.js";

const app = express();

app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/v1/usuarios", userRoutes);
app.use("/api/v1/auth", authUserRoutes);

app.use("/api/v1/informacion-adicional-pacientes", additionalPatientInformationRoutes)
app.use("/api/v1/antecedentes-adultos", adultAntecedentsAdditionalInfoRoutes);
app.use("/api/v1/metodo-pago", paymentMethodRoutes);
app.use('/api/v1/pacientes', patientRoutes);
app.use("/api/v1/turnos", turnRoutes);
app.use("/api/v1/obras-sociales", healthInsuranceRoutes);
app.use("/api/v1/tipos-documento", documentTypeRoutes);
app.use("/api/v1/configuraciones-calendario", calendarRoutes);
app.use("/api/v1/tipo-servicio", typeServiceRoutes);
app.use("/api/v1/sesion", sessionRoutes);
app.use("/api/v1/rol", roleRoutes);
app.use("/api/v1/privilegio", privilegeRoutes);
app.use("/api/v1/historial-cobro", paymentHistoryRoutes);
app.use("/api/v1/hermanos", siblingRoutes);
app.use("/api/v1/primeras-entrevistas", firstInterviewRoutes);
app.use("/api/v1/escolaridades", schoolingRoutes);
app.use("/api/v1/convivientes", cohabitantRoutes);
app.use("/api/v1/padres", fatherRoutes);
app.use("/api/v1/madres", motherRoutes);
app.use("/api/v1/cierre-tratamientos", patientDischargeRoutes);
app.use("/api/v1/archivos", archiveAttachmentRoutes);

if (!process.env.VERCEL) {
    app.listen(config.port, '0.0.0.0', () => {
        console.log(`Servidor levantado en http://localhost:${config.port}/`);
    });
}

export default app;
