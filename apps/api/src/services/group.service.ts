import crypto from 'crypto';
import { prisma } from '../lib/prisma';

async function generateUniqueCode(): Promise<string> {
  let code: string;
  let exists = true;
  while (exists) {
    code = crypto.randomBytes(4).toString('hex').toUpperCase();
    const existing = await prisma.group.findUnique({ where: { inviteCode: code } });
    exists = !!existing;
  }
  return code!;
}

function mapMemberBalance<T extends { balance: unknown; profit?: unknown; roi?: unknown }>(m: T) {
  return { ...m, balance: Number(m.balance), ...(m.profit !== undefined ? { profit: Number(m.profit) } : {}), ...(m.roi !== undefined ? { roi: Number(m.roi) } : {}) };
}

export const groupService = {
  async create(adminId: string, name: string) {
    const inviteCode = await generateUniqueCode();
    const group = await prisma.group.create({
      data: {
        name,
        inviteCode,
        adminId,
        members: {
          create: { userId: adminId },
        },
      },
      include: { members: { include: { user: { select: { id: true, name: true, balance: true } } } } },
    });
    return {
      ...group,
      members: group.members.map((m) => ({
        ...m,
        user: mapMemberBalance(m.user),
      })),
    };
  },

  async join(userId: string, inviteCode: string) {
    const group = await prisma.group.findUnique({
      where: { inviteCode },
      include: { members: true },
    });
    if (!group) throw new Error('Invalid invite code');

    const alreadyMember = group.members.some((m) => m.userId === userId);
    if (alreadyMember) throw new Error('Already a member');

    if (group.members.length >= 50) throw new Error('Group is full (max 50 members)');

    await prisma.groupMember.create({
      data: { groupId: group.id, userId },
    });

    const updated = await prisma.group.findUnique({
      where: { id: group.id },
      include: {
        _count: { select: { members: true } },
        members: { include: { user: { select: { id: true, name: true, balance: true } } } },
      },
    });
    if (!updated) throw new Error('Group not found');
    return {
      ...updated,
      members: updated.members.map((m) => ({
        ...m,
        user: mapMemberBalance(m.user),
      })),
    };
  },

  async listByUser(userId: string) {
    const memberships = await prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            _count: { select: { members: true } },
          },
        },
      },
    });
    return memberships.map((m) => ({ ...m.group, memberCount: m.group._count.members }));
  },

  async getById(groupId: string, userId: string) {
    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!membership) throw new Error('Not a member of this group');

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        admin: { select: { id: true, name: true } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, balance: true, profit: true, roi: true },
            },
          },
          orderBy: { user: { balance: 'desc' } },
        },
      },
    });
    if (!group) throw new Error('Group not found');
    return {
      ...group,
      members: group.members.map((m) => ({
        ...m,
        user: mapMemberBalance(m.user),
      })),
    };
  },

  async delete(groupId: string, userId: string) {
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new Error('Group not found');
    if (group.adminId !== userId) throw new Error('Only admin can delete');

    await prisma.group.delete({ where: { id: groupId } });
  },
};
