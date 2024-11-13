import { PrismaClient } from "@prisma/client";
import { addDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  // Cria 30 usuários com e-mails únicos
  const users = await Promise.all(
    Array.from({ length: 30 }, (_, i) =>
      prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`, // Assegura que cada e-mail é único
          password: "password123",
        },
      })
    )
  );

  // Cria 5 profissionais associados aos primeiros usuários criados
  const professionals = await Promise.all(
    users.slice(0, 5).map((user, i) =>
      prisma.professional.create({
        data: {
          userId: user.id,
          specialty: `Specialty ${i + 1}`,
          photo: 'https://placehold.co/400x400/png'
        },
      })
    )
  );

  // Cria 30 serviços
  const services = await Promise.all(
    Array.from({ length: 30 }, (_, i) =>
      prisma.service.create({
        data: {
          name: `Service ${i + 1}`,
          description: `Description for service ${i + 1}`,
          price: (i + 1) * 50,
          duration: (i + 1) * 15,
        },
      })
    )
  );

  // Relaciona profissionais com alguns dos serviços
  const professionalServices = await Promise.all(
    professionals.flatMap((professional, i) =>
      services.slice(i * 2, i * 2 + 2).map((service) =>
        prisma.professionalService.create({
          data: {
            professionalId: professional.id,
            serviceId: service.id,
          },
        })
      )
    )
  );

  // Cria 5 clientes usando os usuários restantes
  const clients = await Promise.all(
    users.slice(5).map((user, i) =>
      prisma.client.create({
        data: {
          userId: user.id,
          phone: `12345678${i}`,
          birthDate: new Date(`1997-01-01`),
          gender: i % 2 === 0 ? "F" : "M",
          photo: 'https://placehold.co/400x400/png'
        },
      })
    )
  );

  // Cria alguns agendamentos para os clientes
  await Promise.all(
    clients.map((client, i) =>
      prisma.appointment.create({
        data: {
          clientId: client.id,
          professionalServiceId: professionalServices[i % professionalServices.length].id,
          dateTime: addDays(new Date(), i + 1),
          observation: `Appointment ${i + 1}`,
          status: i % 2 === 0 ? "confirmed" : "pending",
        },
      })
    )
  );

  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
