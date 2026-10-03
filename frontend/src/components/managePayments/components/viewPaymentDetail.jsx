import React from "react";
import "./viewPaymentDetail.css";

export const ViewPaymentDetail = ({ payment }) => {
  if (!payment) return <p className="text-muted" style={{ margin: 0 }}>Sin datos del cobro seleccionado.</p>;

  const amountDisplay = typeof payment.amount === "number"
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(payment.amount)
    : payment.amount;

  const statusLower = String(payment.status || "").toLowerCase();
  const statusLabel = statusLower === "pagada" ? "Cobrado" : (statusLower === "anulado" ? "Anulado" : null);
  const statusCls = statusLower === "pagada" ? "status-active" : (statusLower === "anulado" ? "status-inactive" : "");

  return (
    <div className="payment-detail-container">
      <div className="payment-detail-grid">
        <div className="detail-item">
          <div className="icon-container-detail-payment">
            <i className="fa fa-user"></i>
          </div>
          <div className="detail-text">
            <p className="label">Paciente</p>
            <p className="value"><b>{payment.name || "-"} {payment.last_name || ""}</b></p>
          </div>
        </div>

        <div className="detail-item">
          <div className="icon-container-detail-payment">
            <i className="fa fa-calendar-alt"></i>
          </div>
          <div className="detail-text">
            <p className="label">Fecha de Cobro</p>
            <p className="value"><b>{payment.paid_at || "-"}</b></p>
          </div>
        </div>

        <div className="detail-item">
          <div className="icon-container-detail-payment">
            <i className="fa fa-file-medical"></i>
          </div>
          <div className="detail-text">
            <p className="label">Servicio</p>
            <p className="value"><b>{payment.service_name || "-"}</b></p>
          </div>
        </div>

        <div className="detail-item">
          <div className="icon-container-detail-payment">
            <i className="fa fa-hand-holding-usd"></i>
          </div>
          <div className="detail-text">
            <p className="label">Monto</p>
            <p className="value"><b>{amountDisplay || "-"}</b></p>
          </div>
        </div>

        <div className="detail-item">
          <div className="icon-container-detail-payment">
            <i className="fa fa-credit-card"></i>
          </div>
          <div className="detail-text">
            <p className="label">Método de pago</p>
            <p className="value"><b>{payment.payment_method_name || "-"}</b></p>
          </div>
        </div>

        <div className="detail-item">
          <div className="icon-container-detail-payment">
            <i className="fa fa-shield-alt"></i>
          </div>
          <div className="detail-text">
            <p className="label">Obra social</p>
            <p className="value"><b>{payment.health_insurance_name || "-"}</b></p>
          </div>
        </div>

        {statusLabel && (
          <div className={`detail-item status ${statusCls}`}>
            <div className="icon-container-detail-payment">
              <i className={`fa ${statusLower === 'pagada' ? 'fa-check-circle' : 'fa-ban'}`}></i>
            </div>
            <div className="detail-text">
              <p className="label">Estado</p>
              <p className="value">
                <span className={`status-badge ${statusCls}`}>{statusLabel}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="notes-section">
        <p className="label" style={{ marginBottom: 8 }}>Notas</p>
        <div className="notes-box">
          {payment.notes ? payment.notes : <span className="text-muted">Sin notas</span>}
        </div>
      </div>
    </div>
  );
};


