import { ButtonInfo, ButtonDeactivate } from '../../'; // Assuming these are in component root
import { XCircle } from 'lucide-react';

export const RowActions = ({ row, filteredPayments, setViewPayment, setDataDeactivate, isAnulado }) => (
  <>
    <ButtonInfo
      id={`${row._id}-view`}
      onClick={() => {
        const original = filteredPayments.find(p => p._id === row._id) || null;
        setViewPayment(original || null);
      }}
      dataBsToggle="modal"
      dataBsTarget="#viewPaymentModal"
      className="action-btn--info"
    />
    <ButtonDeactivate
      id={`${row._id}`}
      onClick={() => setDataDeactivate({ 
        id: row._id, 
        name: row.name, 
        last_name: row.last_name, 
        paid_at: row.paid_at,
        all: row
      })}
      dataBsToggle="modal"
      dataBsTarget="#deactivatePaymentHistoryModal"
      IconComponent={XCircle}
      disabled={isAnulado}
    />
  </>
);

