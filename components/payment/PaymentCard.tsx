import * as React from "react";
import styled from "styled-components";
import {
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import Divider from "../dividers/Divider";
import { HomePageContext } from "../../contexts/HomePageContext";
import { useStepper } from "../../contexts/StepContext";
import SecondaryButton from "../buttons/SecondaryButton";
import axios from "axios";
import Label from "../inputs/Label";
import LabeledInput from "../inputs/LabeledInput";
import usePaymentRequest from "../../hooks/usePaymentRequest";
import usePaymentSuccess from "../../hooks/usePaymentSuccess";
import CenteredLoader from "../loaders/CenteredLoader";
import { useRouter } from "next/router";

const PaymentCard = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { setStep } = useStepper();
  const { amountToDonate } = useContext(HomePageContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    donationType: "",
    amount: amountToDonate,
  });
  const handleSuccess = usePaymentSuccess(formData);

  const router = useRouter();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cardFocused, setCardFocused] = useState(false);
  const { paymentRequest, prLoading } = usePaymentRequest(amountToDonate);

  const source = router?.query?.source as string;
  const campaign = router?.query?.campaign as string;
  const currentCampaignroute = router.pathname;
  const routeCity = currentCampaignroute.split("/").pop()?.toLowerCase() || "";
  const campaigns = {
    JESUS_MARCH_2025_MIAMI: {
      title: "Jesus March 2025 - Miami",
      goal: 12500,
    },
    JESUS_MARCH_2025_BOSTON: {
      title: "Jesus March 2025 - Boston",
      goal: 12500,
    },
    JESUS_MARCH_2025_NYC: {
      title: "Jesus March 2025 - New York City",
      goal: 12500,
    },
    JESUS_MARCH_2025_ATL: {
      title: "Jesus March 2025 - Atlanta",
      goal: 12500,
    },
    JESUS_MARCH_2025_DENVER: {
      title: "Jesus March 2025 - Denver",
      goal: 12500,
    },
    JESUS_MARCH_2025_HOUSTON: {
      title: "Jesus March 2025 - Houston",
      goal: 12500,
    },
    JESUS_MARCH_2025_HUNTINGTON_BEACH: {
      title: "Jesus March 2025 - Huntington Beach",
      goal: 12500,
    },
    JESUS_MARCH_2025_SACRAMENTO: {
      title: "Jesus March 2025 - Sacramento",
      goal: 12500,
    },
    JESUS_MARCH_2025_WASHINGTON_DC: {
      title: "Jesus March 2025 - Washington DC",
      goal: 12500,
    },
    JESUS_MARCH_2025_BOSTON_EVENT: {
      title: "Jesus March 2025 - Boston-Event",
      goal: 12500,
    },
    JESUS_MARCH_2025_NYC_EVENT: {
      title: "Jesus March 2025 - New York City-Event",
      goal: 12500,
    },
    JESUS_MARCH_2025_ATL_EVENT: {
      title: "Jesus March 2025 - Atlanta-Event",
      goal: 12500,
    },
    JESUS_MARCH_2025_DENVER_EVENT: {
      title: "Jesus March 2025 - Denver-Event",
      goal: 12500,
    },
    JESUS_MARCH_2025_HOUSTON_EVENT: {
      title: "Jesus March 2025 - Houston-Event",
      goal: 12500,
    },
    JESUS_MARCH_2025_HUNTINGTON_BEACH_EVENT: {
      title: "Jesus March 2025 - Huntington Beach-Event",
      goal: 12500,
    },
    JESUS_MARCH_2025_SACRAMENTO_EVENT: {
      title: "Jesus March 2025 - Sacramento-Event",
      goal: 12500,
    },
    JESUS_MARCH_2025_WASHINGTON_DC_EVENT: {
      title: "Jesus March 2025 - Washington DC-Event",
      goal: 12500,
    },
  };
 const donationTypeCampaign = Object.keys(campaigns).reduce(
   (result: string | null, key: string) => {
     const campaign = campaigns[key];
     // If routeCity is undefined or empty, return null immediately
     if (!routeCity || typeof routeCity !== "string") {
       return null;
     }
 
     const normalizedTitle = campaign.title.toLowerCase().replace(/[\s-]/g, '');
     const normalizedRouteCity = routeCity.toLowerCase().replace(/[\s-]/g, '');
 
     if (normalizedTitle.includes(normalizedRouteCity)) {
       // Ensure result is a string before calling toLowerCase
       if (result && !result.toLowerCase().includes("event")) {
         return result;
       }
       if (
         routeCity.toLowerCase().includes("event") &&
         campaign.title.toLowerCase().includes("event")
       ) {
         return campaign.title;
       }
       if (
         !routeCity.toLowerCase().includes("event") &&
         !campaign.title.toLowerCase().includes("event")
       ) {
         return campaign.title;
       }
       return campaign.title;
     }
     return result;
   },
   null
 );
 
 useEffect(() => {
   setFormData((prev) => ({
     ...prev,
     donationType: donationTypeCampaign || "Jesus March 2024",
   }));
 }, [donationTypeCampaign]);
  useEffect(() => {
    
    if (paymentRequest && stripe) {
      const paymentMethodHandler = async function (ev) {
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const client_secret = await createPaymentIntentClientSecret({
          amount: amountToDonate,
          email: ev.payerEmail,
          utm: source,
          campaign,
        });
        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            client_secret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

        if (confirmError) {
          console.error("Confirmation Error: ", confirmError);
          setError(confirmError?.message);
          ev.complete("fail");
        } else {
          ev.complete("success");
          if (paymentIntent.status === "requires_action") {
            // Let Stripe.js handle the rest of the payment flow.
            const { error } = await stripe.confirmCardPayment(client_secret, {
              payment_method: ev.paymentMethod.id,
            });

            if (error) {
              // The payment failed
              console.error("ERROR with wallet pay: ", error);
              setError(
                "There was a problem with the payment, please choose a different payment method."
              );
              return;
            }
          }
         
          handleSuccess();
        }
      };
      paymentRequest.on("paymentmethod", paymentMethodHandler);
      return () => {
        paymentRequest.off("paymentmethod", paymentMethodHandler);
      };
    }
  }, [!!paymentRequest, !!stripe]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null || stripe == null) {
      return;
    }
    if (!formData?.email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    const client_secret = await createPaymentIntentClientSecret({
      amount: amountToDonate,
      email: formData.email,
      utm: source,
      campaign,
    });
  

    const result = await stripe.confirmCardPayment(client_secret!, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: formData.name,
          email: formData.email,
        },
      },
    });
 
    if (result.error) {
      console.log(result.error);
      setError("Failed to charge card: " + result.error.message);
    } else {
      // The payment has been processed!

      if (result.paymentIntent.status === "succeeded") {

        handleSuccess();
      } else {
        console.error(
          "paymentIntent has been processed and the status was not succeeded: ",
          result
        );
      }
    }

    setLoading(false);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title>Payment</Title>
      <Divider />
      {prLoading ? (
        <CenteredLoader color="#000000" />
      ) : paymentRequest ? (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      ) : null}

      <LabeledInput
        inputId={"name"}
        label="Name"
        placeholder="Name"
        required
        value={formData.name}
        disabled={loading}
        onChange={onChange}
      />
      <LabeledInput
        inputId={"email"}
        label="Email"
        placeholder="Email"
        type="email"
        required
        value={formData.email}
        disabled={loading}
        onChange={onChange}
      />
      <StyledCard
        focused={cardFocused}
        options={{ disabled: loading }}
        onFocus={() => {
          setCardFocused(true);
        }}
        onBlur={() => {
          setCardFocused(false);
        }}
      />
      {!!error && <ErrorText>{error}</ErrorText>}
      <PrimaryButton
        // variant="large"
        fullWidth
        type="submit"
        loading={loading}
        disabled={!elements || !stripe || loading}
      >
        Submit Payment - ${amountToDonate}
      </PrimaryButton>

      {!loading && (
        <SecondaryButton
          type="button"
          fullWidth
          // variant="large"
          onClick={() => {
            setStep(0);
          }}
        >
          Back
        </SecondaryButton>
      )}
    </form>
  );
};

async function createPaymentIntentClientSecret({
  amount,
  email,
  utm,
  campaign,
}: {
  amount: number;
  email: string;
  utm?: string;
  campaign?: string;
}) {
  const response = await axios.post("/api/paymentIntent", {
    amount: amount * 100,
    email,
    utm,
    campaign,
  });
 
  const client_secret = response.data?.client_secret;
  return client_secret as string;
}

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};

  padding: 1rem;

  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.colors.error}22;

  border-radius: ${({ theme }) => theme.borderRadius};
`;

export const Title = styled.h2`
  text-align: center;
`;

export const StyledCard = styled(CardElement)<{ focused: boolean }>`
  margin-top: 0.5rem;
  margin-bottom: 2rem;

  background-color: white;
  padding: 1rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius}px;

  box-sizing: border-box;

  cursor: pointer;
  width: 100%;
  transition: 0.1s all linear;
  border: 1px solid
    ${({ theme, focused }) =>
      focused ? theme.colors.primary : theme.colors.light};

  ${({ theme, focused }) =>
    focused ? `outline: 3px solid ${theme.colors.primary}66;` : ""};
`;

export default PaymentCard;
