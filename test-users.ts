import prisma from './src/lib/prisma';

async function test() {
  const users = await prisma.user.findMany({
    include: {
      progress: true
    }
  });
  console.log(`Total users: ${users.length}`);
  
  const usersWithProgress = users.filter(u => u.progress.length > 0);
  const usersWithoutProgress = users.filter(u => u.progress.length === 0);
  
  console.log(`Users with progress: ${usersWithProgress.length}`);
  console.log(`Users without progress: ${usersWithoutProgress.length}`);

  // check if any user is a guest (UUID id and no email)
  const guestUsers = users.filter(u => !u.email && u.id.length === 36);
  console.log(`Guest users (UUID id, no email): ${guestUsers.length}`);

  // check if there are users with clerkId and 0 progress
  const clerkUsersWithoutProgress = usersWithoutProgress.filter(u => u.id.startsWith('user_'));
  console.log(`Clerk users with 0 progress: ${clerkUsersWithoutProgress.length}`);
}

test().finally(() => prisma.$disconnect());
