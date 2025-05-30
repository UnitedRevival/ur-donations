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
import { usePaymentSuccess } from "../../hooks/usePaymentSuccess";
import CenteredLoader from "../loaders/CenteredLoader";
import { useRouter } from "next/router";
import { useCampaign } from '../../contexts/CampaignContext';

const PaymentCard = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { setStep } = useStepper();
  const { amountToDonate } = useContext(HomePageContext);
  const { currentCampaign } = useCampaign();

  const router = useRouter();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cardFocused, setCardFocused] = useState(false);
  const { paymentRequest, prLoading } = usePaymentRequest(amountToDonate);

  const source = router?.query?.source as string;
  const campaign = router?.query?.campaign as string;
  const currentCampaignroute = router.pathname;
  const routeCity = currentCampaignroute.split("/").pop()?.toLowerCase() || "";

  // Get the correct campaign title based on the URL
  const getCampaignTitle = () => {
    if (!routeCity || routeCity === 'index') {
      return "Jesus March 2025 - Miami- new";
    }

    // Remove "-event" suffix if present
    const cleanRouteCity = routeCity.replace(/-event$/i, '');

    // Convert to title case
    const formattedCity = cleanRouteCity
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return `Jesus March 2025 - ${formattedCity}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    donationType: getCampaignTitle(),
    amount: amountToDonate,
  });
  const handleSuccess = usePaymentSuccess(formData);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      donationType: getCampaignTitle()
    }));
  }, [routeCity]);

  useEffect(() => {
    if (paymentRequest && stripe) {
      const paymentMethodHandler = async function (ev) {
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const client_secret = await createPaymentIntentClientSecret({
          amount: amountToDonate,
          email: ev.payerEmail,
          utm: source,
          campaign: getCampaignTitle(),
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
      campaign: getCampaignTitle(),
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

export const StyledCard = styled(CardElement) <{ focused: boolean }>`
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
