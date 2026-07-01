import { prisma } from '../lib/prisma';

export const rankingService = {
  async getGlobal(limit: number = 50) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        balance: true,
        profit: true,
        roi: true,
        betsCount: true,
        betsWon: true,
      },
      orderBy: { balance: 'desc' },
      take: limit,
    });
    return users.map((u) => ({
      ...u,
      balance: Number(u.balance),
      profit: Number(u.profit),
      roi: Number(u.roi),
    }));
  },

  async getGroup(groupId: string, userId: string) {
    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!membership) throw new Error('Not a member of this group');

    const members = await prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            balance: true,
            profit: true,
            roi: true,
            betsCount: true,
            betsWon: true,
          },
        },
      },
    });

    return members
      .map((m) => ({
        ...m.user,
        balance: Number(m.user.balance),
        profit: Number(m.user.profit),
        roi: Number(m.user.roi),
      }))
      .sort((a, b) => b.balance - a.balance);
  },
};
