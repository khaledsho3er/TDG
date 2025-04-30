import React, { useState } from "react";

const PaymentMethod = ({ data }) => {
  const [editing, setEditing] = useState(false);
  const [method, setMethod] = useState(data);

  const handleSave = () => {
    // Call backend API to update payment method
    setEditing(false);
  };

  return (
    <div className="payment-method">
      <h3>Payment Method Setup</h3>
      {editing ? (
        <div>
          <input
            type="text"
            value={method.account}
            onChange={(e) => setMethod({ ...method, account: e.target.value })}
            placeholder="Bank Account or Wallet"
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p>Account: {method.account}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
