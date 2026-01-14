"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface DiagnosticData {
  clerk: {
    isLoaded: boolean;
    isSignedIn: boolean | null;
    userId: string | null;
    email: string | null;
    hasPublishableKey: boolean;
    publishableKeyPrefix: string | null;
    signInUrl: string | null;
    signUpUrl: string | null;
  };
  button: {
    isMounted: boolean;
    shouldShow: boolean;
    reason: string;
  };
  environment: {
    isProduction: boolean;
    hostname: string;
    protocol: string;
  };
  errors: string[];
}

export default function DiagnosticoPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const data: DiagnosticData = {
        clerk: {
          isLoaded,
          isSignedIn: isSignedIn ?? null,
          userId: user?.id ?? null,
          email: user?.primaryEmailAddress?.emailAddress ?? null,
          hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
          publishableKeyPrefix: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
            ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 8)
            : null,
          signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? null,
          signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? null,
        },
        button: {
          isMounted,
          shouldShow: isMounted && isLoaded && !isSignedIn,
          reason: !isMounted
            ? "Componente no montado aún"
            : !isLoaded
              ? "Clerk no está cargado (isLoaded = false)"
              : isSignedIn
                ? "Usuario está autenticado (debería mostrar botón PORTAL)"
                : "Debería aparecer el botón",
        },
        environment: {
          isProduction: process.env.NODE_ENV === "production",
          hostname: typeof window !== "undefined" ? window.location.hostname : "server",
          protocol: typeof window !== "undefined" ? window.location.protocol : "unknown",
        },
        errors: [],
      };

      // Verificar errores comunes
      if (!data.clerk.hasPublishableKey) {
        data.errors.push("❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY no está configurado");
      } else if (!data.clerk.publishableKeyPrefix?.startsWith("pk_")) {
        data.errors.push(`⚠️ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY parece inválido (debe empezar con pk_)`);
      }

      if (!data.clerk.signInUrl) {
        data.errors.push("⚠️ NEXT_PUBLIC_CLERK_SIGN_IN_URL no está configurado");
      } else if (data.clerk.signInUrl !== "/auth") {
        data.errors.push(`⚠️ NEXT_PUBLIC_CLERK_SIGN_IN_URL = "${data.clerk.signInUrl}" (debería ser "/auth")`);
      }

      if (!data.clerk.signUpUrl) {
        data.errors.push("⚠️ NEXT_PUBLIC_CLERK_SIGN_UP_URL no está configurado");
      } else if (data.clerk.signUpUrl !== "/auth?mode=signup") {
        data.errors.push(`⚠️ NEXT_PUBLIC_CLERK_SIGN_UP_URL = "${data.clerk.signUpUrl}" (debería ser "/auth?mode=signup")`);
      }

      if (!isLoaded && isMounted) {
        data.errors.push("❌ Clerk no está cargado (isLoaded = false) - Revisa la consola del navegador");
      }

      setDiagnosticData(data);
    }
  }, [isMounted, isLoaded, isSignedIn, user]);

  if (!diagnosticData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando diagnóstico...</div>
      </div>
    );
  }

  const getStatusIcon = (condition: boolean, warning?: boolean) => {
    if (warning) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return condition ? (
      <CheckCircle2 className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusColor = (condition: boolean, warning?: boolean) => {
    if (warning) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return condition ? "text-green-600 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔍 Diagnóstico de Clerk y Botón de Clientes</h1>
        <p className="text-gray-600">Información en tiempo real sobre el estado del sistema</p>
      </div>

      {/* Estado del Botón */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Estado del Botón "Acceso Clientes"
            {getStatusIcon(diagnosticData.button.shouldShow)}
          </CardTitle>
          <CardDescription>Por qué aparece o no aparece el botón</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border ${getStatusColor(diagnosticData.button.shouldShow)}`}>
            <div className="font-semibold mb-2">{diagnosticData.button.reason}</div>
            <div className="text-sm space-y-1 mt-3">
              <div>isMounted: <code className="bg-white/50 px-1 rounded">{String(diagnosticData.button.isMounted)}</code></div>
              <div>isLoaded: <code className="bg-white/50 px-1 rounded">{String(diagnosticData.clerk.isLoaded)}</code></div>
              <div>isSignedIn: <code className="bg-white/50 px-1 rounded">{String(diagnosticData.clerk.isSignedIn)}</code></div>
              <div>shouldShow: <code className="bg-white/50 px-1 rounded">{String(diagnosticData.button.shouldShow)}</code></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de Clerk */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Estado de Clerk
            {getStatusIcon(diagnosticData.clerk.isLoaded && diagnosticData.clerk.hasPublishableKey)}
          </CardTitle>
          <CardDescription>Estado de autenticación y configuración</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Clerk Cargado</div>
              <div className="flex items-center gap-2">
                {getStatusIcon(diagnosticData.clerk.isLoaded)}
                <span className="font-medium">{diagnosticData.clerk.isLoaded ? "✅ Sí" : "❌ No"}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Usuario Autenticado</div>
              <div className="flex items-center gap-2">
                {getStatusIcon(diagnosticData.clerk.isSignedIn === true)}
                <span className="font-medium">
                  {diagnosticData.clerk.isSignedIn === null ? "⏳ Cargando..." : diagnosticData.clerk.isSignedIn ? "✅ Sí" : "❌ No"}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">User ID</div>
              <div className="font-mono text-sm">
                {diagnosticData.clerk.userId ?? <span className="text-gray-400">No disponible</span>}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Email</div>
              <div className="font-mono text-sm">
                {diagnosticData.clerk.email ?? <span className="text-gray-400">No disponible</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Variables de Entorno */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Variables de Entorno (Públicas)
            {getStatusIcon(
              diagnosticData.clerk.hasPublishableKey && diagnosticData.clerk.signInUrl === "/auth" && diagnosticData.clerk.signUpUrl === "/auth?mode=signup",
              !diagnosticData.clerk.hasPublishableKey || diagnosticData.clerk.signInUrl !== "/auth" || diagnosticData.clerk.signUpUrl !== "/auth?mode=signup"
            )}
          </CardTitle>
          <CardDescription>Configuración de Clerk (valores sanitizados por seguridad)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm text-gray-500 mb-1">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</div>
            <div className="flex items-center gap-2">
              {getStatusIcon(diagnosticData.clerk.hasPublishableKey)}
              <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {diagnosticData.clerk.hasPublishableKey
                  ? `${diagnosticData.clerk.publishableKeyPrefix}... (${diagnosticData.clerk.publishableKeyPrefix?.startsWith("pk_live") ? "✅ Producción" : diagnosticData.clerk.publishableKeyPrefix?.startsWith("pk_test") ? "⚠️ Desarrollo" : "❓ Desconocido"})`
                  : "❌ No configurado"}
              </code>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">NEXT_PUBLIC_CLERK_SIGN_IN_URL</div>
            <div className="flex items-center gap-2">
              {getStatusIcon(diagnosticData.clerk.signInUrl === "/auth", diagnosticData.clerk.signInUrl !== "/auth")}
              <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {diagnosticData.clerk.signInUrl ?? "❌ No configurado"}
              </code>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">NEXT_PUBLIC_CLERK_SIGN_UP_URL</div>
            <div className="flex items-center gap-2">
              {getStatusIcon(diagnosticData.clerk.signUpUrl === "/auth?mode=signup", diagnosticData.clerk.signUpUrl !== "/auth?mode=signup")}
              <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {diagnosticData.clerk.signUpUrl ?? "❌ No configurado"}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errores y Advertencias */}
      {diagnosticData.errors.length > 0 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Errores y Advertencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {diagnosticData.errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span className="text-yellow-800">{error}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Información del Entorno */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Información del Entorno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Entorno</div>
              <div className="font-medium">
                {diagnosticData.environment.isProduction ? "🟢 Producción" : "🟡 Desarrollo"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Hostname</div>
              <div className="font-mono text-sm">{diagnosticData.environment.hostname}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Protocolo</div>
              <div className="font-mono text-sm">{diagnosticData.environment.protocol}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">URL Completa</div>
              <div className="font-mono text-sm break-all">
                {typeof window !== "undefined" ? window.location.href : "N/A"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            Instrucciones para Resolver Problemas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-3">
          <div>
            <div className="font-semibold mb-1">1. Si el botón NO aparece:</div>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>Verifica que Clerk esté cargado (isLoaded = true)</li>
              <li>Verifica que NO estés autenticado (isSignedIn = false)</li>
              <li>Revisa la consola del navegador (F12) para errores</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1">2. Si Clerk NO está cargado:</div>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>Verifica que NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY esté configurado en Vercel</li>
              <li>Verifica que las URLs de autenticación sean correctas</li>
              <li>Haz redeploy después de cambiar variables de entorno</li>
              <li>Haz hard refresh (Ctrl+Shift+R) en el navegador</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1">3. Si las variables están mal configuradas:</div>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>Ve a Vercel Dashboard → Tu proyecto → Settings → Environment Variables</li>
              <li>Verifica que NEXT_PUBLIC_CLERK_SIGN_IN_URL = "/auth"</li>
              <li>Verifica que NEXT_PUBLIC_CLERK_SIGN_UP_URL = "/auth?mode=signup"</li>
              <li>Haz redeploy después de corregir</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          🔄 Recargar Diagnóstico
        </Button>
        <Button onClick={() => window.location.href = "/"} variant="outline">
          🏠 Ir a Inicio
        </Button>
      </div>
    </div>
  );
}
