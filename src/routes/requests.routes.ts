import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as requestsService from '../services/requests.service.js';
import { SolicitudInput } from '../models/solicitud.model.js';

export const requestsRouter = Router();

requestsRouter.use(requireAuth);

requestsRouter.get('/prefill', (req, res) => {
  const datos = requestsService.getDatosPrecargados(req.clienteId!);
  if (!datos) {
    res.status(404).json({ error: 'cliente_no_encontrado' });
    return;
  }
  res.json(datos);
});

requestsRouter.post('/', (req, res) => {
  const body = req.body as Partial<SolicitudInput>;

  if (
    typeof body.productoId !== 'string' ||
    typeof body.ingresos !== 'number' ||
    typeof body.ocupacion !== 'string' ||
    typeof body.egresos !== 'number' ||
    typeof body.montoSolicitado !== 'number' ||
    body.aceptaTerminos !== true ||
    body.aceptaAutorizacionCentralRiesgo !== true
  ) {
    res.status(400).json({ error: 'solicitud_invalida' });
    return;
  }

  const resultado = requestsService.enviarSolicitud(req.clienteId!, body as SolicitudInput);
  res.status(resultado.ok ? 201 : 422).json(resultado);
});

requestsRouter.get('/mine', (req, res) => {
  res.json(requestsService.getMisSolicitudes(req.clienteId!));
});
