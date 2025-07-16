# Guía Completa para la Integración de Stripe y Firebase

Este documento contiene todos los pasos y el código necesarios para configurar un sistema de suscripciones con Stripe en tu proyecto de Firebase. Sigue estas instrucciones para completar el proceso.

## Fase 1: Configuración de Requisitos Previos

Antes de escribir código, necesitas obtener algunas claves e identificadores de tu cuenta de Stripe.

### 1. Obtén tus Claves de API de Stripe
-   Ve a tu [Dashboard de Stripe > Desarrolladores > Claves de API](https://dashboard.stripe.com/apikeys).
-   Necesitarás dos claves:
    -   **Clave publicable:** (p. ej., `pk_test_...`) Se usa en el frontend.
    -   **Clave secreta:** (p. ej., `sk_test_...`) Se usa en el backend (Cloud Functions). **¡Nunca expongas esta clave en el lado del cliente!**

### 2. Crea tus Productos y Precios en Stripe
-   Ve a tu [Dashboard de Stripe > Productos](https://dashboard.stripe.com/products).
-   Crea un producto (p. ej., "Suscripción Premium").
-   Añádele uno o más precios (p. ej., un plan mensual y uno anual).
-   Para cada precio, anota su **ID de Precio** (p. ej., `price_1P...`). Lo necesitarás en tu frontend para saber qué producto está comprando el usuario.

## Fase 2: Configuración del Backend (Cloud Functions)

El backend se encargará de la comunicación segura con Stripe.

### 1. Prepara tu Entorno de Firebase Functions
-   Navega a la carpeta de functions en tu terminal:
    ```bash
    cd functions
    ```
-   Instala las dependencias necesarias:
    ```bash
    npm install stripe firebase-admin@latest --save
    ```

### 2. Guarda tus Claves Secretas de Forma Segura
-   Usa el CLI de Firebase para configurar las claves como variables de entorno. Esto es mucho más seguro que escribirlas directamente en el código.
    ```bash
    firebase functions:config:set stripe.secret="sk_test_TU_CLAVE_SECRETA_AQUI"
    firebase functions:config:set stripe.webhook_secret="whsec_TU_SECRET_DE_WEBHOOK_AQUI"
    ```
    *(Obtendrás el `webhook_secret` en el siguiente paso).*

### 3. Crea las Cloud Functions
-   Abre el archivo principal de tus functions (normalmente `functions/src/index.ts`).
-   Añade el siguiente código. Contiene las dos funciones necesarias: una para crear la sesión de pago y otra para escuchar los eventos de Stripe.

```typescript
// functions/src/index.ts

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";

// Inicializar Firebase Admin SDK y Firestore
initializeApp();
const db = getFirestore();

// Inicializar Stripe con la clave secreta de la configuración de Firebase
const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

/**
 * Función Callable para crear una sesión de Stripe Checkout.
 * Se invoca desde el frontend cuando un usuario quiere suscribirse.
 */
export const createStripeCheckoutSession = onCall(async (request) => {
  // 1. Autenticar al usuario
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes estar autenticado para realizar esta acción.");
  }
  const userId = request.auth.uid;
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError("not-found", "No se encontró el documento del usuario.");
  }

  const { priceId, success_url, cancel_url } = request.data;
  if (!priceId || !success_url || !cancel_url) {
      throw new HttpsError("invalid-argument", "Faltan parámetros requeridos: priceId, success_url, cancel_url.");
  }

  try {
    // 2. Obtener o crear un cliente de Stripe
    let stripeCustomerId = userDoc.data()?.stripeCustomerId;
    if (!stripeCustomerId) {
      logger.info(`Creando nuevo cliente de Stripe para el usuario ${userId}`);
      const customer = await stripe.customers.create({
        email: request.auth.token.email,
        name: request.auth.token.name,
        metadata: { firebaseUID: userId },
      });
      stripeCustomerId = customer.id;
      await userRef.update({ stripeCustomerId: stripeCustomerId });
    }

    // 3. Crear una sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success_url,
      cancel_url: cancel_url,
    });

    // 4. Devolver el ID de la sesión al cliente
    return { sessionId: session.id };

  } catch (error) {
    logger.error("La creación de la sesión de Stripe Checkout falló:", error);
    throw new HttpsError("internal", "Ocurrió un error al crear la sesión de pago.");
  }
});

/**
 * Función HTTPS para manejar los webhooks de Stripe.
 * Stripe enviará eventos a esta URL para notificar cambios en las suscripciones.
 */
export const handleStripeWebhook = onRequest(async (request, response) => {
  const sig = request.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    // 1. Verificar la firma del webhook para asegurar que la petición viene de Stripe
    event = stripe.webhooks.constructEvent(request.rawBody, sig, webhookSecret);
  } catch (err: any) {
    logger.error("❌ Verificación de la firma del webhook fallida.", err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Función para encontrar un usuario por su stripeCustomerId
  const findUserByStripeCustomerId = async (customerId: string) => {
    const usersQuery = db.collection("users").where("stripeCustomerId", "==", customerId);
    const userSnapshot = await usersQuery.get();
    if (userSnapshot.empty) return null;
    return userSnapshot.docs[0];
  };
  
  // Función para actualizar los datos de la suscripción en Firestore
  const updateSubscription = async (customerId: string, subscription: Stripe.Subscription) => {
      const userDoc = await findUserByStripeCustomerId(customerId);
      if (!userDoc) {
          logger.error(`No se pudo encontrar al usuario con stripeCustomerId ${customerId}`);
          return;
      }
      
      const subscriptionData = {
          stripeSubscriptionId: subscription.id,
          planId: subscription.items.data[0].price.id, // ID del precio (price_1P...)
          status: subscription.status,
          endDate: new Date(subscription.current_period_end * 1000), // Fecha de fin del período actual
      };

      await userDoc.ref.update({ subscription: subscriptionData });
      logger.info(`✅ Suscripción actualizada para el usuario ${userDoc.id}:`, subscriptionData);
  }

  try {
    // 2. Manejar el evento recibido
    const data = event.data.object as any;
    switch (event.type) {
        case "checkout.session.completed":
            const subscriptionOnCheckout = await stripe.subscriptions.retrieve(data.subscription);
            await updateSubscription(data.customer, subscriptionOnCheckout);
            break;

        case "customer.subscription.updated":
        case "customer.subscription.deleted":
            await updateSubscription(data.customer, data as Stripe.Subscription);
            break;

        default:
            logger.info(`Evento de webhook no manejado: ${event.type}`);
    }

    // 3. Confirmar a Stripe que el evento fue recibido correctamente
    response.status(200).send({ received: true });

  } catch (error) {
      logger.error("❌ Error procesando el webhook:", error);
      response.status(500).send("Internal Server Error");
  }
});

```

### 4. Desplegar las Funciones
-   Desde la carpeta raíz de tu proyecto Firebase, ejecuta:
    ```bash
    firebase deploy --only functions
    ```
-   Una vez finalizado, la consola te dará la URL pública de la función `handleStripeWebhook`. Cópiala.

## Fase 3: Configuración del Webhook en Stripe

Ahora tienes que decirle a Stripe que envíe los eventos a la URL de tu función.

1.  **Ve a tu [Dashboard de Stripe > Desarrolladores > Webhooks](https://dashboard.stripe.com/webhooks).**
2.  Haz clic en **"Añadir un punto de conexión"**.
3.  **URL del punto de conexión:** Pega la URL de tu función `handleStripeWebhook` que copiaste en el paso anterior.
4.  **Eventos para escuchar:** Haz clic en "Seleccionar eventos" y añade los siguientes:
    -   `checkout.session.completed`
    -   `customer.subscription.updated`
    -   `customer.subscription.deleted`
5.  **Añade el punto de conexión.**
6.  Una vez creado, haz clic en el webhook que acabas de crear y busca el **"Secreto de firma"** (empieza por `whsec_...`).
7.  **¡IMPORTANTE!** Vuelve a tu terminal y ejecuta el comando de la Fase 2 para guardar este secreto:
    ```bash
    firebase functions:config:set stripe.webhook_secret="whsec_TU_SECRETO_DE_FIRMA_AQUI"
    ```
8.  **Vuelve a desplegar las funciones** para que tomen el nuevo valor de configuración:
    ```bash
    firebase deploy --only functions
    ```

---

¡Listo! Con esto, tu backend está 100% configurado para gestionar suscripciones. El siguiente paso será integrar el frontend para llamar a `createStripeCheckoutSession` cuando un usuario haga clic en un botón de "Suscribirse". 