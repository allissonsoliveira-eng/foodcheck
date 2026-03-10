const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'superadmin@checklist.com' },
    });
    console.log("Superadmin Check:", user);

    const allAdmins = await prisma.user.findMany({
        where: { role: 'SUPERADMIN' }
    });
    console.log("All Superadmins:", allAdmins);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    });
