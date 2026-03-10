import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const body = await req.json();
        const { companyName, adminName, adminEmail, adminPassword } = body;

        if (!companyName || !adminName || !adminEmail || !adminPassword) {
            return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
        }

        // Check if email already exists anywhere in the platform
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Este e-mail já está sendo utilizado no sistema." }, { status: 409 });
        }

        // Use a transaction to ensure both company and user are created, or neither is
        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: { name: companyName }
            });

            const admin = await tx.user.create({
                data: {
                    name: adminName,
                    email: adminEmail,
                    password: adminPassword, // Note: Should be hashed in a production app
                    role: "ADMIN",
                    companyId: company.id
                }
            });

            return { company, admin };
        });

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error: any) {
        console.error("Superadmin company creation error:", error);
        return NextResponse.json(
            { error: "Erro interno no servidor ao tentar criar a empresa." },
            { status: 500 }
        );
    }
}
