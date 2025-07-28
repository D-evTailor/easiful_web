/**
 * Firebase Cloud Functions para la integración de Stripe
 * Maneja la creación de sesiones de checkout y los webhooks de Stripe
 */

import {setGlobalOptions, logger} from "firebase-functions";
import {onCall, HttpsError, onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import Stripe from "stripe";
import * as functions from "firebase-functions";

// Inicializar Firebase Admin
initializeApp();
const db = getFirestore();

// Configuración global de funciones
setGlobalOptions({maxInstances: 10});

/**
 * Helper function para obtener Stripe instance
 * @return {Stripe} Stripe instance configurada
 */
function getStripe(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY ||
                          functions.config().stripe?.secret_key;

  if (!stripeSecretKey) {
    throw new Error("Stripe secret key is not configured");
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: "2025-06-30.basil",
    typescript: true,
  });
}

/**
 * Función Cloud Function para crear una sesión de Stripe Checkout
 * Se llama desde el frontend cuando un usuario quiere suscribirse
 */
export const createStripeCheckoutSession = onCall(
  {
    cors: ["http://localhost:3000", "https://localhost:3000"],
  },
  async (request) => {
  // Verificar autenticación
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Debes estar autenticado para realizar esta acción."
      );
    }

    const userId = request.auth.uid;
    const {priceId, successUrl, cancelUrl} = request.data;

    // Validar parámetros requeridos
    if (!priceId || !successUrl || !cancelUrl) {
      throw new HttpsError(
        "invalid-argument",
        "Faltan parámetros requeridos: priceId, successUrl, cancelUrl."
      );
    }

    try {
    // Inicializar Stripe dentro de la función
      const stripe = getStripe();

      const logMessage = "Creando sesión de checkout para usuario: ";
      logger.info(`${logMessage}${userId}, priceId: ${priceId}`);

      // Verificar si el usuario existe en Firestore
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
      // Crear el documento del usuario si no existe
        await userRef.set({
          uid: userId,
          email: request.auth.token.email || "",
          name: request.auth.token.name || "",
          createdAt: new Date(),
        });
        logger.info(`Documento de usuario creado para: ${userId}`);
      }

      // Obtener o crear un customer de Stripe
      let stripeCustomerId = userDoc.data()?.stripeCustomerId;

      if (!stripeCustomerId) {
        const logMsg = "Creando nuevo customer de Stripe para usuario: ";
        logger.info(`${logMsg}${userId}`);
        const customer = await stripe.customers.create({
          email: request.auth.token.email || "",
          name: request.auth.token.name || "",
          metadata: {
            firebaseUID: userId,
          },
        });

        stripeCustomerId = customer.id;

        // Guardar el ID del customer en Firestore
        await userRef.update({
          stripeCustomerId: stripeCustomerId,
        });

        logger.info(`Customer de Stripe creado: ${stripeCustomerId}`);
      }

      // Crear la sesión de Stripe Checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer: stripeCustomerId,
        client_reference_id: userId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          firebaseUID: userId,
        },
      });

      const successLog = "Sesión de checkout creada: ";
      logger.info(`${successLog}${session.id} para usuario: ${userId}`);

      return {
        sessionId: session.id,
      };
    } catch (error) {
      logger.error("Error al crear la sesión de Stripe Checkout:", error);
      throw new HttpsError(
        "internal",
        "Error interno al crear la sesión de pago. Inténtalo de nuevo."
      );
    }
  });

/**
 * Función Webhook para manejar eventos de Stripe
 * Stripe enviará eventos HTTP a esta función para notificar cambios
 */
export const stripeWebhook = onRequest(
  {
    cors: ["http://localhost:3000", "https://localhost:3000"],
  },
  async (request, response) => {
    const sig = request.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ||
                        functions.config().stripe?.webhook_secret;

    if (!webhookSecret) {
      logger.error("Stripe webhook secret is not configured");
      response.status(500).send("Webhook secret not configured");
      return;
    }

    let event: Stripe.Event;

    try {
    // Inicializar Stripe dentro de la función
      const stripe = getStripe();

      // Verificar la firma del webhook para asegurar que viene de Stripe
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        webhookSecret
      );

      logger.info(`Webhook recibido: ${event.type}`);
    } catch (err: unknown) {
      const error = err as Error;
      logger.error(`Error de verificación del webhook: ${error.message}`);
      response.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    // Manejar el evento específico
    try {
    // Inicializar Stripe para operaciones posteriores
      const stripe = getStripe();

      switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Obtener el UID del usuario desde client_reference_id
        const firebaseUID = session.client_reference_id;

        if (!firebaseUID) {
          logger.error("No se encontró client_reference_id en la sesión");
          response.status(400).send("Missing client_reference_id");
          return;
        }

        const processLog = "Procesando checkout completado para usuario: ";
        logger.info(`${processLog}${firebaseUID}`);

        // Obtener detalles de la suscripción
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId);

        // Obtener el price ID del primer item de la suscripción
        const priceId = subscription.items.data[0]?.price.id;

        // Actualizar el documento del usuario en Firestore
        const userRef = db.collection("users").doc(firebaseUID);
        await userRef.update({
          subscription: {
            status: subscription.status,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            priceId: priceId,
            planId: priceId,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000),
            updatedAt: new Date(),
          },
          stripeCustomerId: subscription.customer,
        });

        const updateLog = "Suscripción actualizada en Firestore para usuario: ";
        logger.info(`${updateLog}${firebaseUID}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Buscar el usuario por stripeCustomerId
        const usersQuery = await db
          .collection("users")
          .where("stripeCustomerId", "==", subscription.customer)
          .limit(1)
          .get();

        if (usersQuery.empty) {
          const errorMsg = "No se encontró usuario para customer: ";
          logger.error(`${errorMsg}${subscription.customer}`);
          response.status(404).send("User not found");
          return;
        }

        const userDoc = usersQuery.docs[0];
        const priceId = subscription.items.data[0]?.price.id;

        await userDoc.ref.update({
          subscription: {
            status: subscription.status,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            priceId: priceId,
            planId: priceId,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000),
            updatedAt: new Date(),
          },
        });

        const updateMsg = "Suscripción actualizada para customer: ";
        logger.info(`${updateMsg}${subscription.customer}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Buscar el usuario por stripeCustomerId
        const usersQuery = await db
          .collection("users")
          .where("stripeCustomerId", "==", subscription.customer)
          .limit(1)
          .get();

        if (usersQuery.empty) {
          const errorMsg = "No se encontró usuario para customer: ";
          logger.error(`${errorMsg}${subscription.customer}`);
          response.status(404).send("User not found");
          return;
        }

        const userDoc = usersQuery.docs[0];

        await userDoc.ref.update({
          subscription: {
            status: "canceled",
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            priceId: null,
            planId: "free",
            canceledAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const cancelMsg = "Suscripción cancelada para customer: ";
        logger.info(`${cancelMsg}${subscription.customer}`);
        break;
      }

      default:
        logger.info(`Evento no manejado: ${event.type}`);
      }

      // Responder a Stripe que el evento fue procesado correctamente
      response.status(200).send("OK");
    } catch (error) {
      logger.error(`Error procesando webhook: ${error}`);
      response.status(500).send("Internal Server Error");
    }
  });
