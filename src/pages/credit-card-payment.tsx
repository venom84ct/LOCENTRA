import React, { useEffect } from "react";

const CreditCardPayment: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <stripe-buy-button
        buy-button-id="buy_btn_1RaHNoQ9V4aAIaGVx1LiZX1z"
        publishable-key="pk_test_51RRT3EQ9V4aAIaGV7OjdmRNhg1lTln0Sx90T0r5dt98r9AhYH5onQ4Gu9dGpc67VZ2NlxRkdUq6Aeb0C9fKMPK8P00h8s2uaLB"
      ></stripe-buy-button>
    </div>
  );
};

export default CreditCardPayment;
