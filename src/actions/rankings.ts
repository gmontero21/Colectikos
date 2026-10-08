"use server";

import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

export type UserRankingEntry = {
  id: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  currentStreak: number;
  score: number; // XP or count of postales
  rank?: number;
};

export async function getGlobalXPRanking(currentUserId?: string): Promise<{ top10: UserRankingEntry[], currentUserRank: UserRankingEntry | null }> {
  const topUsers = await prisma.user.findMany({
    orderBy: { xp: 'desc' },
    take: 10,
    select: { id: true, username: true, avatarUrl: true, level: true, currentStreak: true, xp: true }
  });

  const top10: UserRankingEntry[] = topUsers.map((u, i) => ({
    id: u.id,
    username: u.username,
    avatarUrl: u.avatarUrl,
    level: u.level,
    currentStreak: u.currentStreak,
    score: u.xp,
    rank: i + 1
  }));

  let currentUserRank: UserRankingEntry | null = null;
  if (currentUserId) {
    const user = await prisma.user.findUnique({ where: { id: currentUserId } });
    if (user) {
      const usersAhead = await prisma.user.count({
        where: { xp: { gt: user.xp } }
      });
      currentUserRank = {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        level: user.level,
        currentStreak: user.currentStreak,
        score: user.xp,
        rank: usersAhead + 1
      };
    }
  }

  return { top10, currentUserRank };
}

export async function getPostalesRanking(currentUserId?: string, province?: string, category?: string): Promise<{ top10: UserRankingEntry[], currentUserRank: UserRankingEntry | null }> {
  const conditions: Prisma.Sql[] = [Prisma.sql`p.completado = true`];
  
  if (province && province !== 'Todas') {
    conditions.push(Prisma.sql`l."ubicacion" ILIKE ${'%' + province + '%'}`);
  }
  if (category && category !== 'Todas') {
    conditions.push(Prisma.sql`l."categoria"::text = ${category}`);
  }

  const whereClause = Prisma.join(conditions, ' AND ');

  const topUsers = await prisma.$queryRaw<any[]>`
    SELECT u.id, u.username, u."avatarUrl", u.level, u."currentStreak", COUNT(p.id)::int as score
    FROM "User" u
    JOIN "UserProgress" p ON u.id = p."userId"
    JOIN "Lugar" l ON p."lugarId" = l.id
    WHERE ${whereClause}
    GROUP BY u.id
    ORDER BY score DESC, u.xp DESC
    LIMIT 10
  `;

  const top10: UserRankingEntry[] = topUsers.map((u, i) => ({
    id: u.id,
    username: u.username,
    avatarUrl: u.avatarUrl,
    level: u.level,
    currentStreak: u.currentStreak,
    score: Number(u.score),
    rank: i + 1
  }));

  let currentUserRank: UserRankingEntry | null = null;
  if (currentUserId) {
    // Get the current user's score
    const userScoreRes = await prisma.$queryRaw<any[]>`
      SELECT COUNT(p.id)::int as score
      FROM "UserProgress" p
      JOIN "Lugar" l ON p."lugarId" = l.id
      WHERE p."userId" = ${currentUserId} AND ${whereClause}
    `;
    const userScore = userScoreRes.length > 0 ? Number(userScoreRes[0].score) : 0;

    const user = await prisma.user.findUnique({ where: { id: currentUserId } });
    
    if (user && userScore > 0) {
      // Find how many users have a strictly higher score, OR same score but higher XP
      const usersAheadRes = await prisma.$queryRaw<any[]>`
        WITH user_scores AS (
          SELECT u.id, u.xp, COUNT(p.id)::int as score
          FROM "User" u
          JOIN "UserProgress" p ON u.id = p."userId"
          JOIN "Lugar" l ON p."lugarId" = l.id
          WHERE ${whereClause}
          GROUP BY u.id, u.xp
        )
        SELECT COUNT(*)::int as ahead
        FROM user_scores
        WHERE score > ${userScore} OR (score = ${userScore} AND xp > ${user.xp})
      `;
      const usersAhead = usersAheadRes.length > 0 ? Number(usersAheadRes[0].ahead) : 0;

      currentUserRank = {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        level: user.level,
        currentStreak: user.currentStreak,
        score: userScore,
        rank: usersAhead + 1
      };
    } else if (user) {
      // User hasn't unlocked any postcards matching the filter
      currentUserRank = {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        level: user.level,
        currentStreak: user.currentStreak,
        score: 0,
        rank: 0 // Special flag for empty state
      };
    }
  }

  return { top10, currentUserRank };
}

export async function getStreakRanking(currentUserId?: string): Promise<{ top10: UserRankingEntry[], currentUserRank: UserRankingEntry | null }> {
  const topUsers = await prisma.user.findMany({
    orderBy: [{ currentStreak: 'desc' }, { xp: 'desc' }],
    take: 10,
    select: { id: true, username: true, avatarUrl: true, level: true, currentStreak: true, xp: true }
  });

  const top10: UserRankingEntry[] = topUsers.map((u, i) => ({
    id: u.id,
    username: u.username,
    avatarUrl: u.avatarUrl,
    level: u.level,
    currentStreak: u.currentStreak,
    score: u.currentStreak, // Score is the streak
    rank: i + 1
  }));

  let currentUserRank: UserRankingEntry | null = null;
  if (currentUserId) {
    const user = await prisma.user.findUnique({ where: { id: currentUserId } });
    if (user) {
      const usersAhead = await prisma.user.count({
        where: { 
          OR: [
            { currentStreak: { gt: user.currentStreak } },
            { currentStreak: user.currentStreak, xp: { gt: user.xp } }
          ]
        }
      });
      currentUserRank = {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        level: user.level,
        currentStreak: user.currentStreak,
        score: user.currentStreak,
        rank: usersAhead + 1
      };
    }
  }

  return { top10, currentUserRank };
}
