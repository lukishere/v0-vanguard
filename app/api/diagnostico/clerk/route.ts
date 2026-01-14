import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const secretKey = process.env.CLERK_SECRET_KEY;
    const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
    const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL;
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    const errors: string[] = [];
    const warnings: string[] = [];

    // Verificar variables críticas
    if (!publishableKey) {
      errors.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY no está configurado");
    } else if (!publishableKey.startsWith("pk_")) {
      errors.push(`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY parece inválido (debe empezar con pk_)`);
    } else if (publishableKey.startsWith("pk_test_")) {
      warnings.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY es de desarrollo (pk_test_) - usar pk_live_ en producción");
    }

    if (!secretKey) {
      errors.push("CLERK_SECRET_KEY no está configurado");
    } else if (!secretKey.startsWith("sk_")) {
      errors.push(`CLERK_SECRET_KEY parece inválido (debe empezar con sk_)`);
    } else if (secretKey.startsWith("sk_test_")) {
      warnings.push("CLERK_SECRET_KEY es de desarrollo (sk_test_) - usar sk_live_ en producción");
    }

    if (!signInUrl) {
      warnings.push("NEXT_PUBLIC_CLERK_SIGN_IN_URL no está configurado");
    } else if (signInUrl !== "/auth") {
      warnings.push(`NEXT_PUBLIC_CLERK_SIGN_IN_URL = "${signInUrl}" (debería ser "/auth")`);
    }

    if (!signUpUrl) {
      warnings.push("NEXT_PUBLIC_CLERK_SIGN_UP_URL no está configurado");
    } else if (signUpUrl !== "/auth?mode=signup") {
      warnings.push(`NEXT_PUBLIC_CLERK_SIGN_UP_URL = "${signUpUrl}" (debería ser "/auth?mode=signup")`);
    }

    if (!webhookSecret) {
      warnings.push("CLERK_WEBHOOK_SECRET no está configurado (webhooks pueden no funcionar)");
    }

    const data = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      variables: {
        hasPublishableKey: !!publishableKey,
        publishableKeyPrefix: publishableKey ? publishableKey.substring(0, 12) + "..." : null,
        publishableKeyType: publishableKey?.startsWith("pk_live_") ? "production" : publishableKey?.startsWith("pk_test_") ? "development" : "unknown",
        hasSecretKey: !!secretKey,
        secretKeyPrefix: secretKey ? secretKey.substring(0, 12) + "..." : null,
        secretKeyType: secretKey?.startsWith("sk_live_") ? "production" : secretKey?.startsWith("sk_test_") ? "development" : "unknown",
        signInUrl: signInUrl ?? null,
        signUpUrl: signUpUrl ?? null,
        hasWebhookSecret: !!webhookSecret,
      },
      errors,
      warnings,
      status: errors.length > 0 ? "ERROR" : warnings.length > 0 ? "WARNING" : "OK",
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [Diagnóstico Clerk] Error:", error);
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Error al obtener diagnóstico",
        message: error instanceof Error ? error.message : String(error),
        status: "ERROR",
      },
      { status: 500 }
    );
  }
}
