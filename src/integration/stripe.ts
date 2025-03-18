import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion,
});

export default stripe;
