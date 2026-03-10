"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignTask(taskId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        throw new Error("Não autorizado");
    }

    // Verify task exists and belongs to user's company
    const task = await prisma.task.findUnique({
        where: { id: taskId, companyId: session.user.companyId as string }
    });

    if (!task) {
        throw new Error("Tarefa não encontrada");
    }

    if (task.assigneeId) {
        throw new Error("Esta tarefa já foi assumida por outro usuário.");
    }

    await prisma.task.update({
        where: { id: taskId },
        data: {
            assigneeId: session.user.id,
            status: "IN_PROGRESS"
        }
    });

    revalidatePath("/tasks");
    return { success: true };
}

export async function completeTask(taskId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        throw new Error("Não autorizado");
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId, companyId: session.user.companyId as string }
    });

    if (!task) {
        throw new Error("Tarefa não encontrada");
    }

    await prisma.task.update({
        where: { id: taskId },
        data: {
            status: "COMPLETED"
        }
    });

    revalidatePath("/tasks");
    return { success: true };
}

export async function getCompanyUsers() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.companyId) {
        return [];
    }

    const users = await prisma.user.findMany({
        where: { companyId: session.user.companyId as string },
        select: { id: true, name: true, role: true }
    });

    return users;
}

export async function createTask(data: any) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        throw new Error("Não autorizado");
    }

    const { title, description, priority, type, sectorId, assigneeId } = data;

    if (!title) {
        throw new Error("O título é obrigatório");
    }

    const isNominal = type === "nominal";

    const priorityMap: Record<string, string> = {
        low: "BAIXA",
        medium: "MEDIA",
        high: "ALTA",
        urgent: "URGENTE"
    };

    const taskData: any = {
        title,
        description: description || null,
        priority: priorityMap[priority] || "MEDIA",
        companyId: session.user.companyId as string,
    };

    if (isNominal) {
        taskData.assigneeId = assigneeId || session.user.id;
    } else {
        if (sectorId) {
            // For this prototype, we're not enforcing strict UUID sector matching right now
            // taskData.sectorId = sectorId;
        }
    }

    try {
        await prisma.task.create({
            data: taskData
        });
        revalidatePath("/tasks");
        return { success: true };
    } catch (e: any) {
        console.error("Task creation failed:", e);
        throw new Error("Falha ao criar tarefa no banco de dados.");
    }
}
