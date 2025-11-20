import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CompanyProfile {
  companyName: string;
  industry: string;
  companySize: string;
  position: string;
  phone?: string;
  interests?: string;
  completedAt: string;
}

export async function POST(request: Request) {
  try {
    // 1. Verificar autenticación
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 2. Parsear datos del formulario
    const body = await request.json();
    const { companyName, industry, companySize, position, phone, interests } =
      body;

    // 3. Validar campos requeridos
    if (!companyName || !industry || !companySize || !position) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // 4. Preparar perfil empresarial
    const companyProfile: CompanyProfile = {
      companyName: companyName.trim(),
      industry,
      companySize,
      position: position.trim(),
      phone: phone?.trim() || "",
      interests: interests?.trim() || "",
      completedAt: new Date().toISOString(),
    };

    // 5. Obtener cliente de Clerk
    const client = await clerkClient();

    // 6. Obtener metadata actual del usuario
    const user = await client.users.getUser(userId);
    const currentMetadata = user.publicMetadata || {};

    // 7. Actualizar publicMetadata con el perfil empresarial
    await client.users.updateUser(userId, {
      publicMetadata: {
        ...currentMetadata,
        companyProfile,
        onboardingCompleted: true,
      },
    });

    console.log("✅ [Profile API] Perfil empresarial guardado:", {
      userId,
      companyName,
      industry,
      companySize,
    });

    return NextResponse.json({
      success: true,
      message: "Perfil guardado exitosamente",
    });
  } catch (error) {
    console.error("❌ [Profile API] Error guardando perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Obtener perfil del usuario autenticado
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata || {};

    return NextResponse.json({
      companyProfile: metadata.companyProfile || null,
      onboardingCompleted: metadata.onboardingCompleted || false,
    });
  } catch (error) {
    console.error("❌ [Profile API] Error obteniendo perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
