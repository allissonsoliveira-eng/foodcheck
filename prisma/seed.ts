import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Clear existing
    await prisma.task.deleteMany()
    await prisma.sector.deleteMany()
    await prisma.user.deleteMany()
    await prisma.company.deleteMany()

    // Create Company A
    const companyA = await prisma.company.create({
        data: {
            name: 'Restaurante Gourmet (Gourmet Co.)',
        },
    })

    // Create Sectors for Company A
    const kitchenA = await prisma.sector.create({
        data: {
            name: 'Cozinha',
            companyId: companyA.id,
        },
    })

    const serviceA = await prisma.sector.create({
        data: {
            name: 'Atendimento',
            companyId: companyA.id,
        },
    })

    // Create Users for Company A
    const adminA = await prisma.user.create({
        data: {
            name: 'Admin Gourmet',
            email: 'admin@gourmet.com',
            password: 'password123',
            role: 'ADMIN',
            companyId: companyA.id,
        },
    })

    const managerA = await prisma.user.create({
        data: {
            name: 'Gerente João',
            email: 'joao@gourmet.com',
            password: 'password123',
            role: 'MANAGER',
            companyId: companyA.id,
            sectorId: serviceA.id,
        },
    })

    // Update leader
    await prisma.sector.update({
        where: { id: serviceA.id },
        data: { leaderId: managerA.id },
    })

    const employeeA = await prisma.user.create({
        data: {
            name: 'Cozinheiro Pedro',
            email: 'pedro@gourmet.com',
            password: 'password123',
            role: 'EMPLOYEE',
            companyId: companyA.id,
            sectorId: kitchenA.id,
        },
    })

    // Create Tasks for Company A
    await prisma.task.create({
        data: {
            title: 'Limpar Fogões',
            description: 'Limpeza diária e profunda dos fogões industriais',
            status: 'PENDING',
            companyId: companyA.id,
            sectorId: kitchenA.id, // For the kitchen sector (anyone in kitchen)
        },
    })

    await prisma.task.create({
        data: {
            title: 'Verificar Validade Frios',
            description: 'Checar validade dos frios na câmara refrigerada',
            status: 'PENDING',
            companyId: companyA.id,
            sectorId: kitchenA.id,
            assigneeId: employeeA.id, // Explicitly for Pedro
        },
    })

    // Create Company B (To ensure Tenant isolation works later)
    const companyB = await prisma.company.create({
        data: {
            name: 'Burger Fast Ltda',
        },
    })

    await prisma.user.create({
        data: {
            name: 'Admin Burger',
            email: 'admin@burger.com',
            password: 'password123',
            role: 'ADMIN',
            companyId: companyB.id,
        },
    })

    // Create Superadmin User (No company linked)
    await prisma.user.create({
        data: {
            name: 'Super Admin Geral',
            email: 'superadmin@checklist.com',
            password: 'password123',
            role: 'SUPERADMIN',
            companyId: null, // Critical: this is null for the SaaS owner
        },
    })

    console.log('Seeding finished successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
